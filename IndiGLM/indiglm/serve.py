#!/usr/bin/env python3
"""
IndiGLM Server Module
====================

REST API server for IndiGLM - Indian Language Model.
Provides HTTP endpoints for chat, translation, content generation, and more.
"""

import os
import json
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from contextlib import asynccontextmanager
import uvicorn

from .core import IndiGLM, ModelType, IndiGLMResponse
from .languages import IndianLanguage, LanguageDetector
from .cultural import CulturalContext, Region
from .industries import IndustryManager, IndustryType


# Pydantic models for API requests and responses
class ChatMessage(BaseModel):
    role: str = Field(..., description="Message role (user, assistant, system)")
    content: str = Field(..., description="Message content")


class ChatRequest(BaseModel):
    messages: List[ChatMessage] = Field(..., description="List of chat messages")
    language: str = Field("hi", description="Target language code")
    model: str = Field("indiglm-1.0", description="Model to use")
    temperature: float = Field(0.7, ge=0.0, le=1.0, description="Temperature for response randomness")
    max_tokens: Optional[int] = Field(None, ge=1, le=8000, description="Maximum tokens in response")
    cultural_context: bool = Field(True, description="Enable cultural context")
    cultural_config: Optional[Dict[str, Any]] = Field(None, description="Cultural context configuration")
    industry: Optional[str] = Field(None, description="Industry type for specialized responses")
    industry_config: Optional[Dict[str, Any]] = Field(None, description="Industry-specific configuration")
    stream: bool = Field(False, description="Stream response")


class TranslateRequest(BaseModel):
    text: str = Field(..., description="Text to translate")
    from_language: str = Field(..., description="Source language code")
    to_language: str = Field(..., description="Target language code")
    model: str = Field("indiglm-1.0", description="Model to use")


class GenerateRequest(BaseModel):
    prompt: str = Field(..., description="Content generation prompt")
    language: str = Field("hi", description="Target language code")
    model: str = Field("indiglm-1.0", description="Model to use")
    temperature: float = Field(0.8, ge=0.0, le=1.0, description="Temperature for creativity")
    max_tokens: Optional[int] = Field(500, ge=1, le=8000, description="Maximum tokens in response")
    cultural_context: bool = Field(True, description="Enable cultural context")


class DetectRequest(BaseModel):
    text: str = Field(..., description="Text to analyze")
    include_statistics: bool = Field(True, description="Include detailed statistics")


class BatchChatRequest(BaseModel):
    messages: List[str] = Field(..., description="List of messages to process")
    language: str = Field("hi", description="Target language code")
    model: str = Field("indiglm-1.0", description="Model to use")
    temperature: float = Field(0.7, ge=0.0, le=1.0, description="Temperature for response randomness")
    max_tokens: Optional[int] = Field(None, ge=1, le=8000, description="Maximum tokens per response")
    cultural_context: bool = Field(True, description="Enable cultural context")


class HealthResponse(BaseModel):
    status: str = Field(..., description="Health status")
    timestamp: str = Field(..., description="Current timestamp")
    version: str = Field(..., description="API version")
    uptime: float = Field(..., description="Server uptime in seconds")
    model_status: str = Field(..., description="Model status")


class ModelInfoResponse(BaseModel):
    name: str = Field(..., description="Model name")
    version: str = Field(..., description="Model version")
    description: str = Field(..., description="Model description")
    supported_languages: List[str] = Field(..., description="Supported language codes")
    supported_industries: List[str] = Field(..., description="Supported industry types")
    cultural_context_enabled: bool = Field(..., description="Cultural context capability")
    max_tokens: int = Field(..., description="Maximum token limit")
    features: List[str] = Field(..., description="Available features")


class LanguageResponse(BaseModel):
    code: str = Field(..., description="Language code")
    name: str = Field(..., description="Language name")
    native_name: str = Field(..., description="Native language name")
    script: str = Field(..., description="Primary script used")


class IndustryResponse(BaseModel):
    code: str = Field(..., description="Industry code")
    name: str = Field(..., description="Industry name")
    market_size: str = Field(..., description="Market size")
    growth_rate: str = Field(..., description="Growth rate")
    description: str = Field(..., description="Industry description")


# Global variables
app = FastAPI(
    title="IndiGLM API",
    description="Indian Language Model REST API with cultural context awareness",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

model: Optional[IndiGLM] = None
language_detector: LanguageDetector
industry_manager: IndustryManager
server_start_time: datetime


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management."""
    global model, language_detector, industry_manager, server_start_time
    
    # Initialize components
    server_start_time = datetime.now()
    language_detector = LanguageDetector()
    industry_manager = IndustryManager()
    
    # Initialize model
    api_key = os.getenv("INDIGLM_API_KEY")
    if api_key:
        try:
            model = IndiGLM(
                api_key=api_key,
                base_url=os.getenv("INDIGLM_BASE_URL", "https://api.indiglm.ai/v1"),
                default_language=IndianLanguage.HINDI,
                enable_cultural_context=True
            )
            print("✅ IndiGLM model initialized successfully")
        except Exception as e:
            print(f"❌ Error initializing IndiGLM model: {e}")
    else:
        print("⚠️  INDIGLM_API_KEY not set - model functionality will be limited")
    
    yield
    
    # Cleanup
    print("🔄 Shutting down IndiGLM server...")


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token."""
    # In a real implementation, you would validate the JWT token
    # For now, we'll just check if the token exists
    if not credentials:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return credentials.credentials


# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Check API health status."""
    uptime = (datetime.now() - server_start_time).total_seconds()
    
    model_status = "unavailable"
    if model:
        try:
            model.health_check()
            model_status = "available"
        except:
            model_status = "error"
    
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now().isoformat(),
        version="1.0.0",
        uptime=uptime,
        model_status=model_status
    )


# Model information endpoint
@app.get("/v1/model/info", response_model=ModelInfoResponse)
async def get_model_info():
    """Get model information."""
    if not model:
        raise HTTPException(status_code=503, detail="Model not available")
    
    try:
        model_info = model.get_model_info()
        return ModelInfoResponse(**model_info.to_dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting model info: {str(e)}")


# Chat completion endpoint
@app.post("/v1/chat/completions")
async def chat_completion(request: ChatRequest):
    """Create chat completion."""
    if not model:
        raise HTTPException(status_code=503, detail="Model not available")
    
    try:
        # Convert request messages to internal format
        messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        # Parse language
        try:
            language = IndianLanguage(request.language)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid language code: {request.language}")
        
        # Parse model type
        try:
            model_type = ModelType(request.model)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid model: {request.model}")
        
        # Parse industry if provided
        industry = None
        if request.industry:
            try:
                industry = IndustryType(request.industry)
            except ValueError:
                raise HTTPException(status_code=400, detail=f"Invalid industry: {request.industry}")
        
        # Parse cultural context
        cultural_config = None
        if request.cultural_config:
            cultural_config = CulturalContext(**request.cultural_config)
        
        # Get response from model
        response = model.chat(
            message=messages[-1]["content"],  # Use last message as input
            language=language,
            model=model_type,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
            cultural_context=request.cultural_context,
            cultural_config=cultural_config,
            industry=industry
        )
        
        return {
            "id": response.id,
            "object": "chat.completion",
            "created": int(datetime.now().timestamp()),
            "model": request.model,
            "choices": [{
                "index": 0,
                "message": {
                    "role": response.role,
                    "content": response.content
                },
                "finish_reason": "stop"
            }],
            "usage": response.usage.to_dict(),
            "cultural_insights": response.cultural_insights,
            "industry_insights": response.industry_insights,
            "language_detected": response.language_detected,
            "confidence": response.confidence
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat completion: {str(e)}")


# Batch chat endpoint
@app.post("/v1/chat/batch")
async def batch_chat_completion(request: BatchChatRequest):
    """Process multiple chat messages in batch."""
    if not model:
        raise HTTPException(status_code=503, detail="Model not available")
    
    try:
        # Parse language
        try:
            language = IndianLanguage(request.language)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid language code: {request.language}")
        
        # Parse model type
        try:
            model_type = ModelType(request.model)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid model: {request.model}")
        
        # Get batch response
        responses = model.batch_chat(
            messages=request.messages,
            language=language,
            model=model_type,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
            cultural_context=request.cultural_context
        )
        
        return {
            "responses": [
                {
                    "id": response.id,
                    "object": "chat.completion",
                    "created": int(datetime.now().timestamp()),
                    "model": request.model,
                    "choices": [{
                        "index": i,
                        "message": {
                            "role": response.role,
                            "content": response.content
                        },
                        "finish_reason": "stop"
                    }],
                    "usage": response.usage.to_dict(),
                    "cultural_insights": response.cultural_insights,
                    "language_detected": response.language_detected,
                    "confidence": response.confidence
                }
                for i, response in enumerate(responses)
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing batch chat: {str(e)}")


# Translation endpoint
@app.post("/v1/translate")
async def translate_text(request: TranslateRequest):
    """Translate text between languages."""
    if not model:
        raise HTTPException(status_code=503, detail="Model not available")
    
    try:
        # Parse languages
        try:
            from_language = IndianLanguage(request.from_language)
            to_language = IndianLanguage(request.to_language)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=f"Invalid language code: {str(e)}")
        
        # Parse model type
        try:
            model_type = ModelType(request.model)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid model: {request.model}")
        
        # Get translation
        response = model.translate(
            text=request.text,
            from_language=from_language,
            to_language=to_language,
            model=model_type
        )
        
        return {
            "id": response.id,
            "object": "translation",
            "created": int(datetime.now().timestamp()),
            "model": request.model,
            "original_text": request.text,
            "translated_text": response.content,
            "from_language": request.from_language,
            "to_language": request.to_language,
            "confidence": response.confidence,
            "usage": response.usage.to_dict(),
            "metadata": response.metadata
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error translating text: {str(e)}")


# Content generation endpoint
@app.post("/v1/generate")
async def generate_content(request: GenerateRequest):
    """Generate content based on prompt."""
    if not model:
        raise HTTPException(status_code=503, detail="Model not available")
    
    try:
        # Parse language
        try:
            language = IndianLanguage(request.language)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid language code: {request.language}")
        
        # Parse model type
        try:
            model_type = ModelType(request.model)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid model: {request.model}")
        
        # Generate content
        response = model.generate_content(
            prompt=request.prompt,
            language=language,
            model=model_type,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
            cultural_context=request.cultural_context
        )
        
        return {
            "id": response.id,
            "object": "content.generation",
            "created": int(datetime.now().timestamp()),
            "model": request.model,
            "prompt": request.prompt,
            "content": response.content,
            "language": request.language,
            "usage": response.usage.to_dict(),
            "cultural_insights": response.cultural_insights,
            "language_detected": response.language_detected,
            "metadata": response.metadata
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating content: {str(e)}")


# Language detection endpoint
@app.post("/v1/detect")
async def detect_language(request: DetectRequest):
    """Detect language of text."""
    try:
        # Detect language
        result = language_detector.detect_language(request.text)
        
        response_data = {
            "detected_language": result.language.value,
            "confidence": result.confidence,
            "script_detected": result.script_detected,
            "alternative_languages": [
                {"language": lang.value, "confidence": conf}
                for lang, conf in (result.alternative_languages or [])
            ]
        }
        
        if request.include_statistics:
            stats = language_detector.get_language_statistics(request.text)
            response_data["statistics"] = stats
        
        return response_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error detecting language: {str(e)}")


# Get supported languages
@app.get("/v1/languages", response_model=List[LanguageResponse])
async def get_supported_languages():
    """Get list of supported languages."""
    languages = []
    
    for lang in IndianLanguage:
        languages.append(LanguageResponse(
            code=lang.value,
            name=lang.name.replace("_", " ").title(),
            native_name=language_detector.get_language_name(lang, native=True),
            script="Unknown"  # Could be enhanced to detect primary script
        ))
    
    return languages


# Get supported industries
@app.get("/v1/industries", response_model=List[IndustryResponse])
async def get_supported_industries():
    """Get list of supported industries."""
    industries = industry_manager.get_all_industries()
    
    return [
        IndustryResponse(
            code=industry["code"],
            name=industry["name"],
            market_size=industry["market_size"],
            growth_rate=industry["growth_rate"],
            description=f"Industry type: {industry['code']}"
        )
        for industry in industries
    ]


# Get industry insights
@app.get("/v1/industries/{industry_code}")
async def get_industry_insights(industry_code: str):
    """Get detailed insights for a specific industry."""
    try:
        industry_type = IndustryType(industry_code)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid industry code: {industry_code}")
    
    insights = industry_manager.get_industry_insights(industry_type)
    
    if not insights:
        raise HTTPException(status_code=404, detail=f"No insights found for industry: {industry_code}")
    
    return insights


# Cultural context endpoint
@app.post("/v1/cultural/context")
async def get_cultural_context(region: str, festival_aware: bool = True, traditional_values: bool = True):
    """Get cultural context for a region."""
    try:
        region_enum = Region(region)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid region: {region}")
    
    context = CulturalContext(
        region=region_enum,
        festival_aware=festival_aware,
        traditional_values=traditional_values
    )
    
    return context.to_dict()


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "IndiGLM API",
        "version": "1.0.0",
        "description": "Indian Language Model REST API with cultural context awareness",
        "documentation": "/docs",
        "health_check": "/health",
        "endpoints": {
            "chat": "/v1/chat/completions",
            "translate": "/v1/translate",
            "generate": "/v1/generate",
            "detect": "/v1/detect",
            "languages": "/v1/languages",
            "industries": "/v1/industries"
        }
    }


def run_server(host: str = "0.0.0.0", port: int = 8000, reload: bool = False):
    """Run the IndiGLM server."""
    uvicorn.run(
        "indiglm.serve:app",
        host=host,
        port=port,
        reload=reload,
        lifespan="on"
    )


if __name__ == "__main__":
    run_server()