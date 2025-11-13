/**
 * Cost Optimizer - AI Model Router
 * Re-export from chimera-core package
 */

export interface ModelProvider {
  name: string;
  tier: 'free' | 'paid';
  costPer1k: number;
  maxTokens: number;
  usedToday: number;
  dailyLimit: number;
}

export class CostOptimizer {
  private providers: Map<string, ModelProvider> = new Map();
  private budgetLimit: number = 200; // $200/month
  private spentToday: number = 0;

  constructor() {
    this.initializeProviders();
  }

  /**
   * Initialize AI model providers
   */
  private initializeProviders(): void {
    const providers: Record<string, ModelProvider> = {
      'gemini_flash': {
        name: 'Gemini 2.0 Flash',
        tier: 'free',
        costPer1k: 0,
        maxTokens: 32000,
        usedToday: 0,
        dailyLimit: 1500,
      },
      'claude_haiku': {
        name: 'Claude 3 Haiku',
        tier: 'free',
        costPer1k: 0,
        maxTokens: 200000,
        usedToday: 0,
        dailyLimit: 1666, // 50k/month ÷ 30
      },
      'gpt4o_mini': {
        name: 'GPT-4o Mini',
        tier: 'free',
        costPer1k: 0,
        maxTokens: 128000,
        usedToday: 0,
        dailyLimit: 333, // 10k/month ÷ 30
      },
      'claude_sonnet': {
        name: 'Claude 3.5 Sonnet',
        tier: 'paid',
        costPer1k: 0.003,
        maxTokens: 200000,
        usedToday: 0,
        dailyLimit: 999999,
      },
      'gemini_pro': {
        name: 'Gemini 1.5 Pro',
        tier: 'paid',
        costPer1k: 0.00125,
        maxTokens: 2000000,
        usedToday: 0,
        dailyLimit: 999999,
      },
      'gpt5': {
        name: 'GPT-5',
        tier: 'paid',
        costPer1k: 0.005,
        maxTokens: 128000,
        usedToday: 0,
        dailyLimit: 999999,
      },
    };

    Object.entries(providers).forEach(([key, provider]) => {
      this.providers.set(key, provider);
    });
  }

  /**
   * Select best model based on complexity and budget
   */
  selectModel(task: string, complexity: number, userTier: 'base' | 'personal' = 'base'): any {
    // Base users ALWAYS get free tier (Everybody Eats)
    if (userTier === 'base') {
      const freeProvider = this.getAvailableFree();
      if (freeProvider) {
        return {
          provider: freeProvider,
          model: this.providers.get(freeProvider)?.name,
          estimatedCost: 0,
          reasoning: '100% free-tier for base users (Everybody Eats)',
        };
      }

      // Queue if free tier exhausted
      return {
        provider: 'queued',
        model: 'Queued',
        estimatedCost: 0,
        reasoning: 'Free tier at capacity - queued for next available slot',
      };
    }

    // Personal tier: optimize by complexity
    if (complexity < 0.3) {
      return this.selectFreeOrCheap();
    } else if (complexity < 0.7) {
      return this.selectMidTier();
    } else {
      return this.selectPremium();
    }
  }

  /**
   * Get available free-tier provider
   */
  private getAvailableFree(): string | null {
    const freeProviders = [];

    for (const [key, provider] of this.providers.entries()) {
      if (provider.tier === 'free' && provider.usedToday < provider.dailyLimit) {
        freeProviders.push({ key, provider });
      }
    }

    // Sort by max tokens (prefer larger context)
    freeProviders.sort((a, b) => b.provider.maxTokens - a.provider.maxTokens);

    return freeProviders.length > 0 ? freeProviders[0].key : null;
  }

  /**
   * Select free or cheap model
   */
  private selectFreeOrCheap(): any {
    const free = this.getAvailableFree();
    if (free) {
      return {
        provider: free,
        model: this.providers.get(free)?.name,
        estimatedCost: 0,
        reasoning: 'Low complexity - using free tier',
      };
    }

    // Fallback to cheapest paid
    return {
      provider: 'gemini_pro',
      model: 'Gemini 1.5 Pro',
      estimatedCost: 0.005,
      reasoning: 'Free tier exhausted - using cheapest paid model',
    };
  }

  /**
   * Select mid-tier model
   */
  private selectMidTier(): any {
    return {
      provider: 'claude_sonnet',
      model: 'Claude 3.5 Sonnet',
      estimatedCost: 0.01,
      reasoning: 'Medium complexity - balanced performance/cost',
    };
  }

  /**
   * Select premium model
   */
  private selectPremium(): any {
    return {
      provider: 'gpt5',
      model: 'GPT-5',
      estimatedCost: 0.05,
      reasoning: 'High complexity - maximum capability',
    };
  }

  /**
   * Record usage for a provider
   */
  recordUsage(provider: string, cost: number): void {
    const p = this.providers.get(provider);
    if (p) {
      p.usedToday++;
      this.spentToday += cost;
    }
  }

  /**
   * Get budget status
   */
  getBudgetStatus(): any {
    const freeUsage = Array.from(this.providers.values())
      .filter(p => p.tier === 'free')
      .reduce((sum, p) => sum + p.usedToday, 0);

    const totalFreeLimit = Array.from(this.providers.values())
      .filter(p => p.tier === 'free')
      .reduce((sum, p) => sum + p.dailyLimit, 0);

    return {
      spentToday: this.spentToday,
      budgetLimit: this.budgetLimit,
      monthlyProjection: this.spentToday * 30,
      freeUsage,
      totalFreeLimit,
      freeTierHealth: freeUsage < totalFreeLimit * 0.8 ? 'HEALTHY' : 'CAPACITY',
      message: '90%+ free-tier routing active',
    };
  }

  /**
   * Reset daily usage (call at midnight)
   */
  resetDaily(): void {
    for (const provider of this.providers.values()) {
      provider.usedToday = 0;
    }
    this.spentToday = 0;
  }
}
