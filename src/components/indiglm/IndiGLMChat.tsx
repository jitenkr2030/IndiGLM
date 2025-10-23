'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { getIndiGLMService, type IndiGLMService } from '@/lib/indiglm';
import { Send, Loader2, Bot, User, Globe, MapPin, Calendar, Users, Sparkles } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language?: string;
  culturalContext?: boolean;
  region?: string;
}

interface IndiGLMChatProps {
  apiKey?: string;
  height?: string;
}

export function IndiGLMChat({ apiKey, height = '600px' }: IndiGLMChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('hi');
  const [enableCulturalContext, setEnableCulturalContext] = useState<boolean>(true);
  const [selectedRegion, setSelectedRegion] = useState<string>('north');
  const [enablePersonalization, setEnablePersonalization] = useState<boolean>(true);
  const [conversationMode, setConversationMode] = useState<string>('general');
  const [indiglmService, setIndiglmService] = useState<IndiGLMService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (apiKey) {
      try {
        const service = getIndiGLMService({
          apiKey,
          defaultLanguage: selectedLanguage,
          enableCulturalContext: enableCulturalContext
        });
        setIndiglmService(service);
      } catch (error) {
        console.error('Failed to initialize IndiGLM:', error);
      }
    }
  }, [apiKey, selectedLanguage, enableCulturalContext]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !indiglmService || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
      language: selectedLanguage,
      culturalContext: enableCulturalContext,
      region: selectedRegion
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await indiglmService.chatCompletion([
        { role: 'user', content: input }
      ], {
        language: selectedLanguage,
        culturalContext: enableCulturalContext,
        region: selectedRegion,
        personalization: enablePersonalization,
        conversationMode: conversationMode
      });

      if (response.success && response.data) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response.data.content,
          timestamp: new Date(),
          language: selectedLanguage,
          culturalContext: enableCulturalContext,
          region: selectedRegion
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: `Sorry, I encountered an error: ${response.error}`,
          timestamp: new Date(),
          language: selectedLanguage
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an unexpected error. Please try again.',
        timestamp: new Date(),
        language: selectedLanguage
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const getLanguageName = (language: string): string => {
    const languageNames: Record<string, string> = {
      hi: 'हिन्दी',
      bn: 'বাংলা',
      te: 'తెలుగు',
      mr: 'मराठी',
      ta: 'தமிழ்',
      gu: 'ગુજરાતી',
      ur: 'اردو',
      kn: 'ಕನ್ನಡ',
      or: 'ଓଡ଼ିଆ',
      ml: 'മലയാളം',
      pa: 'ਪੰਜਾਬੀ',
      as: 'অসমীয়া',
      mai: 'मैथिली',
      sa: 'संस्कृतम्',
      ks: 'کٲشُر',
      ne: 'नेपाली',
      sd: 'سنڌي',
      doi: 'ڈوگرى',
      kok: 'कोंकणी',
      sat: 'ᱥᱟᱱᱛᱟᱲᱤ',
      mni: 'ꯃꯩꯇꯩꯂꯣꯟ',
      brx: 'बोड़ो',
      en: 'English'
    };
    return languageNames[language] || language;
  };

  const getRegionName = (region: string): string => {
    const regionNames: Record<string, string> = {
      north: 'North India',
      south: 'South India',
      east: 'East India',
      west: 'West India',
      northeast: 'Northeast India',
      central: 'Central India'
    };
    return regionNames[region] || region;
  };

  if (!apiKey) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">IndiGLM Chat</h3>
            <p className="text-muted-foreground mb-4">
              Please provide an API key to use IndiGLM chat functionality.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            IndiGLM Chat
            <Badge variant="secondary" className="ml-2">
              <Sparkles className="h-3 w-3 mr-1" />
              Enhanced
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedLanguage} onValueChange={(value: string) => setSelectedLanguage(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hi">हिन्दी</SelectItem>
                <SelectItem value="bn">বাংলা</SelectItem>
                <SelectItem value="te">తెలుగు</SelectItem>
                <SelectItem value="mr">मराठी</SelectItem>
                <SelectItem value="ta">தமிழ்</SelectItem>
                <SelectItem value="gu">ગુજરાતી</SelectItem>
                <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
                <SelectItem value="ml">മലയാളം</SelectItem>
                <SelectItem value="pa">ਪੰਜਾਬੀ</SelectItem>
                <SelectItem value="ur">اردو</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline">
              <Globe className="h-3 w-3 mr-1" />
              {getLanguageName(selectedLanguage)}
            </Badge>
            <Button variant="outline" size="sm" onClick={clearChat}>
              Clear
            </Button>
          </div>
        </div>
        
        {/* Advanced Controls */}
        <div className="flex flex-wrap gap-4 pt-2 border-t">
          <div className="flex items-center gap-2">
            <Switch
              checked={enableCulturalContext}
              onCheckedChange={setEnableCulturalContext}
            />
            <span className="text-sm">Cultural Context</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={selectedRegion} onValueChange={(value: string) => setSelectedRegion(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="north">North</SelectItem>
                <SelectItem value="south">South</SelectItem>
                <SelectItem value="east">East</SelectItem>
                <SelectItem value="west">West</SelectItem>
                <SelectItem value="northeast">Northeast</SelectItem>
                <SelectItem value="central">Central</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              {getRegionName(selectedRegion)}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              checked={enablePersonalization}
              onCheckedChange={setEnablePersonalization}
            />
            <span className="text-sm">Personalization</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={conversationMode} onValueChange={(value: string) => setConversationMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="p-4" style={{ height }}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Welcome to IndiGLM Enhanced Chat</h3>
                <p className="text-muted-foreground mb-2">
                  Start a conversation in {getLanguageName(selectedLanguage)} with deep cultural understanding.
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {getLanguageName(selectedLanguage)}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {getRegionName(selectedRegion)}
                  </div>
                  {enableCulturalContext && (
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Cultural Context
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-1">
                        {message.culturalContext && (
                          <Badge variant="secondary" className="text-xs">
                            <Sparkles className="h-2 w-2 mr-1" />
                            Cultural
                          </Badge>
                        )}
                        {message.region && (
                          <Badge variant="outline" className="text-xs">
                            <MapPin className="h-2 w-2 mr-1" />
                            {message.region}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {message.role === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="bg-muted rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking with cultural context...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={`Type your message in ${getLanguageName(selectedLanguage)}...`}
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim() || isLoading}
              size="icon"
              className="self-end"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <div>
              Press Enter to send, Shift+Enter for new line
            </div>
            <div className="flex items-center gap-2">
              <span>Mode: {conversationMode}</span>
              {enableCulturalContext && <span>• Cultural Context ON</span>}
              {enablePersonalization && <span>• Personalization ON</span>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}