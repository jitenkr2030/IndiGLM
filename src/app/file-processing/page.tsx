'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Upload, 
  FileText, 
  Download, 
  Settings, 
  File, 
  Image, 
  FileVideo, 
  FileAudio,
  Brain,
  Languages,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

interface FileItem {
  id: string
  name: string
  type: string
  size: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  content?: string
  summary?: string
  translation?: string
}

export default function FileProcessingPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [targetLanguage, setTargetLanguage] = useState<string>('hi')
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supportedFileTypes = [
    { type: 'pdf', icon: FileText, name: 'PDF Documents' },
    { type: 'doc', icon: FileText, name: 'Word Documents' },
    { type: 'docx', icon: FileText, name: 'Word Documents' },
    { type: 'txt', icon: FileText, name: 'Text Files' },
    { type: 'jpg', icon: Image, name: 'Images' },
    { type: 'png', icon: Image, name: 'Images' },
    { type: 'mp3', icon: FileAudio, name: 'Audio Files' },
    { type: 'mp4', icon: FileVideo, name: 'Video Files' }
  ]

  const indianLanguages = [
    { code: 'hi', name: 'Hindi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'te', name: 'Telugu' },
    { code: 'mr', name: 'Marathi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'ur', name: 'Urdu' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'or', name: 'Odia' },
    { code: 'as', name: 'Assamese' }
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files
    if (!uploadedFiles) return

    const newFiles: FileItem[] = Array.from(uploadedFiles).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.name.split('.').pop()?.toLowerCase() || 'unknown',
      size: file.size,
      status: 'uploading',
      progress: 0
    }))

    setFiles(prev => [...prev, ...newFiles])
    
    // Simulate upload and processing
    newFiles.forEach(file => {
      simulateFileProcessing(file.id)
    })
  }

  const simulateFileProcessing = (fileId: string) => {
    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setFiles(prev => prev.map(file => {
        if (file.id === fileId && file.status === 'uploading') {
          const newProgress = file.progress + 10
          if (newProgress >= 100) {
            clearInterval(uploadInterval)
            return { ...file, progress: 100, status: 'processing' }
          }
          return { ...file, progress: newProgress }
        }
        return file
      }))
    }, 200)

    // Simulate processing
    setTimeout(() => {
      setFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          return {
            ...file,
            status: 'completed',
            content: 'This is the extracted content from the file. The actual implementation would parse the file and extract text content.',
            summary: 'This document contains important information about the subject matter. Key points include detailed analysis and comprehensive coverage of the topic.',
            translation: 'यह दस्तावेज़ विषय-वस्तु के बारे में महत्वपूर्ण जानकारी रखता है। मुख्य बिंदुओं में विस्तृत विश्लेषण और विषय का व्यापक कवरेज शामिल है।'
          }
        }
        return file
      }))
    }, 3000)
  }

  const processFile = async (fileId: string, action: 'summarize' | 'translate') => {
    setIsProcessing(true)
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, status: 'processing' } : file
    ))

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    setFiles(prev => prev.map(file => {
      if (file.id === fileId) {
        if (action === 'summarize') {
          return {
            ...file,
            status: 'completed',
            summary: 'AI-generated summary: This document provides comprehensive insights into the subject matter with detailed analysis and key takeaways. The content is well-structured and covers all essential aspects of the topic.'
          }
        } else {
          return {
            ...file,
            status: 'completed',
            translation: 'एआई-जनित अनुवाद: यह दस्तावेज़ विषय-वस्तु में व्यापक अंतर्दृष्टि प्रदान करता है जिसमें विस्तृत विश्लेषण और मुख्य निष्कर्ष शामिल हैं। सामग्री अच्छी तरह से संरचित है और विषय के सभी आवश्यक पहलुओं को कवर करती है।'
          }
        }
      }
      return file
    }))

    setIsProcessing(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    const fileType = supportedFileTypes.find(ft => ft.type === type)
    const Icon = fileType?.icon || File
    return <Icon className="w-8 h-8" />
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <File className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              File Processing
            </h1>
            <p className="text-xl text-muted-foreground">
              Advanced document analysis and processing powered by IndiGLM AI
            </p>
          </div>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="upload">Upload Files</TabsTrigger>
              <TabsTrigger value="analysis">Document Analysis</TabsTrigger>
              <TabsTrigger value="translation">Translation</TabsTrigger>
              <TabsTrigger value="conversion">File Conversion</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Documents
                  </CardTitle>
                  <CardDescription>
                    Upload your files for AI-powered processing and analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">Drop files here or click to upload</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports PDF, DOC, DOCX, TXT, JPG, PNG, MP3, MP4
                    </p>
                    <Button>Choose Files</Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.png,.mp3,.mp4"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Files</CardTitle>
                  <CardDescription>
                    View and manage your uploaded documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {files.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No files uploaded yet
                      </p>
                    ) : (
                      files.map(file => (
                        <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getFileIcon(file.type)}
                            <div>
                              <p className="font-medium">{file.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(file.size)} • {file.type.toUpperCase()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(file.status)}
                              <Badge variant={
                                file.status === 'completed' ? 'default' :
                                file.status === 'error' ? 'destructive' : 'secondary'
                              }>
                                {file.status}
                              </Badge>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedFile(file)}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Document Analysis
                  </CardTitle>
                  <CardDescription>
                    AI-powered document summarization and content analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedFile ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getFileIcon(selectedFile.type)}
                          <div>
                            <p className="font-medium">{selectedFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(selectedFile.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => processFile(selectedFile.id, 'summarize')}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Brain className="w-4 h-4 mr-2" />
                          )}
                          Generate Summary
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium mb-3">Original Content</h3>
                          <Textarea
                            value={selectedFile.content || ''}
                            readOnly
                            className="min-h-[200px]"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium mb-3">AI Summary</h3>
                          <Textarea
                            value={selectedFile.summary || ''}
                            readOnly
                            className="min-h-[200px]"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Select a file to analyze
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="translation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="w-5 h-5" />
                    Document Translation
                  </CardTitle>
                  <CardDescription>
                    Translate documents to and from Indian languages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium">Target Language:</label>
                      <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {indianLanguages.map(lang => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedFile ? (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getFileIcon(selectedFile.type)}
                            <div>
                              <p className="font-medium">{selectedFile.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(selectedFile.size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => processFile(selectedFile.id, 'translate')}
                            disabled={isProcessing}
                          >
                            {isProcessing ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                              <Languages className="w-4 h-4 mr-2" />
                            )}
                            Translate
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-medium mb-3">Original Content</h3>
                            <Textarea
                              value={selectedFile.content || ''}
                              readOnly
                              className="min-h-[200px]"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium mb-3">Translated Content</h3>
                            <Textarea
                              value={selectedFile.translation || ''}
                              readOnly
                              className="min-h-[200px]"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        Select a file to translate
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="conversion" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    File Conversion
                  </CardTitle>
                  <CardDescription>
                    Convert files between different formats
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <RefreshCw className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">File Conversion</h3>
                    <p className="text-muted-foreground mb-4">
                      File conversion capabilities will be available soon
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                      <div className="text-left">
                        <h4 className="font-medium mb-2">Supported Conversions</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• PDF ↔ DOC/DOCX</li>
                          <li>• Image formats (JPG, PNG, WebP)</li>
                          <li>• Audio formats (MP3, WAV, FLAC)</li>
                          <li>• Video formats (MP4, AVI, MOV)</li>
                        </ul>
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium mb-2">Features</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Batch processing</li>
                          <li>• Quality optimization</li>
                          <li>• Format preservation</li>
                          <li>• Metadata handling</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}