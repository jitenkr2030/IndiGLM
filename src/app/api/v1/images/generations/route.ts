import { NextRequest, NextResponse } from "next/server";
import { create_indiglm } from '@/lib/indiglm-sdk';

interface ImageGenerationRequest {
  prompt: string;
  n?: number;
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
  indian_theme?: boolean;
  cultural_elements?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: ImageGenerationRequest = await request.json();
    const {
      prompt,
      n = 1,
      size = '1024x1024',
      quality = 'standard',
      style = 'vivid',
      indian_theme = false,
      cultural_elements = []
    } = body;

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    // Enhance prompt with Indian context if requested
    let enhancedPrompt = prompt;
    if (indian_theme) {
      const indianContext = ' Indian culture, traditional Indian aesthetics, vibrant colors, Indian art style';
      enhancedPrompt = `${prompt}${indianContext}`;
      
      if (cultural_elements.length > 0) {
        enhancedPrompt += `, featuring ${cultural_elements.join(', ')}`;
      }
    }

    // Initialize IndiGLM SDK
    const apiKey = process.env.INDIGLM_API_KEY || 'demo-api-key';
    const indiglm = await create_indiglm(apiKey, {
      enable_image_generation: true
    });

    // Generate image
    const response = await indiglm.generate_image(enhancedPrompt, {
      n,
      size,
      quality,
      style,
      indian_theme,
      cultural_elements
    });

    // Process the response
    const images = (response.data || []).map((imageData, index) => ({
      url: imageData.url || (imageData.base64 ? `data:image/png;base64,${imageData.base64}` : null),
      base64: imageData.base64 || null,
      revised_prompt: enhancedPrompt,
      metadata: {
        index,
        size,
        quality,
        style,
        indian_theme,
        cultural_elements: indian_theme ? cultural_elements : [],
        generated_at: new Date().toISOString(),
      }
    }));

    const apiResponse = {
      created: Math.floor(Date.now() / 1000),
      data: images,
      indian_context: {
        theme_applied: indian_theme,
        cultural_elements: indian_theme ? cultural_elements : [],
        style_enhancement: indian_theme ? 'Indian aesthetics' : 'standard',
      },
    };

    return NextResponse.json(apiResponse);

  } catch (error) {
    console.error('IndiGLM Image Generation Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'IndiGLM Image Generation API',
    version: '1.0',
    endpoints: {
      generate: 'POST /v1/images/generations',
    },
    features: {
      indian_themes: true,
      cultural_elements: true,
      multiple_sizes: true,
      quality_options: true,
    },
    supported_sizes: ['256x256', '512x512', '1024x1024', '1792x1024', '1024x1792'],
    supported_qualities: ['standard', 'hd'],
    supported_styles: ['vivid', 'natural'],
    indian_cultural_elements: [
      'Diwali lights', 'Holi colors', 'Indian wedding', 'Temple architecture',
      'Traditional clothing', 'Indian festivals', 'Spices market', 'Yoga and meditation',
      'Bollywood style', 'Classical dance', 'Indian cuisine', 'Historical monuments'
    ]
  });
}