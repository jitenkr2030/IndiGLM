'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Loader2, Play, Copy, Download, Settings } from 'lucide-react'

export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [settings, setSettings] = useState({
    model: 'indiglm-1.0',
    temperature: 0.7,
    maxTokens: 1000,
    language: 'en'
  })

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setResponse('')

    try {
      const response = await fetch('/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature: settings.temperature,
          max_tokens: settings.maxTokens
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate response')
      }

      const data = await response.json()
      setResponse(data.choices[0]?.message?.content || 'No response generated')
    } catch (error) {
      setResponse('Error: Failed to generate response')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response)
  }

  const downloadResponse = () => {
    const blob = new Blob([response], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ai-response.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              AI Playground
            </h1>
            <p className="text-xl text-muted-foreground">
              Experiment with IndiGLM's AI capabilities in real-time
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Panel */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Settings
                </CardTitle>
                <CardDescription>
                  Configure your AI model parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Model</label>
                  <Select value={settings.model} onValueChange={(value) => setSettings(prev => ({ ...prev, model: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indiglm-1.0">IndiGLM 1.0</SelectItem>
                      <SelectItem value="indiglm-turbo">IndiGLM Turbo</SelectItem>
                      <SelectItem value="indiglm-pro">IndiGLM Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Temperature: {settings.temperature}</label>
                  <Slider
                    value={[settings.temperature]}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, temperature: value[0] }))}
                    min={0}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Controls randomness: Lower = more focused, Higher = more creative
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Max Tokens: {settings.maxTokens}</label>
                  <Slider
                    value={[settings.maxTokens]}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, maxTokens: value[0] }))}
                    min={50}
                    max={2000}
                    step={50}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum length of the generated response
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Language</label>
                  <Select value={settings.language} onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                      <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                      <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                      <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                      <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Input Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Prompt</CardTitle>
                  <CardDescription>
                    Enter your prompt and see the AI generate a response
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Enter your prompt here..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[150px]"
                  />
                  <Button 
                    onClick={handleGenerate} 
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Generate Response
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Response Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Response</CardTitle>
                      <CardDescription>
                        AI-generated response will appear here
                      </CardDescription>
                    </div>
                    {response && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={copyToClipboard}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={downloadResponse}>
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {response ? (
                    <div className="bg-muted/50 p-4 rounded-md min-h-[200px] whitespace-pre-wrap">
                      {response}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No response yet</p>
                      <p className="text-sm">Enter a prompt and click generate to see the AI response</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Example Prompts */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Example Prompts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setPrompt('Explain the significance of Diwali in Indian culture and its modern celebrations.')}>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2">Culture</Badge>
                  <p className="text-sm">Explain the significance of Diwali in Indian culture...</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setPrompt('Write a short story about a young entrepreneur from Mumbai starting a tech startup.')}>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2">Creative</Badge>
                  <p className="text-sm">Write a short story about a young entrepreneur...</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setPrompt('What are the key economic challenges facing rural India in 2024?')}>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2">Analysis</Badge>
                  <p className="text-sm">What are the key economic challenges facing rural India...</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setPrompt('Translate the following to Hindi: "Hello, how are you today? I hope you are doing well."')}>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2">Translation</Badge>
                  <p className="text-sm">Translate the following to Hindi: "Hello, how are you..."</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setPrompt('Explain the concept of digital India initiative and its impact on rural development.')}>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2">Technology</Badge>
                  <p className="text-sm">Explain the concept of digital India initiative...</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setPrompt('Write a poem about the monsoon season in Kerala.')}>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2">Poetry</Badge>
                  <p className="text-sm">Write a poem about the monsoon season in Kerala...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}