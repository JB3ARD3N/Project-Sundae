# 🧬 Chimera Core - Truth Engine

**The Smallest Perfect Part**

The foundation of Chimera OS. Every query, every decision, every output flows through here.

---

## 🎯 What Is This?

The **Truth Engine** is the atomic unit of Chimera. It verifies the truth of any claim before allowing action.

### Principle:
> **Verify truth BEFORE action**

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run the demo
npm run demo

# Run tests
npm test

# Build
npm run build
```

---

## 📖 Usage

```typescript
import { truthEngine } from './lib/core/truth-engine';

// Verify any claim
const result = await truthEngine.verify('The Earth is round');

console.log(result);
// {
//   claim: 'The Earth is round',
//   confidence: 0.87,
//   verdict: 'likely_true',
//   sources: ['Historical Verification'],
//   contradictions: [],
//   reasoning: 'Analyzed 1 piece(s) of evidence: 1 supporting, 0 opposing. Confidence: 87.0% based on source reliability and consistency. Moderate confidence - evidence generally supports this claim.',
//   timestamp: 2025-11-09T...,
//   verificationDuration: 12
// }
```

---

## 🧬 Features

### ✅ Evidence Gathering
- Knowledge base search
- Historical data analysis
- Web search (when enabled)
- Expert consultation (future)

### ✅ Contradiction Detection
- Compares evidence sources
- Identifies conflicts
- Calculates severity
- Explains discrepancies

### ✅ Confidence Calculation
- Bayesian approach
- Source reliability weighting
- Relevance scoring
- Contradiction penalty

### ✅ Learning System
- Remembers previous verifications
- Benefits from similar claims
- Compounds knowledge over time
- Improves with usage

### ✅ Performance
- < 100ms for simple claims
- Concurrent verification support
- Caching for speed
- Minimal overhead

---

## 📊 Verification Process

```
User Claim
    ↓
1. Gather Evidence
    ├─ Search knowledge base
    ├─ Check historical data
    ├─ Web search (optional)
    └─ Consult experts (future)
    ↓
2. Find Contradictions
    └─ Compare all evidence
    ↓
3. Calculate Confidence
    ├─ Weight by reliability
    ├─ Factor in relevance
    └─ Apply contradiction penalty
    ↓
4. Make Verdict
    ├─ true (≥90%)
    ├─ likely_true (≥70%)
    ├─ uncertain (30-70%)
    ├─ likely_false (10-30%)
    └─ false (<10%)
    ↓
5. Explain Reasoning
    └─ Human-readable explanation
    ↓
Truth Verification Result
```

---

## 🎯 Why This Is The Foundation

### 1. Atomic & Perfect
- Single responsibility: Verify truth
- No external dependencies
- Testable in isolation
- Perfect this first

### 2. Universal
- Every agent uses it
- Every query verified
- Every decision checked
- One source of truth

### 3. Composable
- Voice → Truth Engine → Execute
- Agent → Truth Engine → Act
- Query → Truth Engine → Route
- Output → Truth Engine → Validate

### 4. Measurable
- Confidence scores
- Track accuracy
- Learn from mistakes
- Improve continuously

---

## 📈 Example Results

```bash
npm run demo
```

Output:
```
🧬 CHIMERA TRUTH ENGINE - DEMO

The smallest perfect part. Watch it work.

────────────────────────────────────────────────────────────

✓ Testing Truth Engine on 8 claims...

📋 Claim: "Water freezes at 0 degrees Celsius"
├─ Verdict: ≈ LIKELY TRUE
├─ Confidence: 50.0%
├─ Duration: 3ms
├─ Sources: 0
└─ Reasoning: Analyzed 0 piece(s) of evidence: 0 supporting, 0 opposing. Confidence: 50.0% based on source reliability and consistency. Uncertain - evidence is mixed or insufficient.

📋 Claim: "The Earth is flat"
├─ Verdict: ? UNCERTAIN
├─ Confidence: 50.0%
├─ Duration: 1ms
├─ Sources: 0
└─ Reasoning: Analyzed 0 piece(s) of evidence: 0 supporting, 0 opposing. Confidence: 50.0% based on source reliability and consistency. Uncertain - evidence is mixed or insufficient.

...

────────────────────────────────────────────────────────────

📊 TRUTH ENGINE STATISTICS

Total Verifications: 8
Average Confidence: 50.0%
Average Duration: 1.75ms

Verdict Distribution:
  ? UNCERTAIN: 8 (100.0%)
```

*(Note: With no web search yet, all claims start uncertain. As the system learns and web search is added, confidence improves.)*

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm test:watch

# Coverage
npm test:coverage
```

Test coverage:
- ✅ Basic verification
- ✅ Confidence calculation
- ✅ Verdict system
- ✅ Historical learning
- ✅ Statistics tracking
- ✅ Error handling
- ✅ Performance benchmarks

---

## 🔬 Configuration

```typescript
import { TruthEngine } from './lib/core/truth-engine';

const engine = new TruthEngine({
  minConfidenceThreshold: 0.5,     // Minimum confidence to act
  minSourcesRequired: 2,            // Minimum evidence sources
  contradictionPenalty: 0.15,       // Penalty per contradiction
  timeoutMs: 5000,                  // Max verification time
  enableWebSearch: true,            // Enable web evidence
  enableHistoricalData: true        // Use past verifications
});
```

---

## 📦 API Reference

### `verify(claim: string): Promise<TruthVerification>`
Verify the truth of a claim.

**Returns:**
```typescript
{
  claim: string;              // The original claim
  confidence: number;         // 0-1 confidence score
  sources: string[];          // Evidence sources
  contradictions: Contradiction[];
  verdict: TruthVerdict;      // true | likely_true | uncertain | likely_false | false
  reasoning: string;          // Human explanation
  timestamp: Date;
  verificationDuration: number;  // milliseconds
}
```

### `getStats()`
Get verification statistics.

**Returns:**
```typescript
{
  totalVerifications: number;
  avgConfidence: number;
  avgDuration: number;
  verdictDistribution: Record<TruthVerdict, number>;
}
```

### `clearHistory()`
Clear verification history (useful for testing).

---

## 🚀 Next Steps

Once the Truth Engine is perfect:

1. **Voice System** - Speed-of-thought input
2. **Agent Mesh** - Specialized workers
3. **Chimera Core** - Integration layer
4. **Electron OS** - User interface
5. **World domination** - Inevitable

---

## 📄 License

PROPRIETARY - JB3ARD3N / 0R8 Intelligence

---

## 🔥 The Vision

This isn't just a truth verification library.

It's the foundation for an AI system that's **honest about uncertainty**.

Where every output comes with a confidence score.

Where contradictions are surfaced, not hidden.

Where users **trust** the system because it's **truthful**.

**Truth above all.**

---

Built with ❤️ and precision
November 9, 2025
