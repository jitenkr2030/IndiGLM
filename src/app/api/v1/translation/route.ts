import { NextRequest, NextResponse } from 'next/server';
import { getIndiGLMService } from '@/lib/indiglm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      text,
      source_language,
      target_language,
      preserve_cultural_context = true,
      processing_mode = 'standard'
    } = body;

    // Validate required fields
    if (!text || !source_language || !target_language) {
      return NextResponse.json(
        { error: 'Missing required fields: text, source_language, target_language' },
        { status: 400 }
      );
    }

    // Supported languages
    const supportedLanguages = [
      'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'ur', 
      'or', 'as', 'ma', 'sa', 'ne', 'sd', 'ks', 'doi', 'kok', 'mni', 'en'
    ];

    if (!supportedLanguages.includes(source_language)) {
      return NextResponse.json(
        { error: `Unsupported source language: ${source_language}` },
        { status: 400 }
      );
    }

    if (!supportedLanguages.includes(target_language)) {
      return NextResponse.json(
        { error: `Unsupported target language: ${target_language}` },
        { status: 400 }
      );
    }

    if (source_language === target_language) {
      return NextResponse.json(
        { error: 'Source and target languages must be different' },
        { status: 400 }
      );
    }

    // Initialize IndiGLM service
    const indiglmService = getIndiGLMService({
      apiKey: process.env.INDIGLM_API_KEY,
      defaultLanguage: source_language,
      enableCulturalContext: preserve_cultural_context
    });

    // Process translation
    const translationResult = await indiglmService.translateText({
      text: text,
      sourceLanguage: source_language,
      targetLanguage: target_language,
      preserveCulturalContext: preserve_cultural_context,
      processingMode: processing_mode
    });

    return NextResponse.json({
      success: true,
      original_text: text,
      source_language: source_language,
      target_language: target_language,
      translated_text: translationResult.translatedText,
      confidence: translationResult.confidence,
      alternatives: translationResult.alternatives || [],
      cultural_context_preserved: preserve_cultural_context,
      processing_time: translationResult.processingTime,
      metadata: {
        api_version: 'v1',
        service: 'indiglm-translation',
        processing_mode: processing_mode
      }
    });

  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error during translation',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'languages') {
      // Return supported languages
      const languages = [
        { code: 'hi', name: 'हिन्दी (Hindi)', script: 'Devanagari' },
        { code: 'bn', name: 'বাংলা (Bengali)', script: 'Bengali' },
        { code: 'ta', name: 'தமிழ் (Tamil)', script: 'Tamil' },
        { code: 'te', name: 'తెలుగు (Telugu)', script: 'Telugu' },
        { code: 'mr', name: 'मराठी (Marathi)', script: 'Devanagari' },
        { code: 'gu', name: 'ગુજરાતી (Gujarati)', script: 'Gujarati' },
        { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', script: 'Kannada' },
        { code: 'ml', name: 'മലയാളം (Malayalam)', script: 'Malayalam' },
        { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)', script: 'Gurmukhi' },
        { code: 'ur', name: 'اردو (Urdu)', script: 'Perso-Arabic' },
        { code: 'or', name: 'ଓଡ଼ିଆ (Odia)', script: 'Odia' },
        { code: 'as', name: 'অসমীয়া (Assamese)', script: 'Assamese' },
        { code: 'ma', name: 'मैथिली (Maithili)', script: 'Devanagari' },
        { code: 'sa', name: 'संस्कृतम् (Sanskrit)', script: 'Devanagari' },
        { code: 'ne', name: 'नेपाली (Nepali)', script: 'Devanagari' },
        { code: 'sd', name: 'सिन्धी (Sindhi)', script: 'Devanagari' },
        { code: 'ks', name: 'कॉशुर (Kashmiri)', script: 'Perso-Arabic' },
        { code: 'doi', name: 'डोगरी (Dogri)', script: 'Devanagari' },
        { code: 'kok', name: 'कोंकणी (Konkani)', script: 'Devanagari' },
        { code: 'mni', name: 'মৈতৈলোন্ (Manipuri)', script: 'Meitei Mayek' },
        { code: 'en', name: 'English', script: 'Latin' }
      ];

      return NextResponse.json({
        success: true,
        languages: languages,
        total_count: languages.length,
        metadata: {
          api_version: 'v1',
          service: 'indiglm-translation'
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid action parameter' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Translation languages error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}