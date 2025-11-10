import { aiRouter } from './ai-router';
import { aiClients } from './ai-clients';

export class ForgeProcessor {
  async process(input: string, userTier: 'base' | 'personal' | 'pro' = 'base') {
    const complexity = this.estimateComplexity(input);
    const routing = aiRouter.route('fragment', 3, userTier);
    
    let fragments: string[] = [];
    try {
      const fragmentResponse = await aiClients.callAI(
        routing.provider,
        `Break into 2-4hr microparts: "${input}". Return ONLY JSON array.`
      );
      fragments = JSON.parse(
        fragmentResponse.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      );
    } catch {
      fragments = [input];
    }

    const codeBlocks: string[] = [];
    let totalCost = routing.estimatedCost;

    for (const fragment of fragments) {
      const codeRouting = aiRouter.route(fragment, complexity, userTier);
      try {
        const codeResponse = await aiClients.callAI(
          codeRouting.provider,
          `Generate TypeScript/React code for: "${fragment}". Context: Next.js 14, Tailwind, Supabase. Return ONLY code.`
        );
        codeBlocks.push(codeResponse.text);
        totalCost += codeResponse.cost;
        aiRouter.recordUsage(codeRouting.provider, codeResponse.cost);
      } catch {
        codeBlocks.push(`// TODO: ${fragment}`);
      }
    }

    return {
      fragments,
      code: codeBlocks,
      handoff: `Built: ${input}\nCost: $${totalCost.toFixed(4)}`,
      totalCost
    };
  }

  private estimateComplexity(input: string): number {
    let score = 5;
    const lower = input.toLowerCase();
    ['button', 'text', 'display'].forEach(k => lower.includes(k) && (score -= 1));
    ['auth', 'database', 'system'].forEach(k => lower.includes(k) && (score += 2));
    return Math.max(1, Math.min(10, score));
  }
}

export const forgeProcessor = new ForgeProcessor();
