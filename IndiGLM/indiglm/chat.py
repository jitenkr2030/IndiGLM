#!/usr/bin/env python3
"""
IndiGLM Interactive Chat Module
=============================

Interactive chat interface for IndiGLM with rich features including
language switching, cultural context, and industry specialization.
"""

import os
import sys
import json
import readline
from typing import Optional, List, Dict, Any
from datetime import datetime
from dataclasses import dataclass, asdict

from .core import IndiGLM, ModelType
from .languages import IndianLanguage, LanguageDetector
from .cultural import CulturalContext, Region
from .industries import IndustryManager, IndustryType


@dataclass
class ChatSession:
    """Chat session data."""
    session_id: str
    start_time: datetime
    messages: List[Dict[str, Any]]
    language: IndianLanguage
    industry: Optional[IndustryType]
    cultural_context: CulturalContext
    metadata: Dict[str, Any]
    
    def to_dict(self):
        result = asdict(self)
        result['start_time'] = self.start_time.isoformat()
        result['language'] = self.language.value
        result['industry'] = self.industry.value if self.industry else None
        result['cultural_context'] = self.cultural_context.to_dict()
        return result


class IndiGLMChat:
    """
    Interactive chat interface for IndiGLM with enhanced features.
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize the chat interface."""
        self.model: Optional[IndiGLM] = None
        self.language_detector = LanguageDetector()
        self.industry_manager = IndustryManager()
        self.current_session: Optional[ChatSession] = None
        self.chat_history: List[ChatSession] = []
        
        # Terminal colors
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
            'underline': '\033[4m',
            'bg_black': '\033[40m',
            'bg_red': '\033[41m',
            'bg_green': '\033[42m',
            'bg_yellow': '\033[43m',
            'bg_blue': '\033[44m',
            'bg_magenta': '\033[45m',
            'bg_cyan': '\033[46m',
            'bg_white': '\033[47m'
        }
        
        # Initialize model
        self.initialize_model(api_key)
        
        # Setup command history
        self.setup_history()
    
    def setup_history(self):
        """Setup command history for readline."""
        try:
            # Enable tab completion
            readline.parse_and_bind("tab: complete")
            
            # Set history file
            history_file = os.path.expanduser("~/.indiglm_history")
            if os.path.exists(history_file):
                readline.read_history_file(history_file)
            
            # Set history length
            readline.set_history_length(1000)
            
            self.history_file = history_file
        except:
            # Readline not available, continue without it
            self.history_file = None
    
    def save_history(self):
        """Save command history."""
        if self.history_file:
            try:
                readline.write_history_file(self.history_file)
            except:
                pass
    
    def color_print(self, text: str, color: str = 'white', end: str = '\n'):
        """Print colored text."""
        print(f"{self.colors.get(color, '')}{text}{self.colors['reset']}", end=end)
    
    def initialize_model(self, api_key: Optional[str] = None) -> bool:
        """Initialize the IndiGLM model."""
        if not api_key:
            api_key = os.getenv("INDIGLM_API_KEY")
        
        if not api_key:
            self.color_print("❌ Error: API key required.", 'red')
            self.color_print("   Set INDIGLM_API_KEY environment variable or pass api_key parameter.", 'red')
            return False
        
        try:
            self.model = IndiGLM(
                api_key=api_key,
                default_language=IndianLanguage.HINDI,
                enable_cultural_context=True
            )
            self.color_print("✅ IndiGLM initialized successfully!", 'green')
            return True
        except Exception as e:
            self.color_print(f"❌ Error initializing IndiGLM: {e}", 'red')
            return False
    
    def start_session(self, language: IndianLanguage = IndianLanguage.HINDI, 
                     industry: Optional[IndustryType] = None, 
                     region: Region = Region.NORTH):
        """Start a new chat session."""
        if not self.model:
            self.color_print("❌ Model not initialized. Please initialize first.", 'red')
            return
        
        session_id = f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        self.current_session = ChatSession(
            session_id=session_id,
            start_time=datetime.now(),
            messages=[],
            language=language,
            industry=industry,
            cultural_context=CulturalContext(region=region),
            metadata={
                "model_info": self.model.get_model_info().to_dict() if self.model else None,
                "user_agent": "IndiGLM Chat Interface"
            }
        )
        
        self.color_print(f"\n🚀 New chat session started: {session_id}", 'cyan')
        self.color_print(f"🗣️ Language: {language.value.upper()}", 'yellow')
        if industry:
            self.color_print(f"🏭 Industry: {industry.value}", 'yellow')
        self.color_print(f"🌍 Region: {region.value}", 'yellow')
        self.color_print("=" * 60, 'cyan')
    
    def display_welcome(self):
        """Display welcome message."""
        self.color_print("🇮🇳", 'yellow')
        self.color_print("╔══════════════════════════════════════════════════════════════╗", 'cyan')
        self.color_print("║                🇮🇳 WELCOME TO INDIGLM CHAT 🇮🇳                ║", 'cyan')
        self.color_print("║           Indian Language Model Interactive Interface        ║", 'cyan')
        self.color_print("╚══════════════════════════════════════════════════════════════╝", 'cyan')
        self.color_print("\nFeatures:", 'green')
        self.color_print("  🗣️  22+ Indian Languages Support", 'white')
        self.color_print("  🏛️  Cultural Context Awareness", 'white')
        self.color_print("  🏭  Industry-Specific Responses", 'white')
        self.color_print("  🔄  Real-time Language Detection", 'white')
        self.color_print("  💾  Chat History & Sessions", 'white')
        self.color_print("\nType '/help' for commands, '/exit' to quit", 'yellow')
        self.color_print("=" * 60, 'cyan')
    
    def display_help(self):
        """Display help information."""
        self.color_print("\n📚 Available Commands:", 'cyan')
        self.color_print("╔══════════════════════════════════════════════════════════════╗", 'cyan')
        self.color_print("║  Command              Description                          ║", 'cyan')
        self.color_print("╠══════════════════════════════════════════════════════════════╣", 'cyan')
        self.color_print("║  /help                Show this help message               ║", 'white')
        self.color_print("║  /exit                Exit the chat                       ║", 'white')
        self.color_print("║  /new                 Start new session                   ║", 'white')
        self.color_print("║  /clear               Clear current session               ║", 'white')
        self.color_print("║  /history             Show chat history                    ║", 'white')
        self.color_print("║  /save <filename>     Save current session                 ║", 'white')
        self.color_print("║  /load <filename>     Load session from file               ║", 'white')
        self.color_print("║  /language <code>     Change language (hi, en, ta, etc.)   ║", 'white')
        self.color_print("║  /industry <type>     Set industry (healthcare, etc.)      ║", 'white')
        self.color_print("║  /region <name>       Set region (north, south, etc.)      ║", 'white')
        self.color_print("║  /languages           Show supported languages             ║", 'white')
        self.color_print("║  /industries          Show supported industries            ║", 'white')
        self.color_print("║  /model               Show model information               ║", 'white')
        self.color_print("║  /stats               Show session statistics             ║", 'white')
        self.color_print("║  /detect <text>       Detect language of text              ║", 'white')
        self.color_print("║  /translate <text>    Translate text                       ║", 'white')
        self.color_print("╚══════════════════════════════════════════════════════════════╝", 'cyan')
        
        self.color_print("\n🗣️ Supported Languages:", 'yellow')
        langs = list(IndianLanguage)[:10]  # Show first 10
        for lang in langs:
            self.color_print(f"  {lang.value} - {lang.name.replace('_', ' ').title()}", 'white')
        if len(IndianLanguage) > 10:
            self.color_print(f"  ... and {len(IndianLanguage) - 10} more languages", 'white')
        
        self.color_print("\n🏭 Supported Industries:", 'yellow')
        industries = list(IndustryType)
        for industry in industries:
            self.color_print(f"  {industry.value} - {industry.name.replace('_', ' ').title()}", 'white')
    
    def process_command(self, command: str, args: str) -> bool:
        """Process a slash command."""
        if command == 'help':
            self.display_help()
        elif command == 'exit':
            return False
        elif command == 'new':
            self.start_new_session()
        elif command == 'clear':
            self.clear_session()
        elif command == 'history':
            self.show_history()
        elif command == 'save':
            self.save_session(args.strip())
        elif command == 'load':
            self.load_session(args.strip())
        elif command == 'language':
            self.change_language(args.strip())
        elif command == 'industry':
            self.change_industry(args.strip())
        elif command == 'region':
            self.change_region(args.strip())
        elif command == 'languages':
            self.show_languages()
        elif command == 'industries':
            self.show_industries()
        elif command == 'model':
            self.show_model_info()
        elif command == 'stats':
            self.show_stats()
        elif command == 'detect':
            self.detect_language(args.strip())
        elif command == 'translate':
            self.translate_text(args.strip())
        else:
            self.color_print(f"❌ Unknown command: /{command}", 'red')
            self.color_print("   Type '/help' for available commands", 'yellow')
        
        return True
    
    def start_new_session(self):
        """Start a new chat session."""
        if self.current_session:
            self.chat_history.append(self.current_session)
        
        # Use current settings or defaults
        language = self.current_session.language if self.current_session else IndianLanguage.HINDI
        industry = self.current_session.industry if self.current_session else None
        region = self.current_session.cultural_context.region if self.current_session else Region.NORTH
        
        self.start_session(language, industry, region)
    
    def clear_session(self):
        """Clear current session."""
        if self.current_session:
            self.current_session.messages.clear()
            self.color_print("🧹 Current session cleared", 'yellow')
        else:
            self.color_print("❌ No active session", 'red')
    
    def show_history(self):
        """Show chat history."""
        if not self.chat_history:
            self.color_print("📝 No chat history available", 'yellow')
            return
        
        self.color_print("\n📚 Chat History:", 'cyan')
        for i, session in enumerate(self.chat_history[-5:]):  # Show last 5 sessions
            self.color_print(f"\n📝 Session {i+1}: {session.session_id}", 'yellow')
            self.color_print(f"   Language: {session.language.value}", 'white')
            self.color_print(f"   Messages: {len(session.messages)}", 'white')
            self.color_print(f"   Duration: {(datetime.now() - session.start_time).total_seconds():.0f}s", 'white')
        
        if len(self.chat_history) > 5:
            self.color_print(f"\n... and {len(self.chat_history) - 5} more sessions", 'white')
    
    def save_session(self, filename: str):
        """Save current session to file."""
        if not self.current_session:
            self.color_print("❌ No active session to save", 'red')
            return
        
        if not filename:
            filename = f"indiglm_session_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(self.current_session.to_dict(), f, indent=2, ensure_ascii=False)
            
            self.color_print(f"💾 Session saved to {filename}", 'green')
        except Exception as e:
            self.color_print(f"❌ Error saving session: {e}", 'red')
    
    def load_session(self, filename: str):
        """Load session from file."""
        if not filename:
            self.color_print("❌ Please provide a filename", 'red')
            return
        
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Recreate session (simplified version)
            session = ChatSession(
                session_id=data['session_id'],
                start_time=datetime.fromisoformat(data['start_time']),
                messages=data['messages'],
                language=IndianLanguage(data['language']),
                industry=IndustryType(data['industry']) if data['industry'] else None,
                cultural_context=CulturalContext(Region(data['cultural_context']['region'])),
                metadata=data['metadata']
            )
            
            if self.current_session:
                self.chat_history.append(self.current_session)
            
            self.current_session = session
            self.color_print(f"📂 Session loaded from {filename}", 'green')
            self.color_print(f"   Session ID: {session.session_id}", 'white')
            self.color_print(f"   Messages: {len(session.messages)}", 'white')
            
        except Exception as e:
            self.color_print(f"❌ Error loading session: {e}", 'red')
    
    def change_language(self, lang_code: str):
        """Change current language."""
        if not lang_code:
            self.color_print("❌ Please provide a language code", 'red')
            return
        
        try:
            new_language = IndianLanguage(lang_code)
            if self.current_session:
                self.current_session.language = new_language
                self.color_print(f"🗣️ Language changed to {new_language.value.upper()}", 'green')
            else:
                self.color_print("❌ No active session", 'red')
        except ValueError:
            self.color_print(f"❌ Invalid language code: {lang_code}", 'red')
            self.color_print("   Use '/languages' to see supported codes", 'yellow')
    
    def change_industry(self, industry_code: str):
        """Change current industry."""
        if not industry_code:
            self.color_print("❌ Please provide an industry code", 'red')
            return
        
        try:
            new_industry = IndustryType(industry_code)
            if self.current_session:
                self.current_session.industry = new_industry
                self.color_print(f"🏭 Industry changed to {new_industry.value}", 'green')
            else:
                self.color_print("❌ No active session", 'red')
        except ValueError:
            self.color_print(f"❌ Invalid industry code: {industry_code}", 'red')
            self.color_print("   Use '/industries' to see supported codes", 'yellow')
    
    def change_region(self, region_name: str):
        """Change current region."""
        if not region_name:
            self.color_print("❌ Please provide a region name", 'red')
            return
        
        try:
            new_region = Region(region_name)
            if self.current_session:
                self.current_session.cultural_context.region = new_region
                self.color_print(f"🌍 Region changed to {new_region.value}", 'green')
            else:
                self.color_print("❌ No active session", 'red')
        except ValueError:
            self.color_print(f"❌ Invalid region: {region_name}", 'red')
            self.color_print("   Available regions: north, south, east, west, northeast, central", 'yellow')
    
    def show_languages(self):
        """Show all supported languages."""
        self.color_print("\n🗣️ Supported Languages:", 'cyan')
        for lang in IndianLanguage:
            native_name = self.language_detector.get_language_name(lang, native=True)
            self.color_print(f"  {lang.value} - {native_name}", 'white')
    
    def show_industries(self):
        """Show all supported industries."""
        self.color_print("\n🏭 Supported Industries:", 'cyan')
        industries = self.industry_manager.get_all_industries()
        for industry in industries:
            self.color_print(f"  {industry['code']} - {industry['name']}", 'white')
            self.color_print(f"    Market: {industry['market_size']}, Growth: {industry['growth_rate']}", 'yellow')
    
    def show_model_info(self):
        """Show model information."""
        if not self.model:
            self.color_print("❌ Model not initialized", 'red')
            return
        
        try:
            model_info = self.model.get_model_info()
            self.color_print("\n🤖 Model Information:", 'cyan')
            self.color_print(f"  Name: {model_info.name}", 'white')
            self.color_print(f"  Version: {model_info.version}", 'white')
            self.color_print(f"  Languages: {len(model_info.supported_languages)}", 'white')
            self.color_print(f"  Industries: {len(model_info.supported_industries)}", 'white')
            self.color_print(f"  Cultural Context: {'✅' if model_info.cultural_context_enabled else '❌'}", 'white')
            self.color_print(f"  Max Tokens: {model_info.max_tokens:,}", 'white')
        except Exception as e:
            self.color_print(f"❌ Error getting model info: {e}", 'red')
    
    def show_stats(self):
        """Show session statistics."""
        if not self.current_session:
            self.color_print("❌ No active session", 'red')
            return
        
        session = self.current_session
        duration = (datetime.now() - session.start_time).total_seconds()
        
        self.color_print("\n📊 Session Statistics:", 'cyan')
        self.color_print(f"  Session ID: {session.session_id}", 'white')
        self.color_print(f"  Duration: {duration:.0f} seconds", 'white')
        self.color_print(f"  Messages: {len(session.messages)}", 'white')
        self.color_print(f"  Language: {session.language.value}", 'white')
        self.color_print(f"  Industry: {session.industry.value if session.industry else 'None'}", 'white')
        self.color_print(f"  Region: {session.cultural_context.region.value}", 'white')
        
        # Calculate token usage if available
        total_tokens = sum(
            msg.get('usage', {}).get('total_tokens', 0) 
            for msg in session.messages 
            if msg.get('role') == 'assistant'
        )
        if total_tokens > 0:
            self.color_print(f"  Total Tokens: {total_tokens:,}", 'white')
    
    def detect_language(self, text: str):
        """Detect language of text."""
        if not text:
            self.color_print("❌ Please provide text to analyze", 'red')
            return
        
        try:
            result = self.language_detector.detect_language(text)
            stats = self.language_detector.get_language_statistics(text)
            
            self.color_print(f"\n🔍 Language Detection Results:", 'cyan')
            self.color_print(f"  Detected: {result.language.value.upper()}", 'green')
            self.color_print(f"  Confidence: {result.confidence:.2f}", 'yellow')
            self.color_print(f"  Script: {result.script_detected}", 'white')
            
            if result.alternative_languages:
                self.color_print("  Alternatives:", 'white')
                for lang, conf in result.alternative_languages[:3]:
                    self.color_print(f"    {lang.value.upper()}: {conf:.2f}", 'white')
            
            if stats.get('code_switching'):
                self.color_print("  🔄 Code-switching detected!", 'yellow')
                
        except Exception as e:
            self.color_print(f"❌ Error detecting language: {e}", 'red')
    
    def translate_text(self, text: str):
        """Simple translation interface."""
        if not text:
            self.color_print("❌ Please provide text to translate", 'red')
            return
        
        # Simple translation prompt
        prompt = f"Translate the following text to English: {text}"
        
        if self.current_session and self.model:
            try:
                response = self.model.chat(
                    message=prompt,
                    language=IndianLanguage.ENGLISH,
                    cultural_context=True
                )
                
                self.color_print(f"\n🔄 Translation:", 'cyan')
                self.color_print(f"  Original: {text}", 'white')
                self.color_print(f"  Translated: {response.content}", 'green')
                
            except Exception as e:
                self.color_print(f"❌ Error translating: {e}", 'red')
        else:
            self.color_print("❌ No active session or model", 'red')
    
    def process_message(self, message: str):
        """Process a user message."""
        if not self.current_session:
            self.color_print("❌ No active session. Type '/new' to start one.", 'red')
            return
        
        if not self.model:
            self.color_print("❌ Model not initialized", 'red')
            return
        
        # Add user message to session
        self.current_session.messages.append({
            "role": "user",
            "content": message,
            "timestamp": datetime.now().isoformat(),
            "language": self.current_session.language.value
        })
        
        # Display user message
        self.color_print(f"\n{self.colors['green']}You{self.colors['reset']}: ", end='')
        self.color_print(message, 'white')
        
        # Get model response
        self.color_print(f"\n{self.colors['blue']}IndiGLM{self.colors['reset']}: ", end='')
        
        try:
            response = self.model.chat(
                message=message,
                language=self.current_session.language,
                industry=self.current_session.industry,
                cultural_context=True,
                cultural_config=self.current_session.cultural_context
            )
            
            # Display response
            self.color_print(response.content, 'white')
            
            # Add to session
            self.current_session.messages.append({
                "role": "assistant",
                "content": response.content,
                "timestamp": datetime.now().isoformat(),
                "language": response.language_detected,
                "usage": response.usage.to_dict(),
                "cultural_insights": response.cultural_insights,
                "industry_insights": response.industry_insights
            })
            
        except Exception as e:
            self.color_print(f"❌ Error: {e}", 'red')
    
    def run(self):
        """Run the interactive chat interface."""
        if not self.model:
            return
        
        self.display_welcome()
        self.start_session()
        
        try:
            while True:
                try:
                    # Get user input
                    prompt = f"\n{self.colors['green']}"
                    if self.current_session:
                        prompt += f"[{self.current_session.language.value.upper()}"
                        if self.current_session.industry:
                            prompt += f"|{self.current_session.industry.value}"
                        prompt += "]"
                    prompt += f"{self.colors['reset']}: "
                    
                    user_input = input(prompt).strip()
                    
                    if not user_input:
                        continue
                    
                    # Check for commands
                    if user_input.startswith('/'):
                        parts = user_input[1:].split(' ', 1)
                        command = parts[0]
                        args = parts[1] if len(parts) > 1 else ""
                        
                        if not self.process_command(command, args):
                            break  # Exit command
                    else:
                        # Process as regular message
                        self.process_message(user_input)
                
                except KeyboardInterrupt:
                    self.color_print("\n\n👋 Goodbye!", 'yellow')
                    break
                except EOFError:
                    self.color_print("\n\n👋 Goodbye!", 'yellow')
                    break
        
        finally:
            # Save history and cleanup
            self.save_history()
            
            # Save current session if exists
            if self.current_session:
                self.chat_history.append(self.current_session)
                if len(self.chat_history) > 0:
                    self.color_print(f"\n💾 Saved {len(self.chat_history)} session(s) to history", 'green')


def main():
    """Main entry point for the chat interface."""
    import argparse
    
    parser = argparse.ArgumentParser(description="IndiGLM Interactive Chat")
    parser.add_argument('--api-key', help='IndiGLM API key')
    parser.add_argument('--language', default='hi', help='Default language (default: hi)')
    parser.add_argument('--industry', help='Default industry')
    parser.add_argument('--region', default='north', help='Default region (default: north)')
    
    args = parser.parse_args()
    
    # Create and run chat interface
    chat = IndiGLMChat(args.api_key)
    
    if chat.model:
        # Parse arguments
        try:
            language = IndianLanguage(args.language)
            industry = IndustryType(args.industry) if args.industry else None
            region = Region(args.region)
            
            chat.start_session(language, industry, region)
            chat.run()
        except ValueError as e:
            chat.color_print(f"❌ Invalid argument: {e}", 'red')
    else:
        chat.color_print("❌ Failed to initialize IndiGLM", 'red')


if __name__ == "__main__":
    main()