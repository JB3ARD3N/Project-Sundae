/**
 * Chimera Core - Complete AI System
 * Unified export of all core modules
 *
 * This bridges eko-vision (frontend) with chimera-core (backend logic)
 */

// Core Brain & Orchestration
export { ChimeraBrain } from './brain';
export type { ChimeraBrainStats } from './brain';

// Truth & Verification
export { TruthEngine } from './truth-engine';
export type { TruthVerdict, TruthVerification } from './truth-engine';

// Agent Intelligence
export { AgentMesh } from './agent-mesh';
export type { Agent } from './agent-mesh';

// Cost & Model Optimization
export { CostOptimizer } from './cost-optimizer';
export type { ModelProvider } from './cost-optimizer';

// Memory & Pattern Storage
export { MemorySystem } from './memory-system';
export type { Pattern } from './memory-system';

// Intent Parsing
export { IntentEngine } from './intent-engine';
export type { IntentType, IntentResult } from './intent-engine';

// Voice Processing
export { VoiceSystem } from './voice-system';
export type { VoiceConfig, GlyphCompression } from './voice-system';

// Factory function to create initialized system
export function createChimeraSystem() {
  const truthEngine = new TruthEngine();
  const agentMesh = new AgentMesh();
  const costOptimizer = new CostOptimizer();
  const memory = new MemorySystem();
  const intentEngine = new IntentEngine();
  const voiceSystem = new VoiceSystem({
    primaryEngine: 'webspeech',
    fallbackEngine: 'whisper',
    targetLatency: 115,
    enableGlyphCompression: true,
  });

  const brain = new ChimeraBrain(
    truthEngine,
    agentMesh,
    costOptimizer,
    memory
  );

  return {
    brain,
    truthEngine,
    agentMesh,
    costOptimizer,
    memory,
    intentEngine,
    voiceSystem,
  };
}
