'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Code, Terminal, GitBranch } from 'lucide-react'

export default function CodeToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              Code Tools
            </h1>
            <p className="text-xl text-muted-foreground">
              AI-powered development tools for modern software engineering
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Under Development
              </CardTitle>
              <CardDescription>
                This feature is currently being developed and will be available soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Code className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  We're working on advanced code tools including:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="text-left">
                    <h4 className="font-medium mb-2">Code Generation</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Code completion</li>
                      <li>• Function generation</li>
                      <li>• Class creation</li>
                    </ul>
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium mb-2">Code Analysis</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Bug detection</li>
                      <li>• Performance optimization</li>
                      <li>• Security scanning</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Planned Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Smart Editor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    AI-powered code editor with intelligent suggestions and auto-completion.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Terminal className="w-5 h-5" />
                    Debug Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Intelligent debugging assistance with error analysis and fix suggestions.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GitBranch className="w-5 h-5" />
                    Code Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Automated code review with quality checks and best practices enforcement.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}