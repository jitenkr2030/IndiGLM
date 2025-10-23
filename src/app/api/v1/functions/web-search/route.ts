import { NextRequest, NextResponse } from "next/server";
import { create_indiglm } from '@/lib/indiglm-sdk';

interface WebSearchRequest {
  query: string;
  num?: number;
  region?: string;
  indian_focus?: boolean;
  search_type?: 'general' | 'news' | 'government' | 'business' | 'education';
  language?: string;
}

interface SearchFunctionResultItem {
  url: string;
  name: string;
  snippet: string;
  host_name: string;
  rank: number;
  date: string;
  favicon: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: WebSearchRequest = await request.json();
    const {
      query,
      num = 10,
      region = 'in',
      indian_focus = true,
      search_type = 'general',
      language = 'english'
    } = body;

    // Validate input
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    // Enhance query with Indian context if requested
    let enhancedQuery = query;
    if (indian_focus) {
      const indianContext = search_type === 'news' ? ' India latest news' :
                           search_type === 'government' ? ' India government scheme policy' :
                           search_type === 'business' ? ' India business market' :
                           search_type === 'education' ? ' India education system' :
                           ' India';
      enhancedQuery = `${query} ${indianContext}`;
    }

    // Initialize IndiGLM SDK
    const apiKey = process.env.INDIGLM_API_KEY || 'demo-api-key';
    const indiglm = await create_indiglm(apiKey, {
      enable_web_search: true
    });

    // Perform web search
    const response = await indiglm.web_search(enhancedQuery, {
      num,
      region,
      indian_focus,
      search_type,
      language
    });

    // Process and enhance results with Indian context
    const processedResults = (response.results || []).map((result, index) => ({
      ...result,
      indian_relevance: indian_focus ? calculateIndianRelevance(result, search_type) : 0,
      regional_focus: indian_focus ? identifyIndianRegion(result.snippet || '') : null,
      language_detected: language,
      search_type: search_type
    }));

    const apiResponse = {
      query: query,
      enhanced_query: enhancedQuery,
      results: processedResults,
      search_metadata: {
        total_results: processedResults.length,
        search_type: search_type,
        region: region,
        indian_focus: indian_focus,
        language: language,
        search_timestamp: new Date().toISOString()
      },
      indian_context: {
        indian_focus_applied: indian_focus,
        regional_prioritization: indian_focus,
        content_filtering: indian_focus,
        language_preference: language
      }
    };

    return NextResponse.json(apiResponse);

  } catch (error) {
    console.error('IndiGLM Web Search Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate Indian relevance score
function calculateIndianRelevance(result: SearchFunctionResultItem, searchType: string): number {
  let score = 0;
  const text = (result.name + ' ' + result.snippet).toLowerCase();
  
  // Indian domain indicators
  if (result.url.includes('.in')) score += 30;
  if (result.host_name.includes('.in')) score += 20;
  
  // Indian content keywords
  const indianKeywords = [
    'india', 'indian', 'bharat', 'hindi', 'delhi', 'mumbai', 'bangalore',
    'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad', 'jaipur'
  ];
  
  indianKeywords.forEach(keyword => {
    if (text.includes(keyword)) score += 10;
  });
  
  // Search type specific scoring
  if (searchType === 'government' && text.includes('government')) score += 15;
  if (searchType === 'business' && text.includes('business')) score += 15;
  if (searchType === 'education' && text.includes('education')) score += 15;
  if (searchType === 'news' && text.includes('news')) score += 15;
  
  return Math.min(score, 100);
}

// Helper function to identify Indian region from content
function identifyIndianRegion(snippet: string): string | null {
  const text = snippet.toLowerCase();
  
  const regions = {
    'North India': ['delhi', 'punjab', 'haryana', 'himachal', 'uttarakhand', 'jammu', 'kashmir'],
    'South India': ['tamil', 'nadu', 'karnataka', 'kerala', 'andhra', 'telangana', 'chennai', 'bangalore'],
    'East India': ['west bengal', 'odisha', 'bihar', 'jharkhand', 'kolkata'],
    'West India': ['maharashtra', 'gujarat', 'goa', 'rajasthan', 'mumbai', 'pune', 'ahmedabad'],
    'Central India': ['madhya pradesh', 'chhattisgarh'],
    'Northeast India': ['assam', 'meghalaya', 'manipur', 'tripura', 'nagaland', 'mizoram', 'arunachal', 'sikkim']
  };
  
  for (const [region, keywords] of Object.entries(regions)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return region;
    }
  }
  
  return null;
}

export async function GET() {
  return NextResponse.json({
    message: 'IndiGLM Web Search API',
    version: '1.0',
    endpoints: {
      search: 'POST /v1/functions/web-search',
    },
    features: {
      indian_focus: true,
      regional_prioritization: true,
      multiple_search_types: true,
      language_support: true,
    },
    supported_search_types: ['general', 'news', 'government', 'business', 'education'],
    supported_regions: ['in', 'us', 'uk', 'ca', 'au'],
    supported_languages: ['english', 'hindi', 'bengali', 'tamil', 'telugu', 'marathi', 'gujarati', 'urdu']
  });
}