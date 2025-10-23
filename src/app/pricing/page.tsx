'use client'

import { useState } from 'react'
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "@/components/auth/auth-modal"
import { MobileLayout } from "@/components/ui/mobile-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Shield, Users, Headphones } from "lucide-react"

export default function PricingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, logout, loading } = useAuth()

  const handleAuthClick = () => {
    if (user) {
      logout()
    } else {
      setIsAuthModalOpen(true)
    }
  }

  const pricingPlans = [
    {
      name: "Starter",
      price: "₹999",
      period: "month",
      description: "Perfect for individuals and small teams getting started with AI",
      popular: false,
      features: [
        "10,000 API calls per month",
        "5 Indian languages supported",
        "Basic cultural context",
        "Email support",
        "Standard response time",
        "Community access"
      ],
      limitations: [
        "No advanced features",
        "Limited customization",
        "Basic analytics"
      ]
    },
    {
      name: "Professional",
      price: "₹4,999",
      period: "month",
      description: "Ideal for growing businesses and professional developers",
      popular: true,
      features: [
        "100,000 API calls per month",
        "15 Indian languages supported",
        "Advanced cultural context",
        "Priority email support",
        "Fast response time (<500ms)",
        "Advanced analytics",
        "Custom model fine-tuning",
        "Webhook integration",
        "API rate limiting"
      ],
      limitations: []
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations with specific requirements",
      popular: false,
      features: [
        "Unlimited API calls",
        "All 22+ Indian languages",
        "Premium cultural context",
        "24/7 phone support",
        "Ultra-fast response time (<200ms)",
        "Enterprise analytics",
        "Advanced customization",
        "Dedicated account manager",
        "SLA guarantee",
        "On-premise deployment",
        "Custom integrations",
        "Advanced security features",
        "Compliance certifications"
      ],
      limitations: [],
      custom: true
    }
  ]

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Sub-500ms response times for real-time applications"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Bank-level encryption and data protection"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Multi-Language Support",
      description: "22+ Indian languages with cultural context"
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Round-the-clock technical assistance"
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
                <a href="/api" className="text-sm font-medium hover:text-primary transition-colors">
                  API
                </a>
                <a href="/docs" className="text-sm font-medium hover:text-primary transition-colors">
                  Documentation
                </a>
                <a href="/pricing" className="text-sm font-medium text-primary transition-colors">
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
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Simple, Transparent
                <span className="block text-primary mt-2">Pricing</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Choose the perfect plan for your needs. All plans include our core AI features with Indian language support and cultural context.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <div className="text-primary">{feature.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                    <div className="mt-4">
                      {plan.custom ? (
                        <div className="text-3xl font-bold">{plan.price}</div>
                      ) : (
                        <div className="text-3xl font-bold">
                          {plan.price}
                          <span className="text-base font-normal text-muted-foreground">/{plan.period}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">What's included:</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start space-x-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {plan.limitations.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">Limitations:</h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, limitationIndex) => (
                            <li key={limitationIndex} className="flex items-start space-x-2">
                              <div className="w-4 h-4 rounded-full bg-gray-300 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-primary' : 'bg-secondary'}`}
                      onClick={() => plan.custom ? window.location.href = '/contact' : handleAuthClick()}
                    >
                      {plan.custom ? 'Contact Sales' : (user ? 'Upgrade Plan' : 'Get Started')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div className="bg-background p-6 rounded-lg border">
                  <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                  <p className="text-sm text-muted-foreground">
                    We accept all major credit cards, debit cards, UPI, and bank transfers. For enterprise customers, we also offer invoice-based billing.
                  </p>
                </div>
                
                <div className="bg-background p-6 rounded-lg border">
                  <h3 className="font-semibold mb-2">Can I change my plan later?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.
                  </p>
                </div>
                
                <div className="bg-background p-6 rounded-lg border">
                  <h3 className="font-semibold mb-2">Do you offer discounts for non-profits or educational institutions?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, we offer special pricing for non-profits, educational institutions, and startups. Contact our sales team for more information.
                  </p>
                </div>
                
                <div className="bg-background p-6 rounded-lg border">
                  <h3 className="font-semibold mb-2">Is there a free trial available?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, we offer a 14-day free trial for all paid plans. No credit card required to start your trial.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of developers and businesses using IndiGLM to build amazing AI-powered applications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={handleAuthClick}
                  className="bg-primary text-primary-foreground"
                >
                  {user ? 'Upgrade Now' : 'Start Free Trial'}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => window.location.href = '/contact'}
                >
                  Contact Sales
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