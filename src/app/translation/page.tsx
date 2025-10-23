'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Languages, Copy, Download, RotateCcw } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
]

export default function TranslationPage() {
  const [sourceText, setSourceText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [sourceLang, setSourceLang] = useState('en')
  const [targetLang, setTargetLang] = useState('hi')
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationHistory, setTranslationHistory] = useState<Array<{
    source: string
    target: string
    sourceLang: string
    targetLang: string
    timestamp: Date
  }>>([])

  const handleTranslate = async () => {
    if (!sourceText.trim()) return

    setIsTranslating(true)

    try {
      const response = await fetch('/api/v1/translation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sourceText,
          source_language: sourceLang,
          target_language: targetLang
        }),
      })

      if (!response.ok) {
        throw new Error('Translation failed')
      }

      const data = await response.json()
      setTranslatedText(data.translated_text || 'Translation failed')

      // Add to history
      setTranslationHistory(prev => [{
        source: sourceText,
        target: data.translated_text || '',
        sourceLang,
        targetLang,
        timestamp: new Date()
      }, ...prev])
    } catch (error) {
      setTranslatedText('Error: Translation failed')
    } finally {
      setIsTranslating(false)
    }
  }

  const swapLanguages = () => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const clearAll = () => {
    setSourceText('')
    setTranslatedText('')
  }

  const getLanguageName = (code: string) => {
    const lang = languages.find(l => l.code === code)
    return lang ? `${lang.name} (${lang.native})` : code
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              AI Translation
            </h1>
            <p className="text-xl text-muted-foreground">
              Translate between 22+ Indian languages with AI-powered accuracy
            </p>
          </div>

          <Tabs defaultValue="translator" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="translator">Translator</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="translator" className="space-y-6">
              {/* Language Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="w-5 h-5" />
                    Language Selection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">From</label>
                      <Select value={sourceLang} onValueChange={setSourceLang}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map(lang => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name} ({lang.native})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button variant="outline" size="icon" onClick={swapLanguages}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">To</label>
                      <Select value={targetLang} onValueChange={setTargetLang}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map(lang => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name} ({lang.native})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Translation Interface */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Source Text */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Source Text</CardTitle>
                      <Badge variant="secondary">
                        {getLanguageName(sourceLang)}
                      </Badge>
                    </div>
                    <CardDescription>
                      Enter the text you want to translate
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Enter text to translate..."
                      value={sourceText}
                      onChange={(e) => setSourceText(e.target.value)}
                      className="min-h-[200px]"
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleTranslate} 
                        disabled={isTranslating || !sourceText.trim()}
                        className="flex-1"
                      >
                        {isTranslating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Translating...
                          </>
                        ) : (
                          'Translate'
                        )}
                      </Button>
                      <Button variant="outline" onClick={clearAll}>
                        Clear
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Translated Text */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Translated Text</CardTitle>
                      <Badge variant="secondary">
                        {getLanguageName(targetLang)}
                      </Badge>
                    </div>
                    <CardDescription>
                      AI-powered translation will appear here
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-md min-h-[200px]">
                      {translatedText ? (
                        <div className="whitespace-pre-wrap">{translatedText}</div>
                      ) : (
                        <div className="text-center text-muted-foreground py-8">
                          <Languages className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Translation will appear here</p>
                        </div>
                      )}
                    </div>
                    {translatedText && (
                      <Button variant="outline" onClick={() => copyToClipboard(translatedText)} className="w-full">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Translation
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Translation History</CardTitle>
                  <CardDescription>
                    Your recent translations are saved here for easy reference
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {translationHistory.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Languages className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No translation history yet</p>
                      <p className="text-sm">Your translations will appear here after you use the translator</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {translationHistory.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{getLanguageName(item.sourceLang)} → {getLanguageName(item.targetLang)}</span>
                            <span>{item.timestamp.toLocaleString()}</span>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <Badge variant="outline" className="mb-1">Source</Badge>
                              <p className="text-sm bg-muted/50 p-2 rounded">{item.source}</p>
                            </div>
                            <div>
                              <Badge variant="outline" className="mb-1">Translation</Badge>
                              <p className="text-sm bg-muted/50 p-2 rounded">{item.target}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Features Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">22+ Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Support for all major Indian languages including regional dialects and variations.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cultural Context</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Translations that understand cultural nuances, idioms, and context-specific meanings.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Real-time Translation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Fast, accurate translations powered by advanced AI models optimized for Indian languages.
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