import Image from "next/image";
import Link from "next/link";

export default function APIPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/">
                <Image
                  src="/indiglm-logo.svg"
                  alt="IndiGLM Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
              <Link href="/" className="text-xl font-bold text-foreground">IndiGLM</Link>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/product" className="text-sm font-medium hover:text-primary transition-colors">Product</Link>
              <Link href="/api" className="text-sm font-medium text-primary">API</Link>
              <Link href="/docs" className="text-sm font-medium hover:text-primary transition-colors">Documentation</Link>
              <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto max-w-4xl">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                API Documentation
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                Comprehensive API documentation for IndiGLM. Build powerful applications with our easy-to-use RESTful API.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/"
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg"
                >
                  Get API Key
                </Link>
                <Link
                  href="/docs"
                  className="text-base font-semibold leading-7 text-foreground hover:text-primary"
                >
                  View Guides <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Authentication
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              All API requests require authentication using an API key in the Authorization header.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-background border rounded-lg overflow-hidden">
              <div className="bg-muted px-6 py-3 border-b">
                <h3 className="font-semibold">Authorization Header</h3>
              </div>
              <div className="p-6">
                <div className="bg-muted p-4 rounded font-mono text-sm mb-4">
                  Authorization: Bearer YOUR_API_KEY
                </div>
                <p className="text-muted-foreground mb-4">
                  Replace <code className="bg-muted px-1 rounded">YOUR_API_KEY</code> with your actual API key from the dashboard.
                </p>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                  <h4 className="font-semibold text-blue-800 mb-2">Security Note</h4>
                  <p className="text-blue-700 text-sm">
                    Keep your API keys secure and never expose them in client-side code or public repositories.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              API Endpoints
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive set of API endpoints for building AI-powered applications.
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            {/* Chat Completions */}
            <div className="bg-background border rounded-lg overflow-hidden">
              <div className="bg-muted px-6 py-3 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Chat Completions</h3>
                  <p className="text-sm text-muted-foreground">POST /v1/chat/completions</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Production</span>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground mb-4">
                  Generate chat completions with context awareness and multi-turn conversation support.
                </p>
                
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Example Request</h4>
                  <div className="bg-muted p-4 rounded text-sm">
                    POST /v1/chat/completions with JSON payload containing messages array
                  </div>
                </div>
              </div>
            </div>

            {/* Image Generation */}
            <div className="bg-background border rounded-lg overflow-hidden">
              <div className="bg-muted px-6 py-3 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Image Generation</h3>
                  <p className="text-sm text-muted-foreground">POST /v1/images/generations</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Production</span>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground mb-4">
                  Generate images from text descriptions with various styles and sizes.
                </p>
              </div>
            </div>

            {/* Translation */}
            <div className="bg-background border rounded-lg overflow-hidden">
              <div className="bg-muted px-6 py-3 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Translation</h3>
                  <p className="text-sm text-muted-foreground">POST /v1/translate</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Production</span>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground mb-4">
                  Translate text between Indian languages with cultural context preservation.
                </p>
              </div>
            </div>

            {/* Web Search */}
            <div className="bg-background border rounded-lg overflow-hidden">
              <div className="bg-muted px-6 py-3 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Web Search</h3>
                  <p className="text-sm text-muted-foreground">POST /v1/functions/web-search</p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Beta</span>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground mb-4">
                  Access real-time information from the web with intelligent search capabilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rate Limits */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Rate Limits
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Fair usage limits to ensure optimal performance for all users.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-background border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Requests/Minute</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Requests/Month</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Features</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">Free</td>
                      <td className="px-6 py-4 whitespace-nowrap">60</td>
                      <td className="px-6 py-4 whitespace-nowrap">10,000</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">Basic features</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">Pro</td>
                      <td className="px-6 py-4 whitespace-nowrap">300</td>
                      <td className="px-6 py-4 whitespace-nowrap">100,000</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">All features, priority support</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">Enterprise</td>
                      <td className="px-6 py-4 whitespace-nowrap">Custom</td>
                      <td className="px-6 py-4 whitespace-nowrap">Unlimited</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">Custom features, SLA</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
    </div>
  );
}