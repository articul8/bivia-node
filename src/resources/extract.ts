import type { Bivia } from '../client.js';
import type { ExtractParams, ExtractManyParams, ExtractDecision } from '../types.js';

/**
 * Extract exact field values from documents, with character offsets.
 * Values are copied from the source, never paraphrased.
 */
export class ExtractResource {
  private client: Bivia;

  constructor(client: Bivia) {
    this.client = client;
  }

  /** Extract a single field value from the document. */
  async extract(params: ExtractParams): Promise<ExtractDecision> {
    return this.client.post<ExtractDecision>('/extract', params);
  }

  /** Extract multiple field values from the document in one call. */
  async extractMany(params: ExtractManyParams): Promise<ExtractDecision> {
    return this.client.post<ExtractDecision>('/extract', params);
  }
}
