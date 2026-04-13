<template>
  <el-card class="rss" shadow="never">
    <template #header>
      <div class="rss-header">
        <span class="rss-title">Realtime Stream</span>
        <el-tag :type="globalStart ? 'success' : 'info'" size="small">
          {{ globalStart ? 'Active' : 'Inactive' }}
        </el-tag>
      </div>
    </template>

    <div class="rss-body">
      <div class="rss-row">
        <span class="rss-label">CAN frames received</span>
        <el-tag size="small" type="info">{{ frameCount.toLocaleString() }}</el-tag>
      </div>
      <div class="rss-row">
        <span class="rss-label">UDS frames received</span>
        <el-tag size="small" type="info">{{ udsFrameCount.toLocaleString() }}</el-tag>
      </div>

      <el-divider class="rss-divider" />

      <!-- Wiring status indicators -->
      <div class="rss-row rss-wiring">
        <span class="rss-wiring-icon">🔌</span>
        <span class="rss-wiring-text">
          <strong>canBase</strong> event subscribed
          <el-tag size="small" type="success" class="rss-wiring-tag">wired</el-tag>
        </span>
      </div>
      <div class="rss-row rss-wiring">
        <span class="rss-wiring-icon">🔌</span>
        <span class="rss-wiring-text">
          <strong>udsRecv</strong> event subscribed
          <el-tag size="small" type="success" class="rss-wiring-tag">wired</el-tag>
        </span>
      </div>

      <!-- Future wiring placeholders -->
      <div class="rss-row rss-wiring rss-placeholder">
        <span class="rss-wiring-icon">⏳</span>
        <span class="rss-wiring-text">
          <strong>ExpectationValidator</strong>
          <el-tag size="small" type="warning" class="rss-wiring-tag">phase 2</el-tag>
        </span>
      </div>
      <div class="rss-row rss-wiring rss-placeholder">
        <span class="rss-wiring-icon">⏳</span>
        <span class="rss-wiring-text">
          <strong>RealtimeWindowManager</strong>
          <el-tag size="small" type="warning" class="rss-wiring-tag">phase 2</el-tag>
        </span>
      </div>
      <div class="rss-row rss-wiring rss-placeholder">
        <span class="rss-wiring-icon">⏳</span>
        <span class="rss-wiring-text">
          <strong>NrcCorrelator</strong>
          <el-tag size="small" type="warning" class="rss-wiring-tag">phase 3</el-tag>
        </span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
defineProps<{
  globalStart: boolean | unknown
  frameCount: number
  udsFrameCount: number
}>()
</script>

<style scoped>
.rss :deep(.el-card__header) {
  padding: 8px 12px;
  background: var(--el-fill-color-light, #f5f7fa);
}
.rss :deep(.el-card__body) {
  padding: 8px 12px;
}
.rss-header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.rss-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
  flex: 1;
}
.rss-body {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.rss-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}
.rss-label {
  opacity: 0.7;
  min-width: 140px;
}
.rss-divider {
  margin: 4px 0;
}
.rss-wiring {
  gap: 6px;
}
.rss-wiring-icon {
  font-size: 12px;
}
.rss-wiring-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}
.rss-wiring-tag {
  margin-left: 2px;
}
.rss-placeholder {
  opacity: 0.5;
}
</style>
