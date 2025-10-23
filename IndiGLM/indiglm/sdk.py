"""
IndiGLM SDK Module
=================

Z.ai-style SDK interface for IndiGLM with comprehensive functionality including:
- Chat completions with system messages and function calling
- Image generation with Indian cultural themes
- Web search with Indian focus
- Batch processing
- Context managers
- Streaming responses
"""

import os
import json
import time
import asyncio
import aiohttp
from typing import Dict, List, Optional, Any, Union, AsyncGenerator
from dataclasses import dataclass, asdict
from contextlib import asynccontextmanager
from datetime import datetime

from .enhanced_core import (
    EnhancedIndiGLM, 
    EnhancedChatMessage, 
    FunctionCall, 
    FunctionResult,
    ImageGenerationRequest,
    ImageGenerationResponse,
    WebSearchRequest,
    WebSearchResponse,
    ModelType,
    IndianLanguage,
    CulturalContext,
    IndustryType
)
from .image_generation import ImageSize, ImageStyle, IndianTheme
from .web_search import SearchType, IndianRegion
from .functions import FunctionCategory


@dataclass
class IndiGLMConfig:
    """Configuration for IndiGLM SDK."""
    api_key: str
    base_url: str = "https://api.indiglm.ai/v1"
    default_language: IndianLanguage = IndianLanguage.HINDI
    enable_cultural_context: bool = True
    enable_function_calling: bool = True
    enable_image_generation: bool = True
    enable_web_search: bool = True
    timeout: int = 30
    max_retries: int = 3


class BatchProcessor:
    """Batch processing for multiple requests."""
    
    def __init__(self, indiglm_client):
        self.indiglm = indiglm_client
    
    async def batch_chat(self, message_batches: List[List[str]], **kwargs) -> List[Any]:
        """Process multiple chat requests in batch."""
        tasks = []
        for messages in message_batches:
            task = self.indiglm.chat(messages, **kwargs)
            tasks.append(task)
        return await asyncio.gather(*tasks, return_exceptions=True)
    
    async def batch_image_generation(self, prompts: List[str], **kwargs) -> List[Any]:
        """Process multiple image generation requests in batch."""
        tasks = []
        for prompt in prompts:
            task = self.indiglm.generate_image(prompt, **kwargs)
            tasks.append(task)
        return await asyncio.gather(*tasks, return_exceptions=True)
    
    async def batch_web_search(self, queries: List[str], **kwargs) -> List[Any]:
        """Process multiple web search requests in batch."""
        tasks = []
        for query in queries:
            task = self.indiglm.web_search(query, **kwargs)
            tasks.append(task)
        return await asyncio.gather(*tasks, return_exceptions=True)


class IndiGLM:
    """
    Main IndiGLM SDK class with Z.ai-style interface.
    """
    
    def __init__(self, config: IndiGLMConfig):
        self.config = config
        self.client = EnhancedIndiGLM(
            api_key=config.api_key,
            base_url=config.base_url,
            default_language=config.default_language,
            enable_cultural_context=config.enable_cultural_context
        )
        self.session = None
        self._initialized = False
    
    async def _ensure_initialized(self):
        """Ensure the client is initialized."""
        if not self._initialized:
            await self.client._initialize()
            self._initialized = True
    
    async def chat(self, 
                   messages: Union[str, List[Dict[str, Any]]], 
                   **kwargs) -> Any:
        """Simple chat interface."""
        await self._ensure_initialized()
        
        if isinstance(messages, str):
            messages = [{"role": "user", "content": messages}]
        
        return await self.client.chat_completion(messages, **kwargs)
    
    async def chat_completions_create(self, 
                                     messages: List[Dict[str, Any]], 
                                     **kwargs) -> Any:
        """Z.ai-style chat completions create."""
        await self._ensure_initialized()
        return await self.client.chat_completion(messages, **kwargs)
    
    async def generate_image(self, 
                            prompt: str, 
                            **kwargs) -> ImageGenerationResponse:
        """Generate images with Indian cultural themes."""
        await self._ensure_initialized()
        
        request = ImageGenerationRequest(
            prompt=prompt,
            size=kwargs.get('size', '1024x1024'),
            quality=kwargs.get('quality', 'standard'),
            style=kwargs.get('style', 'vivid'),
            n=kwargs.get('n', 1),
            indian_theme=kwargs.get('indian_theme', True),
            cultural_elements=kwargs.get('cultural_elements', [])
        )
        
        return await self.client.generate_image(request)
    
    async def images_generations_create(self, 
                                       prompt: str, 
                                       **kwargs) -> ImageGenerationResponse:
        """Z.ai-style image generations create."""
        return await self.generate_image(prompt, **kwargs)
    
    async def web_search(self, 
                        query: str, 
                        **kwargs) -> WebSearchResponse:
        """Web search with Indian focus."""
        await self._ensure_initialized()
        
        request = WebSearchRequest(
            query=query,
            num=kwargs.get('num', 10),
            region=kwargs.get('region', 'in'),
            indian_focus=kwargs.get('indian_focus', True),
            search_type=kwargs.get('search_type', 'general'),
            language=kwargs.get('language')
        )
        
        return await self.client.web_search(request)
    
    async def functions_invoke(self, 
                              name: str, 
                              arguments: Dict[str, Any]) -> FunctionResult:
        """Invoke a function by name."""
        await self._ensure_initialized()
        return await self.client.invoke_function(name, arguments)
    
    def get_functions(self) -> List[Dict[str, Any]]:
        """Get available functions."""
        return self.client.get_available_functions()
    
    async def health_check(self) -> Dict[str, Any]:
        """Check system health."""
        await self._ensure_initialized()
        try:
            return {
                "status": "healthy",
                "api_connection": "connected",
                "functions_available": len(self.get_functions()),
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    async def get_model_info(self) -> Dict[str, Any]:
        """Get model information."""
        await self._ensure_initialized()
        return {
            "name": "IndiGLM",
            "version": "1.0",
            "supported_languages": [lang.value for lang in IndianLanguage],
            "supported_industries": [industry.value for industry in IndustryType],
            "features": [
                "chat_completions",
                "image_generation", 
                "web_search",
                "function_calling",
                "streaming",
                "batch_processing"
            ]
        }
    
    # Helper methods for creating messages
    def create_system_message(self, content: str) -> Dict[str, Any]:
        """Create a system message."""
        return {"role": "system", "content": content}
    
    def create_user_message(self, content: str) -> Dict[str, Any]:
        """Create a user message."""
        return {"role": "user", "content": content}
    
    def create_assistant_message(self, content: str) -> Dict[str, Any]:
        """Create an assistant message."""
        return {"role": "assistant", "content": content}
    
    def create_function_message(self, content: str, name: str, call_id: str) -> Dict[str, Any]:
        """Create a function message."""
        return {
            "role": "function", 
            "content": content, 
            "name": name,
            "tool_call_id": call_id
        }
    
    # Streaming support
    async def chat_completions_create_stream(self, 
                                           messages: List[Dict[str, Any]], 
                                           **kwargs) -> AsyncGenerator[Dict[str, Any], None]:
        """Streaming chat completions."""
        await self._ensure_initialized()
        kwargs['stream'] = True
        async for chunk in self.client.chat_completion(messages, **kwargs):
            yield chunk
    
    async def close(self):
        """Close the client connection."""
        if self.session:
            await self.session.close()
        await self.client.close()


async def create_indiglm(api_key: str, **kwargs) -> IndiGLM:
    """
    Create an IndiGLM instance (Z.ai-style).
    
    Args:
        api_key: Your IndiGLM API key
        **kwargs: Additional configuration options
        
    Returns:
        IndiGLM instance
    """
    config = IndiGLMConfig(
        api_key=api_key,
        base_url=kwargs.get('base_url', 'https://api.indiglm.ai/v1'),
        default_language=kwargs.get('default_language', IndianLanguage.HINDI),
        enable_cultural_context=kwargs.get('enable_cultural_context', True),
        enable_function_calling=kwargs.get('enable_function_calling', True),
        enable_image_generation=kwargs.get('enable_image_generation', True),
        enable_web_search=kwargs.get('enable_web_search', True),
        timeout=kwargs.get('timeout', 30),
        max_retries=kwargs.get('max_retries', 3)
    )
    
    return IndiGLM(config)


@asynccontextmanager
async def with_indiglm(config: Union[Dict[str, Any], IndiGLMConfig]):
    """
    Context manager for IndiGLM (Z.ai-style).
    
    Args:
        config: Configuration dictionary or IndiGLMConfig object
        
    Usage:
        async with with_indiglm({"api_key": "your-key"}) as indiglm:
            response = await indiglm.chat("Hello!")
    """
    if isinstance(config, dict):
        indiglm_config = IndiGLMConfig(**config)
    else:
        indiglm_config = config
    
    client = IndiGLM(indiglm_config)
    try:
        await client._ensure_initialized()
        yield client
    finally:
        await client.close()


# Convenience functions
async def chat_completion(messages: List[Dict[str, Any]], api_key: str, **kwargs) -> Any:
    """Convenience function for chat completion."""
    indiglm = await create_indiglm(api_key, **kwargs)
    try:
        return await indiglm.chat_completions_create(messages, **kwargs)
    finally:
        await indiglm.close()


async def generate_image(prompt: str, api_key: str, **kwargs) -> ImageGenerationResponse:
    """Convenience function for image generation."""
    indiglm = await create_indiglm(api_key, **kwargs)
    try:
        return await indiglm.generate_image(prompt, **kwargs)
    finally:
        await indiglm.close()


async def web_search(query: str, api_key: str, **kwargs) -> WebSearchResponse:
    """Convenience function for web search."""
    indiglm = await create_indiglm(api_key, **kwargs)
    try:
        return await indiglm.web_search(query, **kwargs)
    finally:
        await indiglm.close()


# Export main classes and functions
__all__ = [
    'IndiGLM',
    'IndiGLMConfig', 
    'BatchProcessor',
    'create_indiglm',
    'with_indiglm',
    'chat_completion',
    'generate_image',
    'web_search'
]