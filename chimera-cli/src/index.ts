#!/usr/bin/env node

/**
 * CHIMERA CLI - The Meta-Framework
 *
 * Build million-dollar projects in minutes
 *
 * Usage:
 *   chimera create <project-name> --template=<template>
 *   chimera add <component>
 *   chimera secure --level=maximum
 *   chimera deploy --platform=vercel
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { createProject } from './commands/create';
import { addComponent } from './commands/add';
import { secureProject } from './commands/secure';
import { deployProject } from './commands/deploy';
import { demoComponent } from './commands/demo';

const program = new Command();

program
  .name('chimera')
  .description('🧬 Chimera CLI - Build million-dollar AI projects in minutes')
  .version('0.1.0');

// CREATE command - Generate new project
program
  .command('create <project-name>')
  .description('Create a new Chimera project')
  .option('-t, --template <template>', 'Project template', 'custom')
  .option('--voice', 'Include voice interface')
  .option('--agents <number>', 'Number of agents', '3')
  .option('--truth', 'Include truth verification')
  .option('--multi-user', 'Multi-tenant support')
  .action(async (projectName, options) => {
    console.log(chalk.cyan('\n🧬 Creating Chimera project...\n'));
    await createProject(projectName, options);
    console.log(chalk.green('\n✅ Project created successfully!'));
    console.log(chalk.gray(`\nNext steps:`));
    console.log(chalk.gray(`  cd ${projectName}`));
    console.log(chalk.gray(`  npm install`));
    console.log(chalk.gray(`  npm run dev`));
  });

// ADD command - Add component to existing project
program
  .command('add <component>')
  .description('Add a component to your project')
  .action(async (component) => {
    console.log(chalk.cyan(`\n🔧 Adding ${component}...\n`));
    await addComponent(component);
    console.log(chalk.green(`\n✅ ${component} added successfully!`));
  });

// SECURE command - Protect IP
program
  .command('secure')
  .description('Secure your project (obfuscation, encryption, watermarking)')
  .option('--level <level>', 'Security level: basic|standard|maximum', 'standard')
  .action(async (options) => {
    console.log(chalk.cyan('\n🛡️  Securing project...\n'));
    await secureProject(options.level);
    console.log(chalk.green('\n✅ Project secured!'));
  });

// DEPLOY command - Deploy to production
program
  .command('deploy')
  .description('Deploy your project')
  .option('--platform <platform>', 'Platform: vercel|netlify|aws', 'vercel')
  .action(async (options) => {
    console.log(chalk.cyan(`\n🚀 Deploying to ${options.platform}...\n`));
    await deployProject(options.platform);
    console.log(chalk.green('\n✅ Deployed successfully!'));
  });

// DEMO command - See component in action
program
  .command('demo <component>')
  .description('Run a demo of a component')
  .action(async (component) => {
    console.log(chalk.cyan(`\n🎬 Running ${component} demo...\n`));
    await demoComponent(component);
  });

// EXPLAIN command - Learn about a component
program
  .command('explain <component>')
  .description('Learn how a component works')
  .action((component) => {
    console.log(chalk.cyan(`\n📚 ${component} explanation:\n`));
    // Will implement component explanations
    console.log(chalk.gray('Coming soon...'));
  });

// Parse arguments
program.parse(process.argv);

// Show help if no command
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
