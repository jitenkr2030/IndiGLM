'use client'

import { useState } from 'react'
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "@/components/auth/auth-modal"
import { MobileLayout } from "@/components/ui/mobile-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  MessageSquare, 
  Image, 
  Search, 
  Users, 
  Shield, 
  Zap, 
  Globe,
  Mic,
  FileText,
  Code,
  BarChart3,
  Heart,
  Star,
  Check
} from "lucide-react"

export default function FeaturesPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, logout, loading } = useAuth()

  const handleAuthClick = () => {
    if (user) {
      logout()
    } else {
      setIsAuthModalOpen(true)
    }
  }

  const coreFeatures = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Advanced AI Models",
      description: "State-of-the-art language models specifically trained for Indian languages and cultural context.",
      features: [
        "22+ Indian languages supported",
        "Deep cultural understanding",
        "Contextual responses",
        "Multi-turn conversations"
      ]
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Intelligent Chat",
      description: "Natural conversations with AI that understands Indian context, traditions, and nuances.",
      features: [
        "Real-time conversations",
        "Cultural context awareness",
        "Multiple language support",
        "Conversation history"
      ]
    },
    {
      icon: <Image className="w-8 h-8" />,
      title: "Image Generation",
      description: "Create stunning images with Indian cultural themes and traditional aesthetics.",
      features: [
        "Indian cultural themes",
        "Traditional art styles",
        "Custom prompts",
        "High-resolution output"
      ]
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Web Search",
      description: "Access real-time information with India-focused search capabilities.",
      features: [
        "India-focused results",
        "Real-time information",
        "Multiple search types",
        "Source verification"
      ]
    }
  ]

  const advancedFeatures = [
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Voice Recognition",
      description: "Convert speech to text in multiple Indian languages with high accuracy.",
      features: [
        "22+ Indian languages",
        "Real-time transcription",
        "Speaker identification",
        "Accent adaptation"
      ]
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Document Processing",
      description: "Extract and analyze content from various document formats with Indian language support.",
      features: [
        "Multiple format support",
        "OCR capabilities",
        "Content analysis",
        "Language detection"
      ]
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Code Generation",
      description: "Generate, analyze, and debug code with context-aware AI assistance.",
      features: [
        "Multiple programming languages",
        "Code optimization",
        "Bug detection",
        "Documentation generation"
      ]
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics & Insights",
      description: "Comprehensive analytics and insights for your AI-powered applications.",
      features: [
        "Usage analytics",
        "Performance metrics",
        "User behavior insights",
        "Custom reports"
      ]
    }
  ]

  const enterpriseFeatures = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Bank-level security with advanced encryption and compliance features.",
      features: [
        "End-to-end encryption",
        "SOC 2 compliance",
        "Data privacy",
        "Audit trails"
      ]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Collaboration",
      description: "Collaborative features for teams with role-based access control.",
      features: [
        "Team workspaces",
        "Role-based permissions",
        "Shared resources",
        "Activity tracking"
      ]
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "High Performance",
      description: "Lightning-fast response times with scalable infrastructure.",
      features: [
        "Sub-200ms response",
        "99.9% uptime",
        "Auto-scaling",
        "Global CDN"
      ]
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Scalability",
      description: "Scale your applications globally with our distributed infrastructure.",
      features: [
        "Multi-region deployment",
        "Load balancing",
        "Disaster recovery",
        "24/7 monitoring"
      ]
    }
  ]

  const capabilities = [
    "Multi-Language Support",
    "Cultural Context Understanding",
    "Real-time Processing",
    "Enterprise Security",
    "Scalable Infrastructure",
    "Developer-Friendly APIs",
    "Custom Model Training",
    "Advanced Analytics",
    "Voice Recognition",
    "Image Generation",
    "Document Processing",
    "Code Generation"
  ]

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        {/* Navigation */}
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-2">
                <img
                  src="/indiglm-logo.svg"
                  alt="IndiGLM Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
                <span className="text-xl font-bold text-foreground">IndiGLM</span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <a href="/" className="text-sm font-medium hover:text-primary transition-colors">
                  Home
                </a>
                <a href="/features" className="text-sm font-medium text-primary transition-colors">
                  Features
                </a>
                <a href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                  Dashboard
                </a>
                <a href="/api" className="text-sm font-medium hover:text-primary transition-colors">
                  API
                </a>
                <a href="/docs" className="text-sm font-medium hover:text-primary transition-colors">
                  Documentation
                </a>
                <a href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
                  Pricing
                </a>
              </div>
              
              {/* Desktop User Actions */}
              <div className="hidden md:flex items-center space-x-4">
                {loading ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
                ) : user ? (
                  <>
                    <a
                      href="/dashboard"
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      Dashboard
                    </a>
                    <button
                      onClick={handleAuthClick}
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleAuthClick}
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Sign In
                  </button>
                )}
                <a
                  href={user ? "/dashboard" : "/dashboard"}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  {user ? "Dashboard" : "Get Started"}
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-4">
                <Star className="w-3 h-3 mr-1" />
                Powerful Features
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Everything You Need to Build
                <span className="block text-primary mt-2">AI-Powered Applications</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Discover the comprehensive suite of features designed specifically for Indian developers and businesses. 
                From multi-language support to cultural context understanding, we've got you covered.
              </p>
            </div>
          </div>
        </section>

        {/* Capabilities Overview */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Core Capabilities</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform offers a comprehensive set of capabilities designed to meet all your AI needs.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {capabilities.map((capability, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-background rounded-lg border">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-medium">{capability}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Core Features</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful AI capabilities designed specifically for the Indian market.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {coreFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-primary">{feature.icon}</div>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.features.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Features */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Advanced Features</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Take your applications to the next level with our advanced AI capabilities.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {advancedFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-primary">{feature.icon}</div>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.features.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enterprise Features */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Enterprise Features</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built for scale, security, and reliability in enterprise environments.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {enterpriseFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-primary">{feature.icon}</div>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.features.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Experience the power of IndiGLM with our comprehensive feature set designed for the Indian market.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={handleAuthClick}
                  className="bg-primary text-primary-foreground"
                >
                  {user ? 'Go to Dashboard' : 'Start Free Trial'}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => window.location.href = '/pricing'}
                >
                  View Pricing
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-muted border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <img
                    src="/indiglm-logo.svg"
                    alt="IndiGLM Logo"
                    width={32}
                    height={32}
                    className="h-8 w-auto"
                  />
                  <span className="text-xl font-bold text-foreground">IndiGLM</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  India&apos;s most advanced AI platform, offering cutting-edge language models with deep understanding of Indian languages, culture, and context.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    <span className="sr-only">GitHub</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="/features" className="text-sm text-muted-foreground hover:text-primary">Features</a></li>
                  <li><a href="/api" className="text-sm text-muted-foreground hover:text-primary">API</a></li>
                  <li><a href="/docs" className="text-sm text-muted-foreground hover:text-primary">Documentation</a></li>
                  <li><a href="/pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="/about" className="text-sm text-muted-foreground hover:text-primary">About</a></li>
                  <li><a href="/blog" className="text-sm text-muted-foreground hover:text-primary">Blog</a></li>
                  <li><a href="/careers" className="text-sm text-muted-foreground hover:text-primary">Careers</a></li>
                  <li><a href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t">
              <p className="text-sm text-muted-foreground text-center">
                © 2024 IndiGLM. All rights reserved. Built with pride in India 🇮🇳
              </p>
            </div>
          </div>
        </footer>

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      </div>
    </MobileLayout>
  )
}