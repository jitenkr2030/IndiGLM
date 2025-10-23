'use client';

import { useState } from 'react';
import { IndiGLMChat } from '@/components/indiglm/IndiGLMChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Languages, MapPin, Calendar } from 'lucide-react';

export default function ChatPage() {
  const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_INDIGLM_API_KEY || '');

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            IndiGLM Chat Interface
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the power of AI with deep understanding of Indian languages, culture, and context.
            Chat in 22+ Indian languages with cultural awareness.
          </p>
        </div>

        <Tabs defaultValue="chat" className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="languages">Languages</TabsTrigger>
            <TabsTrigger value="setup">Setup</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-6">
            <IndiGLMChat apiKey={apiKey} />
          </TabsContent>

          <TabsContent value="features" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Cultural Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Deep understanding of Indian festivals and traditions</li>
                    <li>• Awareness of regional customs and practices</li>
                    <li>• Contextual responses for Indian scenarios</li>
                    <li>• Traditional values and modern context integration</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    Multilingual Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• 22+ official Indian languages</li>
                    <li>• Native language understanding and generation</li>
                    <li>• Code-switching between languages</li>
                    <li>• Transliteration support</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Regional Awareness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• North, South, East, West, and Central India</li>
                    <li>• State-specific cultural references</li>
                    <li>• Local customs and traditions</li>
                    <li>• Regional dialects and variations</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Festival Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Diwali, Holi, Eid, Christmas, and more</li>
                    <li>• Regional festivals like Pongal, Baisakhi</li>
                    <li>• Festival-specific responses and greetings</li>
                    <li>• Cultural significance and traditions</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="languages" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Supported Indian Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    { code: 'hi', name: 'हिन्दी', english: 'Hindi' },
                    { code: 'bn', name: 'বাংলা', english: 'Bengali' },
                    { code: 'te', name: 'తెలుగు', english: 'Telugu' },
                    { code: 'mr', name: 'मराठी', english: 'Marathi' },
                    { code: 'ta', name: 'தமிழ்', english: 'Tamil' },
                    { code: 'gu', name: 'ગુજરાતી', english: 'Gujarati' },
                    { code: 'ur', name: 'اردو', english: 'Urdu' },
                    { code: 'kn', name: 'ಕನ್ನಡ', english: 'Kannada' },
                    { code: 'or', name: 'ଓଡ଼ିଆ', english: 'Odia' },
                    { code: 'ml', name: 'മലയാളം', english: 'Malayalam' },
                    { code: 'pa', name: 'ਪੰਜਾਬੀ', english: 'Punjabi' },
                    { code: 'as', name: 'অসমীয়া', english: 'Assamese' },
                    { code: 'mai', name: 'मैथिली', english: 'Maithili' },
                    { code: 'sa', name: 'संस्कृतम्', english: 'Sanskrit' },
                    { code: 'ks', name: 'کٲشُر', english: 'Kashmiri' },
                    { code: 'ne', name: 'नेपाली', english: 'Nepali' },
                    { code: 'sd', name: 'سنڌي', english: 'Sindhi' },
                    { code: 'doi', name: 'ڈوگرى', english: 'Dogri' },
                    { code: 'kok', name: 'कोंकणी', english: 'Konkani' },
                    { code: 'sat', name: 'ᱥᱟᱱᱛᱟᱲᱤ', english: 'Santali' },
                    { code: 'mni', name: 'ꯃꯩꯇꯩꯂꯣꯟ', english: 'Manipuri' },
                    { code: 'brx', name: 'बोड़ो', english: 'Bodo' },
                    { code: 'en', name: 'English', english: 'English' }
                  ].map((lang) => (
                    <div key={lang.code} className="text-center">
                      <div className="text-lg font-semibold">{lang.name}</div>
                      <div className="text-sm text-muted-foreground">{lang.english}</div>
                      <Badge variant="outline" className="mt-1">
                        {lang.code}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="setup" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>API Key Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="apiKey" className="text-sm font-medium">
                    IndiGLM API Key
                  </label>
                  <input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your IndiGLM API key"
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">How to get an API Key:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Visit <a href="https://api.indiglm.ai" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">api.indiglm.ai</a></li>
                    <li>Sign up for an account</li>
                    <li>Navigate to the API Keys section</li>
                    <li>Generate a new API key</li>
                    <li>Copy and paste it above</li>
                  </ol>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Environment Variables:</h4>
                  <div className="text-sm space-y-1">
                    <div><code className="bg-background px-1 rounded">NEXT_PUBLIC_INDIGLM_API_KEY</code> - Your API key</div>
                    <div><code className="bg-background px-1 rounded">INDIGLM_BASE_URL</code> - API base URL (optional)</div>
                    <div><code className="bg-background px-1 rounded">INDIGLM_DEFAULT_LANGUAGE</code> - Default language (optional)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}