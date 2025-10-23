import { NextRequest, NextResponse } from 'next/server';
import { getIndiGLMService } from '@/lib/indiglm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      input_text,
      context,
      request_type = 'general',
      personalization_level = 'adaptive'
    } = body;

    // Validate required fields
    if (!user_id || !input_text) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, input_text' },
        { status: 400 }
      );
    }

    // Initialize IndiGLM service
    const indiglmService = getIndiGLMService({
      apiKey: process.env.INDIGLM_API_KEY,
      enableCulturalContext: true
    });

    // Get or create user profile
    let userProfile = await indiglmService.getUserProfile(user_id);
    
    if (!userProfile) {
      // Create default profile if none exists
      userProfile = await indiglmService.createUserProfile({
        user_id: user_id,
        language: 'en',
        cultural_background: {
          region: 'general',
          preferences: {}
        },
        personality_traits: {},
        communication_style: 'neutral'
      });
    }

    // Process personalized response
    const personalizationResult = await indiglmService.getPersonalizedResponse({
      userId: user_id,
      inputText: input_text,
      context: context || {},
      requestType: request_type,
      personalizationLevel: personalization_level,
      userProfile: userProfile
    });

    return NextResponse.json({
      success: true,
      user_id: user_id,
      input_text: input_text,
      personalized_response: personalizationResult.personalizedText,
      adaptations: personalizationResult.adaptations || [],
      confidence: personalizationResult.confidence,
      personalization_score: personalizationResult.personalizationScore,
      cultural_adaptations: personalizationResult.culturalAdaptations || [],
      linguistic_adaptations: personalizationResult.linguisticAdaptations || [],
      personality_matching: personalizationResult.personalityMatching || {},
      processing_time: personalizationResult.processingTime,
      metadata: {
        api_version: 'v1',
        service: 'indiglm-personalization',
        request_type: request_type,
        personalization_level: personalization_level
      }
    });

  } catch (error) {
    console.error('Personalization error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error during personalization',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const action = searchParams.get('action');

    if (action === 'profile' && userId) {
      // Get user profile
      const indiglmService = getIndiGLMService({
        apiKey: process.env.INDIGLM_API_KEY,
        enableCulturalContext: true
      });

      const userProfile = await indiglmService.getUserProfile(userId);
      
      if (!userProfile) {
        return NextResponse.json(
          { error: 'User profile not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        user_id: userId,
        profile: userProfile,
        metadata: {
          api_version: 'v1',
          service: 'indiglm-personalization'
        }
      });
    }

    if (action === 'insights' && userId) {
      // Get personalization insights
      const indiglmService = getIndiGLMService({
        apiKey: process.env.INDIGLM_API_KEY,
        enableCulturalContext: true
      });

      const insights = await indiglmService.getPersonalizationInsights(userId);

      return NextResponse.json({
        success: true,
        user_id: userId,
        insights: insights,
        metadata: {
          api_version: 'v1',
          service: 'indiglm-personalization'
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid parameters' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Personalization GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      profile_data,
      interaction_data
    } = body;

    // Validate required fields
    if (!user_id) {
      return NextResponse.json(
        { error: 'Missing required field: user_id' },
        { status: 400 }
      );
    }

    const indiglmService = getIndiGLMService({
      apiKey: process.env.INDIGLM_API_KEY,
      enableCulturalContext: true
    });

    let result;

    if (profile_data) {
      // Update user profile
      result = await indiglmService.updateUserProfile(user_id, profile_data);
    } else if (interaction_data) {
      // Learn from interaction
      result = await indiglmService.learnFromInteraction(user_id, interaction_data);
    } else {
      return NextResponse.json(
        { error: 'Either profile_data or interaction_data must be provided' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user_id: user_id,
      result: result,
      metadata: {
        api_version: 'v1',
        service: 'indiglm-personalization',
        action: profile_data ? 'profile_update' : 'interaction_learning'
      }
    });

  } catch (error) {
    console.error('Personalization PUT error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error during personalization update',
        details: error.message 
      },
      { status: 500 }
    );
  }
}