import type { Bivia } from '../client.js';
import type { ModelList, Capabilities } from '../types.js';

/**
 * Model discovery and capability introspection.
 */
export class ModelsResource {
  private client: Bivia;

  constructor(client: Bivia) {
    this.client = client;
  }

  /** List available models on this deployment. */
  async list(): Promise<ModelList> {
    return this.client.get<ModelList>('/v1/models');
  }

  /** Discover available decision types, modalities, and capabilities. */
  async capabilities(): Promise<Capabilities> {
    return this.client.get<Capabilities>('/capabilities');
  }
}
