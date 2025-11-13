import { NextRequest, NextResponse } from 'next/server';
import { ChimeraBrain } from '@/lib/chimera-core/brain';
import { TruthEngine } from '@/lib/chimera-core/truth-engine';
import { AgentMesh } from '@/lib/chimera-core/agent-mesh';
import { CostOptimizer } from '@/lib/chimera-core/cost-optimizer';
import { MemorySystem } from '@/lib/chimera-core/memory-system';

// Initialize core systems (singleton pattern)
let brainInstance: ChimeraBrain | null = null;

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

/**
 * GET /api/chimera/status
 * Returns current system status and stats
 */
export async function GET() {
  try {
    const brain = getBrain();
    const stats = brain.getStats();

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        status: 'operational',
      }
    });
  } catch (error: any) {
    console.error('Chimera status error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

/**
 * POST /api/chimera/status
 * Update system configuration (brain power, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brainPower, activeMetrics } = body;

    // Update brain configuration
    const brain = getBrain();

    // Store configuration (would persist to Supabase in production)
    const config = {
      brainPower: brainPower || 50,
      activeMetrics: activeMetrics || ['intelligence', 'speed', 'cost'],
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: config,
    });
  } catch (error: any) {
    console.error('Chimera config update error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
