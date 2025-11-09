/**
 * CREATE COMMAND
 *
 * Generate a new Chimera project from template
 */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { renderTemplate } from '../utils/template';
import { installDependencies } from '../utils/install';

interface CreateOptions {
  template: string;
  voice?: boolean;
  agents?: string;
  truth?: boolean;
  multiUser?: boolean;
}

export async function createProject(projectName: string, options: CreateOptions) {
  const spinner = ora();

  try {
    // 1. Validate project name
    if (fs.existsSync(projectName)) {
      throw new Error(`Directory ${projectName} already exists`);
    }

    // 2. Get template configuration
    const template = await getTemplateConfig(options);

    // 3. Create project directory
    spinner.start('Creating project structure...');
    await fs.mkdirp(projectName);

    // 4. Generate files from template
    await generateProjectFiles(projectName, template);
    spinner.succeed('Project structure created');

    // 5. Initialize git
    spinner.start('Initializing git repository...');
    await initGit(projectName);
    spinner.succeed('Git initialized');

    // 6. Create .env file
    spinner.start('Creating environment configuration...');
    await createEnvFile(projectName, template);
    spinner.succeed('Environment configured');

    // 7. Success message
    console.log(chalk.green(`\n✨ Project "${projectName}" created!`));
    console.log(chalk.gray('\nProject structure:'));
    console.log(chalk.gray(`  ${projectName}/`));
    console.log(chalk.gray(`  ├── lib/              # Core logic`));
    console.log(chalk.gray(`  ├── components/       # UI components (if applicable)`));
    console.log(chalk.gray(`  ├── tests/            # Test files`));
    console.log(chalk.gray(`  ├── package.json`));
    console.log(chalk.gray(`  └── README.md`));

    if (template.hasTruthEngine) {
      console.log(chalk.cyan('\n🧬 Truth Engine included'));
    }
    if (template.hasVoice) {
      console.log(chalk.cyan('🎤 Voice system included'));
    }
    if (template.hasAgents) {
      console.log(chalk.cyan(`🤖 ${template.agentCount} agents included`));
    }

  } catch (error) {
    spinner.fail('Project creation failed');
    throw error;
  }
}

async function getTemplateConfig(options: CreateOptions) {
  const { template, voice, agents, truth, multiUser } = options;

  // Predefined templates
  const templates: Record<string, any> = {
    'voice-startup': {
      hasTruthEngine: true,
      hasVoice: true,
      hasAgents: true,
      agentCount: 3,
      multiUser: false,
      description: 'Voice-powered startup builder'
    },
    'ai-content': {
      hasTruthEngine: true,
      hasVoice: false,
      hasAgents: true,
      agentCount: 5,
      multiUser: true,
      description: 'AI content creation platform'
    },
    'electron-os': {
      hasTruthEngine: true,
      hasVoice: true,
      hasAgents: true,
      agentCount: 7,
      multiUser: false,
      isElectron: true,
      description: 'Personal AI operating system'
    },
    'saas-platform': {
      hasTruthEngine: true,
      hasVoice: false,
      hasAgents: true,
      agentCount: 10,
      multiUser: true,
      hasBilling: true,
      description: 'Multi-tenant SaaS platform'
    },
    'custom': {
      hasTruthEngine: truth !== undefined ? truth : true,
      hasVoice: voice !== undefined ? voice : false,
      hasAgents: agents !== undefined,
      agentCount: agents ? parseInt(agents) : 0,
      multiUser: multiUser !== undefined ? multiUser : false,
      description: 'Custom project'
    }
  };

  if (template === 'custom') {
    // Interactive mode for custom projects
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'truth',
        message: 'Include Truth Engine?',
        default: true
      },
      {
        type: 'confirm',
        name: 'voice',
        message: 'Include Voice interface?',
        default: false
      },
      {
        type: 'number',
        name: 'agents',
        message: 'How many agents?',
        default: 3,
        validate: (value) => value >= 0 || 'Must be >= 0'
      },
      {
        type: 'confirm',
        name: 'multiUser',
        message: 'Multi-user support?',
        default: false
      }
    ]);

    return {
      hasTruthEngine: answers.truth,
      hasVoice: answers.voice,
      hasAgents: answers.agents > 0,
      agentCount: answers.agents,
      multiUser: answers.multiUser,
      description: 'Custom Chimera project'
    };
  }

  return templates[template] || templates.custom;
}

async function generateProjectFiles(projectName: string, template: any) {
  const projectPath = path.resolve(projectName);

  // 1. Create directory structure
  const dirs = [
    'lib/core',
    'lib/types',
    'tests',
    'docs'
  ];

  if (template.hasVoice) {
    dirs.push('lib/voice');
  }

  if (template.hasAgents) {
    dirs.push('lib/agents');
  }

  if (template.isElectron) {
    dirs.push('electron', 'src/components', 'src/app');
  }

  for (const dir of dirs) {
    await fs.mkdirp(path.join(projectPath, dir));
  }

  // 2. Generate package.json
  await generatePackageJson(projectPath, projectName, template);

  // 3. Generate tsconfig.json
  await generateTsConfig(projectPath);

  // 4. Copy Truth Engine if included
  if (template.hasTruthEngine) {
    await copyTruthEngine(projectPath);
  }

  // 5. Generate README
  await generateReadme(projectPath, projectName, template);

  // 6. Create .gitignore
  await createGitignore(projectPath);
}

async function generatePackageJson(projectPath: string, projectName: string, template: any) {
  const pkg = {
    name: projectName,
    version: '0.1.0',
    description: template.description,
    main: 'dist/index.js',
    scripts: {
      build: 'tsc',
      dev: 'ts-node-dev --respawn lib/index.ts',
      test: 'jest',
      demo: 'ts-node demos/demo.ts'
    },
    dependencies: {},
    devDependencies: {
      '@types/node': '^20.10.6',
      'typescript': '^5.3.3',
      'ts-node': '^10.9.2',
      'ts-node-dev': '^2.0.0',
      '@types/jest': '^29.5.11',
      'jest': '^29.7.0',
      'ts-jest': '^29.1.1'
    }
  };

  // Add dependencies based on template
  if (template.hasVoice) {
    (pkg.dependencies as any)['@google/generative-ai'] = '^0.1.3';
  }

  if (template.isElectron) {
    (pkg.dependencies as any)['electron'] = '^28.0.0';
    (pkg.devDependencies as any)['electron-builder'] = '^24.9.1';
  }

  await fs.writeJSON(path.join(projectPath, 'package.json'), pkg, { spaces: 2 });
}

async function generateTsConfig(projectPath: string) {
  const tsconfig = {
    compilerOptions: {
      target: 'ES2022',
      module: 'commonjs',
      lib: ['ES2022'],
      outDir: './dist',
      rootDir: './',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      declaration: true,
      sourceMap: true,
      moduleResolution: 'node'
    },
    include: ['lib/**/*', 'tests/**/*'],
    exclude: ['node_modules', 'dist']
  };

  await fs.writeJSON(path.join(projectPath, 'tsconfig.json'), tsconfig, { spaces: 2 });
}

async function copyTruthEngine(projectPath: string) {
  const truthEngineSrc = path.resolve(__dirname, '../../chimera-core/lib');
  const truthEngineDest = path.join(projectPath, 'lib');

  // Copy Truth Engine files
  await fs.copy(truthEngineSrc, truthEngineDest);
}

async function generateReadme(projectPath: string, projectName: string, template: any) {
  const readme = `# ${projectName}

${template.description}

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
npm install

# Run in development
npm run dev

# Run tests
npm test

# Build for production
npm run build
\`\`\`

## 🧬 Features

${template.hasTruthEngine ? '- ✅ Truth Engine (verify claims before action)' : ''}
${template.hasVoice ? '- ✅ Voice interface (speak to create)' : ''}
${template.hasAgents ? `- ✅ ${template.agentCount} AI agents` : ''}
${template.multiUser ? '- ✅ Multi-user support' : ''}

## 📚 Documentation

See \`docs/\` for detailed documentation.

## 🔒 Security

This project includes built-in security features:
- Code obfuscation (run \`chimera secure\`)
- IP protection
- Encrypted algorithms

## 🛠️ Built with Chimera CLI

Generated with \`@0r8/chimera-cli\`

---

**Truth above all** | Built by JB3ARD3N
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readme);
}

async function createGitignore(projectPath: string) {
  const gitignore = `
node_modules/
dist/
*.log
.env
.env.local
.DS_Store
coverage/
.idea/
.vscode/
`;

  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore.trim());
}

async function initGit(projectName: string) {
  const { execSync } = require('child_process');
  const cwd = path.resolve(projectName);

  try {
    execSync('git init', { cwd, stdio: 'ignore' });
    execSync('git add .', { cwd, stdio: 'ignore' });
    execSync('git commit -m "Initial commit from Chimera CLI"', { cwd, stdio: 'ignore' });
  } catch (error) {
    // Git init failed, not critical
  }
}

async function createEnvFile(projectPath: string, template: any) {
  let envContent = `# Chimera Project Environment

# Security
ENCRYPTION_KEY=change_this_${Math.random().toString(36).substring(7)}
ACCESS_TOKEN=change_this_${Math.random().toString(36).substring(7)}
`;

  if (template.hasVoice) {
    envContent += `
# AI APIs
GOOGLE_API_KEY=your_gemini_key_here
ANTHROPIC_API_KEY=your_claude_key_here
OPENAI_API_KEY=your_openai_key_here
`;
  }

  await fs.writeFile(path.join(projectPath, '.env.example'), envContent);
  await fs.writeFile(path.join(projectPath, '.env'), envContent);
}
