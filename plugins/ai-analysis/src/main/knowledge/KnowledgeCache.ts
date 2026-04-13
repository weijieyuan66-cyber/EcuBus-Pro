/**
 * KnowledgeCache – stub implementation.
 *
 * In a future phase this will read/write a JSON file in the plugin's data
 * directory to persist API-fetched knowledge across sessions and provide
 * an offline fallback when the company API is unreachable.
 *
 * Cache file lives at: <pluginPath>/knowledge-cache.json
 */

import type { KnowledgeCacheFile, KnowledgeProviderStatus, NrcKnowledgeBase } from '../../types/knowledge'
import type { ExpectationSpec } from '../../types/analysis'

const DEFAULT_TTL_MS = 60 * 60 * 1000 // 1 hour

export class KnowledgeCache {
  private cacheFile?: KnowledgeCacheFile
  private cacheFilePath: string

  constructor(pluginPath: string) {
    // Path where the cache JSON will be persisted
    this.cacheFilePath = `${pluginPath}/knowledge-cache.json`
  }

  /** Load cache from disk. Returns false if no valid cache exists. */
  async load(): Promise<boolean> {
    // TODO Phase 1: implement fs.readFile + JSON.parse
    // try {
    //   const fs = await import('fs/promises')
    //   const raw = await fs.readFile(this.cacheFilePath, 'utf-8')
    //   this.cacheFile = JSON.parse(raw)
    //   return true
    // } catch { return false }
    return false
  }

  /** Persist current knowledge to disk. */
  async save(file: KnowledgeCacheFile): Promise<void> {
    // TODO Phase 1: implement fs.writeFile
    this.cacheFile = file
  }

  isValid(): boolean {
    if (!this.cacheFile) return false
    return Date.now() - this.cacheFile.fetchedAt < this.cacheFile.ttlMs
  }

  getNrcKnowledge(): NrcKnowledgeBase {
    return this.cacheFile?.nrcKnowledge ?? { entries: [] }
  }

  getMessageMatrix(): ExpectationSpec[] {
    return this.cacheFile?.messageMatrix ?? []
  }

  getStatus(): KnowledgeProviderStatus {
    if (!this.cacheFile) {
      return { source: 'cache', status: 'unavailable', errorMessage: 'No cache available' }
    }
    const ageMs = Date.now() - this.cacheFile.fetchedAt
    return {
      source: 'cache',
      status: 'cached',
      lastRefreshed: this.cacheFile.fetchedAt,
      cacheAgeMs: ageMs
    }
  }

  async updateAndSave(
    nrcKnowledge: NrcKnowledgeBase,
    messageMatrix: ExpectationSpec[]
  ): Promise<void> {
    const file: KnowledgeCacheFile = {
      source: 'api',
      fetchedAt: Date.now(),
      ttlMs: DEFAULT_TTL_MS,
      nrcKnowledge,
      messageMatrix
    }
    await this.save(file)
  }
}
