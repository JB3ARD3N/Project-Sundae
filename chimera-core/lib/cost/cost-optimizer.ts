/**
 * COST OPTIMIZER
 *
 * Route 90% of requests to free tiers
 * Target: $200/month budget with millions of requests
 */

export interface ModelConfig {
  name: string;
  tier: 'free' | 'paid';
  costPer1k: number;          // Cost per 1000 tokens
  requestsPerMonth: number;   // Free tier limit
  latency: number;            // Average latency in ms
  quality: number;            // Quality score 0-1
}

export interface RoutingDecision {
  model: string;
  tier: 'free' | 'paid';
  reason: string;
  estimatedCost: number;
}

export interface UsageStats {
  totalRequests: number;
  freeRequests: number;
  paidRequests: number;
  totalCost: number;
  estimatedMonthlyCost: number;
}

export class CostOptimizer {
  private models: Map<string, ModelConfig>;
  private usage: Map<string, number>;
  private totalCost: number = 0;
  private totalRequests: number = 0;
  private budget: number = 200;

  constructor(budgetPerMonth: number = 200) {
    this.budget = budgetPerMonth;
    this.models = new Map();
    this.usage = new Map();
    this.initializeModels();
  }

  /**
   * Initialize available models with cost/quality data
   */
  private initializeModels(): void {
    const modelConfigs: ModelConfig[] = [
      // Free tier models
      {
        name: 'gemini-2.0-flash',
        tier: 'free',
        costPer1k: 0,
        requestsPerMonth: 1500,  // 1500 RPD
        latency: 30,
        quality: 0.85
      },
      {
        name: 'claude-3-haiku',
        tier: 'free',
        costPer1k: 0,
        requestsPerMonth: 50000,  // Generous free tier
        latency: 50,
        quality: 0.80
      },
      {
        name: 'gpt-4o-mini',
        tier: 'free',
        costPer1k: 0,
        requestsPerMonth: 10000,  // Free tier for simple tasks
        latency: 40,
        quality: 0.82
      },

      // Paid tier models
      {
        name: 'claude-3.5-sonnet',
        tier: 'paid',
        costPer1k: 0.015,
        requestsPerMonth: Infinity,
        latency: 100,
        quality: 0.95
      },
      {
        name: 'gpt-4o',
        tier: 'paid',
        costPer1k: 0.03,
        requestsPerMonth: Infinity,
        latency: 120,
        quality: 0.93
      },
      {
        name: 'gemini-2.0-pro',
        tier: 'paid',
        costPer1k: 0.01,
        requestsPerMonth: Infinity,
        latency: 80,
        quality: 0.90
      }
    ];

    modelConfigs.forEach(config => {
      this.models.set(config.name, config);
      this.usage.set(config.name, 0);
    });
  }

  /**
   * Route request to optimal model based on complexity and budget
   */
  route(complexity: number, domain: string = 'general'): RoutingDecision {
    this.totalRequests++;

    // Complexity scoring:
    // 0.0-0.3: Simple (use free tier)
    // 0.3-0.7: Medium (use best free tier)
    // 0.7-1.0: Complex (use paid if budget allows)

    if (complexity < 0.3) {
      // Simple task: Use fastest free model
      return this.selectFreeModel('gemini-2.0-flash', 'Simple task, fast free model');
    }

    if (complexity < 0.7) {
      // Medium task: Use highest quality free model
      return this.selectFreeModel('claude-3-haiku', 'Medium complexity, quality free model');
    }

    // Complex task: Check budget
    const currentMonthCost = this.estimateMonthlyCost();

    if (currentMonthCost < this.budget * 0.9) {
      // Budget available: Use premium model
      return this.selectPaidModel('claude-3.5-sonnet', 'Complex task, budget available');
    } else {
      // Budget limited: Use best free model
      return this.selectFreeModel('claude-3-haiku', 'Complex task, budget limited');
    }
  }

  /**
   * Select free tier model
   */
  private selectFreeModel(modelName: string, reason: string): RoutingDecision {
    const model = this.models.get(modelName)!;
    const currentUsage = this.usage.get(modelName)!;

    // Check if we're over the free tier limit
    if (currentUsage >= model.requestsPerMonth) {
      // Fallback to another free model
      const alternativeModel = this.findAlternativeFreeModel(modelName);
      if (alternativeModel) {
        return this.selectFreeModel(alternativeModel, `${reason} (fallback)`);
      } else {
        // All free tiers exhausted, use cheapest paid model
        return this.selectPaidModel('gemini-2.0-pro', 'All free tiers exhausted');
      }
    }

    this.usage.set(modelName, currentUsage + 1);

    return {
      model: modelName,
      tier: 'free',
      reason,
      estimatedCost: 0
    };
  }

  /**
   * Select paid tier model
   */
  private selectPaidModel(modelName: string, reason: string): RoutingDecision {
    const model = this.models.get(modelName)!;
    const currentUsage = this.usage.get(modelName)!;

    // Estimate cost (assume average 1000 tokens per request)
    const estimatedCost = model.costPer1k;
    this.totalCost += estimatedCost;

    this.usage.set(modelName, currentUsage + 1);

    return {
      model: modelName,
      tier: 'paid',
      reason,
      estimatedCost
    };
  }

  /**
   * Find alternative free model
   */
  private findAlternativeFreeModel(excludeModel: string): string | null {
    for (const [name, model] of this.models) {
      if (name !== excludeModel && model.tier === 'free') {
        const usage = this.usage.get(name)!;
        if (usage < model.requestsPerMonth) {
          return name;
        }
      }
    }
    return null;
  }

  /**
   * Estimate monthly cost based on current usage
   */
  private estimateMonthlyCost(): number {
    const daysInMonth = 30;
    const currentDay = new Date().getDate();

    if (currentDay === 0) return 0;

    // Extrapolate current cost to full month
    return (this.totalCost / currentDay) * daysInMonth;
  }

  /**
   * Get usage statistics
   */
  getStats(): UsageStats {
    let freeRequests = 0;
    let paidRequests = 0;

    this.models.forEach((model, name) => {
      const usage = this.usage.get(name)!;
      if (model.tier === 'free') {
        freeRequests += usage;
      } else {
        paidRequests += usage;
      }
    });

    return {
      totalRequests: this.totalRequests,
      freeRequests,
      paidRequests,
      totalCost: this.totalCost,
      estimatedMonthlyCost: this.estimateMonthlyCost()
    };
  }

  /**
   * Get free tier percentage
   */
  getFreePercentage(): number {
    if (this.totalRequests === 0) return 0;
    const stats = this.getStats();
    return (stats.freeRequests / stats.totalRequests) * 100;
  }

  /**
   * Check if within budget
   */
  isWithinBudget(): boolean {
    const estimated = this.estimateMonthlyCost();
    return estimated <= this.budget;
  }

  /**
   * Reset monthly counters (call this at start of each month)
   */
  resetMonth(): void {
    this.usage.forEach((_, name) => {
      this.usage.set(name, 0);
    });
    this.totalCost = 0;
    this.totalRequests = 0;
  }
}
