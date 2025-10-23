'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Upload, Image as ImageIcon, FileText, Download, Eye } from 'lucide-react'

interface ProcessingResult {
  text_content?: string
  image_analysis?: string
  extracted_data?: any
  summary?: string
}

export default function MultimodalPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [prompt, setPrompt] = useState('')
  const [results, setResults] = useState<ProcessingResult>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingType, setProcessingType] = useState('analyze')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setResults({})
    }
  }

  const handleProcess = async () => {
    if (!selectedFile || !prompt.trim()) return

    setIsProcessing(true)
    setResults({})

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('prompt', prompt)
      formData.append('processing_type', processingType)

      const response = await fetch('/api/v1/multimodal/process', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Processing failed')
      }

      const data = await response.json()
      setResults(data.results || {})
    } catch (error) {
      setResults({ summary: 'Error: Processing failed' })
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadResults = () => {
    const dataStr = JSON.stringify(results, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'multimodal-results.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const getFileTypeIcon = () => {
    if (!selectedFile) return <Upload className="w-8 h-8" />
    
    if (selectedFile.type.startsWith('image/')) {
      return <ImageIcon className="w-8 h-8" />
    } else if (selectedFile.type.includes('text') || selectedFile.name.endsWith('.pdf')) {
      return <FileText className="w-8 h-8" />
    }
    return <Upload className="w-8 h-8" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              Multimodal AI
            </h1>
            <p className="text-xl text-muted-foreground">
              Process images, documents, and mixed content with advanced AI analysis
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Upload & Configure</CardTitle>
                <CardDescription>
                  Upload your file and specify what you want the AI to do
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Select File</label>
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                      accept="image/*,.pdf,.txt,.doc,.docx"
                    />
                    <div className="flex flex-col items-center gap-2">
                      {getFileTypeIcon()}
                      <div>
                        {selectedFile ? (
                          <div className="text-center">
                            <p className="font-medium">{selectedFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="font-medium">Click to upload</p>
                            <p className="text-sm text-muted-foreground">
                              Images, PDFs, or text files
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Processing Type */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Processing Type</label>
                  <Select value={processingType} onValueChange={setProcessingType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analyze">General Analysis</SelectItem>
                      <SelectItem value="extract">Extract Text/Data</SelectItem>
                      <SelectItem value="summarize">Summarize Content</SelectItem>
                      <SelectItem value="translate">Translate Content</SelectItem>
                      <SelectItem value="classify">Classify Content</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Prompt */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Prompt</label>
                  <Textarea
                    placeholder="What would you like the AI to do with this file?"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                {/* Process Button */}
                <Button 
                  onClick={handleProcess} 
                  disabled={isProcessing || !selectedFile || !prompt.trim()}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Process File'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Results</CardTitle>
                    <CardDescription>
                      AI analysis results will appear here
                    </CardDescription>
                  </div>
                  {Object.keys(results).length > 0 && (
                    <Button size="sm" variant="outline" onClick={downloadResults}>
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {Object.keys(results).length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No results yet</p>
                    <p className="text-sm">Upload a file and click process to see AI analysis</p>
                  </div>
                ) : (
                  <Tabs defaultValue="summary" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                      <TabsTrigger value="extracted">Extracted</TabsTrigger>
                      <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="summary">
                      <div className="bg-muted/50 p-4 rounded-md min-h-[200px]">
                        {results.summary || 'No summary available'}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="extracted">
                      <div className="bg-muted/50 p-4 rounded-md min-h-[200px] max-h-96 overflow-y-auto">
                        {results.text_content || results.extracted_data ? (
                          <pre className="whitespace-pre-wrap text-sm">
                            {JSON.stringify(results.text_content || results.extracted_data, null, 2)}
                          </pre>
                        ) : (
                          <p className="text-muted-foreground">No extracted data available</p>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="analysis">
                      <div className="bg-muted/50 p-4 rounded-md min-h-[200px]">
                        {results.image_analysis || 'No analysis available'}
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Supported Formats */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Supported Formats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">
                    Process and analyze images with AI vision capabilities
                  </p>
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-xs">JPG</Badge>
                    <Badge variant="outline" className="text-xs">PNG</Badge>
                    <Badge variant="outline" className="text-xs">GIF</Badge>
                    <Badge variant="outline" className="text-xs">WEBP</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">
                    Extract and analyze text from various document formats
                  </p>
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-xs">PDF</Badge>
                    <Badge variant="outline" className="text-xs">TXT</Badge>
                    <Badge variant="outline" className="text-xs">DOC</Badge>
                    <Badge variant="outline" className="text-xs">DOCX</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Processing Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">
                    Various AI processing capabilities for different needs
                  </p>
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-xs">Analysis</Badge>
                    <Badge variant="outline" className="text-xs">Extraction</Badge>
                    <Badge variant="outline" className="text-xs">Summarization</Badge>
                    <Badge variant="outline" className="text-xs">Translation</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}