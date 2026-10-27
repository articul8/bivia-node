# Bivia Node.js SDK

TypeScript SDK for the [Bivia](https://articul8.ai) calibrated decision engine.

## Installation

```bash
npm install @articul8/bivia
```

## Usage

The SDK reads the `A8_API_KEY` environment variable by default:

```bash
export A8_API_KEY="your-api-key"
```

### Boolean decision

```typescript
import Bivia from '@articul8/bivia';

const client = new Bivia();

const result = await client.decisions.boolean({
  question: 'Is this urgent?',
  state: 'Customer threatened to cancel.',
});
console.log(result.value, result.probability);
// "yes" 0.92
```

### Choice decision

```typescript
const result = await client.decisions.choice({
  question: 'Which team handles this?',
  state: 'I need a copy of my invoice.',
  choices: ['billing', 'refunds', 'technical'],
});
console.log(result.value, result.distribution);
// "billing" { billing: 0.93, refunds: 0.04, technical: 0.03 }
```

### Auto-detect decision type

```typescript
const result = await client.decisions.create({
  question: 'Most likely diagnosis?',
  state: 'Patient has fever, cough, and right lower lobe infiltrate on chest x-ray.',
  outcomes: ['common cold', 'pneumonia', 'healthy'],
});
console.log(result.value, result.probability);
```

### Score decision

```typescript
const result = await client.decisions.score({
  question: 'How urgent is this (0=none, 1=critical)?',
  state: 'Customer threatened to cancel today.',
  range: [0, 1],
  buckets: 11,
});
console.log(result.value, result.levels);
```

### Multi-select

```typescript
const result = await client.decisions.multiSelect({
  question: 'Which actions apply?',
  state: 'Order arrived damaged and the customer wants money back.',
  options: ['cancel', 'refund', 'status'],
});
console.log(result.value, result.probabilities);
// ["cancel", "refund"] { cancel: 0.93, refund: 0.87, status: 0.11 }
```

### Span extraction

```typescript
const result = await client.decisions.span({
  question: 'Where is the auto-renewal clause?',
  state: 'This agreement renews automatically for one year unless either party cancels.',
});
console.log(result.value);
// [{ start: 0, end: 78, text: "This agreement renews..." }]
```

### Visual grounding

```typescript
const result = await client.grounding.image({
  question: 'the invoice total',
  images: [{ url: 'https://example.com/invoice.png' }],
});
console.log(result.value);
// [{ label: "the invoice total", box: [562, 250, 875, 562], score: 0.98 }]
```

### Video grounding

```typescript
const result = await client.grounding.video({
  video: { url: 'https://example.com/clip.mp4' },
  query: 'the red car',
  kind: 'object',
});
console.log(result.hits);
```

### Data science decisions

```typescript
const result = await client.data.decide({
  question: 'Which analysis method fits this signal?',
  signals: [{ name: 'temperature', data: [[72.1, 73.5, 89.2, 91.0]], fs: 1 }],
  kind: 'choice',
  options: ['spectral analysis (FFT)', 'linear regression'],
});
console.log(result.value);
```

### Batch decisions

```typescript
const result = await client.batch.create({
  state: 'I was double-charged and support never replied.',
  questions: {
    team: {
      type: 'choice',
      instructions: 'Which team?',
      criteria: { billing: 'Billing disputes', tech: 'Product defects', sales: 'New purchases' },
    },
    urgent: {
      type: 'boolean',
      instructions: 'Is this urgent?',
    },
    risk: {
      type: 'score',
      instructions: 'Churn risk from 0 to 1',
      buckets: 5,
    },
  },
});
console.log(result.answers);
```

### Model discovery

```typescript
const models = await client.models.list();
console.log(models.models);

const caps = await client.models.capabilities();
console.log(caps.decision_types, caps.modalities);
```

## Configuration

```typescript
const client = new Bivia({
  apiKey: 'your-api-key',           // default: process.env.A8_API_KEY
  baseURL: 'https://custom.api/v1', // default: https://api.articul8.ai/bivia
  timeout: 60_000,                  // default: 120000 (2 minutes)
});
```

## Error handling

```typescript
import Bivia, {
  APIError,
  AuthenticationError,
  RateLimitError,
  UnprocessableEntityError,
} from '@articul8/bivia';

try {
  await client.decisions.boolean({ question: 'Is this urgent?' });
} catch (err) {
  if (err instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (err instanceof RateLimitError) {
    console.error('Rate limited, retry later');
  } else if (err instanceof UnprocessableEntityError) {
    console.error('Invalid request:', err.message);
  } else if (err instanceof APIError) {
    console.error('API error:', err.status, err.message);
  }
}
```

## Abstention

When the model is not confident enough, it abstains instead of guessing:

```typescript
const result = await client.decisions.boolean({
  question: 'Is this relevant?',
  state: 'Ambiguous context.',
});
if (result.status === 'abstained') {
  console.log('Model abstained:', result.abstain_reason);
  console.log('Distribution:', result.distribution);
} else {
  console.log('Answer:', result.value, 'P:', result.probability);
}
```

## Requirements

- Node.js >= 18.0.0 (uses native `fetch`)
- Zero runtime dependencies
