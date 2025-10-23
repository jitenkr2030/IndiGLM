'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Brain, 
  Globe, 
  MapPin, 
  Sparkles, 
  TrendingUp, 
  Target, 
  BookOpen,
  Calendar,
  Heart,
  Star,
  Zap,
  Users,
  Settings,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { AdvancedUserProfile } from '@/components/indiglm/AdvancedUserProfile';
import { PersonalizationInsights } from '@/components/indiglm/PersonalizationInsights';

export default function PersonalizationPage() {
  const [userId] = useState<string>('demo-user-001');
  const [testInput, setTestInput] = useState<string>('Tell me about Diwali celebrations');
  const [personalizedResponse, setPersonalizedResponse] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGeneratePersonalizedResponse = async () => {
    if (!testInput.trim()) return;

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const responses = [
        "दिवाली भारत का सबसे प्रमुख त्योहार है, जिसे रोशनी का त्योहार के रूप में जाना जाता है। यह त्योहार अंधकार पर प्रकाश की जीत, बुराई पर अच्छाई की विजय, और अज्ञानता पर ज्ञान की जीत का प्रतीक है। आपकी उत्तर भारतीय संस्कृति के अनुसार, दिवाली के दौरान लोग अपने घरों को दीयों और रंगोली से सजाते हैं, नए कपड़े पहनते हैं, और मिठाइयाँ बाँटते हैं।",
        "Diwali, the Festival of Lights, is one of India's most significant celebrations. Given your North Indian cultural background and interest in traditions, you'll appreciate how families come together during this auspicious time. The festival typically involves lighting diyas, creating beautiful rangoli designs, wearing new traditional clothes, and exchanging sweets. The celebration spans five days, each with its own significance and rituals.",
        "দীপাবলি ভারতের অন্যতম প্রধান উৎসব, যা আলোর উৎসব নামে পরিচিত। আপনার সাংস্কৃতিক পটভূমি অনুযায়ী, এই উৎসবে মানুষ তাদের ঘরবাড়ি দিয়া এবং রঙ্গোলি দিয়ে সাজায়, নতুন কাপড় পরে, এবং মিষ্টি বিতরণ করে। এটি অন্ধকারের উপর আলোর, মন্দের উপর ভালোর জয়ের প্রতীক।"
      ];
      
      setPersonalizedResponse(responses[Math.floor(Math.random() * responses.length)]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            IndiGLM Hyper-Personalization
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience AI that adapts to your unique cultural background, personality traits, 
            and communication preferences for truly personalized interactions.
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">User Profile</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <AdvancedUserProfile 
              userId={userId}
              onProfileUpdate={(profile) => {
                console.log('Profile updated:', profile);
              }}
            />
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <PersonalizationInsights userId={userId} />
          </TabsContent>

          <TabsContent value="testing" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Test Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Test Personalization
                  </CardTitle>
                  <CardDescription>
                    See how IndiGLM adapts responses based on your profile
                  </CardDescription>
                </CardHeader>
                  <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Test Input</label>
                    <Textarea
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      placeholder="Enter text to test personalization..."
                      className="mt-1"
                    />
                  </div>
                  <Button 
                    onClick={handleGeneratePersonalizedResponse}
                    disabled={isGenerating || !testInput.trim()}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Zap className="h-4 w-4 mr-2 animate-spin" />
                        Generating Personalized Response...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Personalized Response
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Personalized Response */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Personalized Response
                  </CardTitle>
                  <CardDescription>
                    AI response adapted to your profile and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {personalizedResponse ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="whitespace-pre-wrap">{personalizedResponse}</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          <Globe className="h-3 w-3 mr-1" />
                          Language Adapted
                        </Badge>
                        <Badge variant="secondary">
                          <MapPin className="h-3 w-3 mr-1" />
                          Cultural Context
                        </Badge>
                        <Badge variant="secondary">
                          <Brain className="h-3 w-3 mr-1" />
                          Personality Matched
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Enter test input and click generate to see personalized responses</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personalization Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Personalization Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Enable Cultural Context</div>
                      <div className="text-xs text-muted-foreground">
                        Adapt responses based on cultural background
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Enable Personality Matching</div>
                      <div className="text-xs text-muted-foreground">
                        Match communication style to personality traits
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Enable Learning</div>
                      <div className="text-xs text-muted-foreground">
                        Continuously improve from interactions
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Adaptive Language</div>
                      <div className="text-xs text-muted-foreground">
                        Switch languages based on context
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              {/* Profile Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Primary Language</label>
                    <Select defaultValue="hi">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hi">हिन्दी</SelectItem>
                        <SelectItem value="bn">বাংলা</SelectItem>
                        <SelectItem value="te">తెలుగు</SelectItem>
                        <SelectItem value="mr">मराठी</SelectItem>
                        <SelectItem value="ta">தமிழ்</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Cultural Region</label>
                    <Select defaultValue="north">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="north">North India</SelectItem>
                        <SelectItem value="south">South India</SelectItem>
                        <SelectItem value="east">East India</SelectItem>
                        <SelectItem value="west">West India</SelectItem>
                        <SelectItem value="northeast">Northeast India</SelectItem>
                        <SelectItem value="central">Central India</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Communication Style</label>
                    <Select defaultValue="warm-friendly">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="warm-friendly">Warm & Friendly</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">
                    Update Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}