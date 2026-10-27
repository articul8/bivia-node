import type { Bivia } from '../client.js';
import type { BatchParams, BatchResponse } from '../types.js';

/**
 * Batch decisions: multiple typed questions against the same context.
 */
export class BatchResource {
  private client: Bivia;

  constructor(client: Bivia) {
    this.client = client;
  }

  /** Send multiple typed questions in one request. Each is independently answered. */
  async create(params: BatchParams): Promise<BatchResponse> {
    return this.client.post<BatchResponse>('/v1/systemone', params);
  }
}
