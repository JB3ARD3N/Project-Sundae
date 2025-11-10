interface AIProvider {
  name: string;
  tier: 'free' | 'paid';
  costPer1k: number;
  maxTokens: number;
  usedToday: number;
  dailyLimit: number;
}

interface RoutingDecision {
  provider: string;
  model: string;
  estimatedCost: number;
  reasoning: string;
}

export class AIRouter {
  private providers: Record<string, AIProvider> = {
    groq_llama: {
      name: 'Groq Llama 3.1 70B',
      tier: 'free',
      costPer1k: 0,
      maxTokens: 8000,
      usedToday: 0,
      dailyLimit: 14400
    },
    gemini_flash: {
      name: 'Gemini 1.5 Flash',
      tier: 'free',
      costPer1k: 0,
      maxTokens: 32000,
      usedToday: 0,
      dailyLimit: 1500
    },
    claude_sonnet: {
      name: 'Claude 3.5 Sonnet',
      tier: 'paid',
      costPer1k: 0.003,
      maxTokens: 200000,
      usedToday: 0,
      dailyLimit: 999999
    },
    gemini_pro: {
      name: 'Gemini 1.5 Pro',
      tier: 'paid',
      costPer1k: 0.00125,
      maxTokens: 2000000,
      usedToday: 0,
      dailyLimit: 999999
    },
    gpt5: {
      name: 'GPT-5',
      tier: 'paid',
      costPer1k: 0.005,
      maxTokens: 128000,
      usedToday: 0,
      dailyLimit: 999999
    }
  };

  route(task: string, complexity: number, userTier: 'base' | 'personal' = 'base'): RoutingDecision {
    if (userTier === 'base') {
      const freeProvider = this.getAvailableFree();
      if (freeProvider) {
        return {
          provider: freeProvider,
          model: this.providers[freeProvider].name,
          estimatedCost: 0,
          reasoning: '100% free-tier for base users (Everybody Eats)'
        };
      }
      return {
        provider: 'queued',
        model: 'Queued',
        estimatedCost: 0,
        reasoning: 'Free tier at capacity'
      };
    }

    if (userTier === 'personal') {
      if (complexity < 4) {
        return {
          provider: 'gemini_pro',
          model: this.providers.gemini_pro.name,
          estimatedCost: 0.005,
          reasoning: 'Personal - fast for simple'
        };
      } else if (complexity < 7) {
        return {
          provider: 'claude_sonnet',
          model: this.providers.claude_sonnet.name,
          estimatedCost: 0.01,
          reasoning: 'Personal - Claude for medium'
        };
      } else {
        return {
          provider: 'gpt5',
          model: this.providers.gpt5.name,
          estimatedCost: 0.05,
          reasoning: 'Personal - GPT-5 for complex'
        };
      }
    }

    return this.getDefaultRoute();
  }

  private getAvailableFree(): string | null {
    const freeProviders = Object.entries(this.providers)
      .filter(([_, p]) => p.tier === 'free' && p.usedToday < p.dailyLimit)
      .sort((a, b) => b[1].maxTokens - a[1].maxTokens);
    return freeProviders.length > 0 ? freeProviders[0][0] : null;
  }

  private getDefaultRoute(): RoutingDecision {
    return {
      provider: 'groq_llama',
      model: this.providers.groq_llama.name,
      estimatedCost: 0,
      reasoning: 'Default free tier'
    };
  }

  recordUsage(provider: string, cost: number) {
    if (this.providers[provider]) {
      this.providers[provider].usedToday++;
    }
  }

  getBudgetStatus() {
    return {
      freeUsage: Object.values(this.providers)
        .filter(p => p.tier === 'free')
        .reduce((sum, p) => sum + p.usedToday, 0),
      freeTierHealth: this.getAvailableFree() ? 'HEALTHY' : 'CAPACITY',
      message: '100% free routing for base users'
    };
  }

  getCurrentUsage() {
    const usage: Record<string, { used: number; limit: number }> = {};
    Object.entries(this.providers).forEach(([key, provider]) => {
      usage[key] = {
        used: provider.usedToday,
        limit: provider.dailyLimit
      };
    });
    return usage;
  }
}

export const aiRouter = new AIRouter();
