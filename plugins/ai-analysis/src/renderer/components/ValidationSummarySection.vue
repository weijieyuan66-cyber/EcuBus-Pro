<template>
  <el-card class="vss" shadow="never">
    <template #header>
      <span class="vss-title">Validation Summary</span>
    </template>

    <div class="vss-body">
      <template v-if="summary">
        <div class="vss-row">
          <span class="vss-label">Checked</span>
          <el-tag size="small" type="info">{{ summary.totalChecked }}</el-tag>
        </div>
        <div class="vss-row">
          <span class="vss-label">Passed</span>
          <el-tag size="small" type="success">{{ summary.totalPassed }}</el-tag>
        </div>
        <div class="vss-row">
          <span class="vss-label">Failed</span>
          <el-tag size="small" type="danger">{{ summary.totalFailed }}</el-tag>
        </div>
        <div class="vss-row">
          <span class="vss-label">Deviations</span>
          <el-tag size="small" :type="summary.deviations.length ? 'danger' : 'success'">
            {{ summary.deviations.length }}
          </el-tag>
        </div>
      </template>
      <template v-else>
        <div class="vss-placeholder">
          <el-tag size="small" type="warning">Phase 2</el-tag>
          <span class="vss-placeholder-text">
            Validation engine not yet active.
            Load a message matrix and start a session to begin validation.
          </span>
        </div>
      </template>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import type { ValidationSummary } from '../../../types/analysis'

defineProps<{
  summary: ValidationSummary | null
}>()
</script>

<style scoped>
.vss :deep(.el-card__header) {
  padding: 8px 12px;
  background: var(--el-fill-color-light, #f5f7fa);
}
.vss :deep(.el-card__body) {
  padding: 8px 12px;
}
.vss-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
}
.vss-body {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.vss-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}
.vss-label {
  opacity: 0.6;
  min-width: 80px;
}
.vss-placeholder {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.vss-placeholder-text {
  font-size: 11px;
  opacity: 0.6;
  line-height: 1.5;
}
</style>
