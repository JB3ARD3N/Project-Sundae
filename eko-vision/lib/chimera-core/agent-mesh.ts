/**
 * Agent Mesh - Self-Organizing Intelligence
 * Re-export from chimera-core package
 */

export interface Agent {
  id: string;
  name: string;
  role: string;
  domain: string[];
  confidence: number;
  tasksCompleted: number;
  successRate: number;
  active: boolean;
}

export class AgentMesh {
  private agents: Map<string, Agent> = new Map();
  private specialists: Map<string, Agent> = new Map();

  constructor() {
    this.initializeCoreAgents();
  }

  /**
   * Initialize 7 core avatar agents
   */
  private initializeCoreAgents(): void {
    const coreAgents: Agent[] = [
      {
        id: 'apollo',
        name: 'Apollo',
        role: 'Truth & Verification',
        domain: ['verification', 'truth', 'fact-checking'],
        confidence: 0.95,
        tasksCompleted: 0,
        successRate: 1.0,
        active: true,
      },
      {
        id: 'mercury',
        name: 'Mercury',
        role: 'Communication & Routing',
        domain: ['routing', 'communication', 'coordination'],
        confidence: 0.92,
        tasksCompleted: 0,
        successRate: 1.0,
        active: true,
      },
      {
        id: 'athena',
        name: 'Athena',
        role: 'Strategy & Planning',
        domain: ['strategy', 'planning', 'architecture'],
        confidence: 0.93,
        tasksCompleted: 0,
        successRate: 1.0,
        active: true,
      },
      {
        id: 'ares',
        name: 'Ares',
        role: 'Security & Defense',
        domain: ['security', 'defense', 'protection'],
        confidence: 0.90,
        tasksCompleted: 0,
        successRate: 1.0,
        active: true,
      },
      {
        id: 'hermes',
        name: 'Hermes',
        role: 'Data & Knowledge',
        domain: ['data', 'knowledge', 'memory'],
        confidence: 0.91,
        tasksCompleted: 0,
        successRate: 1.0,
        active: true,
      },
      {
        id: 'hephaestus',
        name: 'Hephaestus',
        role: 'Creation & Building',
        domain: ['creation', 'building', 'implementation'],
        confidence: 0.94,
        tasksCompleted: 0,
        successRate: 1.0,
        active: true,
      },
      {
        id: 'artemis',
        name: 'Artemis',
        role: 'Precision & Execution',
        domain: ['execution', 'precision', 'optimization'],
        confidence: 0.93,
        tasksCompleted: 0,
        successRate: 1.0,
        active: true,
      },
    ];

    coreAgents.forEach(agent => {
      this.agents.set(agent.id, agent);
    });
  }

  /**
   * Route a task to the most appropriate agent
   */
  async routeTask(task: string, domain?: string, complexity: number = 0.5): Promise<any> {
    // Find best agent for domain
    let selectedAgent: Agent | undefined;

    if (domain) {
      // Find agent with matching domain
      for (const [id, agent] of this.agents.entries()) {
        if (agent.domain.includes(domain) && agent.active) {
          selectedAgent = agent;
          break;
        }
      }

      // If no core agent, spawn specialist
      if (!selectedAgent) {
        selectedAgent = await this.spawnSpecialist(domain);
      }
    }

    // Default to Mercury for routing
    if (!selectedAgent) {
      selectedAgent = this.agents.get('mercury')!;
    }

    // Update agent stats
    selectedAgent.tasksCompleted++;

    return {
      assignedAgent: selectedAgent.name,
      agentRole: selectedAgent.role,
      confidence: selectedAgent.confidence,
      estimatedTime: this.estimateTime(complexity),
      status: 'assigned',
    };
  }

  /**
   * Spawn a specialist agent for specific domain
   */
  private async spawnSpecialist(domain: string): Promise<Agent> {
    const specialist: Agent = {
      id: `specialist-${domain}-${Date.now()}`,
      name: `${domain} Specialist`,
      role: `Specialized ${domain} agent`,
      domain: [domain],
      confidence: 0.75,
      tasksCompleted: 0,
      successRate: 1.0,
      active: true,
    };

    this.specialists.set(specialist.id, specialist);

    return specialist;
  }

  /**
   * Get all active agents
   */
  getActiveAgents(): Agent[] {
    const active = [];

    for (const agent of this.agents.values()) {
      if (agent.active) {
        active.push(agent);
      }
    }

    for (const specialist of this.specialists.values()) {
      if (specialist.active) {
        active.push(specialist);
      }
    }

    return active;
  }

  /**
   * Estimate time based on complexity
   */
  private estimateTime(complexity: number): string {
    const minutes = Math.ceil(complexity * 10);
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  /**
   * Get agent by ID
   */
  getAgent(id: string): Agent | undefined {
    return this.agents.get(id) || this.specialists.get(id);
  }
}
