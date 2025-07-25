<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">{{ zone.name }} Details</h2>
        <button class="close-button" @click="$emit('close')">
          <span class="close-icon">×</span>
        </button>
      </div>

      <div class="modal-body">
        <!-- Overall Health Section -->
        <div class="health-section">
          <div class="health-score">
            <div class="score-circle" :style="{ borderColor: getScoreColor(zone.score) }">
              <span class="score-value" :style="{ color: getScoreColor(zone.score) }">
                {{ zone.score }}
              </span>
            </div>
            <div class="score-info">
              <h3 class="score-label">Experience Score</h3>
              <p class="score-status" :style="{ color: getScoreColor(zone.score) }">
                {{ getScoreLabel(zone.score) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Key Metrics -->
        <div class="metrics-section">
          <h3 class="section-title">Key Metrics</h3>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-icon">⏱️</div>
              <div class="metric-info">
                <span class="metric-label">Avg Login Time</span>
                <span class="metric-value">{{ zone.metrics.avgLoginTime }}s</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">💻</div>
              <div class="metric-info">
                <span class="metric-label">Device Health</span>
                <span class="metric-value">{{ zone.metrics.deviceHealth }}%</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">⚙️</div>
              <div class="metric-info">
                <span class="metric-label">Failed Scripts</span>
                <span class="metric-value">{{ zone.metrics.automationFailures }}</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">📊</div>
              <div class="metric-info">
                <span class="metric-label">Total Devices</span>
                <span class="metric-value">{{ zone.devices }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Issues -->
        <div class="issues-section">
          <h3 class="section-title">Top 3 Issues</h3>
          <div class="issues-list">
            <div 
              v-for="(issue, index) in zone.metrics.topIssues" 
              :key="index"
              class="issue-item"
            >
              <div class="issue-content">
                <div class="issue-header">
                  <span class="issue-name">{{ issue.issue }}</span>
                  <span class="issue-count">{{ issue.count }} affected</span>
                </div>
                <div class="issue-actions">
                  <span class="suggested-fix">{{ issue.fix }}</span>
                  <button 
                    class="apply-fix-button"
                    @click="applyFix(issue)"
                  >
                    Apply fix to all
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Issue Distribution -->
        <div class="distribution-section" v-if="zone.issues.length > 0">
          <h3 class="section-title">Issue Distribution</h3>
          <div class="distribution-chart">
            <div 
              v-for="issue in zone.issues" 
              :key="issue.type"
              class="distribution-item"
            >
              <div class="distribution-bar">
                <div 
                  class="distribution-fill"
                  :class="`severity-${issue.severity}`"
                  :style="{ width: `${(issue.count / maxIssueCount) * 100}%` }"
                ></div>
              </div>
              <div class="distribution-label">
                <span class="issue-type">{{ issue.type }}</span>
                <span class="issue-severity" :class="`severity-${issue.severity}`">
                  {{ issue.severity }} ({{ issue.count }})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  zone: {
    type: Object,
    required: true
  },
  getScoreColor: {
    type: Function,
    required: true
  },
  getScoreLabel: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['close', 'apply-fix'])

const maxIssueCount = computed(() => {
  return Math.max(...props.zone.issues.map(issue => issue.count))
})

const handleOverlayClick = () => {
  emit('close')
}

const applyFix = (issue) => {
  emit('apply-fix', { zone: props.zone, issue })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.close-button:hover {
  background: #f3f4f6;
}

.close-icon {
  font-size: 24px;
  color: #6b7280;
  line-height: 1;
}

.modal-body {
  padding: 24px;
}

.health-section {
  margin-bottom: 32px;
}

.health-score {
  display: flex;
  align-items: center;
  gap: 20px;
}

.score-circle {
  width: 80px;
  height: 80px;
  border: 4px solid;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.score-value {
  font-size: 28px;
  font-weight: 700;
}

.score-label {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.score-status {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
}

.metrics-section {
  margin-bottom: 32px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.metric-card {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.metric-icon {
  font-size: 24px;
}

.metric-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.metric-value {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.issues-section {
  margin-bottom: 32px;
}

.issues-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.issue-item {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #ef4444;
}

.issue-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.issue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.issue-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.issue-count {
  font-size: 14px;
  color: #ef4444;
  font-weight: 500;
}

.issue-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.suggested-fix {
  font-size: 14px;
  color: #6b7280;
  font-style: italic;
}

.apply-fix-button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.apply-fix-button:hover {
  background: #2563eb;
}

.distribution-section {
  margin-bottom: 16px;
}

.distribution-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.distribution-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.distribution-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.distribution-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.severity-high {
  background: #ef4444;
}

.severity-medium {
  background: #f59e0b;
}

.severity-low {
  background: #3b82f6;
}

.distribution-label {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 120px;
}

.issue-type {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.issue-severity {
  font-size: 12px;
  font-weight: 500;
}

.severity-high {
  color: #ef4444;
}

.severity-medium {
  color: #f59e0b;
}

.severity-low {
  color: #3b82f6;
}

@media (max-width: 768px) {
  .modal-content {
    margin: 0;
    border-radius: 0;
    height: 100vh;
    max-height: none;
  }
  
  .health-score {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .issue-header,
  .issue-actions {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .distribution-item {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .distribution-label {
    flex-direction: row;
    justify-content: space-between;
    min-width: auto;
  }
}

@media (prefers-color-scheme: dark) {
  .modal-content {
    background: #1f2937;
  }
  
  .modal-header {
    border-bottom-color: #374151;
  }
  
  .modal-title,
  .score-label,
  .section-title,
  .metric-value,
  .issue-name,
  .issue-type {
    color: #f9fafb;
  }
  
  .close-button:hover {
    background: #374151;
  }
  
  .close-icon {
    color: #9ca3af;
  }
  
  .metric-card,
  .issue-item {
    background: #374151;
  }
  
  .metric-label,
  .suggested-fix {
    color: #9ca3af;
  }
  
  .distribution-bar {
    background: #374151;
  }
}
</style>