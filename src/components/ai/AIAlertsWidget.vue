<template>
  <div class="ai-alerts-widget">
    <div class="widget-header">
      <div class="header-content">
        <h3>AI Alerts</h3>
        <span class="alert-summary">{{ activeAlerts }} active, {{ resolvedToday }} resolved today</span>
      </div>
      <div class="header-actions">
        <button @click="refreshAlerts" class="refresh-btn" :disabled="refreshing">
          <RefreshIcon :class="{ 'animate-spin': refreshing }" />
        </button>
      </div>
    </div>
    
    <div class="alerts-content">
      <div v-if="alerts.length === 0" class="empty-state">
        <ShieldCheckIcon class="empty-icon" />
        <h4>All systems running smoothly</h4>
        <p>No AI-detected alerts at this time.</p>
      </div>
      
      <div v-else class="alerts-list">
        <div
          v-for="alert in sortedAlerts"
          :key="alert.id"
          class="alert-item"
          :class="[`severity-${alert.severity}`, { dismissed: alert.dismissed }]"
        >
          <div class="alert-indicator">
            <div class="severity-dot" :class="alert.severity"></div>
            <div class="alert-type-icon">
              <BrainIcon v-if="alert.type === 'prediction'" />
              <TrendingUpIcon v-else-if="alert.type === 'anomaly'" />
              <UsersIcon v-else-if="alert.type === 'resource'" />
              <DollarSignIcon v-else-if="alert.type === 'cost'" />
              <ClockIcon v-else-if="alert.type === 'performance'" />
              <AlertCircleIcon v-else />
            </div>
          </div>
          
          <div class="alert-content">
            <div class="alert-title">{{ alert.title }}</div>
            <div class="alert-description">{{ alert.description }}</div>
            
            <div class="alert-details">
              <div class="detail-row">
                <span class="detail-label">Impact:</span>
                <span class="detail-value" :class="getImpactClass(alert.impact)">
                  {{ alert.impact }}
                </span>
              </div>
              
              <div v-if="alert.affectedSystems" class="detail-row">
                <span class="detail-label">Systems:</span>
                <span class="detail-value">{{ alert.affectedSystems.join(', ') }}</span>
              </div>
              
              <div v-if="alert.estimatedResolution" class="detail-row">
                <span class="detail-label">Est. Resolution:</span>
                <span class="detail-value">{{ alert.estimatedResolution }}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Confidence:</span>
                <span class="detail-value">
                  {{ Math.round(alert.confidence * 100) }}%
                  <div class="confidence-bar">
                    <div 
                      class="confidence-fill" 
                      :style="{ width: `${alert.confidence * 100}%` }"
                      :class="getConfidenceClass(alert.confidence)"
                    ></div>
                  </div>
                </span>
              </div>
            </div>
            
            <div class="alert-meta">
              <span class="alert-time">{{ formatTimeAgo(alert.detectedAt) }}</span>
              <span class="alert-source">AI Detection Engine</span>
            </div>
          </div>
          
          <div class="alert-actions">
            <button
              v-if="alert.actionable && !alert.dismissed"
              @click="takeAction(alert)"
              class="action-btn primary"
              :disabled="alert.actionInProgress"
            >
              <span v-if="alert.actionInProgress">Acting...</span>
              <span v-else>{{ alert.actionLabel }}</span>
            </button>
            
            <div class="secondary-actions">
              <button @click="viewDetails(alert)" class="action-btn secondary small">
                Details
              </button>
              <button 
                @click="dismissAlert(alert.id)" 
                class="action-btn secondary small"
                :disabled="alert.dismissed"
              >
                {{ alert.dismissed ? 'Dismissed' : 'Dismiss' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Alert Detail Modal -->
    <div v-if="selectedAlert" class="alert-modal-overlay" @click="closeModal">
      <div class="alert-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedAlert.title }}</h3>
          <button @click="closeModal" class="close-btn">
            <CloseIcon />
          </button>
        </div>
        
        <div class="modal-content">
          <div class="alert-explanation">
            <h4>AI Analysis</h4>
            <p>{{ selectedAlert.explanation }}</p>
          </div>
          
          <div v-if="selectedAlert.historicalContext" class="historical-context">
            <h4>Historical Context</h4>
            <p>{{ selectedAlert.historicalContext }}</p>
          </div>
          
          <div v-if="selectedAlert.suggestedActions" class="suggested-actions">
            <h4>Suggested Actions</h4>
            <ul>
              <li v-for="action in selectedAlert.suggestedActions" :key="action">
                {{ action }}
              </li>
            </ul>
          </div>
          
          <div v-if="selectedAlert.relatedMetrics" class="related-metrics">
            <h4>Related Metrics</h4>
            <div class="metrics-grid">
              <div v-for="metric in selectedAlert.relatedMetrics" :key="metric.name" class="metric-item">
                <span class="metric-name">{{ metric.name }}</span>
                <span class="metric-value" :class="metric.trend">
                  {{ metric.value }} {{ metric.change }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="takeAction(selectedAlert)" class="action-btn primary">
            {{ selectedAlert.actionLabel }}
          </button>
          <button @click="closeModal" class="action-btn secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import RefreshIcon from '@/components/icons/RefreshIcon.vue'
import ShieldCheckIcon from '@/components/icons/ShieldCheckIcon.vue'
import BrainIcon from '@/components/icons/BrainIcon.vue'
import TrendingUpIcon from '@/components/icons/TrendingUpIcon.vue'
import UsersIcon from '@/components/icons/UsersIcon.vue'
import DollarSignIcon from '@/components/icons/DollarSignIcon.vue'
import ClockIcon from '@/components/icons/ClockIcon.vue'
import AlertCircleIcon from '@/components/icons/AlertCircleIcon.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'

const props = defineProps({
  alerts: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['dismiss', 'action', 'refresh'])

// State
const refreshing = ref(false)
const selectedAlert = ref(null)

// Computed
const activeAlerts = computed(() => {
  return props.alerts.filter(alert => !alert.dismissed).length
})

const resolvedToday = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return props.alerts.filter(alert => {
    return alert.resolvedAt && new Date(alert.resolvedAt) >= today
  }).length
})

const sortedAlerts = computed(() => {
  return [...props.alerts]
    .filter(alert => !alert.dismissed)
    .sort((a, b) => {
      // Sort by severity first
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity]
      if (severityDiff !== 0) return severityDiff
      
      // Then by detection time (newest first)
      return new Date(b.detectedAt) - new Date(a.detectedAt)
    })
})

// Methods
const refreshAlerts = async () => {
  refreshing.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    emit('refresh')
  } finally {
    refreshing.value = false
  }
}

const takeAction = (alert) => {
  emit('action', alert)
}

const dismissAlert = (alertId) => {
  emit('dismiss', alertId)
}

const viewDetails = (alert) => {
  selectedAlert.value = alert
}

const closeModal = () => {
  selectedAlert.value = null
}

const formatTimeAgo = (timestamp) => {
  const now = new Date()
  const alertTime = new Date(timestamp)
  const diffInMinutes = Math.floor((now - alertTime) / 60000)
  
  if (diffInMinutes < 1) return 'Just detected'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d ago`
}

const getImpactClass = (impact) => {
  const impactMap = {
    'Critical': 'critical',
    'High': 'high',
    'Medium': 'medium',
    'Low': 'low'
  }
  return `impact-${impactMap[impact] || 'medium'}`
}

const getConfidenceClass = (confidence) => {
  if (confidence >= 0.8) return 'high-confidence'
  if (confidence >= 0.6) return 'medium-confidence'
  return 'low-confidence'
}
</script>

<style scoped>
.ai-alerts-widget {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.header-content h3 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.alert-summary {
  font-size: 11px;
  color: #64748b;
}

.refresh-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.refresh-btn:hover:not(:disabled) {
  color: #374151;
  background: #e2e8f0;
}

.refresh-btn:disabled {
  opacity: 0.5;
}

.alerts-content {
  max-height: 400px;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  padding: 32px 20px;
  color: #64748b;
}

.empty-icon {
  width: 32px;
  height: 32px;
  margin: 0 auto 12px;
  color: #10b981;
}

.empty-state h4 {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.empty-state p {
  font-size: 12px;
  margin: 0;
}

.alerts-list {
  padding: 0;
}

.alert-item {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.15s ease;
}

.alert-item:hover {
  background: #f8fafc;
}

.alert-item.dismissed {
  opacity: 0.6;
}

.alert-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  width: 24px;
  padding-top: 2px;
}

.severity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.severity-dot.critical {
  background: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

.severity-dot.high {
  background: #f59e0b;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
}

.severity-dot.medium {
  background: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.severity-dot.low {
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.alert-type-icon {
  width: 16px;
  height: 16px;
  color: #64748b;
}

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-title {
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 4px;
  line-height: 1.3;
}

.alert-description {
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
  margin-bottom: 8px;
}

.alert-details {
  margin-bottom: 8px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 11px;
}

.detail-label {
  color: #94a3b8;
  font-weight: 500;
  min-width: 60px;
}

.detail-value {
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
}

.impact-critical { color: #dc2626; }
.impact-high { color: #d97706; }
.impact-medium { color: #3b82f6; }
.impact-low { color: #16a34a; }

.confidence-bar {
  width: 40px;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.high-confidence { background: #10b981; }
.medium-confidence { background: #f59e0b; }
.low-confidence { background: #ef4444; }

.alert-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  color: #94a3b8;
}

.alert-meta span:not(:last-child)::after {
  content: '•';
  margin-left: 8px;
}

.alert-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
  align-items: flex-end;
}

.secondary-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  border: none;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
  padding: 6px 12px;
}

.action-btn.primary:hover:not(:disabled) {
  background: #2563eb;
}

.action-btn.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-btn.secondary {
  background: #f1f5f9;
  color: #64748b;
  padding: 4px 8px;
}

.action-btn.secondary.small {
  padding: 2px 6px;
  font-size: 10px;
}

.action-btn.secondary:hover:not(:disabled) {
  background: #e2e8f0;
  color: #374151;
}

/* Modal Styles */
.alert-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.alert-modal {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.close-btn:hover {
  color: #374151;
  background: #f1f5f9;
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.modal-content h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.modal-content p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 20px 0;
}

.modal-content ul {
  margin: 0;
  padding-left: 20px;
}

.modal-content li {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 4px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
}

.metric-name {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.metric-value {
  font-size: 12px;
  font-weight: 600;
}

.metric-value.positive { color: #16a34a; }
.metric-value.negative { color: #dc2626; }
.metric-value.neutral { color: #64748b; }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e2e8f0;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>