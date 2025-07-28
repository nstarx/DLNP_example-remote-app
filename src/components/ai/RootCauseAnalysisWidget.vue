<template>
  <div class="root-cause-analysis-widget">
    <div class="widget-header">
      <div class="header-content">
        <div class="analysis-icon">
          <MagnifyingGlassIcon />
        </div>
        <div class="analysis-meta">
          <h3>Root Cause Analysis</h3>
          <span class="analysis-status">{{ analysis?.title || 'No active analysis' }}</span>
        </div>
      </div>
      
      <div class="header-actions">
        <div class="confidence-badge" v-if="analysis?.confidence">
          <span class="confidence-label">{{ Math.round(analysis.confidence * 100) }}%</span>
          <span class="confidence-text">confidence</span>
        </div>
        
        <button @click="refreshAnalysis" class="refresh-btn" :disabled="refreshing">
          <RefreshIcon :class="{ 'animate-spin': refreshing }" />
        </button>
      </div>
    </div>
    
    <div class="analysis-content">
      <div v-if="!analysis" class="empty-state">
        <SearchIcon class="empty-icon" />
        <h4>No Issues Detected</h4>
        <p>AI monitoring shows all systems operating normally.</p>
      </div>
      
      <div v-else class="active-analysis">
        <!-- Primary Cause -->
        <div class="primary-cause">
          <h4>Primary Root Cause</h4>
          <div class="cause-item primary">
            <div class="cause-icon">
              <AlertCircleIcon />
            </div>
            <div class="cause-content">
              <div class="cause-title">{{ analysis.primaryCause }}</div>
              <div class="cause-confidence">
                <div class="confidence-bar">
                  <div 
                    class="confidence-fill primary" 
                    :style="{ width: `${analysis.confidence * 100}%` }"
                  ></div>
                </div>
                <span class="confidence-value">{{ Math.round(analysis.confidence * 100) }}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Contributing Factors -->
        <div v-if="analysis.contributingFactors && analysis.contributingFactors.length > 0" class="contributing-factors">
          <h4>Contributing Factors</h4>
          <div class="factors-list">
            <div
              v-for="(factor, index) in analysis.contributingFactors"
              :key="index"
              class="cause-item contributing"
            >
              <div class="cause-icon">
                <ChevronRightIcon />
              </div>
              <div class="cause-content">
                <div class="cause-title">{{ factor }}</div>
                <div class="factor-weight">
                  <div class="weight-bar">
                    <div 
                      class="weight-fill" 
                      :style="{ width: `${getFactorWeight(index)}%` }"
                    ></div>
                  </div>
                  <span class="weight-value">{{ getFactorWeight(index) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Timeline Analysis -->
        <div v-if="analysis.timeline && analysis.timeline.length > 0" class="timeline-analysis">
          <h4>Issue Timeline</h4>
          <div class="timeline">
            <div
              v-for="(event, index) in analysis.timeline"
              :key="index"
              class="timeline-item"
              :class="event.impact"
            >
              <div class="timeline-marker" :class="event.impact">
                <div class="marker-dot"></div>
              </div>
              
              <div class="timeline-content">
                <div class="timeline-header">
                  <span class="timeline-time">{{ event.time }}</span>
                  <span class="timeline-impact" :class="event.impact">{{ event.impact }}</span>
                </div>
                <div class="timeline-event">{{ event.event }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Data Evidence -->
        <div v-if="analysis.dataEvidence" class="data-evidence">
          <h4>Supporting Data Evidence</h4>
          <div class="evidence-grid">
            <div
              v-for="(value, key) in analysis.dataEvidence"
              :key="key"
              class="evidence-item"
            >
              <div class="evidence-label">{{ formatEvidenceLabel(key) }}</div>
              <div class="evidence-value" :class="getEvidenceClass(key, value)">
                {{ value }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- AI Reasoning -->
        <div class="ai-reasoning">
          <h4>AI Analysis Explanation</h4>
          <div class="reasoning-content">
            <div class="reasoning-icon">
              <BrainIcon />
            </div>
            <div class="reasoning-text">
              <p>{{ getAIReasoning() }}</p>
            </div>
          </div>
        </div>
        
        <!-- Recommended Actions -->
        <div v-if="analysis.recommendedActions && analysis.recommendedActions.length > 0" class="recommended-actions">
          <h4>Recommended Actions</h4>
          <div class="actions-list">
            <div
              v-for="(action, index) in analysis.recommendedActions"
              :key="index"
              class="action-item"
              :class="getActionPriority(action)"
            >
              <div class="action-icon">
                <CheckCircleIcon v-if="action.includes('Immediate')" />
                <ClockIcon v-else-if="action.includes('Short-term')" />
                <CalendarIcon v-else-if="action.includes('Medium-term')" />
                <TrendingUpIcon v-else />
              </div>
              <div class="action-content">
                <div class="action-text">{{ action.replace(/^(Immediate|Short-term|Medium-term|Long-term):\s*/, '') }}</div>
                <div class="action-priority">{{ getActionPriority(action) }}</div>
              </div>
              <button @click="executeAction(action)" class="action-btn">
                Execute
              </button>
            </div>
          </div>
        </div>
        
        <!-- Prevention Measures -->
        <div v-if="analysis.preventionMeasures && analysis.preventionMeasures.length > 0" class="prevention-measures">
          <h4>Prevention Measures</h4>
          <div class="prevention-list">
            <div
              v-for="(measure, index) in analysis.preventionMeasures"
              :key="index"
              class="prevention-item"
            >
              <div class="prevention-icon">
                <ShieldCheckIcon />
              </div>
              <div class="prevention-text">{{ measure }}</div>
            </div>
          </div>
        </div>
        
        <!-- Analysis Confidence Breakdown -->
        <div class="confidence-breakdown">
          <h4>Analysis Confidence Breakdown</h4>
          <div class="confidence-metrics">
            <div class="confidence-metric">
              <span class="metric-label">Data Quality</span>
              <div class="metric-bar">
                <div class="metric-fill" style="width: 92%"></div>
              </div>
              <span class="metric-value">92%</span>
            </div>
            
            <div class="confidence-metric">
              <span class="metric-label">Pattern Recognition</span>
              <div class="metric-bar">
                <div class="metric-fill" style="width: 87%"></div>
              </div>
              <span class="metric-value">87%</span>
            </div>
            
            <div class="confidence-metric">
              <span class="metric-label">Historical Correlation</span>
              <div class="metric-bar">
                <div class="metric-fill" style="width: 89%"></div>
              </div>
              <span class="metric-value">89%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="widget-footer">
      <div class="analysis-info">
        <span class="analysis-time">
          Analysis updated {{ formatTimeAgo(lastAnalysisTime) }}
        </span>
      </div>
      
      <div class="footer-actions">
        <button @click="exportAnalysis" class="action-btn secondary small">
          Export Report
        </button>
        <button @click="scheduleFollowUp" class="action-btn secondary small">
          Schedule Follow-up
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MagnifyingGlassIcon from '@/components/icons/MagnifyingGlassIcon.vue'
import RefreshIcon from '@/components/icons/RefreshIcon.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import AlertCircleIcon from '@/components/icons/AlertCircleIcon.vue'
import ChevronRightIcon from '@/components/icons/ChevronRightIcon.vue'
import BrainIcon from '@/components/icons/BrainIcon.vue'
import CheckCircleIcon from '@/components/icons/CheckCircleIcon.vue'
import ClockIcon from '@/components/icons/ClockIcon.vue'
import CalendarIcon from '@/components/icons/CalendarIcon.vue'
import TrendingUpIcon from '@/components/icons/TrendingUpIcon.vue'
import ShieldCheckIcon from '@/components/icons/ShieldCheckIcon.vue'

const props = defineProps({
  analysis: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['refresh', 'execute-action', 'schedule-followup'])

// State
const refreshing = ref(false)
const lastAnalysisTime = ref(new Date())

// Methods
const refreshAnalysis = async () => {
  refreshing.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    lastAnalysisTime.value = new Date()
    emit('refresh')
  } finally {
    refreshing.value = false
  }
}

const getFactorWeight = (index) => {
  // Decrease weight for each subsequent factor
  const weights = [85, 72, 58, 45, 32]
  return weights[index] || 20
}

const formatEvidenceLabel = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

const getEvidenceClass = (key, value) => {
  if (key.toLowerCase().includes('error') || key.toLowerCase().includes('failure')) {
    return 'negative'
  }
  if (key.toLowerCase().includes('performance') || key.toLowerCase().includes('load')) {
    return 'warning'
  }
  return 'neutral'
}

const getAIReasoning = () => {
  if (!props.analysis) return ''
  
  return `Based on comprehensive analysis of operational data, system logs, and historical patterns, the AI has identified ${props.analysis.primaryCause.toLowerCase()} as the primary root cause with ${Math.round(props.analysis.confidence * 100)}% confidence. This conclusion is supported by correlating multiple data sources including performance metrics, error rates, and timing patterns that align with known operational dependencies.`
}

const getActionPriority = (action) => {
  if (action.includes('Immediate')) return 'immediate'
  if (action.includes('Short-term')) return 'short-term'
  if (action.includes('Medium-term')) return 'medium-term'
  if (action.includes('Long-term')) return 'long-term'
  return 'medium-term'
}

const executeAction = (action) => {
  emit('execute-action', action)
}

const scheduleFollowUp = () => {
  emit('schedule-followup', props.analysis)
}

const formatTimeAgo = (date) => {
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / 60000)
  
  if (diffInMinutes < 1) return 'just now'
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} hours ago`
  
  return date.toLocaleDateString()
}

const exportAnalysis = () => {
  if (!props.analysis) return
  
  const reportData = {
    title: 'Root Cause Analysis Report',
    analysis: props.analysis,
    generated: new Date().toISOString(),
    confidence: props.analysis.confidence,
    summary: `Primary cause identified: ${props.analysis.primaryCause}`
  }
  
  const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `root-cause-analysis-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.root-cause-analysis-widget {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.header-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.analysis-icon {
  width: 32px;
  height: 32px;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.analysis-meta h3 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.analysis-status {
  font-size: 11px;
  color: #64748b;
  line-height: 1.3;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.confidence-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 8px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 6px;
  text-align: center;
}

.confidence-label {
  font-size: 14px;
  font-weight: 700;
  color: #16a34a;
  line-height: 1;
}

.confidence-text {
  font-size: 9px;
  color: #16a34a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.refresh-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 6px;
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

.analysis-content {
  max-height: 600px;
  overflow-y: auto;
  padding: 20px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  color: #94a3b8;
}

.empty-state h4 {
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

.active-analysis {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.active-analysis h4 {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.primary-cause {
  background: linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%);
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 16px;
}

.cause-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.cause-item.primary .cause-icon {
  width: 24px;
  height: 24px;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cause-item.contributing .cause-icon {
  width: 16px;
  height: 16px;
  color: #64748b;
  flex-shrink: 0;
  margin-top: 2px;
}

.cause-content {
  flex: 1;
  min-width: 0;
}

.cause-title {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  line-height: 1.4;
  margin-bottom: 8px;
}

.cause-confidence,
.factor-weight {
  display: flex;
  align-items: center;
  gap: 8px;
}

.confidence-bar,
.weight-bar,
.metric-bar {
  flex: 1;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.confidence-fill.primary {
  height: 100%;
  background: #dc2626;
  border-radius: 2px;
}

.weight-fill,
.metric-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 2px;
}

.confidence-value,
.weight-value,
.metric-value {
  font-size: 11px;
  font-weight: 600;
  color: #1e293b;
  min-width: 30px;
  text-align: right;
}

.contributing-factors {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}

.factors-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.timeline-analysis {
  background: #f0fdf4;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #bbf7d0;
}

.timeline {
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 10px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #d1d5db;
}

.timeline-item {
  position: relative;
  margin-bottom: 16px;
  padding-left: 32px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: 6px;
  top: 4px;
  width: 8px;
  height: 8px;
}

.marker-dot {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #94a3b8;
}

.timeline-marker.critical .marker-dot {
  background: #ef4444;
}

.timeline-marker.significant .marker-dot {
  background: #f59e0b;
}

.timeline-marker.moderate .marker-dot {
  background: #3b82f6;
}

.timeline-marker.minimal .marker-dot {
  background: #10b981;
}

.timeline-content {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.timeline-time {
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
}

.timeline-impact {
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 6px;
  border-radius: 10px;
}

.timeline-impact.critical {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.timeline-impact.significant {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.timeline-impact.moderate {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.timeline-impact.minimal {
  background: rgba(16, 185, 129, 0.1);
  color: #16a34a;
}

.timeline-event {
  font-size: 13px;
  color: #374151;
  line-height: 1.4;
}

.data-evidence {
  background: #fffbeb;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #fed7aa;
}

.evidence-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.evidence-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.evidence-label {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.evidence-value {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.evidence-value.negative {
  color: #dc2626;
}

.evidence-value.warning {
  color: #d97706;
}

.evidence-value.neutral {
  color: #1e293b;
}

.ai-reasoning {
  background: #eff6ff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #bfdbfe;
}

.reasoning-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.reasoning-icon {
  width: 24px;
  height: 24px;
  color: #3b82f6;
  flex-shrink: 0;
  margin-top: 2px;
}

.reasoning-text p {
  font-size: 13px;
  color: #374151;
  line-height: 1.5;
  margin: 0;
}

.recommended-actions {
  background: #f0fdf4;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #bbf7d0;
}

.actions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.action-item.immediate {
  border-left: 4px solid #ef4444;
}

.action-item.short-term {
  border-left: 4px solid #f59e0b;
}

.action-item.medium-term {
  border-left: 4px solid #3b82f6;
}

.action-item.long-term {
  border-left: 4px solid #10b981;
}

.action-icon {
  width: 16px;
  height: 16px;
  color: #64748b;
  flex-shrink: 0;
}

.action-content {
  flex: 1;
  min-width: 0;
}

.action-text {
  font-size: 13px;
  color: #374151;
  line-height: 1.4;
  margin-bottom: 2px;
}

.action-priority {
  font-size: 10px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.action-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.action-btn:hover {
  background: #2563eb;
}

.prevention-measures {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}

.prevention-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.prevention-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #374151;
  line-height: 1.4;
}

.prevention-icon {
  width: 16px;
  height: 16px;
  color: #10b981;
  flex-shrink: 0;
  margin-top: 2px;
}

.confidence-breakdown {
  background: #f1f5f9;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #d1d5db;
}

.confidence-metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.confidence-metric {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.metric-label {
  min-width: 120px;
  color: #64748b;
  font-weight: 500;
}

.widget-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  font-size: 11px;
}

.analysis-info {
  flex: 1;
}

.analysis-time {
  color: #64748b;
}

.footer-actions {
  display: flex;
  gap: 8px;
}

.action-btn.secondary {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.action-btn.secondary:hover {
  background: #e2e8f0;
  color: #374151;
}

.action-btn.small {
  padding: 4px 8px;
  font-size: 10px;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .analysis-content {
    padding: 16px;
  }
  
  .evidence-grid {
    grid-template-columns: 1fr;
  }
  
  .confidence-metric {
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
  }
  
  .metric-label {
    min-width: auto;
  }
  
  .action-item {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .footer-actions {
    flex-direction: column;
  }
}
</style>