import { NextRequest, NextResponse } from 'next/server';
import { getIndiGLMService } from '@/lib/indiglm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      inputs,
      processing_mode = 'standard',
      cultural_context = true,
      language = 'en'
    } = body;

    // Validate required fields
    if (!inputs || !Array.isArray(inputs) || inputs.length === 0) {
      return NextResponse.json(
        { error: 'Invalid inputs: must provide an array of input objects' },
        { status: 400 }
      );
    }

    // Validate each input
    for (const input of inputs) {
      if (!input.modality || !input.content) {
        return NextResponse.json(
          { error: 'Each input must have modality and content fields' },
          { status: 400 }
        );
      }

      if (!['text', 'voice', 'image', 'video'].includes(input.modality)) {
        return NextResponse.json(
          { error: 'Invalid modality: must be text, voice, image, or video' },
          { status: 400 }
        );
      }
    }

    // Initialize IndiGLM service
    const indiglmService = getIndiGLMService({
      apiKey: process.env.INDIGLM_API_KEY,
      defaultLanguage: language,
      enableCulturalContext: cultural_context
    });

    // Process multimodal inputs
    const results = [];
    for (const input of inputs) {
      try {
        const result = await indiglmService.processMultimodalInput({
          modality: input.modality,
          content: input.content,
          language: input.language || language,
          culturalContext: cultural_context,
          processingOptions: {
            mode: processing_mode,
            analysis_depth: input.analysis_depth || 'standard',
            cultural_sensitivity: cultural_context
          }
        });

        results.push({
          input_id: input.id || `input_${results.length}`,
          modality: input.modality,
          success: true,
          result: result
        });
      } catch (error) {
        results.push({
          input_id: input.id || `input_${results.length}`,
          modality: input.modality,
          success: false,
          error: error.message || 'Processing failed'
        });
      }
    }

    // Calculate overall metrics
    const successfulResults = results.filter(r => r.success);
    const overallSuccess = successfulResults.length === results.length;

    return NextResponse.json({
      success: overallSuccess,
      processing_time: Date.now(),
      inputs_processed: results.length,
      successful_processing: successfulResults.length,
      cultural_context_enabled: cultural_context,
      processing_mode: processing_mode,
      results: results,
      metadata: {
        language: language,
        api_version: 'v1',
        service: 'indiglm-multimodal'
      }
    });

  } catch (error) {
    console.error('Multimodal processing error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error during multimodal processing',
        details: error.message 
      },
      { status: 500 }
    );
  }
}