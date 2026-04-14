/**
 * sdk-shim.ts — Development-mode stub for @ecubus-pro/renderer-plugin-sdk.
 *
 * The real SDK is designed to run inside a wujie micro-frontend iframe hosted
 * by EcuBus-Pro.  It accesses host globals (window.parent.logBus,
 * window.parent.electron, window.$wujie) that do not exist when the plugin
 * renderer is opened as a plain Vite dev server.
 *
 * This shim is aliased in place of the real SDK ONLY when Vite runs in
 * serve (dev) mode (see vite.renderer.config.ts).  It re-exports every
 * public symbol from the SDK with safe fallback values so the UI renders
 * and navigates correctly during local development without a running host.
 */

import { reactive, ref } from 'vue'

// ---------------------------------------------------------------------------
// Minimal event-emitter shape (matches the mitt interface used by the SDK)
// ---------------------------------------------------------------------------

type Handler = (...args: unknown[]) => void

function createDevEventBus() {
  const map = new Map<string, Set<Handler>>()
  return {
    all: map,
    on(type: string, handler: Handler) {
      const handlers = map.get(type) ?? new Set()
      handlers.add(handler)
      map.set(type, handlers)
    },
    off(type: string, handler: Handler) {
      map.get(type)?.delete(handler)
    },
    emit(type: string, ...args: unknown[]) {
      map.get(type)?.forEach((h) => h(...args))
    }
  }
}

// ---------------------------------------------------------------------------
// Exported shim symbols
// ---------------------------------------------------------------------------

/** Standalone dev-mode event bus.  No host events will arrive. */
export const eventBus = createDevEventBus()

/** Always returns an empty reactive DataSet in dev mode. */
export function useData() {
  return reactive({})
}

/** Always returns false (hardware is not running) in dev mode. */
export function useGlobalStart() {
  return ref(false)
}

export function getPluginId(): string | undefined {
  return 'ecubus-ai-analysis-dev'
}

export function getEditIndex(): string | undefined {
  return 'dev'
}

/**
 * Simulates the RPC bridge to the plugin main process.
 * Returns plausible stub data so the UI renders meaningful placeholder state
 * without crashing.
 */
export async function callServerMethod(method: string, ..._params: unknown[]): Promise<unknown> {
  console.debug(`[sdk-shim] callServerMethod("${method}") — dev stub`)

  if (method === 'fetchKnowledge' || method === 'refreshKnowledge') {
    return {
      context: {
        nrcKnowledge: { entries: [] },
        messageMatrix: [],
        source: 'none',
        resolvedAt: Date.now()
      },
      status: {
        source: 'none',
        status: 'unavailable',
        errorMessage: '[Dev mode] No main process — run inside EcuBus-Pro for live knowledge.'
      }
    }
  }

  if (method === 'getKnowledgeStatus') {
    return {
      source: 'none',
      status: 'unavailable',
      errorMessage: '[Dev mode] No main process available.'
    }
  }

  return null
}

/** Subscribes via the dev event bus (no host events will fire). */
export function addPluginEventListen(event: string, callback: (...args: unknown[]) => void) {
  eventBus.on(`pluginEvent.ecubus-ai-analysis-dev.${event}`, callback)
}

export function removePluginEventListen(event: string, callback: (...args: unknown[]) => void) {
  eventBus.off(`pluginEvent.ecubus-ai-analysis-dev.${event}`, callback)
}

/** No-op in dev mode (no host to push plugin errors). */
export function addPluginErrorListen(_callback: (data: { msg: string; data?: unknown }) => void) {
  // noop
}

export function removePluginErrorListen(
  _callback: (data: { event: string; data: unknown }) => void
) {
  // noop
}
