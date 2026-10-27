import type { Bivia } from '../client.js';
import type {
  GroundParams,
  VideoGroundParams,
  GroundDecision,
  VideoGroundDecision,
} from '../types.js';

/**
 * Visual grounding: locate objects in images and video.
 */
export class GroundingResource {
  private client: Bivia;

  constructor(client: Bivia) {
    this.client = client;
  }

  /** Find objects in images matching the question. Returns bounding boxes. */
  async image(params: GroundParams): Promise<GroundDecision> {
    return this.client.post<GroundDecision>('/ground', params);
  }

  /** Find objects or events in a video clip. Returns temporal intervals and/or bounding boxes. */
  async video(params: VideoGroundParams): Promise<VideoGroundDecision> {
    return this.client.post<VideoGroundDecision>('/ground/video', params);
  }
}
