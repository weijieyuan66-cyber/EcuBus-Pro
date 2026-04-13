<template>
  <el-card class="aas" shadow="never">
    <template #header>
      <span class="aas-title">AI Analysis</span>
    </template>

    <div class="aas-body">
      <!-- AI Analysis result placeholder -->
      <div class="aas-placeholder">
        <el-tag size="small" type="info">Future</el-tag>
        <span class="aas-placeholder-text">
          AI-powered root-cause analysis not yet active.
          This section will display AI-generated hypotheses, root-cause reasoning,
          and recommended diagnostic checks once the AI integration is implemented.
        </span>
      </div>

      <el-divider class="aas-divider" />

      <!-- Evidence / Cause / Recommended Checks subsections -->
      <div class="aas-sub-section">
        <div class="aas-sub-title">Evidence</div>
        <div class="aas-sub-placeholder">No evidence collected yet</div>
      </div>

      <div class="aas-sub-section">
        <div class="aas-sub-title">Root Cause Hypothesis</div>
        <div class="aas-sub-placeholder">No hypotheses generated yet</div>
      </div>

      <div class="aas-sub-section">
        <div class="aas-sub-title">Recommended Checks</div>
        <div class="aas-sub-placeholder">No recommendations yet</div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
// AIAnalysisSection – placeholder for future AI integration.
//
// Future phases will:
//   1. Receive AIAnalysisResult from a backend LLM call via callServerMethod('analyzeSession')
//   2. Display RootCauseHypothesis[] with confidence scores
//   3. Link hypotheses back to supporting DeviationEvent evidence
//   4. Show suggested diagnostic actions
//
// Type stubs are already defined in src/types/analysis.ts:
//   - AIAnalysisResult
//   - RootCauseHypothesis
//   - SelectedObjectContext
</script>

<style scoped>
.aas :deep(.el-card__header) {
  padding: 8px 12px;
  background: var(--el-fill-color-light, #f5f7fa);
}
.aas :deep(.el-card__body) {
  padding: 8px 12px;
}
.aas-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
}
.aas-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.aas-placeholder {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.aas-placeholder-text {
  font-size: 11px;
  opacity: 0.6;
  line-height: 1.5;
}
.aas-divider {
  margin: 4px 0;
}
.aas-sub-section {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.aas-sub-title {
  font-size: 11px;
  font-weight: 600;
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.aas-sub-placeholder {
  font-size: 11px;
  opacity: 0.4;
  padding: 4px 0;
  font-style: italic;
}
</style>
