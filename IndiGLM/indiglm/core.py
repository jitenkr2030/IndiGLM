"""
IndiGLM Core Module
==================

Core functionality for the IndiGLM Indian Language Model.
Provides the main IndiGLM class and related utilities.
"""

import os
import json
import time
import requests
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, asdict
from enum import Enum

from .languages import IndianLanguage, LanguageDetector
from .cultural import CulturalContext
from .industries import IndustryType, IndustryConfig


class ModelType(Enum):
    """Available IndiGLM model types."""
    INDI_GLM_1_0 = "indiglm-1.0"
    INDI_GLM_1_0_TURBO = "indiglm-1.0-turbo"
    INDI_GLM_1_0_MINI = "indiglm-1.0-mini"
    INDI_GLM_1_0_PRO = "indiglm-1.0-pro"


@dataclass
class UsageStats:
    """Token usage statistics."""
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int
    
    def to_dict(self):
        return asdict(self)


@dataclass
class IndiGLMResponse:
    """Response from IndiGLM API."""
    id: str
    content: str
    role: str
    model: str
    usage: UsageStats
    cultural_insights: Optional[Dict[str, Any]] = None
    industry_insights: Optional[Dict[str, Any]] = None
    language_detected: Optional[str] = None
    confidence: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = None
    
    def to_dict(self):
        return asdict(self)


@dataclass
class ModelInfo:
    """Information about the IndiGLM model."""
    name: str
    version: str
    description: str
    supported_languages: List[str]
    supported_industries: List[str]
    cultural_context_enabled: bool
    max_tokens: int
    features: List[str]
    
    def to_dict(self):
        return asdict(self)


class IndiGLM:
    """
    Main IndiGLM class for interacting with the Indian Language Model API.
    
    Features:
    - 22+ Indian languages support
    - Cultural context awareness
    - Industry-specific applications
    - Batch processing
    - Streaming responses
    """
    
    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.indiglm.ai/v1",
        default_language: IndianLanguage = IndianLanguage.HINDI,
        enable_cultural_context: bool = True,
        timeout: int = 30,
        max_retries: int = 3
    ):
        """
        Initialize IndiGLM client.
        
        Args:
            api_key: API key for authentication
            base_url: Base URL for the API
            default_language: Default language for interactions
            enable_cultural_context: Enable cultural context awareness
            timeout: Request timeout in seconds
            max_retries: Maximum number of retry attempts
        """
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
        self.default_language = default_language
        self.enable_cultural_context = enable_cultural_context
        self.timeout = timeout
        self.max_retries = max_retries
        
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": f"IndiGLM-Python/1.0.0"
        })
        
        self.language_detector = LanguageDetector()
        self._model_info: Optional[ModelInfo] = None
    
    def _make_request(
        self,
        endpoint: str,
        method: str = "POST",
        data: Optional[Dict] = None,
        params: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Make HTTP request to the API with retry logic.
        
        Args:
            endpoint: API endpoint
            method: HTTP method
            data: Request data
            params: Query parameters
            
        Returns:
            Response data as dictionary
        """
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        
        for attempt in range(self.max_retries):
            try:
                response = self.session.request(
                    method=method,
                    url=url,
                    json=data,
                    params=params,
                    timeout=self.timeout
                )
                response.raise_for_status()
                return response.json()
                
            except requests.exceptions.RequestException as e:
                if attempt == self.max_retries - 1:
                    raise Exception(f"API request failed after {self.max_retries} attempts: {e}")
                time.sleep(2 ** attempt)  # Exponential backoff
    
    def chat(
        self,
        message: str,
        language: Optional[IndianLanguage] = None,
        model: Optional[ModelType] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        cultural_context: Optional[bool] = None,
        cultural_config: Optional[CulturalContext] = None,
        industry: Optional[IndustryType] = None,
        industry_config: Optional[IndustryConfig] = None
    ) -> IndiGLMResponse:
        """
        Send a chat message to IndiGLM.
        
        Args:
            message: Message to send
            language: Target language
            model: Model type to use
            temperature: Response randomness (0.0-1.0)
            max_tokens: Maximum tokens in response
            cultural_context: Enable cultural context
            cultural_config: Cultural context configuration
            industry: Industry type for specialized responses
            industry_config: Industry-specific configuration
            
        Returns:
            IndiGLMResponse object
        """
        # Use defaults if not provided
        target_language = language or self.default_language
        model_type = model or ModelType.INDI_GLM_1_0
        enable_cultural = cultural_context if cultural_context is not None else self.enable_cultural_context
        
        # Detect language if not provided
        if language is None:
            detected = self.language_detector.detect(message)
            target_language = detected.language
        
        # Prepare request data
        data = {
            "model": model_type.value,
            "messages": [{"role": "user", "content": message}],
            "language": target_language.value,
            "temperature": temperature,
            "cultural_context": enable_cultural,
            "stream": False
        }
        
        if max_tokens:
            data["max_tokens"] = max_tokens
        
        if cultural_config:
            data["cultural_config"] = cultural_config.to_dict()
        
        if industry:
            data["industry"] = industry.value
            if industry_config:
                data["industry_config"] = industry_config.to_dict()
        
        # Make API request
        response_data = self._make_request("chat/completions", data=data)
        
        # Parse response
        usage = UsageStats(**response_data["usage"])
        
        return IndiGLMResponse(
            id=response_data["id"],
            content=response_data["choices"][0]["message"]["content"],
            role=response_data["choices"][0]["message"]["role"],
            model=response_data["model"],
            usage=usage,
            cultural_insights=response_data.get("cultural_insights"),
            industry_insights=response_data.get("industry_insights"),
            language_detected=response_data.get("language_detected"),
            confidence=response_data.get("confidence"),
            metadata=response_data.get("metadata")
        )
    
    def batch_chat(
        self,
        messages: List[str],
        language: Optional[IndianLanguage] = None,
        model: Optional[ModelType] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        cultural_context: Optional[bool] = None
    ) -> List[IndiGLMResponse]:
        """
        Send multiple chat messages in batch.
        
        Args:
            messages: List of messages to send
            language: Target language
            model: Model type to use
            temperature: Response randomness
            max_tokens: Maximum tokens per response
            cultural_context: Enable cultural context
            
        Returns:
            List of IndiGLMResponse objects
        """
        target_language = language or self.default_language
        model_type = model or ModelType.INDI_GLM_1_0
        enable_cultural = cultural_context if cultural_context is not None else self.enable_cultural_context
        
        data = {
            "model": model_type.value,
            "messages": [{"role": "user", "content": msg} for msg in messages],
            "language": target_language.value,
            "temperature": temperature,
            "cultural_context": enable_cultural,
            "batch": True
        }
        
        if max_tokens:
            data["max_tokens"] = max_tokens
        
        response_data = self._make_request("chat/batch", data=data)
        
        responses = []
        for resp in response_data["responses"]:
            usage = UsageStats(**resp["usage"])
            responses.append(IndiGLMResponse(
                id=resp["id"],
                content=resp["choices"][0]["message"]["content"],
                role=resp["choices"][0]["message"]["role"],
                model=resp["model"],
                usage=usage,
                cultural_insights=resp.get("cultural_insights"),
                language_detected=resp.get("language_detected"),
                confidence=resp.get("confidence"),
                metadata=resp.get("metadata")
            ))
        
        return responses
    
    def translate(
        self,
        text: str,
        from_language: IndianLanguage,
        to_language: IndianLanguage,
        model: Optional[ModelType] = None
    ) -> IndiGLMResponse:
        """
        Translate text between Indian languages.
        
        Args:
            text: Text to translate
            from_language: Source language
            to_language: Target language
            model: Model type to use
            
        Returns:
            IndiGLMResponse with translated text
        """
        model_type = model or ModelType.INDI_GLM_1_0
        
        data = {
            "model": model_type.value,
            "text": text,
            "from_language": from_language.value,
            "to_language": to_language.value,
            "cultural_context": self.enable_cultural_context
        }
        
        response_data = self._make_request("translate", data=data)
        
        usage = UsageStats(**response_data["usage"])
        
        return IndiGLMResponse(
            id=response_data["id"],
            content=response_data["translated_text"],
            role="assistant",
            model=response_data["model"],
            usage=usage,
            language_detected=to_language.value,
            confidence=response_data.get("confidence"),
            metadata=response_data.get("metadata")
        )
    
    def generate_content(
        self,
        prompt: str,
        language: Optional[IndianLanguage] = None,
        model: Optional[ModelType] = None,
        temperature: float = 0.8,
        max_tokens: Optional[int] = None,
        cultural_context: Optional[bool] = None
    ) -> IndiGLMResponse:
        """
        Generate creative or informative content.
        
        Args:
            prompt: Content generation prompt
            language: Target language
            model: Model type to use
            temperature: Response randomness
            max_tokens: Maximum tokens in response
            cultural_context: Enable cultural context
            
        Returns:
            IndiGLMResponse with generated content
        """
        target_language = language or self.default_language
        model_type = model or ModelType.INDI_GLM_1_0
        enable_cultural = cultural_context if cultural_context is not None else self.enable_cultural_context
        
        data = {
            "model": model_type.value,
            "prompt": prompt,
            "language": target_language.value,
            "temperature": temperature,
            "cultural_context": enable_cultural,
            "task_type": "content_generation"
        }
        
        if max_tokens:
            data["max_tokens"] = max_tokens
        
        response_data = self._make_request("generate", data=data)
        
        usage = UsageStats(**response_data["usage"])
        
        return IndiGLMResponse(
            id=response_data["id"],
            content=response_data["content"],
            role="assistant",
            model=response_data["model"],
            usage=usage,
            cultural_insights=response_data.get("cultural_insights"),
            language_detected=response_data.get("language_detected"),
            metadata=response_data.get("metadata")
        )
    
    def get_model_info(self) -> ModelInfo:
        """
        Get information about the current model.
        
        Returns:
            ModelInfo object with model details
        """
        if self._model_info is None:
            response_data = self._make_request("model/info", method="GET")
            self._model_info = ModelInfo(**response_data)
        
        return self._model_info
    
    def health_check(self) -> Dict[str, Any]:
        """
        Check API health status.
        
        Returns:
            Health status information
        """
        return self._make_request("health", method="GET")
    
    def stream_chat(
        self,
        message: str,
        language: Optional[IndianLanguage] = None,
        model: Optional[ModelType] = None,
        temperature: float = 0.7,
        cultural_context: Optional[bool] = None
    ):
        """
        Stream chat response.
        
        Args:
            message: Message to send
            language: Target language
            model: Model type to use
            temperature: Response randomness
            cultural_context: Enable cultural context
            
        Yields:
            Response chunks as they arrive
        """
        target_language = language or self.default_language
        model_type = model or ModelType.INDI_GLM_1_0
        enable_cultural = cultural_context if cultural_context is not None else self.enable_cultural_context
        
        data = {
            "model": model_type.value,
            "messages": [{"role": "user", "content": message}],
            "language": target_language.value,
            "temperature": temperature,
            "cultural_context": enable_cultural,
            "stream": True
        }
        
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


# Convenience functions
def create_indiglm(config: Dict[str, Any]) -> IndiGLM:
    """
    Create IndiGLM instance from configuration dictionary.
    
    Args:
        config: Configuration dictionary
        
    Returns:
        IndiGLM instance
    """
    return IndiGLM(
        api_key=config["api_key"],
        base_url=config.get("base_url", "https://api.indiglm.ai/v1"),
        default_language=config.get("default_language", IndianLanguage.HINDI),
        enable_cultural_context=config.get("enable_cultural_context", True),
        timeout=config.get("timeout", 30),
        max_retries=config.get("max_retries", 3)
    )


def get_supported_languages() -> List[Dict[str, str]]:
    """
    Get list of supported Indian languages.
    
    Returns:
        List of dictionaries with language codes and names
    """
    return [
        {"code": lang.value, "name": lang.name.replace("_", " ").title()}
        for lang in IndianLanguage
    ]


def get_supported_industries() -> List[Dict[str, str]]:
    """
    Get list of supported industries.
    
    Returns:
        List of dictionaries with industry codes and names
    """
    return [
        {"code": industry.value, "name": industry.name.replace("_", " ").title()}
        for industry in IndustryType
    ]