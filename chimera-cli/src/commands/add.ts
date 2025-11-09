/**
 * ADD COMMAND
 *
 * Add a component to existing project
 */

import chalk from 'chalk';

export async function addComponent(component: string) {
  console.log(chalk.gray(`Adding component: ${component}`));

  const components: Record<string, () => Promise<void>> = {
    'truth-engine': addTruthEngine,
    'voice-system': addVoiceSystem,
    'agent-mesh': addAgentMesh,
    'cost-optimizer': addCostOptimizer,
    'security-fortress': addSecurityFortress
  };

  const addFn = components[component];

  if (!addFn) {
    console.log(chalk.red(`Unknown component: ${component}`));
    console.log(chalk.gray('\nAvailable components:'));
    Object.keys(components).forEach(c => {
      console.log(chalk.gray(`  - ${c}`));
    });
    return;
  }

  await addFn();
}

async function addTruthEngine() {
  console.log(chalk.cyan('📦 Installing Truth Engine...'));

  const fs = await import('fs-extra');
  const path = await import('path');

  const cwd = process.cwd();
  const templatePath = path.join(__dirname, '../../../chimera-core');

  // Check if Truth Engine source exists
  if (!await fs.pathExists(templatePath)) {
    console.log(chalk.red('❌ Truth Engine template not found'));
    console.log(chalk.gray('Please ensure chimera-core is installed'));
    return;
  }

  // Create directories
  await fs.ensureDir(path.join(cwd, 'lib/core'));
  await fs.ensureDir(path.join(cwd, 'lib/types'));
  await fs.ensureDir(path.join(cwd, 'tests'));

  // Copy Truth Engine files
  await fs.copy(
    path.join(templatePath, 'lib/core/truth-engine.ts'),
    path.join(cwd, 'lib/core/truth-engine.ts')
  );

  await fs.copy(
    path.join(templatePath, 'lib/types/truth.ts'),
    path.join(cwd, 'lib/types/truth.ts')
  );

  await fs.copy(
    path.join(templatePath, 'tests/truth-engine.test.ts'),
    path.join(cwd, 'tests/truth-engine.test.ts')
  );

  // Update package.json if it exists
  const pkgPath = path.join(cwd, 'package.json');
  if (await fs.pathExists(pkgPath)) {
    const pkg = await fs.readJson(pkgPath);

    // Add test scripts if not present
    pkg.scripts = pkg.scripts || {};
    if (!pkg.scripts.test) {
      pkg.scripts.test = 'jest';
      pkg.scripts['test:watch'] = 'jest --watch';
      pkg.scripts['test:coverage'] = 'jest --coverage';
    }

    // Add Jest config if not present
    if (!pkg.jest) {
      pkg.jest = {
        preset: 'ts-jest',
        testEnvironment: 'node',
        testMatch: ['**/tests/**/*.test.ts'],
        collectCoverageFrom: ['lib/**/*.ts', '!lib/**/*.d.ts']
      };
    }

    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  }

  console.log(chalk.green('✅ Truth Engine added'));
  console.log(chalk.gray('\nFiles created:'));
  console.log(chalk.gray('  lib/core/truth-engine.ts'));
  console.log(chalk.gray('  lib/types/truth.ts'));
  console.log(chalk.gray('  tests/truth-engine.test.ts'));
  console.log(chalk.gray('\nRun: npm test'));
}

async function addVoiceSystem() {
  console.log(chalk.cyan('📦 Installing Voice System...'));

  const fs = await import('fs-extra');
  const path = await import('path');

  const cwd = process.cwd();
  const templatePath = path.join(__dirname, '../../../chimera-core');

  // Check if Voice System source exists
  if (!await fs.pathExists(path.join(templatePath, 'lib/voice'))) {
    console.log(chalk.red('❌ Voice System template not found'));
    console.log(chalk.gray('Please ensure chimera-core is installed'));
    return;
  }

  // Create directories
  await fs.ensureDir(path.join(cwd, 'lib/voice'));
  await fs.ensureDir(path.join(cwd, 'tests'));

  // Copy Voice System files
  await fs.copy(
    path.join(templatePath, 'lib/voice/voice-system.ts'),
    path.join(cwd, 'lib/voice/voice-system.ts')
  );

  await fs.copy(
    path.join(templatePath, 'tests/voice-system.test.ts'),
    path.join(cwd, 'tests/voice-system.test.ts')
  );

  console.log(chalk.green('✅ Voice System added'));
  console.log(chalk.gray('\nFiles created:'));
  console.log(chalk.gray('  lib/voice/voice-system.ts'));
  console.log(chalk.gray('  tests/voice-system.test.ts'));
  console.log(chalk.gray('\nFeatures:'));
  console.log(chalk.gray('  - WebSpeech API (10ms latency)'));
  console.log(chalk.gray('  - Whisper-v3 Turbo fallback (50ms)'));
  console.log(chalk.gray('  - Glyph compression (8x ratio)'));
  console.log(chalk.gray('  - Spell casting (pre-compiled execution)'));
  console.log(chalk.gray('\nTotal latency: ~115ms'));
}

async function addAgentMesh() {
  console.log(chalk.cyan('📦 Installing Agent Mesh...'));

  const fs = await import('fs-extra');
  const path = await import('path');

  const cwd = process.cwd();
  const templatePath = path.join(__dirname, '../../../chimera-core');

  // Check if Agent Mesh source exists
  if (!await fs.pathExists(path.join(templatePath, 'lib/agents'))) {
    console.log(chalk.red('❌ Agent Mesh template not found'));
    console.log(chalk.gray('Please ensure chimera-core is installed'));
    return;
  }

  // Create directories
  await fs.ensureDir(path.join(cwd, 'lib/agents'));
  await fs.ensureDir(path.join(cwd, 'tests'));

  // Copy Agent Mesh files
  await fs.copy(
    path.join(templatePath, 'lib/agents/agent-mesh.ts'),
    path.join(cwd, 'lib/agents/agent-mesh.ts')
  );

  await fs.copy(
    path.join(templatePath, 'tests/agent-mesh.test.ts'),
    path.join(cwd, 'tests/agent-mesh.test.ts')
  );

  console.log(chalk.green('✅ Agent Mesh added'));
  console.log(chalk.gray('\nFiles created:'));
  console.log(chalk.gray('  lib/agents/agent-mesh.ts'));
  console.log(chalk.gray('  tests/agent-mesh.test.ts'));
  console.log(chalk.gray('\n👥 Core Agents:'));
  console.log(chalk.gray('  🌞 Apollo - Truth & Verification'));
  console.log(chalk.gray('  💨 Mercury - Communication & Routing'));
  console.log(chalk.gray('  🦉 Athena - Strategy & Planning'));
  console.log(chalk.gray('  🛡️  Ares - Security & Defense'));
  console.log(chalk.gray('  📚 Hermes - Data & Knowledge'));
  console.log(chalk.gray('  🔨 Hephaestus - Creation & Building'));
  console.log(chalk.gray('  🎯 Artemis - Precision & Execution'));
  console.log(chalk.gray('\nAuto-spawns specialists when needed!'));
}

async function addCostOptimizer() {
  console.log(chalk.cyan('📦 Installing Cost Optimizer...'));

  const fs = await import('fs-extra');
  const path = await import('path');

  const cwd = process.cwd();
  const templatePath = path.join(__dirname, '../../../chimera-core');

  // Check if Cost Optimizer source exists
  if (!await fs.pathExists(path.join(templatePath, 'lib/cost'))) {
    console.log(chalk.red('❌ Cost Optimizer template not found'));
    console.log(chalk.gray('Please ensure chimera-core is installed'));
    return;
  }

  // Create directories
  await fs.ensureDir(path.join(cwd, 'lib/cost'));
  await fs.ensureDir(path.join(cwd, 'tests'));

  // Copy Cost Optimizer files
  await fs.copy(
    path.join(templatePath, 'lib/cost/cost-optimizer.ts'),
    path.join(cwd, 'lib/cost/cost-optimizer.ts')
  );

  await fs.copy(
    path.join(templatePath, 'tests/cost-optimizer.test.ts'),
    path.join(cwd, 'tests/cost-optimizer.test.ts')
  );

  console.log(chalk.green('✅ Cost Optimizer added'));
  console.log(chalk.gray('\nFiles created:'));
  console.log(chalk.gray('  lib/cost/cost-optimizer.ts'));
  console.log(chalk.gray('  tests/cost-optimizer.test.ts'));
  console.log(chalk.gray('\n💰 Cost Optimization Features:'));
  console.log(chalk.gray('  - 90% free-tier routing'));
  console.log(chalk.gray('  - Complexity-based model selection'));
  console.log(chalk.gray('  - Budget tracking ($200/month target)'));
  console.log(chalk.gray('  - Automatic fallback when limits hit'));
  console.log(chalk.gray('\nSave $115-1820/month vs SaaS!'));
}

async function addSecurityFortress() {
  console.log(chalk.cyan('📦 Installing Security Fortress...'));

  const fs = await import('fs-extra');
  const path = await import('path');

  const cwd = process.cwd();
  const templatePath = path.join(__dirname, '../../../chimera-core');

  // Check if Security Fortress source exists
  if (!await fs.pathExists(path.join(templatePath, 'lib/security'))) {
    console.log(chalk.red('❌ Security Fortress template not found'));
    console.log(chalk.gray('Please ensure chimera-core is installed'));
    return;
  }

  // Create directories
  await fs.ensureDir(path.join(cwd, 'lib/security'));
  await fs.ensureDir(path.join(cwd, 'tests'));

  // Copy Security Fortress files
  await fs.copy(
    path.join(templatePath, 'lib/security/security-fortress.ts'),
    path.join(cwd, 'lib/security/security-fortress.ts')
  );

  await fs.copy(
    path.join(templatePath, 'tests/security-fortress.test.ts'),
    path.join(cwd, 'tests/security-fortress.test.ts')
  );

  console.log(chalk.green('✅ Security Fortress added'));
  console.log(chalk.gray('\nFiles created:'));
  console.log(chalk.gray('  lib/security/security-fortress.ts'));
  console.log(chalk.gray('  tests/security-fortress.test.ts'));
  console.log(chalk.gray('\n🛡️  7 Layers of Protection:'));
  console.log(chalk.gray('  1. Code Obfuscation'));
  console.log(chalk.gray('  2. Algorithm Encryption'));
  console.log(chalk.gray('  3. Server-Side Execution'));
  console.log(chalk.gray('  4. Split Logic'));
  console.log(chalk.gray('  5. Decoy Code'));
  console.log(chalk.gray('  6. Dynamic Variation'));
  console.log(chalk.gray('  7. Speed Advantage'));
  console.log(chalk.gray('\n⚠️  CRITICAL: Set CHIMERA_ENCRYPTION_KEY in .env'));
  console.log(chalk.gray('Maximum IP protection - millions at stake!'));
}
