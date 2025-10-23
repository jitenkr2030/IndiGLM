"""
IndiGLM Languages Module
========================

Language detection, processing, and support for 22+ Indian languages.
"""

import re
import unicodedata
from enum import Enum
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass


class IndianLanguage(Enum):
    """
    Enumeration of supported Indian languages.
    """
    HINDI = "hi"
    BENGALI = "bn"
    TELUGU = "te"
    MARATHI = "mr"
    TAMIL = "ta"
    GUJARATI = "gu"
    URDU = "ur"
    KANNADA = "kn"
    ODIA = "or"
    MALAYALAM = "ml"
    PUNJABI = "pa"
    ASSAMESE = "as"
    MAITHILI = "mai"
    SANSKRIT = "sa"
    KASHMIRI = "ks"
    NEPALI = "ne"
    SINDHI = "sd"
    DOGRI = "doi"
    KONKANI = "kok"
    SANTALI = "sat"
    MANIPURI = "mni"
    BODO = "brx"
    ENGLISH = "en"


@dataclass
class LanguageDetectionResult:
    """Result of language detection."""
    language: IndianLanguage
    confidence: float
    script_detected: Optional[str] = None
    alternative_languages: Optional[List[Tuple[IndianLanguage, float]]] = None


class ScriptType(Enum):
    """Indian script types."""
    DEVANAGARI = "devanagari"
    BENGALI = "bengali"
    TAMIL = "tamil"
    TELUGU = "telugu"
    KANNADA = "kannada"
    MALAYALAM = "malayalam"
    GUJARATI = "gujarati"
    GURMUKHI = "gurmukhi"
    ORIYA = "oriya"
    LATIN = "latin"
    ARABIC = "arabic"
    UNKNOWN = "unknown"


class LanguageDetector:
    """
    Language detection for Indian languages using Unicode patterns and statistical analysis.
    """
    
    def __init__(self):
        """Initialize language detector with script patterns."""
        self.script_patterns = self._initialize_script_patterns()
        self.language_scripts = self._initialize_language_scripts()
        self.common_words = self._initialize_common_words()
    
    def _initialize_script_patterns(self) -> Dict[ScriptType, List[str]]:
        """Initialize Unicode patterns for Indian scripts."""
        return {
            ScriptType.DEVANAGARI: [
                r'[\u0900-\u097F]',  # Devanagari
            ],
            ScriptType.BENGALI: [
                r'[\u0980-\u09FF]',  # Bengali
            ],
            ScriptType.TAMIL: [
                r'[\u0B80-\u0BFF]',  # Tamil
            ],
            ScriptType.TELUGU: [
                r'[\u0C00-\u0C7F]',  # Telugu
            ],
            ScriptType.KANNADA: [
                r'[\u0C80-\u0CFF]',  # Kannada
            ],
            ScriptType.MALAYALAM: [
                r'[\u0D00-\u0D7F]',  # Malayalam
            ],
            ScriptType.GUJARATI: [
                r'[\u0A80-\u0AFF]',  # Gujarati
            ],
            ScriptType.GURMUKHI: [
                r'[\u0A00-\u0A7F]',  # Gurmukhi
            ],
            ScriptType.ORIYA: [
                r'[\u0B00-\u0B7F]',  # Oriya
            ],
            ScriptType.ARABIC: [
                r'[\u0600-\u06FF]',  # Arabic (for Urdu)
            ],
            ScriptType.LATIN: [
                r'[a-zA-Z]',  # Latin script (for English)
            ]
        }
    
    def _initialize_language_scripts(self) -> Dict[IndianLanguage, List[ScriptType]]:
        """Initialize mapping of languages to their scripts."""
        return {
            IndianLanguage.HINDI: [ScriptType.DEVANAGARI],
            IndianLanguage.BENGALI: [ScriptType.BENGALI],
            IndianLanguage.TELUGU: [ScriptType.TELUGU],
            IndianLanguage.MARATHI: [ScriptType.DEVANAGARI],
            IndianLanguage.TAMIL: [ScriptType.TAMIL],
            IndianLanguage.GUJARATI: [ScriptType.GUJARATI],
            IndianLanguage.URDU: [ScriptType.ARABIC, ScriptType.DEVANAGARI],
            IndianLanguage.KANNADA: [ScriptType.KANNADA],
            IndianLanguage.ODIA: [ScriptType.ORIYA],
            IndianLanguage.MALAYALAM: [ScriptType.MALAYALAM],
            IndianLanguage.PUNJABI: [ScriptType.GURMUKHI],
            IndianLanguage.ASSAMESE: [ScriptType.BENGALI],
            IndianLanguage.MAITHILI: [ScriptType.DEVANAGARI],
            IndianLanguage.SANSKRIT: [ScriptType.DEVANAGARI],
            IndianLanguage.KASHMIRI: [ScriptType.ARABIC, ScriptType.DEVANAGARI],
            IndianLanguage.NEPALI: [ScriptType.DEVANAGARI],
            IndianLanguage.SINDHI: [ScriptType.ARABIC, ScriptType.DEVANAGARI],
            IndianLanguage.DOGRI: [ScriptType.DEVANAGARI],
            IndianLanguage.KONKANI: [ScriptType.DEVANAGARI],
            IndianLanguage.SANTALI: [ScriptType.DEVANAGARI],
            IndianLanguage.MANIPURI: [ScriptType.BENGALI],
            IndianLanguage.BODO: [ScriptType.DEVANAGARI],
            IndianLanguage.ENGLISH: [ScriptType.LATIN],
        }
    
    def _initialize_common_words(self) -> Dict[IndianLanguage, List[str]]:
        """Initialize common words for each language for better detection."""
        return {
            IndianLanguage.HINDI: [
                "है", "हैं", "था", "थे", "और", "या", "में", "से", "को", "ने", "का", "की", "के",
                "नमस्ते", "धन्यवाद", "शुभ", "प्रणाम"
            ],
            IndianLanguage.BENGALI: [
                "আছে", "ছিল", "এবং", "অথবা", "মধ্যে", "থেকে", "কে", "এর", "আমি", "তুমি",
                "নমস্কার", "ধন্যবাদ", "শুভ"
            ],
            IndianLanguage.TAMIL: [
                "உள்ளது", "இருந்தது", "மற்றும்", "அல்லது", "இல்", "இருந்து", "க்கு", "இன்",
                "வணக்கம்", "நன்றி", "சுப"
            ],
            IndianLanguage.TELUGU: [
                "ఉంది", "ఉంది", "మరియు", "లేదా", "లో", "నుండి", "కు", "యొక్క",
                "నమస్కారం", "ధన్యవాదాలు", "శుభం"
            ],
            IndianLanguage.MARATHI: [
                "आहे", "होते", "आणि", "किंवा", "मध्ये", "पासून", "ला", "चे", "मी", "तू",
                "नमस्कार", "धन्यवाद", "शुभ"
            ],
            IndianLanguage.GUJARATI: [
                "છે", "હતું", "અને", "અથવા", "માં", "થી", "ને", "નું", "હું", "તું",
                "નમસ્તે", "આભાર", "શુભ"
            ],
            IndianLanguage.URDU: [
                "ہے", "تھا", "اور", "یا", "میں", "سے", "کو", "کا", "میں", "تم",
                "السلام علیکم", "شکریہ", "خوش"
            ],
            IndianLanguage.KANNADA: [
                "ಇದೆ", "ಇತ್ತು", "ಮತ್ತು", "ಅಥವಾ", "ನಲ್ಲಿ", "ಇಂದ", "ಗೆ", "ನ", "ನಾನು", "ನೀನು",
                "ನಮಸ್ಕಾರ", "ಧನ್ಯವಾದಗಳು", "ಶುಭ"
            ],
            IndianLanguage.MALAYALAM: [
                "ഉണ്ട്", "ഉണ്ടായിരുന്നു", "ഒപ്പം", "അല്ലെങ്കിൽ", "ൽ", "ൽ നിന്ന്", "ക്ക്", "ന്റെ",
                "നമസ്കാരം", "നന്ദി", "ശുഭ"
            ],
            IndianLanguage.PUNJABI: [
                "ਹੈ", "ਸੀ", "ਅਤੇ", "ਜਾਂ", "ਵਿੱਚ", "ਤੋਂ", "ਨੂੰ", "ਦਾ", "ਮੈਂ", "ਤੂੰ",
                "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", "ਧੰਨਵਾਦ", "ਸੁਭ"
            ],
            IndianLanguage.ENGLISH: [
                "is", "was", "and", "or", "in", "from", "to", "of", "I", "you",
                "hello", "thank", "good"
            ]
        }
    
    def detect_script(self, text: str) -> ScriptType:
        """
        Detect the script used in the text.
        
        Args:
            text: Text to analyze
            
        Returns:
            Detected script type
        """
        script_counts = {script: 0 for script in ScriptType}
        
        for script, patterns in self.script_patterns.items():
            for pattern in patterns:
                matches = re.findall(pattern, text)
                script_counts[script] += len(matches)
        
        # Find the script with the most matches
        max_count = max(script_counts.values())
        if max_count == 0:
            return ScriptType.UNKNOWN
        
        return max(script_counts.items(), key=lambda x: x[1])[0]
    
    def detect_language(self, text: str) -> LanguageDetectionResult:
        """
        Detect the language of the given text.
        
        Args:
            text: Text to analyze
            
        Returns:
            LanguageDetectionResult with detected language and confidence
        """
        # Clean text
        cleaned_text = re.sub(r'[^\w\s\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0600-\u06FF]', '', text)
        
        if not cleaned_text.strip():
            return LanguageDetectionResult(
                language=IndianLanguage.ENGLISH,
                confidence=0.0,
                script_detected="unknown"
            )
        
        # Detect script
        detected_script = self.detect_script(text)
        
        # Get possible languages based on script
        possible_languages = []
        for lang, scripts in self.language_scripts.items():
            if detected_script in scripts:
                possible_languages.append(lang)
        
        # If no script-specific languages found, check common words
        if not possible_languages:
            return self._detect_by_common_words(cleaned_text)
        
        # Score each language based on common words
        language_scores = {}
        for lang in possible_languages:
            score = self._calculate_language_score(cleaned_text, lang)
            language_scores[lang] = score
        
        # Find the language with the highest score
        if not language_scores:
            return LanguageDetectionResult(
                language=IndianLanguage.ENGLISH,
                confidence=0.0,
                script_detected=detected_script.value
            )
        
        best_language = max(language_scores.items(), key=lambda x: x[1])
        confidence = min(best_language[1] / len(cleaned_text.split()), 1.0)
        
        # Get alternative languages
        alternatives = []
        for lang, score in language_scores.items():
            if lang != best_language[0] and score > 0:
                alternatives.append((lang, min(score / len(cleaned_text.split()), 1.0)))
        
        alternatives.sort(key=lambda x: x[1], reverse=True)
        alternatives = alternatives[:3]  # Top 3 alternatives
        
        return LanguageDetectionResult(
            language=best_language[0],
            confidence=confidence,
            script_detected=detected_script.value,
            alternative_languages=alternatives
        )
    
    def _detect_by_common_words(self, text: str) -> LanguageDetectionResult:
        """Detect language based on common words when script detection fails."""
        language_scores = {}
        
        for lang, words in self.common_words.items():
            score = 0
            text_lower = text.lower()
            for word in words:
                score += text_lower.count(word.lower())
            language_scores[lang] = score
        
        if not language_scores:
            return LanguageDetectionResult(
                language=IndianLanguage.ENGLISH,
                confidence=0.0,
                script_detected="unknown"
            )
        
        best_language = max(language_scores.items(), key=lambda x: x[1])
        confidence = min(best_language[1] / len(text.split()), 1.0) if text.split() else 0.0
        
        return LanguageDetectionResult(
            language=best_language[0],
            confidence=confidence,
            script_detected="unknown"
        )
    
    def _calculate_language_score(self, text: str, language: IndianLanguage) -> float:
        """Calculate score for a specific language based on common words."""
        if language not in self.common_words:
            return 0.0
        
        score = 0
        text_lower = text.lower()
        for word in self.common_words[language]:
            score += text_lower.count(word.lower())
        
        return score
    
    def get_language_name(self, language: IndianLanguage, native: bool = True) -> str:
        """
        Get the name of a language.
        
        Args:
            language: Language enum
            native: Whether to return native name or English name
            
        Returns:
            Language name
        """
        names = {
            IndianLanguage.HINDI: ("हिन्दी", "Hindi"),
            IndianLanguage.BENGALI: ("বাংলা", "Bengali"),
            IndianLanguage.TELUGU: ("తెలుగు", "Telugu"),
            IndianLanguage.MARATHI: ("मराठी", "Marathi"),
            IndianLanguage.TAMIL: ("தமிழ்", "Tamil"),
            IndianLanguage.GUJARATI: ("ગુજરાતી", "Gujarati"),
            IndianLanguage.URDU: ("اردو", "Urdu"),
            IndianLanguage.KANNADA: ("ಕನ್ನಡ", "Kannada"),
            IndianLanguage.ODIA: ("ଓଡ଼ିଆ", "Odia"),
            IndianLanguage.MALAYALAM: ("മലയാളം", "Malayalam"),
            IndianLanguage.PUNJABI: ("ਪੰਜਾਬੀ", "Punjabi"),
            IndianLanguage.ASSAMESE: ("অসমীয়া", "Assamese"),
            IndianLanguage.MAITHILI: ("मैथिली", "Maithili"),
            IndianLanguage.SANSKRIT: ("संस्कृतम्", "Sanskrit"),
            IndianLanguage.KASHMIRI: ("کٲشُر", "Kashmiri"),
            IndianLanguage.NEPALI: ("नेपाली", "Nepali"),
            IndianLanguage.SINDHI: ("سنڌي", "Sindhi"),
            IndianLanguage.DOGRI: ("ڈوگرى", "Dogri"),
            IndianLanguage.KONKANI: ("कोंकणी", "Konkani"),
            IndianLanguage.SANTALI: ("ᱥᱟᱱᱛᱟᱲᱤ", "Santali"),
            IndianLanguage.MANIPURI: ("ꯃꯩꯇꯩꯂꯣꯟ", "Manipuri"),
            IndianLanguage.BODO: ("बोड़ो", "Bodo"),
            IndianLanguage.ENGLISH: ("English", "English")
        }
        
        native_name, english_name = names.get(language, ("Unknown", "Unknown"))
        return native_name if native else english_name
    
    def get_script_name(self, script: ScriptType) -> str:
        """
        Get the name of a script.
        
        Args:
            script: Script enum
            
        Returns:
            Script name
        """
        script_names = {
            ScriptType.DEVANAGARI: "Devanagari",
            ScriptType.BENGALI: "Bengali",
            ScriptType.TAMIL: "Tamil",
            ScriptType.TELUGU: "Telugu",
            ScriptType.KANNADA: "Kannada",
            ScriptType.MALAYALAM: "Malayalam",
            ScriptType.GUJARATI: "Gujarati",
            ScriptType.GURMUKHI: "Gurmukhi",
            ScriptType.ORIYA: "Oriya",
            ScriptType.ARABIC: "Arabic",
            ScriptType.LATIN: "Latin",
            ScriptType.UNKNOWN: "Unknown"
        }
        
        return script_names.get(script, "Unknown")
    
    def is_code_switching(self, text: str) -> bool:
        """
        Detect if the text contains code-switching between languages.
        
        Args:
            text: Text to analyze
            
        Returns:
            True if code-switching is detected
        """
        words = text.split()
        if len(words) < 3:
            return False
        
        scripts_detected = set()
        for word in words:
            script = self.detect_script(word)
            if script != ScriptType.UNKNOWN:
                scripts_detected.add(script)
        
        return len(scripts_detected) > 1
    
    def get_language_statistics(self, text: str) -> Dict[str, Any]:
        """
        Get detailed statistics about language usage in the text.
        
        Args:
            text: Text to analyze
            
        Returns:
            Dictionary with language statistics
        """
        detection_result = self.detect_language(text)
        
        words = text.split()
        script_distribution = {}
        
        for word in words:
            script = self.detect_script(word)
            script_name = self.get_script_name(script)
            script_distribution[script_name] = script_distribution.get(script_name, 0) + 1
        
        return {
            "primary_language": {
                "code": detection_result.language.value,
                "name": self.get_language_name(detection_result.language),
                "confidence": detection_result.confidence
            },
            "script_detected": detection_result.script_detected,
            "code_switching": self.is_code_switching(text),
            "script_distribution": script_distribution,
            "total_words": len(words),
            "alternative_languages": [
                {
                    "code": lang.value,
                    "name": self.get_language_name(lang),
                    "confidence": conf
                }
                for lang, conf in detection_result.alternative_languages or []
            ]
        }