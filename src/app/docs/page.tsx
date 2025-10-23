'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, 
  Code, 
  Settings, 
  Zap, 
  Globe, 
  Brain, 
  Users, 
  BarChart3,
  Download,
  Copy,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Star,
  Shield,
  Smartphone,
  Server,
  Database,
  Key
} from 'lucide-react';
import Link from 'next/link';

export default function DocumentationPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const codeExamples = {
    installation: `npm install @indiglm/sdk
# or
yarn add @indiglm/sdk`,

    basicSetup: `import { IndiGLM } from '@indiglm/sdk';

const indiglm = new IndiGLM({
  apiKey: process.env.INDIGLM_API_KEY,
  defaultLanguage: 'hi',
  enableCulturalContext: true
});`,

    chatCompletion: `const response = await indiglm.chat.completions.create({
  messages: [
    {
      role: 'user',
      content: 'Tell me about Diwali celebrations in India'
    }
  ],
  language: 'hi',
  culturalContext: true,
  region: 'north'
});

console.log(response.choices[0].message.content);`,

    personalization: `// Create user profile
const userProfile = await indiglm.createUserProfile({
  user_id: 'user-123',
  language: 'hi',
  cultural_background: {
    region: 'north',
    preferences: {
      festivals: ['diwali', 'holi'],
      cuisine: ['north-indian']
    }
  },
  personality_traits: {
    openness: 0.8,
    extraversion: 0.6
  }
});

// Get personalized response
const personalized = await indiglm.getPersonalizedResponse({
  userId: 'user-123',
  inputText: 'What should I wear for a wedding?',
  context: { event: 'wedding' }
});`,

    multimodal: `// Process text, image, and audio together
const multimodal = await indiglm.multimodal.process({
  text: 'Describe this image',
  imageUrl: '/path/to/image.jpg',
  audioUrl: '/path/to/audio.mp3',
  language: 'hi',
  culturalContext: true
});`,

    realtimeTranslation: `const translation = await indiglm.translation.create({
  text: 'Hello, how are you?',
  sourceLanguage: 'en',
  targetLanguage: 'hi',
  preserveCulturalContext: true
});

console.log(translation.translatedText);
// Output: 'नमस्ते, आप कैसे हैं?'`,

    webSearch: `const search = await indiglm.webSearch({
  query: 'government schemes for farmers in India',
  region: 'india',
  language: 'en',
  prioritizeGovernment: true
});`,

    imageGeneration: `const image = await indiglm.images.generate({
  prompt: 'Traditional Diwali celebration with rangoli and diyas',
  style: 'indian-traditional',
  size: '1024x1024',
  culturalTheme: 'diwali'
});`,

    advancedReasoning: `const reasoning = await indiglm.reasoning.solve({
  problem: 'How to improve agricultural productivity in India?',
  reasoningType: 'analytical',
  domain: 'agriculture',
  context: {
    region: 'india',
    constraints: ['sustainable', 'cost-effective']
  }
});`
  };

  const features = [
    {
      title: 'Multi-Language Support',
      description: 'Native support for 22+ Indian languages with cultural context',
      icon: <Globe className="h-6 w-6" />,
      examples: ['Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati']
    },
    {
      title: 'Cultural Intelligence',
      description: 'Deep understanding of Indian culture, traditions, and regional nuances',
      icon: <Brain className="h-6 w-6" />,
      examples: ['Festivals', 'Traditions', 'Regional Customs', 'Cultural Context']
    },
    {
      title: 'Hyper-Personalization',
      description: 'Individual-level adaptation based on user profiles and preferences',
      icon: <Users className="h-6 w-6" />,
      examples: ['User Profiling', 'Learning System', 'Adaptive Responses']
    },
    {
      title: 'Real-time Processing',
      description: 'Lightning-fast responses with sub-500ms latency',
      icon: <Zap className="h-6 w-6" />,
      examples: ['Chat', 'Translation', 'Voice Recognition']
    },
    {
      title: 'Multi-Modal AI',
      description: 'Process text, voice, images, and video with cultural understanding',
      icon: <BarChart3 className="h-6 w-6" />,
      examples: ['Text + Image', 'Voice + Video', 'Cross-modal Analysis']
    },
    {
      title: 'Enterprise Ready',
      description: 'Scalable infrastructure with bank-level security',
      icon: <Shield className="h-6 w-6" />,
      examples: ['API Security', 'Data Privacy', 'Scalability']
    }
  ];

  const useCases = [
    {
      title: 'Customer Support',
      description: 'Provide culturally aware customer support in multiple Indian languages',
      industry: 'E-commerce',
      benefits: ['24/7 Support', 'Multi-language', 'Cultural Sensitivity']
    },
    {
      title: 'Content Creation',
      description: 'Generate culturally relevant content for Indian audiences',
      industry: 'Media & Entertainment',
      benefits: ['Cultural Authenticity', 'Regional Adaptation', 'Creative Excellence']
    },
    {
      title: 'Education',
      description: 'Personalized learning experiences with cultural context',
      industry: 'EdTech',
      benefits: ['Personalized Learning', 'Cultural Relevance', 'Multi-language']
    },
    {
      title: 'Healthcare',
      description: 'Culturally sensitive healthcare communication and support',
      industry: 'Healthcare',
      benefits: ['Cultural Sensitivity', 'Language Access', 'Patient Trust']
    },
    {
      title: 'Government Services',
      description: 'Accessible government services in regional languages',
      industry: 'Government',
      benefits: ['Citizen Access', 'Language Inclusion', 'Service Efficiency']
    },
    {
      title: 'Financial Services',
      description: 'Culturally appropriate financial guidance and support',
      industry: 'FinTech',
      benefits: ['Cultural Trust', 'Language Access', 'Financial Inclusion']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">IndiGLM Documentation</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/api">API Reference</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/pricing">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            IndiGLM Developer Documentation
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete guide to integrating IndiGLM's powerful AI capabilities into your applications. 
            Build culturally intelligent applications for the Indian market.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge variant="secondary">
              <Star className="h-3 w-3 mr-1" />
              22+ Languages
            </Badge>
            <Badge variant="secondary">
              <Brain className="h-3 w-3 mr-1" />
              Cultural AI
            </Badge>
            <Badge variant="secondary">
              <Zap className="h-3 w-3 mr-1" />
              &lt;500ms Response
            </Badge>
            <Badge variant="secondary">
              <Shield className="h-3 w-3 mr-1" />
              Enterprise Ready
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="examples">Code Examples</TabsTrigger>
            <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="reference">API Reference</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Key Setup
                  </CardTitle>
                  <CardDescription>
                    Get your API key to start using IndiGLM
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Get Your API Key:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Visit <a href="https://api.indiglm.ai" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">api.indiglm.ai</a></li>
                      <li>Sign up for an account</li>
                      <li>Navigate to the API Keys section</li>
                      <li>Generate a new API key</li>
                      <li>Copy and paste it in your application</li>
                    </ol>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Environment Variables:</h4>
                    <div className="space-y-1 text-sm font-mono">
                      <div>INDIGLM_API_KEY=your_api_key_here</div>
                      <div>INDIGLM_BASE_URL=https://api.indiglm.ai/v1</div>
                      <div>INDIGLM_DEFAULT_LANGUAGE=hi</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Installation
                  </CardTitle>
                  <CardDescription>
                    Install the IndiGLM SDK in your project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      {codeExamples.installation}
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleCopyCode(codeExamples.installation, 'installation')}
                    >
                      {copiedCode === 'installation' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-1">Prerequisites:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>Node.js 16+ or Python 3.8+</li>
                        <li>Valid API key from IndiGLM</li>
                        <li>Internet connection for API calls</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-1">Supported Platforms:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Web</Badge>
                        <Badge variant="outline">Mobile</Badge>
                        <Badge variant="outline">Desktop</Badge>
                        <Badge variant="outline">Server</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Basic Configuration
                </CardTitle>
                <CardDescription>
                  Configure IndiGLM for your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    {codeExamples.basicSetup}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopyCode(codeExamples.basicSetup, 'basicSetup')}
                  >
                    {copiedCode === 'basicSetup' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Configuration Options:</h4>
                    <ul className="text-sm space-y-1">
                      <li><code className="bg-background px-1 rounded">apiKey</code> - Your API key</li>
                      <li><code className="bg-background px-1 rounded">defaultLanguage</code> - Default language (e.g., 'hi')</li>
                      <li><code className="bg-background px-1 rounded">enableCulturalContext</code> - Enable cultural awareness</li>
                      <li><code className="bg-background px-1 rounded">baseUrl</code> - Custom API base URL</li>
                    </ul>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Best Practices:</h4>
                    <ul className="text-sm space-y-1">
                      <li>Store API keys in environment variables</li>
                      <li>Enable cultural context for Indian applications</li>
                      <li>Set appropriate default language</li>
                      <li>Implement proper error handling</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-primary">{feature.icon}</div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Key Capabilities:</h4>
                        <div className="flex flex-wrap gap-1">
                          {feature.examples.map((example, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="examples" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {Object.entries(codeExamples).filter(([key]) => key !== 'installation' && key !== 'basicSetup').map(([key, code]) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 capitalize">
                      <Code className="h-5 w-5" />
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </CardTitle>
                    <CardDescription>
                      {key === 'chatCompletion' && 'Generate conversational responses with cultural context'}
                      {key === 'personalization' && 'Create personalized experiences based on user profiles'}
                      {key === 'multimodal' && 'Process multiple types of input together'}
                      {key === 'realtimeTranslation' && 'Translate between Indian languages with cultural context'}
                      {key === 'webSearch' && 'Search the web with Indian content prioritization'}
                      {key === 'imageGeneration' && 'Generate images with Indian cultural themes'}
                      {key === 'advancedReasoning' && 'Solve complex problems with domain expertise'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                        {code}
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleCopyCode(code, key)}
                      >
                        {copiedCode === key ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="use-cases" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {useCases.map((useCase, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{useCase.title}</CardTitle>
                      <Badge variant="outline">{useCase.industry}</Badge>
                    </div>
                    <CardDescription>{useCase.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h4 className="font-semibold mb-2">Key Benefits:</h4>
                      <div className="flex flex-wrap gap-1">
                        {useCase.benefits.map((benefit, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="deployment" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Server Deployment
                  </CardTitle>
                  <CardDescription>
                    Deploy IndiGLM on your server infrastructure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">System Requirements:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Node.js 16+ or Python 3.8+</li>
                      <li>• 2GB RAM minimum</li>
                      <li>• Stable internet connection</li>
                      <li>• SSL/TLS for production</li>
                    </ul>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Deployment Steps:</h4>
                    <ol className="text-sm space-y-1">
                      <li>1. Install dependencies</li>
                      <li>2. Set environment variables</li>
                      <li>3. Configure your application</li>
                      <li>4. Test with API calls</li>
                      <li>5. Deploy to production</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Mobile Deployment
                  </CardTitle>
                  <CardDescription>
                    Integrate IndiGLM into mobile applications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Supported Platforms:</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">React Native</Badge>
                      <Badge variant="outline">Flutter</Badge>
                      <Badge variant="outline">iOS</Badge>
                      <Badge variant="outline">Android</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Mobile Considerations:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Optimize for mobile networks</li>
                      <li>• Implement offline support</li>
                      <li>• Use mobile-optimized UI</li>
                      <li>• Handle battery efficiently</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Best Practices
                </CardTitle>
                <CardDescription>
                  Production deployment recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Security
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• Use environment variables for API keys</li>
                        <li>• Implement rate limiting</li>
                        <li>• Validate all inputs</li>
                        <li>• Use HTTPS everywhere</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Performance
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• Implement caching strategies</li>
                        <li>• Use connection pooling</li>
                        <li>• Monitor response times</li>
                        <li>• Optimize for mobile</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Reliability
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• Implement retry logic</li>
                        <li>• Use circuit breakers</li>
                        <li>• Monitor API health</li>
                        <li>• Have fallback plans</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Scalability
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• Design for scale</li>
                        <li>• Use load balancing</li>
                        <li>• Monitor usage patterns</li>
                        <li>• Plan for growth</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reference" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>
                  Complete reference for all IndiGLM API endpoints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Chat Completions</h4>
                      <div className="text-sm font-mono bg-background px-2 py-1 rounded mb-2">
                        POST /v1/chat/completions
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Generate conversational responses with cultural context
                      </p>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Image Generation</h4>
                      <div className="text-sm font-mono bg-background px-2 py-1 rounded mb-2">
                        POST /v1/images/generations
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Generate images with Indian cultural themes
                      </p>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Translation</h4>
                      <div className="text-sm font-mono bg-background px-2 py-1 rounded mb-2">
                        POST /v1/translation
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Translate between Indian languages with cultural context
                      </p>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Personalization</h4>
                      <div className="text-sm font-mono bg-background px-2 py-1 rounded mb-2">
                        POST /v1/personalization
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Manage user profiles and personalized responses
                      </p>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Multimodal Processing</h4>
                      <div className="text-sm font-mono bg-background px-2 py-1 rounded mb-2">
                        POST /v1/multimodal/process
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Process text, images, audio, and video together
                      </p>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Web Search</h4>
                      <div className="text-sm font-mono bg-background px-2 py-1 rounded mb-2">
                        POST /v1/functions/web-search
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Search the web with Indian content prioritization
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Handling</CardTitle>
                <CardDescription>
                  Common errors and how to handle them
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Authentication Error (401)</h4>
                      <p className="text-sm text-muted-foreground">
                        Invalid or missing API key. Check your API key and ensure it's properly configured.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Rate Limit Error (429)</h4>
                      <p className="text-sm text-muted-foreground">
                        Too many requests. Implement exponential backoff and consider upgrading your plan.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Invalid Input (400)</h4>
                      <p className="text-sm text-muted-foreground">
                        Malformed request or invalid parameters. Validate your input data.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Server Error (500)</h4>
                      <p className="text-sm text-muted-foreground">
                        Internal server error. Implement retry logic with exponential backoff.
                      </p>
                    </div>
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