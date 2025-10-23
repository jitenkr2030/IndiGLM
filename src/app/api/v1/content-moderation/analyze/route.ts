import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { content, type, language } = await request.json()

    if (!content || !type || !language) {
      return NextResponse.json(
        { error: 'Missing required fields: content, type, language' },
        { status: 400 }
      )
    }

    // Initialize IndiGLM SDK
    const zai = await ZAI.create()

    let analysisPrompt = ''
    
    if (type === 'text') {
      analysisPrompt = `Analyze the following text content for moderation purposes. The content is in ${language} language.

Content: "${content}"

Please provide a comprehensive analysis including:
1. Overall safety assessment (safe, flagged, or unsafe)
2. Risk level (low, medium, high, critical)
3. Specific categories of concern (hate speech, harassment, spam, etc.)
4. Cultural context considerations for ${language} language
5. Confidence score (0-1)
6. Recommendations for moderation action

Format your response as JSON with the following structure:
{
  "status": "safe|flagged|unsafe",
  "riskLevel": "low|medium|high|critical",
  "confidence": 0.95,
  "categories": ["category1", "category2"],
  "culturalContext": ["context1", "context2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "explanation": "Detailed explanation of the analysis"
}`
    }

    // Get moderation analysis from IndiGLM
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an AI content moderation specialist with expertise in Indian languages and cultural contexts. Provide accurate, culturally-sensitive content analysis.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })

    const analysisText = completion.choices[0]?.message?.content || ''
    
    // Parse the JSON response (in production, add proper error handling)
    let analysisResult
    try {
      analysisResult = JSON.parse(analysisText)
    } catch (error) {
      // Fallback if JSON parsing fails
      analysisResult = {
        status: 'flagged',
        riskLevel: 'medium',
        confidence: 0.8,
        categories: ['needs_review'],
        culturalContext: ['language_specific'],
        recommendations: ['human_review_required'],
        explanation: analysisText
      }
    }

    // Log the moderation event for analytics
    console.log('Content moderation analysis:', {
      type,
      language,
      status: analysisResult.status,
      riskLevel: analysisResult.riskLevel,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      result: {
        id: `mod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        content: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        ...analysisResult,
        timestamp: new Date().toISOString(),
        processedBy: 'IndiGLM-Moderation-v1'
      }
    })

  } catch (error) {
    console.error('Content moderation analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze content', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Content Moderation API - IndiGLM SDK Integration',
    version: '1.0.0',
    endpoints: {
      'POST /analyze': 'Analyze content for moderation',
      'GET /stats': 'Get moderation statistics (coming soon)'
    },
    supportedLanguages: [
      'hi', 'bn', 'te', 'mr', 'ta', 'ur', 'gu', 'kn', 'ml', 'pa', 'or', 'as', 'en'
    ],
    supportedTypes: ['text', 'image', 'video']
  })
}