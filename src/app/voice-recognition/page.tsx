'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  Mic, 
  Headphones, 
  Volume2, 
  Play, 
  Pause, 
  Square, 
  Upload,
  Download,
  RotateCcw,
  Languages,
  Settings,
  Waveform,
  MessageSquare,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  VolumeX,
  Volume1,
  Volume2 as Volume2Icon
} from 'lucide-react'

interface VoiceCommand {
  id: string
  command: string
  action: string
  language: string
  confidence: number
  timestamp: string
}

interface TranscriptionResult {
  id: string
  text: string
  language: string
  confidence: number
  duration: number
  timestamp: string
}

interface TranslationResult {
  id: string
  originalText: string
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  confidence: number
}

export default function VoiceRecognitionPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('hi')
  const [targetLanguage, setTargetLanguage] = useState('en')
  const [transcript, setTranscript] = useState('')
  const [translation, setTranslation] = useState('')
  const [audioLevel, setAudioLevel] = useState(0)
  const [recordingTime, setRecordingTime] = useState(0)
  const [voiceCommands, setVoiceCommands] = useState<VoiceCommand[]>([])
  const [transcriptions, setTranscriptions] = useState<TranscriptionResult[]>([])
  const [translations, setTranslations] = useState<TranslationResult[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileTranscription, setFileTranscription] = useState('')
  const [isTranscribingFile, setIsTranscribingFile] = useState(false)

  const recordingInterval = useRef<NodeJS.Timeout | null>(null)
  const audioLevelInterval = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const indianLanguages = [
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
    { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
    { code: 'en', name: 'English', nativeName: 'English' }
  ]

  const voiceCommandExamples = [
    { command: 'फाइल अपलोड करो', action: 'Upload File', language: 'hi' },
    { command: 'कोड जनरेट करो', action: 'Generate Code', language: 'hi' },
    { command: 'डॉक्यूमेंट सारांश दो', action: 'Summarize Document', language: 'hi' },
    { command: 'ফাইল আপলোড করুন', action: 'Upload File', language: 'bn' },
    { command: 'కోడ్ జనరేట్ చేయండి', action: 'Generate Code', language: 'te' },
    { command: 'ದಸ್ತಾವೇಜನ್ ಸಾರಾಂಶವನ್ನು ನೀಡಿ', action: 'Summarize Document', language: 'kn' }
  ]

  useEffect(() => {
    if (isRecording) {
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

      audioLevelInterval.current = setInterval(() => {
        setAudioLevel(Math.random() * 100)
      }, 100)
    } else {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current)
      }
      if (audioLevelInterval.current) {
        clearInterval(audioLevelInterval.current)
      }
      setRecordingTime(0)
      setAudioLevel(0)
    }

    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current)
      }
      if (audioLevelInterval.current) {
        clearInterval(audioLevelInterval.current)
      }
    }
  }, [isRecording])

  const startRecording = () => {
    setIsRecording(true)
    setTranscript('')
    setTranslation('')
  }

  const stopRecording = () => {
    setIsRecording(false)
    setIsProcessing(true)

    // Simulate voice processing
    setTimeout(() => {
      const mockTranscript = 'यह एक नमूना आवाज़ प्रतिलिपि है जो हिंदी में बोली गई है। यह दिखाता है कि आवाज़ पहचान प्रणाली कैसे काम करती है।'
      setTranscript(mockTranscript)

      const newTranscription: TranscriptionResult = {
        id: Math.random().toString(36).substr(2, 9),
        text: mockTranscript,
        language: selectedLanguage,
        confidence: 0.95,
        duration: recordingTime,
        timestamp: new Date().toISOString()
      }
      setTranscriptions(prev => [newTranscription, ...prev])

      setIsProcessing(false)
    }, 2000)
  }

  const translateText = async () => {
    if (!transcript.trim()) return

    setIsProcessing(true)

    // Simulate translation
    setTimeout(() => {
      const mockTranslation = 'This is a sample voice transcript spoken in Hindi. This shows how the voice recognition system works.'
      setTranslation(mockTranslation)

      const newTranslation: TranslationResult = {
        id: Math.random().toString(36).substr(2, 9),
        originalText: transcript,
        translatedText: mockTranslation,
        sourceLanguage: selectedLanguage,
        targetLanguage: targetLanguage,
        confidence: 0.92
      }
      setTranslations(prev => [newTranslation, ...prev])

      setIsProcessing(false)
    }, 1500)
  }

  const executeVoiceCommand = (command: string) => {
    const newCommand: VoiceCommand = {
      id: Math.random().toString(36).substr(2, 9),
      command,
      action: 'Command Executed',
      language: selectedLanguage,
      confidence: 0.98,
      timestamp: new Date().toISOString()
    }
    setVoiceCommands(prev => [newCommand, ...prev])
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      transcribeAudioFile(file)
    }
  }

  const transcribeAudioFile = async (file: File) => {
    setIsTranscribingFile(true)

    // Simulate file transcription
    setTimeout(() => {
      const mockTranscription = 'यह ऑडियो फाइल से निकाला गया टेक्स्ट है। फाइल में विभिन्न विषयों पर चर्चा की गई है जिसमें तकनीकी विकास, शिक्षा और सामाजिक मुद्दे शामिल हैं।'
      setFileTranscription(mockTranscription)

      const newTranscription: TranscriptionResult = {
        id: Math.random().toString(36).substr(2, 9),
        text: mockTranscription,
        language: selectedLanguage,
        confidence: 0.89,
        duration: 180, // 3 minutes
        timestamp: new Date().toISOString()
      }
      setTranscriptions(prev => [newTranscription, ...prev])

      setIsTranscribingFile(false)
    }, 3000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getVolumeIcon = (level: number) => {
    if (level === 0) return <VolumeX className="w-4 h-4" />
    if (level < 50) return <Volume1 className="w-4 h-4" />
    return <Volume2Icon className="w-4 h-4" />
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-500'
    if (confidence >= 0.7) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              Voice Recognition
            </h1>
            <p className="text-xl text-muted-foreground">
              Advanced voice recognition and speech processing with Indian language support
            </p>
          </div>

          <Tabs defaultValue="speech-to-text" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="speech-to-text">Speech-to-Text</TabsTrigger>
              <TabsTrigger value="voice-commands">Voice Commands</TabsTrigger>
              <TabsTrigger value="audio-transcription">Audio Transcription</TabsTrigger>
              <TabsTrigger value="voice-translation">Voice Translation</TabsTrigger>
            </TabsList>

            <TabsContent value="speech-to-text" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="w-5 h-5" />
                    Live Speech Recognition
                  </CardTitle>
                  <CardDescription>
                    Convert your speech to text in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="language">Recognition Language</Label>
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="w-48 mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {indianLanguages.map(lang => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name} ({lang.nativeName})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-mono">{formatTime(recordingTime)}</div>
                      <div className="text-sm text-muted-foreground">Recording Time</div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button
                      size="lg"
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isProcessing}
                      className={`w-32 h-32 rounded-full ${
                        isRecording ? 'bg-red-500 hover:bg-red-600' : ''
                      }`}
                    >
                      {isRecording ? (
                        <Square className="w-12 h-12" />
                      ) : isProcessing ? (
                        <Loader2 className="w-12 h-12 animate-spin" />
                      ) : (
                        <Mic className="w-12 h-12" />
                      )}
                    </Button>
                    <p className="mt-4 text-sm text-muted-foreground">
                      {isRecording ? 'Click to stop recording' : 'Click to start recording'}
                    </p>
                  </div>

                  {isRecording && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        {getVolumeIcon(audioLevel)}
                        <div className="flex-1 bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-100"
                            style={{ width: `${audioLevel}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12">
                          {Math.round(audioLevel)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Waveform className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Listening...</span>
                      </div>
                    </div>
                  )}

                  {transcript && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Transcription Result</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {indianLanguages.find(l => l.code === selectedLanguage)?.name}
                          </Badge>
                          <Badge className={getConfidenceColor(0.95)}>
                            95% confidence
                          </Badge>
                        </div>
                      </div>
                      <Textarea
                        value={transcript}
                        readOnly
                        className="min-h-[120px]"
                      />
                      <div className="flex gap-2">
                        <Button onClick={translateText} disabled={isProcessing || !transcript}>
                          {isProcessing ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Languages className="w-4 h-4 mr-2" />
                          )}
                          Translate
                        </Button>
                        <Button variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  )}

                  {translation && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Translation</h3>
                        <Badge variant="outline">
                          {indianLanguages.find(l => l.code === targetLanguage)?.name}
                        </Badge>
                      </div>
                      <Textarea
                        value={translation}
                        readOnly
                        className="min-h-[120px]"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="voice-commands" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Voice Command Interface
                  </CardTitle>
                  <CardDescription>
                    Control the application using voice commands
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-4">Available Commands</h3>
                      <div className="space-y-3">
                        {voiceCommandExamples.map((example, index) => (
                          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline">
                                  {indianLanguages.find(l => l.code === example.language)?.name}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => executeVoiceCommand(example.command)}
                                >
                                  <Play className="w-3 h-3" />
                                </Button>
                              </div>
                              <p className="font-medium mb-1">{example.command}</p>
                              <p className="text-sm text-muted-foreground">{example.action}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-4">Command History</h3>
                      <div className="space-y-3">
                        {voiceCommands.length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">
                            No voice commands executed yet
                          </p>
                        ) : (
                          voiceCommands.map((command) => (
                            <div key={command.id} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline">
                                  {indianLanguages.find(l => l.code === command.language)?.name}
                                </Badge>
                                <Badge className={getConfidenceColor(command.confidence)}>
                                  {Math.round(command.confidence * 100)}%
                                </Badge>
                              </div>
                              <p className="font-medium mb-1">{command.command}</p>
                              <p className="text-sm text-muted-foreground">{command.action}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(command.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button
                      size="lg"
                      onClick={startRecording}
                      disabled={isRecording || isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Mic className="w-4 h-4 mr-2" />
                      )}
                      Give Voice Command
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audio-transcription" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Audio File Transcription
                  </CardTitle>
                  <CardDescription>
                    Upload audio files for transcription and analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">Upload Audio File</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports MP3, WAV, M4A, OGG formats
                    </p>
                    <Button onClick={() => fileInputRef.current?.click()}>
                      Choose File
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".mp3,.wav,.m4a,.ogg"
                      onChange={handleFileUpload}
                    />
                  </div>

                  {selectedFile && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8" />
                          <div>
                            <p className="font-medium">{selectedFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isTranscribingFile ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          <Badge variant={isTranscribingFile ? 'secondary' : 'default'}>
                            {isTranscribingFile ? 'Processing' : 'Completed'}
                          </Badge>
                        </div>
                      </div>

                      {fileTranscription && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">Transcription Result</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {indianLanguages.find(l => l.code === selectedLanguage)?.name}
                              </Badge>
                              <Badge className={getConfidenceColor(0.89)}>
                                89% confidence
                              </Badge>
                            </div>
                          </div>
                          <Textarea
                            value={fileTranscription}
                            readOnly
                            className="min-h-[150px]"
                          />
                          <div className="flex gap-2">
                            <Button variant="outline">
                              <Download className="w-4 h-4 mr-2" />
                              Download Text
                            </Button>
                            <Button variant="outline">
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Reprocess
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium mb-4">Recent Transcriptions</h3>
                    <div className="space-y-3">
                      {transcriptions.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          No transcriptions available
                        </p>
                      ) : (
                        transcriptions.slice(0, 5).map((transcription) => (
                          <div key={transcription.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline">
                                {indianLanguages.find(l => l.code === transcription.language)?.name}
                              </Badge>
                              <div className="flex items-center gap-2">
                                <Badge className={getConfidenceColor(transcription.confidence)}>
                                  {Math.round(transcription.confidence * 100)}%
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {formatTime(transcription.duration)}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm line-clamp-2">{transcription.text}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(transcription.timestamp).toLocaleString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="voice-translation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="w-5 h-5" />
                    Real-time Voice Translation
                  </CardTitle>
                  <CardDescription>
                    Translate speech between Indian languages in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="source-language">Source Language</Label>
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {indianLanguages.map(lang => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name} ({lang.nativeName})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="target-language">Target Language</Label>
                      <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {indianLanguages.map(lang => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name} ({lang.nativeName})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button
                      size="lg"
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isProcessing}
                      className={`w-32 h-32 rounded-full ${
                        isRecording ? 'bg-red-500 hover:bg-red-600' : ''
                      }`}
                    >
                      {isRecording ? (
                        <Square className="w-12 h-12" />
                      ) : isProcessing ? (
                        <Loader2 className="w-12 h-12 animate-spin" />
                      ) : (
                        <Mic className="w-12 h-12" />
                      )}
                    </Button>
                    <p className="mt-4 text-sm text-muted-foreground">
                      {isRecording ? 'Recording... Click to stop' : 'Click to start translation'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-3">
                        Original Speech ({indianLanguages.find(l => l.code === selectedLanguage)?.name})
                      </h3>
                      <Textarea
                        value={transcript}
                        readOnly
                        placeholder="Original speech will appear here..."
                        className="min-h-[150px]"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium mb-3">
                        Translation ({indianLanguages.find(l => l.code === targetLanguage)?.name})
                      </h3>
                      <Textarea
                        value={translation}
                        readOnly
                        placeholder="Translation will appear here..."
                        className="min-h-[150px]"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Translation History</h3>
                    <div className="space-y-3">
                      {translations.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          No translations available
                        </p>
                      ) : (
                        translations.slice(0, 5).map((translation) => (
                          <div key={translation.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  {indianLanguages.find(l => l.code === translation.sourceLanguage)?.name}
                                </Badge>
                                <span>→</span>
                                <Badge variant="outline">
                                  {indianLanguages.find(l => l.code === translation.targetLanguage)?.name}
                                </Badge>
                              </div>
                              <Badge className={getConfidenceColor(translation.confidence)}>
                                {Math.round(translation.confidence * 100)}%
                              </Badge>
                            </div>
                            <p className="text-sm font-medium mb-1">{translation.originalText}</p>
                            <p className="text-sm text-muted-foreground">{translation.translatedText}</p>
                          </div>
                        ))
                      )}
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