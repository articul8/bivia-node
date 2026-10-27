import { APIError, APIConnectionError } from './errors.js';
import { DecisionsResource } from './resources/decisions.js';
import { GroundingResource } from './resources/grounding.js';
import { BatchResource } from './resources/batch.js';
import { DataResource } from './resources/data.js';
import { ModelsResource } from './resources/models.js';

/** Options for constructing a Bivia client. */
export interface BiviaOptions {
  /** API key. Defaults to `process.env.A8_API_KEY`. */
  apiKey?: string;
  /** Base URL for the API. Defaults to `https://api.articul8.ai/bivia`. */
  baseURL?: string;
  /** Request timeout in milliseconds. Defaults to 120000 (2 minutes). */
  timeout?: number;
}

/**
 * Client for the Bivia calibrated decision engine.
 *
 * ```ts
 * import Bivia from '@articul8/bivia';
 * const client = new Bivia(); // reads $A8_API_KEY
 * ```
 */
export class Bivia {
  readonly apiKey: string;
  readonly baseURL: string;
  readonly timeout: number;

  readonly decisions: DecisionsResource;
  readonly grounding: GroundingResource;
  readonly batch: BatchResource;
  readonly data: DataResource;
  readonly models: ModelsResource;

  constructor(options: BiviaOptions = {}) {
    const apiKey = options.apiKey ?? process.env['A8_API_KEY'];
    if (!apiKey) {
      throw new Error(
        'Missing API key. Pass it as `apiKey` or set the A8_API_KEY environment variable.',
      );
    }
    this.apiKey = apiKey;
    this.baseURL = (options.baseURL ?? 'https://api.articul8.ai/bivia').replace(/\/+$/, '');
    this.timeout = options.timeout ?? 120_000;

    this.decisions = new DecisionsResource(this);
    this.grounding = new GroundingResource(this);
    this.batch = new BatchResource(this);
    this.data = new DataResource(this);
    this.models = new ModelsResource(this);
  }

  /** @internal Send a POST request and return the parsed JSON response. */
  async post<T>(path: string, body: unknown): Promise<T> {
    return this._request<T>('POST', path, body);
  }

  /** @internal Send a GET request and return the parsed JSON response. */
  async get<T>(path: string): Promise<T> {
    return this._request<T>('GET', path);
  }

  private async _request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseURL}${path}`;
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Accept': 'application/json',
    };
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(this.timeout),
      });
    } catch (err) {
      if (err instanceof Error && err.name === 'TimeoutError') {
        throw new APIConnectionError(`Request timed out after ${this.timeout}ms`, err);
      }
      throw new APIConnectionError(
        `Connection error: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err : undefined,
      );
    }

    if (!response.ok) {
      throw await APIError.fromResponse(response);
    }

    return (await response.json()) as T;
  }
}
