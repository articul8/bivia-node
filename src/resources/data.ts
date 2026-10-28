import type { Bivia } from '../client.js';
import type { DataDecisionParams, CategoricalDecision } from '../types.js';

/**
 * Data science decisions from raw numeric signals.
 */
export class DataResource {
  private client: Bivia;

  constructor(client: Bivia) {
    this.client = client;
  }

  /**
   * Make a decision based on raw numeric signals. The server profiles the
   * signal data and folds the analysis into context before deciding.
   */
  async decide(params: DataDecisionParams): Promise<CategoricalDecision> {
    return this.client.post<CategoricalDecision>('/ds', params);
  }
}
