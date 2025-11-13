/**
 * Intent Engine - Layer 0: Intent Parsing
 * Re-export from chimera-core package
 */

export type IntentType =
  | 'create'
  | 'add'
  | 'modify'
  | 'query'
  | 'execute'
  | 'validate'
  | 'report'
  | 'approve'
  | 'configure'
  | 'unknown';

export interface IntentResult {
  type: IntentType;
  confidence: number;
  entities: Record<string, string>;
  ambiguityLevel: number;
  clarificationNeeded: string | null;
  context: any;
}

export class IntentEngine {
  private patterns: Map<IntentType, RegExp[]> = new Map();
  private contextHistory: any[] = [];

  constructor() {
    this.initializePatterns();
  }

  /**
   * Initialize intent patterns
   */
  private initializePatterns(): void {
    this.patterns.set('create', [
      /\b(create|make|build|generate|new)\b/i,
      /\bstart\s+(a\s+)?new\b/i,
    ]);

    this.patterns.set('add', [
      /\b(add|append|insert|include)\b/i,
      /\bput\s+in\b/i,
    ]);

    this.patterns.set('modify', [
      /\b(modify|change|update|edit|alter)\b/i,
      /\bfix\b/i,
    ]);

    this.patterns.set('query', [
      /\b(what|when|where|who|why|how)\b/i,
      /\b(show|display|list|find|search)\b/i,
      /\?$/,
    ]);

    this.patterns.set('execute', [
      /\b(run|execute|start|launch|deploy)\b/i,
      /\bdo\s+it\b/i,
    ]);

    this.patterns.set('validate', [
      /\b(validate|verify|check|test|confirm)\b/i,
      /\bis\s+this\b/i,
    ]);

    this.patterns.set('report', [
      /\b(report|status|stats|metrics|summary)\b/i,
      /\bhow\s+(is|are)\b/i,
    ]);

    this.patterns.set('approve', [
      /\b(approve|accept|yes|confirm|proceed)\b/i,
      /\b(looks?\s+good|ok|fine)\b/i,
    ]);

    this.patterns.set('configure', [
      /\b(configure|setup|set|adjust|tune)\b/i,
      /\bsettings?\b/i,
    ]);
  }

  /**
   * Parse intent from user input
   */
  async parseIntent(input: string, context?: any): Promise<IntentResult> {
    const inputLower = input.toLowerCase().trim();

    // Store context
    if (context) {
      this.contextHistory.push({
        input,
        context,
        timestamp: new Date().toISOString(),
      });

      // Keep only last 10 contexts
      if (this.contextHistory.length > 10) {
        this.contextHistory.shift();
      }
    }

    // Match against patterns
    const scores = new Map<IntentType, number>();

    for (const [type, patterns] of this.patterns.entries()) {
      let score = 0;
      for (const pattern of patterns) {
        if (pattern.test(inputLower)) {
          score += 0.3;
        }
      }
      if (score > 0) {
        scores.set(type, Math.min(1, score));
      }
    }

    // Find best match
    let bestType: IntentType = 'unknown';
    let bestScore = 0;

    for (const [type, score] of scores.entries()) {
      if (score > bestScore) {
        bestScore = score;
        bestType = type;
      }
    }

    // Boost confidence with context continuity
    if (context && this.contextHistory.length > 1) {
      bestScore = Math.min(1, bestScore + 0.1);
    }

    // Extract entities (simple version)
    const entities = this.extractEntities(input);

    // Determine ambiguity
    const ambiguityLevel = this.calculateAmbiguity(scores);

    // Generate clarification if needed
    const clarificationNeeded = ambiguityLevel > 0.7
      ? this.generateClarification(input, scores)
      : null;

    return {
      type: bestType,
      confidence: bestScore,
      entities,
      ambiguityLevel,
      clarificationNeeded,
      context: context || {},
    };
  }

  /**
   * Extract entities from input
   */
  private extractEntities(input: string): Record<string, string> {
    const entities: Record<string, string> = {};

    // Extract quoted strings
    const quotedMatches = input.match(/"([^"]+)"/g);
    if (quotedMatches) {
      entities.quoted = quotedMatches.map(m => m.slice(1, -1)).join(', ');
    }

    // Extract numbers
    const numbers = input.match(/\b\d+\b/g);
    if (numbers) {
      entities.numbers = numbers.join(', ');
    }

    // Extract file paths
    const paths = input.match(/[\w-]+\.(js|ts|tsx|jsx|py|go|rs|java|cpp|c|h)/gi);
    if (paths) {
      entities.files = paths.join(', ');
    }

    return entities;
  }

  /**
   * Calculate ambiguity level
   */
  private calculateAmbiguity(scores: Map<IntentType, number>): number {
    if (scores.size === 0) return 1.0; // Complete ambiguity
    if (scores.size === 1) return 0.0; // No ambiguity

    // Sort scores
    const sortedScores = Array.from(scores.values()).sort((a, b) => b - a);

    // If top 2 scores are close, high ambiguity
    if (sortedScores.length >= 2) {
      const diff = sortedScores[0] - sortedScores[1];
      return 1 - diff; // Small diff = high ambiguity
    }

    return 0.5;
  }

  /**
   * Generate clarification question
   */
  private generateClarification(input: string, scores: Map<IntentType, number>): string {
    const topIntents = Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([type]) => type);

    if (topIntents.length >= 2) {
      return `Did you want to ${topIntents[0]} or ${topIntents[1]}?`;
    }

    return 'Could you please clarify what you want me to do?';
  }

  /**
   * Get context history
   */
  getHistory(): any[] {
    return [...this.contextHistory];
  }

  /**
   * Clear context history
   */
  clearHistory(): void {
    this.contextHistory = [];
  }
}
