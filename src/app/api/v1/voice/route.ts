import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { audioData, language, mode } = await request.json()

    if (!audioData || !language) {
      return NextResponse.json(
        { error: 'Missing required fields: audioData, language' },
        { status: 400 }
      )
    }

    // Initialize IndiGLM SDK
    const zai = await ZAI.create()

    let result = {}

    if (mode === 'speech-to-text') {
      // For speech-to-text, we would normally process audio data
      // For this example, we'll simulate with a text analysis approach
      const transcriptionPrompt = `The following represents audio data that needs to be transcribed from ${language} language. 
      
Audio Data Representation: "${audioData}"

Please provide:
1. Transcribed text in ${language}
2. Confidence score (0-1)
3. Detected language confirmation
4. Any notable accents or dialects
5. Clean, formatted transcription

Format your response as JSON:
{
  "transcription": "transcribed text",
  "confidence": 0.95,
  "detectedLanguage": "${language}",
  "accents": ["accent1"],
  "cleanText": "cleaned transcription"
}`

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are an advanced speech recognition AI specializing in Indian languages. Provide accurate transcriptions with cultural and linguistic context awareness for ${language}.`
          },
          {
            role: 'user',
            content: transcriptionPrompt
          }
        ],
        temperature: 0.2,
        max_tokens: 800
      })

      const responseText = completion.choices[0]?.message?.content || ''
      
      try {
        result = JSON.parse(responseText)
      } catch (error) {
        result = {
          transcription: responseText,
          confidence: 0.8,
          detectedLanguage: language,
          accents: [],
          cleanText: responseText
        }
      }

    } else if (mode === 'voice-translation') {
      const { targetLanguage } = await request.json()
      
      if (!targetLanguage) {
        return NextResponse.json(
          { error: 'Missing targetLanguage for translation mode' },
          { status: 400 }
        )
      }

      const translationPrompt = `Translate the following voice content from ${language} to ${targetLanguage}. 
      
Voice Content: "${audioData}"

Please provide:
1. Original text in ${language}
2. Translated text in ${targetLanguage}
3. Translation confidence (0-1)
4. Cultural context notes
5. Alternative translations if applicable

Format your response as JSON:
{
  "originalText": "original text",
  "translatedText": "translated text",
  "confidence": 0.92,
  "culturalNotes": ["note1", "note2"],
  "alternatives": ["alt1", "alt2"]
}`

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are a professional translator specializing in Indian languages. Provide accurate, culturally-appropriate translations between ${language} and ${targetLanguage}.`
          },
          {
            role: 'user',
            content: translationPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      })

      const responseText = completion.choices[0]?.message?.content || ''
      
      try {
        result = JSON.parse(responseText)
      } catch (error) {
        result = {
          originalText: audioData,
          translatedText: responseText,
          confidence: 0.8,
          culturalNotes: [],
          alternatives: []
        }
      }
    }

    // Log voice recognition event
    console.log('Voice recognition processed:', {
      mode,
      language,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      result: {
        id: `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        mode,
        sourceLanguage: language,
        ...result,
        timestamp: new Date().toISOString(),
        processedBy: 'IndiGLM-Voice-v1'
      }
    })

  } catch (error) {
    console.error('Voice recognition error:', error)
    return NextResponse.json(
      { error: 'Failed to process voice recognition', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Voice Recognition API - IndiGLM SDK Integration',
    version: '1.0.0',
    endpoints: {
      'POST /': 'Process voice recognition (speech-to-text or translation)',
      'GET /languages': 'Get supported languages'
    },
    supportedLanguages: [
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
    ],
    supportedModes: ['speech-to-text', 'voice-translation']
  })
}