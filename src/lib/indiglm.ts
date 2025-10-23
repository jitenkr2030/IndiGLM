/**
 * IndiGLM Integration for Next.js
 * This module provides integration with the IndiGLM SDK for the Next.js application
 */

import { IndiGLM, IndiGLMConfig, create_indiglm, IndianLanguage, CulturalContext } from './indiglm-sdk';

export interface IndiGLMConfig {
  apiKey: string;
  baseUrl?: string;
  defaultLanguage?: IndianLanguage;
  enableCulturalContext?: boolean;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface IndiGLMChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  language?: IndianLanguage;
  culturalContext?: boolean;
  culturalConfig?: CulturalContext;
}

export interface IndiGLMImageOptions {
  n?: number;
  size?: string;
  quality?: string;
  style?: string;
  indianTheme?: boolean;
  culturalElements?: string[];
}

export interface IndiGLMSearchOptions {
  num?: number;
  region?: string;
  indianFocus?: boolean;
  searchType?: 'general' | 'news' | 'government' | 'business' | 'education';
}

class IndiGLMService {
  private client: IndiGLM;
  private config: IndiGLMConfig;

  constructor(config: IndiGLMConfig) {
    this.config = {
      baseUrl: 'https://api.indiglm.ai/v1',
      defaultLanguage: IndianLanguage.HINDI,
      enableCulturalContext: true,
      enableFunctionCalling: true,
      enableImageGeneration: true,
      enableWebSearch: true,
      timeout: 30,
      maxRetries: 3,
      ...config
    };

    // Create the SDK client
    this.client = new IndiGLM(this.config);
  }

  /**
   * Send a chat completion request to IndiGLM
   */
  async chatCompletion(
    messages: ChatMessage[],
    options: IndiGLMChatOptions = {}
  ) {
    try {
      // Convert messages to the format expected by the SDK
      const sdkMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await this.client.chat_completions_create(sdkMessages, {
        model: options.model || 'indiglm-1.0',
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000,
        language: options.language || this.config.defaultLanguage,
        cultural_context: options.culturalContext ?? this.config.enableCulturalContext,
        cultural_config: options.culturalConfig
      });

      return {
        success: true,
        data: {
          id: response.id || `indiglm-${Date.now()}`,
          content: response.choices?.[0]?.message?.content || '',
          role: response.choices?.[0]?.message?.role || 'assistant',
          usage: response.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
          indianContext: response.indian_context || {}
        }
      };
    } catch (error) {
      console.error('IndiGLM Chat Completion Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Generate images using IndiGLM
   */
  async generateImage(
    prompt: string,
    options: IndiGLMImageOptions = {}
  ) {
    try {
      const response = await this.client.generate_image(prompt, {
        n: options.n || 1,
        size: options.size || '1024x1024',
        quality: options.quality || 'standard',
        style: options.style || 'vivid',
        indian_theme: options.indianTheme ?? true,
        cultural_elements: options.culturalElements || []
      });

      return {
        success: true,
        data: {
          images: response.data?.map(img => ({
            url: img.url || `data:image/png;base64,${img.base64}`,
            base64: img.base64 || null,
            revisedPrompt: img.revised_prompt || prompt,
            metadata: img.metadata || {}
          })) || [],
          indianContext: response.indian_context || {}
        }
      };
    } catch (error) {
      console.error('IndiGLM Image Generation Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Perform web search with Indian focus
   */
  async webSearch(
    query: string,
    options: IndiGLMSearchOptions = {}
  ) {
    try {
      const response = await this.client.web_search(query, {
        num: options.num || 10,
        region: options.region || 'in',
        indian_focus: options.indianFocus ?? true,
        search_type: options.searchType || 'general',
        language: options.language
      });

      return {
        success: true,
        data: {
          query: response.query || query,
          enhancedQuery: response.enhanced_query || query,
          results: response.results || [],
          searchMetadata: response.search_metadata || {},
          indianContext: response.indian_context || {}
        }
      };
    } catch (error) {
      console.error('IndiGLM Web Search Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get available models
   */
  async getModels() {
    try {
      const response = await this.client.get_model_info();
      return {
        success: true,
        data: {
          models: [{
            id: response.name || 'indiglm-1.0',
            object: 'model',
            created: Math.floor(Date.now() / 1000),
            owned_by: 'indiglm'
          }],
          supported_languages: response.supported_languages || [],
          supported_industries: response.supported_industries || [],
          features: response.features || []
        }
      };
    } catch (error) {
      console.error('IndiGLM Get Models Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Check API health
   */
  async healthCheck() {
    try {
      const response = await this.client.health_check();
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('IndiGLM Health Check Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get supported Indian languages
   */
  getSupportedLanguages() {
    const languageNames: Record<string, string> = {
      'hi': 'हिन्दी',
      'bn': 'বাংলা',
      'te': 'తెలుగు',
      'mr': 'मराठी',
      'ta': 'தமிழ்',
      'gu': 'ગુજરાતી',
      'ur': 'اردو',
      'kn': 'ಕನ್ನಡ',
      'or': 'ଓଡ଼ିଆ',
      'ml': 'മലയാളം',
      'pa': 'ਪੰਜਾਬੀ',
      'as': 'অসমীয়া',
      'mai': 'मैथिली',
      'sa': 'संस्कृतम्',
      'ks': 'کٲشُر',
      'ne': 'नेपाली',
      'sd': 'سنڌي',
      'doi': 'ڈوگرى',
      'kok': 'कोंकणी',
      'sat': 'ᱥᱟᱱᱛᱟᱲᱤ',
      'mni': 'ꯃꯩꯇꯩꯂꯣꯟ',
      'brx': 'बोड़ो',
      'en': 'English'
    };
    
    return Object.entries(languageNames).map(([code, name]) => ({
      code,
      name
    }));
  }

  /**
   * Create cultural context for specific region
   */
  createCulturalContext(region: string, options: any = {}) {
    return {
      region,
      festival_aware: true,
      traditional_values: true,
      regional_customs: true,
      modern_context: true,
      ...options
    };
  }
}

// Singleton instance
let indiglmInstance: IndiGLMService | null = null;

/**
 * Get or create IndiGLM service instance
 */
export function getIndiGLMService(config?: IndiGLMConfig): IndiGLMService {
  if (!indiglmInstance) {
    if (!config) {
      throw new Error('IndiGLM config is required for first initialization');
    }
    indiglmInstance = new IndiGLMService(config);
  }
  return indiglmInstance;
}

/**
 * Initialize IndiGLM with environment variables
 */
export function initializeIndiGLM(): IndiGLMService {
  const apiKey = process.env.INDIGLM_API_KEY;
  if (!apiKey) {
    throw new Error('INDIGLM_API_KEY environment variable is required');
  }

  return getIndiGLMService({
    apiKey,
    baseUrl: process.env.INDIGLM_BASE_URL,
    defaultLanguage: process.env.INDIGLM_DEFAULT_LANGUAGE as any || 'hi',
    enableCulturalContext: process.env.INDIGLM_CULTURAL_CONTEXT !== 'false'
  });
}

export { IndiGLMService as default };