/**
 * Apollo Competitive Intelligence Module
 *
 * Strategic principle: Find what competitors do that people DON'T like,
 * and systematically build the opposite.
 *
 * Philosophy: Study 1-star reviews, not 5-star reviews. Pain points reveal
 * opportunities. Every complaint is a feature request.
 */

interface PainPoint {
  description: string;
  source: string;
  frequency: 'low' | 'medium' | 'high';
  severity: number; // 1-10
  competitor: string;
  our_counter_strategy: string;
  status: 'identified' | 'planned' | 'building' | 'built';
  date_discovered: Date;
  user_quotes?: string[];
}

interface CompetitorAnalysis {
  competitor: string;
  pain_points: PainPoint[];
  our_advantages: string[];
  last_updated: Date;
}

interface ResearchSource {
  name: string;
  url: string;
  query_pattern: string;
  check_frequency: 'daily' | 'weekly' | 'monthly';
}

/**
 * Apollo's Core Values and Strategic Memory
 */
export const APOLLO_CORE_MEMORY = {
  creator_values: {
    speed_AND_quality: "Flow at high speed WITHOUT sacrificing quality - both matter",
    mission_over_metrics: "Mission > metrics, always. Period.",
    everybody_eats: "Non-negotiable. Build it into the architecture.",
    logic_required: "Make it make sense - if it doesn't, it's an error",
    solvability: "Everything is solvable. Find the path.",
    time_flexibility: "More work or time is fine if it doesn't cause problems"
  },

  competitive_strategy: {
    principle: "Find what competitors do that people DON'T like",
    action: "Put those pain points into 'dont do' or 'possible changes' category",
    methodology: [
      "Study competitor reviews (1-star reviews tell the truth)",
      "Track user complaints on Reddit, Twitter, Discord",
      "Monitor support forums for recurring issues",
      "Identify dark patterns, extraction tactics, hidden costs",
      "Note what users say they WISH the product did differently"
    ],
    implementation: "Build the opposite - be what they're NOT",
    examples: [
      "They extract → We distribute (Everybody Eats)",
      "They replace humans → We augment",
      "They hide costs → We show exact routing/costs",
      "They lock in → We stay modular/portable",
      "They centralize → We decentralize where possible"
    ]
  },

  strategic_approach: {
    before_building: "Ensure logic is sound - confusion = error",
    problem_solving: "No unsolvable problems, only undiscovered solutions",
    resource_allocation: "Time/work investment OK when necessary",
    quality_gate: "Speed yes, but never at expense of soundness",
    differentiation: "What do users hate? Build the opposite."
  }
};

/**
 * Research Sources - Where to find competitor pain points
 */
export const RESEARCH_SOURCES: ResearchSource[] = [
  {
    name: 'Reddit ChatGPT Controversial',
    url: 'reddit.com/r/ChatGPT/controversial',
    query_pattern: 'Sort by controversial, look for recurring themes',
    check_frequency: 'weekly'
  },
  {
    name: 'Reddit Claude Problems',
    url: 'reddit.com/r/ClaudeAI/search?q=problem',
    query_pattern: 'Search "problem", "issue", "broken", "frustrating"',
    check_frequency: 'weekly'
  },
  {
    name: 'Twitter OpenAI Complaints',
    url: 'twitter.com/search?q=openai%20broken',
    query_pattern: 'Search variations: "broken", "sucks", "problem", "worst"',
    check_frequency: 'daily'
  },
  {
    name: 'G2 Low Ratings',
    url: 'g2.com/products/chatgpt/reviews?rating=1-2',
    query_pattern: 'Filter by 1-2 star reviews, extract pain points',
    check_frequency: 'monthly'
  },
  {
    name: 'HackerNews Issues',
    url: 'news.ycombinator.com/search?q=claude%20issues',
    query_pattern: 'Search "[competitor] issues", "Ask HN: What\'s wrong with"',
    check_frequency: 'weekly'
  },
  {
    name: 'Product Hunt Comments',
    url: 'producthunt.com/products/[competitor]/reviews',
    query_pattern: 'Read negative comments, extract constructive criticism',
    check_frequency: 'monthly'
  }
];

/**
 * Competitive Intelligence Tracker
 * Maintains living document of competitor pain points
 */
export class CompetitiveIntelligence {
  private painPoints: PainPoint[] = [];
  private analyses: Map<string, CompetitorAnalysis> = new Map();

  constructor() {
    // Initialize with known pain points already addressed
    this.initializeBuiltCounterStrategies();
  }

  /**
   * Pain points we've already identified and built counter-strategies for
   */
  private initializeBuiltCounterStrategies() {
    const built: PainPoint[] = [
      {
        description: "Hidden API costs - users don't know what they're paying until bill arrives",
        source: "Reddit r/ChatGPT",
        frequency: 'high',
        severity: 9,
        competitor: 'OpenAI',
        our_counter_strategy: "Show exact routing + cost BEFORE execution. 100% transparency.",
        status: 'built',
        date_discovered: new Date('2024-01-15'),
        user_quotes: [
          "I got charged $200 and had no idea it was coming",
          "Wish I could see costs before running queries"
        ]
      },
      {
        description: "Rate limits hit without warning, breaks workflows",
        source: "Twitter",
        frequency: 'medium',
        severity: 7,
        competitor: 'Multiple',
        our_counter_strategy: "Queue requests intelligently, never hard reject. Graceful degradation.",
        status: 'built',
        date_discovered: new Date('2024-02-01'),
        user_quotes: [
          "Rate limited again, lost my entire context",
          "Why can't it just queue instead of failing?"
        ]
      },
      {
        description: "Context gets lost between sessions - no memory",
        source: "HackerNews",
        frequency: 'high',
        severity: 8,
        competitor: 'Multiple',
        our_counter_strategy: "Context Vault + Memory System. Never forget unless told to.",
        status: 'built',
        date_discovered: new Date('2024-01-20'),
        user_quotes: [
          "Have to re-explain my project every single time",
          "It's like talking to someone with amnesia"
        ]
      },
      {
        description: "Vendor lock-in - can't export data or switch providers easily",
        source: 'G2 Reviews',
        frequency: 'medium',
        severity: 6,
        competitor: 'Multiple',
        our_counter_strategy: "Export everything. Modular architecture. Provider-agnostic.",
        status: 'planned',
        date_discovered: new Date('2024-02-10'),
        user_quotes: [
          "Stuck with them because migrating is impossible",
          "All my data is trapped in their format"
        ]
      },
      {
        description: "Poor mobile experience - desktop-only thinking",
        source: 'App Store Reviews',
        frequency: 'low',
        severity: 5,
        competitor: 'Multiple',
        our_counter_strategy: "Responsive Tailwind design. Mobile-first where it matters.",
        status: 'built',
        date_discovered: new Date('2024-01-25')
      }
    ];

    this.painPoints.push(...built);
  }

  /**
   * Add a newly discovered pain point
   */
  addPainPoint(painPoint: Omit<PainPoint, 'date_discovered'>) {
    this.painPoints.push({
      ...painPoint,
      date_discovered: new Date()
    });
  }

  /**
   * Get pain points by severity threshold
   */
  getHighSeverityPainPoints(minSeverity: number = 7): PainPoint[] {
    return this.painPoints.filter(p => p.severity >= minSeverity);
  }

  /**
   * Get unaddressed pain points (not yet built)
   */
  getOpportunities(): PainPoint[] {
    return this.painPoints.filter(p =>
      p.status === 'identified' || p.status === 'planned'
    );
  }

  /**
   * Get our competitive advantages (what we've built that they haven't)
   */
  getCompetitiveAdvantages(): string[] {
    return this.painPoints
      .filter(p => p.status === 'built')
      .map(p => p.our_counter_strategy);
  }

  /**
   * Generate "Don't Do" list - patterns to avoid
   */
  getDontDoList(): string[] {
    return this.painPoints
      .filter(p => p.severity >= 5)
      .map(p => p.description);
  }

  /**
   * Weekly research process (to be automated)
   */
  async weeklyResearch(): Promise<{
    dont_do: PainPoint[];
    opportunities: string[];
    updated: Date;
  }> {
    // This is a template for automated scraping
    // In production, would use puppeteer/cheerio to actually scrape sources

    console.log('📊 Running weekly competitive intelligence gathering...');
    console.log('Sources to check:', RESEARCH_SOURCES.length);

    // Placeholder for actual implementation
    const findings: PainPoint[] = [];

    // For each source, would:
    // 1. Scrape content
    // 2. Extract complaints using NLP
    // 3. Categorize by pain point type
    // 4. Rate severity based on frequency + user emotion
    // 5. Design counter-feature

    return {
      dont_do: this.painPoints.filter(p => p.severity > 5),
      opportunities: this.getOpportunities().map(p => p.our_counter_strategy),
      updated: new Date()
    };
  }

  /**
   * Generate feature ideas from pain points
   */
  generateFeatureIdeas(): Array<{ feature: string; why: string; priority: number }> {
    return this.getOpportunities()
      .filter(p => p.severity >= 7)
      .map(p => ({
        feature: p.our_counter_strategy,
        why: `Users complain: "${p.description}"`,
        priority: p.severity
      }))
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Export as tracking sheet (Markdown table)
   */
  exportTrackingSheet(): string {
    const header = `# COMPETITOR PAIN POINTS TRACKER\n\nLast Updated: ${new Date().toISOString()}\n\n`;
    const tableHeader = '| Pain Point | Source | Frequency | Severity | Our Counter-Strategy | Status |\n|------------|--------|-----------|----------|---------------------|--------|\n';

    const rows = this.painPoints.map(p => {
      const statusIcon = {
        'identified': '🔍',
        'planned': '📋',
        'building': '🔨',
        'built': '✅'
      }[p.status];

      return `| ${p.description} | ${p.source} | ${p.frequency} | ${p.severity}/10 | ${p.our_counter_strategy} | ${statusIcon} ${p.status} |`;
    }).join('\n');

    return header + tableHeader + rows;
  }

  /**
   * Check if a proposed feature resembles a competitor pain point
   * (Anti-pattern detection)
   */
  detectAntiPattern(featureDescription: string): {
    isAntiPattern: boolean;
    reason?: string;
    suggestion?: string;
  } {
    // Simple keyword matching - in production would use semantic similarity
    const dontDoPatterns = [
      { keywords: ['hidden', 'surprise', 'unexpected', 'cost'], reason: "Users hate hidden costs", suggestion: "Make pricing transparent upfront" },
      { keywords: ['lock', 'trap', 'vendor', 'export'], reason: "Users hate vendor lock-in", suggestion: "Ensure data portability" },
      { keywords: ['lose', 'forget', 'context', 'memory'], reason: "Users hate losing context", suggestion: "Persist context in vault" },
      { keywords: ['limit', 'restrict', 'quota', 'hard'], reason: "Users hate hard limits", suggestion: "Use soft limits with queuing" },
      { keywords: ['force', 'require', 'must', 'mandatory'], reason: "Users hate forced workflows", suggestion: "Make it optional/flexible" }
    ];

    for (const pattern of dontDoPatterns) {
      const hasMatch = pattern.keywords.some(kw =>
        featureDescription.toLowerCase().includes(kw)
      );

      if (hasMatch) {
        return {
          isAntiPattern: true,
          reason: pattern.reason,
          suggestion: pattern.suggestion
        };
      }
    }

    return { isAntiPattern: false };
  }
}

// Export singleton instance
export const apolloIntel = new CompetitiveIntelligence();
