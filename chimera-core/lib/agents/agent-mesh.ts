/**
 * AGENT MESH
 *
 * 7 Core Avatar Agents + Auto-Spawning Factory
 * Self-organizing mesh that spawns specialists as needed
 */

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  capabilities: string[];
  confidence: number;
  tasksCompleted: number;
}

export interface AgentSpawnTrigger {
  confidence: number;      // Spawn when confidence < threshold
  taskComplexity: number;  // Spawn when complexity > threshold
  domain: string;          // Domain that needs specialist
}

export class AgentMesh {
  private coreAgents: Map<string, Agent>;
  private specialistAgents: Map<string, Agent>;
  private spawnThreshold: number = 0.75;

  constructor() {
    this.coreAgents = new Map();
    this.specialistAgents = new Map();
    this.initializeCoreAgents();
  }

  /**
   * Initialize the 7 Core Avatar Agents
   */
  private initializeCoreAgents(): void {
    const avatars: Agent[] = [
      {
        id: 'apollo',
        name: 'Apollo',
        role: 'Truth & Verification',
        avatar: '🌞',
        capabilities: ['fact-checking', 'source-validation', 'truth-scoring'],
        confidence: 1.0,
        tasksCompleted: 0
      },
      {
        id: 'mercury',
        name: 'Mercury',
        role: 'Communication & Routing',
        avatar: '💨',
        capabilities: ['message-routing', 'api-orchestration', 'data-flow'],
        confidence: 1.0,
        tasksCompleted: 0
      },
      {
        id: 'athena',
        name: 'Athena',
        role: 'Strategy & Planning',
        avatar: '🦉',
        capabilities: ['task-planning', 'optimization', 'decision-making'],
        confidence: 1.0,
        tasksCompleted: 0
      },
      {
        id: 'ares',
        name: 'Ares',
        role: 'Security & Defense',
        avatar: '🛡️',
        capabilities: ['threat-detection', 'encryption', 'access-control'],
        confidence: 1.0,
        tasksCompleted: 0
      },
      {
        id: 'hermes',
        name: 'Hermes',
        role: 'Data & Knowledge',
        avatar: '📚',
        capabilities: ['data-retrieval', 'knowledge-synthesis', 'learning'],
        confidence: 1.0,
        tasksCompleted: 0
      },
      {
        id: 'hephaestus',
        name: 'Hephaestus',
        role: 'Creation & Building',
        avatar: '🔨',
        capabilities: ['code-generation', 'system-building', 'automation'],
        confidence: 1.0,
        tasksCompleted: 0
      },
      {
        id: 'artemis',
        name: 'Artemis',
        role: 'Precision & Execution',
        avatar: '🎯',
        capabilities: ['task-execution', 'quality-control', 'monitoring'],
        confidence: 1.0,
        tasksCompleted: 0
      }
    ];

    avatars.forEach(agent => {
      this.coreAgents.set(agent.id, agent);
    });
  }

  /**
   * Route task to appropriate agent
   */
  async routeTask(task: string, domain: string): Promise<Agent> {
    // Find best agent for the task
    const bestAgent = this.findBestAgent(domain);

    if (!bestAgent || bestAgent.confidence < this.spawnThreshold) {
      // Spawn specialist if needed
      return await this.spawnSpecialist(domain);
    }

    return bestAgent;
  }

  /**
   * Find best agent for a domain
   */
  private findBestAgent(domain: string): Agent | undefined {
    const domainMapping: Record<string, string> = {
      'truth': 'apollo',
      'verification': 'apollo',
      'routing': 'mercury',
      'communication': 'mercury',
      'strategy': 'athena',
      'planning': 'athena',
      'security': 'ares',
      'defense': 'ares',
      'data': 'hermes',
      'knowledge': 'hermes',
      'creation': 'hephaestus',
      'building': 'hephaestus',
      'execution': 'artemis',
      'monitoring': 'artemis'
    };

    const agentId = domainMapping[domain.toLowerCase()];
    if (agentId) {
      return this.coreAgents.get(agentId);
    }

    // Check specialists
    for (const [id, agent] of this.specialistAgents) {
      if (agent.capabilities.some(cap => cap.includes(domain.toLowerCase()))) {
        return agent;
      }
    }

    return undefined;
  }

  /**
   * Auto-spawn specialist agent when needed
   */
  private async spawnSpecialist(domain: string): Promise<Agent> {
    const specialistId = `specialist-${domain}-${Date.now()}`;

    const specialist: Agent = {
      id: specialistId,
      name: `${domain.charAt(0).toUpperCase()}${domain.slice(1)} Specialist`,
      role: `Specialized ${domain} Operations`,
      avatar: '⚡',
      capabilities: [domain, `${domain}-analysis`, `${domain}-optimization`],
      confidence: 0.8,
      tasksCompleted: 0
    };

    this.specialistAgents.set(specialistId, specialist);

    console.log(`🌟 Spawned new specialist: ${specialist.name}`);

    return specialist;
  }

  /**
   * Get agent by ID
   */
  getAgent(id: string): Agent | undefined {
    return this.coreAgents.get(id) || this.specialistAgents.get(id);
  }

  /**
   * Get all core agents
   */
  getCoreAgents(): Agent[] {
    return Array.from(this.coreAgents.values());
  }

  /**
   * Get all specialist agents
   */
  getSpecialists(): Agent[] {
    return Array.from(this.specialistAgents.values());
  }

  /**
   * Update agent confidence based on task completion
   */
  updateAgentConfidence(agentId: string, success: boolean): void {
    const agent = this.getAgent(agentId);
    if (!agent) return;

    // Increase confidence on success, decrease on failure
    if (success) {
      agent.confidence = Math.min(1.0, agent.confidence + 0.05);
      agent.tasksCompleted++;
    } else {
      agent.confidence = Math.max(0.0, agent.confidence - 0.1);
    }
  }

  /**
   * Get mesh statistics
   */
  getStats() {
    const coreAgents = this.getCoreAgents();
    const specialists = this.getSpecialists();

    return {
      totalAgents: coreAgents.length + specialists.length,
      coreAgents: coreAgents.length,
      specialists: specialists.length,
      totalTasksCompleted: [...coreAgents, ...specialists].reduce(
        (sum, agent) => sum + agent.tasksCompleted,
        0
      ),
      avgConfidence:
        [...coreAgents, ...specialists].reduce((sum, agent) => sum + agent.confidence, 0) /
        (coreAgents.length + specialists.length)
    };
  }

  /**
   * Demonstrate the mesh in action
   */
  async demonstrate(): Promise<void> {
    console.log('\n🌐 AGENT MESH DEMONSTRATION\n');
    console.log('─'.repeat(60));

    console.log('\n👥 Core Agents:\n');
    this.getCoreAgents().forEach(agent => {
      console.log(`${agent.avatar} ${agent.name} - ${agent.role}`);
      console.log(`   Capabilities: ${agent.capabilities.join(', ')}`);
      console.log('');
    });

    console.log('─'.repeat(60));
    console.log('\n🎯 Task Routing Demo:\n');

    const testTasks = [
      { task: 'Verify claim', domain: 'truth' },
      { task: 'Build API', domain: 'creation' },
      { task: 'Secure endpoint', domain: 'security' },
      { task: 'Analyze blockchain data', domain: 'blockchain' } // Will spawn specialist
    ];

    for (const { task, domain } of testTasks) {
      const agent = await this.routeTask(task, domain);
      console.log(`Task: "${task}"`);
      console.log(`→ Routed to: ${agent.avatar} ${agent.name}`);
      console.log(`  Confidence: ${(agent.confidence * 100).toFixed(1)}%`);
      console.log('');
    }

    console.log('─'.repeat(60));
    console.log('\n📊 Mesh Statistics:\n');

    const stats = this.getStats();
    console.log(`Total Agents: ${stats.totalAgents}`);
    console.log(`Core Agents: ${stats.coreAgents}`);
    console.log(`Specialists: ${stats.specialists}`);
    console.log(`Average Confidence: ${(stats.avgConfidence * 100).toFixed(1)}%`);

    console.log('\n─'.repeat(60));
  }
}
