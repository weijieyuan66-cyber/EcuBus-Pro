/**
 * ApiKnowledgeProvider – stub implementation.
 *
 * In a future phase this will make authenticated HTTP requests to the
 * company's knowledge API to fetch NRC definitions and the message matrix.
 *
 * For now it always returns empty collections and reports 'unavailable'.
 */

import type {
  KnowledgeProviderAdapter,
  KnowledgeProviderStatus,
  NrcKnowledgeBase,
  ApiProviderConfig
} from '../../types/knowledge'
import type { ExpectationSpec } from '../../types/analysis'

export class ApiKnowledgeProvider implements KnowledgeProviderAdapter {
  private status: KnowledgeProviderStatus = {
    source: 'api',
    status: 'unavailable',
    errorMessage: 'API endpoint not yet configured'
  }

  constructor(private readonly config?: ApiProviderConfig) {}

  async fetchNrcKnowledge(): Promise<NrcKnowledgeBase> {
    // TODO Phase 1: implement company API call
    // Example shape:
    //   GET ${this.config.baseUrl}/nrc-knowledge
    //   Authorization: Bearer ${this.config.apiKey}
    this.status = {
      source: 'api',
      status: 'unavailable',
      errorMessage: 'API endpoint not yet configured'
    }
    return { entries: [] }
  }

  async fetchMessageMatrix(): Promise<ExpectationSpec[]> {
    // TODO Phase 1: implement company API call
    // Example shape:
    //   GET ${this.config.baseUrl}/message-matrix
    return []
  }

  getStatus(): KnowledgeProviderStatus {
    return { ...this.status }
  }

  async refresh(): Promise<void> {
    await this.fetchNrcKnowledge()
    await this.fetchMessageMatrix()
  }
}
