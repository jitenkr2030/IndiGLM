"""
IndiGLM Functions Module
========================

Advanced function calling and tool use capabilities.
Based on Z.ai-style function calling with Indian context.
"""

import os
import json
import time
import asyncio
import inspect
from typing import Dict, List, Optional, Any, Union, Callable, Type, get_type_hints
from dataclasses import dataclass, asdict, field
from enum import Enum
from datetime import datetime
import re

from .enhanced_core import FunctionDefinition, FunctionParameter, FunctionCall, FunctionResult
from .image_generation import ImageGenerator, ImageGenerationRequest
from .web_search import WebSearchEngine, WebSearchRequest


class FunctionCategory(Enum):
    """Categories of functions."""
    WEB_SEARCH = "web_search"
    IMAGE_GENERATION = "image_generation"
    CALCULATOR = "calculator"
    WEATHER = "weather"
    NEWS = "news"
    STOCKS = "stocks"
    CURRENCY = "currency"
    TIME_DATE = "time_date"
    INDIAN_CULTURE = "indian_culture"
    INDIAN_BUSINESS = "indian_business"
    INDIAN_GOVERNMENT = "indian_government"
    INDIAN_EDUCATION = "indian_education"
    CUSTOM = "custom"


class ParameterType(Enum):
    """Parameter types for function validation."""
    STRING = "string"
    INTEGER = "integer"
    NUMBER = "number"
    BOOLEAN = "boolean"
    ARRAY = "array"
    OBJECT = "object"
    NULL = "null"


@dataclass
class Tool:
    """A tool that can be used by the AI."""
    name: str
    description: str
    function_definition: FunctionDefinition
    category: FunctionCategory
    enabled: bool = True
    rate_limit: Optional[int] = None  # calls per minute
    last_used: Optional[datetime] = None
    usage_count: int = 0


@dataclass
class ToolRegistry:
    """Registry for managing available tools."""
    tools: Dict[str, Tool] = field(default_factory=dict)
    categories: Dict[FunctionCategory, List[str]] = field(default_factory=dict)
    
    def __post_init__(self):
        """Initialize categories."""
        for category in FunctionCategory:
            self.categories[category] = []
    
    def register_tool(self, tool: Tool):
        """Register a new tool."""
        self.tools[tool.name] = tool
        if tool.category not in self.categories:
            self.categories[tool.category] = []
        self.categories[tool.category].append(tool.name)
    
    def unregister_tool(self, name: str):
        """Unregister a tool."""
        if name in self.tools:
            tool = self.tools[name]
            self.categories[tool.category].remove(name)
            del self.tools[name]
    
    def get_tool(self, name: str) -> Optional[Tool]:
        """Get a tool by name."""
        return self.tools.get(name)
    
    def get_tools_by_category(self, category: FunctionCategory) -> List[Tool]:
        """Get all tools in a category."""
        return [self.tools[name] for name in self.categories.get(category, [])]
    
    def get_all_tools(self) -> List[Tool]:
        """Get all registered tools."""
        return list(self.tools.values())
    
    def get_enabled_tools(self) -> List[Tool]:
        """Get all enabled tools."""
        return [tool for tool in self.tools.values() if tool.enabled]
    
    def enable_tool(self, name: str):
        """Enable a tool."""
        if name in self.tools:
            self.tools[name].enabled = True
    
    def disable_tool(self, name: str):
        """Disable a tool."""
        if name in self.tools:
            self.tools[name].enabled = False
    
    def check_rate_limit(self, name: str) -> bool:
        """Check if tool is within rate limit."""
        tool = self.tools.get(name)
        if not tool or not tool.rate_limit:
            return True
        
        if tool.last_used is None:
            return True
        
        time_diff = (datetime.now() - tool.last_used).total_seconds()
        return time_diff >= 60 / tool.rate_limit
    
    def update_usage(self, name: str):
        """Update tool usage statistics."""
        if name in self.tools:
            tool = self.tools[name]
            tool.last_used = datetime.now()
            tool.usage_count += 1


class FunctionExecutor:
    """Executes function calls with proper error handling and rate limiting."""
    
    def __init__(self, tool_registry: ToolRegistry, api_key: Optional[str] = None):
        """Initialize the function executor."""
        self.tool_registry = tool_registry
        self.api_key = api_key or os.getenv("INDIGLM_API_KEY")
        self.image_generator = ImageGenerator(api_key) if api_key else None
        self.web_search_engine = WebSearchEngine(api_key) if api_key else None
        
        # Initialize built-in functions
        self._initialize_builtin_functions()
    
    def _initialize_builtin_functions(self):
        """Initialize built-in functions."""
        # Web search function
        self.register_function(
            name="web_search",
            description="Search the web for current information",
            category=FunctionCategory.WEB_SEARCH,
            parameters=[
                FunctionParameter("query", "string", "Search query", True),
                FunctionParameter("num", "integer", "Number of results", False, 10),
                FunctionParameter("region", "string", "Search region", False, "in"),
                FunctionParameter("indian_focus", "boolean", "Focus on Indian content", False, True)
            ],
            handler=self._handle_web_search
        )
        
        # Image generation function
        self.register_function(
            name="generate_image",
            description="Generate images based on text description",
            category=FunctionCategory.IMAGE_GENERATION,
            parameters=[
                FunctionParameter("prompt", "string", "Image description", True),
                FunctionParameter("size", "string", "Image size", False, "1024x1024"),
                FunctionParameter("style", "string", "Image style", False, "vivid"),
                FunctionParameter("indian_theme", "boolean", "Apply Indian theme", False, True)
            ],
            handler=self._handle_image_generation
        )
        
        # Calculator function
        self.register_function(
            name="calculator",
            description="Perform mathematical calculations",
            category=FunctionCategory.CALCULATOR,
            parameters=[
                FunctionParameter("expression", "string", "Mathematical expression", True)
            ],
            handler=self._handle_calculator
        )
        
        # Weather function
        self.register_function(
            name="get_weather",
            description="Get current weather information",
            category=FunctionCategory.WEATHER,
            parameters=[
                FunctionParameter("location", "string", "Location name", True),
                FunctionParameter("units", "string", "Temperature units", False, "celsius", ["celsius", "fahrenheit"])
            ],
            handler=self._handle_weather
        )
        
        # News search function
        self.register_function(
            name="search_news",
            description="Search for news articles",
            category=FunctionCategory.NEWS,
            parameters=[
                FunctionParameter("query", "string", "News search query", True),
                FunctionParameter("num", "integer", "Number of articles", False, 5),
                FunctionParameter("region", "string", "News region", False, "in")
            ],
            handler=self._handle_news_search
        )
        
        # Currency conversion function
        self.register_function(
            name="convert_currency",
            description="Convert between currencies",
            category=FunctionCategory.CURRENCY,
            parameters=[
                FunctionParameter("amount", "number", "Amount to convert", True),
                FunctionParameter("from_currency", "string", "Source currency code", True),
                FunctionParameter("to_currency", "string", "Target currency code", True)
            ],
            handler=self._handle_currency_conversion
        )
        
        # Indian festivals function
        self.register_function(
            name="get_indian_festivals",
            description="Get information about Indian festivals",
            category=FunctionCategory.INDIAN_CULTURE,
            parameters=[
                FunctionParameter("month", "string", "Month name", False),
                FunctionParameter("region", "string", "Indian region", False)
            ],
            handler=self._handle_indian_festivals
        )
        
        # Indian government schemes function
        self.register_function(
            name="get_government_schemes",
            description="Get information about Indian government schemes",
            category=FunctionCategory.INDIAN_GOVERNMENT,
            parameters=[
                FunctionParameter("category", "string", "Scheme category", False),
                FunctionParameter("state", "string", "Indian state", False)
            ],
            handler=self._handle_government_schemes
        )
        
        # Time and date function
        self.register_function(
            name="get_current_time",
            description="Get current time and date",
            category=FunctionCategory.TIME_DATE,
            parameters=[
                FunctionParameter("timezone", "string", "Timezone", False, "IST"),
                FunctionParameter("format", "string", "Output format", False, "iso")
            ],
            handler=self._handle_current_time
        )
    
    def register_function(self, name: str, description: str, category: FunctionCategory,
                         parameters: List[FunctionParameter], handler: Callable,
                         rate_limit: Optional[int] = None):
        """Register a custom function."""
        function_def = FunctionDefinition(
            name=name,
            description=description,
            parameters=parameters,
            function_type=category,
            handler=handler
        )
        
        tool = Tool(
            name=name,
            description=description,
            function_definition=function_def,
            category=category,
            rate_limit=rate_limit
        )
        
        self.tool_registry.register_tool(tool)
    
    def unregister_function(self, name: str):
        """Unregister a function."""
        self.tool_registry.unregister_tool(name)
    
    async def execute_function_call(self, function_call: FunctionCall) -> FunctionResult:
        """Execute a function call."""
        tool = self.tool_registry.get_tool(function_call.name)
        
        if not tool:
            return FunctionResult(
                call_id=function_call.call_id,
                result=None,
                success=False,
                error=f"Unknown function: {function_call.name}"
            )
        
        if not tool.enabled:
            return FunctionResult(
                call_id=function_call.call_id,
                result=None,
                success=False,
                error=f"Function is disabled: {function_call.name}"
            )
        
        if not self.tool_registry.check_rate_limit(function_call.name):
            return FunctionResult(
                call_id=function_call.call_id,
                result=None,
                success=False,
                error=f"Rate limit exceeded for function: {function_call.name}"
            )
        
        try:
            # Validate arguments
            validated_args = self._validate_arguments(function_call.arguments, tool.function_definition.parameters)
            
            # Execute the function
            if asyncio.iscoroutinefunction(tool.function_definition.handler):
                result = await tool.function_definition.handler(validated_args)
            else:
                result = tool.function_definition.handler(validated_args)
            
            # Update usage statistics
            self.tool_registry.update_usage(function_call.name)
            
            return FunctionResult(
                call_id=function_call.call_id,
                result=result,
                success=True
            )
            
        except Exception as e:
            return FunctionResult(
                call_id=function_call.call_id,
                result=None,
                success=False,
                error=str(e)
            )
    
    def _validate_arguments(self, args: Dict[str, Any], parameters: List[FunctionParameter]) -> Dict[str, Any]:
        """Validate function arguments against parameter definitions."""
        validated_args = {}
        
        # Check required parameters
        for param in parameters:
            if param.required and param.name not in args:
                raise ValueError(f"Missing required parameter: {param.name}")
        
        # Validate and convert arguments
        for param_name, param_value in args.items():
            param_def = next((p for p in parameters if p.name == param_name), None)
            
            if not param_def:
                raise ValueError(f"Unknown parameter: {param_name}")
            
            # Type validation and conversion
            try:
                validated_args[param_name] = self._convert_type(param_value, param_def.type)
            except (ValueError, TypeError) as e:
                raise ValueError(f"Invalid type for parameter {param_name}: {e}")
            
            # Enum validation
            if param_def.enum and validated_args[param_name] not in param_def.enum:
                raise ValueError(f"Invalid value for parameter {param_name}. Must be one of: {param_def.enum}")
        
        # Set default values for missing optional parameters
        for param in parameters:
            if param.name not in validated_args and not param.required and param.default is not None:
                validated_args[param.name] = param.default
        
        return validated_args
    
    def _convert_type(self, value: Any, target_type: str) -> Any:
        """Convert value to target type."""
        type_mapping = {
            "string": str,
            "integer": int,
            "number": float,
            "boolean": lambda x: str(x).lower() in ("true", "1", "yes", "on"),
            "array": list,
            "object": dict,
            "null": lambda x: None
        }
        
        if target_type not in type_mapping:
            raise ValueError(f"Unsupported type: {target_type}")
        
        converter = type_mapping[target_type]
        
        try:
            return converter(value)
        except (ValueError, TypeError) as e:
            raise ValueError(f"Cannot convert {value} to {target_type}: {e}")
    
    def get_available_functions(self) -> List[Dict[str, Any]]:
        """Get list of available functions in OpenAI format."""
        functions = []
        
        for tool in self.tool_registry.get_enabled_tools():
            func_def = tool.function_definition
            
            function_schema = {
                "name": func_def.name,
                "description": func_def.description,
                "parameters": {
                    "type": "object",
                    "properties": {},
                    "required": []
                }
            }
            
            for param in func_def.parameters:
                param_schema = {
                    "type": param.type,
                    "description": param.description
                }
                
                if param.enum:
                    param_schema["enum"] = param.enum
                
                function_schema["parameters"]["properties"][param.name] = param_schema
                
                if param.required:
                    function_schema["parameters"]["required"].append(param.name)
            
            functions.append(function_schema)
        
        return functions
    
    # Function handlers
    async def _handle_web_search(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Handle web search function calls."""
        if not self.web_search_engine:
            raise RuntimeError("Web search engine not initialized")
        
        query = args.get("query", "")
        num = args.get("num", 10)
        region = args.get("region", "in")
        indian_focus = args.get("indian_focus", True)
        
        request = WebSearchRequest(
            query=query,
            num=num,
            region=region,
            indian_focus=indian_focus
        )
        
        response = self.web_search_engine.search(request)
        
        return {
            "query": response.query,
            "results": [
                {
                    "title": result.name,
                    "url": result.url,
                    "snippet": result.snippet,
                    "rank": result.rank
                }
                for result in response.results[:5]  # Return top 5 results
            ],
            "total_results": len(response.results),
            "indian_context": response.indian_context
        }
    
    async def _handle_image_generation(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Handle image generation function calls."""
        if not self.image_generator:
            raise RuntimeError("Image generator not initialized")
        
        prompt = args.get("prompt", "")
        size = args.get("size", "1024x1024")
        style = args.get("style", "vivid")
        indian_theme = args.get("indian_theme", True)
        
        request = ImageGenerationRequest(
            prompt=prompt,
            size=size,
            style=style,
            n=1,
            indian_theme=indian_theme
        )
        
        response = self.image_generator.generate_images(request)
        
        return {
            "created": response.created,
            "images": [
                {
                    "url": img.url,
                    "revised_prompt": img.revised_prompt
                }
                for img in response.data
            ],
            "indian_context": response.indian_context
        }
    
    def _handle_calculator(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Handle calculator function calls."""
        expression = args.get("expression", "")
        
        try:
            # Safe evaluation of mathematical expressions
            # Remove potentially dangerous characters
            safe_expression = re.sub(r'[^0-9+\-*/().\s]', '', expression)
            
            if not safe_expression:
                raise ValueError("Invalid mathematical expression")
            
            result = eval(safe_expression)
            
            return {
                "expression": expression,
                "result": result,
                "type": type(result).__name__
            }
        except Exception as e:
            return {
                "expression": expression,
                "error": str(e),
                "success": False
            }
    
    def _handle_weather(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Handle weather function calls."""
        location = args.get("location", "")
        units = args.get("units", "celsius")
        
        # Mock weather data (in real implementation, call weather API)
        return {
            "location": location,
            "temperature": 25 if units == "celsius" else 77,
            "units": units,
            "condition": "Partly cloudy",
            "humidity": 65,
            "wind_speed": 10,
            "description": f"Current weather in {location}",
            "timestamp": datetime.now().isoformat()
        }
    
    async def _handle_news_search(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Handle news search function calls."""
        if not self.web_search_engine:
            raise RuntimeError("Web search engine not initialized")
        
        query = args.get("query", "")
        num = args.get("num", 5)
        region = args.get("region", "in")
        
        response = self.web_search_engine.search_news(query, num, region)
        
        return {
            "query": response.query,
            "articles": [
                {
                    "title": result.name,
                    "url": result.url,
                    "snippet": result.snippet,
                    "date": result.date
                }
                for result in response.results
            ],
            "total_articles": len(response.results)
        }
    
    def _handle_currency_conversion(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Handle currency conversion function calls."""
        amount = args.get("amount", 0)
        from_currency = args.get("from_currency", "USD")
        to_currency = args.get("to_currency", "INR")
        
        # Mock conversion rates (in real implementation, use exchange rate API)
        mock_rates = {
            "USD": 1.0,
            "INR": 83.0,
            "EUR": 0.92,
            "GBP": 0.79,
            "JPY": 149.5
        }
        
        if from_currency not in mock_rates or to_currency not in mock_rates:
            raise ValueError(f"Unsupported currency: {from_currency} or {to_currency}")
        
        usd_amount = amount / mock_rates[from_currency]
        converted_amount = usd_amount * mock_rates[to_currency]
        
        return {
            "amount": amount,
            "from_currency": from_currency,
            "to_currency": to_currency,
            "converted_amount": round(converted_amount, 2),
            "exchange_rate": mock_rates[to_currency] / mock_rates[from_currency],
            "timestamp": datetime.now().isoformat()
        }
    
    def _handle_indian_festivals(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Handle Indian festivals function calls."""
        month = args.get("month", "").lower()
        region = args.get("region", "").lower()
        
        # Mock festival data
        festivals = {
            "january": [
                {"name": "Makar Sankranti", "region": "all", "description": "Harvest festival"},
                {"name": "Pongal", "region": "south", "description": "Tamil harvest festival"}
            ],
            "february": [
                {"name": "Vasant Panchami", "region": "north", "description": "Spring festival"},
                {"name": "Maha Shivaratri", "region": "all", "description": "Lord Shiva's night"}
            ],
            "march": [
                {"name": "Holi", "region": "north", "description": "Festival of colors"},
                {"name": "Ugadi", "region": "south", "description": "New year"}
            ],
            "april": [
                {"name": "Baisakhi", "region": "north", "description": "Harvest festival"},
                {"name": "Rama Navami", "region": "all", "description": "Lord Rama's birthday"}
            ],
            "may": [
                {"name": "Buddha Purnima", "region": "all", "description": "Buddha's enlightenment"},
                {"name": "Akshaya Tritiya", "region": "all", "description": "Auspicious day"}
            ]
        }
        
        if month and month in festivals:
            festival_list = festivals[month]
            if region:
                festival_list = [f for f in festival_list if f["region"] in [region, "all"]]
            
            return {
                "month": month,
                "region": region,
                "festivals": festival_list,
                "total_festivals": len(festival_list)
            }
        else:
            return {
                "month": month,
                "region": region,
                "festivals": [],
                "message": "No festivals found for the specified criteria"
            }
    
    def _handle_government_schemes(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Handle government schemes function calls."""
        category = args.get("category", "").lower()
        state = args.get("state", "").lower()
        
        # Mock scheme data
        schemes = {
            "agriculture": [
                {"name": "PM-KISAN", "description": "Income support for farmers", "state": "all"},
                {"name": "PM Fasal Bima Yojana", "description": "Crop insurance scheme", "state": "all"}
            ],
            "education": [
                {"name": "Beti Bachao Beti Padhao", "description": "Girl child education", "state": "all"},
                {"name": "Mid-Day Meal", "description": "School meal program", "state": "all"}
            ],
            "health": [
                {"name": "Ayushman Bharat", "description": "Health insurance scheme", "state": "all"},
                {"name": "PMJAY", "description": "Health coverage for poor", "state": "all"}
            ]
        }
        
        if category and category in schemes:
            scheme_list = schemes[category]
            if state:
                scheme_list = [s for s in scheme_list if s["state"] in [state, "all"]]
            
            return {
                "category": category,
                "state": state,
                "schemes": scheme_list,
                "total_schemes": len(scheme_list)
            }
        else:
            return {
                "category": category,
                "state": state,
                "schemes": [],
                "message": "No schemes found for the specified criteria"
            }
    
    def _handle_current_time(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Handle current time function calls."""
        timezone = args.get("timezone", "IST")
        output_format = args.get("format", "iso")
        
        now = datetime.now()
        
        if output_format == "iso":
            time_str = now.isoformat()
        elif output_format == "readable":
            time_str = now.strftime("%A, %B %d, %Y %I:%M:%S %p")
        else:
            time_str = now.strftime("%Y-%m-%d %H:%M:%S")
        
        return {
            "current_time": time_str,
            "timezone": timezone,
            "format": output_format,
            "timestamp": now.timestamp()
        }


# Convenience functions
def create_function_executor(api_key: Optional[str] = None) -> FunctionExecutor:
    """Create a function executor instance."""
    tool_registry = ToolRegistry()
    return FunctionExecutor(tool_registry, api_key)


def register_custom_function(name: str, description: str, category: FunctionCategory,
                           parameters: List[FunctionParameter], handler: Callable,
                           executor: FunctionExecutor, rate_limit: Optional[int] = None):
    """Register a custom function."""
    executor.register_function(name, description, category, parameters, handler, rate_limit)