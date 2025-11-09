/**
 * Cost Optimizer Tests
 *
 * Test 90% free-tier routing and budget management
 */

import { CostOptimizer } from '../lib/cost/cost-optimizer';

describe('Cost Optimizer - 90% Free Tier', () => {
  let optimizer: CostOptimizer;

  beforeEach(() => {
    optimizer = new CostOptimizer(200); // $200/month budget
  });

  describe('Routing Logic', () => {
    test('should route simple tasks to free tier', () => {
      const decision = optimizer.route(0.2, 'simple');

      expect(decision.tier).toBe('free');
      expect(decision.estimatedCost).toBe(0);
      expect(decision.model).toContain('gemini');
    });

    test('should route medium tasks to quality free tier', () => {
      const decision = optimizer.route(0.5, 'medium');

      expect(decision.tier).toBe('free');
      expect(decision.estimatedCost).toBe(0);
    });

    test('should route complex tasks to paid when budget allows', () => {
      const decision = optimizer.route(0.9, 'complex');

      // With fresh budget, should use paid tier for complex tasks
      expect(decision.tier).toBe('paid');
      expect(decision.estimatedCost).toBeGreaterThan(0);
    });

    test('should fallback to free tier when budget limited', () => {
      // Exhaust budget with many complex requests
      for (let i = 0; i < 10000; i++) {
        optimizer.route(0.9, 'complex');
      }

      const decision = optimizer.route(0.9, 'complex');

      // Should now use free tier even for complex task
      expect(decision.tier).toBe('free');
    });
  });

  describe('Budget Management', () => {
    test('should track total cost', () => {
      optimizer.route(0.9, 'complex');
      optimizer.route(0.9, 'complex');

      const stats = optimizer.getStats();

      expect(stats.totalCost).toBeGreaterThan(0);
    });

    test('should estimate monthly cost', () => {
      // Make some requests
      for (let i = 0; i < 100; i++) {
        optimizer.route(0.9, 'complex');
      }

      const stats = optimizer.getStats();

      expect(stats.estimatedMonthlyCost).toBeGreaterThan(0);
      expect(stats.estimatedMonthlyCost).toBeLessThan(200); // Within budget
    });

    test('should check if within budget', () => {
      // Make some requests
      for (let i = 0; i < 10; i++) {
        optimizer.route(0.9, 'complex');
      }

      expect(optimizer.isWithinBudget()).toBe(true);
    });
  });

  describe('Free Tier Optimization', () => {
    test('should achieve >85% free tier usage for typical workload', () => {
      // Typical workload: 70% simple, 20% medium, 10% complex
      // Target 85%+ free tier (complex tasks may use paid when budget allows)
      const requests = 1000;

      for (let i = 0; i < requests; i++) {
        const random = Math.random();
        if (random < 0.7) {
          optimizer.route(0.2, 'simple');
        } else if (random < 0.9) {
          optimizer.route(0.5, 'medium');
        } else {
          optimizer.route(0.9, 'complex');
        }
      }

      const freePercentage = optimizer.getFreePercentage();

      expect(freePercentage).toBeGreaterThan(85);
    });

    test('should distribute load across free tier models', () => {
      // Make many requests
      for (let i = 0; i < 100; i++) {
        optimizer.route(0.2, 'simple');
      }

      const stats = optimizer.getStats();

      // Should have used multiple free models
      expect(stats.freeRequests).toBe(100);
      expect(stats.paidRequests).toBe(0);
    });
  });

  describe('Statistics', () => {
    test('should track request counts', () => {
      optimizer.route(0.2, 'simple');
      optimizer.route(0.5, 'medium');
      optimizer.route(0.9, 'complex');

      const stats = optimizer.getStats();

      expect(stats.totalRequests).toBe(3);
      expect(stats.freeRequests + stats.paidRequests).toBe(3);
    });

    test('should calculate free percentage correctly', () => {
      // 9 free requests, 1 paid
      for (let i = 0; i < 9; i++) {
        optimizer.route(0.2, 'simple');
      }
      optimizer.route(0.9, 'complex');

      const percentage = optimizer.getFreePercentage();

      expect(percentage).toBeGreaterThan(85); // Should be ~90%
    });
  });

  describe('Monthly Reset', () => {
    test('should reset counters for new month', () => {
      // Make requests
      optimizer.route(0.9, 'complex');
      optimizer.route(0.9, 'complex');

      // Reset
      optimizer.resetMonth();

      const stats = optimizer.getStats();

      expect(stats.totalRequests).toBe(0);
      expect(stats.totalCost).toBe(0);
    });
  });

  describe('Integration', () => {
    test('complete cost optimization workflow', () => {
      // 1. Process various complexity requests
      const results = [];
      results.push(optimizer.route(0.1, 'data-fetch'));       // Free
      results.push(optimizer.route(0.4, 'analysis'));         // Free
      results.push(optimizer.route(0.8, 'complex-reasoning')); // Paid

      // 2. Check all decisions made
      expect(results.length).toBe(3);

      // 3. Verify free tier optimization
      const freeCount = results.filter(r => r.tier === 'free').length;
      expect(freeCount).toBeGreaterThanOrEqual(2); // At least 2/3 free

      // 4. Check budget
      expect(optimizer.isWithinBudget()).toBe(true);

      // 5. Verify stats
      const stats = optimizer.getStats();
      expect(stats.totalRequests).toBe(3);
    });
  });
});
