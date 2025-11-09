/**
 * CHIMERA CORE
 *
 * The Foundation - Layer by Perfect Layer
 *
 * Layer 1: Truth Engine - Verify before action
 * Layer 2: Voice System - Speed-of-thought creation
 * Layer 3: Agent Mesh - Self-organizing intelligence
 * Layer 4: Cost Optimizer - 90% free-tier routing
 * Layer 5: Security Fortress - Maximum IP protection
 */

// Layer 1: Truth Engine
export { TruthEngine } from './core/truth-engine';
export type {
  TruthVerification,
  TruthVerdict,
  Evidence,
  Contradiction,
  TruthEngineConfig
} from './types/truth';

// Layer 2: Voice System
export { VoiceSystem } from './voice/voice-system';
export type {
  VoiceIntent,
  VoiceConfig
} from './voice/voice-system';

// Layer 3: Agent Mesh
export { AgentMesh } from './agents/agent-mesh';
export type {
  Agent,
  AgentSpawnTrigger
} from './agents/agent-mesh';

// Layer 4: Cost Optimizer
export { CostOptimizer } from './cost/cost-optimizer';
export type {
  ModelConfig,
  RoutingDecision,
  UsageStats
} from './cost/cost-optimizer';

// Layer 5: Security Fortress
export { SecurityFortress } from './security/security-fortress';
export type {
  SecurityConfig,
  ProtectedCode
} from './security/security-fortress';

// Import classes for initialization function
import { TruthEngine as _TruthEngine } from './core/truth-engine';
import { VoiceSystem as _VoiceSystem } from './voice/voice-system';
import { AgentMesh as _AgentMesh } from './agents/agent-mesh';
import { CostOptimizer as _CostOptimizer } from './cost/cost-optimizer';
import { SecurityFortress as _SecurityFortress } from './security/security-fortress';

/**
 * Version information
 */
export const VERSION = '0.1.0';

/**
 * Complete Chimera stack initialization
 */
export function initializeChimera(config?: {
  budgetPerMonth?: number;
  securityLevel?: 'low' | 'medium' | 'high' | 'maximum';
}) {
  const budget = config?.budgetPerMonth || 200;
  const securityLevel = config?.securityLevel || 'high';

  return {
    truthEngine: new _TruthEngine(),
    voiceSystem: new _VoiceSystem(),
    agentMesh: new _AgentMesh(),
    costOptimizer: new _CostOptimizer(budget),
    securityFortress: new _SecurityFortress({ obfuscationLevel: securityLevel })
  };
}
