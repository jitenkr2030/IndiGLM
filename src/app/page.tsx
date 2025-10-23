'use client'

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "@/components/auth/auth-modal";
import { MobileNav } from "@/components/ui/mobile-nav";
import { MobileLayout } from "@/components/ui/mobile-layout";

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  const handleAuthClick = () => {
    if (user) {
      logout();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image
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
              <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
              <div className="relative group">
                <button className="text-sm font-medium hover:text-primary transition-colors flex items-center space-x-1">
                  <span>Tools</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link href="/chat" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted">
                      AI Chat
                    </Link>
                    <Link href="/image-generation" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted">
                      Image Generation
                    </Link>
                    <Link href="/web-search" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted">
                      Web Search
                    </Link>
                    <Link href="/playground" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted">
                      AI Playground
                    </Link>
                    <Link href="/file-processing" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted">
                      File Processing
                    </Link>
                    <Link href="/functions" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted">
                      Function Calling
                    </Link>
                    <Link href="/code-tools" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted">
                      Code Tools
                    </Link>
                    <Link href="/analytics" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted">
                      Analytics
                    </Link>
                    <Link href="/voice-recognition" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted">
                      Voice Recognition
                    </Link>
                    <Link href="/content-moderation" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted">
                      Content Moderation
                    </Link>
                    <Link href="/personalization" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted">
                      Personalization
                    </Link>
                    <Link href="/translation" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted">
                      Translation
                    </Link>
                    <Link href="/multimodal" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted">
                      Multimodal AI
                    </Link>
                  <Link href="/capabilities" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted">
                      Capabilities
                    </Link>
                    <Link href="/markovian-thinking" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted">
                      Markovian Thinking
                    </Link>
                  </div>
                </div>
              </div>
              <Link href="/api" className="text-sm font-medium hover:text-primary transition-colors">
                API
              </Link>
              <Link href="/docs" className="text-sm font-medium hover:text-primary transition-colors">
                Documentation
              </Link>
              <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </Link>
            </div>
            
            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
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
              <Link
                href={user ? "/dashboard" : "/dashboard"}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                {user ? "Dashboard" : "Dashboard"}
              </Link>
            </div>
            
            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
              <MobileNav user={user} onAuthClick={handleAuthClick} />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                India&apos;s Most Advanced
                <span className="block text-primary mt-2 sm:mt-0">AI Platform</span>
              </h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-6 sm:leading-8 text-muted-foreground max-w-2xl mx-auto">
                IndiGLM offers cutting-edge language models with deep understanding of Indian languages, 
                culture, and context. Built for India, by India, serving the world.
              </p>
              <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
                <Link
                  href={user ? "/dashboard" : "/dashboard"}
                  className="bg-primary text-primary-foreground px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg w-full sm:w-auto text-center"
                >
                  {user ? "Go to Dashboard" : "Explore Dashboard"}
                </Link>
                <Link
                  href="/docs"
                  className="text-base sm:text-base font-semibold leading-7 text-foreground hover:text-primary w-full sm:w-auto text-center"
                >
                  View Documentation <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Powerful Features for Indian AI
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the next generation of AI technology tailored specifically for Indian languages and cultural context.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-background p-6 rounded-lg border shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Multi-Language Support</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Native support for 22+ Indian languages including Hindi, Tamil, Telugu, Bengali, and more.
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg border shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Cultural Context</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Deep understanding of Indian culture, traditions, festivals, and regional nuances.
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg border shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Optimized for speed with low latency responses, perfect for real-time applications.
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg border shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Enterprise Security</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Bank-level encryption and security features to protect your data and conversations.
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg border shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Developer Friendly</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Simple API integration with comprehensive documentation and SDK support.
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg border shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Scalable Infrastructure</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Built to scale from startups to enterprises with reliable performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* API Endpoints Preview */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Powerful API Endpoints
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive set of API endpoints for building AI-powered applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-background p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Chat Completions</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Generate chat completions with context awareness and multi-turn conversation support.
              </p>
              <div className="text-xs font-mono bg-muted px-2 py-1 rounded">POST /v1/chat/completions</div>
            </div>

            <div className="bg-background p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Image Generation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Generate stunning images from text descriptions with various styles and sizes.
              </p>
              <div className="text-xs font-mono bg-muted px-2 py-1 rounded">POST /v1/images/generations</div>
            </div>

            <div className="bg-background p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Web Search</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Access real-time information from the web with intelligent search capabilities.
              </p>
              <div className="text-xs font-mono bg-muted px-2 py-1 rounded">POST /v1/functions/web-search</div>
            </div>

            <div className="bg-background p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Language Translation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Translate between Indian languages with high accuracy and cultural context.
              </p>
              <div className="text-xs font-mono bg-muted px-2 py-1 rounded">POST /v1/translate</div>
            </div>

            <div className="bg-background p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Sentiment Analysis</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Analyze sentiment and emotions in text with Indian cultural context awareness.
              </p>
              <div className="text-xs font-mono bg-muted px-2 py-1 rounded">POST /v1/sentiment</div>
            </div>

            <div className="bg-background p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Content Moderation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Advanced content filtering and moderation tailored for Indian content.
              </p>
              <div className="text-xs font-mono bg-muted px-2 py-1 rounded">POST /v1/moderate</div>
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
                <Image
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
                <li><Link href="/product" className="text-sm text-muted-foreground hover:text-primary">Features</Link></li>
                <li><Link href="/api" className="text-sm text-muted-foreground hover:text-primary">API</Link></li>
                <li><Link href="/docs" className="text-sm text-muted-foreground hover:text-primary">Documentation</Link></li>
                <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About</Link></li>
                <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">Blog</Link></li>
                <li><Link href="/careers" className="text-sm text-muted-foreground hover:text-primary">Careers</Link></li>
                <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
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
  );
}