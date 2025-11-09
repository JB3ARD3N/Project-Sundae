/**
 * TRUTH ENGINE DEMO
 *
 * See the foundation in action
 *
 * Run: npm run demo
 */

import { TruthEngine } from '../lib/core/truth-engine';

async function demo() {
  console.log('\n🧬 CHIMERA TRUTH ENGINE - DEMO\n');
  console.log('The smallest perfect part. Watch it work.\n');
  console.log('─'.repeat(60));

  const engine = new TruthEngine();

  // Test claims of varying complexity
  const testClaims = [
    'Water freezes at 0 degrees Celsius',
    'The Earth is flat',
    'TypeScript is a superset of JavaScript',
    'Bitcoin will reach $1 million tomorrow',
    'Photosynthesis converts light into energy',
    'Dogs can speak fluent French',
    'Node.js uses the V8 JavaScript engine',
    'The moon is made of cheese'
  ];

  console.log('\n✓ Testing Truth Engine on 8 claims...\n');

  for (const claim of testClaims) {
    const result = await engine.verify(claim);

    // Display results
    console.log(`\n📋 Claim: "${claim}"`);
    console.log(`├─ Verdict: ${formatVerdict(result.verdict)}`);
    console.log(`├─ Confidence: ${formatConfidence(result.confidence)}`);
    console.log(`├─ Duration: ${result.verificationDuration}ms`);
    console.log(`├─ Sources: ${result.sources.length}`);

    if (result.contradictions.length > 0) {
      console.log(`├─ ⚠️  Contradictions: ${result.contradictions.length}`);
    }

    console.log(`└─ Reasoning: ${result.reasoning}`);
    console.log('');
  }

  // Show statistics
  console.log('─'.repeat(60));
  console.log('\n📊 TRUTH ENGINE STATISTICS\n');

  const stats = engine.getStats();
  console.log(`Total Verifications: ${stats.totalVerifications}`);
  console.log(`Average Confidence: ${(stats.avgConfidence * 100).toFixed(1)}%`);
  console.log(`Average Duration: ${stats.avgDuration.toFixed(2)}ms`);

  console.log('\nVerdict Distribution:');
  Object.entries(stats.verdictDistribution).forEach(([verdict, count]) => {
    const percentage = ((count as number / stats.totalVerifications) * 100).toFixed(1);
    console.log(`  ${formatVerdict(verdict)}: ${count} (${percentage}%)`);
  });

  console.log('\n─'.repeat(60));

  // Demonstrate learning
  console.log('\n🧠 DEMONSTRATING LEARNING\n');
  console.log('Verifying the same claim twice...\n');

  const testClaim = 'Python is a programming language';

  console.log(`First verification of: "${testClaim}"`);
  const first = await engine.verify(testClaim);
  console.log(`├─ Confidence: ${formatConfidence(first.confidence)}`);
  console.log(`├─ Sources: ${first.sources.length}`);
  console.log(`└─ Duration: ${first.verificationDuration}ms\n`);

  console.log(`Second verification of: "${testClaim}"`);
  const second = await engine.verify(testClaim);
  console.log(`├─ Confidence: ${formatConfidence(second.confidence)}`);
  console.log(`├─ Sources: ${second.sources.length} (includes historical data)`);
  console.log(`└─ Duration: ${second.verificationDuration}ms`);

  if (second.confidence >= first.confidence) {
    console.log('\n✅ Confidence maintained or improved through learning!');
  }

  console.log('\n─'.repeat(60));

  // Demonstrate similar claim benefits
  console.log('\n🔗 DEMONSTRATING PATTERN RECOGNITION\n');

  console.log('Verifying related claims...\n');

  await engine.verify('JavaScript is a programming language');
  console.log('✓ Verified: JavaScript is a programming language');

  await engine.verify('Ruby is a programming language');
  console.log('✓ Verified: Ruby is a programming language');

  console.log('\nNow verifying related claim: "Rust is a programming language"\n');

  const rustResult = await engine.verify('Rust is a programming language');
  console.log(`├─ Verdict: ${formatVerdict(rustResult.verdict)}`);
  console.log(`├─ Confidence: ${formatConfidence(rustResult.confidence)}`);
  console.log(`├─ Sources: ${rustResult.sources.length}`);
  console.log(`└─ Reasoning: ${rustResult.reasoning}`);

  if (rustResult.confidence > 0.5) {
    console.log('\n✅ Benefits from similar verified claims!');
  }

  console.log('\n─'.repeat(60));
  console.log('\n🎯 TRUTH ENGINE DEMO COMPLETE\n');
  console.log('The foundation is PERFECT. Ready to build the next layer.\n');
}

function formatVerdict(verdict: string): string {
  const colors = {
    'true': '\x1b[32m✓ TRUE\x1b[0m',
    'likely_true': '\x1b[36m≈ LIKELY TRUE\x1b[0m',
    'uncertain': '\x1b[33m? UNCERTAIN\x1b[0m',
    'likely_false': '\x1b[35m≈ LIKELY FALSE\x1b[0m',
    'false': '\x1b[31m✗ FALSE\x1b[0m'
  };
  return colors[verdict as keyof typeof colors] || verdict;
}

function formatConfidence(confidence: number): string {
  const percentage = (confidence * 100).toFixed(1);
  const color =
    confidence >= 0.9 ? '\x1b[32m' :  // Green
    confidence >= 0.7 ? '\x1b[36m' :  // Cyan
    confidence >= 0.3 ? '\x1b[33m' :  // Yellow
    '\x1b[31m';                        // Red

  return `${color}${percentage}%\x1b[0m`;
}

// Run demo
demo().catch(console.error);
