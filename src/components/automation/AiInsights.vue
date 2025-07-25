<template>
  <div class="ai-insights">
    <div class="section-header">
      <h2 class="section-title">
        <span class="ai-icon">🤖</span>
        AI Insights & Recommendations
      </h2>
      <button class="refresh-btn" @click="refreshInsights" :disabled="loading">
        <span class="btn-icon" :class="{ spinning: loading }">↻</span>
      </button>
    </div>

    <div class="insights-content">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <div class="loading-text">Analyzing automation patterns...</div>
      </div>

      <div v-else-if="insights.length === 0" class="empty-state">
        <div class="empty-icon">💡</div>
        <div class="empty-message">No new insights available</div>
        <div class="empty-description">
          AI recommendations will appear here based on your automation patterns
        </div>
      </div>

      <div v-else class="insights-list">
        <div
          v-for="insight in insights"
          :key="insight.id"
          class="insight-card"
          :class="insight.priority"
        >
          <div class="insight-header">
            <div class="insight-type">
              <span class="type-icon">{{ getTypeIcon(insight.type) }}</span>
              <span class="type-label">{{ getTypeLabel(insight.type) }}</span>
            </div>
            <div class="insight-priority">
              <span class="priority-badge" :class="insight.priority">
                {{ insight.priority }}
              </span>
            </div>
          </div>

          <div class="insight-content">
            <h3 class="insight-title">{{ insight.title }}</h3>
            <p class="insight-description">{{ insight.description }}</p>

            <div class="insight-metrics" v-if="insight.metrics">
              <div
                v-for="metric in insight.metrics"
                :key="metric.label"
                class="metric-item"
              >
                <span class="metric-label">{{ metric.label }}:</span>
                <span class="metric-value" :class="metric.trend">{{ metric.value }}</span>
              </div>
            </div>

            <div class="insight-details" v-if="insight.details">
              <div class="details-toggle" @click="toggleDetails(insight.id)">
                <span>{{ expandedInsights.has(insight.id) ? 'Hide' : 'Show' }} Details</span>
                <span class="toggle-icon" :class="{ expanded: expandedInsights.has(insight.id) }">
                  ▼
                </span>
              </div>
              <div v-if="expandedInsights.has(insight.id)" class="details-content">
                <ul class="details-list">
                  <li v-for="detail in insight.details" :key="detail" class="detail-item">
                    {{ detail }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="insight-actions">
            <div class="action-buttons">
              <button
                v-if="insight.canApprove"
                class="action-btn primary"
                @click="approveInsight(insight)"
              >
                <span class="btn-icon">✓</span>
                {{ insight.approveText || 'Approve' }}
              </button>
              <button
                v-if="insight.canSchedule"
                class="action-btn secondary"
                @click="scheduleInsight(insight)"
              >
                <span class="btn-icon">📅</span>
                Schedule
              </button>
              <button
                class="action-btn secondary"
                @click="dismissInsight(insight)"
              >
                <span class="btn-icon">✕</span>
                Dismiss
              </button>
            </div>
            <div class="insight-confidence" v-if="insight.confidence">
              <div class="confidence-bar">
                <div
                  class="confidence-fill"
                  :style="{ width: insight.confidence + '%' }"
                  :class="getConfidenceClass(insight.confidence)"
                ></div>
              </div>
              <span class="confidence-text">{{ insight.confidence }}% confidence</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="insights-stats" v-if="insights.length > 0">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ approvedThisWeek }}</div>
            <div class="stat-label">Approved This Week</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ potentialSavings }}</div>
            <div class="stat-label">Potential Time Savings</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ newInsights }}</div>
            <div class="stat-label">New Insights</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  insights: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['approve', 'schedule', 'dismiss', 'refresh'])

const loading = ref(false)
const expandedInsights = ref(new Set())

const approvedThisWeek = computed(() => 
  props.insights.filter(insight => insight.status === 'approved').length
)

const potentialSavings = computed(() => {
  const totalMinutes = props.insights.reduce((sum, insight) => 
    sum + (insight.estimatedSavings || 0), 0
  )
  return totalMinutes > 60 ? `${Math.round(totalMinutes / 60)}h` : `${totalMinutes}m`
})

const newInsights = computed(() => 
  props.insights.filter(insight => insight.isNew).length
)

const getTypeIcon = (type) => {
  const icons = {
    optimization: '⚡',
    security: '🔒',
    maintenance: '🔧',
    deployment: '🚀',
    monitoring: '📊',
    compliance: '📋'
  }
  return icons[type] || '💡'
}

const getTypeLabel = (type) => {
  const labels = {
    optimization: 'Performance',
    security: 'Security',
    maintenance: 'Maintenance',
    deployment: 'Deployment',
    monitoring: 'Monitoring',
    compliance: 'Compliance'
  }
  return labels[type] || 'General'
}

const getConfidenceClass = (confidence) => {
  if (confidence >= 80) return 'high'
  if (confidence >= 60) return 'medium'
  return 'low'
}

const toggleDetails = (insightId) => {
  if (expandedInsights.value.has(insightId)) {
    expandedInsights.value.delete(insightId)
  } else {
    expandedInsights.value.add(insightId)
  }
}

const approveInsight = (insight) => {
  emit('approve', insight)
}

const scheduleInsight = (insight) => {
  emit('schedule', insight)
}

const dismissInsight = (insight) => {
  emit('dismiss', insight)
}

const refreshInsights = async () => {
  loading.value = true
  try {
    await emit('refresh')
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 1500) // Simulate loading time
  }
}
</script>

<style scoped>
.ai-insights {
  padding: 24px;
  height: fit-content;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text, #323130);
  margin: 0;
}

.ai-icon {
  font-size: 20px;
}

.refresh-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: var(--border-radius, 4px);
  background: var(--color-surface, #ffffff);
  color: var(--color-text, #323130);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-btn:hover:not(:disabled) {
  background: var(--color-surface-2, #f8f9fa);
  border-color: var(--color-primary, #0078d4);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 14px;
  transition: transform 0.3s ease;
}

.btn-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.insights-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  text-align: center;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-surface-3, #e5e7eb);
  border-top: 3px solid var(--color-primary, #0078d4);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

.loading-text {
  font-size: 14px;
  color: var(--color-text-secondary, #605e5c);
}

.empty-state {
  text-align: center;
  padding: 32px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.6;
}

.empty-message {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #323130);
  margin-bottom: 8px;
}

.empty-description {
  font-size: 14px;
  color: var(--color-text-secondary, #605e5c);
  line-height: 1.4;
}

.insights-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.insight-card {
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: var(--border-radius, 4px);
  background: var(--color-surface, #ffffff);
  overflow: hidden;
  transition: all 0.2s ease;
}

.insight-card:hover {
  box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
}

.insight-card.high {
  border-left: 4px solid var(--color-danger, #d13438);
}

.insight-card.medium {
  border-left: 4px solid var(--color-warning, #ff8c00);
}

.insight-card.low {
  border-left: 4px solid var(--color-success, #107c10);
}

.insight-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px 0 16px;
}

.insight-type {
  display: flex;
  align-items: center;
  gap: 6px;
}

.type-icon {
  font-size: 16px;
}

.type-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary, #605e5c);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.insight-priority {
  flex-shrink: 0;
}

.priority-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.priority-badge.high {
  background: #fef2f2;
  color: var(--color-danger, #d13438);
}

.priority-badge.medium {
  background: #fef8f0;
  color: var(--color-warning, #ff8c00);
}

.priority-badge.low {
  background: #f0f9f0;
  color: var(--color-success, #107c10);
}

.insight-content {
  padding: 16px;
}

.insight-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #323130);
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.insight-description {
  font-size: 14px;
  color: var(--color-text, #323130);
  line-height: 1.4;
  margin: 0 0 12px 0;
}

.insight-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px;
  background: var(--color-surface-2, #f8f9fa);
  border-radius: var(--border-radius, 4px);
}

.metric-item {
  display: flex;
  gap: 4px;
  font-size: 13px;
}

.metric-label {
  color: var(--color-text-secondary, #605e5c);
  font-weight: 500;
}

.metric-value {
  color: var(--color-text, #323130);
  font-weight: 600;
}

.metric-value.positive {
  color: var(--color-success, #107c10);
}

.metric-value.negative {
  color: var(--color-danger, #d13438);
}

.insight-details {
  margin-top: 12px;
}

.details-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  cursor: pointer;
  color: var(--color-primary, #0078d4);
  font-size: 13px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.details-toggle:hover {
  color: var(--color-primary-hover, #106ebe);
}

.toggle-icon {
  font-size: 10px;
  transition: transform 0.2s ease;
}

.toggle-icon.expanded {
  transform: rotate(180deg);
}

.details-content {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--color-surface-3, #e5e7eb);
}

.details-list {
  margin: 0;
  padding-left: 16px;
  color: var(--color-text-secondary, #605e5c);
  font-size: 13px;
  line-height: 1.4;
}

.detail-item {
  margin-bottom: 4px;
}

.insight-actions {
  padding: 16px;
  border-top: 1px solid var(--color-surface-3, #e5e7eb);
  background: var(--color-surface-2, #f8f9fa);
}

.action-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: var(--border-radius, 4px);
  background: var(--color-surface, #ffffff);
  color: var(--color-text, #323130);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--color-surface-2, #f8f9fa);
}

.action-btn.primary {
  background: var(--color-primary, #0078d4);
  color: white;
  border-color: var(--color-primary, #0078d4);
}

.action-btn.primary:hover {
  background: var(--color-primary-hover, #106ebe);
}

.insight-confidence {
  display: flex;
  align-items: center;
  gap: 8px;
}

.confidence-bar {
  flex: 1;
  height: 4px;
  background: var(--color-surface-3, #e5e7eb);
  border-radius: 2px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.confidence-fill.high {
  background: var(--color-success, #107c10);
}

.confidence-fill.medium {
  background: var(--color-warning, #ff8c00);
}

.confidence-fill.low {
  background: var(--color-danger, #d13438);
}

.confidence-text {
  font-size: 11px;
  color: var(--color-text-secondary, #605e5c);
  font-weight: 600;
  white-space: nowrap;
}

.insights-stats {
  margin-top: 16px;
  padding: 16px;
  background: var(--color-surface-2, #f8f9fa);
  border-radius: var(--border-radius, 4px);
  border: 1px solid var(--color-border, #d1d5db);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text, #323130);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 11px;
  color: var(--color-text-secondary, #605e5c);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive */
@media (max-width: 768px) {
  .ai-insights {
    padding: 16px;
  }
  
  .insight-card {
    margin-bottom: 12px;
  }
  
  .insight-header {
    padding: 12px 12px 0 12px;
  }
  
  .insight-content {
    padding: 12px;
  }
  
  .insight-actions {
    padding: 12px;
  }
  
  .action-buttons {
    flex-wrap: wrap;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .insight-metrics {
    flex-direction: column;
    gap: 8px;
  }
}
</style>