"""
IndiGLM Real-time Translation Engine
Instant translation between all Indian languages with cultural context preservation
"""

import asyncio
import json
import logging
from typing import Dict, List, Optional, Union, AsyncGenerator
from dataclasses import dataclass, asdict
from enum import Enum
import time
from concurrent.futures import ThreadPoolExecutor
import numpy as np

from googletrans import Translator, LANGUAGES
from indic_transliteration import sanscript
from indic_transliteration.sanscript import SchemeMap, SCHEMES
import torch
from transformers import (
    AutoTokenizer, AutoModelForSeq2SeqLM, pipeline,
    MarianMTModel, MarianTokenizer
)

from .core import IndiGLMCore
from .cultural import CulturalContext
from .languages import LanguageManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TranslationDirection(Enum):
    """Translation direction types"""
    ENGLISH_TO_INDIAN = "english_to_indian"
    INDIAN_TO_ENGLISH = "indian_to_english"
    INDIAN_TO_INDIAN = "indian_to_indian"

@dataclass
class TranslationRequest:
    """Translation request data"""
    text: str
    source_language: str
    target_language: str
    preserve_cultural_context: bool = True
    preserve_script: bool = False
    domain: Optional[str] = None  # e.g., 'medical', 'legal', 'technical'
    metadata: Optional[Dict[str, any]] = None

@dataclass
class TranslationResponse:
    """Translation response data"""
    translated_text: str
    source_language: str
    target_language: str
    confidence: float
    cultural_context_preserved: bool
    script_preserved: bool
    translation_time: float
    alternatives: Optional[List[str]] = None
    metadata: Optional[Dict[str, any]] = None

@dataclass
class CulturalTerm:
    """Cultural term mapping"""
    term: str
    translation: str
    cultural_context: str
    confidence: float
    alternatives: List[str]

class IndianLanguageSupport:
    """Comprehensive support for all Indian languages"""
    
    def __init__(self):
        self.languages = {
            # Official languages
            'hi': {'name': 'Hindi', 'script': 'Devanagari', 'speakers': '528M'},
            'bn': {'name': 'Bengali', 'script': 'Bengali', 'speakers': '230M'},
            'te': {'name': 'Telugu', 'script': 'Telugu', 'speakers': '81M'},
            'mr': {'name': 'Marathi', 'script': 'Devanagari', 'speakers': '83M'},
            'ta': {'name': 'Tamil', 'script': 'Tamil', 'speakers': '78M'},
            'ur': {'name': 'Urdu', 'script': 'Perso-Arabic', 'speakers': '170M'},
            'gu': {'name': 'Gujarati', 'script': 'Gujarati', 'speakers': '56M'},
            'kn': {'name': 'Kannada', 'script': 'Kannada', 'speakers': '44M'},
            'ml': {'name': 'Malayalam', 'script': 'Malayalam', 'speakers': '38M'},
            'or': {'name': 'Odia', 'script': 'Odia', 'speakers': '35M'},
            'pa': {'name': 'Punjabi', 'script': 'Gurmukhi', 'speakers': '125M'},
            'as': {'name': 'Assamese', 'script': 'Assamese', 'speakers': '15M'},
            'sd': {'name': 'Sindhi', 'script': 'Perso-Arabic', 'speakers': '25M'},
            
            # Classical and regional languages
            'sa': {'name': 'Sanskrit', 'script': 'Devanagari', 'speakers': '14K'},
            'ne': {'name': 'Nepali', 'script': 'Devanagari', 'speakers': '16M'},
            'si': {'name': 'Sinhala', 'script': 'Sinhala', 'speakers': '17M'},
            'dv': {'name': 'Dhivehi', 'script': 'Thaana', 'speakers': '300K'},
            
            # Additional regional languages
            'mni': {'name': 'Manipuri', 'script': 'Meitei', 'speakers': '1.5M'},
            'kok': {'name': 'Konkani', 'script': 'Devanagari', 'speakers': '2.2M'},
            'ks': {'name': 'Kashmiri', 'script': 'Perso-Arabic', 'speakers': '6.8M'},
            'doi': {'name': 'Dogri', 'script': 'Takri', 'speakers': '2.3M'},
            'mai': {'name': 'Maithili', 'script': 'Tirhuta', 'speakers': '34M'},
            'brx': {'name': 'Bodo', 'script': 'Devanagari', 'speakers': '1.4M'},
            'sat': {'name': 'Santali', 'script': 'Ol Chiki', 'speakers': '7.3M'},
        }
        
        self.script_mapping = {
            'Devanagari': ['hi', 'mr', 'ne', 'sa', 'kok', 'mai', 'brx'],
            'Bengali': ['bn'],
            'Telugu': ['te'],
            'Tamil': ['ta'],
            'Perso-Arabic': ['ur', 'sd', 'ks'],
            'Gujarati': ['gu'],
            'Kannada': ['kn'],
            'Malayalam': ['ml'],
            'Odia': ['or'],
            'Gurmukhi': ['pa'],
            'Assamese': ['as'],
            'Sinhala': ['si'],
            'Thaana': ['dv'],
            'Meitei': ['mni'],
            'Takri': ['doi'],
            'Tirhuta': ['mai'],
            'Ol Chiki': ['sat']
        }
        
        self.cultural_terms = self._load_cultural_terms()
    
    def _load_cultural_terms(self) -> Dict[str, List[CulturalTerm]]:
        """Load cultural terms and their translations"""
        return {
            'festivals': [
                CulturalTerm('Diwali', 'दीपावली', 'Festival of lights', 0.98, ['Deepavali']),
                CulturalTerm('Holi', 'होली', 'Festival of colors', 0.98, ['Festival of spring']),
                CulturalTerm('Eid', 'ईद', 'Islamic festival', 0.96, ['Eid al-Fitr', 'Eid al-Adha']),
                CulturalTerm('Christmas', 'क्रिसमस', 'Christian festival', 0.95, ['Xmas']),
                CulturalTerm('Pongal', 'पोंगल', 'Tamil harvest festival', 0.94, ['Thai Pongal']),
                CulturalTerm('Baisakhi', 'बैसाखी', 'Punjabi harvest festival', 0.93, ['Vaisakhi']),
                CulturalTerm('Onam', 'ओणम', 'Kerala harvest festival', 0.92, ['Thiruvonam']),
                CulturalTerm('Durga Puja', 'दुर्गा पूजा', 'Bengali festival', 0.94, ['Durgotsava']),
            ],
            'food': [
                CulturalTerm('Roti', 'रोटी', 'Indian bread', 0.99, ['Chapati', 'Phulka']),
                CulturalTerm('Curry', 'करी', 'Spiced dish', 0.97, ['Sabzi', 'Masala']),
                CulturalTerm('Biryani', 'बिरयानी', 'Spiced rice dish', 0.98, ['Biriyani']),
                CulturalTerm('Dosai', 'डोसा', 'South Indian pancake', 0.96, ['Dosa']),
                CulturalTerm('Samosa', 'समोसा', 'Fried pastry', 0.97, ['Singara']),
                CulturalTerm('Paneer', 'पनीर', 'Indian cheese', 0.98, ['Cottage cheese']),
            ],
            'clothing': [
                CulturalTerm('Sari', 'साड़ी', 'Traditional dress', 0.99, ['Saree']),
                CulturalTerm('Kurta', 'कुर्ता', 'Traditional shirt', 0.98, ['Kurti']),
                CulturalTerm('Dhoti', 'धोती', 'Traditional garment', 0.97, ['Veshti']),
                CulturalTerm('Salwar', 'सलवार', 'Traditional pants', 0.96, ['Shalwar']),
                CulturalTerm('Dupatta', 'दुपट्टा', 'Scarf', 0.95, ['Chunni']),
            ],
            'customs': [
                CulturalTerm('Namaste', 'नमस्ते', 'Greeting', 0.99, ['Namaskar']),
                CulturalTerm('Pranam', 'प्रणाम', 'Respectful greeting', 0.98, ['Pranama']),
                CulturalTerm('Aarti', 'आरती', 'Worship ritual', 0.97, ['Arti']),
                CulturalTerm('Puja', 'पूजा', 'Worship', 0.96, ['Pooja']),
                CulturalTerm('Darshan', 'दर्शन', 'Viewing deity', 0.95, ['Darshana']),
            ]
        }
    
    def get_language_info(self, lang_code: str) -> Dict[str, str]:
        """Get language information by code"""
        return self.languages.get(lang_code, {})
    
    def get_languages_by_script(self, script: str) -> List[str]:
        """Get all languages that use a specific script"""
        return self.script_mapping.get(script, [])
    
    def get_cultural_terms(self, category: str = None) -> List[CulturalTerm]:
        """Get cultural terms, optionally filtered by category"""
        if category:
            return self.cultural_terms.get(category, [])
        else:
            all_terms = []
            for terms in self.cultural_terms.values():
                all_terms.extend(terms)
            return all_terms

class NeuralTranslationEngine:
    """Neural machine translation engine for Indian languages"""
    
    def __init__(self):
        self.models = {}
        self.tokenizers = {}
        self.translator = Translator()
        self.indian_lang_support = IndianLanguageSupport()
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize translation models"""
        try:
            # Initialize MarianMT models for major language pairs
            model_pairs = [
                ('en', 'hi'), ('hi', 'en'),
                ('en', 'ta'), ('ta', 'en'),
                ('en', 'te'), ('te', 'en'),
                ('en', 'bn'), ('bn', 'en'),
                ('en', 'mr'), ('mr', 'en'),
                ('en', 'gu'), ('gu', 'en'),
                ('en', 'kn'), ('kn', 'en'),
                ('en', 'ml'), ('ml', 'en'),
                ('en', 'pa'), ('pa', 'en'),
            ]
            
            for src_lang, tgt_lang in model_pairs:
                model_name = f'Helsinki-NLP/opus-mt-{src_lang}-{tgt_lang}'
                try:
                    self.models[(src_lang, tgt_lang)] = MarianMTModel.from_pretrained(model_name)
                    self.tokenizers[(src_lang, tgt_lang)] = MarianTokenizer.from_pretrained(model_name)
                    logger.info(f"Loaded model for {src_lang} -> {tgt_lang}")
                except Exception as e:
                    logger.warning(f"Could not load model for {src_lang} -> {tgt_lang}: {e}")
            
            # Initialize multilingual models for broader coverage
            self.multilingual_model = pipeline(
                'translation',
                model='facebook/mbart-large-50-many-to-many-mmt'
            )
            
            logger.info("Neural translation engine initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing translation models: {e}")
    
    async def translate_text(
        self, 
        text: str, 
        source_lang: str, 
        target_lang: str,
        preserve_cultural_context: bool = True
    ) -> Dict[str, any]:
        """Translate text between languages"""
        start_time = time.time()
        
        try:
            # Check if direct model is available
            model_key = (source_lang, target_lang)
            
            if model_key in self.models:
                # Use specialized model
                result = await self._translate_with_model(text, model_key)
            else:
                # Use multilingual model or fallback
                result = await self._translate_with_multilingual(text, source_lang, target_lang)
            
            # Apply cultural context preservation if requested
            if preserve_cultural_context:
                result = await self._apply_cultural_context(result, source_lang, target_lang)
            
            translation_time = time.time() - start_time
            
            return {
                'translated_text': result['text'],
                'confidence': result.get('confidence', 0.8),
                'translation_time': translation_time,
                'method': result.get('method', 'multilingual'),
                'cultural_context_preserved': preserve_cultural_context
            }
            
        except Exception as e:
            logger.error(f"Translation error: {e}")
            return {
                'translated_text': text,  # Return original text on error
                'confidence': 0.0,
                'translation_time': time.time() - start_time,
                'method': 'error',
                'cultural_context_preserved': False,
                'error': str(e)
            }
    
    async def _translate_with_model(self, text: str, model_key: tuple) -> Dict[str, any]:
        """Translate using a specific model"""
        try:
            model = self.models[model_key]
            tokenizer = self.tokenizers[model_key]
            
            # Tokenize and translate
            inputs = tokenizer(text, return_tensors="pt", padding=True)
            outputs = model.generate(**inputs)
            translated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            return {
                'text': translated_text,
                'confidence': 0.9,
                'method': 'specialized_model'
            }
            
        except Exception as e:
            logger.error(f"Specialized model translation error: {e}")
            raise
    
    async def _translate_with_multilingual(self, text: str, source_lang: str, target_lang: str) -> Dict[str, any]:
        """Translate using multilingual model"""
        try:
            # Map language codes for mBART
            lang_map = {
                'hi': 'hi_IN', 'ta': 'ta_IN', 'te': 'te_IN', 'bn': 'bn_IN',
                'mr': 'mr_IN', 'gu': 'gu_IN', 'kn': 'kn_IN', 'ml': 'ml_IN',
                'pa': 'pa_IN', 'or': 'or_IN', 'as': 'as_IN', 'ur': 'ur_PK',
                'en': 'en_XX'
            }
            
            src_lang_code = lang_map.get(source_lang, source_lang)
            tgt_lang_code = lang_map.get(target_lang, target_lang)
            
            # Use multilingual pipeline
            result = self.multilingual_model(
                text,
                src_lang=src_lang_code,
                tgt_lang=tgt_lang_code
            )
            
            return {
                'text': result[0]['translation_text'],
                'confidence': 0.7,
                'method': 'multilingual_model'
            }
            
        except Exception as e:
            logger.error(f"Multilingual model translation error: {e}")
            # Fallback to Google Translate
            try:
                translated = self.translator.translate(text, src=source_lang, dest=target_lang)
                return {
                    'text': translated.text,
                    'confidence': 0.6,
                    'method': 'google_translate_fallback'
                }
            except Exception as fallback_error:
                logger.error(f"Fallback translation error: {fallback_error}")
                raise
    
    async def _apply_cultural_context(self, result: Dict[str, any], source_lang: str, target_lang: str) -> Dict[str, any]:
        """Apply cultural context preservation"""
        try:
            text = result['text']
            cultural_terms = self.indian_lang_support.get_cultural_terms()
            
            # Find and replace cultural terms
            for term in cultural_terms:
                if term.term.lower() in text.lower():
                    # Replace with culturally appropriate translation
                    text = text.replace(term.term, term.translation)
                    result['text'] = text
                    result['cultural_terms_preserved'] = True
            
            return result
            
        except Exception as e:
            logger.error(f"Cultural context application error: {e}")
            return result

class RealTimeTranslationEngine:
    """Real-time translation engine for Indian languages"""
    
    def __init__(self):
        self.neural_engine = NeuralTranslationEngine()
        self.indian_lang_support = IndianLanguageSupport()
        self.cultural_context = CulturalContext()
        self.language_manager = LanguageManager()
        self.cache = {}
        self.executor = ThreadPoolExecutor(max_workers=10)
    
    async def translate(
        self, 
        request: TranslationRequest
    ) -> TranslationResponse:
        """Translate text in real-time"""
        start_time = time.time()
        
        try:
            # Check cache first
            cache_key = f"{request.source_language}_{request.target_language}_{hash(request.text)}"
            if cache_key in self.cache:
                cached_result = self.cache[cache_key]
                return TranslationResponse(
                    translated_text=cached_result['translated_text'],
                    source_language=request.source_language,
                    target_language=request.target_language,
                    confidence=cached_result['confidence'],
                    cultural_context_preserved=cached_result['cultural_context_preserved'],
                    script_preserved=request.preserve_script,
                    translation_time=0.001,  # Cache hit
                    alternatives=cached_result.get('alternatives'),
                    metadata=cached_result.get('metadata')
                )
            
            # Perform translation
            translation_result = await self.neural_engine.translate_text(
                request.text,
                request.source_language,
                request.target_language,
                request.preserve_cultural_context
            )
            
            # Generate alternatives
            alternatives = await self._generate_alternatives(
                request.text,
                request.source_language,
                request.target_language
            )
            
            # Create response
            response = TranslationResponse(
                translated_text=translation_result['translated_text'],
                source_language=request.source_language,
                target_language=request.target_language,
                confidence=translation_result['confidence'],
                cultural_context_preserved=translation_result['cultural_context_preserved'],
                script_preserved=request.preserve_script,
                translation_time=translation_result['translation_time'],
                alternatives=alternatives,
                metadata={
                    'method': translation_result['method'],
                    'domain': request.domain,
                    'original_text': request.text
                }
            )
            
            # Cache result
            self.cache[cache_key] = {
                'translated_text': translation_result['translated_text'],
                'confidence': translation_result['confidence'],
                'cultural_context_preserved': translation_result['cultural_context_preserved'],
                'alternatives': alternatives,
                'metadata': response.metadata
            }
            
            return response
            
        except Exception as e:
            logger.error(f"Translation request error: {e}")
            return TranslationResponse(
                translated_text=request.text,  # Return original on error
                source_language=request.source_language,
                target_language=request.target_language,
                confidence=0.0,
                cultural_context_preserved=False,
                script_preserved=request.preserve_script,
                translation_time=time.time() - start_time,
                metadata={'error': str(e)}
            )
    
    async def _generate_alternatives(
        self, 
        text: str, 
        source_lang: str, 
        target_lang: str
    ) -> List[str]:
        """Generate alternative translations"""
        try:
            alternatives = []
            
            # Generate 2-3 alternative translations using different methods
            methods = ['google_translate', 'multilingual_model']
            
            for method in methods:
                try:
                    if method == 'google_translate':
                        translator = Translator()
                        result = translator.translate(text, src=source_lang, dest=target_lang)
                        alternatives.append(result.text)
                    elif method == 'multilingual_model':
                        # Use different parameters for variation
                        result = await self.neural_engine._translate_with_multilingual(
                            text, source_lang, target_lang
                        )
                        alternatives.append(result['text'])
                    
                    if len(alternatives) >= 2:
                        break
                        
                except Exception as e:
                    logger.warning(f"Alternative translation method {method} failed: {e}")
                    continue
            
            return alternatives[:2]  # Return up to 2 alternatives
            
        except Exception as e:
            logger.error(f"Error generating alternatives: {e}")
            return []
    
    async def batch_translate(
        self, 
        requests: List[TranslationRequest]
    ) -> List[TranslationResponse]:
        """Translate multiple texts in batch"""
        try:
            # Use ThreadPoolExecutor for parallel processing
            loop = asyncio.get_event_loop()
            tasks = [
                loop.run_in_executor(self.executor, self.translate, request)
                for request in requests
            ]
            
            return await asyncio.gather(*tasks)
            
        except Exception as e:
            logger.error(f"Batch translation error: {e}")
            return []
    
    async def stream_translate(
        self, 
        text_stream: AsyncGenerator[str, None],
        source_lang: str,
        target_lang: str
    ) -> AsyncGenerator[TranslationResponse, None]:
        """Stream translation for real-time communication"""
        try:
            async for text_chunk in text_stream:
                request = TranslationRequest(
                    text=text_chunk,
                    source_language=source_lang,
                    target_language=target_lang,
                    preserve_cultural_context=True
                )
                
                response = await self.translate(request)
                yield response
                
        except Exception as e:
            logger.error(f"Stream translation error: {e}")
            yield TranslationResponse(
                translated_text="",
                source_language=source_lang,
                target_language=target_lang,
                confidence=0.0,
                cultural_context_preserved=False,
                script_preserved=False,
                translation_time=0.0,
                metadata={'error': str(e)}
            )
    
    def get_supported_languages(self) -> Dict[str, Dict[str, str]]:
        """Get all supported languages"""
        return self.indian_lang_support.languages
    
    def get_translation_direction(self, source_lang: str, target_lang: str) -> TranslationDirection:
        """Determine translation direction"""
        if source_lang == 'en':
            return TranslationDirection.ENGLISH_TO_INDIAN
        elif target_lang == 'en':
            return TranslationDirection.INDIAN_TO_ENGLISH
        else:
            return TranslationDirection.INDIAN_TO_INDIAN

# Example usage
async def test_translation_engine():
    """Test the real-time translation engine"""
    engine = RealTimeTranslationEngine()
    
    # Test Hindi to English translation
    request = TranslationRequest(
        text="नमस्ते! आप कैसे हैं?",
        source_language="hi",
        target_language="en",
        preserve_cultural_context=True
    )
    
    response = await engine.translate(request)
    print(f"Translation: {response.translated_text}")
    print(f"Confidence: {response.confidence}")
    print(f"Time: {response.translation_time:.3f}s")
    
    # Test English to Tamil translation
    request2 = TranslationRequest(
        text="Hello! How are you?",
        source_language="en",
        target_language="ta",
        preserve_cultural_context=True
    )
    
    response2 = await engine.translate(request2)
    print(f"Tamil Translation: {response2.translated_text}")
    print(f"Alternatives: {response2.alternatives}")

if __name__ == "__main__":
    asyncio.run(test_translation_engine())