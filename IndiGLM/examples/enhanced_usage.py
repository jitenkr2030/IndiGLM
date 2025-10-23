#!/usr/bin/env python3
"""
IndiGLM Enhanced Usage Examples
==============================

Comprehensive examples demonstrating all enhanced features of IndiGLM
including Z.ai-style functionality:
- Enhanced chat completions with function calling
- Image generation with Indian cultural themes
- Web search with Indian focus
- Advanced SDK usage
- Batch processing
- Streaming responses
"""

import asyncio
import os
import json
from datetime import datetime
from typing import List, Dict, Any

# Import enhanced IndiGLM modules
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from indiglm.sdk import IndiGLM, create_indiglm, with_indiglm, BatchProcessor
from indiglm.enhanced_core import EnhancedChatMessage
from indiglm.image_generation import ImageSize, ImageStyle, IndianTheme
from indiglm.web_search import SearchType, IndianRegion
from indiglm.functions import FunctionCategory


async def basic_sdk_usage():
    """Demonstrate basic SDK usage."""
    print("🚀 Basic SDK Usage Example")
    print("=" * 50)
    
    # Create IndiGLM instance
    api_key = os.getenv("INDIGLM_API_KEY", "demo-api-key")
    indiglm = await create_indiglm(
        api_key=api_key,
        default_language="hi",
        enable_cultural_context=True,
        enable_function_calling=True,
        enable_image_generation=True,
        enable_web_search=True
    )
    
    print("✅ IndiGLM SDK initialized successfully!")
    
    # Simple chat
    try:
        response = await indiglm.chat("नमस्ते! आप कैसे हैं?", language="hi")
        print(f"🤖 Response: {response.choices[0]['message']['content']}")
    except Exception as e:
        print(f"❌ Chat error: {e}")
    
    print("\n" + "=" * 50 + "\n")


async def enhanced_chat_completions():
    """Demonstrate enhanced chat completions with system messages and function calling."""
    print("🗣️ Enhanced Chat Completions Example")
    print("=" * 50)
    
    api_key = os.getenv("INDIGLM_API_KEY", "demo-api-key")
    indiglm = await create_indiglm(api_key)
    
    # Create conversation with system message
    messages = [
        indiglm.create_system_message("You are a helpful AI assistant with deep knowledge of Indian culture and traditions. Always respond with cultural context."),
        indiglm.create_user_message("Tell me about Diwali celebrations in India."),
        indiglm.create_assistant_message("Diwali, also known as the Festival of Lights, is one of the most significant Hindu festivals celebrated across India..."),
        indiglm.create_user_message("What are some traditional Diwali sweets?")
    ]
    
    try:
        response = await indiglm.chat_completions_create(
            messages=messages,
            model="indiglm-1.0-turbo",
            temperature=0.7,
            cultural_context=True
        )
        
        print(f"🤖 Enhanced Response: {response.choices[0]['message']['content']}")
        print(f"📊 Usage: {response.usage}")
        
    except Exception as e:
        print(f"❌ Enhanced chat error: {e}")
    
    print("\n" + "=" * 50 + "\n")


async def function_calling_example():
    """Demonstrate function calling capabilities."""
    print("🔧 Function Calling Example")
    print("=" * 50)
    
    api_key = os.getenv("INDIGLM_API_KEY", "demo-api-key")
    indiglm = await create_indiglm(api_key)
    
    # Get available functions
    functions = indiglm.get_functions()
    print(f"📋 Available Functions: {len(functions)}")
    for func in functions[:3]:  # Show first 3
        print(f"   - {func['name']}: {func['description']}")
    
    # Chat with function calling
    messages = [
        indiglm.create_user_message("What's the weather like in Delhi today?")
    ]
    
    try:
        response = await indiglm.chat_completions_create(
            messages=messages,
            functions=functions,
            function_call="auto"
        )
        
        print(f"🤖 Response: {response.choices[0]['message']['content']}")
        
        # Execute function calls if any
        if hasattr(response, 'function_calls') and response.function_calls:
            for func_call in response.function_calls:
                print(f"🔧 Executing function: {func_call.name}")
                result = await indiglm.functions_invoke(
                    name=func_call.name,
                    arguments=func_call.arguments
                )
                print(f"✅ Function Result: {result.result}")
        
    except Exception as e:
        print(f"❌ Function calling error: {e}")
    
    print("\n" + "=" * 50 + "\n")


async def image_generation_example():
    """Demonstrate image generation with Indian cultural themes."""
    print("🎨 Image Generation Example")
    print("=" * 50)
    
    api_key = os.getenv("INDIGLM_API_KEY", "demo-api-key")
    indiglm = await create_indiglm(api_key)
    
    # Generate images with different themes
    prompts = [
        "Traditional Diwali celebration with diyas and rangoli",
        "Beautiful Indian wedding ceremony",
        "Serene Indian village landscape",
        "Modern Indian cityscape at sunset"
    ]
    
    for i, prompt in enumerate(prompts):
        print(f"\n🎨 Generating Image {i+1}: {prompt}")
        
        try:
            response = await indiglm.generate_image(
                prompt=prompt,
                size="1024x1024",
                style="vivid",
                indian_theme=True,
                cultural_elements=["traditional", "festival"]
            )
            
            print(f"✅ Generated {len(response.data)} images")
            print(f"🖼️  Image URLs: {[img.url for img in response.data]}")
            print(f"🏛️  Indian Context: {response.indian_context}")
            
        except Exception as e:
            print(f"❌ Image generation error: {e}")
    
    print("\n" + "=" * 50 + "\n")


async def web_search_example():
    """Demonstrate web search with Indian focus."""
    print("🔍 Web Search Example")
    print("=" * 50)
    
    api_key = os.getenv("INDIGLM_API_KEY", "demo-api-key")
    indiglm = await create_indiglm(api_key)
    
    # Different types of searches
    searches = [
        ("Latest technology news in India", "general"),
        ("Indian economy growth rate", "business"),
        ("Government schemes for farmers", "government"),
        ("Cricket match results India", "sports")
    ]
    
    for query, search_type in searches:
        print(f"\n🔍 Searching: {query} (Type: {search_type})")
        
        try:
            response = await indiglm.web_search(
                query=query,
                num=5,
                search_type=search_type,
                indian_focus=True
            )
            
            print(f"✅ Found {len(response.results)} results")
            print(f"🔎 Enhanced Query: {response.enhanced_query}")
            print(f"🇮🇳 Indian Context: {response.indian_context}")
            
            # Show top 3 results
            for i, result in enumerate(response.results[:3]):
                print(f"   {i+1}. {result.name}")
                print(f"      {result.snippet[:100]}...")
                print(f"      {result.url}")
        
        except Exception as e:
            print(f"❌ Web search error: {e}")
    
    print("\n" + "=" * 50 + "\n")


async def streaming_chat_example():
    """Demonstrate streaming chat responses."""
    print("🌊 Streaming Chat Example")
    print("=" * 50)
    
    api_key = os.getenv("INDIGLM_API_KEY", "demo-api-key")
    indiglm = await create_indiglm(api_key)
    
    messages = [
        indiglm.create_user_message("Write a short poem about Indian monsoon season.")
    ]
    
    try:
        print("🤖 Streaming Response:")
        response = await indiglm.chat_completions_create(
            messages=messages,
            stream=True
        )
        
        full_content = ""
        async for chunk in response:
            if 'choices' in chunk and len(chunk['choices']) > 0:
                delta = chunk['choices'][0].get('delta', {})
                if 'content' in delta:
                    content = delta['content']
                    full_content += content
                    print(content, end='', flush=True)
        
        print(f"\n\n✅ Complete response received ({len(full_content)} characters)")
        
    except Exception as e:
        print(f"❌ Streaming error: {e}")
    
    print("\n" + "=" * 50 + "\n")


async def batch_processing_example():
    """Demonstrate batch processing capabilities."""
    print("📦 Batch Processing Example")
    print("=" * 50)
    
    api_key = os.getenv("INDIGLM_API_KEY", "demo-api-key")
    indiglm = await create_indiglm(api_key)
    
    # Initialize batch processor
    batch_processor = BatchProcessor(indiglm)
    
    # Batch chat processing
    print("\n💬 Batch Chat Processing:")
    message_batches = [
        ["What is the capital of India?"],
        ["Tell me about Indian culture"],
        ["What are some famous Indian festivals?"],
        ["Explain the significance of yoga in India"]
    ]
    
    try:
        chat_responses = await batch_processor.batch_chat(message_batches)
        print(f"✅ Processed {len(chat_responses)} chat requests")
        
        for i, response in enumerate(chat_responses):
            print(f"   {i+1}. {response.choices[0]['message']['content'][:50]}...")
    
    except Exception as e:
        print(f"❌ Batch chat error: {e}")
    
    # Batch image generation
    print("\n🎨 Batch Image Generation:")
    image_prompts = [
        "Taj Mahal at sunrise",
        "Indian festival celebration",
        "Traditional Indian dance",
        "Indian street food"
    ]
    
    try:
        image_responses = await batch_processor.batch_image_generation(image_prompts)
        print(f"✅ Generated {len(image_responses)} image batches")
        
        for i, response in enumerate(image_responses):
            print(f"   {i+1}. {len(response.data)} images generated")
    
    except Exception as e:
        print(f"❌ Batch image generation error: {e}")
    
    # Batch web search
    print("\n🔍 Batch Web Search:")
    search_queries = [
        "Indian education system",
        "Healthcare in India",
        "Indian startup ecosystem",
        "Tourism in India"
    ]
    
    try:
        search_responses = await batch_processor.batch_web_search(search_queries)
        print(f"✅ Processed {len(search_responses)} search requests")
        
        for i, response in enumerate(search_responses):
            print(f"   {i+1}. {len(response.results)} results found")
    
    except Exception as e:
        print(f"❌ Batch web search error: {e}")
    
    print("\n" + "=" * 50 + "\n")


async def context_manager_example():
    """Demonstrate context manager usage."""
    print("🔄 Context Manager Example")
    print("=" * 50)
    
    api_key = os.getenv("INDIGLM_API_KEY", "demo-api-key")
    
    config = {
        "api_key": api_key,
        "default_language": "hi",
        "enable_cultural_context": True
    }
    
    try:
        async with with_indiglm(config) as indiglm:
            print("✅ Context manager entered")
            
            # Perform operations within context
            response = await indiglm.chat("How are you today?")
            print(f"🤖 Response: {response.choices[0]['message']['content']}")
            
            # Generate image
            image_response = await indiglm.generate_image("Beautiful Indian landscape")
            print(f"🎨 Generated {len(image_response.data)} images")
            
            # Web search
            search_response = await indiglm.web_search("Latest news from India")
            print(f"🔍 Found {len(search_response.results)} search results")
        
        print("✅ Context manager exited")
        
    except Exception as e:
        print(f"❌ Context manager error: {e}")
    
    print("\n" + "=" * 50 + "\n")


async def health_check_example():
    """Demonstrate health check and system information."""
    print("🏥 Health Check Example")
    print("=" * 50)
    
    api_key = os.getenv("INDIGLM_API_KEY", "demo-api-key")
    indiglm = await create_indiglm(api_key)
    
    try:
        # Health check
        health = await indiglm.health_check()
        print("🏥 Health Status:")
        for service, status in health.items():
            if service != "timestamp":
                print(f"   {service}: {status}")
        
        # Model information
        model_info = await indiglm.get_model_info()
        print(f"\n🤖 Model Information:")
        if 'error' not in model_info:
            print(f"   Name: {model_info.get('name', 'Unknown')}")
            print(f"   Version: {model_info.get('version', 'Unknown')}")
            print(f"   Languages: {len(model_info.get('supported_languages', []))}")
            print(f"   Industries: {len(model_info.get('supported_industries', []))}")
        else:
            print(f"   Error: {model_info['error']}")
        
    except Exception as e:
        print(f"❌ Health check error: {e}")
    
    print("\n" + "=" * 50 + "\n")


async def advanced_conversation_example():
    """Demonstrate advanced multi-turn conversation with multiple features."""
    print("💬 Advanced Conversation Example")
    print("=" * 50)
    
    api_key = os.getenv("INDIGLM_API_KEY", "demo-api-key")
    indiglm = await create_indiglm(api_key)
    
    # Simulate a conversation that uses multiple features
    conversation = [
        {
            "role": "user",
            "content": "Hello! I'm planning a trip to India. Can you help me?"
        },
        {
            "role": "assistant", 
            "content": "Hello! I'd be happy to help you plan your trip to India! It's a wonderful country with diverse cultures, landscapes, and experiences. What specific aspects of your trip are you most interested in learning about?"
        },
        {
            "role": "user",
            "content": "I'd like to know about the best places to visit and the current weather there."
        }
    ]
    
    try:
        # Continue the conversation
        current_messages = [
            indiglm.create_system_message("You are a knowledgeable travel assistant specializing in Indian tourism. Provide helpful, culturally-aware advice and use available tools when appropriate.")
        ]
        
        for msg in conversation:
            current_messages.append(indiglm.create_user_message(msg["content"]) if msg["role"] == "user" 
                             else indiglm.create_assistant_message(msg["content"]))
        
        # Get response with function calling enabled
        functions = indiglm.get_functions()
        response = await indiglm.chat_completions_create(
            messages=current_messages,
            functions=functions,
            function_call="auto"
        )
        
        assistant_response = response.choices[0]['message']['content']
        print(f"🤖 Assistant: {assistant_response}")
        
        # Execute any function calls
        if hasattr(response, 'function_calls') and response.function_calls:
            for func_call in response.function_calls:
                print(f"\n🔧 Executing: {func_call.name}")
                result = await indiglm.functions_invoke(
                    name=func_call.name,
                    arguments=func_call.arguments
                )
                print(f"✅ Result: {result.result}")
                
                # Add function result to conversation
                current_messages.append(indiglm.create_function_message(
                    str(result.result), func_call.name, func_call.call_id
                ))
        
        # Generate an image of a popular Indian destination
        print("\n🎨 Generating image of a popular Indian destination...")
        image_response = await indiglm.generate_image(
            "Taj Mahal Agra India beautiful monument tourism",
            size="1024x1024",
            indian_theme=True
        )
        
        if image_response.data:
            print(f"✅ Generated image: {image_response.data[0].url}")
        
        # Search for current travel information
        print("\n🔍 Searching for current travel information...")
        search_response = await indiglm.web_search(
            "India travel advisory current tourism guidelines 2024",
            num=3,
            search_type="general"
        )
        
        print(f"✅ Found {len(search_response.results)} relevant results")
        for result in search_response.results[:2]:
            print(f"   - {result.name}")
        
        print("\n🎉 Advanced conversation completed successfully!")
        
    except Exception as e:
        print(f"❌ Advanced conversation error: {e}")
    
    print("\n" + "=" * 50 + "\n")


async def main():
    """Run all examples."""
    print("🇮🇳 IndiGLM Enhanced Usage Examples")
    print("=" * 60)
    print("This demo showcases all enhanced features of IndiGLM")
    print("including Z.ai-style functionality with Indian context.")
    print("=" * 60)
    
    # Check for API key
    if not os.getenv("INDIGLM_API_KEY"):
        print("⚠️  Warning: INDIGLM_API_KEY environment variable not set.")
        print("   Some features may not work without a valid API key.")
        print("   Set it with: export INDIGLM_API_KEY='your-api-key'")
        print()
    
    try:
        # Run all examples
        await basic_sdk_usage()
        await enhanced_chat_completions()
        await function_calling_example()
        await image_generation_example()
        await web_search_example()
        await streaming_chat_example()
        await batch_processing_example()
        await context_manager_example()
        await health_check_example()
        await advanced_conversation_example()
        
        print("🎉 All examples completed successfully!")
        print("\n💡 Tips:")
        print("• Set INDIGLM_API_KEY for full functionality")
        print("• Explore different languages and cultural contexts")
        print("• Use batch processing for efficiency")
        print("• Enable streaming for real-time responses")
        print("• Combine multiple features for powerful applications")
        
    except KeyboardInterrupt:
        print("\n\n⏹️  Examples interrupted by user")
    except Exception as e:
        print(f"\n\n❌ Error running examples: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())