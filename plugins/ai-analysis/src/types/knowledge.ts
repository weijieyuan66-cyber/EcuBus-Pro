/**
 * AI Analysis – knowledge provider type definitions.
 *
 * Defines the abstraction layer over different knowledge sources
 * (company API, local import, local cache).
 */

import type { ExpectationSpec } from './analysis'

// ---------------------------------------------------------------------------
// Source / status enums
// ---------------------------------------------------------------------------

export type KnowledgeSourceType = 'api' | 'cache' | 'local' | 'none'

export interface KnowledgeProviderStatus {
  source: KnowledgeSourceType
  status: 'connected' | 'cached' | 'local' | 'unavailable'
  lastRefreshed?: number
  errorMessage?: string
  /** Milliseconds since last successful refresh */
  cacheAgeMs?: number
}

// ---------------------------------------------------------------------------
// NRC knowledge base
// ---------------------------------------------------------------------------

export interface NrcEntry {
  /** NRC hex code, e.g. 0x22 */
  nrc: number
  /** Short name, e.g. "conditionsNotCorrect" */
  name: string
  /** Full description of the negative response */
  description: string
  likelyCauses?: string[]
  suggestedActions?: string[]
  /** Which UDS service IDs this NRC is associated with (optional) */
  serviceIds?: number[]
}

export interface NrcKnowledgeBase {
  entries: NrcEntry[]
  version?: string
  /** ISO timestamp of when this knowledge was last fetched */
  fetchedAt?: string
}

// ---------------------------------------------------------------------------
// Resolved domain knowledge
// ---------------------------------------------------------------------------

export interface DomainKnowledgeContext {
  nrcKnowledge: NrcKnowledgeBase
  messageMatrix: ExpectationSpec[]
  source: KnowledgeSourceType
  resolvedAt: number
}

// ---------------------------------------------------------------------------
// Provider adapter interface
// ---------------------------------------------------------------------------

/**
 * Abstract interface for any knowledge source.
 *
 * Implementations:
 *   - ApiKnowledgeProvider   – fetches from company API
 *   - LocalKnowledgeProvider – reads from locally imported file
 *   - KnowledgeCache         – reads/writes a local JSON cache file
 */
export interface KnowledgeProviderAdapter {
  fetchNrcKnowledge(): Promise<NrcKnowledgeBase>
  fetchMessageMatrix(): Promise<ExpectationSpec[]>
  getStatus(): KnowledgeProviderStatus
  refresh(): Promise<void>
}

// ---------------------------------------------------------------------------
// Cache file format
// ---------------------------------------------------------------------------

export interface KnowledgeCacheFile {
  source: KnowledgeSourceType
  fetchedAt: number
  ttlMs: number
  nrcKnowledge: NrcKnowledgeBase
  messageMatrix: ExpectationSpec[]
}

// ---------------------------------------------------------------------------
// API provider config
// ---------------------------------------------------------------------------

export interface ApiProviderConfig {
  baseUrl: string
  apiKey?: string
  timeoutMs?: number
}

// ---------------------------------------------------------------------------
// IPC payload shapes (used between main process and renderer)
// ---------------------------------------------------------------------------

export interface KnowledgeFetchResult {
  context: DomainKnowledgeContext
  status: KnowledgeProviderStatus
}
