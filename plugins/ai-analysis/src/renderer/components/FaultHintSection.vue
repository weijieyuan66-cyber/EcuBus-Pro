<template>
  <el-card class="fhs" shadow="never">
    <template #header>
      <div class="fhs-header">
        <span class="fhs-title">Fault Hints</span>
        <template v-if="summary">
          <el-tag size="small" type="danger">{{ summary.criticalCount }} critical</el-tag>
          <el-tag size="small" type="warning">{{ summary.warnCount }} warnings</el-tag>
          <el-tag size="small" type="info">{{ summary.totalCount }} total</el-tag>
        </template>
      </div>
    </template>

    <div class="fhs-body">
      <template v-if="summary && summary.hints.length > 0">
        <div
          v-for="hint in summary.hints"
          :key="hint.id"
          class="fhs-hint"
        >
          <el-tag :type="hintTagType(hint.severity)" size="small">{{ hint.severity }}</el-tag>
          <div class="fhs-hint-content">
            <div class="fhs-hint-category">{{ hint.category }}</div>
            <div class="fhs-hint-desc">{{ hint.description }}</div>
            <div v-if="hint.nrcCorrelation" class="fhs-hint-nrc">
              NRC {{ hex(hint.nrcCorrelation.nrc) }}:
              {{ hint.nrcCorrelation.nrcEntry?.name ?? 'unknown' }}
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="fhs-placeholder">
          <el-tag size="small" type="warning">Phase 3</el-tag>
          <span class="fhs-placeholder-text">
            Fault hint organizer not yet active.
            Requires validation engine (Phase 2) and NRC correlator (Phase 3).
          </span>
        </div>
      </template>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import type { FaultHintSummary } from '../../../types/analysis'

defineProps<{
  summary: FaultHintSummary | null
}>()

function hintTagType(severity: string): 'danger' | 'warning' | 'success' | 'info' {
  switch (severity) {
    case 'critical':
    case 'error': return 'danger'
    case 'warn': return 'warning'
    default: return 'info'
  }
}

function hex(n: number): string {
  return `0x${n.toString(16).toUpperCase().padStart(2, '0')}`
}
</script>

<style scoped>
.fhs :deep(.el-card__header) {
  padding: 8px 12px;
  background: var(--el-fill-color-light, #f5f7fa);
}
.fhs :deep(.el-card__body) {
  padding: 8px 12px;
}
.fhs-header {
  display: flex;
  align-items: center;
  gap: 6px;
}
.fhs-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
  flex: 1;
}
.fhs-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.fhs-hint {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 4px 0;
  border-bottom: 1px solid var(--el-border-color-lighter, #f0f0f0);
}
.fhs-hint:last-child {
  border-bottom: none;
}
.fhs-hint-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.fhs-hint-category {
  font-size: 11px;
  font-weight: 600;
  opacity: 0.7;
}
.fhs-hint-desc {
  font-size: 12px;
}
.fhs-hint-nrc {
  font-size: 11px;
  opacity: 0.6;
  font-family: monospace;
}
.fhs-placeholder {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.fhs-placeholder-text {
  font-size: 11px;
  opacity: 0.6;
  line-height: 1.5;
}
</style>
