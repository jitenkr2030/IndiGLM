"""
IndiGLM Image Generation Module
===============================

Advanced image generation capabilities with Indian cultural themes and elements.
Based on Z.ai-style image generation functionality.
"""

import os
import json
import time
import base64
import asyncio
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, asdict
from enum import Enum
from datetime import datetime

import requests
from PIL import Image, ImageDraw, ImageFont
import io


class ImageSize(Enum):
    """Standard image sizes."""
    SQUARE_256 = "256x256"
    SQUARE_512 = "512x512"
    SQUARE_1024 = "1024x1024"
    PORTRAIT_1024_1792 = "1024x1792"
    LANDSCAPE_1792_1024 = "1792x1024"


class ImageQuality(Enum):
    """Image quality levels."""
    STANDARD = "standard"
    HD = "hd"


class ImageStyle(Enum):
    """Image generation styles."""
    VIVID = "vivid"
    NATURAL = "natural"
    CINEMATIC = "cinematic"
    ARTISTIC = "artistic"
    REALISTIC = "realistic"
    INDIAN_TRADITIONAL = "indian_traditional"
    INDIAN_MODERN = "indian_modern"


class IndianTheme(Enum):
    """Indian cultural themes for image generation."""
    DIWALI = "diwali"
    HOLI = "holi"
    WEDDING = "wedding"
    FESTIVAL = "festival"
    TEMPLE = "temple"
    NATURE = "nature"
 ARCHITECTURE = "architecture"
    CLOTHING = "clothing"
    FOOD = "food"
    DANCE = "dance"
    MUSIC = "music"
    ART = "art"
    SPIRITUAL = "spiritual"
    RURAL = "rural"
    URBAN = "urban"
    HERITAGE = "heritage"


@dataclass
class ImageGenerationRequest:
    """Request for image generation."""
    prompt: str
    size: Union[str, ImageSize] = ImageSize.SQUARE_1024
    quality: Union[str, ImageQuality] = ImageQuality.STANDARD
    style: Union[str, ImageStyle] = ImageStyle.VIVID
    n: int = 1
    indian_theme: bool = True
    cultural_elements: Optional[List[str]] = None
    region: Optional[str] = None
    season: Optional[str] = None
    festival: Optional[str] = None
    response_format: str = "url"  # "url" or "b64_json"


@dataclass
class GeneratedImage:
    """Generated image data."""
    url: Optional[str] = None
    base64: Optional[str] = None
    revised_prompt: Optional[str] = None
    metadata: Dict[str, Any]
    indian_context: Optional[Dict[str, Any]] = None
    
    def save_image(self, filename: str):
        """Save the image to file."""
        if self.base64:
            image_data = base64.b64decode(self.base64)
            with open(filename, 'wb') as f:
                f.write(image_data)
        elif self.url:
            response = requests.get(self.url)
            with open(filename, 'wb') as f:
                f.write(response.content)


@dataclass
class ImageGenerationResponse:
    """Response from image generation."""
    created: int
    data: List[GeneratedImage]
    indian_context: Optional[Dict[str, Any]] = None
    metadata: Dict[str, Any]


class IndianImageEnhancer:
    """Enhances image generation with Indian cultural elements."""
    
    def __init__(self):
        """Initialize the enhancer."""
        self.cultural_keywords = {
            "diwali": ["diya", "light", "lamp", "fireworks", "rangoli", "celebration"],
            "holi": ["color", "powder", "water", "festival", "celebration", "gulal"],
            "wedding": ["bride", "groom", "mehendi", "saree", "kurta", "ceremony"],
            "temple": ["architecture", "carving", "statue", "prayer", "spiritual"],
            "festival": ["celebration", "traditional", "cultural", "music", "dance"],
            "nature": ["landscape", "rural", "village", "farm", "river", "mountain"],
            "clothing": ["saree", "kurta", "lehenga", "sherwani", "traditional"],
            "food": ["spicy", "curry", "bread", "rice", "sweets", "traditional"],
            "dance": ["classical", "bharatanatyam", "kathak", "folk", "traditional"],
            "music": ["classical", "instrumental", "traditional", "raga", "sitar"],
            "art": ["painting", "madhubani", "warli", "traditional", "folk"],
            "spiritual": ["meditation", "yoga", "temple", "prayer", "peaceful"],
            "rural": ["village", "farm", "countryside", "traditional", "simple"],
            "urban": ["city", "modern", "busy", "street", "contemporary"],
            "heritage": ["historical", "ancient", "monument", "traditional", "cultural"]
        }
        
        self.regional_elements = {
            "north": ["himalayas", "taj mahal", "rajasthan", "punjab", "uttar pradesh"],
            "south": ["temples", "backwaters", "beaches", "coconut", "spices"],
            "east": ["bengal", "assam", "tea gardens", "monasteries", "tribal"],
            "west": ["maharashtra", "gujarat", "goa", "beaches", "business"],
            "northeast": ["hills", "tribal", "diverse", "green", "cultural"]
        }
    
    def enhance_prompt(self, prompt: str, theme: Optional[str] = None, 
                      region: Optional[str] = None, season: Optional[str] = None) -> str:
        """Enhance prompt with Indian cultural elements."""
        enhanced_prompt = prompt
        
        # Add cultural keywords based on theme
        if theme and theme.lower() in self.cultural_keywords:
            keywords = self.cultural_keywords[theme.lower()]
            enhanced_prompt += f", {', '.join(keywords[:3])}"
        
        # Add regional elements
        if region and region.lower() in self.regional_elements:
            elements = self.regional_elements[region.lower()]
            enhanced_prompt += f", {', '.join(elements[:2])}"
        
        # Add seasonal context
        if season:
            seasonal_context = {
                "spring": "flowers, blooming, pleasant weather",
                "summer": "bright, sunny, warm colors",
                "monsoon": "rainy, green, lush, wet",
                "autumn": "falling leaves, golden, harvest",
                "winter": "cool, foggy, misty, cozy"
            }
            if season.lower() in seasonal_context:
                enhanced_prompt += f", {seasonal_context[season.lower()]}"
        
        # Add Indian cultural context
        enhanced_prompt += ", Indian cultural context, traditional aesthetics"
        
        return enhanced_prompt
    
    def get_indian_context(self, theme: Optional[str] = None, 
                          region: Optional[str] = None) -> Dict[str, Any]:
        """Get Indian cultural context for the image."""
        context = {
            "cultural_theme_applied": theme is not None,
            "regional_focus": region,
            "aesthetic_style": "traditional_indian",
            "color_palette": "vibrant_traditional",
            "cultural_significance": "high"
        }
        
        if theme:
            context["theme"] = theme
            context["theme_keywords"] = self.cultural_keywords.get(theme.lower(), [])
        
        if region:
            context["region"] = region
            context["regional_elements"] = self.regional_elements.get(region.lower(), [])
        
        return context


class ImageGenerator:
    """Main image generation class."""
    
    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None):
        """Initialize the image generator."""
        self.api_key = api_key or os.getenv("INDIGLM_API_KEY")
        self.base_url = (base_url or os.getenv("INDIGLM_BASE_URL", "https://api.indiglm.ai/v1")).rstrip('/')
        self.enhancer = IndianImageEnhancer()
        
        if not self.api_key:
            raise ValueError("API key is required. Set INDIGLM_API_KEY environment variable or pass api_key parameter.")
        
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "User-Agent": f"IndiGLM-ImageGenerator/1.0.0"
        })
    
    def generate_images(self, request: ImageGenerationRequest) -> ImageGenerationResponse:
        """Generate images based on the request."""
        # Enhance prompt with Indian cultural elements
        enhanced_prompt = self.enhancer.enhance_prompt(
            request.prompt,
            request.festival or (request.cultural_elements[0] if request.cultural_elements else None),
            request.region,
            request.season
        )
        
        # Prepare request data
        data = {
            "prompt": enhanced_prompt,
            "n": request.n,
            "size": request.size.value if isinstance(request.size, ImageSize) else request.size,
            "quality": request.quality.value if isinstance(request.quality, ImageQuality) else request.quality,
            "style": request.style.value if isinstance(request.style, ImageStyle) else request.style,
            "response_format": request.response_format
        }
        
        # Add Indian-specific parameters
        if request.indian_theme:
            data["indian_theme"] = True
            data["cultural_context"] = "indian"
        
        if request.cultural_elements:
            data["cultural_elements"] = request.cultural_elements
        
        if request.region:
            data["region"] = request.region
        
        if request.season:
            data["season"] = request.season
        
        if request.festival:
            data["festival"] = request.festival
        
        # Make API request
        try:
            response = self.session.post(
                f"{self.base_url}/images/generations",
                json=data,
                timeout=60
            )
            response.raise_for_status()
            response_data = response.json()
            
            # Parse response
            generated_images = []
            for img_data in response_data.get("data", []):
                generated_images.append(GeneratedImage(
                    url=img_data.get("url"),
                    base64=img_data.get("b64_json"),
                    revised_prompt=img_data.get("revised_prompt"),
                    metadata=img_data.get("metadata", {}),
                    indian_context=img_data.get("indian_context")
                ))
            
            # Get Indian context
            indian_context = self.enhancer.get_indian_context(
                request.festival,
                request.region
            )
            
            return ImageGenerationResponse(
                created=response_data.get("created", int(time.time())),
                data=generated_images,
                indian_context=indian_context,
                metadata={
                    "model": response_data.get("model"),
                    "request_id": response_data.get("id"),
                    "processing_time": response_data.get("processing_time"),
                    "enhanced_prompt": enhanced_prompt
                }
            )
            
        except requests.exceptions.RequestException as e:
            # Fallback to mock generation for demo purposes
            return self._generate_mock_images(request, enhanced_prompt)
    
    def _generate_mock_images(self, request: ImageGenerationRequest, enhanced_prompt: str) -> ImageGenerationResponse:
        """Generate mock images for demo purposes."""
        # Create a simple colored image as mock
        mock_images = []
        
        for i in range(request.n):
            # Create a simple colored rectangle as mock image
            img = Image.new('RGB', (256, 256), color=f'hsl({i * 60}, 70%, 50%)')
            
            # Convert to base64
            buffer = io.BytesIO()
            img.save(buffer, format='PNG')
            img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
            
            mock_images.append(GeneratedImage(
                url=f"https://example.com/mock_image_{int(time.time())}_{i}.png",
                base64=img_base64,
                revised_prompt=enhanced_prompt,
                metadata={
                    "size": request.size,
                    "style": request.style,
                    "quality": request.quality,
                    "mock": True
                },
                indian_context=self.enhancer.get_indian_context(
                    request.festival,
                    request.region
                )
            ))
        
        return ImageGenerationResponse(
            created=int(time.time()),
            data=mock_images,
            indian_context=self.enhancer.get_indian_context(
                request.festival,
                request.region
            ),
            metadata={
                "model": "mock-generator",
                "request_id": f"mock_{int(time.time())}",
                "processing_time": 0.1,
                "enhanced_prompt": enhanced_prompt,
                "mock": True
            }
        )
    
    def generate_image_variations(self, image_path: str, n: int = 1, size: str = "1024x1024") -> ImageGenerationResponse:
        """Generate variations of an existing image."""
        # Read and encode the image
        with open(image_path, 'rb') as f:
            image_data = base64.b64encode(f.read()).decode('utf-8')
        
        data = {
            "image": image_data,
            "n": n,
            "size": size
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/images/variations",
                json=data,
                timeout=60
            )
            response.raise_for_status()
            response_data = response.json()
            
            # Parse response
            generated_images = []
            for img_data in response_data.get("data", []):
                generated_images.append(GeneratedImage(
                    url=img_data.get("url"),
                    base64=img_data.get("b64_json"),
                    revised_prompt=img_data.get("revised_prompt"),
                    metadata=img_data.get("metadata", {})
                ))
            
            return ImageGenerationResponse(
                created=response_data.get("created", int(time.time())),
                data=generated_images,
                metadata={
                    "model": response_data.get("model"),
                    "request_id": response_data.get("id"),
                    "processing_time": response_data.get("processing_time")
                }
            )
            
        except requests.exceptions.RequestException as e:
            # Fallback to mock generation
            return self._generate_mock_variations(image_path, n, size)
    
    def _generate_mock_variations(self, image_path: str, n: int, size: str) -> ImageGenerationResponse:
        """Generate mock variations for demo purposes."""
        mock_images = []
        
        for i in range(n):
            # Create a simple colored rectangle as mock variation
            img = Image.new('RGB', (256, 256), color=f'hsl({(i + 1) * 90}, 60%, 60%)')
            
            # Convert to base64
            buffer = io.BytesIO()
            img.save(buffer, format='PNG')
            img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
            
            mock_images.append(GeneratedImage(
                url=f"https://example.com/mock_variation_{int(time.time())}_{i}.png",
                base64=img_base64,
                revised_prompt=f"Variation of {os.path.basename(image_path)}",
                metadata={
                    "size": size,
                    "variation_index": i,
                    "mock": True
                }
            ))
        
        return ImageGenerationResponse(
            created=int(time.time()),
            data=mock_images,
            metadata={
                "model": "mock-variation-generator",
                "request_id": f"mock_var_{int(time.time())}",
                "processing_time": 0.1,
                "original_image": os.path.basename(image_path),
                "mock": True
            }
        )
    
    def edit_image(self, image_path: str, mask_path: str, prompt: str, n: int = 1, size: str = "1024x1024") -> ImageGenerationResponse:
        """Edit an image using a mask and prompt."""
        # Read and encode images
        with open(image_path, 'rb') as f:
            image_data = base64.b64encode(f.read()).decode('utf-8')
        
        with open(mask_path, 'rb') as f:
            mask_data = base64.b64encode(f.read()).decode('utf-8')
        
        data = {
            "image": image_data,
            "mask": mask_data,
            "prompt": prompt,
            "n": n,
            "size": size
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/images/edits",
                json=data,
                timeout=60
            )
            response.raise_for_status()
            response_data = response.json()
            
            # Parse response
            generated_images = []
            for img_data in response_data.get("data", []):
                generated_images.append(GeneratedImage(
                    url=img_data.get("url"),
                    base64=img_data.get("b64_json"),
                    revised_prompt=img_data.get("revised_prompt"),
                    metadata=img_data.get("metadata", {})
                ))
            
            return ImageGenerationResponse(
                created=response_data.get("created", int(time.time())),
                data=generated_images,
                metadata={
                    "model": response_data.get("model"),
                    "request_id": response_data.get("id"),
                    "processing_time": response_data.get("processing_time")
                }
            )
            
        except requests.exceptions.RequestException as e:
            # Fallback to mock generation
            return self._generate_mock_edit(image_path, mask_path, prompt, n, size)
    
    def _generate_mock_edit(self, image_path: str, mask_path: str, prompt: str, n: int, size: str) -> ImageGenerationResponse:
        """Generate mock edit for demo purposes."""
        mock_images = []
        
        for i in range(n):
            # Create a simple colored rectangle as mock edit
            img = Image.new('RGB', (256, 256), color=f'hsl({(i + 2) * 120}, 50%, 70%)')
            
            # Convert to base64
            buffer = io.BytesIO()
            img.save(buffer, format='PNG')
            img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
            
            mock_images.append(GeneratedImage(
                url=f"https://example.com/mock_edit_{int(time.time())}_{i}.png",
                base64=img_base64,
                revised_prompt=f"Edited: {prompt}",
                metadata={
                    "size": size,
                    "edit_index": i,
                    "mock": True
                }
            ))
        
        return ImageGenerationResponse(
            created=int(time.time()),
            data=mock_images,
            metadata={
                "model": "mock-edit-generator",
                "request_id": f"mock_edit_{int(time.time())}",
                "processing_time": 0.1,
                "original_image": os.path.basename(image_path),
                "edit_prompt": prompt,
                "mock": True
            }
        )


# Convenience functions
def create_image_generator(api_key: Optional[str] = None, base_url: Optional[str] = None) -> ImageGenerator:
    """Create an image generator instance."""
    return ImageGenerator(api_key, base_url)


def generate_images(
    prompt: str,
    size: str = "1024x1024",
    quality: str = "standard",
    style: str = "vivid",
    n: int = 1,
    indian_theme: bool = True,
    api_key: Optional[str] = None,
    **kwargs
) -> ImageGenerationResponse:
    """Generate images with convenience function."""
    generator = create_image_generator(api_key)
    request = ImageGenerationRequest(
        prompt=prompt,
        size=size,
        quality=quality,
        style=style,
        n=n,
        indian_theme=indian_theme,
        **kwargs
    )
    return generator.generate_images(request)