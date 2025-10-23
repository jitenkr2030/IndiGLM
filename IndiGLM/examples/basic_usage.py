#!/usr/bin/env python3
"""
IndiGLM Basic Usage Example
===========================

This example demonstrates the basic usage of IndiGLM for various tasks
including multilingual chat, cultural context understanding, and industry applications.
"""

import os
import sys
from datetime import datetime
from typing import Optional, Dict, Any

# Add the parent directory to the path to import indiglm
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from indiglm import IndiGLM
from indiglm.languages import IndianLanguage
from indiglm.cultural import CulturalContext
from indiglm.industries import IndustryType


def main():
    """Main function to demonstrate IndiGLM usage."""
    
    # Initialize IndiGLM with API key
    # In production, use environment variables
    api_key = os.getenv("INDIGLM_API_KEY", "demo-api-key")
    
    print("🇮🇳 Initializing IndiGLM...")
    model = IndiGLM(
        api_key=api_key,
        default_language=IndianLanguage.HINDI,
        enable_cultural_context=True
    )
    
    print("✅ IndiGLM initialized successfully!\n")
    
    # Example 1: Basic Multilingual Chat
    print("=" * 60)
    print("🗣️ Example 1: Basic Multilingual Chat")
    print("=" * 60)
    
    languages_examples = [
        ("hi", "नमस्ते, आप कैसे हैं?"),
        ("bn", "আপনি কেমন আছেন?"),
        ("ta", "நலமா இருக்கிறீர்களா?"),
        ("te", "మీరు ఎలా ఉన్నారు?"),
        ("en", "Hello, how are you?")
    ]
    
    for lang_code, message in languages_examples:
        print(f"\n📝 [{lang_code.upper()}] {message}")
        try:
            response = model.chat(
                message,
                language=getattr(IndianLanguage, lang_code.upper()),
                temperature=0.7
            )
            print(f"🤖 Response: {response.content}")
            print(f"📊 Usage: {response.usage}")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    # Example 2: Cultural Context Understanding
    print("\n" + "=" * 60)
    print("🏛️ Example 2: Cultural Context Understanding")
    print("=" * 60)
    
    cultural_questions = [
        "Tell me about Diwali celebrations",
        "What is the significance of Namaste?",
        "Explain the concept of Atithi Devo Bhava",
        "Describe traditional Indian wedding ceremonies"
    ]
    
    cultural_context = CulturalContext(
        region="north",
        festival_aware=True,
        traditional_values=True,
        regional_customs=True
    )
    
    for question in cultural_questions:
        print(f"\n🎭 Question: {question}")
        try:
            response = model.chat(
                question,
                language=IndianLanguage.ENGLISH,
                cultural_context=True,
                cultural_config=cultural_context
            )
            print(f"🤖 Response: {response.content[:200]}...")
            if hasattr(response, 'cultural_insights'):
                print(f"🏛️ Cultural Insights: {response.cultural_insights}")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    # Example 3: Industry Applications
    print("\n" + "=" * 60)
    print("🏭 Example 3: Industry Applications")
    print("=" * 60)
    
    industry_examples = [
        (IndustryType.HEALTHCARE, "My mother has diabetes, what diet should she follow?"),
        (IndustryType.AGRICULTURE, "My wheat crop is turning yellow, what should I do?"),
        (IndustryType.FINANCE, "Explain UPI payment system in simple terms"),
        (IndustryType.EDUCATION, "How can I improve my English speaking skills?"),
        (IndustryType.TOURISM, "Best places to visit in Rajasthan during winter")
    ]
    
    for industry, question in industry_examples:
        print(f"\n🏢 [{industry.value.upper()}] {question}")
        try:
            response = model.chat(
                question,
                language=IndianLanguage.ENGLISH,
                industry=industry
            )
            print(f"🤖 Response: {response.content[:200]}...")
            if hasattr(response, 'industry_insights'):
                print(f"📊 Industry Insights: {response.industry_insights}")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    # Example 4: Language Translation
    print("\n" + "=" * 60)
    print("🔄 Example 4: Language Translation")
    print("=" * 60)
    
    translation_examples = [
        ("en", "hi", "Good morning"),
        ("hi", "en", "सुप्रभात"),
        ("en", "ta", "Thank you"),
        ("ta", "en", "நன்றி"),
        ("en", "bn", "How much does this cost?"),
        ("bn", "en", "এটি কত টাকা?")
    ]
    
    for from_lang, to_lang, text in translation_examples:
        print(f"\n🔄 {from_lang.upper()} → {to_lang.upper()}: {text}")
        try:
            response = model.translate(
                text=text,
                from_language=getattr(IndianLanguage, from_lang.upper()),
                to_language=getattr(IndianLanguage, to_lang.upper())
            )
            print(f"🤖 Translation: {response.translated_text}")
            print(f"🎯 Confidence: {response.confidence}")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    # Example 5: Content Generation
    print("\n" + "=" * 60)
    print("✍️ Example 5: Content Generation")
    print("=" * 60)
    
    content_prompts = [
        ("hi", "भारत की समृद्ध सांस्कृतिक विरासत पर एक निबंध लिखें"),
        ("en", "Write a poem about Indian monsoon"),
        ("ta", "தமிழ் நாட்டு சமையல் கலை பற்றி ஒரு கட்டுரை எழுதுங்கள்"),
        ("bn", "বাংলার লোকসংস্কৃতি সম্পর্কে একটি প্রবন্ধ লিখুন")
    ]
    
    for lang_code, prompt in content_prompts:
        print(f"\n✍️ [{lang_code.upper()}] Content Generation")
        print(f"📝 Prompt: {prompt}")
        try:
            response = model.generate_content(
                prompt=prompt,
                language=getattr(IndianLanguage, lang_code.upper()),
                max_tokens=300,
                temperature=0.8
            )
            print(f"🤖 Generated Content: {response.content[:300]}...")
            print(f"📊 Metadata: {response.metadata}")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    # Example 6: Batch Processing
    print("\n" + "=" * 60)
    print("📦 Example 6: Batch Processing")
    print("=" * 60)
    
    batch_requests = [
        "What is the capital of India?",
        "Who was Mahatma Gandhi?",
        "What is the national animal of India?",
        "Explain the Indian flag colors"
    ]
    
    print("📦 Processing batch requests...")
    try:
        responses = model.batch_chat(
            messages=batch_requests,
            language=IndianLanguage.ENGLISH,
            temperature=0.5
        )
        
        for i, response in enumerate(responses):
            print(f"\n📝 Request {i+1}: {batch_requests[i]}")
            print(f"🤖 Response: {response.content}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Example 7: Model Information
    print("\n" + "=" * 60)
    print("ℹ️ Example 7: Model Information")
    print("=" * 60)
    
    try:
        model_info = model.get_model_info()
        print(f"📊 Model Name: {model_info.name}")
        print(f"🌍 Supported Languages: {len(model_info.supported_languages)}")
        print(f"🏛️ Cultural Context: {'✅' if model_info.cultural_context_enabled else '❌'}")
        print(f"🏭 Industry Support: {len(model_info.supported_industries)} industries")
        print(f"📅 Version: {model_info.version}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n" + "=" * 60)
    print("🎉 IndiGLM Basic Usage Example Completed!")
    print("=" * 60)
    print("\n💡 Tips:")
    print("• Use environment variables for API keys in production")
    print("• Enable cultural context for better Indian context understanding")
    print("• Choose appropriate temperature for your use case")
    print("• Use industry-specific modes for domain-specific queries")
    print("• Leverage batch processing for multiple requests")


if __name__ == "__main__":
    main()