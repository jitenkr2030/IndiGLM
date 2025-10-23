'use client'

import { useState } from 'react'
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "@/components/auth/auth-modal"
import { MobileLayout } from "@/components/ui/mobile-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Brain, 
  Network, 
  Zap, 
  MemoryStick, 
  Target, 
  TrendingUp, 
  CheckCircle,
  Star,
  ArrowRight,
  BarChart3,
  Clock,
  Cpu,
  Layers,
  GitBranch,
  Lightbulb
} from "lucide-react"
import { MarkovianThinkingInterface } from "@/components/markovian-thinking/MarkovianThinkingInterface"

export default function MarkovianThinkingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, logout, loading } = useAuth()

  const handleAuthClick = () => {
    if (user) {
      logout()
    } else {
      setIsAuthModalOpen(true)
    }
  }

  const benefits = [
    {
      icon: <MemoryStick className="w-6 h-6" />,
      title: "90% Memory Reduction",
      description: "Dramatically reduce memory usage through selective information retention"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "3-5x Faster Processing",
      description: "Achieve lightning-fast reasoning with optimized state transitions"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Improved Accuracy",
      description: "Maintain high solution quality while reducing computational overhead"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Linear Scalability",
      description: "Scale efficiently without exponential computational growth"
    }
  ]

  const useCases = [
    {
      category: "Scientific Research",
      icon: <Brain className="w-8 h-8" />,
      applications: [
        "Drug discovery and molecular modeling",
        "Mathematical proof generation",
        "Physics simulations",
        "Climate modeling"
      ]
    },
    {
      category: "Business Intelligence",
      icon: <BarChart3 className="w-8 h-8" />,
      applications: [
        "Financial modeling and risk assessment",
        "Supply chain optimization",
        "Market analysis and forecasting",
        "Strategic planning"
      ]
    },
    {
      category: "Healthcare",
      icon: <Cpu className="w-8 h-8" />,
      applications: [
        "Medical diagnosis and treatment planning",
        "Drug interaction analysis",
        "Clinical trial optimization",
        "Patient care personalization"
      ]
    },
    {
      category: "Technology",
      icon: <GitBranch className="w-8 h-8" />,
      applications: [
        "Code optimization and debugging",
        "System architecture design",
        "Algorithm development",
        "Performance optimization"
      ]
    }
  ]

  const technicalFeatures = [
    {
      title: "State-Based Processing",
      description: "Focus on current reasoning state rather than maintaining entire history",
      icon: <Layers className="w-6 h-6" />
    },
    {
      title: "Selective Memory Retention",
      description: "Carry forward only essential information between reasoning steps",
      icon: <MemoryStick className="w-6 h-6" />
    },
    {
      title: "Probabilistic Transitions",
      description: "Model reasoning steps as probabilistic state transitions",
      icon: <Network className="w-6 h-6" />
    },
    {
      title: "Optimal Path Finding",
      description: "Identify and follow the most efficient reasoning paths",
      icon: <Target className="w-6 h-6" />
    },
    {
      title: "Early Termination",
      description: "Stop reasoning when further steps provide diminishing returns",
      icon: <Clock className="w-6 h-6" />
    },
    {
      title: "Parallel Processing",
      description: "Explore multiple reasoning paths simultaneously with minimal overhead",
      icon: <Zap className="w-6 h-6" />
    }
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
                <a href="/features" className="text-sm font-medium hover:text-primary transition-colors">
                  Features
                </a>
                <a href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                  Dashboard
                </a>
                <a href="/capabilities" className="text-sm font-medium hover:text-primary transition-colors">
                  Capabilities
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
                Revolutionary AI Technology
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Markovian Thinking
                <span className="block text-primary mt-2">Efficient AI Reasoning</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Experience the future of AI reasoning with our groundbreaking Markovian Thinking technology. 
                Solve complex problems with unprecedented efficiency while maintaining exceptional accuracy.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="w-full sm:w-auto">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Try It Now
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Markovian Thinking?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover how our revolutionary approach transforms AI reasoning efficiency
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <div className="text-primary">{benefit.icon}</div>
                    </div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Try Markovian Thinking</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience the power of efficient AI reasoning firsthand
              </p>
            </div>
            
            <MarkovianThinkingInterface />
          </div>
        </section>

        {/* Technical Features */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Technical Innovation</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The science behind Markovian Thinking's efficiency
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {technicalFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-primary">{feature.icon}</div>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Real-World Applications</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover how Markovian Thinking transforms industries
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {useCases.map((useCase, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <div className="text-primary">{useCase.icon}</div>
                      </div>
                      <div>
                        <CardTitle className="text-xl">{useCase.category}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {useCase.applications.map((application, appIndex) => (
                        <div key={appIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{application}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Performance Comparison */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Performance Comparison</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See how Markovian Thinking outperforms traditional approaches
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-lg text-red-600">Traditional AI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Memory Usage</span>
                      <Badge variant="destructive">100%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Processing Speed</span>
                      <Badge variant="destructive">1x</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Scalability</span>
                      <Badge variant="destructive">Exponential</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg text-primary">Markovian Thinking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Memory Usage</span>
                      <Badge className="bg-green-100 text-green-800">10%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Processing Speed</span>
                      <Badge className="bg-green-100 text-green-800">3-5x</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Scalability</span>
                      <Badge className="bg-green-100 text-green-800">Linear</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-lg text-blue-600">Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Memory Saved</span>
                      <Badge variant="outline">90%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Speed Increase</span>
                      <Badge variant="outline">300-500%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Efficiency Gain</span>
                      <Badge variant="outline">Significant</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl">Ready to Transform Your AI?</CardTitle>
                  <CardDescription>
                    Join the revolution in efficient AI reasoning with Markovian Thinking
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Today
                  </Button>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </MobileLayout>
  )
}