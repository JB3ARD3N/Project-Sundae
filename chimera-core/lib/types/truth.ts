/**
 * Truth Engine Types
 *
 * Type definitions for the Truth Engine - Chimera's foundation
 */

export interface TruthVerification {
  claim: string;
  confidence: number;              // 0-1
  sources: string[];               // Where evidence came from
  contradictions: Contradiction[]; // Conflicting information
  verdict: TruthVerdict;
  reasoning: string;              // Why we're confident/uncertain
  timestamp: Date;
  verificationDuration: number;   // ms
}

export type TruthVerdict =
  | 'true'           // confidence >= 0.9
  | 'likely_true'    // confidence >= 0.7
  | 'uncertain'      // confidence >= 0.3
  | 'likely_false'   // confidence >= 0.1
  | 'false';         // confidence < 0.1

export interface Evidence {
  source: string;
  statement: string;
  supportsClaim: boolean;
  sourceReliability: number;  // 0-1
  relevance: number;          // 0-1
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface Contradiction {
  statement: string;
  conflictingWith: string;
  severity: number;  // 0-1
  explanation: string;
}

export interface TruthEngineConfig {
  minConfidenceThreshold: number;    // Default 0.5
  minSourcesRequired: number;         // Default 2
  contradictionPenalty: number;       // Default 0.15
  timeoutMs: number;                  // Default 5000
  enableWebSearch: boolean;           // Default true
  enableHistoricalData: boolean;      // Default true
}
