"""
IndiGLM Hyper-personalization System
Individual-level cultural and linguistic adaptation with deep user understanding
"""

import asyncio
import json
import logging
from typing import Dict, List, Optional, Union, AsyncGenerator
from dataclasses import dataclass, asdict, field
from enum import Enum
import time
from datetime import datetime, timedelta
import hashlib
import numpy as np
from collections import defaultdict, deque
import pickle

from .core import IndiGLMCore
from .cultural import CulturalContext
from .languages import LanguageManager
from .realtime_translation import RealTimeTranslationEngine

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PersonalizationLevel(Enum):
    """Levels of personalization"""
    BASIC = "basic"           # Language and basic preferences
    CULTURAL = "cultural"     # Cultural context and traditions
    LINGUISTIC = "linguistic"  # Language patterns and dialects
    BEHAVIORAL = "behavioral"  # User behavior and interaction patterns
    DEEP = "deep"            # Comprehensive personality and context

class UserProfile:
    """Comprehensive user profile for hyper-personalization"""
    
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.created_at = datetime.now()
        self.last_updated = datetime.now()
        
        # Basic information
        self.name: Optional[str] = None
        self.age: Optional[int] = None
        self.gender: Optional[str] = None
        self.location: Optional[str] = None
        self.primary_language: str = "en"
        self.secondary_languages: List[str] = []
        
        # Cultural background
        self.cultural_background: Dict[str, any] = {}
        self.religion: Optional[str] = None
        self.caste: Optional[str] = None
        self.region: Optional[str] = None
        self.state: Optional[str] = None
        self.city: Optional[str] = None
        
        # Linguistic preferences
        self.language_proficiency: Dict[str, float] = {}
        self.preferred_dialect: Dict[str, str] = {}
        self.code_switching_patterns: List[str] = []
        self.formality_level: float = 0.5  # 0 = very informal, 1 = very formal
        self.communication_style: str = "balanced"  # formal, informal, balanced
        
        # Behavioral patterns
        self.interaction_history: deque = deque(maxlen=1000)
        self.response_preferences: Dict[str, float] = {}
        self.topic_interests: Dict[str, float] = {}
        self.learning_style: str = "visual"  # visual, auditory, kinesthetic
        self.engagement_patterns: Dict[str, any] = {}
        
        # Personality traits (Big Five model)
        self.personality_traits: Dict[str, float] = {
            'openness': 0.5,
            'conscientiousness': 0.5,
            'extraversion': 0.5,
            'agreeableness': 0.5,
            'neuroticism': 0.5
        }
        
        # Contextual preferences
        self.time_preferences: Dict[str, any] = {}
        self.device_preferences: Dict[str, any] = {}
        self.situational_context: Dict[str, any] = {}
        
        # Adaptation metrics
        self.adaptation_score: float = 0.0
        self.personalization_level: PersonalizationLevel = PersonalizationLevel.BASIC
        self.last_adaptation: Optional[datetime] = None
        
    def update_profile(self, update_data: Dict[str, any]):
        """Update user profile with new data"""
        for key, value in update_data.items():
            if hasattr(self, key):
                setattr(self, key, value)
        
        self.last_updated = datetime.now()
        self._calculate_adaptation_score()
    
    def add_interaction(self, interaction: Dict[str, any]):
        """Add interaction to history"""
        self.interaction_history.append({
            'timestamp': datetime.now(),
            'interaction': interaction
        })
        self._update_behavioral_patterns(interaction)
    
    def _update_behavioral_patterns(self, interaction: Dict[str, any]):
        """Update behavioral patterns based on interaction"""
        # Update topic interests
        if 'topic' in interaction:
            topic = interaction['topic']
            self.topic_interests[topic] = self.topic_interests.get(topic, 0) + 0.1
        
        # Update response preferences
        if 'response_type' in interaction:
            response_type = interaction['response_type']
            self.response_preferences[response_type] = self.response_preferences.get(response_type, 0) + 0.1
        
        # Normalize scores
        self._normalize_scores()
    
    def _normalize_scores(self):
        """Normalize all score-based attributes"""
        # Normalize topic interests
        if self.topic_interests:
            total = sum(self.topic_interests.values())
            if total > 0:
                self.topic_interests = {k: v/total for k, v in self.topic_interests.items()}
        
        # Normalize response preferences
        if self.response_preferences:
            total = sum(self.response_preferences.values())
            if total > 0:
                self.response_preferences = {k: v/total for k, v in self.response_preferences.items()}
    
    def _calculate_adaptation_score(self):
        """Calculate overall adaptation score"""
        factors = {
            'language_proficiency': len(self.language_proficiency) * 0.1,
            'cultural_background': len(self.cultural_background) * 0.15,
            'interaction_history': len(self.interaction_history) * 0.001,
            'topic_interests': len(self.topic_interests) * 0.1,
            'personality_traits': sum(abs(v - 0.5) for v in self.personality_traits.values()) * 0.2
        }
        
        self.adaptation_score = min(1.0, sum(factors.values()))
        
        # Update personalization level based on score
        if self.adaptation_score >= 0.8:
            self.personalization_level = PersonalizationLevel.DEEP
        elif self.adaptation_score >= 0.6:
            self.personalization_level = PersonalizationLevel.BEHAVIORAL
        elif self.adaptation_score >= 0.4:
            self.personalization_level = PersonalizationLevel.LINGUISTIC
        elif self.adaptation_score >= 0.2:
            self.personalization_level = PersonalizationLevel.CULTURAL
        else:
            self.personalization_level = PersonalizationLevel.BASIC
    
    def to_dict(self) -> Dict[str, any]:
        """Convert profile to dictionary"""
        return {
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat(),
            'last_updated': self.last_updated.isoformat(),
            'name': self.name,
            'age': self.age,
            'gender': self.gender,
            'location': self.location,
            'primary_language': self.primary_language,
            'secondary_languages': self.secondary_languages,
            'cultural_background': self.cultural_background,
            'religion': self.religion,
            'caste': self.caste,
            'region': self.region,
            'state': self.state,
            'city': self.city,
            'language_proficiency': self.language_proficiency,
            'preferred_dialect': self.preferred_dialect,
            'code_switching_patterns': self.code_switching_patterns,
            'formality_level': self.formality_level,
            'communication_style': self.communication_style,
            'interaction_history': list(self.interaction_history),
            'response_preferences': self.response_preferences,
            'topic_interests': self.topic_interests,
            'learning_style': self.learning_style,
            'engagement_patterns': self.engagement_patterns,
            'personality_traits': self.personality_traits,
            'time_preferences': self.time_preferences,
            'device_preferences': self.device_preferences,
            'situational_context': self.situational_context,
            'adaptation_score': self.adaptation_score,
            'personalization_level': self.personalization_level.value,
            'last_adaptation': self.last_adaptation.isoformat() if self.last_adaptation else None
        }

@dataclass
class PersonalizationRequest:
    """Request for personalized response"""
    user_id: str
    input_text: str
    context: Optional[Dict[str, any]] = None
    modality: str = "text"  # text, voice, image, video
    request_type: str = "general"  # general, question, command, conversation
    metadata: Optional[Dict[str, any]] = None

@dataclass
class PersonalizationResponse:
    """Personalized response"""
    user_id: str
    personalized_text: str
    adaptations: List[str]
    confidence: float
    personalization_level: PersonalizationLevel
    adaptation_details: Dict[str, any]
    processing_time: float
    metadata: Optional[Dict[str, any]] = None

class CulturalAdaptationEngine:
    """Engine for cultural adaptation of responses"""
    
    def __init__(self):
        self.cultural_context = CulturalContext()
        self.cultural_rules = self._load_cultural_rules()
    
    def _load_cultural_rules(self) -> Dict[str, any]:
        """Load cultural adaptation rules"""
        return {
            'greetings': {
                'formal': {
                    'hi': ['नमस्ते', 'प्रणाम', 'आदरणीय'],
                    'ta': ['வணக்கம்', 'வணக்கம் தங்களுக்கு'],
                    'te': ['నమస్కారం', 'నమస్కారం మీకు'],
                    'bn': ['নমস্কার', 'প্রণাম'],
                    'mr': ['नमस्कार', 'प्रणाम']
                },
                'informal': {
                    'hi': ['हाय', 'हेलो', 'कैसे हो?'],
                    'ta': ['ஹாய்', 'எப்படி இருக்கிறீர்கள்?'],
                    'te': ['హాయ్', 'ఎలా ఉన్నారు?'],
                    'bn': ['হাই', 'কেমন আছো?'],
                    'mr': ['हाय', 'कसे आहात?']
                }
            },
            'respect_markers': {
                'hi': ['जी', 'साहब', 'जी साहब', 'मैडम', 'सर'],
                'ta': ['ஐயா', 'அம்மா', 'சார்'],
                'te': ['గారు', 'అమ్మ', 'సార్'],
                'bn': ['জি', 'সাহেব', 'দাদা', 'দিদি'],
                'mr': ['जी', 'साहेब', 'ताई', 'दादा']
            },
            'cultural_references': {
                'festivals': ['दिवाली', 'होली', 'ईद', 'क्रिसमस', 'पोंगल', 'बैसाखी'],
                'food': ['दाल-रोटी', 'बिरयानी', 'डोसा', 'समोसा', 'पनीर'],
                'clothing': ['साड़ी', 'कुर्ता', 'धोती', 'सलवार-कमीज'],
                'traditions': ['नमस्ते', 'प्रणाम', 'आरती', 'पूजा']
            },
            'formality_levels': {
                'very_formal': 0.9,
                'formal': 0.7,
                'neutral': 0.5,
                'informal': 0.3,
                'very_informal': 0.1
            }
        }
    
    async def adapt_response(
        self, 
        response: str, 
        user_profile: UserProfile,
        context: Dict[str, any]
    ) -> Dict[str, any]:
        """Adapt response based on user's cultural background"""
        adaptations = []
        adapted_response = response
        
        try:
            # Language adaptation
            if user_profile.primary_language != 'en':
                adapted_response = await self._adapt_language(
                    adapted_response, 
                    user_profile.primary_language,
                    user_profile
                )
                adaptations.append('language')
            
            # Formality adaptation
            adapted_response = await self._adapt_formality(
                adapted_response,
                user_profile.formality_level,
                user_profile.primary_language
            )
            adaptations.append('formality')
            
            # Cultural reference adaptation
            adapted_response = await self._adapt_cultural_references(
                adapted_response,
                user_profile.cultural_background,
                user_profile.primary_language
            )
            adaptations.append('cultural_references')
            
            # Regional adaptation
            if user_profile.region:
                adapted_response = await self._adapt_regional(
                    adapted_response,
                    user_profile.region,
                    user_profile.primary_language
                )
                adaptations.append('regional')
            
            # Personality adaptation
            adapted_response = await self._adapt_personality(
                adapted_response,
                user_profile.personality_traits
            )
            adaptations.append('personality')
            
            return {
                'adapted_response': adapted_response,
                'adaptations': adaptations,
                'confidence': len(adaptations) / 5.0  # 5 adaptation types
            }
            
        except Exception as e:
            logger.error(f"Cultural adaptation error: {e}")
            return {
                'adapted_response': response,
                'adaptations': [],
                'confidence': 0.0
            }
    
    async def _adapt_language(
        self, 
        response: str, 
        language: str,
        user_profile: UserProfile
    ) -> str:
        """Adapt response to user's primary language"""
        try:
            if language == 'en':
                return response
            
            # Use translation engine
            translation_engine = RealTimeTranslationEngine()
            
            from .realtime_translation import TranslationRequest
            request = TranslationRequest(
                text=response,
                source_language='en',
                target_language=language,
                preserve_cultural_context=True
            )
            
            translation_result = await translation_engine.translate(request)
            return translation_result.translated_text
            
        except Exception as e:
            logger.error(f"Language adaptation error: {e}")
            return response
    
    async def _adapt_formality(
        self, 
        response: str, 
        formality_level: float,
        language: str
    ) -> str:
        """Adapt response formality level"""
        try:
            # Add respect markers based on formality level
            if formality_level > 0.7 and language in self.cultural_rules['respect_markers']:
                respect_markers = self.cultural_rules['respect_markers'][language]
                if respect_markers:
                    # Add respect marker at the end
                    response = f"{response} {respect_markers[0]}"
            
            # Adjust greeting formality
            if formality_level > 0.7:
                # Make more formal
                response = response.replace("हाय", "नमस्ते").replace("हेलो", "नमस्ते")
            elif formality_level < 0.3:
                # Make more informal
                response = response.replace("नमस्ते", "हाय").replace("प्रणाम", "हाय")
            
            return response
            
        except Exception as e:
            logger.error(f"Formality adaptation error: {e}")
            return response
    
    async def _adapt_cultural_references(
        self, 
        response: str, 
        cultural_background: Dict[str, any],
        language: str
    ) -> str:
        """Adapt cultural references in response"""
        try:
            # Add relevant cultural references based on background
            if 'religion' in cultural_background:
                religion = cultural_background['religion']
                if religion.lower() == 'hindu':
                    response = self._add_hindu_references(response, language)
                elif religion.lower() == 'muslim':
                    response = self._add_muslim_references(response, language)
                elif religion.lower() == 'christian':
                    response = self._add_christian_references(response, language)
            
            return response
            
        except Exception as e:
            logger.error(f"Cultural reference adaptation error: {e}")
            return response
    
    def _add_hindu_references(self, response: str, language: str) -> str:
        """Add Hindu cultural references"""
        # Add appropriate references based on context
        if 'festival' in response.lower():
            response = response.replace('festival', 'Hindu festival like Diwali or Holi')
        return response
    
    def _add_muslim_references(self, response: str, language: str) -> str:
        """Add Muslim cultural references"""
        if 'festival' in response.lower():
            response = response.replace('festival', 'Islamic festival like Eid')
        return response
    
    def _add_christian_references(self, response: str, language: str) -> str:
        """Add Christian cultural references"""
        if 'festival' in response.lower():
            response = response.replace('festival', 'Christian festival like Christmas')
        return response
    
    async def _adapt_regional(
        self, 
        response: str, 
        region: str,
        language: str
    ) -> str:
        """Adapt response to regional context"""
        try:
            # Add regional-specific elements
            regional_adaptations = {
                'north': ['जी', 'साहब'],
                'south': ['ஸார்', 'गारु'],
                'east': ['দাদা', 'দিদি'],
                'west': ['बापू', 'आई'],
                'northeast': ['भाई', 'बहन']
            }
            
            if region.lower() in regional_adaptations:
                adaptations = regional_adaptations[region.lower()]
                if adaptations:
                    response = f"{response} {adaptations[0]}"
            
            return response
            
        except Exception as e:
            logger.error(f"Regional adaptation error: {e}")
            return response
    
    async def _adapt_personality(
        self, 
        response: str, 
        personality_traits: Dict[str, float]
    ) -> str:
        """Adapt response based on personality traits"""
        try:
            # Adapt based on extraversion
            if personality_traits.get('extraversion', 0.5) > 0.7:
                # More extraverted - add enthusiastic elements
                response = f"Great! {response}"
            elif personality_traits.get('extraversion', 0.5) < 0.3:
                # More introverted - make more concise
                response = response.replace("Great!", "").replace("Wonderful!", "")
            
            # Adapt based on openness
            if personality_traits.get('openness', 0.5) > 0.7:
                # More open - add creative elements
                response = f"{response} This is quite interesting!"
            
            return response
            
        except Exception as e:
            logger.error(f"Personality adaptation error: {e}")
            return response

class HyperPersonalizationEngine:
    """Main hyper-personalization engine"""
    
    def __init__(self):
        self.user_profiles: Dict[str, UserProfile] = {}
        self.cultural_adaptation = CulturalAdaptationEngine()
        self.core = IndiGLMCore()
        self.language_manager = LanguageManager()
        self.cache = {}
        
    async def get_or_create_profile(self, user_id: str) -> UserProfile:
        """Get existing user profile or create new one"""
        if user_id not in self.user_profiles:
            self.user_profiles[user_id] = UserProfile(user_id)
        return self.user_profiles[user_id]
    
    async def update_profile(
        self, 
        user_id: str, 
        update_data: Dict[str, any]
    ) -> UserProfile:
        """Update user profile"""
        profile = await self.get_or_create_profile(user_id)
        profile.update_profile(update_data)
        return profile
    
    async def personalize_response(
        self, 
        request: PersonalizationRequest
    ) -> PersonalizationResponse:
        """Generate personalized response"""
        start_time = time.time()
        
        try:
            # Get user profile
            profile = await self.get_or_create_profile(request.user_id)
            
            # Generate base response
            base_response = await self.core.generate_response(
                request.input_text,
                cultural_context=profile.cultural_background,
                language=profile.primary_language
            )
            
            # Apply cultural adaptation
            adaptation_result = await self.cultural_adaptation.adapt_response(
                base_response,
                profile,
                request.context or {}
            )
            
            # Record interaction
            interaction = {
                'input_text': request.input_text,
                'response': adaptation_result['adapted_response'],
                'modality': request.modality,
                'request_type': request.request_type,
                'context': request.context
            }
            profile.add_interaction(interaction)
            
            # Calculate confidence
            confidence = adaptation_result['confidence'] * profile.adaptation_score
            
            processing_time = time.time() - start_time
            
            return PersonalizationResponse(
                user_id=request.user_id,
                personalized_text=adaptation_result['adapted_response'],
                adaptations=adaptation_result['adaptations'],
                confidence=confidence,
                personalization_level=profile.personalization_level,
                adaptation_details={
                    'cultural_background': profile.cultural_background,
                    'language': profile.primary_language,
                    'formality_level': profile.formality_level,
                    'personality_traits': profile.personality_traits
                },
                processing_time=processing_time,
                metadata={
                    'base_response': base_response,
                    'adaptation_score': profile.adaptation_score,
                    'interaction_count': len(profile.interaction_history)
                }
            )
            
        except Exception as e:
            logger.error(f"Personalization error: {e}")
            return PersonalizationResponse(
                user_id=request.user_id,
                personalized_text="I apologize, but I'm having trouble personalizing my response right now.",
                adaptations=[],
                confidence=0.0,
                personalization_level=PersonalizationLevel.BASIC,
                adaptation_details={},
                processing_time=time.time() - start_time,
                metadata={'error': str(e)}
            )
    
    async def learn_from_interaction(
        self, 
        user_id: str, 
        interaction_data: Dict[str, any]
    ) -> bool:
        """Learn from user interaction to improve personalization"""
        try:
            profile = await self.get_or_create_profile(user_id)
            
            # Extract learning signals
            if 'feedback' in interaction_data:
                feedback = interaction_data['feedback']
                if feedback.get('positive'):
                    # Reinforce successful adaptations
                    profile.adaptation_score = min(1.0, profile.adaptation_score + 0.01)
                else:
                    # Reduce score for negative feedback
                    profile.adaptation_score = max(0.0, profile.adaptation_score - 0.01)
            
            # Update preferences based on interaction
            if 'preferred_response_type' in interaction_data:
                response_type = interaction_data['preferred_response_type']
                profile.response_preferences[response_type] = profile.response_preferences.get(response_type, 0) + 0.1
            
            # Update personality traits based on communication patterns
            if 'communication_style' in interaction_data:
                style = interaction_data['communication_style']
                if style == 'formal':
                    profile.formality_level = min(1.0, profile.formality_level + 0.05)
                elif style == 'informal':
                    profile.formality_level = max(0.0, profile.formality_level - 0.05)
            
            profile.last_updated = datetime.now()
            return True
            
        except Exception as e:
            logger.error(f"Learning error: {e}")
            return False
    
    async def get_personalization_insights(
        self, 
        user_id: str
    ) -> Dict[str, any]:
        """Get insights about user personalization"""
        try:
            profile = await self.get_or_create_profile(user_id)
            
            insights = {
                'user_id': user_id,
                'personalization_level': profile.personalization_level.value,
                'adaptation_score': profile.adaptation_score,
                'interaction_count': len(profile.interaction_history),
                'top_interests': sorted(profile.topic_interests.items(), key=lambda x: x[1], reverse=True)[:5],
                'preferred_response_types': sorted(profile.response_preferences.items(), key=lambda x: x[1], reverse=True)[:3],
                'personality_summary': self._summarize_personality(profile.personality_traits),
                'cultural_background': profile.cultural_background,
                'language_preferences': {
                    'primary': profile.primary_language,
                    'secondary': profile.secondary_languages,
                    'proficiency': profile.language_proficiency
                },
                'recommendations': self._generate_recommendations(profile)
            }
            
            return insights
            
        except Exception as e:
            logger.error(f"Insights generation error: {e}")
            return {}
    
    def _summarize_personality(self, traits: Dict[str, float]) -> str:
        """Summarize personality traits"""
        try:
            summaries = []
            
            if traits.get('extraversion', 0.5) > 0.7:
                summaries.append("outgoing and social")
            elif traits.get('extraversion', 0.5) < 0.3:
                summaries.append("introspective and reserved")
            
            if traits.get('openness', 0.5) > 0.7:
                summaries.append("open to new experiences")
            elif traits.get('openness', 0.5) < 0.3:
                summaries.append("prefers routine and familiarity")
            
            if traits.get('conscientiousness', 0.5) > 0.7:
                summaries.append("organized and detail-oriented")
            elif traits.get('conscientiousness', 0.5) < 0.3:
                summaries.append("spontaneous and flexible")
            
            return ", ".join(summaries) if summaries else "balanced personality"
            
        except Exception as e:
            logger.error(f"Personality summary error: {e}")
            return "balanced personality"
    
    def _generate_recommendations(self, profile: UserProfile) -> List[str]:
        """Generate personalization recommendations"""
        recommendations = []
        
        try:
            # Language recommendations
            if len(profile.language_proficiency) < 2:
                recommendations.append("Consider adding more language preferences for better personalization")
            
            # Cultural background recommendations
            if not profile.cultural_background:
                recommendations.append("Add cultural background information for more culturally relevant responses")
            
            # Interaction recommendations
            if len(profile.interaction_history) < 10:
                recommendations.append("Continue interacting to improve personalization accuracy")
            
            # Personality refinement recommendations
            if profile.adaptation_score < 0.5:
                recommendations.append("Provide more feedback to help me understand your preferences better")
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Recommendation generation error: {e}")
            return []

# Example usage
async def test_hyper_personalization():
    """Test the hyper-personalization engine"""
    engine = HyperPersonalizationEngine()
    
    # Create user profile
    user_id = "test_user_001"
    profile_data = {
        'name': 'Rahul Sharma',
        'age': 28,
        'gender': 'male',
        'location': 'Mumbai, Maharashtra',
        'primary_language': 'hi',
        'secondary_languages': ['en', 'mr'],
        'cultural_background': {
            'religion': 'Hindu',
            'region': 'west',
            'state': 'Maharashtra'
        },
        'formality_level': 0.6,
        'personality_traits': {
            'openness': 0.8,
            'conscientiousness': 0.7,
            'extraversion': 0.6,
            'agreeableness': 0.8,
            'neuroticism': 0.3
        }
    }
    
    # Update profile
    profile = await engine.update_profile(user_id, profile_data)
    print(f"Profile created with adaptation score: {profile.adaptation_score}")
    
    # Test personalization
    request = PersonalizationRequest(
        user_id=user_id,
        input_text="Tell me about Indian festivals",
        context={'topic': 'culture'},
        request_type='question'
    )
    
    response = await engine.personalize_response(request)
    print(f"Personalized response: {response.personalized_text}")
    print(f"Adaptations: {response.adaptations}")
    print(f"Confidence: {response.confidence}")
    
    # Get insights
    insights = await engine.get_personalization_insights(user_id)
    print(f"Personalization insights: {insights}")

if __name__ == "__main__":
    asyncio.run(test_hyper_personalization())