import { NextRequest, NextResponse } from 'next/server';
import { getIndiGLMService } from '@/lib/indiglm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      problem,
      reasoning_type = 'practical',
      domain = 'general',
      complexity = 'standard',
      cultural_context = true,
      constraints = [],
      objectives = []
    } = body;

    // Validate required fields
    if (!problem || !problem.description) {
      return NextResponse.json(
        { error: 'Missing required field: problem.description' },
        { status: 400 }
      );
    }

    // Validate reasoning type
    const validReasoningTypes = ['deductive', 'inductive', 'causal', 'practical', 'strategic'];
    if (!validReasoningTypes.includes(reasoning_type)) {
      return NextResponse.json(
        { error: `Invalid reasoning_type: ${reasoning_type}. Must be one of: ${validReasoningTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate domain
    const validDomains = ['general', 'agriculture', 'healthcare', 'education', 'finance', 'governance', 'business', 'technology'];
    if (!validDomains.includes(domain)) {
      return NextResponse.json(
        { error: `Invalid domain: ${domain}. Must be one of: ${validDomains.join(', ')}` },
        { status: 400 }
      );
    }

    // Initialize IndiGLM service
    const indiglmService = getIndiGLMService({
      apiKey: process.env.INDIGLM_API_KEY,
      enableCulturalContext: cultural_context
    });

    // Process reasoning problem
    const reasoningResult = await indiglmService.solveReasoningProblem({
      problem: problem,
      reasoningType: reasoning_type,
      domain: domain,
      complexity: complexity,
      culturalContext: cultural_context,
      constraints: constraints || [],
      objectives: objectives || [],
      context: problem.context || {}
    });

    return NextResponse.json({
      success: true,
      problem_id: reasoningResult.problemId,
      solution: reasoningResult.solution,
      confidence: reasoningResult.confidence,
      reasoning_steps: reasoningResult.reasoningSteps || [],
      implementation_plan: reasoningResult.implementationPlan || [],
      risks_and_mitigations: reasoningResult.risksAndMitigations || [],
      cultural_adaptations: reasoningResult.culturalAdaptations || [],
      alternative_solutions: reasoningResult.alternativeSolutions || [],
      processing_time: reasoningResult.processingTime,
      metadata: {
        api_version: 'v1',
        service: 'indiglm-reasoning',
        reasoning_type: reasoning_type,
        domain: domain,
        complexity: complexity,
        cultural_context_enabled: cultural_context
      }
    });

  } catch (error) {
    console.error('Reasoning error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error during reasoning',
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

    if (action === 'capabilities') {
      // Return reasoning capabilities
      const capabilities = {
        reasoning_types: [
          {
            type: 'deductive',
            description: 'Logical deduction from general principles to specific conclusions',
            examples: ['Mathematical proofs', 'Logical syllogisms', 'Rule-based reasoning']
          },
          {
            type: 'inductive',
            description: 'Generalization from specific examples to general principles',
            examples: ['Pattern recognition', 'Statistical inference', 'Learning from examples']
          },
          {
            type: 'causal',
            description: 'Understanding cause and effect relationships',
            examples: ['Root cause analysis', 'Predictive modeling', 'Impact assessment']
          },
          {
            type: 'practical',
            description: 'Real-world problem solving with actionable solutions',
            examples: ['Decision making', 'Planning', 'Troubleshooting']
          },
          {
            type: 'strategic',
            description: 'Long-term planning and strategic thinking',
            examples: ['Business strategy', 'Policy planning', 'Resource allocation']
          }
        ],
        domains: [
          {
            domain: 'agriculture',
            description: 'Indian farming practices, monsoon patterns, crop cycles',
            specializations: ['Organic farming', 'Irrigation systems', 'Crop selection']
          },
          {
            domain: 'healthcare',
            description: 'Ayurveda, traditional medicine, public health challenges',
            specializations: ['Rural healthcare', 'Traditional medicine', 'Public health']
          },
          {
            domain: 'education',
            description: 'Indian education system, competitive exams, regional languages',
            specializations: ['Educational access', 'Teacher training', 'Digital learning']
          },
          {
            domain: 'finance',
            description: 'Indian financial systems, digital payments, regional banks',
            specializations: ['Financial inclusion', 'Digital payments', 'Rural banking']
          },
          {
            domain: 'governance',
            description: 'Indian political system, government schemes, public policy',
            specializations: ['Policy implementation', 'Public service delivery', 'Citizen engagement']
          }
        ],
        complexity_levels: [
          { level: 'simple', description: 'Basic reasoning with straightforward problems' },
          { level: 'standard', description: 'Moderate complexity with multiple factors' },
          { level: 'complex', description: 'Advanced reasoning with interdependent variables' },
          { level: 'expert', description: 'Expert-level reasoning with deep domain knowledge' }
        ]
      };

      return NextResponse.json({
        success: true,
        capabilities: capabilities,
        metadata: {
          api_version: 'v1',
          service: 'indiglm-reasoning'
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid action parameter' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Reasoning capabilities error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}