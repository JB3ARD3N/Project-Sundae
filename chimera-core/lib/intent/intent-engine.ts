/**
 * INTENT ENGINE - Layer 0: The Foundation
 *
 * "We gotta be the best at first figuring out INTENT"
 *
 * Before Truth, before anything - understand what the user actually wants.
 *
 * Features:
 * - Parse input (voice, text, code)
 * - Classify intent type
 * - Extract parameters
 * - Detect ambiguity
 * - Request clarification when needed
 * - Output validated intent objects
 */

export interface Intent {
  id: string;
  raw: string;  // Original input
  type: IntentType;
  action: string;  // What to do
  parameters: Record<string, any>;
  context: {
    previousIntents: string[];
    environment: string;  // 'cli' | 'voice' | 'api' | 'dashboard'
    timestamp: Date;
  };
  confidence: number;  // 0-1
  ambiguity: AmbiguityLevel;
  clarifications?: ClarificationQuestion[];
  validated: boolean;
}

export type IntentType =
  | 'create'           // Create new project/component
  | 'add'              // Add component to existing
  | 'modify'           // Modify existing code
  | 'query'            // Ask question
  | 'execute'          // Run command
  | 'validate'         // Validate idea/implementation
  | 'report'           // Generate report
  | 'approve'          // Approve pending item
  | 'configure'        // Change settings
  | 'unknown';         // Unclear intent

export type AmbiguityLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

export interface ClarificationQuestion {
  question: string;
  field: string;
  options?: string[];
  required: boolean;
  defaultValue?: any;
}

export interface IntentPattern {
  pattern: RegExp;
  type: IntentType;
  extractor: (match: RegExpMatchArray) => Partial<Intent>;
  confidence: number;
}

export class IntentEngine {
  private patterns: IntentPattern[];
  private contextHistory: Intent[];
  private maxContextHistory: number = 10;

  constructor() {
    this.patterns = [];
    this.contextHistory = [];
    this.initializePatterns();
  }

  /**
   * Parse input and extract intent
   */
  async parse(
    input: string,
    environment: Intent['context']['environment'] = 'cli'
  ): Promise<Intent> {
    const raw = input.trim();
    const id = this.generateId();

    // Try to match against known patterns
    let bestMatch: {
      pattern: IntentPattern;
      match: RegExpMatchArray;
      confidence: number;
    } | null = null;

    for (const pattern of this.patterns) {
      const match = raw.match(pattern.pattern);
      if (match) {
        const confidence = this.calculatePatternConfidence(pattern, match, raw);
        if (!bestMatch || confidence > bestMatch.confidence) {
          bestMatch = { pattern, match, confidence };
        }
      }
    }

    if (bestMatch) {
      // Extract intent from pattern
      const extracted = bestMatch.pattern.extractor(bestMatch.match);

      const intent: Intent = {
        id,
        raw,
        type: extracted.type || bestMatch.pattern.type,
        action: extracted.action || '',
        parameters: extracted.parameters || {},
        context: {
          previousIntents: this.contextHistory.slice(-5).map(i => i.id),
          environment,
          timestamp: new Date()
        },
        confidence: bestMatch.confidence,
        ambiguity: this.detectAmbiguity(bestMatch.confidence, extracted.parameters || {}),
        validated: false
      };

      // Check for ambiguity
      intent.clarifications = this.generateClarifications(intent);

      // Validate if high confidence and no ambiguity
      if (intent.confidence > 0.85 && intent.ambiguity === 'none') {
        intent.validated = true;
      }

      this.contextHistory.push(intent);
      return intent;
    }

    // No pattern match - unknown intent
    const intent: Intent = {
      id,
      raw,
      type: 'unknown',
      action: 'clarify',
      parameters: {},
      context: {
        previousIntents: this.contextHistory.slice(-5).map(i => i.id),
        environment,
        timestamp: new Date()
      },
      confidence: 0.1,
      ambiguity: 'critical',
      clarifications: [
        {
          question: 'I didn\'t understand. Can you rephrase or be more specific?',
          field: 'intent',
          required: true
        }
      ],
      validated: false
    };

    this.contextHistory.push(intent);
    return intent;
  }

  /**
   * Validate intent with additional information
   */
  validate(intent: Intent, clarifications: Record<string, any>): Intent {
    // Apply clarifications
    Object.entries(clarifications).forEach(([key, value]) => {
      intent.parameters[key] = value;
    });

    // Recalculate confidence
    const parameterCount = Object.keys(intent.parameters).length;
    const requiredParams = intent.clarifications?.filter(c => c.required).length || 0;

    if (parameterCount >= requiredParams) {
      intent.confidence = Math.min(intent.confidence + 0.2, 0.95);
      intent.ambiguity = this.detectAmbiguity(intent.confidence, intent.parameters);
      intent.clarifications = this.generateClarifications(intent);
    }

    // Validate if high confidence
    if (intent.confidence > 0.85 && intent.ambiguity === 'none') {
      intent.validated = true;
    }

    return intent;
  }

  /**
   * Initialize intent patterns
   */
  private initializePatterns(): void {
    this.patterns = [
      // CREATE patterns
      {
        pattern: /create\s+(?:a\s+)?(.+?)\s+(?:project|app|system|tool)(?:\s+(?:with|using|for)\s+(.+))?/i,
        type: 'create',
        confidence: 0.9,
        extractor: (match) => ({
          type: 'create',
          action: 'create-project',
          parameters: {
            projectType: match[1].trim(),
            requirements: match[2]?.trim() || ''
          }
        })
      },
      {
        pattern: /create\s+project\s+(.+)/i,
        type: 'create',
        confidence: 0.85,
        extractor: (match) => ({
          type: 'create',
          action: 'create-project',
          parameters: {
            name: match[1].trim()
          }
        })
      },

      // ADD patterns
      {
        pattern: /add\s+(.+?)\s+to\s+(.+)/i,
        type: 'add',
        confidence: 0.9,
        extractor: (match) => ({
          type: 'add',
          action: 'add-component',
          parameters: {
            component: match[1].trim(),
            target: match[2].trim()
          }
        })
      },
      {
        pattern: /add\s+(truth-engine|voice-system|agent-mesh|cost-optimizer|security-fortress)/i,
        type: 'add',
        confidence: 0.95,
        extractor: (match) => ({
          type: 'add',
          action: 'add-component',
          parameters: {
            component: match[1].trim()
          }
        })
      },

      // VALIDATE patterns
      {
        pattern: /(?:validate|verify|check)\s+(.+)/i,
        type: 'validate',
        confidence: 0.85,
        extractor: (match) => ({
          type: 'validate',
          action: 'validate-idea',
          parameters: {
            subject: match[1].trim()
          }
        })
      },

      // QUERY patterns
      {
        pattern: /(?:what|how|why|when|where|who)\s+(.+)/i,
        type: 'query',
        confidence: 0.75,
        extractor: (match) => ({
          type: 'query',
          action: 'answer-question',
          parameters: {
            question: match[0].trim()
          }
        })
      },

      // EXECUTE patterns
      {
        pattern: /(?:run|execute|start)\s+(.+)/i,
        type: 'execute',
        confidence: 0.8,
        extractor: (match) => ({
          type: 'execute',
          action: 'run-command',
          parameters: {
            command: match[1].trim()
          }
        })
      },

      // REPORT patterns
      {
        pattern: /(?:show|generate|get)\s+(?:me\s+)?(?:a\s+)?(?:daily\s+)?report/i,
        type: 'report',
        confidence: 0.95,
        extractor: (match) => ({
          type: 'report',
          action: 'generate-report',
          parameters: {
            reportType: 'daily'
          }
        })
      },

      // APPROVE patterns
      {
        pattern: /approve\s+(.+)/i,
        type: 'approve',
        confidence: 0.9,
        extractor: (match) => ({
          type: 'approve',
          action: 'approve-item',
          parameters: {
            item: match[1].trim()
          }
        })
      },

      // CONFIGURE patterns
      {
        pattern: /(?:set|configure|change)\s+(.+?)\s+to\s+(.+)/i,
        type: 'configure',
        confidence: 0.85,
        extractor: (match) => ({
          type: 'configure',
          action: 'update-config',
          parameters: {
            setting: match[1].trim(),
            value: match[2].trim()
          }
        })
      }
    ];
  }

  /**
   * Calculate confidence for pattern match
   */
  private calculatePatternConfidence(
    pattern: IntentPattern,
    match: RegExpMatchArray,
    raw: string
  ): number {
    let confidence = pattern.confidence;

    // Boost confidence for exact matches
    if (match[0].length === raw.length) {
      confidence += 0.05;
    }

    // Boost for context continuity
    if (this.contextHistory.length > 0) {
      const lastIntent = this.contextHistory[this.contextHistory.length - 1];
      if (lastIntent.type === pattern.type) {
        confidence += 0.03;  // Same type of intent
      }
    }

    // Penalty for very long inputs (likely complex/ambiguous)
    if (raw.length > 200) {
      confidence -= 0.1;
    }

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Detect ambiguity level
   */
  private detectAmbiguity(
    confidence: number,
    parameters: Record<string, any>
  ): AmbiguityLevel {
    if (confidence > 0.9 && Object.keys(parameters).length >= 2) {
      return 'none';
    }
    if (confidence > 0.8 && Object.keys(parameters).length >= 1) {
      return 'low';
    }
    if (confidence > 0.6) {
      return 'medium';
    }
    if (confidence > 0.3) {
      return 'high';
    }
    return 'critical';
  }

  /**
   * Generate clarification questions
   */
  private generateClarifications(intent: Intent): ClarificationQuestion[] {
    const clarifications: ClarificationQuestion[] = [];

    // Type-specific clarifications
    switch (intent.type) {
      case 'create':
        if (!intent.parameters.template) {
          clarifications.push({
            question: 'Which template? (voice-startup, ai-content, electron-os, saas-platform, custom)',
            field: 'template',
            options: ['voice-startup', 'ai-content', 'electron-os', 'saas-platform', 'custom'],
            required: false,
            defaultValue: 'custom'
          });
        }
        if (!intent.parameters.name) {
          clarifications.push({
            question: 'What should I name this project?',
            field: 'name',
            required: true
          });
        }
        break;

      case 'add':
        if (!intent.parameters.component) {
          clarifications.push({
            question: 'Which component? (truth-engine, voice-system, agent-mesh, cost-optimizer, security-fortress)',
            field: 'component',
            options: ['truth-engine', 'voice-system', 'agent-mesh', 'cost-optimizer', 'security-fortress'],
            required: true
          });
        }
        break;

      case 'validate':
        if (!intent.parameters.category) {
          clarifications.push({
            question: 'What category? (feature, optimization, security, automation, infrastructure)',
            field: 'category',
            options: ['feature', 'optimization', 'security', 'automation', 'infrastructure'],
            required: false,
            defaultValue: 'feature'
          });
        }
        if (!intent.parameters.estimatedValue) {
          clarifications.push({
            question: 'Estimated value in dollars? (helps prioritize)',
            field: 'estimatedValue',
            required: false,
            defaultValue: 0
          });
        }
        break;
    }

    return clarifications;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `intent-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Get intent statistics
   */
  getStats() {
    const typeCount: Record<string, number> = {};
    this.contextHistory.forEach(intent => {
      typeCount[intent.type] = (typeCount[intent.type] || 0) + 1;
    });

    const avgConfidence = this.contextHistory.length > 0
      ? this.contextHistory.reduce((sum, i) => sum + i.confidence, 0) / this.contextHistory.length
      : 0;

    return {
      totalIntents: this.contextHistory.length,
      byType: typeCount,
      avgConfidence,
      validatedRate: this.contextHistory.filter(i => i.validated).length / this.contextHistory.length
    };
  }
}
