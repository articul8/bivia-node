// ---------------------------------------------------------------------------
// Shared input types
// ---------------------------------------------------------------------------

/** An image reference: provide either `url` or `b64` (with `mime`). */
export interface ImageRef {
  /** Public HTTP(S) image URL. */
  url?: string;
  /** Base64-encoded image bytes. */
  b64?: string;
  /** MIME type for `b64` content (default: `image/png`). */
  mime?: string;
}

/** An audio clip reference: provide either `url` or `b64` (with `mime`). */
export interface AudioRef {
  /** Public HTTP(S) audio URL. */
  url?: string;
  /** Base64-encoded audio bytes. */
  b64?: string;
  /** MIME type for `b64` content (default: `audio/wav`). */
  mime?: string;
}

/** A document reference for context. */
export interface DocumentRef {
  /** Public HTTP(S) URL to fetch the document from. */
  url?: string;
  /** Base64-encoded file bytes. */
  b64?: string;
  /** Filename hint for format detection (e.g., `memo.txt`). */
  filename?: string;
  /** MIME type of the document. */
  mime?: string;
}

/** A raw numeric signal for data-science decisions. */
export interface SignalRef {
  /** Human-readable name for the signal. */
  name?: string;
  /** Signal data as `[channels][timesteps]` (list of lists). */
  data: number[][];
  /** Number of channels (required when `data` is a base64 buffer). */
  channels?: number;
  /** Sample rate in Hz. */
  fs?: number;
  /** Data type when `data` is a base64 buffer. */
  dtype?: string;
}

/** A video clip reference. */
export interface VideoRef {
  /** Public HTTP(S) video URL. */
  url?: string;
  /** Base64-encoded video bytes. */
  b64?: string;
  /** MIME type (default: `video/mp4`). */
  mime?: string;
  /** Downscale frame long edge to this size before processing (64-1792, default: 896). */
  max_edge?: number;
}

// ---------------------------------------------------------------------------
// Common decision fields
// ---------------------------------------------------------------------------

/** Inference mode. */
export type Mode = 'fast' | 'deep';

/** Fields common to all decision request types. */
export interface DecisionFields {
  /** Text context for the decision. */
  state?: string;
  /** Images to include as context. */
  images?: ImageRef[];
  /** Audio clips to include as context. */
  audio?: AudioRef[];
  /** Documents to include as context. */
  documents?: DocumentRef[];
  /** The question to decide. */
  question: string;
  /** Optional domain hint (e.g., `finance`). */
  domain?: string;
  /** Inference mode: `fast` (default) or `deep`. */
  mode?: Mode;
  /** Whether to allow a reasoning trace before deciding (default: `true`). */
  think?: boolean;
  /** Whether the model may abstain if it lacks confidence (default: `true`). */
  allow_abstain?: boolean;
}

// ---------------------------------------------------------------------------
// Decision request params
// ---------------------------------------------------------------------------

/** Parameters for `POST /boolean`. */
export interface BooleanParams extends DecisionFields {}

/** Parameters for `POST /choice`. */
export interface ChoiceParams extends DecisionFields {
  /** The options to choose from (2-26 items). */
  choices: (string | number | boolean)[];
}

/** Parameters for `POST /decide`. */
export interface DecideParams extends DecisionFields {
  /** Candidate outcomes (2-26 items). When omitted, the model infers options. */
  outcomes?: (string | number | boolean)[];
}

/** Parameters for `POST /score`. */
export interface ScoreParams extends DecisionFields {
  /** Inclusive `[low, high]` of the numeric scale (default: `[0, 1]`). */
  range?: [number, number];
  /** Number of evenly spaced levels on the scale (default: 11, minimum: 2). */
  buckets?: number;
}

/** Parameters for `POST /set`. */
export interface SetParams extends DecisionFields {
  /** The options to select from (zero or more may be selected). */
  options: (string | number | boolean)[];
}

/** Parameters for `POST /span`. */
export interface SpanParams {
  /** The text to search for spans in. */
  state?: string;
  /** Images (spans are still character ranges into `state`). */
  images?: ImageRef[];
  /** Documents. */
  documents?: DocumentRef[];
  /** What to locate in the text. */
  question: string;
  /** Optional domain hint. */
  domain?: string;
}

/** Parameters for `POST /extract` (single field). */
export interface ExtractParams {
  /** Text context to extract from. */
  state?: string;
  /** Documents to extract from. */
  documents?: DocumentRef[];
  /** The field to extract. */
  question: string;
}

/** Parameters for `POST /extract` (multiple fields). */
export interface ExtractManyParams {
  /** Text context to extract from. */
  state?: string;
  /** Documents to extract from. */
  documents?: DocumentRef[];
  /** Fields to extract. */
  fields: string[];
}

/** Parameters for `POST /ground`. */
export interface GroundParams {
  /** What to find (e.g., "the invoice total"). Empty detects regions broadly. */
  question?: string;
  /** The image(s) to search. */
  images?: ImageRef[];
  /** Documents. */
  documents?: DocumentRef[];
  /** Text context. */
  state?: string;
  /** Optional domain hint. */
  domain?: string;
}

/** Parameters for `POST /ground/video`. */
export interface VideoGroundParams {
  /** The video clip to scan. */
  video: VideoRef;
  /** What to find in the video. */
  query: string;
  /** `object` (temporal intervals with boxes) or `event` (onset timestamps). */
  kind?: 'object' | 'event';
  /** Seconds between coarse scan samples (default: 5.0). */
  coarse_step?: number;
  /** Seconds between fine scan samples within detected intervals (default: 0.5). */
  fine_resolution?: number;
  /** Whether to return per-frame bounding boxes on hit intervals (default: `true`). */
  boxes_on_hits?: boolean;
  /** Maximum number of frames to probe (default: 200). */
  max_probes?: number;
  /** Whether the model may abstain (default: `true`). */
  allow_abstain?: boolean;
}

/** Parameters for `POST /ds`. */
export interface DataDecisionParams {
  /** Raw numeric signals to analyze. */
  signals?: SignalRef[];
  /** Text context. */
  state?: string;
  /** Images. */
  images?: ImageRef[];
  /** Documents. */
  documents?: DocumentRef[];
  /** The question to decide. */
  question: string;
  /** Candidate answers. Required for useful `choice` or `set` results. */
  options?: (string | number | boolean)[];
  /** Which decision type to use: `set` (default), `choice`, or `boolean`. */
  kind?: 'set' | 'choice' | 'boolean';
  /** Optional domain hint. */
  domain?: string;
  /** Inference mode. */
  mode?: Mode;
  /** Whether to allow reasoning (default: `true`). */
  think?: boolean;
  /** Whether the model may abstain (default: `true`). */
  allow_abstain?: boolean;
}

// ---------------------------------------------------------------------------
// Batch request types
// ---------------------------------------------------------------------------

/** A single question in a batch request. */
export interface BatchQuestion {
  /** Question type: `boolean`/`noul`/`bool`, `choice`, `score`, `set`, `box`. */
  type?: string;
  /** The question text. */
  instructions?: string;
  /** Alternative to `instructions`. */
  question?: string;
  /** Choice options as a map (key -> description) or an array of names. */
  criteria?: Record<string, string> | (string | number | boolean)[];
  /** Choice names (used when `criteria` is empty). */
  options?: (string | number | boolean)[];
  /** Score bucket labels (array length sets the bucket count). */
  levels?: string[] | null;
  /** Score bucket count when `levels` is not provided (default: 11, minimum: 2). */
  buckets?: number;
}

/** Parameters for `POST /v1/systemone`. */
export interface BatchParams {
  /** Model identifier (accepted for compatibility; response is always `dec-1`). */
  model?: string;
  /** Shared text context. */
  state?: string;
  /** Shared images. */
  images?: ImageRef[];
  /** Shared audio clips. */
  audio?: AudioRef[];
  /** Shared documents. */
  documents?: DocumentRef[];
  /** Shared raw signals. */
  signals?: SignalRef[];
  /** Map of question name to typed question definition. */
  questions: Record<string, BatchQuestion>;
  /** Inference mode. */
  mode?: Mode;
}

// ---------------------------------------------------------------------------
// Response types - shared
// ---------------------------------------------------------------------------

/** Verification result from deep mode. */
export interface Verification {
  /** Whether the verification step ran. */
  performed: boolean;
  /** Verification outcome. */
  result: 'passed' | 'conflict' | 'insufficient' | 'not_applicable';
}

/** A character-offset span in the input text. */
export interface EvidenceSpan {
  /** Inclusive character offset into the `state` text. */
  start: number;
  /** Exclusive character offset. */
  end: number;
  /** The quoted substring. */
  text: string;
}

/** Evidence supporting the decision. */
export interface Evidence {
  /** Character ranges in the input text that support the decision. */
  spans: EvidenceSpan[];
}

/** Per-document extraction status. */
export interface DocumentNote {
  /** Filename or URL of the document. */
  document: string;
  /** Extraction status. */
  status: 'included' | 'truncated' | 'skipped';
  /** Number of characters extracted. */
  chars?: number;
  /** Number of tokens. */
  tokens?: number;
  /** Whether the document was truncated. */
  truncated?: boolean;
  /** Why the document was truncated or skipped. */
  reason?: string;
}

/** Why the model abstained. */
export type AbstainReason =
  | 'low_confidence'
  | 'readout_disagreement'
  | 'insufficient_evidence'
  | 'unresolved_after_thinking'
  | null;

// ---------------------------------------------------------------------------
// Response types - decision envelopes
// ---------------------------------------------------------------------------

/** Base fields present on every decision response. */
export interface DecisionBase {
  /** The decision type that produced this answer. */
  type: string;
  /** `answered` or `abstained`. */
  status: 'answered' | 'abstained';
  /** Why the model abstained (null when answered). */
  abstain_reason: AbstainReason;
  /** Inference mode used. */
  mode: 'fast' | 'deep';
  /** Whether thinking was allowed. */
  think_allowed?: boolean;
  /** Whether a reasoning trace was generated. */
  thought: boolean;
  /** Verification result. */
  verification: Verification;
  /** Evidence supporting the decision. */
  evidence: Evidence;
  /** Server-side processing time in milliseconds. */
  latency_ms: number;
  /** The model that produced this decision. */
  model: string;
  /** Total tokens processed. */
  input_tokens?: number;
  /** Image-specific token count. */
  image_tokens?: number;
  /** Document-specific token count. */
  document_tokens?: number;
  /** Billing token count (`max(1000, input_tokens)`). */
  billable_tokens?: number;
  /** Per-document extraction notes. */
  document_notes?: DocumentNote[];
}

/** Response from `/boolean`. */
export interface BooleanDecision extends DecisionBase {
  type: 'boolean';
  /** `"yes"`, `"no"`, or `null` when abstained. */
  value: 'yes' | 'no' | null;
  /** P(value). Omitted when the model abstains. */
  probability?: number;
  /** Probability of `yes` and `no`, summing to 1. */
  distribution: { yes: number; no: number };
}

/** Response from `/choice`. */
export interface ChoiceDecision extends DecisionBase {
  type: 'choice';
  /** The chosen option, or `null` when abstained. */
  value: string | null;
  /** P(value). Omitted when the model abstains. */
  probability?: number;
  /** Probability of each option, summing to 1. */
  distribution: Record<string, number>;
}

/** Response from `/decide`. */
export interface DecideDecision extends DecisionBase {
  type: 'decide';
  /** The chosen value, or `null` when abstained. */
  value: string | null;
  /** P(value). Omitted when the model abstains. */
  probability?: number;
  /** Probability of each option, summing to 1. */
  distribution: Record<string, number>;
}

/** Union of boolean, choice, and decide responses. */
export type CategoricalDecision = BooleanDecision | ChoiceDecision | DecideDecision;

/** Response from `/score`. */
export interface ScoreDecision extends DecisionBase {
  type: 'score';
  /** Expected value on the requested range, or `null` when abstained. */
  value: number | null;
  /** Per-level probability mass. */
  levels: Record<string, number>;
}

/** Response from `/set`. */
export interface SetDecision extends DecisionBase {
  type: 'set';
  /** Options with probability >= 0.5, in request order. */
  value: (string | number | boolean)[];
  /** Independent P(option applies) for each option. */
  probabilities: Record<string, number>;
}

/** Response from `/span`. */
export interface SpanDecision extends DecisionBase {
  type: 'span';
  /** Text spans found in the input. */
  value: EvidenceSpan[];
}

/** A detected region in an image. */
export interface GroundRegion {
  /** Label of the detected object. */
  label: string;
  /** `[x1, y1, x2, y2]` coordinates normalized to `[0, 1000]`. */
  box: [number, number, number, number];
  /** Detection confidence. */
  score?: number;
}

/** Response from `/ground`. Does not include the full decision envelope. */
export interface GroundDecision {
  type: 'ground';
  /** Detected regions. Empty array when nothing found. */
  value: GroundRegion[];
  /** Number of regions found. */
  count: number;
  /** Whether any regions were detected. */
  found: boolean;
  /** Always `true` for grounding responses. */
  grounded: boolean;
  /** Total tokens processed. */
  input_tokens?: number;
  /** Image-specific token count. */
  image_tokens?: number;
  /** Billing token count. */
  billable_tokens?: number;
}

/** A single extracted field value. */
export interface ExtractValue {
  /** The extracted value, copied from the source. Null when not found. */
  value: string | null;
  /** Inclusive character offset into the source text. */
  start?: number;
  /** Exclusive character offset. */
  end?: number;
  /** Extraction confidence. */
  confidence?: number;
  /** Whether the field was found in the source. */
  found: boolean;
}

/** Response from `POST /extract`. */
export interface ExtractDecision {
  type: 'extract';
  /** Extracted field values keyed by field name. */
  values: Record<string, ExtractValue>;
  /** Always `true` — extractions are grounded in the source. */
  grounded: boolean;
}

/** A temporal hit in a video scan. */
export interface VideoHit {
  /** Start time in seconds (object kind). */
  start?: number;
  /** End time in seconds (object kind). */
  end?: number;
  /** Peak confidence time (object kind). */
  peak_t?: number;
  /** Onset time in seconds (event kind). */
  onset_t?: number;
  /** Detection confidence. */
  confidence: number;
  /** Per-frame bounding boxes (object kind, when `boxes_on_hits` is true). */
  boxes?: GroundRegion[];
}

/** Response from `/ground/video`. */
export interface VideoGroundDecision {
  type: 'video_ground';
  /** `object` or `event`. */
  kind: 'object' | 'event';
  /** Total clip duration in seconds. */
  duration_s: number;
  /** Number of frames probed. */
  scanned?: number;
  /** Whether scanning was truncated by `max_probes`. */
  truncated?: boolean;
  /** Detected intervals or events. */
  hits: VideoHit[];
  /** Total tokens processed. */
  input_tokens?: number;
  /** Image-specific token count. */
  image_tokens?: number;
  /** Billing token count. */
  billable_tokens?: number;
}

// ---------------------------------------------------------------------------
// Batch response types
// ---------------------------------------------------------------------------

/** Batch boolean answer. */
export interface BatchBooleanAnswer {
  type: 'noul';
  /** P(yes) in [0, 1]. */
  noul?: number;
  /** Same as `noul`. */
  probability?: number;
  confidence: number | null;
  abstained: boolean;
}

/** Batch choice answer. */
export interface BatchChoiceAnswer {
  type: 'choice';
  /** The selected choice. */
  choice: string | number | boolean | null;
  /** P(choice). Null when abstained. */
  confidence: number | null;
  /** Per-option probabilities. */
  probabilities?: Record<string, number>;
  abstained: boolean;
}

/** Batch score answer. */
export interface BatchScoreAnswer {
  type: 'score';
  /** Expected value on [0, 1]. Null when abstained. */
  score: number | null;
  confidence: number | null;
  /** Index to label mapping. */
  legend?: Record<string, string>;
  /** Per-bucket probabilities. */
  probabilities?: Record<string, number>;
  /** Per-level distribution. */
  distribution?: Record<string, number>;
  abstained: boolean;
}

/** Batch set answer. */
export interface BatchSetAnswer {
  type: 'set';
  /** Options selected (probability >= 0.5). */
  selected: (string | number | boolean)[];
  /** Per-option probabilities. */
  probabilities?: Record<string, number>;
  abstained: boolean;
}

/** Batch box answer (visual grounding). */
export interface BatchBoxAnswer {
  type: 'box';
  /** Normalized [0, 1] bounding box. Null when abstained. */
  box: { left: number; top: number; right: number; bottom: number } | null;
  /** Label. */
  label?: string;
  confidence: number | null;
  abstained: boolean;
}

/** Any batch answer type. */
export type BatchAnswer =
  | BatchBooleanAnswer
  | BatchChoiceAnswer
  | BatchScoreAnswer
  | BatchSetAnswer
  | BatchBoxAnswer;

/** Batch usage statistics. */
export interface BatchUsage {
  /** Number of questions in the batch. */
  questions: number;
  /** Sum of per-question input tokens. */
  input_tokens: number;
  /** Typically 0 for decision readouts. */
  output_tokens?: number;
  /** Sum of per-question billing token minimums. */
  billable_tokens: number;
}

/** Response from `POST /v1/systemone`. */
export interface BatchResponse {
  model: string;
  /** Answers keyed by the question names from the request. */
  answers: Record<string, BatchAnswer>;
  usage: BatchUsage;
}

// ---------------------------------------------------------------------------
// Models response types
// ---------------------------------------------------------------------------

/** A model entry. */
export interface Model {
  name: string;
  description?: string;
  release_date?: string;
}

/** Response from `GET /v1/models`. */
export interface ModelList {
  models: Model[];
}

/** Modality capability flags. */
export interface ModalityCapability {
  available: boolean;
  grounding_available?: boolean;
}

/** Response from `GET /capabilities`. */
export interface Capabilities {
  model: string;
  /** Supported decision types. */
  decision_types: string[];
  /** Available input modalities. */
  modalities: Record<string, ModalityCapability>;
  /** Supported evidence types. */
  evidence: Record<string, boolean>;
  /** Whether abstention is enabled. */
  abstention: boolean;
}
