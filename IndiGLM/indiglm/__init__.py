"""
IndiGLM - Indian Language Model Package
========================================

A specialized AI language model for India's diverse linguistic and cultural landscape.
Supports 22+ official Indian languages with deep cultural context awareness.

Author: IndiGLM Team
Version: 1.0.0
License: MIT
"""

__version__ = "1.0.0"
__author__ = "IndiGLM Team"
__email__ = "support@indiglm.ai"
__license__ = "MIT"

# Import core classes and enums
from .core import IndiGLM, IndiGLMResponse, ModelInfo
from .languages import IndianLanguage, LanguageDetector
from .cultural import CulturalContext, Festival, Custom
from .industries import IndustryType, IndustryConfig

# Import convenience functions
from .core import create_indiglm, get_supported_languages

# Package metadata
__all__ = [
    # Core classes
    "IndiGLM",
    "IndiGLMResponse", 
    "ModelInfo",
    
    # Language support
    "IndianLanguage",
    "LanguageDetector",
    
    # Cultural context
    "CulturalContext",
    "Festival",
    "Custom",
    
    # Industry applications
    "IndustryType",
    "IndustryConfig",
    
    # Convenience functions
    "create_indiglm",
    "get_supported_languages",
]

# Package information
PACKAGE_INFO = {
    "name": "indiglm",
    "version": __version__,
    "description": "Indian Language Model with cultural context awareness",
    "author": __author__,
    "email": __email__,
    "license": __license__,
    "url": "https://github.com/indiglm/indiglm",
    "documentation": "https://docs.indiglm.ai",
    "api_url": "https://api.indiglm.ai/v1"
}

# Supported features
FEATURES = {
    "multilingual": True,
    "cultural_context": True,
    "industry_applications": True,
    "code_switching": True,
    "script_support": True,
    "offline_mode": False,
    "batch_processing": True,
    "streaming": True,
    "custom_models": True
}

# Default configuration
DEFAULT_CONFIG = {
    "api_key": None,
    "base_url": "https://api.indiglm.ai/v1",
    "default_language": IndianLanguage.HINDI,
    "enable_cultural_context": True,
    "timeout": 30,
    "max_retries": 3,
    "temperature": 0.7,
    "max_tokens": 1000
}

def get_package_info():
    """Get package information."""
    return PACKAGE_INFO

def get_features():
    """Get supported features."""
    return FEATURES

def get_default_config():
    """Get default configuration."""
    return DEFAULT_CONFIG

def create_default_client():
    """Create a default IndiGLM client with environment configuration."""
    import os
    
    config = DEFAULT_CONFIG.copy()
    config["api_key"] = os.getenv("INDIGLM_API_KEY")
    config["base_url"] = os.getenv("INDIGLM_BASE_URL", config["base_url"])
    
    if os.getenv("INDIGLM_DEFAULT_LANGUAGE"):
        try:
            config["default_language"] = IndianLanguage(os.getenv("INDIGLM_DEFAULT_LANGUAGE"))
        except ValueError:
            pass
    
    config["enable_cultural_context"] = os.getenv("INDIGLM_CULTURAL_CONTEXT", "true").lower() == "true"
    
    return create_indiglm(config)

# Quick start example
def quick_example():
    """
    Quick start example for IndiGLM.
    
    Returns:
        str: Example response from IndiGLM
    """
    try:
        model = create_default_client()
        response = model.chat("नमस्ते! आप कैसे हैं?", language=IndianLanguage.HINDI)
        return response.content
    except Exception as e:
        return f"Error: {e}. Please set INDIGLM_API_KEY environment variable."

# Version check
def check_version():
    """Check if the package is up to date."""
    try:
        import requests
        response = requests.get(f"{PACKAGE_INFO['url']}/latest-version", timeout=5)
        latest_version = response.json().get("version")
        
        if latest_version and latest_version != __version__:
            print(f"⚠️  New version available: {latest_version} (current: {__version__})")
            print(f"📥 Update with: pip install --upgrade indiglm")
        else:
            print(f"✅ You're using the latest version: {__version__}")
    except:
        print("❌ Unable to check for updates")

# Initialize logging
import logging
logging.getLogger(__name__).addHandler(logging.NullHandler())

# Print welcome message on import
if __name__ != "__main__":
    print(f"🇮🇳 IndiGLM v{__version__} loaded successfully!")
    print(f"📚 Documentation: {PACKAGE_INFO['documentation']}")
    print(f"🔧 Use create_default_client() for quick setup")