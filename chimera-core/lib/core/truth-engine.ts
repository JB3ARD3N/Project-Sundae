/**
 * TRUTH ENGINE - The Foundation of Chimera
 *
 * Every query, decision, and output flows through here.
 * Principle: Verify truth BEFORE action.
 *
 * This is the smallest perfect part.
 */

import type {
  TruthVerification,
  TruthVerdict,
  Evidence,
  Contradiction,
  TruthEngineConfig
} from '../types/truth';

export class TruthEngine {
  private config: TruthEngineConfig;
  private verificationHistory: TruthVerification[] = [];
  private knowledgeBase: Map<string, Evidence[]> = new Map();

  constructor(config?: Partial<TruthEngineConfig>) {
    this.config = {
      minConfidenceThreshold: 0.5,
      minSourcesRequired: 2,
      contradictionPenalty: 0.15,
      timeoutMs: 5000,
      enableWebSearch: true,
      enableHistoricalData: true,
      ...config
    };
  }

  /**
   * THE CORE FUNCTION
   *
   * Verify truth of ANY claim
   * This is the atomic unit - everything builds on this
   */
  async verify(claim: string): Promise<TruthVerification> {
    const startTime = Date.now();

    try {
      // STEP 1: Gather evidence from multiple sources
      const evidence = await this.gatherEvidence(claim);

      // STEP 2: Find contradictions in the evidence
      const contradictions = await this.findContradictions(evidence);

      // STEP 3: Calculate confidence based on evidence quality
      const confidence = this.calculateConfidence(evidence, contradictions);

      // STEP 4: Make verdict based on confidence
      const verdict = this.makeVerdict(confidence);

      // STEP 5: Explain our reasoning
      const reasoning = this.explainReasoning(evidence, contradictions, confidence);

      const verification: TruthVerification = {
        claim,
        confidence,
        sources: evidence.map(e => e.source),
        contradictions,
        verdict,
        reasoning,
        timestamp: new Date(),
        verificationDuration: Date.now() - startTime
      };

      // Record for learning
      this.verificationHistory.push(verification);

      // Store in knowledge base for future queries
      this.knowledgeBase.set(claim, evidence);

      return verification;

    } catch (error) {
      // If verification fails, return uncertain
      return {
        claim,
        confidence: 0.5,
        sources: [],
        contradictions: [],
        verdict: 'uncertain',
        reasoning: `Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        verificationDuration: Date.now() - startTime
      };
    }
  }

  /**
   * Gather evidence from multiple sources
   */
  private async gatherEvidence(claim: string): Promise<Evidence[]> {
    const evidencePromises: Promise<Evidence[]>[] = [];

    // 1. Check knowledge base (cached)
    evidencePromises.push(this.searchKnowledgeBase(claim));

    // 2. Search historical verification data
    if (this.config.enableHistoricalData) {
      evidencePromises.push(this.searchHistoricalData(claim));
    }

    // 3. Web search (if enabled and needed)
    if (this.config.enableWebSearch) {
      evidencePromises.push(this.searchWeb(claim));
    }

    // 4. Consult expert agents (when we have them)
    // evidencePromises.push(this.consultExperts(claim));

    // Gather all evidence concurrently
    const results = await Promise.all(evidencePromises);
    return results.flat();
  }

  /**
   * Find contradictions in evidence
   */
  private async findContradictions(evidence: Evidence[]): Promise<Contradiction[]> {
    const contradictions: Contradiction[] = [];

    // Compare each piece of evidence against others
    for (let i = 0; i < evidence.length; i++) {
      for (let j = i + 1; j < evidence.length; j++) {
        const e1 = evidence[i];
        const e2 = evidence[j];

        // If both are relevant but contradict each other
        if (e1.relevance > 0.5 && e2.relevance > 0.5) {
          if (e1.supportsClaim !== e2.supportsClaim) {
            // They disagree - record contradiction
            contradictions.push({
              statement: e1.statement,
              conflictingWith: e2.statement,
              severity: Math.min(e1.sourceReliability, e2.sourceReliability),
              explanation: `Source "${e1.source}" ${e1.supportsClaim ? 'supports' : 'opposes'} the claim, while "${e2.source}" ${e2.supportsClaim ? 'supports' : 'opposes'} it.`
            });
          }
        }
      }
    }

    return contradictions;
  }

  /**
   * Calculate confidence using Bayesian approach
   */
  private calculateConfidence(
    evidence: Evidence[],
    contradictions: Contradiction[]
  ): number {
    if (evidence.length === 0) {
      return 0.5; // No evidence = uncertain
    }

    // Start with prior (neutral)
    let confidence = 0.5;

    // Update based on evidence quality
    evidence.forEach(e => {
      // Weight = reliability × relevance
      const weight = e.sourceReliability * e.relevance;

      // Supporting evidence increases confidence, opposing decreases
      const delta = (e.supportsClaim ? weight : -weight) * 0.1;
      confidence += delta;
    });

    // Penalize for contradictions
    const contradictionPenalty =
      contradictions.length * this.config.contradictionPenalty;
    confidence -= contradictionPenalty;

    // Bound between 0 and 1
    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Make verdict based on confidence score
   */
  private makeVerdict(confidence: number): TruthVerdict {
    if (confidence >= 0.9) return 'true';
    if (confidence >= 0.7) return 'likely_true';
    if (confidence >= 0.3) return 'uncertain';
    if (confidence >= 0.1) return 'likely_false';
    return 'false';
  }

  /**
   * Explain our reasoning
   */
  private explainReasoning(
    evidence: Evidence[],
    contradictions: Contradiction[],
    confidence: number
  ): string {
    const parts: string[] = [];

    // Summarize evidence
    const supporting = evidence.filter(e => e.supportsClaim).length;
    const opposing = evidence.filter(e => !e.supportsClaim).length;

    if (evidence.length > 0) {
      parts.push(
        `Analyzed ${evidence.length} piece(s) of evidence: ${supporting} supporting, ${opposing} opposing.`
      );
    }

    // Mention contradictions
    if (contradictions.length > 0) {
      parts.push(
        `Detected ${contradictions.length} contradiction(s) in the evidence.`
      );
    }

    // Confidence explanation
    parts.push(
      `Confidence: ${(confidence * 100).toFixed(1)}% based on source reliability and consistency.`
    );

    // Add verdict context
    if (confidence >= 0.9) {
      parts.push('High confidence - evidence strongly supports this claim.');
    } else if (confidence >= 0.7) {
      parts.push('Moderate confidence - evidence generally supports this claim.');
    } else if (confidence >= 0.3) {
      parts.push('Uncertain - evidence is mixed or insufficient.');
    } else {
      parts.push('Low confidence - evidence generally opposes this claim.');
    }

    return parts.join(' ');
  }

  /**
   * Evidence gathering methods
   */

  private async searchKnowledgeBase(claim: string): Promise<Evidence[]> {
    // Check if we've verified this exact claim before
    const cached = this.knowledgeBase.get(claim);
    if (cached) {
      return cached.map(e => ({
        ...e,
        timestamp: new Date() // Update timestamp
      }));
    }

    // Check for similar claims (simple string matching for now)
    const similar: Evidence[] = [];
    for (const [cachedClaim, cachedEvidence] of this.knowledgeBase.entries()) {
      if (this.similarity(claim, cachedClaim) > 0.8) {
        similar.push(...cachedEvidence);
      }
    }

    return similar;
  }

  private async searchHistoricalData(claim: string): Promise<Evidence[]> {
    // Search through previous verifications
    const relevant = this.verificationHistory.filter(v =>
      this.similarity(v.claim, claim) > 0.7
    );

    return relevant.map(v => ({
      source: 'Historical Verification',
      statement: v.claim,
      supportsClaim: v.verdict === 'true' || v.verdict === 'likely_true',
      sourceReliability: v.confidence,
      relevance: this.similarity(v.claim, claim),
      timestamp: v.timestamp
    }));
  }

  private async searchWeb(claim: string): Promise<Evidence[]> {
    // TODO: Implement actual web search
    // For now, return empty (will integrate in next phase)
    return [];
  }

  private async consultExperts(claim: string): Promise<Evidence[]> {
    // TODO: Query expert agents when we have them
    return [];
  }

  /**
   * Utility: Calculate string similarity
   * (Simplified - use proper NLP in production)
   */
  private similarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();

    // Exact match
    if (s1 === s2) return 1.0;

    // Contains
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;

    // Word overlap
    const words1 = new Set(s1.split(/\s+/));
    const words2 = new Set(s2.split(/\s+/));

    const intersection = new Set(
      [...words1].filter(w => words2.has(w))
    );

    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
  }

  /**
   * Get verification statistics
   */
  getStats() {
    const total = this.verificationHistory.length;
    if (total === 0) {
      return {
        totalVerifications: 0,
        avgConfidence: 0,
        avgDuration: 0,
        verdictDistribution: {}
      };
    }

    const avgConfidence =
      this.verificationHistory.reduce((sum, v) => sum + v.confidence, 0) / total;

    const avgDuration =
      this.verificationHistory.reduce((sum, v) => sum + v.verificationDuration, 0) / total;

    const verdictDistribution = this.verificationHistory.reduce(
      (dist, v) => {
        dist[v.verdict] = (dist[v.verdict] || 0) + 1;
        return dist;
      },
      {} as Record<TruthVerdict, number>
    );

    return {
      totalVerifications: total,
      avgConfidence: Number(avgConfidence.toFixed(3)),
      avgDuration: Number(avgDuration.toFixed(2)),
      verdictDistribution
    };
  }

  /**
   * Clear history (for testing)
   */
  clearHistory() {
    this.verificationHistory = [];
    this.knowledgeBase.clear();
  }
}

// Export singleton
export const truthEngine = new TruthEngine();
