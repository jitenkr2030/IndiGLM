"""
IndiGLM Advanced Multimodal AI System
Complete integration of text, voice, image, and video processing with Indian cultural context
"""

import asyncio
import base64
import io
import json
import logging
from typing import Dict, List, Optional, Union, Any, AsyncGenerator
from dataclasses import dataclass, asdict
from enum import Enum
import numpy as np
from PIL import Image
import soundfile as sf
import cv2
import speech_recognition as sr
from pydub import AudioSegment
from googletrans import Translator
import torch
import torchvision.transforms as transforms
from transformers import (
    AutoTokenizer, AutoModelForSpeechSeq2Seq, AutoProcessor, 
    AutoModelForVision2Seq, AutoModelForCausalLM, pipeline
)
import whisper
import openai

from .core import IndiGLMCore
from .cultural import CulturalContext
from .languages import LanguageManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModalityType(Enum):
    TEXT = "text"
    VOICE = "voice"
    IMAGE = "image"
    VIDEO = "video"

@dataclass
class MultimodalInput:
    """Input data for multimodal processing"""
    modality: ModalityType
    content: Union[str, bytes, np.ndarray]
    language: Optional[str] = None
    cultural_context: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

@dataclass
class MultimodalOutput:
    """Output from multimodal processing"""
    modality: ModalityType
    content: Union[str, bytes, np.ndarray]
    confidence: float
    cultural_context: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class MultimodalProcessor:
    """Handles processing of different modalities"""
    
    def __init__(self):
        self.text_processor = None
        self.voice_processor = None
        self.image_processor = None
        self.video_processor = None
        self._initialize_processors()
    
    def _initialize_processors(self):
        """Initialize all modality processors"""
        try:
            # Text processor
            self.text_processor = {
                'tokenizer': AutoTokenizer.from_pretrained('microsoft/DialoGPT-medium'),
                'model': AutoModelForCausalLM.from_pretrained('microsoft/DialoGPT-medium')
            }
            
            # Voice processor
            self.voice_processor = {
                'whisper_model': whisper.load_model('base'),
                'tts_engine': pipeline('text-to-speech', model='facebook/fastspeech2-en-ljspeech')
            }
            
            # Image processor
            self.image_processor = {
                'vision_model': AutoModelForVision2Seq.from_pretrained('Salesforce/blip2-opt-2.7b'),
                'processor': AutoProcessor.from_pretrained('Salesforce/blip2-opt-2.7b')
            }
            
            # Video processor
            self.video_processor = {
                'frame_extractor': self._extract_frames,
                'analyzer': self._analyze_video_frames
            }
            
            logger.info("All multimodal processors initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing processors: {e}")
            raise
    
    def _extract_frames(self, video_path: str, max_frames: int = 10) -> List[np.ndarray]:
        """Extract frames from video"""
        cap = cv2.VideoCapture(video_path)
        frames = []
        
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        frame_indices = np.linspace(0, total_frames-1, max_frames, dtype=int)
        
        for idx in frame_indices:
            cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
            ret, frame = cap.read()
            if ret:
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                frames.append(frame)
        
        cap.release()
        return frames
    
    def _analyze_video_frames(self, frames: List[np.ndarray]) -> Dict[str, Any]:
        """Analyze video frames for content understanding"""
        # Basic analysis - can be enhanced with more sophisticated models
        frame_count = len(frames)
        avg_brightness = np.mean([np.mean(frame) for frame in frames])
        
        return {
            'frame_count': frame_count,
            'avg_brightness': avg_brightness,
            'content_summary': f"Video contains {frame_count} frames with average brightness {avg_brightness:.2f}"
        }

class VoiceProcessor:
    """Specialized voice processing for Indian languages"""
    
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.translator = Translator()
        self.whisper_model = whisper.load_model('base')
        self.indian_language_codes = {
            'hi': 'hi-IN', 'ta': 'ta-IN', 'te': 'te-IN', 'bn': 'bn-IN',
            'mr': 'mr-IN', 'gu': 'gu-IN', 'kn': 'kn-IN', 'ml': 'ml-IN',
            'pa': 'pa-IN', 'or': 'or-IN', 'as': 'as-IN', 'ur': 'ur-IN'
        }
    
    async def speech_to_text(self, audio_data: bytes, language: str = 'hi') -> str:
        """Convert speech to text with Indian language support"""
        try:
            # Save audio data to temporary file
            with io.BytesIO(audio_data) as audio_file:
                audio_file.seek(0)
                
                # Use whisper for better multilingual support
                result = self.whisper_model.transcribe(audio_file, language=language)
                return result['text']
                
        except Exception as e:
            logger.error(f"Speech-to-text error: {e}")
            return ""
    
    async def text_to_speech(self, text: str, language: str = 'hi') -> bytes:
        """Convert text to speech with Indian language support"""
        try:
            # Use gTTS for Indian languages
            from gtts import gTTS
            
            # Map language codes for gTTS
            lang_map = {
                'hi': 'hi', 'ta': 'ta', 'te': 'te', 'bn': 'bn',
                'mr': 'mr', 'gu': 'gu', 'kn': 'kn', 'ml': 'ml',
                'pa': 'pa', 'or': 'or', 'ur': 'ur'
            }
            
            tts_lang = lang_map.get(language, 'hi')
            tts = gTTS(text=text, lang=tts_lang, slow=False)
            
            # Save to bytes
            audio_buffer = io.BytesIO()
            tts.write_to_fp(audio_buffer)
            audio_buffer.seek(0)
            
            return audio_buffer.read()
            
        except Exception as e:
            logger.error(f"Text-to-speech error: {e}")
            return b""

class ImageProcessor:
    """Specialized image processing with Indian cultural context"""
    
    def __init__(self):
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        self.cultural_context = CulturalContext()
    
    async def analyze_image(self, image_data: bytes) -> Dict[str, Any]:
        """Analyze image with Indian cultural context"""
        try:
            # Open image
            image = Image.open(io.BytesIO(image_data))
            
            # Basic image analysis
            analysis = {
                'size': image.size,
                'mode': image.mode,
                'format': image.format,
                'cultural_elements': [],
                'indian_context': None
            }
            
            # Detect cultural elements (simplified version)
            cultural_elements = await self._detect_cultural_elements(image)
            analysis['cultural_elements'] = cultural_elements
            
            # Add Indian context
            if cultural_elements:
                analysis['indian_context'] = await self.cultural_context.get_context_for_elements(cultural_elements)
            
            return analysis
            
        except Exception as e:
            logger.error(f"Image analysis error: {e}")
            return {}
    
    async def _detect_cultural_elements(self, image: Image.Image) -> List[str]:
        """Detect Indian cultural elements in image"""
        # Simplified cultural element detection
        # In production, this would use sophisticated CV models
        elements = []
        
        # Convert to numpy array for analysis
        img_array = np.array(image)
        
        # Basic color analysis for cultural elements
        avg_color = np.mean(img_array, axis=(0, 1))
        
        # Detect common Indian cultural colors
        if avg_color[0] > 200 and avg_color[1] > 100 and avg_color[2] < 100:  # Reddish
            elements.append("traditional_red")
        if avg_color[0] > 200 and avg_color[1] > 200 and avg_color[2] < 100:  # Yellow/Orange
            elements.append("festival_colors")
        if avg_color[0] < 100 and avg_color[1] < 100 and avg_color[2] > 150:  # Blueish
            elements.append("spiritual_blue")
        
        return elements

class VideoProcessor:
    """Specialized video processing with Indian cultural context"""
    
    def __init__(self):
        self.image_processor = ImageProcessor()
        self.cultural_context = CulturalContext()
    
    async def analyze_video(self, video_data: bytes) -> Dict[str, Any]:
        """Analyze video with Indian cultural context"""
        try:
            # Save video data to temporary file
            with open('/tmp/temp_video.mp4', 'wb') as f:
                f.write(video_data)
            
            # Extract frames
            frames = self._extract_frames('/tmp/temp_video.mp4', max_frames=20)
            
            analysis = {
                'frame_count': len(frames),
                'duration': self._get_video_duration('/tmp/temp_video.mp4'),
                'cultural_elements': [],
                'indian_context': None,
                'scene_analysis': []
            }
            
            # Analyze each frame
            for i, frame in enumerate(frames):
                frame_analysis = await self._analyze_frame(frame)
                analysis['scene_analysis'].append(frame_analysis)
                
                # Collect cultural elements
                if 'cultural_elements' in frame_analysis:
                    analysis['cultural_elements'].extend(frame_analysis['cultural_elements'])
            
            # Remove duplicates
            analysis['cultural_elements'] = list(set(analysis['cultural_elements']))
            
            # Add Indian context
            if analysis['cultural_elements']:
                analysis['indian_context'] = await self.cultural_context.get_context_for_elements(
                    analysis['cultural_elements']
                )
            
            return analysis
            
        except Exception as e:
            logger.error(f"Video analysis error: {e}")
            return {}
    
    def _extract_frames(self, video_path: str, max_frames: int = 20) -> List[np.ndarray]:
        """Extract frames from video"""
        cap = cv2.VideoCapture(video_path)
        frames = []
        
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        frame_indices = np.linspace(0, total_frames-1, max_frames, dtype=int)
        
        for idx in frame_indices:
            cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
            ret, frame = cap.read()
            if ret:
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                frames.append(frame)
        
        cap.release()
        return frames
    
    def _get_video_duration(self, video_path: str) -> float:
        """Get video duration in seconds"""
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = frame_count / fps if fps > 0 else 0
        cap.release()
        return duration
    
    async def _analyze_frame(self, frame: np.ndarray) -> Dict[str, Any]:
        """Analyze individual frame"""
        try:
            # Convert to PIL Image
            image = Image.fromarray(frame)
            
            # Convert to bytes for image processor
            img_buffer = io.BytesIO()
            image.save(img_buffer, format='JPEG')
            img_buffer.seek(0)
            
            # Use image processor
            analysis = await self.image_processor.analyze_image(img_buffer.read())
            return analysis
            
        except Exception as e:
            logger.error(f"Frame analysis error: {e}")
            return {}

class AdvancedMultimodalAI:
    """Complete Multimodal AI System for IndiGLM"""
    
    def __init__(self):
        self.core = IndiGLMCore()
        self.multimodal_processor = MultimodalProcessor()
        self.voice_processor = VoiceProcessor()
        self.image_processor = ImageProcessor()
        self.video_processor = VideoProcessor()
        self.cultural_context = CulturalContext()
        self.language_manager = LanguageManager()
    
    async def process_multimodal_input(self, input_data: MultimodalInput) -> MultimodalOutput:
        """Process multimodal input with Indian cultural context"""
        try:
            if input_data.modality == ModalityType.TEXT:
                return await self._process_text(input_data)
            elif input_data.modality == ModalityType.VOICE:
                return await self._process_voice(input_data)
            elif input_data.modality == ModalityType.IMAGE:
                return await self._process_image(input_data)
            elif input_data.modality == ModalityType.VIDEO:
                return await self._process_video(input_data)
            else:
                raise ValueError(f"Unsupported modality: {input_data.modality}")
                
        except Exception as e:
            logger.error(f"Error processing multimodal input: {e}")
            return MultimodalOutput(
                modality=input_data.modality,
                content="",
                confidence=0.0,
                cultural_context=None,
                metadata={"error": str(e)}
            )
    
    async def _process_text(self, input_data: MultimodalInput) -> MultimodalOutput:
        """Process text input with cultural context"""
        try:
            # Get cultural context if not provided
            cultural_context = input_data.cultural_context or await self.cultural_context.get_context(
                input_data.content, input_data.language or 'en'
            )
            
            # Process with core IndiGLM
            response = await self.core.generate_response(
                input_data.content,
                cultural_context=cultural_context,
                language=input_data.language or 'en'
            )
            
            return MultimodalOutput(
                modality=ModalityType.TEXT,
                content=response,
                confidence=0.95,
                cultural_context=cultural_context,
                metadata={"language": input_data.language or 'en'}
            )
            
        except Exception as e:
            logger.error(f"Text processing error: {e}")
            return MultimodalOutput(
                modality=ModalityType.TEXT,
                content="",
                confidence=0.0,
                cultural_context=None,
                metadata={"error": str(e)}
            )
    
    async def _process_voice(self, input_data: MultimodalInput) -> MultimodalOutput:
        """Process voice input with Indian language support"""
        try:
            # Convert speech to text
            text = await self.voice_processor.speech_to_text(
                input_data.content, 
                input_data.language or 'hi'
            )
            
            if not text:
                return MultimodalOutput(
                    modality=ModalityType.VOICE,
                    content="",
                    confidence=0.0,
                    cultural_context=None,
                    metadata={"error": "Speech recognition failed"}
                )
            
            # Get cultural context
            cultural_context = input_data.cultural_context or await self.cultural_context.get_context(
                text, input_data.language or 'hi'
            )
            
            # Process with core IndiGLM
            response = await self.core.generate_response(
                text,
                cultural_context=cultural_context,
                language=input_data.language or 'hi'
            )
            
            # Convert response back to speech
            speech_audio = await self.voice_processor.text_to_speech(
                response, 
                input_data.language or 'hi'
            )
            
            return MultimodalOutput(
                modality=ModalityType.VOICE,
                content=speech_audio,
                confidence=0.90,
                cultural_context=cultural_context,
                metadata={
                    "transcribed_text": text,
                    "response_text": response,
                    "language": input_data.language or 'hi'
                }
            )
            
        except Exception as e:
            logger.error(f"Voice processing error: {e}")
            return MultimodalOutput(
                modality=ModalityType.VOICE,
                content="",
                confidence=0.0,
                cultural_context=None,
                metadata={"error": str(e)}
            )
    
    async def _process_image(self, input_data: MultimodalInput) -> MultimodalOutput:
        """Process image input with Indian cultural context"""
        try:
            # Analyze image
            image_analysis = await self.image_processor.analyze_image(input_data.content)
            
            # Generate description based on analysis
            description = await self._generate_image_description(image_analysis)
            
            # Get cultural context
            cultural_context = input_data.cultural_context or image_analysis.get('indian_context')
            
            # Process with core IndiGLM
            response = await self.core.generate_response(
                f"Image analysis: {description}",
                cultural_context=cultural_context,
                language=input_data.language or 'en'
            )
            
            return MultimodalOutput(
                modality=ModalityType.IMAGE,
                content=response,
                confidence=0.85,
                cultural_context=cultural_context,
                metadata={
                    "image_analysis": image_analysis,
                    "description": description,
                    "language": input_data.language or 'en'
                }
            )
            
        except Exception as e:
            logger.error(f"Image processing error: {e}")
            return MultimodalOutput(
                modality=ModalityType.IMAGE,
                content="",
                confidence=0.0,
                cultural_context=None,
                metadata={"error": str(e)}
            )
    
    async def _process_video(self, input_data: MultimodalInput) -> MultimodalOutput:
        """Process video input with Indian cultural context"""
        try:
            # Analyze video
            video_analysis = await self.video_processor.analyze_video(input_data.content)
            
            # Generate description based on analysis
            description = await self._generate_video_description(video_analysis)
            
            # Get cultural context
            cultural_context = input_data.cultural_context or video_analysis.get('indian_context')
            
            # Process with core IndiGLM
            response = await self.core.generate_response(
                f"Video analysis: {description}",
                cultural_context=cultural_context,
                language=input_data.language or 'en'
            )
            
            return MultimodalOutput(
                modality=ModalityType.VIDEO,
                content=response,
                confidence=0.80,
                cultural_context=cultural_context,
                metadata={
                    "video_analysis": video_analysis,
                    "description": description,
                    "language": input_data.language or 'en'
                }
            )
            
        except Exception as e:
            logger.error(f"Video processing error: {e}")
            return MultimodalOutput(
                modality=ModalityType.VIDEO,
                content="",
                confidence=0.0,
                cultural_context=None,
                metadata={"error": str(e)}
            )
    
    async def _generate_image_description(self, analysis: Dict[str, Any]) -> str:
        """Generate natural language description from image analysis"""
        try:
            description_parts = []
            
            if 'size' in analysis:
                description_parts.append(f"Image size: {analysis['size']}")
            
            if 'cultural_elements' in analysis and analysis['cultural_elements']:
                elements = ", ".join(analysis['cultural_elements'])
                description_parts.append(f"Cultural elements detected: {elements}")
            
            if 'indian_context' in analysis and analysis['indian_context']:
                description_parts.append(f"Indian cultural context: {analysis['indian_context']}")
            
            return " | ".join(description_parts) if description_parts else "Image analysis completed"
            
        except Exception as e:
            logger.error(f"Error generating image description: {e}")
            return "Image analysis completed"
    
    async def _generate_video_description(self, analysis: Dict[str, Any]) -> str:
        """Generate natural language description from video analysis"""
        try:
            description_parts = []
            
            if 'frame_count' in analysis:
                description_parts.append(f"Video contains {analysis['frame_count']} frames")
            
            if 'duration' in analysis:
                description_parts.append(f"Duration: {analysis['duration']:.2f} seconds")
            
            if 'cultural_elements' in analysis and analysis['cultural_elements']:
                elements = ", ".join(analysis['cultural_elements'])
                description_parts.append(f"Cultural elements detected: {elements}")
            
            if 'indian_context' in analysis and analysis['indian_context']:
                description_parts.append(f"Indian cultural context: {analysis['indian_context']}")
            
            return " | ".join(description_parts) if description_parts else "Video analysis completed"
            
        except Exception as e:
            logger.error(f"Error generating video description: {e}")
            return "Video analysis completed"
    
    async def process_multimodal_conversation(
        self, 
        inputs: List[MultimodalInput]
    ) -> AsyncGenerator[MultimodalOutput, None]:
        """Process multimodal conversation with streaming output"""
        try:
            for input_data in inputs:
                output = await self.process_multimodal_input(input_data)
                yield output
                
        except Exception as e:
            logger.error(f"Error in multimodal conversation: {e}")
            yield MultimodalOutput(
                modality=ModalityType.TEXT,
                content=f"Error in conversation: {str(e)}",
                confidence=0.0,
                cultural_context=None,
                metadata={"error": str(e)}
            )

# Example usage and testing
async def test_multimodal_ai():
    """Test the multimodal AI system"""
    multimodal_ai = AdvancedMultimodalAI()
    
    # Test text input
    text_input = MultimodalInput(
        modality=ModalityType.TEXT,
        content="नमस्ते! भारत के बारे में बताएं",
        language="hi",
        cultural_context="indian_greeting"
    )
    
    text_output = await multimodal_ai.process_multimodal_input(text_input)
    print(f"Text Output: {text_output.content}")
    
    # Test image input (simulated)
    # In real usage, you would provide actual image bytes
    image_input = MultimodalInput(
        modality=ModalityType.IMAGE,
        content=b"fake_image_data",  # Replace with real image data
        language="en"
    )
    
    # image_output = await multimodal_ai.process_multimodal_input(image_input)
    # print(f"Image Output: {image_output.content}")

if __name__ == "__main__":
    asyncio.run(test_multimodal_ai())