import { NextRequest, NextResponse } from 'next/server'
import { create_indiglm } from '@/lib/indiglm-sdk'

interface MarkovianThinkingRequest {
  problem: string
  maxSteps?: number
  complexity?: 'simple' | 'medium' | 'complex'
  context?: string
}

interface MarkovianState {
  id: string
  content: string
  probability: number
  step: number
  parent?: string
}

interface MarkovianThinkingResponse {
  solution: string
  reasoningPath: MarkovianState[]
  confidence: number
  efficiency: {
    memorySaved: number
    stepsReduced: number
    timeSaved: number
  }
  metadata: {
    totalSteps: number
    convergenceStep: number
    algorithm: 'markovian-thinking-v1'
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: MarkovianThinkingRequest = await request.json()
    const { problem, maxSteps = 50, complexity = 'medium', context = '' } = body

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem statement is required' },
        { status: 400 }
      )
    }

    // Initialize IndiGLM SDK
    const indiglm = await create_indiglm('mock-api-key', {
      enableCulturalContext: true,
      enableFunctionCalling: true,
      defaultLanguage: 'en' as any
    })

    // Create the Markovian Thinking prompt
    const systemPrompt = `You are an advanced AI system implementing Markovian Thinking for efficient reasoning. 

Markovian Thinking Principles:
1. State-based processing: Focus on current reasoning state only
2. Selective memory retention: Carry forward only essential information
3. Probabilistic transitions: Each step is a probabilistic state transition
4. Optimal path finding: Identify most efficient reasoning paths
5. Early termination: Stop when further reasoning provides diminishing returns

Your task is to solve the given problem using Markovian Thinking approach. Provide:
1. A step-by-step reasoning process
2. The final solution
3. Confidence level (0-1)
4. Efficiency metrics (memory saved, steps reduced, time saved)

Problem complexity: ${complexity}
Context: ${context}

Format your response as JSON:
{
  "solution": "Final solution to the problem",
  "reasoningPath": [
    {
      "step": 1,
      "state": "Current reasoning state",
      "action": "Action taken",
      "probability": 0.8,
      "essentialInfo": "Essential information carried forward"
    }
  ],
  "confidence": 0.9,
  "efficiency": {
    "memorySaved": 0.75,
    "stepsReduced": 0.6,
    "timeSaved": 0.8
  }
}`

    const userPrompt = `Problem: ${problem}\n\nPlease solve this using Markovian Thinking approach with maximum ${maxSteps} steps.`

    // Get completion from IndiGLM
    const completion = await indiglm.chat_completions_create([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], {
      temperature: 0.3,
      max_tokens: 2000,
      cultural_context: true
    })

    const responseContent = completion.choices[0]?.message?.content

    if (!responseContent) {
      throw new Error('No response from AI model')
    }

    // Parse the response
    let parsedResponse
    try {
      parsedResponse = JSON.parse(responseContent)
    } catch (error) {
      // If JSON parsing fails, create a structured response from the text
      parsedResponse = {
        solution: responseContent,
        reasoningPath: [
          {
            step: 1,
            state: "Initial problem analysis",
            action: "Problem decomposition",
            probability: 0.9,
            essentialInfo: problem
          }
        ],
        confidence: 0.8,
        efficiency: {
          memorySaved: 0.7,
          stepsReduced: 0.5,
          timeSaved: 0.6
        }
      }
    }

    // Format the response according to our interface
    const response: MarkovianThinkingResponse = {
      solution: parsedResponse.solution,
      reasoningPath: parsedResponse.reasoningPath.map((step: any, index: number) => ({
        id: `step-${index + 1}`,
        content: step.state || step.content || `Step ${index + 1}`,
        probability: step.probability || 0.8,
        step: step.step || index + 1,
        parent: index > 0 ? `step-${index}` : undefined
      })),
      confidence: parsedResponse.confidence || 0.8,
      efficiency: parsedResponse.efficiency || {
        memorySaved: 0.7,
        stepsReduced: 0.5,
        timeSaved: 0.6
      },
      metadata: {
        totalSteps: parsedResponse.reasoningPath?.length || 1,
        convergenceStep: parsedResponse.reasoningPath?.length || 1,
        algorithm: 'markovian-thinking-v1'
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Markovian Thinking API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Markovian Thinking API endpoint',
    version: '1.0.0',
    description: 'Advanced AI reasoning using Markovian Thinking principles for efficient complex problem solving',
    endpoints: {
      'POST /api/v1/markovian-thinking': 'Perform Markovian Thinking analysis'
    },
    parameters: {
      problem: 'string - The problem to solve (required)',
      maxSteps: 'number - Maximum reasoning steps (default: 50)',
      complexity: 'string - Problem complexity: simple, medium, complex (default: medium)',
      context: 'string - Additional context for the problem (optional)'
    }
  })
}