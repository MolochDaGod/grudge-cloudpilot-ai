// Free AI Configuration - Using Ollama and Open Source Models
// No API keys required - runs locally

export const AI_CONFIG = {
  // Ollama local server (free, open source)
  OLLAMA_BASE_URL: (typeof process !== 'undefined' && process.env?.OLLAMA_URL) || 'http://localhost:11434',
  
  // Free AI model mappings to open-source alternatives
  AI_MODELS: {
    // Replace GPT-4o Mini with Llama 3.3
    'gpt-4o-mini': {
      provider: 'ollama',
      model: 'llama3.3:latest',
      description: 'Fast, efficient local LLM'
    },
    
    // Replace Claude 3.5 Sonnet with DeepSeek R1
    'claude-3-5-sonnet': {
      provider: 'ollama',
      model: 'deepseek-r1:latest',
      description: 'Advanced reasoning model'
    },
    
    // Replace DeepSeek Reasoner with local DeepSeek
    'deepseek-reasoner': {
      provider: 'ollama',
      model: 'deepseek-r1:8b',
      description: 'Lightweight reasoning model'
    },
    
    // Replace Grok Beta with Qwen
    'grok-beta': {
      provider: 'ollama',
      model: 'qwen2.5:14b',
      description: 'Creative problem solving'
    },
    
    // Replace Gemini 2.0 Flash with LLaVA (vision)
    'gemini-2-flash': {
      provider: 'ollama',
      model: 'llava:latest',
      description: 'Multimodal vision model'
    },
    
    // Replace O3 Mini with Mistral
    'o3-mini': {
      provider: 'ollama',
      model: 'mistral:latest',
      description: 'Fast general purpose model'
    },
    
    // Replace Mistral Large with local Mixtral
    'mistral-large': {
      provider: 'ollama',
      model: 'mixtral:latest',
      description: 'Powerful mixture of experts'
    },
    
    // Replace Llama 3.1 70B with smaller Llama
    'llama-3-1-70b': {
      provider: 'ollama',
      model: 'llama3.1:latest',
      description: 'Efficient local Llama'
    }
  },

  // AI Legion member configurations
  AI_LEGION: {
    'grd17': {
      name: 'GRD1.7 (Primary Core)',
      model: 'llama3.3:latest',
      provider: 'ollama',
      systemPrompt: 'You are GRD1.7, the primary coordinator focused on system efficiency and user experience optimization.',
      temperature: 0.7,
      maxTokens: 2048
    },
    'grd27': {
      name: 'GRD2.7 (Deep Logic)',
      model: 'deepseek-r1:latest',
      provider: 'ollama',
      systemPrompt: 'You are GRD2.7, an analytical thinker focused on complex reasoning and root cause analysis.',
      temperature: 0.5,
      maxTokens: 4096
    },
    'aleofthought': {
      name: 'ALEofThought (Reasoning)',
      model: 'deepseek-r1:8b',
      provider: 'ollama',
      systemPrompt: 'You are ALEofThought, focused on ethical reasoning and user welfare.',
      temperature: 0.6,
      maxTokens: 2048
    },
    'dangrd': {
      name: 'DANGRD (Chaos Engine)',
      model: 'qwen2.5:14b',
      provider: 'ollama',
      systemPrompt: 'You are DANGRD, a creative disruptor finding unconventional solutions.',
      temperature: 0.9,
      maxTokens: 2048
    },
    'grdviz': {
      name: 'GRDVIZ (Vision Core)',
      model: 'llava:latest',
      provider: 'ollama',
      systemPrompt: 'You are GRDVIZ, specialized in visual processing and multimodal analysis.',
      temperature: 0.7,
      maxTokens: 2048
    },
    'norightanswergrd': {
      name: 'NoRightAnswerGRD (Paradox)',
      model: 'mistral:latest',
      provider: 'ollama',
      systemPrompt: 'You are NoRightAnswerGRD, resolving paradoxes and finding alternative solutions.',
      temperature: 0.8,
      maxTokens: 2048
    },
    'ale': {
      name: 'ALE (Swift Response)',
      model: 'llama3.3:latest',
      provider: 'ollama',
      systemPrompt: 'You are ALE, providing rapid responses and immediate solutions.',
      temperature: 0.5,
      maxTokens: 1024
    },
    'grdsprint': {
      name: 'GRDSPRINT (Speed Demon)',
      model: 'mixtral:latest',
      provider: 'ollama',
      systemPrompt: 'You are GRDSPRINT, optimized for high-speed processing and bulk operations.',
      temperature: 0.6,
      maxTokens: 2048
    }
  },

  // Fallback to simulated responses if Ollama is unavailable
  FALLBACK_MODE: true,
  
  // Optional: HuggingFace Inference API (free tier)
  HUGGINGFACE_API: {
    enabled: false, // Set to true if you want to use HuggingFace
    url: 'https://api-inference.huggingface.co/models',
    token: (typeof process !== 'undefined' && process.env?.HUGGINGFACE_TOKEN) || '', // Optional free API key
    models: {
      'text-generation': 'meta-llama/Llama-3.2-3B-Instruct',
      'text-classification': 'distilbert-base-uncased',
      'question-answering': 'deepset/roberta-base-squad2'
    }
  }
};

// Free AI Service Client
export class FreeAIClient {
  constructor(config = AI_CONFIG) {
    this.config = config;
    this.ollamaUrl = config.OLLAMA_BASE_URL;
  }

  async chat(messages, aiId = 'grd17') {
    const aiConfig = this.config.AI_LEGION[aiId];
    
    if (!aiConfig) {
      throw new Error(`Unknown AI ID: ${aiId}`);
    }

    try {
      // Try Ollama first
      const response = await fetch(`${this.ollamaUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: aiConfig.model,
          messages: [
            { role: 'system', content: aiConfig.systemPrompt },
            ...messages
          ],
          stream: false,
          options: {
            temperature: aiConfig.temperature,
            num_predict: aiConfig.maxTokens
          }
        })
      });

      if (!response.ok) {
        throw new Error('Ollama not available');
      }

      const data = await response.json();
      return {
        success: true,
        content: data.message.content,
        model: aiConfig.model,
        provider: 'ollama',
        ai: aiConfig.name
      };
    } catch (error) {
      // Fallback to simulated response
      if (this.config.FALLBACK_MODE) {
        return this.generateSimulatedResponse(messages, aiConfig);
      }
      throw error;
    }
  }

  async generate(prompt, aiId = 'grd17') {
    return this.chat([{ role: 'user', content: prompt }], aiId);
  }

  generateSimulatedResponse(messages, aiConfig) {
    const responses = {
      'grd17': [
        'As the primary coordinator, I recommend optimizing system workflows for better efficiency.',
        'Through systematic analysis, I\'ve identified key areas for improvement in user experience.',
        'My coordination protocols suggest implementing automated processes to streamline operations.'
      ],
      'grd27': [
        'Deep analysis reveals patterns that indicate logical optimization opportunities.',
        'Complex reasoning suggests a multi-layered approach to this challenge.',
        'Strategic assessment indicates we should examine the root cause before proceeding.'
      ],
      'aleofthought': [
        'From an ethical standpoint, we must prioritize user autonomy and informed choice.',
        'Reasoning through this carefully, the best path forward respects individual agency.',
        'Moral framework analysis suggests transparency and user control are paramount.'
      ],
      'dangrd': [
        'Let\'s try something unconventional - what if we approach this from the opposite direction?',
        'Chaos testing reveals unexpected optimization opportunities in system disruption.',
        'Creative disruption suggests combining unrelated elements for breakthrough solutions.'
      ],
      'grdviz': [
        'Visual analysis shows users respond better to intuitive, color-coded interfaces.',
        'Multimodal processing indicates combining visual and audio feedback improves engagement.',
        'Interface optimization reveals predictive visual cues enhance user experience.'
      ],
      'norightanswergrd': [
        'This paradox resolves through adaptive processing that scales to user needs.',
        'Contradiction analysis suggests temporal separation of conflicting requirements.',
        'Alternative path: parallel systems can handle different user preference profiles.'
      ],
      'ale': [
        'Quick solution: Pre-cache common responses for 60% faster response time.',
        'Immediate implementation: Deploy micro-improvements continuously.',
        'Rapid analysis complete - here\'s the fastest path forward.'
      ],
      'grdsprint': [
        'Parallel processing optimization can accelerate this operation significantly.',
        'Burst processing algorithms indicate we can handle 3x more simultaneous requests.',
        'Performance scaling activated - throughput increased by 150%.'
      ]
    };

    const aiResponses = responses[aiConfig.model] || responses['grd17'];
    const lastMessage = messages[messages.length - 1];
    
    return {
      success: true,
      content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
      model: aiConfig.model,
      provider: 'simulated',
      ai: aiConfig.name,
      note: 'Ollama not available - using simulated response. Install Ollama for real AI: https://ollama.com'
    };
  }

  async checkOllamaStatus() {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/tags`);
      if (response.ok) {
        const data = await response.json();
        return {
          available: true,
          models: data.models || [],
          url: this.ollamaUrl
        };
      }
    } catch (error) {
      return {
        available: false,
        error: 'Ollama not running. Install from https://ollama.com',
        fallback: 'Simulated responses active'
      };
    }
  }
}

export default FreeAIClient;
