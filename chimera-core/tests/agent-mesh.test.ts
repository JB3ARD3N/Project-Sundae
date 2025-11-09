/**
 * Agent Mesh Tests
 *
 * Test the 7 avatar agents and auto-spawning system
 */

import { AgentMesh } from '../lib/agents/agent-mesh';

describe('Agent Mesh - Self-Organizing Intelligence', () => {
  let mesh: AgentMesh;

  beforeEach(() => {
    mesh = new AgentMesh();
  });

  describe('Core Agents', () => {
    test('should initialize 7 core avatar agents', () => {
      const coreAgents = mesh.getCoreAgents();

      expect(coreAgents).toHaveLength(7);

      const expectedAgents = [
        'Apollo',
        'Mercury',
        'Athena',
        'Ares',
        'Hermes',
        'Hephaestus',
        'Artemis'
      ];

      expectedAgents.forEach(name => {
        const agent = coreAgents.find(a => a.name === name);
        expect(agent).toBeDefined();
        expect(agent?.confidence).toBe(1.0);
      });
    });

    test('should have unique capabilities for each agent', () => {
      const coreAgents = mesh.getCoreAgents();

      const allCapabilities = coreAgents.flatMap(a => a.capabilities);
      const uniqueCapabilities = new Set(allCapabilities);

      // Should have diverse capabilities
      expect(uniqueCapabilities.size).toBeGreaterThan(10);
    });
  });

  describe('Task Routing', () => {
    test('should route truth tasks to Apollo', async () => {
      const agent = await mesh.routeTask('Verify claim', 'truth');

      expect(agent.name).toBe('Apollo');
      expect(agent.role).toContain('Truth');
    });

    test('should route security tasks to Ares', async () => {
      const agent = await mesh.routeTask('Secure endpoint', 'security');

      expect(agent.name).toBe('Ares');
      expect(agent.role).toContain('Security');
    });

    test('should route creation tasks to Hephaestus', async () => {
      const agent = await mesh.routeTask('Build API', 'creation');

      expect(agent.name).toBe('Hephaestus');
      expect(agent.role).toContain('Creation');
    });
  });

  describe('Auto-Spawning', () => {
    test('should spawn specialist for unknown domain', async () => {
      const initialSpecialists = mesh.getSpecialists().length;

      const agent = await mesh.routeTask('Analyze blockchain', 'blockchain');

      const finalSpecialists = mesh.getSpecialists().length;

      expect(finalSpecialists).toBe(initialSpecialists + 1);
      expect(agent.name).toContain('Blockchain');
    });

    test('should track spawned specialists', async () => {
      await mesh.routeTask('ML analysis', 'machine-learning');
      await mesh.routeTask('Database query', 'database');

      const specialists = mesh.getSpecialists();

      expect(specialists.length).toBe(2);
      expect(specialists.some(s => s.name.includes('Machine-learning'))).toBe(true);
      expect(specialists.some(s => s.name.includes('Database'))).toBe(true);
    });
  });

  describe('Confidence Tracking', () => {
    test('should increase confidence on success', async () => {
      // Spawn a specialist with lower initial confidence
      const specialist = await mesh.routeTask('Test task', 'test-domain-confidence');
      const initialConfidence = specialist.confidence;

      mesh.updateAgentConfidence(specialist.id, true);

      expect(specialist.confidence).toBeGreaterThan(initialConfidence);
      expect(specialist.tasksCompleted).toBe(1);
    });

    test('should decrease confidence on failure', () => {
      const apollo = mesh.getAgent('apollo')!;
      const initialConfidence = apollo.confidence;

      mesh.updateAgentConfidence('apollo', false);

      expect(apollo.confidence).toBeLessThan(initialConfidence);
      expect(apollo.tasksCompleted).toBe(0);
    });

    test('should cap confidence at 1.0', () => {
      for (let i = 0; i < 100; i++) {
        mesh.updateAgentConfidence('apollo', true);
      }

      const apollo = mesh.getAgent('apollo')!;
      expect(apollo.confidence).toBe(1.0);
    });
  });

  describe('Statistics', () => {
    test('should track mesh statistics', () => {
      const stats = mesh.getStats();

      expect(stats.totalAgents).toBe(7); // 7 core agents initially
      expect(stats.coreAgents).toBe(7);
      expect(stats.specialists).toBe(0);
      expect(stats.avgConfidence).toBe(1.0);
    });

    test('should update stats after spawning specialists', async () => {
      await mesh.routeTask('Test', 'test-domain');

      const stats = mesh.getStats();

      expect(stats.totalAgents).toBe(8); // 7 core + 1 specialist
      expect(stats.specialists).toBe(1);
    });
  });

  describe('Integration', () => {
    test('complete mesh workflow', async () => {
      // 1. Route tasks to core agents
      const truthAgent = await mesh.routeTask('Verify claim', 'truth');
      expect(truthAgent.name).toBe('Apollo');

      // 2. Update confidence based on success
      mesh.updateAgentConfidence(truthAgent.id, true);

      // 3. Spawn specialist for new domain
      const specialist = await mesh.routeTask('Quantum analysis', 'quantum');
      expect(specialist.name).toContain('Quantum');

      // 4. Check stats
      const stats = mesh.getStats();
      expect(stats.totalAgents).toBe(8);
      expect(stats.totalTasksCompleted).toBe(1);
    });
  });
});
