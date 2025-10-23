'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mic, Headphones, Volume2 } from 'lucide-react'

export default function VoiceRecognitionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              Voice Recognition
            </h1>
            <p className="text-xl text-muted-foreground">
              Advanced voice recognition and speech processing with Indian language support
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Under Development
              </CardTitle>
              <CardDescription>
                This feature is currently being developed and will be available soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Headphones className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  We're working on advanced voice recognition capabilities including:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="text-left">
                    <h4 className="font-medium mb-2">Speech Recognition</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Multi-language support</li>
                      <li>• Real-time transcription</li>
                      <li>• Accent recognition</li>
                    </ul>
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium mb-2">Voice Commands</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Natural language processing</li>
                      <li>• Command execution</li>
                      <li>• Voice authentication</li>
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
                    <Mic className="w-5 h-5" />
                    Speech-to-Text
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Convert speech to text with high accuracy across multiple Indian languages.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    Text-to-Speech
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Natural-sounding voice synthesis with regional accent support.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Headphones className="w-5 h-5" />
                    Voice Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Analyze voice patterns, emotions, and speaker characteristics.
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