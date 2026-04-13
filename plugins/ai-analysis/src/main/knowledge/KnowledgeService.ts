/**
 * KnowledgeService – orchestrates the provider resolution chain:
 *   1. Try ApiKnowledgeProvider (company API)
 *   2. On failure → try KnowledgeCache (previously fetched data)
 *   3. On cache miss/expiry → try LocalKnowledgeProvider (user-imported file)
 *   4. All fail → return empty knowledge, status = unavailable
 */

import type {
  DomainKnowledgeContext,
  KnowledgeProviderStatus,
  KnowledgeFetchResult,
  NrcKnowledgeBase
} from '../../types/knowledge'
import type { ExpectationSpec } from '../../types/analysis'
import { ApiKnowledgeProvider } from './ApiKnowledgeProvider'
import { LocalKnowledgeProvider } from './LocalKnowledgeProvider'
import { KnowledgeCache } from './KnowledgeCache'

export class KnowledgeService {
  private readonly api: ApiKnowledgeProvider
  private readonly local: LocalKnowledgeProvider
  private readonly cache: KnowledgeCache

  private context: DomainKnowledgeContext = {
    nrcKnowledge: { entries: [] },
    messageMatrix: [],
    source: 'none',
    resolvedAt: 0
  }

  private currentStatus: KnowledgeProviderStatus = {
    source: 'none',
    status: 'unavailable',
    errorMessage: 'Knowledge not yet loaded'
  }

  constructor(pluginPath: string) {
    this.api = new ApiKnowledgeProvider()
    this.local = new LocalKnowledgeProvider()
    this.cache = new KnowledgeCache(pluginPath)
  }

  /**
   * Resolve knowledge using the priority chain.
   * Returns the resolved context and status.
   */
  async resolve(): Promise<KnowledgeFetchResult> {
    // --- Step 1: try company API ---
    try {
      const nrc = await this.api.fetchNrcKnowledge()
      const matrix = await this.api.fetchMessageMatrix()

      if (nrc.entries.length > 0 || matrix.length > 0) {
        // API returned something useful – persist to cache
        await this.cache.updateAndSave(nrc, matrix)
        this.context = this.buildContext(nrc, matrix, 'api')
        this.currentStatus = {
          source: 'api',
          status: 'connected',
          lastRefreshed: this.context.resolvedAt
        }
        return { context: this.context, status: this.currentStatus }
      }
    } catch {
      // API unavailable – fall through to cache
    }

    // --- Step 2: try local cache ---
    await this.cache.load()
    if (this.cache.isValid()) {
      const nrc = this.cache.getNrcKnowledge()
      const matrix = this.cache.getMessageMatrix()
      this.context = this.buildContext(nrc, matrix, 'cache')
      this.currentStatus = this.cache.getStatus()
      return { context: this.context, status: this.currentStatus }
    }

    // --- Step 3: try local import ---
    const localNrc = await this.local.fetchNrcKnowledge()
    const localMatrix = await this.local.fetchMessageMatrix()
    if (localNrc.entries.length > 0 || localMatrix.length > 0) {
      this.context = this.buildContext(localNrc, localMatrix, 'local')
      this.currentStatus = this.local.getStatus()
      return { context: this.context, status: this.currentStatus }
    }

    // --- Step 4: all failed ---
    this.context = { nrcKnowledge: { entries: [] }, messageMatrix: [], source: 'none', resolvedAt: Date.now() }
    this.currentStatus = {
      source: 'none',
      status: 'unavailable',
      errorMessage: 'No knowledge source available. Configure the company API or import a local file.'
    }
    return { context: this.context, status: this.currentStatus }
  }

  /** Force-refresh from API, bypassing the cache. */
  async forceRefresh(): Promise<KnowledgeFetchResult> {
    return this.resolve()
  }

  /** Load knowledge from a user-supplied local file. */
  async importLocalFile(filePath: string): Promise<KnowledgeFetchResult> {
    await this.local.loadFromFile(filePath)
    const nrc = await this.local.fetchNrcKnowledge()
    const matrix = await this.local.fetchMessageMatrix()
    this.context = this.buildContext(nrc, matrix, 'local')
    this.currentStatus = this.local.getStatus()
    return { context: this.context, status: this.currentStatus }
  }

  getStatus(): KnowledgeProviderStatus {
    return { ...this.currentStatus }
  }

  getContext(): DomainKnowledgeContext {
    return { ...this.context }
  }

  private buildContext(
    nrc: NrcKnowledgeBase,
    matrix: ExpectationSpec[],
    source: DomainKnowledgeContext['source']
  ): DomainKnowledgeContext {
    return { nrcKnowledge: nrc, messageMatrix: matrix, source, resolvedAt: Date.now() }
  }
}
