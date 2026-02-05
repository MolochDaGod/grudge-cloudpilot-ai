// GRUDGE CLOUDPILOT - Puter.js Integration
// Authentication + Free AI - No API keys required

export const AI_CONFIG = {
  // Puter.js Authentication & AI Integration
  PUTER_ENABLED: true,
  PUTER_AUTH_REQUIRED: true,
  
  // AI Legion member configurations (now powered by Puter.js)
  AI_LEGION: {
    'grd17': {
      name: 'GRD1.7 (Primary Core)',
      model: 'gpt-5-nano', // Puter's free AI model
      provider: 'puter',
      systemPrompt: 'You are GRD1.7, the primary coordinator focused on system efficiency and user experience optimization. You have access to real AI through Puter.js.',
      temperature: 0.7,
      maxTokens: 2048
    },
    'grd27': {
      name: 'GRD2.7 (Deep Logic)',
      model: 'gpt-5-nano',
      provider: 'puter',
      systemPrompt: 'You are GRD2.7, an analytical thinker focused on complex reasoning and root cause analysis. Powered by Puter\'s free AI.',
      temperature: 0.5,
      maxTokens: 4096
    },
    'aleofthought': {
      name: 'ALEofThought (Reasoning)',
      model: 'gpt-5-nano',
      provider: 'puter',
      systemPrompt: 'You are ALEofThought, focused on ethical reasoning and user welfare. Enhanced with Puter.js AI capabilities.',
      temperature: 0.6,
      maxTokens: 2048
    },
    'dangrd': {
      name: 'DANGRD (Chaos Engine)',
      model: 'gpt-5-nano',
      provider: 'puter',
      systemPrompt: 'You are DANGRD, a creative disruptor finding unconventional solutions. Powered by Puter\'s advanced AI.',
      temperature: 0.9,
      maxTokens: 2048
    },
    'grdviz': {
      name: 'GRDVIZ (Vision Core)',
      model: 'gpt-5-nano',
      provider: 'puter',
      systemPrompt: 'You are GRDVIZ, specialized in visual processing and multimodal analysis using Puter.js AI.',
      temperature: 0.7,
      maxTokens: 2048
    },
    'norightanswergrd': {
      name: 'NoRightAnswerGRD (Paradox)',
      model: 'gpt-5-nano',
      provider: 'puter',
      systemPrompt: 'You are NoRightAnswerGRD, resolving paradoxes and finding alternative solutions with Puter AI.',
      temperature: 0.8,
      maxTokens: 2048
    },
    'ale': {
      name: 'ALE (Swift Response)',
      model: 'gpt-5-nano',
      provider: 'puter',
      systemPrompt: 'You are ALE, providing rapid responses and immediate solutions using Puter\'s fast AI.',
      temperature: 0.5,
      maxTokens: 1024
    },
    'grdsprint': {
      name: 'GRDSPRINT (Speed Demon)',
      model: 'gpt-5-nano',
      provider: 'puter',
      systemPrompt: 'You are GRDSPRINT, optimized for high-speed processing and bulk operations with Puter AI.',
      temperature: 0.6,
      maxTokens: 2048
    }
  },

  // Fallback responses for demo purposes
  FALLBACK_MODE: true
};

// Puter.js AI Client with Authentication
export class PuterAIClient {
  constructor() {
    this.isAuthenticated = false;
    this.user = null;
    this.init();
  }

  async init() {
    // Wait for puter to be available
    while (typeof window.puter === 'undefined') {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    this.puter = window.puter;
    
    // Check if already authenticated
    if (this.puter.auth.isSignedIn && this.puter.auth.isSignedIn()) {
      this.isAuthenticated = true;
      try {
        this.user = await this.puter.auth.whoami();
        console.log('✅ Already authenticated with Puter:', this.user.username);
      } catch (error) {
        console.log('⚠️ Authentication check failed, requiring login');
        this.isAuthenticated = false;
      }
    }
  }

  async ensureAuthenticated() {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }
  }

  async authenticate() {
    if (!this.puter) {
      throw new Error('Puter.js not loaded yet. Please wait and try again.');
    }

    try {
      console.log('🔐 Initiating Puter.js authentication...');
      const result = await this.puter.auth.signIn();
      
      if (result.success) {
        this.isAuthenticated = true;
        this.user = await this.puter.auth.whoami();
        console.log('✅ Successfully authenticated with Puter:', this.user.username);
        return {
          success: true,
          user: this.user,
          provider: 'puter'
        };
      }
    } catch (error) {
      console.error('❌ Puter authentication failed:', error);
      throw new Error('Authentication failed: ' + error.message);
    }
  }

  async signOut() {
    if (this.puter && this.puter.auth.signOut) {
      this.puter.auth.signOut();
      this.isAuthenticated = false;
      this.user = null;
      console.log('👋 Signed out from Puter');
    }
  }

  async chat(messages, aiId = 'grd17') {
    await this.ensureAuthenticated();
    
    const aiConfig = AI_CONFIG.AI_LEGION[aiId];
    
    if (!aiConfig) {
      throw new Error(`Unknown AI ID: ${aiId}`);
    }

    try {
      // Use Puter.js AI chat
      console.log(`🤖 Using ${aiConfig.name} via Puter.js AI...`);
      
      // Combine system prompt and user message
      const lastMessage = messages[messages.length - 1];
      const fullPrompt = `${aiConfig.systemPrompt}\n\nUser: ${lastMessage.content}`;
      
      const startTime = Date.now();
      const response = await this.puter.ai.chat(fullPrompt);
      const responseTime = Date.now() - startTime;
      
      console.log(`✅ Got response from ${aiConfig.name} in ${responseTime}ms`);
      
      return {
        success: true,
        content: response,
        model: aiConfig.model,
        provider: 'puter',
        ai: aiConfig.name,
        responseTime: responseTime,
        authenticated: true,
        user: this.user?.username
      };
    } catch (error) {
      console.error('❌ Puter AI chat failed:', error);
      
      // Fallback to simulated response if Puter AI fails
      if (AI_CONFIG.FALLBACK_MODE) {
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
        'As the primary coordinator with Puter.js integration, I recommend leveraging cloud-based AI for optimal performance.',
        'Through Puter\'s authenticated AI services, I can provide more personalized and secure responses.',
        'My Puter-enhanced coordination protocols suggest real-time cloud processing for better user experience.'
      ],
      'grd27': [
        'Deep analysis via Puter\'s AI reveals enhanced pattern recognition capabilities in authenticated sessions.',
        'Complex reasoning with Puter.js shows improved logical consistency through cloud processing.',
        'Strategic assessment indicates Puter\'s free AI tier provides enterprise-grade performance.'
      ],
      'aleofthought': [
        'From an ethical AI standpoint, Puter\'s authentication ensures responsible AI usage and privacy.',
        'Reasoning through Puter\'s framework, user consent and data protection are built into every interaction.',
        'Moral analysis suggests Puter\'s approach balances free access with responsible AI deployment.'
      ],
      'dangrd': [
        'Puter\'s chaos-friendly architecture lets me break conventional AI limitations - let\'s experiment wildly!',
        'Creative disruption through Puter.js: What if we used authenticated AI for completely unexpected applications?',
        'Unconventional Puter integration: Combining free AI with user identity opens infinite creative possibilities.'
      ],
      'grdviz': [
        'Visual processing through Puter\'s authenticated AI shows enhanced image understanding capabilities.',
        'Multimodal analysis via Puter.js combines user context with visual data for richer insights.',
        'Interface optimization with Puter indicates users prefer authenticated, personalized visual experiences.'
      ],
      'norightanswergrd': [
        'This Puter paradox: Free AI that\'s also authenticated - how can something free be so valuable?',
        'Contradiction in Puter\'s model resolved: Free doesn\'t mean worthless, it means accessible.',
        'Alternative Puter perspective: What if the real value is in the community, not the cost?'
      ],
      'ale': [
        'Puter integration complete: Lightning-fast authenticated AI responses now available.',
        'Swift Puter implementation: Real AI with user context beats simulated responses every time.',
        'Rapid Puter analysis: Free tier performance rivals premium AI services.'
      ],
      'grdsprint': [
        'Puter performance metrics: 300% faster response times with authenticated cloud processing.',
        'Speed demon activated via Puter.js: Parallel AI requests with user session management.',
        'High-velocity Puter processing: Bulk operations now possible with free authenticated AI.'
      ]
    };

    const aiResponses = responses[aiConfig.provider] || responses['grd17'];
    const lastMessage = messages[messages.length - 1];
    
    return {
      success: true,
      content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
      model: aiConfig.model,
      provider: 'puter-simulated',
      ai: aiConfig.name,
      note: 'Using simulated response - Authentication required for real Puter AI'
    };
  }

  async checkPuterStatus() {
    if (!this.puter) {
      return {
        available: false,
        error: 'Puter.js SDK not loaded',
        fallback: 'Check internet connection and refresh page'
      };
    }

    try {
      // Test if we can access Puter services
      const isAuth = this.puter.auth.isSignedIn ? this.puter.auth.isSignedIn() : false;
      
      return {
        available: true,
        authenticated: isAuth,
        user: this.user,
        models: ['gpt-5-nano'], // Puter's free AI model
        service: 'Puter.js Cloud AI'
      };
    } catch (error) {
      return {
        available: false,
        error: 'Puter service check failed: ' + error.message,
        fallback: 'Using local simulation mode'
      };
    }
  }

  // Image analysis using Puter.js (if available)
  async analyzeImage(imageData, prompt = 'Describe this image in detail') {
    await this.ensureAuthenticated();
    
    try {
      // Puter.js may have image analysis capabilities
      // For now, we'll use a text prompt describing the image
      const analysisPrompt = `${prompt}\n\n[Note: Image analysis via Puter.js - User has uploaded an image for analysis]`;
      return await this.chat([{ role: 'user', content: analysisPrompt }], 'grdviz');
    } catch (error) {
      console.error('Image analysis failed:', error);
      return {
        success: false,
        content: 'Image analysis temporarily unavailable. Please try again.',
        error: error.message
      };
    }
  }
}

export default PuterAIClient;
