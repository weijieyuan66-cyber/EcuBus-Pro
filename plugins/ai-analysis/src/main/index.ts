/**
 * AI Analysis plugin – main process entry point.
 *
 * Runs as a Node.js worker_thread inside EcuBus-Pro.
 * Registers RPC services callable from the renderer via callServerMethod().
 * Emits 'knowledgeReady' events to the renderer via emitEvent().
 *
 * Registered services:
 *   fetchKnowledge()                     → KnowledgeFetchResult
 *   refreshKnowledge()                   → KnowledgeFetchResult
 *   importLocalKnowledge(filePath)       → KnowledgeFetchResult
 *   getKnowledgeStatus()                 → KnowledgeProviderStatus
 */

import { registerService, emitEvent, getPluginPath } from '@ecubus-pro/main-plugin-sdk'
import { KnowledgeService } from './knowledge/KnowledgeService'
import type { KnowledgeFetchResult } from '../types/knowledge'

const pluginPath = getPluginPath()
const knowledgeService = new KnowledgeService(pluginPath)

// ---------------------------------------------------------------------------
// Service: fetchKnowledge
// Called by renderer on tab open (or manual refresh request).
// Runs the full resolution chain: API → cache → local → none.
// ---------------------------------------------------------------------------
registerService('fetchKnowledge', async (): Promise<KnowledgeFetchResult> => {
  const result = await knowledgeService.resolve()
  // Push the result to the renderer as an event so all open instances update
  emitEvent('knowledgeReady', result)
  return result
})

// ---------------------------------------------------------------------------
// Service: refreshKnowledge
// Forces a fresh fetch from the company API, bypassing the cache.
// ---------------------------------------------------------------------------
registerService('refreshKnowledge', async (): Promise<KnowledgeFetchResult> => {
  const result = await knowledgeService.forceRefresh()
  emitEvent('knowledgeReady', result)
  return result
})

// ---------------------------------------------------------------------------
// Service: importLocalKnowledge
// Called when the user selects a local knowledge file via the UI.
// ---------------------------------------------------------------------------
registerService('importLocalKnowledge', async (filePath: string): Promise<KnowledgeFetchResult> => {
  const result = await knowledgeService.importLocalFile(filePath)
  emitEvent('knowledgeReady', result)
  return result
})

// ---------------------------------------------------------------------------
// Service: getKnowledgeStatus
// Lightweight status poll – does NOT re-fetch knowledge.
// ---------------------------------------------------------------------------
registerService('getKnowledgeStatus', () => {
  return knowledgeService.getStatus()
})

// ---------------------------------------------------------------------------
// Lifecycle: start / stop
// EcuBus-Pro calls start() when global communication begins.
// We use this to trigger an initial knowledge resolution attempt.
// ---------------------------------------------------------------------------
registerService('start', async () => {
  // Silently resolve knowledge when the session starts
  try {
    const result = await knowledgeService.resolve()
    emitEvent('knowledgeReady', result)
  } catch {
    // Non-fatal – knowledge is optional for the session to proceed
  }
})

registerService('stop', () => {
  // Nothing to clean up in this phase
})
