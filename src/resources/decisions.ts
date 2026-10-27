import type { Bivia } from '../client.js';
import type {
  BooleanParams,
  ChoiceParams,
  DecideParams,
  ScoreParams,
  SetParams,
  SpanParams,
  CategoricalDecision,
  ScoreDecision,
  SetDecision,
  SpanDecision,
} from '../types.js';

/**
 * Decision primitives: boolean, choice, decide, score, set, and span.
 *
 * Each method takes a question with optional context and returns a typed,
 * calibrated answer.
 */
export class DecisionsResource {
  private client: Bivia;

  constructor(client: Bivia) {
    this.client = client;
  }

  /** Yes/no decision with calibrated probability. */
  async boolean(params: BooleanParams): Promise<CategoricalDecision> {
    return this.client.post<CategoricalDecision>('/boolean', params);
  }

  /** Pick one from a list of choices with probability distribution. */
  async choice(params: ChoiceParams): Promise<CategoricalDecision> {
    return this.client.post<CategoricalDecision>('/choice', params);
  }

  /** Auto-detect the best decision type from the question. */
  async create(params: DecideParams): Promise<CategoricalDecision> {
    return this.client.post<CategoricalDecision>('/decide', params);
  }

  /** Numeric score on a scale with per-level probability mass. */
  async score(params: ScoreParams): Promise<ScoreDecision> {
    return this.client.post<ScoreDecision>('/score', params);
  }

  /** Multi-select: independent yes/no probability per option. */
  async multiSelect(params: SetParams): Promise<SetDecision> {
    return this.client.post<SetDecision>('/set', params);
  }

  /** Locate text spans in the input that answer the question. */
  async span(params: SpanParams): Promise<SpanDecision> {
    return this.client.post<SpanDecision>('/span', params);
  }
}
