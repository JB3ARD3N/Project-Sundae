import { NextRequest, NextResponse } from 'next/server';
import { ChimeraBrain } from '@/lib/chimera-core/brain';
import { TruthEngine } from '@/lib/chimera-core/truth-engine';
import { AgentMesh } from '@/lib/chimera-core/agent-mesh';
import { CostOptimizer } from '@/lib/chimera-core/cost-optimizer';
import { MemorySystem } from '@/lib/chimera-core/memory-system';
import { IntentEngine } from '@/lib/chimera-core/intent-engine';

// Singleton instances
let brainInstance: ChimeraBrain | null = null;
let intentEngine: IntentEngine | null = null;

function getBrain() {
  if (!brainInstance) {
    const truthEngine = new TruthEngine();
    const agentMesh = new AgentMesh();
    const costOptimizer = new CostOptimizer();
    const memory = new MemorySystem();

    brainInstance = new ChimeraBrain(
      truthEngine,
      agentMesh,
      costOptimizer,
      memory
    );
  }
  return brainInstance;
}

function getIntentEngine() {
  if (!intentEngine) {
    intentEngine = new IntentEngine();
  }
  return intentEngine;
}

/**
 * POST /api/chimera/query
 * Process a query through the Chimera Brain
 *
 * Body: {
 *   query: string,
 *   context?: any,
 *   options?: { skipValidation?: boolean }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, context = {}, options = {} } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Query is required and must be a string',
      }, { status: 400 });
    }

    // Step 1: Parse intent
    const intent = getIntentEngine();
    const intentResult = await intent.parseIntent(query, context);

    if (intentResult.confidence < 0.5) {
      // Low confidence - ask for clarification
      return NextResponse.json({
        success: true,
        needsClarification: true,
        data: {
          intent: intentResult,
          clarificationQuestion: intentResult.clarificationNeeded
            ? 'Could you please clarify what you mean?'
            : 'I\'m not sure I understood. Could you rephrase that?',
        }
      });
    }

    // Step 2: Process through Chimera Brain
    const brain = getBrain();
    const result = await brain.processQuery(query, {
      intent: intentResult,
      skipValidation: options.skipValidation,
      context,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error: any) {
    console.error('Chimera query error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
    }, { status: 500 });
  }
}

/**
 * GET /api/chimera/query?q=<query>
 * Quick query endpoint for simple requests
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({
        success: false,
        error: 'Query parameter "q" is required',
      }, { status: 400 });
    }

    // Redirect to POST handler
    return POST(new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify({ query }),
    }));

  } catch (error: any) {
    console.error('Chimera query GET error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
