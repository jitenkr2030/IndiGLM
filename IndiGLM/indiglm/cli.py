#!/usr/bin/env python3
"""
IndiGLM CLI Module
=================

Command line interface for IndiGLM - Indian Language Model.
Provides interactive chat, translation, content generation, and more.
"""

import argparse
import sys
import os
import json
from typing import Optional, List, Dict, Any
from datetime import datetime

from .core import IndiGLM, ModelType
from .languages import IndianLanguage, LanguageDetector
from .cultural import CulturalContext, Region
from .industries import IndustryManager, IndustryType


class IndiGLMCLI:
    """
    Command line interface for IndiGLM.
    """
    
    def __init__(self):
        """Initialize CLI with default configuration."""
        self.model: Optional[IndiGLM] = None
        self.language_detector = LanguageDetector()
        self.industry_manager = IndustryManager()
        self.current_language = IndianLanguage.HINDI
        self.current_industry: Optional[IndustryType] = None
        self.cultural_context = CulturalContext()
        self.chat_history: List[Dict[str, Any]] = []
        
        # Color codes for terminal output
        self.colors = {
            'reset': '\033[0m',
            'red': '\033[91m',
            'green': '\033[92m',
            'yellow': '\033[93m',
            'blue': '\033[94m',
            'magenta': '\033[95m',
            'cyan': '\033[96m',
            'white': '\033[97m',
            'bold': '\033[1m',
            'underline': '\033[4m'
        }
    
    def color_print(self, text: str, color: str = 'white'):
        """Print colored text to terminal."""
        print(f"{self.colors.get(color, '')}{text}{self.colors['reset']}")
    
    def initialize_model(self, api_key: Optional[str] = None) -> bool:
        """Initialize the IndiGLM model."""
        if not api_key:
            api_key = os.getenv("INDIGLM_API_KEY")
        
        if not api_key:
            self.color_print("❌ Error: API key required. Set INDIGLM_API_KEY environment variable or use --api-key option.", 'red')
            return False
        
        try:
            self.model = IndiGLM(
                api_key=api_key,
                default_language=self.current_language,
                enable_cultural_context=True
            )
            self.color_print("✅ IndiGLM initialized successfully!", 'green')
            return True
        except Exception as e:
            self.color_print(f"❌ Error initializing IndiGLM: {e}", 'red')
            return False
    
    def print_header(self):
        """Print CLI header."""
        self.color_print("🇮🇳", 'yellow')
        self.color_print("███████╗ ██████╗ ██████╗ ███████╗██████╗  ██████╗ ███╗   ███╗", 'cyan')
        self.color_print("██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔══██╗██╔═══██╗████╗ ████║", 'cyan')
        self.color_print("███████╗██║   ██║██████╔╝█████╗  ██████╔╝██║   ██║██╔████╔██║", 'cyan')
        self.color_print("╚════██║██║   ██║██╔══██╗██╔══╝  ██╔══██╗██║   ██║██║╚██╔╝██║", 'cyan')
        self.color_print("███████║╚██████╔╝██║  ██║███████╗██║  ██║╚██████╔╝██║ ╚═╝ ██║", 'cyan')
        self.color_print("╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝", 'cyan')
        self.color_print("Indian Language Model CLI", 'yellow')
        self.color_print("=" * 60, 'cyan')
    
    def interactive_chat(self, language: str = "hi", industry: Optional[str] = None):
        """Start interactive chat session."""
        if not self.model:
            if not self.initialize_model():
                return
        
        # Set language
        try:
            self.current_language = IndianLanguage(language)
        except ValueError:
            self.color_print(f"❌ Invalid language code: {language}", 'red')
            return
        
        # Set industry if specified
        if industry:
            try:
                self.current_industry = IndustryType(industry)
                self.color_print(f"🏭 Industry mode: {self.current_industry.value}", 'yellow')
            except ValueError:
                self.color_print(f"❌ Invalid industry: {industry}", 'red')
                return
        
        self.color_print(f"🗣️ Chat started in {self.current_language.value.upper()}", 'green')
        self.color_print("💡 Type 'exit' to quit, 'help' for commands", 'cyan')
        self.color_print("=" * 60, 'cyan')
        
        while True:
            try:
                # Get user input
                user_input = input(f"\n{self.colors['green']}You{self.colors['reset']}: ").strip()
                
                if not user_input:
                    continue
                
                # Handle commands
                if user_input.lower() == 'exit':
                    self.color_print("👋 Goodbye!", 'yellow')
                    break
                elif user_input.lower() == 'help':
                    self.print_chat_help()
                    continue
                elif user_input.lower() == 'clear':
                    self.chat_history.clear()
                    self.color_print("🧹 Chat history cleared", 'yellow')
                    continue
                elif user_input.lower().startswith('language '):
                    new_lang = user_input[9:].strip()
                    try:
                        self.current_language = IndianLanguage(new_lang)
                        self.color_print(f"🗣️ Language changed to {new_lang.upper()}", 'green')
                    except ValueError:
                        self.color_print(f"❌ Invalid language: {new_lang}", 'red')
                    continue
                elif user_input.lower().startswith('industry '):
                    new_industry = user_input[9:].strip()
                    try:
                        self.current_industry = IndustryType(new_industry)
                        self.color_print(f"🏭 Industry changed to {new_industry}", 'green')
                    except ValueError:
                        self.color_print(f"❌ Invalid industry: {new_industry}", 'red')
                    continue
                
                # Add to chat history
                self.chat_history.append({
                    "role": "user",
                    "content": user_input,
                    "timestamp": datetime.now().isoformat(),
                    "language": self.current_language.value
                })
                
                # Get model response
                self.color_print(f"\n{self.colors['blue']}IndiGLM{self.colors['reset']}: ", end='')
                
                try:
                    response = self.model.chat(
                        message=user_input,
                        language=self.current_language,
                        industry=self.current_industry,
                        cultural_context=True
                    )
                    
                    print(response.content)
                    
                    # Add to chat history
                    self.chat_history.append({
                        "role": "assistant",
                        "content": response.content,
                        "timestamp": datetime.now().isoformat(),
                        "language": response.language_detected,
                        "usage": response.usage.to_dict()
                    })
                    
                except Exception as e:
                    self.color_print(f"❌ Error: {e}", 'red')
                
            except KeyboardInterrupt:
                self.color_print("\n\n👋 Goodbye!", 'yellow')
                break
            except EOFError:
                self.color_print("\n\n👋 Goodbye!", 'yellow')
                break
    
    def print_chat_help(self):
        """Print chat help information."""
        self.color_print("\n📚 Chat Commands:", 'cyan')
        self.color_print("  help     - Show this help message", 'white')
        self.color_print("  exit     - Exit chat", 'white')
        self.color_print("  clear    - Clear chat history", 'white')
        self.color_print("  language <code> - Change language (hi, en, ta, te, etc.)", 'white')
        self.color_print("  industry <type> - Set industry (healthcare, education, etc.)", 'white')
        self.color_print("\n🗣️ Supported Languages:", 'cyan')
        for lang in IndianLanguage:
            self.color_print(f"  {lang.value} - {lang.name.replace('_', ' ').title()}", 'white')
        self.color_print("\n🏭 Supported Industries:", 'cyan')
        for industry in IndustryType:
            self.color_print(f"  {industry.value} - {industry.name.replace('_', ' ').title()}", 'white')
    
    def translate_text(self, text: str, from_lang: str, to_lang: str):
        """Translate text between languages."""
        if not self.model:
            if not self.initialize_model():
                return
        
        try:
            from_language = IndianLanguage(from_lang)
            to_language = IndianLanguage(to_lang)
        except ValueError as e:
            self.color_print(f"❌ Invalid language: {e}", 'red')
            return
        
        self.color_print(f"🔄 Translating from {from_lang.upper()} to {to_lang.upper()}...", 'cyan')
        
        try:
            response = self.model.translate(
                text=text,
                from_language=from_language,
                to_language=to_language
            )
            
            self.color_print(f"\n📝 Original ({from_lang.upper()}): {text}", 'white')
            self.color_print(f"🤖 Translation ({to_lang.upper()}): {response.content}", 'green')
            self.color_print(f"🎯 Confidence: {response.confidence:.2f}", 'yellow')
            
        except Exception as e:
            self.color_print(f"❌ Translation error: {e}", 'red')
    
    def generate_content(self, prompt: str, language: str = "hi", max_tokens: int = 500):
        """Generate content based on prompt."""
        if not self.model:
            if not self.initialize_model():
                return
        
        try:
            target_language = IndianLanguage(language)
        except ValueError:
            self.color_print(f"❌ Invalid language: {language}", 'red')
            return
        
        self.color_print(f"✍️ Generating content in {language.upper()}...", 'cyan')
        
        try:
            response = self.model.generate_content(
                prompt=prompt,
                language=target_language,
                max_tokens=max_tokens
            )
            
            self.color_print(f"\n📝 Prompt: {prompt}", 'white')
            self.color_print(f"🤖 Generated Content ({language.upper()}):", 'green')
            self.color_print(response.content, 'white')
            self.color_print(f"\n📊 Tokens used: {response.usage.total_tokens}", 'yellow')
            
        except Exception as e:
            self.color_print(f"❌ Content generation error: {e}", 'red')
    
    def detect_language(self, text: str):
        """Detect language of given text."""
        detector = LanguageDetector()
        
        self.color_print("🔍 Detecting language...", 'cyan')
        
        try:
            result = detector.detect_language(text)
            stats = detector.get_language_statistics(text)
            
            self.color_print(f"\n📝 Text: {text}", 'white')
            self.color_print(f"🌍 Detected Language: {result.language.value.upper()}", 'green')
            self.color_print(f"🎯 Confidence: {result.confidence:.2f}", 'yellow')
            self.color_print(f"📝 Script: {result.script_detected}", 'cyan')
            
            if result.alternative_languages:
                self.color_print("\n🔄 Alternative Languages:", 'cyan')
                for lang, conf in result.alternative_languages:
                    self.color_print(f"  {lang.value.upper()}: {conf:.2f}", 'white')
            
            if stats.get('code_switching'):
                self.color_print("\n🔄 Code-switching detected!", 'yellow')
            
        except Exception as e:
            self.color_print(f"❌ Language detection error: {e}", 'red')
    
    def show_industry_info(self, industry: str):
        """Show information about a specific industry."""
        try:
            industry_type = IndustryType(industry)
        except ValueError:
            self.color_print(f"❌ Invalid industry: {industry}", 'red')
            return
        
        insights = self.industry_manager.get_industry_insights(industry_type)
        
        if not insights:
            self.color_print(f"❌ No insights available for {industry}", 'red')
            return
        
        self.color_print(f"\n🏭 {industry_type.name.replace('_', ' ').title()} Industry", 'cyan')
        self.color_print("=" * 50, 'cyan')
        
        # Market overview
        market = insights['market_overview']
        self.color_print("📊 Market Overview:", 'yellow')
        self.color_print(f"  Market Size: {market['market_size']}", 'white')
        self.color_print(f"  Growth Rate: {market['growth_rate']}", 'white')
        self.color_print(f"  Employment: {market['employment']}", 'white')
        self.color_print(f"  Key Players: {', '.join(market['key_players'][:3])}", 'white')
        
        # Trends and opportunities
        trends = insights['trends_and_opportunities']
        self.color_print("\n📈 Market Trends:", 'yellow')
        for trend in trends['market_trends'][:3]:
            self.color_print(f"  • {trend}", 'white')
        
        self.color_print("\n🚀 Opportunities:", 'yellow')
        for opportunity in trends['opportunities'][:3]:
            self.color_print(f"  • {opportunity}", 'white')
        
        # Technical aspects
        technical = insights['technical_aspects']
        self.color_print("\n🔧 Technical Aspects:", 'yellow')
        if technical['specialties']:
            self.color_print(f"  Specialties: {', '.join(technical['specialties'][:3])}", 'white')
        if technical['compliance_requirements']:
            self.color_print(f"  Compliance: {', '.join(technical['compliance_requirements'][:2])}", 'white')
    
    def show_supported_languages(self):
        """Show all supported languages."""
        self.color_print("\n🗣️ Supported Indian Languages:", 'cyan')
        self.color_print("=" * 50, 'cyan')
        
        for lang in IndianLanguage:
            self.color_print(f"  {lang.value} - {lang.name.replace('_', ' ').title()}", 'white')
    
    def show_supported_industries(self):
        """Show all supported industries."""
        self.color_print("\n🏭 Supported Industries:", 'cyan')
        self.color_print("=" * 50, 'cyan')
        
        industries = self.industry_manager.get_all_industries()
        for industry in industries:
            self.color_print(f"  {industry['code']} - {industry['name']}", 'white')
            self.color_print(f"    Market: {industry['market_size']}, Growth: {industry['growth_rate']}", 'yellow')
    
    def show_model_info(self):
        """Show model information."""
        if not self.model:
            if not self.initialize_model():
                return
        
        try:
            model_info = self.model.get_model_info()
            
            self.color_print("\n🤖 Model Information:", 'cyan')
            self.color_print("=" * 50, 'cyan')
            self.color_print(f"Name: {model_info.name}", 'white')
            self.color_print(f"Version: {model_info.version}", 'white')
            self.color_print(f"Description: {model_info.description}", 'white')
            self.color_print(f"Languages: {len(model_info.supported_languages)}", 'white')
            self.color_print(f"Industries: {len(model_info.supported_industries)}", 'white')
            self.color_print(f"Cultural Context: {'✅' if model_info.cultural_context_enabled else '❌'}", 'white')
            self.color_print(f"Max Tokens: {model_info.max_tokens:,}", 'white')
            
        except Exception as e:
            self.color_print(f"❌ Error getting model info: {e}", 'red')
    
    def export_chat_history(self, filename: str):
        """Export chat history to file."""
        if not self.chat_history:
            self.color_print("❌ No chat history to export", 'red')
            return
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(self.chat_history, f, indent=2, ensure_ascii=False)
            
            self.color_print(f"✅ Chat history exported to {filename}", 'green')
            
        except Exception as e:
            self.color_print(f"❌ Error exporting chat history: {e}", 'red')


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="IndiGLM CLI - Indian Language Model Command Line Interface",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  indiglm chat --language hi                    # Start chat in Hindi
  indiglm translate --text "Hello" --from en --to hi
  indiglm generate --prompt "Write about India" --language en
  indiglm detect --text "नमस्ते कैसे हो?"
  indiglm industry --type healthcare
  indiglm languages                              # Show supported languages
  indiglm industries                             # Show supported industries
        """
    )
    
    # Global options
    parser.add_argument('--api-key', help='IndiGLM API key')
    parser.add_argument('--version', action='version', version='IndiGLM CLI 1.0.0')
    
    # Create subparsers
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Chat command
    chat_parser = subparsers.add_parser('chat', help='Start interactive chat')
    chat_parser.add_argument('--language', default='hi', help='Language code (default: hi)')
    chat_parser.add_argument('--industry', help='Industry type for specialized responses')
    
    # Translate command
    translate_parser = subparsers.add_parser('translate', help='Translate text')
    translate_parser.add_argument('--text', required=True, help='Text to translate')
    translate_parser.add_argument('--from', dest='from_lang', required=True, help='Source language code')
    translate_parser.add_argument('--to', dest='to_lang', required=True, help='Target language code')
    
    # Generate command
    generate_parser = subparsers.add_parser('generate', help='Generate content')
    generate_parser.add_argument('--prompt', required=True, help='Content generation prompt')
    generate_parser.add_argument('--language', default='hi', help='Target language (default: hi)')
    generate_parser.add_argument('--max-tokens', type=int, default=500, help='Maximum tokens (default: 500)')
    
    # Detect command
    detect_parser = subparsers.add_parser('detect', help='Detect language of text')
    detect_parser.add_argument('--text', required=True, help='Text to analyze')
    
    # Industry command
    industry_parser = subparsers.add_parser('industry', help='Show industry information')
    industry_parser.add_argument('--type', required=True, help='Industry type')
    
    # Info commands
    subparsers.add_parser('languages', help='Show supported languages')
    subparsers.add_parser('industries', help='Show supported industries')
    subparsers.add_parser('model-info', help='Show model information')
    
    # Parse arguments
    args = parser.parse_args()
    
    # Initialize CLI
    cli = IndiGLMCLI()
    cli.print_header()
    
    # Execute command
    if args.command == 'chat':
        cli.interactive_chat(args.language, args.industry)
    elif args.command == 'translate':
        cli.translate_text(args.text, args.from_lang, args.to_lang)
    elif args.command == 'generate':
        cli.generate_content(args.prompt, args.language, args.max_tokens)
    elif args.command == 'detect':
        cli.detect_language(args.text)
    elif args.command == 'industry':
        cli.show_industry_info(args.type)
    elif args.command == 'languages':
        cli.show_supported_languages()
    elif args.command == 'industries':
        cli.show_supported_industries()
    elif args.command == 'model-info':
        cli.show_model_info()
    else:
        parser.print_help()


if __name__ == '__main__':
    main()