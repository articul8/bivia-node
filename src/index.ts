import { Bivia } from './client.js';
export { Bivia } from './client.js';
export type { BiviaOptions } from './client.js';
export default Bivia;

// Resource classes
export {
  DecisionsResource,
  ExtractResource,
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
  ExtractParams,
  ExtractManyParams,
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
  BooleanDecision,
  ChoiceDecision,
  DecideDecision,
  CategoricalDecision,
  ScoreDecision,
  SetDecision,
  SpanDecision,
  ExtractValue,
  ExtractDecision,
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
