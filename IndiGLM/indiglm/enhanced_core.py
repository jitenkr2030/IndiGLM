"""
IndiGLM Enhanced Core Module
===========================

Enhanced core functionality with Z.ai-style features including:
- Advanced chat completions with system messages
- Image generation capabilities
- Web search functionality
- Function calling and tool use
- Modern API structure
"""

import os
import json
import time
import asyncio
import requests
from typing import Dict, List, Optional, Any, Union, Callable, AsyncGenerator
from dataclasses import dataclass, asdict
from enum import Enum
from datetime import datetime

from .core import IndiGLM, ModelType, UsageStats, IndiGLMResponse
from .languages import IndianLanguage
from .cultural import CulturalContext
from .industries import IndustryType


class FunctionType(Enum):
    """Types of functions that can be called."""
    WEB_SEARCH = "web_search"
    IMAGE_GENERATION = "image_generation"
    CALCULATOR = "calculator"
    WEATHER = "weather"
    NEWS = "news"
    STOCKS = "stocks"
    CURRENCY = "currency"
    CUSTOM = "custom"


@dataclass
class FunctionParameter:
    """Parameter definition for function calling."""
    name: str
    type: str
    description: str
    required: bool = True
    default: Any = None
    enum: Optional[List[str]] = None


@dataclass
class FunctionDefinition:
    """Definition of a callable function."""
    name: str
    description: str
    parameters: List[FunctionParameter]
    function_type: FunctionType
    handler: Optional[Callable] = None


@dataclass
class FunctionCall:
    """A function call request."""
    name: str
    arguments: Dict[str, Any]
    call_id: str


@dataclass
class FunctionResult:
    """Result of a function call."""
    call_id: str
    result: Any
    success: bool
    error: Optional[str] = None


@dataclass
class ImageGenerationRequest:
    """Request for image generation."""
    prompt: str
    size: str = "1024x1024"
    quality: str = "standard"
    style: str = "vivid"
    n: int = 1
    indian_theme: bool = True
    cultural_elements: Optional[List[str]] = None


@dataclass
class ImageGenerationResponse:
    """Response from image generation."""
    created: int
    data: List[Dict[str, Any]]
    indian_context: Optional[Dict[str, Any]] = None


@dataclass
class WebSearchRequest:
    """Request for web search."""
    query: str
    num: int = 10
    region: str = "in"
    indian_focus: bool = True
    search_type: str = "general"
    language: Optional[str] = None


@dataclass
class WebSearchResponse:
    """Response from web search."""
    query: str
    enhanced_query: Optional[str]
    results: List[Dict[str, Any]]
    search_metadata: Dict[str, Any]
    indian_context: Optional[Dict[str, Any]] = None


@dataclass
class EnhancedChatMessage:
    """Enhanced chat message with system messages and function calls."""
    role: str  # "system", "user", "assistant", "function"
    content: Optional[str] = None
    name: Optional[str] = None  # For function messages
    function_call: Optional[FunctionCall] = None
    tool_calls: Optional[List[Dict[str, Any]]] = None
    tool_call_id: Optional[str] = None


@dataclass
class EnhancedChatResponse:
    """Enhanced chat response with function calls and streaming."""
    id: str
    object: str
    created: int
    model: str
    choices: List[Dict[str, Any]]
    usage: UsageStats
    function_calls: Optional[List[FunctionCall]] = None
    tool_calls: Optional[List[Dict[str, Any]]] = None
    cultural_insights: Optional[Dict[str, Any]] = None
    industry_insights: Optional[Dict[str, Any]] = None
    indian_context: Optional[Dict[str, Any]] = None


class EnhancedIndiGLM(IndiGLM):
    """
    Enhanced IndiGLM with Z.ai-style features.
    """
    
    def __init__(self, *args, **kwargs):
        """Initialize enhanced IndiGLM."""
        super().__init__(*args, **kwargs)
        self.functions: Dict[str, FunctionDefinition] = {}
        self._register_default_functions()
        self.streaming_enabled = True
        self.max_streaming_tokens = 1000
    
    def _register_default_functions(self):
        """Register default functions."""
        # Web search function
        self.register_function(FunctionDefinition(
            name="web_search",
            description="Search the web for current information",
            parameters=[
                FunctionParameter("query", "string", "Search query", True),
                FunctionParameter("num", "integer", "Number of results", False, 10),
                FunctionParameter("region", "string", "Search region", False, "in"),
                FunctionParameter("indian_focus", "boolean", "Focus on Indian content", False, True)
            ],
            function_type=FunctionType.WEB_SEARCH,
            handler=self._handle_web_search
        ))
        
        # Image generation function
        self.register_function(FunctionDefinition(
            name="generate_image",
            description="Generate images based on text description",
            parameters=[
                FunctionParameter("prompt", "string", "Image description", True),
                FunctionParameter("size", "string", "Image size", False, "1024x1024"),
                FunctionParameter("style", "string", "Image style", False, "vivid"),
                FunctionParameter("indian_theme", "boolean", "Apply Indian theme", False, True)
            ],
            function_type=FunctionType.IMAGE_GENERATION,
            handler=self._handle_image_generation
        ))
        
        # Calculator function
        self.register_function(FunctionDefinition(
            name="calculator",
            description="Perform mathematical calculations",
            parameters=[
                FunctionParameter("expression", "string", "Mathematical expression", True)
            ],
            function_type=FunctionType.CALCULATOR,
            handler=self._handle_calculator
        ))
        
        # Weather function
        self.register_function(FunctionDefinition(
            name="get_weather",
            description="Get current weather information",
            parameters=[
                FunctionParameter("location", "string", "Location name", True),
                FunctionParameter("units", "string", "Temperature units", False, "celsius", ["celsius", "fahrenheit"])
            ],
            function_type=FunctionType.WEATHER,
            handler=self._handle_weather
        ))
    
    def register_function(self, function_def: FunctionDefinition):
        """Register a custom function."""
        self.functions[function_def.name] = function_def
    
    def unregister_function(self, name: str):
        """Unregister a function."""
        if name in self.functions:
            del self.functions[name]
    
    def get_available_functions(self) -> List[Dict[str, Any]]:
        """Get list of available functions."""
        return [
            {
                "name": func.name,
                "description": func.description,
                "parameters": {
                    "type": "object",
                    "properties": {
                        param.name: {
                            "type": param.type,
                            "description": param.description,
                            "enum": param.enum
                        }
                        for param in func.parameters
                    },
                    "required": [param.name for param in func.parameters if param.required]
                }
            }
            for func in self.functions.values()
        ]
    
    async def chat_completion(
        self,
        messages: List[Union[Dict[str, Any], EnhancedChatMessage]],
        model: Optional[ModelType] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        stream: bool = False,
        functions: Optional[List[Dict[str, Any]]] = None,
        function_call: Optional[Union[str, Dict[str, Any]]] = None,
        language: Optional[IndianLanguage] = None,
        cultural_context: Optional[bool] = None,
        cultural_config: Optional[CulturalContext] = None,
        industry: Optional[IndustryType] = None
    ) -> Union[EnhancedChatResponse, AsyncGenerator[Dict[str, Any], None]]:
        """
        Enhanced chat completion with function calling and streaming.
        
        Args:
            messages: List of chat messages
            model: Model to use
            temperature: Response randomness
            max_tokens: Maximum tokens
            stream: Whether to stream response
            functions: Available functions
            function_call: Function call configuration
            language: Target language
            cultural_context: Enable cultural context
            cultural_config: Cultural context configuration
            industry: Industry type
            
        Returns:
            EnhancedChatResponse or streaming generator
        """
        # Convert messages to EnhancedChatMessage format
        enhanced_messages = []
        for msg in messages:
            if isinstance(msg, EnhancedChatMessage):
                enhanced_messages.append(msg)
            else:
                enhanced_messages.append(EnhancedChatMessage(
                    role=msg.get("role", "user"),
                    content=msg.get("content"),
                    name=msg.get("name"),
                    function_call=self._dict_to_function_call(msg.get("function_call")) if msg.get("function_call") else None,
                    tool_calls=msg.get("tool_calls"),
                    tool_call_id=msg.get("tool_call_id")
                ))
        
        if stream:
            return self._stream_chat_completion(
                enhanced_messages, model, temperature, max_tokens,
                functions, function_call, language, cultural_context,
                cultural_config, industry
            )
        else:
            return await self._non_stream_chat_completion(
                enhanced_messages, model, temperature, max_tokens,
                functions, function_call, language, cultural_context,
                cultural_config, industry
            )
    
    async def _non_stream_chat_completion(
        self,
        messages: List[EnhancedChatMessage],
        model: Optional[ModelType],
        temperature: float,
        max_tokens: Optional[int],
        functions: Optional[List[Dict[str, Any]]],
        function_call: Optional[Union[str, Dict[str, Any]]],
        language: Optional[IndianLanguage],
        cultural_context: Optional[bool],
        cultural_config: Optional[CulturalContext],
        industry: Optional[IndustryType]
    ) -> EnhancedChatResponse:
        """Non-streaming chat completion."""
        # Prepare request data
        data = {
            "model": (model or ModelType.INDI_GLM_1_0).value,
            "messages": [self._message_to_dict(msg) for msg in messages],
            "temperature": temperature,
            "stream": False
        }
        
        if max_tokens:
            data["max_tokens"] = max_tokens
        
        if functions:
            data["functions"] = functions
        
        if function_call:
            data["function_call"] = function_call
        
        if language:
            data["language"] = language.value
        
        if cultural_context is not None:
            data["cultural_context"] = cultural_context
        
        if cultural_config:
            data["cultural_config"] = cultural_config.to_dict()
        
        if industry:
            data["industry"] = industry.value
        
        # Make API request
        response_data = self._make_request("chat/completions", data=data)
        
        # Parse response
        usage = UsageStats(**response_data["usage"])
        
        # Extract function calls
        function_calls = []
        if "function_call" in response_data["choices"][0]["message"]:
            func_call_data = response_data["choices"][0]["message"]["function_call"]
            function_calls.append(FunctionCall(
                name=func_call_data["name"],
                arguments=json.loads(func_call_data["arguments"]),
                call_id=func_call_data.get("call_id", f"call_{int(time.time())}")
            ))
        
        # Extract tool calls
        tool_calls = response_data["choices"][0]["message"].get("tool_calls")
        
        return EnhancedChatResponse(
            id=response_data["id"],
            object="chat.completion",
            created=response_data["created"],
            model=response_data["model"],
            choices=response_data["choices"],
            usage=usage,
            function_calls=function_calls if function_calls else None,
            tool_calls=tool_calls,
            cultural_insights=response_data.get("cultural_insights"),
            industry_insights=response_data.get("industry_insights"),
            indian_context=response_data.get("indian_context")
        )
    
    async def _stream_chat_completion(
        self,
        messages: List[EnhancedChatMessage],
        model: Optional[ModelType],
        temperature: float,
        max_tokens: Optional[int],
        functions: Optional[List[Dict[str, Any]]],
        function_call: Optional[Union[str, Dict[str, Any]]],
        language: Optional[IndianLanguage],
        cultural_context: Optional[bool],
        cultural_config: Optional[CulturalContext],
        industry: Optional[IndustryType]
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """Streaming chat completion."""
        # Prepare request data
        data = {
            "model": (model or ModelType.INDI_GLM_1_0).value,
            "messages": [self._message_to_dict(msg) for msg in messages],
            "temperature": temperature,
            "stream": True
        }
        
        if max_tokens:
            data["max_tokens"] = max_tokens
        
        if functions:
            data["functions"] = functions
        
        if function_call:
            data["function_call"] = function_call
        
        if language:
            data["language"] = language.value
        
        if cultural_context is not None:
            data["cultural_context"] = cultural_context
        
        if cultural_config:
            data["cultural_config"] = cultural_config.to_dict()
        
        if industry:
            data["industry"] = industry.value
        
        # Make streaming request
        response = self.session.post(
            f"{self.base_url}/chat/completions",
            json=data,
            stream=True,
            timeout=self.timeout
        )
        
        for line in response.iter_lines():
            if line:
                line = line.decode('utf-8')
                if line.startswith("data: "):
                    data_str = line[6:]  # Remove "data: " prefix
                    if data_str != "[DONE]":
                        try:
                            chunk = json.loads(data_str)
                            yield chunk
                        except json.JSONDecodeError:
                            continue
    
    def _message_to_dict(self, message: EnhancedChatMessage) -> Dict[str, Any]:
        """Convert EnhancedChatMessage to dictionary."""
        result = {
            "role": message.role,
            "content": message.content
        }
        
        if message.name:
            result["name"] = message.name
        
        if message.function_call:
            result["function_call"] = {
                "name": message.function_call.name,
                "arguments": json.dumps(message.function_call.arguments)
            }
            if message.function_call.call_id:
                result["function_call"]["call_id"] = message.function_call.call_id
        
        if message.tool_calls:
            result["tool_calls"] = message.tool_calls
        
        if message.tool_call_id:
            result["tool_call_id"] = message.tool_call_id
        
        return result
    
    def _dict_to_function_call(self, func_call_dict: Optional[Dict[str, Any]]) -> Optional[FunctionCall]:
        """Convert dictionary to FunctionCall."""
        if not func_call_dict:
            return None
        
        return FunctionCall(
            name=func_call_dict["name"],
            arguments=json.loads(func_call_dict["arguments"]),
            call_id=func_call_dict.get("call_id", f"call_{int(time.time())}")
        )
    
    async def execute_function_call(self, function_call: FunctionCall) -> FunctionResult:
        """Execute a function call."""
        if function_call.name not in self.functions:
            return FunctionResult(
                call_id=function_call.call_id,
                result=None,
                success=False,
                error=f"Unknown function: {function_call.name}"
            )
        
        function_def = self.functions[function_call.name]
        
        try:
            if function_def.handler:
                # Execute handler
                if asyncio.iscoroutinefunction(function_def.handler):
                    result = await function_def.handler(function_call.arguments)
                else:
                    result = function_def.handler(function_call.arguments)
                
                return FunctionResult(
                    call_id=function_call.call_id,
                    result=result,
                    success=True
                )
            else:
                return FunctionResult(
                    call_id=function_call.call_id,
                    result=None,
                    success=False,
                    error=f"No handler for function: {function_call.name}"
                )
        
        except Exception as e:
            return FunctionResult(
                call_id=function_call.call_id,
                result=None,
                success=False,
                error=str(e)
            )
    
    async def generate_image(
        self,
        prompt: str,
        size: str = "1024x1024",
        quality: str = "standard",
        style: str = "vivid",
        n: int = 1,
        indian_theme: bool = True,
        cultural_elements: Optional[List[str]] = None
    ) -> ImageGenerationResponse:
        """Generate images using AI."""
        request = ImageGenerationRequest(
            prompt=prompt,
            size=size,
            quality=quality,
            style=style,
            n=n,
            indian_theme=indian_theme,
            cultural_elements=cultural_elements
        )
        
        return await self._handle_image_generation(request.__dict__)
    
    async def web_search(
        self,
        query: str,
        num: int = 10,
        region: str = "in",
        indian_focus: bool = True,
        search_type: str = "general",
        language: Optional[str] = None
    ) -> WebSearchResponse:
        """Perform web search."""
        request = WebSearchRequest(
            query=query,
            num=num,
            region=region,
            indian_focus=indian_focus,
            search_type=search_type,
            language=language
        )
        
        return await self._handle_web_search(request.__dict__)
    
    # Function handlers
    async def _handle_web_search(self, args: Dict[str, Any]) -> WebSearchResponse:
        """Handle web search function calls."""
        # Simulate web search (in real implementation, this would call a search API)
        query = args.get("query", "")
        num = args.get("num", 10)
        region = args.get("region", "in")
        indian_focus = args.get("indian_focus", True)
        
        # Mock search results
        results = [
            {
                "title": f"Search result for '{query}' - Result {i+1}",
                "url": f"https://example.com/result{i+1}",
                "snippet": f"This is a sample search result for the query '{query}'",
                "host_name": "example.com",
                "rank": i+1,
                "date": datetime.now().strftime("%Y-%m-%d"),
                "favicon": "https://example.com/favicon.ico"
            }
            for i in range(min(num, 5))  # Mock 5 results max
        ]
        
        return WebSearchResponse(
            query=query,
            enhanced_query=f"{query} {'India' if indian_focus else ''}",
            results=results,
            search_metadata={
                "total_results": len(results),
                "search_time": 0.5,
                "region": region,
                "indian_focus": indian_focus
            },
            indian_context={
                "region": region,
                "language_preference": "en" if not args.get("language") else args.get("language"),
                "cultural_relevance": indian_focus
            }
        )
    
    async def _handle_image_generation(self, args: Dict[str, Any]) -> ImageGenerationResponse:
        """Handle image generation function calls."""
        prompt = args.get("prompt", "")
        size = args.get("size", "1024x1024")
        style = args.get("style", "vivid")
        indian_theme = args.get("indian_theme", True)
        
        # Mock image generation response
        image_data = [
            {
                "url": f"https://example.com/generated_image_{int(time.time())}.png",
                "base64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",  # Mock base64
                "revised_prompt": f"{prompt} {'with Indian cultural elements' if indian_theme else ''}",
                "metadata": {
                    "size": size,
                    "style": style,
                    "theme": "Indian" if indian_theme else "General"
                }
            }
        ]
        
        return ImageGenerationResponse(
            created=int(time.time()),
            data=image_data,
            indian_context={
                "theme_applied": indian_theme,
                "cultural_elements": ["traditional", "cultural"] if indian_theme else [],
                "region": "India"
            }
        )
    
    def _handle_calculator(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Handle calculator function calls."""
        expression = args.get("expression", "")
        
        try:
            # Simple calculator (in real implementation, use eval safely or a proper calculator library)
            # WARNING: eval() can be dangerous, use proper parsing in production
            result = eval(expression)
            return {"result": result, "expression": expression}
        except Exception as e:
            return {"error": str(e), "expression": expression}
    
    def _handle_weather(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Handle weather function calls."""
        location = args.get("location", "")
        units = args.get("units", "celsius")
        
        # Mock weather data
        return {
            "location": location,
            "temperature": 25 if units == "celsius" else 77,
            "units": units,
            "condition": "Partly cloudy",
            "humidity": 65,
            "wind_speed": 10,
            "description": f"Current weather in {location}"
        }
    
    def create_system_message(self, content: str) -> EnhancedChatMessage:
        """Create a system message."""
        return EnhancedChatMessage(role="system", content=content)
    
    def create_user_message(self, content: str) -> EnhancedChatMessage:
        """Create a user message."""
        return EnhancedChatMessage(role="user", content=content)
    
    def create_assistant_message(self, content: str, function_calls: Optional[List[FunctionCall]] = None) -> EnhancedChatMessage:
        """Create an assistant message."""
        return EnhancedChatMessage(
            role="assistant",
            content=content,
            function_calls=function_calls
        )
    
    def create_function_message(self, content: str, name: str, call_id: str) -> EnhancedChatMessage:
        """Create a function message."""
        return EnhancedChatMessage(
            role="function",
            content=content,
            name=name,
            tool_call_id=call_id
        )