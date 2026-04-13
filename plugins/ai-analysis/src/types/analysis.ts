/**
 * AI Analysis – shared type definitions for analysis concepts.
 *
 * These types define the data model that flows through the analysis engine.
 * Many are stubs awaiting full implementation in later phases.
 */

// ---------------------------------------------------------------------------
// Raw / decoded frame types (mirror host shapes for safe cross-boundary use)
// ---------------------------------------------------------------------------

export interface RawFrame {
  /** Timestamp in microseconds */
  ts: number
  /** CAN frame ID */
  id: number
  /** Raw payload bytes */
  data: Uint8Array
  /** Source DBC database name, if known */
  database?: string
  /** Decoded message name, if available */
  name?: string
  /** Decoded signals, keyed by signal name */
  signals?: Record<string, DecodedSignal>
}

export interface DecodedSignal {
  /** Physical (engineering) value */
  physValue: number | string
  /** Raw integer value */
  value: number
  unit?: string
}

export interface UdsFrame {
  ts: number
  /** UDS service ID */
  serviceId: number
  /** Whether this is a response (true) or request (false) */
  isResponse: boolean
  /** NRC byte if negative response (0x7F <sid> <nrc>), else undefined */
  nrc?: number
  /** Source address */
  sa?: number
  /** Target address */
  ta?: number
  data?: Uint8Array
}

// ---------------------------------------------------------------------------
// Expectation / validation types
// ---------------------------------------------------------------------------

/** Constraint on a specific signal or byte range within a message */
export interface ExpectedFieldConstraint {
  signalName?: string
  byteOffset?: number
  bitOffset?: number
  bitLength?: number
  type: 'fixed' | 'range' | 'enum'
  expectedValue?: number
  min?: number
  max?: number
  allowedValues?: number[]
}

/** Expected behaviour for one CAN/LIN message */
export interface ExpectedMessageSpec {
  /** CAN ID or LIN frame ID */
  messageId: number
  messageName?: string
  /** Which DBC/LDF database this message belongs to */
  database?: string
  /** Minimum expected cycle time in ms (undefined = no check) */
  minCycleMs?: number
  /** Maximum expected cycle time in ms (undefined = no check) */
  maxCycleMs?: number
  /** Expected source address (undefined = no check) */
  sourceAddress?: number
  fieldConstraints: ExpectedFieldConstraint[]
}

/** A named group of expected message behaviours */
export interface ExpectationSpec {
  id: string
  name: string
  description?: string
  messages: ExpectedMessageSpec[]
  enabled: boolean
}

/** A single observed violation against an expectation */
export interface DeviationEvent {
  id: string
  ts: number
  type:
    | 'missing_message'
    | 'unexpected_sa'
    | 'abnormal_cycle'
    | 'fixed_value_mismatch'
    | 'range_violation'
    | 'enum_violation'
  specId: string
  messageSpecId?: string
  observedValue?: unknown
  expectedValue?: unknown
  evidence?: RawFrame | UdsFrame
  severity: 'error' | 'warn' | 'info'
}

/** Aggregated result of all DeviationEvents for a session or window */
export interface ValidationSummary {
  deviations: DeviationEvent[]
  passingSpecs: string[]
  failingSpecs: string[]
  totalChecked: number
  totalPassed: number
  totalFailed: number
}

// ---------------------------------------------------------------------------
// Fault hint types
// ---------------------------------------------------------------------------

export interface FaultHint {
  id: string
  severity: 'critical' | 'error' | 'warn' | 'info'
  category: string
  description: string
  evidence: DeviationEvent[]
  nrcCorrelation?: NrcCorrelationResult
}

export interface FaultHintSummary {
  hints: FaultHint[]
  totalCount: number
  criticalCount: number
  warnCount: number
}

// ---------------------------------------------------------------------------
// NRC correlation types
// ---------------------------------------------------------------------------

export interface NrcCorrelationResult {
  nrc: number
  serviceId: number
  nrcEntry?: import('./knowledge').NrcEntry
  observedFrame: UdsFrame
  contextFrames: RawFrame[]
  hypotheses: RootCauseHypothesis[]
}

// ---------------------------------------------------------------------------
// Root cause / hypothesis types
// ---------------------------------------------------------------------------

export interface RootCauseHypothesis {
  id: string
  description: string
  /** 0–1 confidence score */
  confidence: number
  supportingEvidence: DeviationEvent[]
  nrcCorrelation?: NrcCorrelationResult
  /** Rule-based logic now; 'ai' reserved for future LLM integration */
  source: 'rule' | 'ai'
}

// ---------------------------------------------------------------------------
// Realtime analysis types
// ---------------------------------------------------------------------------

export interface RealtimeIssue {
  id: string
  type: DeviationEvent['type']
  description: string
  severity: 'error' | 'warn' | 'info'
  firstSeenTs: number
  lastSeenTs: number
  occurrenceCount: number
  relatedDeviations: DeviationEvent[]
}

export interface RealtimeAnalysisWindow {
  /** Sliding window size in milliseconds */
  windowMs: number
  frames: RawFrame[]
  activeDeviations: DeviationEvent[]
  issueList: RealtimeIssue[]
  lastUpdated: number
}

// ---------------------------------------------------------------------------
// Session analysis types
// ---------------------------------------------------------------------------

export interface SessionSummary {
  sessionId: string
  startTs: number
  endTs: number
  frameCount: number
  decodedSignalCount: number
  validationSummary: ValidationSummary
  faultHintSummary: FaultHintSummary
  /** Placeholder – will be populated when AI integration is added */
  aiAnalysisResult?: AIAnalysisResult
}

// ---------------------------------------------------------------------------
// AI analysis result (placeholder – no AI model yet)
// ---------------------------------------------------------------------------

export interface AIAnalysisResult {
  /** Human-readable analysis narrative */
  analysisText: string
  hypotheses: RootCauseHypothesis[]
  suggestedActions: string[]
  /** 0–1 confidence score */
  confidence: number
  modelUsed: string
  generatedAt: number
}

// ---------------------------------------------------------------------------
// Analysis context (shared runtime state)
// ---------------------------------------------------------------------------

export interface AnalysisContext {
  /** Reactive copy of the host DataSet (from useData()) */
  dataSet: unknown
  /** Whether hardware is running */
  globalStart: boolean
  knowledgeContext?: import('./knowledge').DomainKnowledgeContext
  sessionFrames: RawFrame[]
  realtimeWindow?: RealtimeAnalysisWindow
}

// ---------------------------------------------------------------------------
// Selected object context (for future contextual AI explanation)
// ---------------------------------------------------------------------------

export interface SelectedObjectContext {
  type: 'frame' | 'signal' | 'nrc' | 'hint'
  data: unknown
  timestamp: number
}
