<template>
  <div class="ai-analysis-root">
    <!-- ── Header ── -->
    <div class="aa-header">
      <span class="aa-title">🧠 AI Analysis</span>
      <el-tag :type="globalStart ? 'success' : 'info'" size="small" class="aa-run-badge">
        {{ globalStart ? 'Running' : 'Stopped' }}
      </el-tag>
    </div>

    <!-- ── Scrollable body ── -->
    <div class="aa-body">

      <!-- ① Knowledge Provider Section -->
      <KnowledgeStatusBar
        :status="knowledgeStatus"
        :context="knowledgeContext"
        :loading="knowledgeLoading"
        @refresh="handleRefreshKnowledge"
        @import="handleImportKnowledge"
      />

      <!-- ② Status cards row -->
      <div class="aa-cards">

        <!-- NRC Status -->
        <el-card class="aa-card" shadow="never">
          <template #header>
            <span class="aa-card-title">NRC Status</span>
          </template>
          <div class="aa-card-body">
            <div v-if="nrcEntryCount > 0" class="aa-stat-row">
              <el-tag type="success" size="small">Loaded</el-tag>
              <span class="aa-stat-label">{{ nrcEntryCount }} NRC entries</span>
            </div>
            <div v-else class="aa-stat-row">
              <el-tag type="warning" size="small">No data</el-tag>
              <span class="aa-stat-label aa-muted">Load knowledge to enable NRC reasoning</span>
            </div>
          </div>
        </el-card>

        <!-- Message Matrix Status -->
        <el-card class="aa-card" shadow="never">
          <template #header>
            <span class="aa-card-title">Message Matrix</span>
          </template>
          <div class="aa-card-body">
            <div v-if="matrixCount > 0" class="aa-stat-row">
              <el-tag type="success" size="small">Loaded</el-tag>
              <span class="aa-stat-label">{{ matrixCount }} expectation specs</span>
            </div>
            <div v-else class="aa-stat-row">
              <el-tag type="warning" size="small">No data</el-tag>
              <span class="aa-stat-label aa-muted">Load knowledge to enable validation</span>
            </div>
          </div>
        </el-card>

      </div>

      <!-- ③ Realtime Stream Section -->
      <RealtimeStreamSection
        :global-start="globalStart"
        :frame-count="realtimeFrameCount"
        :uds-frame-count="realtimeUdsFrameCount"
      />

      <!-- ④ Validation Summary (placeholder) -->
      <ValidationSummarySection :summary="validationSummary" />

      <!-- ⑤ Fault Hints (placeholder) -->
      <FaultHintSection :summary="faultHintSummary" />

      <!-- ⑥ AI Analysis (placeholder) -->
      <AIAnalysisSection />

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  useGlobalStart,
  callServerMethod,
  addPluginEventListen,
  removePluginEventListen,
  eventBus
} from '@ecubus-pro/renderer-plugin-sdk'

import KnowledgeStatusBar from './components/KnowledgeStatusBar.vue'
import RealtimeStreamSection from './components/RealtimeStreamSection.vue'
import ValidationSummarySection from './components/ValidationSummarySection.vue'
import FaultHintSection from './components/FaultHintSection.vue'
import AIAnalysisSection from './components/AIAnalysisSection.vue'

import type { KnowledgeProviderStatus, DomainKnowledgeContext, KnowledgeFetchResult } from '../../types/knowledge'
import type { ValidationSummary, FaultHintSummary } from '../../types/analysis'

// ---------------------------------------------------------------------------
// Reactive state
// ---------------------------------------------------------------------------

const globalStart = useGlobalStart()
const knowledgeLoading = ref(false)

const knowledgeStatus = ref<KnowledgeProviderStatus>({
  source: 'none',
  status: 'unavailable',
  errorMessage: 'Knowledge not yet loaded'
})

const knowledgeContext = ref<DomainKnowledgeContext | null>(null)

// Realtime frame counters (wired to the host logBus event stream)
const realtimeFrameCount = ref(0)
const realtimeUdsFrameCount = ref(0)

// Placeholder summaries — will be populated by future validation engine
const validationSummary = ref<ValidationSummary | null>(null)
const faultHintSummary = ref<FaultHintSummary | null>(null)

// ---------------------------------------------------------------------------
// Derived values
// ---------------------------------------------------------------------------

const nrcEntryCount = computed(
  () => knowledgeContext.value?.nrcKnowledge?.entries?.length ?? 0
)
const matrixCount = computed(
  () => knowledgeContext.value?.messageMatrix?.length ?? 0
)

// ---------------------------------------------------------------------------
// Knowledge provider integration
// ---------------------------------------------------------------------------

function applyKnowledgeResult(result: KnowledgeFetchResult) {
  knowledgeStatus.value = result.status
  knowledgeContext.value = result.context
}

async function handleRefreshKnowledge() {
  knowledgeLoading.value = true
  try {
    const result = await callServerMethod('refreshKnowledge') as KnowledgeFetchResult
    applyKnowledgeResult(result)
  } catch (err) {
    knowledgeStatus.value = {
      source: 'none',
      status: 'unavailable',
      errorMessage: String(err)
    }
  } finally {
    knowledgeLoading.value = false
  }
}

async function handleImportKnowledge() {
  // TODO Phase 1: open file dialog via callServerMethod or electron IPC,
  // then call importLocalKnowledge(filePath)
  // For now, show a placeholder message
  console.log('[AI Analysis] importLocalKnowledge: not yet implemented')
}

// ---------------------------------------------------------------------------
// Realtime data wiring
// ---------------------------------------------------------------------------
// The host emits decoded bus frames on window.parent.logBus (= eventBus).
// We subscribe here to maintain live counters.  In a future phase, frames
// will be passed to the ExpectationValidator and RealtimeWindowManager.

function onCanFrame(payload: { key: string; values: unknown[] }) {
  // payload.values is the batch of decoded CAN frames from DataParseWorker
  realtimeFrameCount.value += Array.isArray(payload.values) ? payload.values.length : 1

  // TODO Phase 2: pass frames to ExpectationValidator:
  //   const frames = payload.values as DecodedCanFrame[]
  //   realtimeWindow.ingest(frames)
  //   const deviations = expectationValidator.validateBatch(frames, expectationSpecs)
  //   if (deviations.length) faultHintOrganizer.ingest(deviations)
}

function onUdsRecv(payload: { key: string; values: unknown[] }) {
  realtimeUdsFrameCount.value += Array.isArray(payload.values) ? payload.values.length : 1

  // TODO Phase 3: correlate NRC responses:
  //   const udsFrames = payload.values as UdsFrame[]
  //   for (const frame of udsFrames) {
  //     if (frame.nrc !== undefined) {
  //       const corr = nrcCorrelator.correlate(frame, realtimeWindow.getContextFrames(frame.ts))
  //       faultHintOrganizer.ingest([corr])
  //     }
  //   }
}

// ---------------------------------------------------------------------------
// Plugin event bus (events pushed from plugin main process)
// ---------------------------------------------------------------------------

function onKnowledgeReady(result: KnowledgeFetchResult) {
  applyKnowledgeResult(result)
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

onMounted(async () => {
  // Subscribe to host realtime data streams
  eventBus.on('canBase', onCanFrame)
  eventBus.on('udsRecv', onUdsRecv)

  // Subscribe to knowledge events from plugin main process
  addPluginEventListen('knowledgeReady', onKnowledgeReady)

  // Initial knowledge load
  knowledgeLoading.value = true
  try {
    const result = await callServerMethod('fetchKnowledge') as KnowledgeFetchResult
    applyKnowledgeResult(result)
  } catch (err) {
    knowledgeStatus.value = {
      source: 'none',
      status: 'unavailable',
      errorMessage: `Initial load failed: ${String(err)}`
    }
  } finally {
    knowledgeLoading.value = false
  }
})

onUnmounted(() => {
  eventBus.off('canBase', onCanFrame)
  eventBus.off('udsRecv', onUdsRecv)
  removePluginEventListen('knowledgeReady', onKnowledgeReady)
})
</script>

<style scoped>
.ai-analysis-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: 13px;
  background: var(--el-bg-color, #fff);
  color: var(--el-text-color-primary, #303133);
}

.aa-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px 8px;
  border-bottom: 1px solid var(--el-border-color-light, #ebeef5);
  flex-shrink: 0;
}

.aa-title {
  font-size: 15px;
  font-weight: 600;
}

.aa-run-badge {
  margin-left: auto;
}

.aa-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.aa-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.aa-card :deep(.el-card__header) {
  padding: 8px 12px;
  font-weight: 600;
  font-size: 12px;
  background: var(--el-fill-color-light, #f5f7fa);
}

.aa-card :deep(.el-card__body) {
  padding: 8px 12px;
}

.aa-card-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
}

.aa-card-body {
  min-height: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.aa-stat-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.aa-stat-label {
  font-size: 12px;
}

.aa-muted {
  opacity: 0.5;
}
</style>
