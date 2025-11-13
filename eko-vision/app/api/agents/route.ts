import { NextRequest, NextResponse } from 'next/server';
import { AgentMesh } from '@/lib/chimera-core/agent-mesh';

// Singleton instance
let agentMeshInstance: AgentMesh | null = null;

function getAgentMesh() {
  if (!agentMeshInstance) {
    agentMeshInstance = new AgentMesh();
  }
  return agentMeshInstance;
}

/**
 * GET /api/agents
 * Get all active agents and their status
 */
export async function GET() {
  try {
    const mesh = getAgentMesh();
    const agents = mesh.getActiveAgents();

    return NextResponse.json({
      success: true,
      data: {
        agents,
        count: agents.length,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error: any) {
    console.error('Agent mesh error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

/**
 * POST /api/agents/route
 * Route a task to the appropriate agent
 *
 * Body: {
 *   task: string,
 *   domain?: string,
 *   complexity?: number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task, domain, complexity = 0.5 } = body;

    if (!task) {
      return NextResponse.json({
        success: false,
        error: 'Task is required',
      }, { status: 400 });
    }

    const mesh = getAgentMesh();
    const result = await mesh.routeTask(task, domain, complexity);

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error: any) {
    console.error('Agent routing error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
