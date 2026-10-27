import { Bivia } from './client.js';
export { Bivia } from './client.js';
export type { BiviaOptions } from './client.js';
export default Bivia;

// Resource classes
export {
  DecisionsResource,
  GroundingResource,
  BatchResource,
  DataResource,
  ModelsResource,
} from './resources/index.js';

// Error classes
export {
  APIError,
  BadRequestError,
  AuthenticationError,
  PermissionDeniedError,
  NotFoundError,
  UnprocessableEntityError,
  RateLimitError,
  InternalServerError,
  APIConnectionError,
} from './errors.js';

// All types
export type {
  // Input types
  ImageRef,
  AudioRef,
  DocumentRef,
  SignalRef,
  VideoRef,
  Mode,
  DecisionFields,

  // Request params
  BooleanParams,
  ChoiceParams,
  DecideParams,
  ScoreParams,
  SetParams,
  SpanParams,
  GroundParams,
  VideoGroundParams,
  DataDecisionParams,
  BatchQuestion,
  BatchParams,

  // Response types - shared
  Verification,
  EvidenceSpan,
  Evidence,
  DocumentNote,
  AbstainReason,

  // Response types - decision envelopes
  DecisionBase,
  CategoricalDecision,
  ScoreDecision,
  SetDecision,
  SpanDecision,
  GroundRegion,
  GroundDecision,
  VideoHit,
  VideoGroundDecision,

  // Batch response types
  BatchBooleanAnswer,
  BatchChoiceAnswer,
  BatchScoreAnswer,
  BatchSetAnswer,
  BatchBoxAnswer,
  BatchAnswer,
  BatchUsage,
  BatchResponse,

  // Model types
  Model,
  ModelList,
  ModalityCapability,
  Capabilities,
} from './types.js';
