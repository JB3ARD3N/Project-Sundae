/**
 * Memory System - Pattern Storage & Retrieval
 * Re-export from chimera-core package
 */

export interface Pattern {
  id: string;
  input: string;
  output: any;
  success: boolean;
  confidence: number;
  tags: string[];
  timestamp: string;
  usageCount: number;
  lastUsed: string;
}

export class MemorySystem {
  private patterns: Map<string, Pattern> = new Map();
  private tagIndex: Map<string, Set<string>> = new Map();
  private stats = {
    totalPatterns: 0,
    successfulPatterns: 0,
    totalRecalls: 0,
  };

  /**
   * Add a pattern to memory
   */
  async addPattern(data: Omit<Pattern, 'id' | 'usageCount' | 'lastUsed' | 'timestamp'>): Promise<string> {
    const id = `pattern-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const pattern: Pattern = {
      ...data,
      id,
      timestamp: new Date().toISOString(),
      usageCount: 0,
      lastUsed: new Date().toISOString(),
    };

    this.patterns.set(id, pattern);
    this.stats.totalPatterns++;

    if (pattern.success) {
      this.stats.successfulPatterns++;
    }

    // Index by tags
    pattern.tags.forEach(tag => {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(id);
    });

    return id;
  }

  /**
   * Retrieve similar patterns
   */
  async retrieve(query: string, tags?: string[], limit: number = 10): Promise<Pattern[]> {
    this.stats.totalRecalls++;

    let candidates = Array.from(this.patterns.values());

    // Filter by tags if provided
    if (tags && tags.length > 0) {
      const taggedIds = new Set<string>();
      tags.forEach(tag => {
        const ids = this.tagIndex.get(tag);
        if (ids) {
          ids.forEach(id => taggedIds.add(id));
        }
      });

      candidates = candidates.filter(p => taggedIds.has(p.id));
    }

    // Score by relevance
    const scored = candidates.map(pattern => ({
      pattern,
      score: this.calculateScore(pattern, query),
    }));

    // Sort by score
    scored.sort((a, b) => b.score - a.score);

    // Update usage
    const results = scored.slice(0, limit).map(s => {
      s.pattern.usageCount++;
      s.pattern.lastUsed = new Date().toISOString();
      return s.pattern;
    });

    return results;
  }

  /**
   * Calculate relevance score
   */
  private calculateScore(pattern: Pattern, query: string): number {
    const now = Date.now();
    const patternTime = new Date(pattern.timestamp).getTime();
    const daysSince = (now - patternTime) / (1000 * 60 * 60 * 24);

    // Recency score (decay over time)
    const recencyScore = Math.exp(-daysSince / 30); // Decay over 30 days

    // Frequency score
    const frequencyScore = Math.min(1, pattern.usageCount / 10);

    // Recent use boost
    const lastUsedTime = new Date(pattern.lastUsed).getTime();
    const hoursSinceUse = (now - lastUsedTime) / (1000 * 60 * 60);
    const recentUseBoost = hoursSinceUse < 24 ? 0.2 : 0;

    // Success rate
    const successScore = pattern.success ? 1 : 0.5;

    // Similarity to query
    const similarity = this.calculateSimilarity(query.toLowerCase(), pattern.input.toLowerCase());

    // Weighted combination
    const score =
      similarity * 0.4 +
      recencyScore * 0.2 +
      frequencyScore * 0.15 +
      successScore * 0.15 +
      recentUseBoost * 0.1;

    return score;
  }

  /**
   * Calculate text similarity
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(/\s+/);
    const words2 = str2.split(/\s+/);

    const commonWords = words1.filter(w => words2.includes(w));
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  /**
   * Get statistics
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * Clear old patterns (garbage collection)
   */
  cleanup(daysOld: number = 90): number {
    const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
    let removed = 0;

    for (const [id, pattern] of this.patterns.entries()) {
      const patternTime = new Date(pattern.timestamp).getTime();
      if (patternTime < cutoffTime && pattern.usageCount === 0) {
        this.patterns.delete(id);
        removed++;
      }
    }

    return removed;
  }
}
