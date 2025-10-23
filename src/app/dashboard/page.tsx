'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IndiGLMChat } from '@/components/indiglm/IndiGLMChat';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bot, 
  Image as ImageIcon, 
  Search, 
  Code, 
  Mic, 
  FileText, 
  BarChart3, 
  Globe,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Sparkles,
  IndianRupee
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_INDIGLM_API_KEY || '');
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      icon: <Bot className="h-8 w-8 text-blue-600" />,
      title: 'AI Chat',
      description: 'Conversational AI with Indian cultural context and 22+ languages',
      status: 'active',
      link: '/chat',
      capabilities: ['Multi-language', 'Cultural Context', 'Real-time']
    },
    {
      icon: <ImageIcon className="h-8 w-8 text-green-600" />,
      title: 'Image Generation',
      description: 'Create images with Indian themes, festivals, and cultural elements',
      status: 'active',
      link: '/image-generation',
      capabilities: ['Indian Themes', 'Festival Art', 'Cultural Elements']
    },
    {
      icon: <Search className="h-8 w-8 text-purple-600" />,
      title: 'Web Search',
      description: 'Real-time search with Indian content prioritization and regional focus',
      status: 'active',
      link: '/web-search',
      capabilities: ['Indian Focus', 'Regional Search', 'Government Content']
    },
    {
      icon: <Code className="h-8 w-8 text-orange-600" />,
      title: 'Code Tools',
      description: 'Development tools with Indian programming context and local libraries',
      status: 'beta',
      link: '/code-tools',
      capabilities: ['Indian Libraries', 'Local Context', 'Multi-language']
    },
    {
      icon: <Mic className="h-8 w-8 text-red-600" />,
      title: 'Voice Recognition',
      description: 'Speech-to-text for 22+ Indian languages with regional accents',
      status: 'coming-soon',
      link: '#',
      capabilities: ['22+ Languages', 'Regional Accents', 'Real-time']
    },
    {
      icon: <FileText className="h-8 w-8 text-indigo-600" />,
      title: 'File Processing',
      description: 'Document analysis with Indian language support and cultural context',
      status: 'beta',
      link: '/file-processing',
      capabilities: ['Multi-language', 'Cultural Analysis', 'Document Types']
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: 'Multimodal AI',
      description: 'Advanced processing of text, voice, images, and video with Indian context',
      status: 'beta',
      link: '/multimodal',
      capabilities: ['Text/Voice/Image', 'Cultural AI', 'Real-time']
    },
    {
      icon: <Globe className="h-8 w-8 text-cyan-600" />,
      title: 'Real-time Translation',
      description: 'Instant translation between 22+ Indian languages with cultural context',
      status: 'beta',
      link: '/translation',
      capabilities: ['22+ Languages', 'Cultural Context', 'Real-time']
    },
    {
      icon: <Users className="h-8 w-8 text-pink-600" />,
      title: 'Hyper-personalization',
      description: 'Individual-level cultural and linguistic adaptation with learning',
      status: 'beta',
      link: '/personalization',
      capabilities: ['User Profiling', 'Cultural Adaptation', 'Learning']
    }
  ];

  const stats = [
    {
      title: 'Languages Supported',
      value: '22+',
      description: 'Indian languages with native scripts and dialects',
      icon: <Globe className="h-4 w-4" />,
      color: 'text-blue-600'
    },
    {
      title: 'API Calls Today',
      value: '1,247',
      description: '+12% from yesterday',
      icon: <TrendingUp className="h-4 w-4" />,
      color: 'text-green-600'
    },
    {
      title: 'Active Users',
      value: '89',
      description: 'Currently online across India',
      icon: <Users className="h-4 w-4" />,
      color: 'text-purple-600'
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      description: 'Last 30 days reliability',
      icon: <Shield className="h-4 w-4" />,
      color: 'text-green-600'
    },
    {
      title: 'Cultural Context',
      value: '94%',
      description: 'Accuracy in Indian cultural understanding',
      icon: <Sparkles className="h-4 w-4" />,
      color: 'text-yellow-600'
    },
    {
      title: 'Response Time',
      value: '<500ms',
      description: 'Average chat completion time',
      icon: <Zap className="h-4 w-4" />,
      color: 'text-orange-600'
    },
    {
      title: 'Industries Covered',
      value: '8',
      description: 'Specialized Indian industry knowledge',
      icon: <IndianRupee className="h-4 w-4" />,
      color: 'text-indigo-600'
    },
    {
      title: 'AI Models',
      value: '15+',
      description: 'Specialized models for different tasks',
      icon: <Bot className="h-4 w-4" />,
      color: 'text-cyan-600'
    }
  ];

  const recentActivity = [
    {
      type: 'chat',
      user: 'Rajesh Kumar',
      action: 'had a conversation in Hindi about Diwali traditions',
      time: '2 minutes ago',
      icon: <Bot className="h-4 w-4" />
    },
    {
      type: 'image',
      user: 'Priya Sharma',
      action: 'generated traditional Diwali festival images with rangoli',
      time: '5 minutes ago',
      icon: <ImageIcon className="h-4 w-4" />
    },
    {
      type: 'search',
      user: 'Amit Patel',
      action: 'searched for government agricultural schemes in Gujarat',
      time: '8 minutes ago',
      icon: <Search className="h-4 w-4" />
    },
    {
      type: 'code',
      user: 'Sneha Reddy',
      action: 'used code tools for Tamil language processing project',
      time: '12 minutes ago',
      icon: <Code className="h-4 w-4" />
    },
    {
      type: 'translation',
      user: 'Mohammed Khan',
      action: 'translated a business document from English to Urdu',
      time: '15 minutes ago',
      icon: <Globe className="h-4 w-4" />
    },
    {
      type: 'multimodal',
      user: 'Ananya Das',
      action: 'processed a video with Bengali cultural content analysis',
      time: '18 minutes ago',
      icon: <Zap className="h-4 w-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Bot className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">IndiGLM Dashboard</span>
              </Link>
              <Badge variant="secondary" className="hidden sm:flex">
                <IndianRupee className="h-3 w-3 mr-1" />
                India's AI Platform
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/docs">Documentation</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/api">API Reference</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/pricing">Upgrade Plan</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="chat">AI Chat</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Welcome Section */}
            <div className="text-center py-8">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="h-12 w-12 text-primary mr-3" />
                <h1 className="text-4xl font-bold">Welcome to IndiGLM</h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience the power of AI tailored specifically for Indian languages, culture, and context.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                      </div>
                      <div className={stat.color}>
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      {feature.icon}
                      <Badge 
                        variant={feature.status === 'active' ? 'default' : feature.status === 'beta' ? 'secondary' : 'outline'}
                      >
                        {feature.status === 'active' ? 'Active' : feature.status === 'beta' ? 'Beta' : 'Coming Soon'}
                      </Badge>
                    </div>
                    <CardTitle className="flex items-center gap-2">
                      {feature.title}
                      {feature.status === 'coming-soon' && <Sparkles className="h-4 w-4 text-yellow-500" />}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Capabilities */}
                    {feature.capabilities && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {feature.capabilities.map((capability, capIndex) => (
                            <Badge key={capIndex} variant="outline" className="text-xs">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <Button 
                      className="w-full" 
                      disabled={feature.status === 'coming-soon'}
                      asChild={feature.status !== 'coming-soon'}
                    >
                      {feature.status === 'coming-soon' ? (
                        'Coming Soon'
                      ) : (
                        <Link href={feature.link}>
                          {feature.status === 'beta' ? 'Try Beta' : 'Open Tool'}
                        </Link>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Advanced Capabilities Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Advanced IndiGLM Capabilities
                </CardTitle>
                <CardDescription>
                  Experience cutting-edge AI technology specifically designed for the Indian context
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Globe className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Multi-Modal AI</h3>
                    <p className="text-sm text-muted-foreground">
                      Process text, voice, images, and video with deep cultural understanding
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Hyper-Personalization</h3>
                    <p className="text-sm text-muted-foreground">
                      Individual-level cultural and linguistic adaptation with learning
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Zap className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Real-time Translation</h3>
                    <p className="text-sm text-muted-foreground">
                      Instant translation between 22+ Indian languages with cultural context
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <IndianRupee className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Industry Intelligence</h3>
                    <p className="text-sm text-muted-foreground">
                      Specialized knowledge for 8 major Indian industries and markets
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions from IndiGLM users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                      <div className="text-primary">{activity.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.user}</p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Key Configuration</CardTitle>
                <CardDescription>
                  Enter your IndiGLM API key to use the chat functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter your IndiGLM API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    type="password"
                    className="flex-1"
                  />
                  <Button onClick={() => setApiKey('demo-key-for-testing')}>
                    Use Demo Key
                  </Button>
                </div>
              </CardContent>
            </Card>

            <IndiGLMChat apiKey={apiKey} height="600px" />
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Generation Tool */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Image Generation
                  </CardTitle>
                  <CardDescription>
                    Generate images with Indian cultural themes and elements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Describe the image you want to generate..."
                    className="min-h-[100px]"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1024x1024">1024x1024</SelectItem>
                        <SelectItem value="512x512">512x512</SelectItem>
                        <SelectItem value="256x256">256x256</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vivid">Vivid</SelectItem>
                        <SelectItem value="natural">Natural</SelectItem>
                        <SelectItem value="cinematic">Cinematic</SelectItem>
                        <SelectItem value="artistic">Artistic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="indian-theme" className="rounded" />
                    <label htmlFor="indian-theme" className="text-sm">Enable Indian cultural themes</label>
                  </div>
                  <Button className="w-full">Generate Image</Button>
                </CardContent>
              </Card>

              {/* Web Search Tool */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Web Search
                  </CardTitle>
                  <CardDescription>
                    Search the web with Indian content prioritization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Enter your search query..."
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Search Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="news">News</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in">India</SelectItem>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="indian-focus" className="rounded" defaultChecked />
                    <label htmlFor="indian-focus" className="text-sm">Prioritize Indian content</label>
                  </div>
                  <Button className="w-full">Search</Button>
                </CardContent>
              </Card>

              {/* Real-time Translation Tool */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Real-time Translation
                  </CardTitle>
                  <CardDescription>
                    Translate between 22+ Indian languages instantly
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Enter text to translate..."
                    className="min-h-[80px]"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="From Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                        <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                        <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                        <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="To Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                        <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                        <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                        <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="cultural-context" className="rounded" defaultChecked />
                    <label htmlFor="cultural-context" className="text-sm">Preserve cultural context</label>
                  </div>
                  <Button className="w-full">Translate</Button>
                </CardContent>
              </Card>

              {/* Voice Recognition Tool */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                    Voice Recognition
                  </CardTitle>
                  <CardDescription>
                    Convert speech to text for Indian languages
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8">
                    <Button size="lg" className="rounded-full w-16 h-16">
                      <Mic className="h-6 w-6" />
                    </Button>
                    <p className="mt-2 text-sm text-muted-foreground">Click to start recording</p>
                  </div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                      <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                      <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                      <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="regional-accent" className="rounded" />
                    <label htmlFor="regional-accent" className="text-sm">Detect regional accents</label>
                  </div>
                  <Button className="w-full" disabled>Coming Soon</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Statistics</CardTitle>
                  <CardDescription>Your API usage over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Usage Chart</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Language Distribution</CardTitle>
                  <CardDescription>Most used languages on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { language: 'हिन्दी', percentage: 35, users: '312' },
                      { language: 'English', percentage: 28, users: '249' },
                      { language: 'தமிழ்', percentage: 15, users: '134' },
                      { language: 'తెలుగు', percentage: 12, users: '107' },
                      { language: 'বাংলা', percentage: 10, users: '89' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{item.language}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{item.users}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Feature Usage</CardTitle>
                  <CardDescription>Most used IndiGLM features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { feature: 'AI Chat', usage: 45, trend: '+5%' },
                      { feature: 'Image Generation', usage: 25, trend: '+12%' },
                      { feature: 'Web Search', usage: 20, trend: '+8%' },
                      { feature: 'Translation', usage: 7, trend: '+15%' },
                      { feature: 'Code Tools', usage: 3, trend: '+2%' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{item.feature}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${item.usage}%` }}
                            />
                          </div>
                          <span className="text-sm text-green-600">{item.trend}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Distribution</CardTitle>
                  <CardDescription>User distribution across Indian regions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { region: 'North India', users: 156, percentage: 35 },
                      { region: 'South India', users: 124, percentage: 28 },
                      { region: 'West India', users: 89, percentage: 20 },
                      { region: 'East India', users: 45, percentage: 10 },
                      { region: 'Northeast', users: 31, percentage: 7 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{item.region}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">{item.users} users</span>
                          <Badge variant="outline">{item.percentage}%</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>System performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">99.9%</div>
                      <div className="text-sm text-muted-foreground">Uptime</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">&lt;500ms</div>
                      <div className="text-sm text-muted-foreground">Response Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">94%</div>
                      <div className="text-sm text-muted-foreground">Cultural Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">&lt;0.1%</div>
                      <div className="text-sm text-muted-foreground">Error Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cultural Context Analysis</CardTitle>
                  <CardDescription>Understanding of Indian cultural elements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { aspect: 'Festivals & Traditions', accuracy: 96 },
                      { aspect: 'Regional Customs', accuracy: 92 },
                      { aspect: 'Language Nuances', accuracy: 94 },
                      { aspect: 'Social Etiquette', accuracy: 89 },
                      { aspect: 'Historical Context', accuracy: 91 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{item.aspect}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className="bg-yellow-600 h-2 rounded-full" 
                              style={{ width: `${item.accuracy}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{item.accuracy}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}