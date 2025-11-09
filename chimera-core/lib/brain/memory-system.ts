/**
 * MEMORY SYSTEM - The Ledger
 *
 * Fast access to 90% of monotonous stuff
 * Reverse chronological + frequency-based retrieval
 * Learns from access patterns
 *
 * Inspired by Gremoire - but faster, smarter
 */

export interface MemoryEntry {
  id: string;
  type: 'pattern' | 'solution' | 'code' | 'decision' | 'learning';
  content: any;
  timestamp: Date;
  accessCount: number;
  lastAccessed: Date;
  tags: string[];
  successRate: number;  // 0-1: How often this works
  context: Record<string, any>;
}

export interface AccessPattern {
  query: string;
  result: string;
  success: boolean;
  timestamp: Date;
  durationMs: number;
}

export class MemorySystem {
  private memory: Map<string, MemoryEntry>;
  private accessPatterns: AccessPattern[];
  private frequencyIndex: Map<string, string[]>;  // tag -> [memoryIds] sorted by frequency
  private chronoIndex: string[];  // All IDs in reverse chronological order

  constructor() {
    this.memory = new Map();
    this.accessPatterns = [];
    this.frequencyIndex = new Map();
    this.chronoIndex = [];
  }

  /**
   * Store something in memory
   */
  store(entry: Omit<MemoryEntry, 'id' | 'timestamp' | 'accessCount' | 'lastAccessed' | 'successRate'>): string {
    const id = this.generateId();

    const memoryEntry: MemoryEntry = {
      id,
      timestamp: new Date(),
      accessCount: 0,
      lastAccessed: new Date(),
      successRate: 1.0,  // Optimistic start
      ...entry
    };

    this.memory.set(id, memoryEntry);

    // Update indexes
    this.chronoIndex.unshift(id);  // Most recent first
    this.updateFrequencyIndex(memoryEntry);

    return id;
  }

  /**
   * Retrieve from memory with smart prioritization
   * Most recent + most used = fastest retrieval
   */
  retrieve(query: {
    type?: MemoryEntry['type'];
    tags?: string[];
    minSuccessRate?: number;
    limit?: number;
  }): MemoryEntry[] {
    const startTime = Date.now();
    const results: MemoryEntry[] = [];

    // Strategy: Combine frequency and recency
    const candidates = this.getCandidates(query);

    // Score each candidate
    const scored = candidates.map(entry => ({
      entry,
      score: this.calculateRetrievalScore(entry)
    }));

    // Sort by score (highest first)
    scored.sort((a, b) => b.score - a.score);

    // Take top N
    const limit = query.limit || 10;
    const topResults = scored.slice(0, limit).map(s => s.entry);

    // Update access patterns
    topResults.forEach(entry => {
      entry.accessCount++;
      entry.lastAccessed = new Date();
      this.updateFrequencyIndex(entry);
    });

    // Log access pattern
    this.accessPatterns.push({
      query: JSON.stringify(query),
      result: topResults[0]?.id || 'none',
      success: topResults.length > 0,
      timestamp: new Date(),
      durationMs: Date.now() - startTime
    });

    return topResults;
  }

  /**
   * Smart retrieval score
   * Combines: recency, frequency, success rate
   */
  private calculateRetrievalScore(entry: MemoryEntry): number {
    const now = Date.now();
    const age = now - entry.timestamp.getTime();
    const lastAccessAge = now - entry.lastAccessed.getTime();

    // Recency score (exponential decay, half-life = 7 days)
    const recencyScore = Math.exp(-age / (7 * 24 * 60 * 60 * 1000));

    // Frequency score (logarithmic - diminishing returns)
    const frequencyScore = Math.log(entry.accessCount + 1) / Math.log(100);

    // Recent usage boost
    const recentUseBoost = Math.exp(-lastAccessAge / (24 * 60 * 60 * 1000));

    // Success rate (linear)
    const successScore = entry.successRate;

    // Weighted combination
    return (
      recencyScore * 0.3 +
      frequencyScore * 0.3 +
      recentUseBoost * 0.2 +
      successScore * 0.2
    );
  }

  /**
   * Get candidates matching query
   */
  private getCandidates(query: {
    type?: MemoryEntry['type'];
    tags?: string[];
    minSuccessRate?: number;
  }): MemoryEntry[] {
    let candidates: MemoryEntry[] = [];

    // Start with tag-based lookup (fastest)
    if (query.tags && query.tags.length > 0) {
      const taggedIds = new Set<string>();
      query.tags.forEach(tag => {
        const ids = this.frequencyIndex.get(tag) || [];
        ids.forEach(id => taggedIds.add(id));
      });
      candidates = Array.from(taggedIds).map(id => this.memory.get(id)!).filter(Boolean);
    } else {
      // Fall back to chronological (still fast)
      candidates = this.chronoIndex.map(id => this.memory.get(id)!).filter(Boolean);
    }

    // Filter by type
    if (query.type) {
      candidates = candidates.filter(e => e.type === query.type);
    }

    // Filter by success rate
    if (query.minSuccessRate !== undefined) {
      candidates = candidates.filter(e => e.successRate >= query.minSuccessRate);
    }

    return candidates;
  }

  /**
   * Update frequency index for fast tag-based lookup
   */
  private updateFrequencyIndex(entry: MemoryEntry): void {
    entry.tags.forEach(tag => {
      if (!this.frequencyIndex.has(tag)) {
        this.frequencyIndex.set(tag, []);
      }

      const taggedIds = this.frequencyIndex.get(tag)!;

      // Remove if exists
      const index = taggedIds.indexOf(entry.id);
      if (index > -1) {
        taggedIds.splice(index, 1);
      }

      // Add back
      taggedIds.push(entry.id);

      // Sort by access count (most used first)
      taggedIds.sort((a, b) => {
        const entryA = this.memory.get(a)!;
        const entryB = this.memory.get(b)!;
        return entryB.accessCount - entryA.accessCount;
      });
    });
  }

  /**
   * Update success rate based on feedback
   */
  updateSuccess(id: string, success: boolean): void {
    const entry = this.memory.get(id);
    if (!entry) return;

    // Exponential moving average
    const alpha = 0.2;  // Weight for new observation
    entry.successRate = alpha * (success ? 1 : 0) + (1 - alpha) * entry.successRate;
  }

  /**
   * Get access pattern analytics
   */
  getAccessPatterns(lastNDays: number = 7): {
    totalAccesses: number;
    avgResponseTime: number;
    successRate: number;
    topQueries: Array<{ query: string; count: number }>;
  } {
    const cutoff = Date.now() - lastNDays * 24 * 60 * 60 * 1000;
    const recentPatterns = this.accessPatterns.filter(p => p.timestamp.getTime() > cutoff);

    const totalAccesses = recentPatterns.length;
    const avgResponseTime = recentPatterns.reduce((sum, p) => sum + p.durationMs, 0) / totalAccesses;
    const successRate = recentPatterns.filter(p => p.success).length / totalAccesses;

    // Count query frequencies
    const queryCount = new Map<string, number>();
    recentPatterns.forEach(p => {
      queryCount.set(p.query, (queryCount.get(p.query) || 0) + 1);
    });

    const topQueries = Array.from(queryCount.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalAccesses,
      avgResponseTime,
      successRate,
      topQueries
    };
  }

  /**
   * Predict what user might need next (based on patterns)
   */
  predictNext(recentQueries: string[]): MemoryEntry[] {
    // Analyze recent query patterns
    const recentTags = new Set<string>();

    recentQueries.forEach(query => {
      try {
        const parsed = JSON.parse(query);
        if (parsed.tags) {
          parsed.tags.forEach((tag: string) => recentTags.add(tag));
        }
      } catch {
        // Ignore parse errors
      }
    });

    // Find entries with similar tags
    return this.retrieve({
      tags: Array.from(recentTags),
      limit: 5
    });
  }

  /**
   * Clean up old, unused entries
   */
  cleanup(maxAge: number = 90, minAccessCount: number = 1): number {
    const cutoff = Date.now() - maxAge * 24 * 60 * 60 * 1000;
    let removed = 0;

    this.chronoIndex = this.chronoIndex.filter(id => {
      const entry = this.memory.get(id)!;

      // Keep if recent OR frequently accessed OR high success rate
      const keep =
        entry.timestamp.getTime() > cutoff ||
        entry.accessCount >= minAccessCount ||
        entry.successRate > 0.8;

      if (!keep) {
        this.memory.delete(id);
        removed++;
      }

      return keep;
    });

    // Rebuild frequency index
    this.frequencyIndex.clear();
    this.memory.forEach(entry => this.updateFrequencyIndex(entry));

    return removed;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `mem-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Get memory statistics
   */
  getStats() {
    return {
      totalEntries: this.memory.size,
      totalAccesses: this.accessPatterns.length,
      avgAccessesPerEntry:
        Array.from(this.memory.values()).reduce((sum, e) => sum + e.accessCount, 0) / this.memory.size,
      avgSuccessRate:
        Array.from(this.memory.values()).reduce((sum, e) => sum + e.successRate, 0) / this.memory.size
    };
  }
}
