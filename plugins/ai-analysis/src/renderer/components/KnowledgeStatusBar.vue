<template>
  <el-card class="ksb" shadow="never">
    <template #header>
      <div class="ksb-header">
        <span class="ksb-title">Knowledge Source</span>
        <div class="ksb-actions">
          <el-button
            size="small"
            :loading="loading"
            :icon="RefreshRight"
            @click="$emit('refresh')"
          >
            Refresh
          </el-button>
          <el-button size="small" :icon="Upload" @click="$emit('import')">
            Import File
          </el-button>
        </div>
      </div>
    </template>

    <div class="ksb-body">
      <!-- Source badge -->
      <div class="ksb-row">
        <span class="ksb-label">Source</span>
        <el-tag :type="sourceBadgeType" size="small">{{ sourceLabel }}</el-tag>
        <el-tag :type="statusBadgeType" size="small" class="ksb-status-tag">
          {{ statusLabel }}
        </el-tag>
      </div>

      <!-- Last refreshed -->
      <div v-if="status?.lastRefreshed" class="ksb-row ksb-muted">
        <span class="ksb-label">Last refreshed</span>
        <span>{{ lastRefreshedLabel }}</span>
      </div>

      <!-- Cache age -->
      <div v-if="status?.cacheAgeMs !== undefined" class="ksb-row ksb-muted">
        <span class="ksb-label">Cache age</span>
        <span>{{ cacheAgeLabel }}</span>
      </div>

      <!-- Error message -->
      <div v-if="status?.errorMessage" class="ksb-row ksb-error">
        <span class="ksb-label">Info</span>
        <span class="ksb-error-text">{{ status.errorMessage }}</span>
      </div>

      <!-- Summary counts -->
      <div v-if="context" class="ksb-row">
        <span class="ksb-label">NRC entries</span>
        <span>{{ context.nrcKnowledge?.entries?.length ?? 0 }}</span>
        <span class="ksb-sep">·</span>
        <span class="ksb-label">Matrix specs</span>
        <span>{{ context.messageMatrix?.length ?? 0 }}</span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RefreshRight, Upload } from '@element-plus/icons-vue'
import type { KnowledgeProviderStatus, DomainKnowledgeContext } from '../../../types/knowledge'

const props = defineProps<{
  status: KnowledgeProviderStatus | null
  context: DomainKnowledgeContext | null
  loading?: boolean
}>()

defineEmits<{
  refresh: []
  import: []
}>()

const sourceLabel = computed(() => {
  switch (props.status?.source) {
    case 'api': return 'Company API'
    case 'cache': return 'Local Cache'
    case 'local': return 'Local File'
    default: return 'None'
  }
})

const sourceBadgeType = computed((): 'success' | 'warning' | 'info' | 'danger' => {
  switch (props.status?.source) {
    case 'api': return 'success'
    case 'cache': return 'warning'
    case 'local': return 'info'
    default: return 'danger'
  }
})

const statusLabel = computed(() => {
  switch (props.status?.status) {
    case 'connected': return 'Connected'
    case 'cached': return 'Cached'
    case 'local': return 'Local'
    default: return 'Unavailable'
  }
})

const statusBadgeType = computed((): 'success' | 'warning' | 'info' | 'danger' => {
  switch (props.status?.status) {
    case 'connected': return 'success'
    case 'cached': return 'warning'
    case 'local': return 'info'
    default: return 'danger'
  }
})

const lastRefreshedLabel = computed(() => {
  if (!props.status?.lastRefreshed) return ''
  const d = new Date(props.status.lastRefreshed)
  return d.toLocaleTimeString()
})

const cacheAgeLabel = computed(() => {
  const ms = props.status?.cacheAgeMs
  if (ms === undefined) return ''
  if (ms < 60000) return `${Math.round(ms / 1000)}s ago`
  if (ms < 3600000) return `${Math.round(ms / 60000)} min ago`
  return `${Math.round(ms / 3600000)}h ago`
})
</script>

<style scoped>
.ksb :deep(.el-card__header) {
  padding: 8px 12px;
  background: var(--el-fill-color-light, #f5f7fa);
}

.ksb :deep(.el-card__body) {
  padding: 8px 12px;
}

.ksb-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ksb-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
  flex: 1;
}

.ksb-actions {
  display: flex;
  gap: 6px;
}

.ksb-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ksb-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.ksb-label {
  opacity: 0.6;
  min-width: 90px;
  font-size: 11px;
}

.ksb-muted {
  opacity: 0.7;
}

.ksb-sep {
  opacity: 0.3;
}

.ksb-status-tag {
  margin-left: 4px;
}

.ksb-error {
  color: var(--el-color-danger, #f56c6c);
}

.ksb-error-text {
  font-size: 11px;
  word-break: break-word;
}
</style>
