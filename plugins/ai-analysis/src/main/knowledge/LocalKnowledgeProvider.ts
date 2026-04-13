/**
 * LocalKnowledgeProvider – stub implementation.
 *
 * In a future phase this will parse a user-imported JSON or CSV file
 * containing NRC definitions and/or a message matrix.
 *
 * File format (JSON):
 * {
 *   "nrcKnowledge": { "entries": [...] },
 *   "messageMatrix": [...]
 * }
 */

import type {
  KnowledgeProviderAdapter,
  KnowledgeProviderStatus,
  NrcKnowledgeBase
} from '../../types/knowledge'
import type { ExpectationSpec } from '../../types/analysis'

export class LocalKnowledgeProvider implements KnowledgeProviderAdapter {
  private nrcKnowledge: NrcKnowledgeBase = { entries: [] }
  private messageMatrix: ExpectationSpec[] = []
  private filePath?: string
  private loadedAt?: number

  private get status(): KnowledgeProviderStatus {
    if (!this.filePath) {
      return {
        source: 'local',
        status: 'unavailable',
        errorMessage: 'No local knowledge file imported'
      }
    }
    return {
      source: 'local',
      status: 'local',
      lastRefreshed: this.loadedAt,
      cacheAgeMs: this.loadedAt ? Date.now() - this.loadedAt : undefined
    }
  }

  async loadFromFile(filePath: string): Promise<void> {
    // TODO Phase 1: implement JSON/CSV file parsing
    // const fs = await import('fs/promises')
    // const raw = await fs.readFile(filePath, 'utf-8')
    // const parsed = JSON.parse(raw)
    // this.nrcKnowledge = parsed.nrcKnowledge ?? { entries: [] }
    // this.messageMatrix = parsed.messageMatrix ?? []
    this.filePath = filePath
    this.loadedAt = Date.now()
  }

  async fetchNrcKnowledge(): Promise<NrcKnowledgeBase> {
    return this.nrcKnowledge
  }

  async fetchMessageMatrix(): Promise<ExpectationSpec[]> {
    return this.messageMatrix
  }

  getStatus(): KnowledgeProviderStatus {
    return { ...this.status }
  }

  async refresh(): Promise<void> {
    if (this.filePath) {
      await this.loadFromFile(this.filePath)
    }
  }
}
