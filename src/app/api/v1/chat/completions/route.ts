import { NextRequest, NextResponse } from "next/server";
import { create_indiglm } from '@/lib/indiglm-sdk';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  indian_language?: string;
  cultural_context?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatCompletionRequest = await request.json();
    const {
      messages,
      model = 'indiglm-1.0',
      temperature = 0.7,
      max_tokens = 1000,
      stream = false,
      indian_language = 'english',
      cultural_context = true
    } = body;

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required and must be an array' },
        { status: 400 }
      );
    }

    // Add Indian context system message if cultural_context is enabled
    const systemMessage: ChatMessage = {
      role: 'system',
      content: cultural_context 
        ? `You are IndiGLM, an AI assistant specifically designed for Indian users. You have deep understanding of Indian culture, traditions, festivals, and regional nuances. You are communicating in ${indian_language} and should be aware of Indian context, values, and cultural sensitivities. Provide responses that are culturally appropriate and relevant to Indian users.`
        : 'You are a helpful AI assistant.'
    };

    // Prepend system message if not already present
    const processedMessages = messages[0]?.role === 'system' 
      ? [systemMessage, ...messages.slice(1)]
      : [systemMessage, ...messages];

    // Initialize IndiGLM SDK
    const apiKey = process.env.INDIGLM_API_KEY || 'demo-api-key';
    const indiglm = await create_indiglm(apiKey, {
      default_language: indian_language,
      enable_cultural_context: cultural_context
    });

    // Create chat completion
    const completion = await indiglm.chat_completions_create(processedMessages, {
      model,
      temperature,
      max_tokens: max_tokens
    });

    // Extract the response
    const messageContent = completion.choices?.[0]?.message?.content || '';

    // Add Indian-specific metadata
    const response = {
      id: completion.id || `indiglm-${Date.now()}`,
      object: 'chat.completion',
      created: completion.created || Math.floor(Date.now() / 1000),
      model: model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: messageContent,
          },
          finish_reason: completion.choices?.[0]?.finish_reason || 'stop',
        }
      ],
      usage: {
        prompt_tokens: completion.usage?.prompt_tokens || 0,
        completion_tokens: completion.usage?.completion_tokens || 0,
        total_tokens: completion.usage?.total_tokens || 0,
      },
      indian_context: {
        language: indian_language,
        cultural_awareness: cultural_context,
        regional_adaptation: true,
      },
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('IndiGLM Chat Completion Error:', error);
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
    message: 'IndiGLM Chat Completions API',
    version: '1.0',
    endpoints: {
      chat: 'POST /v1/chat/completions',
      models: 'GET /v1/models',
    },
    features: {
      multi_language: true,
      cultural_context: true,
      indian_regional_support: true,
    }
  });
}