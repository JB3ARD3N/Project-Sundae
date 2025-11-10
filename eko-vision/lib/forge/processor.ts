import { aiRouter } from './ai-router';
import { aiClients } from './ai-clients';

interface ProcessResult {
  fragments: string[];
  code: string[];
  handoff: string;
  totalCost: number;
}

export class ForgeProcessor {
  async process(input: string, userTier: 'base' | 'personal' = 'base'): Promise<ProcessResult> {
    const complexity = this.estimateComplexity(input);

    const routing = aiRouter.route('fragment task', 3, userTier);
    const fragmentPrompt = `Break this into 2-4 hour shippable microparts:
"${input}"
Return ONLY a JSON array of strings.`;

    let fragments: string[] = [];
    try {
      const fragmentResponse = await aiClients.callAI(routing.provider, fragmentPrompt);
      const cleanText = fragmentResponse.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      fragments = JSON.parse(cleanText);
    } catch (error) {
      fragments = [input];
    }

    const codeBlocks: string[] = [];
    let totalCost = routing.estimatedCost;

    for (const fragment of fragments) {
      const codeRouting = aiRouter.route(fragment, complexity, userTier);
      const codePrompt = `Generate production-ready TypeScript/React code for:
"${fragment}"
Context: Next.js 14, TypeScript, Tailwind, Supabase
Return ONLY code, no explanations.`;

      try {
        const codeResponse = await aiClients.callAI(codeRouting.provider, codePrompt);
        codeBlocks.push(codeResponse.text);
        totalCost += codeResponse.cost;
        aiRouter.recordUsage(codeRouting.provider, codeResponse.cost);
      } catch (error) {
        codeBlocks.push(`// TODO: ${fragment}`);
      }
    }

    const handoff = `Built: ${input}\nFragments: ${fragments.join(', ')}\nCost: $${totalCost.toFixed(4)}`;

    return { fragments, code: codeBlocks, handoff, totalCost };
  }

  private estimateComplexity(input: string): number {
    const keywords = {
      simple: ['button', 'text', 'display'],
      medium: ['form', 'api', 'component'],
      complex: ['auth', 'database', 'system']
    };

    let score = 5;
    const lower = input.toLowerCase();
    keywords.simple.forEach(k => lower.includes(k) && (score -= 1));
    keywords.complex.forEach(k => lower.includes(k) && (score += 2));
    return Math.max(1, Math.min(10, score));
  }
}

export const forgeProcessor = new ForgeProcessor();
