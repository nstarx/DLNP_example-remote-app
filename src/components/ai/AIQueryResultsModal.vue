<template>
  <div v-if="modelValue" class="query-results-modal-overlay" @click="closeModal">
    <div class="query-results-modal" @click.stop>
      <div class="modal-header">
        <div class="header-content">
          <div class="ai-branding">
            <BrainIcon class="ai-icon" />
            <span class="ai-label">AI Analysis</span>
          </div>
          <h2 class="query-title">{{ results?.title || 'Query Results' }}</h2>
          <div class="confidence-indicator" v-if="results?.confidence">
            <span class="confidence-label">Confidence:</span>
            <div class="confidence-bar">
              <div 
                class="confidence-fill" 
                :style="{ width: `${results.confidence * 100}%` }"
                :class="getConfidenceClass(results.confidence)"
              ></div>
            </div>
            <span class="confidence-value">{{ Math.round(results.confidence * 100) }}%</span>
          </div>
        </div>
        
        <div class="header-actions">
          <button @click="exportResults" class="action-btn secondary" title="Export results">
            <DownloadIcon />
          </button>
          <button @click="closeModal" class="close-btn" title="Close">
            <CloseIcon />
          </button>
        </div>
      </div>
      
      <div class="modal-content">
        <!-- Summary Section -->
        <div class="results-summary">
          <h3>Summary</h3>
          <p class="summary-text">{{ results?.summary }}</p>
        </div>
        
        <!-- Key Insights -->
        <div v-if="results?.insights && results.insights.length > 0" class="key-insights">
          <h3>Key Insights</h3>
          <div class="insights-list">
            <div
              v-for="(insight, index) in results.insights"
              :key="index"
              class="insight-item"
            >
              <div class="insight-icon">
                <CheckCircleIcon class="icon" />
              </div>
              <div class="insight-text">{{ insight }}</div>
            </div>
          </div>
        </div>
        
        <!-- Data Visualization -->
        <div v-if="results?.data" class="data-visualization">
          <h3>Data Analysis</h3>
          
          <!-- Regional Data Table -->
          <div v-if="results.data.regions" class="data-table-section">
            <h4>Regional Breakdown</h4>
            <div class="data-table">
              <div class="table-header">
                <div class="header-cell">Region</div>
                <div class="header-cell">Value</div>
                <div class="header-cell">Status</div>
              </div>
              <div class="table-body">
                <div
                  v-for="region in results.data.regions"
                  :key="region.name"
                  class="table-row"
                  :class="region.status"
                >
                  <div class="table-cell">{{ region.name }}</div>
                  <div class="table-cell">
                    {{ typeof region.avgTime !== 'undefined' ? region.avgTime + 'h' : region.score }}
                  </div>
                  <div class="table-cell">
                    <span class="status-badge" :class="region.status">
                      {{ region.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Forecast Chart -->
          <div v-if="results.data.labels && results.data.data" class="chart-section">
            <h4>Forecast Trend</h4>
            <div class="mini-chart">
              <svg class="chart-svg" viewBox="0 0 300 100">
                <!-- Chart background -->
                <rect width="300" height="100" fill="#f8fafc" rx="4" />
                
                <!-- Grid lines -->
                <g class="grid-lines">
                  <line v-for="i in 5" :key="`h-${i}`" 
                    :x1="0" :x2="300" 
                    :y1="i * 20" :y2="i * 20" 
                    stroke="#e2e8f0" stroke-width="0.5" />
                  <line v-for="i in 6" :key="`v-${i}`" 
                    :x1="i * 50" :x2="i * 50" 
                    :y1="0" :y2="100" 
                    stroke="#e2e8f0" stroke-width="0.5" />
                </g>
                
                <!-- Data line -->
                <polyline
                  :points="generateChartPoints(results.data)"
                  fill="none"
                  stroke="#3b82f6"
                  stroke-width="2"
                />
                
                <!-- Data points -->
                <circle
                  v-for="(point, index) in results.data.data"
                  :key="index"
                  :cx="(index / (results.data.data.length - 1)) * 280 + 10"
                  :cy="90 - ((point - Math.min(...results.data.data)) / (Math.max(...results.data.data) - Math.min(...results.data.data))) * 80"
                  r="3"
                  fill="#3b82f6"
                />
                
                <!-- Target line if available -->
                <line v-if="results.data.target"
                  x1="10" x2="290"
                  :y1="90 - ((results.data.target - Math.min(...results.data.data)) / (Math.max(...results.data.data) - Math.min(...results.data.data))) * 80"
                  :y2="90 - ((results.data.target - Math.min(...results.data.data)) / (Math.max(...results.data.data) - Math.min(...results.data.data))) * 80"
                  stroke="#ef4444"
                  stroke-width="2"
                  stroke-dasharray="5,5"
                />
              </svg>
            </div>
          </div>
          
          <!-- Cost Opportunities -->
          <div v-if="results.data.opportunities" class="opportunities-section">
            <h4>Cost Optimization Opportunities</h4>
            <div class="opportunities-grid">
              <div
                v-for="opportunity in results.data.opportunities"
                :key="opportunity.id"
                class="opportunity-card"
              >
                <div class="opportunity-header">
                  <div class="opportunity-icon" :class="opportunity.category">
                    <DollarSignIcon v-if="opportunity.category === 'cost'" />
                    <CogIcon v-else-if="opportunity.category === 'automation'" />
                    <UsersIcon v-else />
                  </div>
                  <div class="opportunity-meta">
                    <h5>{{ opportunity.title }}</h5>
                    <span class="savings-amount">
                      ${{ formatCurrency(opportunity.estimatedSavings) }} potential savings
                    </span>
                  </div>
                </div>
                <p class="opportunity-description">{{ opportunity.description }}</p>
                <div class="opportunity-timeline">
                  <span class="timeline-label">Implementation:</span>
                  <span class="timeline-value">{{ opportunity.timeToImplement }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Performance Metrics -->
          <div v-if="results.data.currentScore || results.data.regional" class="metrics-section">
            <h4>Performance Metrics</h4>
            
            <div v-if="results.data.currentScore" class="score-display">
              <div class="score-circle">
                <svg class="score-svg" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" stroke-width="8" />
                  <circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    stroke="#10b981"
                    stroke-width="8"
                    stroke-linecap="round"
                    :stroke-dasharray="`${(results.data.currentScore / 100) * 283} 283`"
                    transform="rotate(-90 50 50)"
                  />
                  <text x="50" y="50" text-anchor="middle" dy="0.3em" class="score-text">
                    {{ results.data.currentScore }}%
                  </text>
                </svg>
              </div>
              <div class="score-details">
                <div class="current-score">
                  <span class="score-label">Current Score</span>
                  <span class="score-value">{{ results.data.currentScore }}%</span>
                </div>
                <div class="target-score">
                  <span class="score-label">Target</span>
                  <span class="score-value">{{ results.data.target }}%</span>
                </div>
                <div class="trend-indicator" :class="results.data.trend">
                  <TrendingUpIcon v-if="results.data.trend === 'positive'" class="trend-icon" />
                  <TrendingDownIcon v-else class="trend-icon" />
                  <span>{{ results.data.trend }}</span>
                </div>
              </div>
            </div>
            
            <div v-if="results.data.regional" class="regional-scores">
              <div
                v-for="region in results.data.regional"
                :key="region.region"
                class="regional-score-item"
              >
                <span class="region-name">{{ region.region }}</span>
                <div class="score-bar">
                  <div 
                    class="score-fill" 
                    :style="{ width: `${region.score}%` }"
                  ></div>
                </div>
                <span class="region-score">{{ region.score }}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Suggested Actions -->
        <div v-if="results?.suggestion" class="suggested-actions">
          <h3>Suggested Next Steps</h3>
          <div class="suggestion-box">
            <div class="suggestion-icon">
              <LightbulbIcon class="icon" />
            </div>
            <div class="suggestion-text">{{ results.suggestion }}</div>
          </div>
        </div>
        
        <!-- Follow-up Questions -->
        <div class="follow-up-questions">
          <h3>Ask Follow-up Questions</h3>
          <div class="question-suggestions">
            <button
              v-for="question in getFollowUpQuestions(results?.type)"
              :key="question"
              @click="askFollowUp(question)"
              class="question-btn"
            >
              {{ question }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <div class="footer-info">
          <span class="analysis-time">
            Analysis completed at {{ new Date().toLocaleTimeString() }}
          </span>
        </div>
        
        <div class="footer-actions">
          <button @click="saveResults" class="action-btn secondary">
            Save Results
          </button>
          <button @click="closeModal" class="action-btn primary">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BrainIcon from '@/components/icons/BrainIcon.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import DownloadIcon from '@/components/icons/DownloadIcon.vue'
import CheckCircleIcon from '@/components/icons/CheckCircleIcon.vue'
import DollarSignIcon from '@/components/icons/DollarSignIcon.vue'
import CogIcon from '@/components/icons/CogIcon.vue'
import UsersIcon from '@/components/icons/UsersIcon.vue'
import TrendingUpIcon from '@/components/icons/TrendingUpIcon.vue'
import TrendingDownIcon from '@/components/icons/TrendingDownIcon.vue'
import LightbulbIcon from '@/components/icons/LightbulbIcon.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  results: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'follow-up-query'])

// Methods
const closeModal = () => {
  emit('update:modelValue', false)
}

const getConfidenceClass = (confidence) => {
  if (confidence >= 0.8) return 'high-confidence'
  if (confidence >= 0.6) return 'medium-confidence'
  return 'low-confidence'
}

const formatCurrency = (amount) => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K`
  }
  return amount.toLocaleString()
}

const generateChartPoints = (data) => {
  if (!data.data || data.data.length === 0) return ''
  
  const minValue = Math.min(...data.data)
  const maxValue = Math.max(...data.data)
  const range = maxValue - minValue || 1
  
  return data.data
    .map((value, index) => {
      const x = (index / (data.data.length - 1)) * 280 + 10
      const y = 90 - ((value - minValue) / range) * 80
      return `${x},${y}`
    })
    .join(' ')
}

const getFollowUpQuestions = (type) => {
  const questions = {
    analysis: [
      'What are the specific causes of this trend?',
      'How does this compare to last quarter?',
      'What actions can we take to improve?'
    ],
    forecast: [
      'What factors influence this forecast?',
      'How accurate have past forecasts been?',
      'What scenarios could change this prediction?'
    ],
    cost_analysis: [
      'Which opportunities should we prioritize?',
      'What are the risks of these optimizations?',
      'How quickly can we implement these changes?'
    ],
    trend_analysis: [
      'What's driving this trend?',
      'Which regions are performing best?',
      'What benchmarks should we compare against?'
    ]
  }
  
  return questions[type] || [
    'Can you provide more details?',
    'How can we improve this metric?',
    'What are the next steps?'
  ]
}

const askFollowUp = (question) => {
  emit('follow-up-query', question)
  closeModal()
}

const exportResults = () => {
  const data = {
    query: 'AI Analysis Results',
    timestamp: new Date().toISOString(),
    results: props.results
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ai-analysis-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const saveResults = () => {
  // Save to localStorage or send to server
  const savedResults = JSON.parse(localStorage.getItem('ai-query-results') || '[]')
  savedResults.unshift({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    results: props.results
  })
  
  // Keep only last 10 results
  savedResults.splice(10)
  
  localStorage.setItem('ai-query-results', JSON.stringify(savedResults))
  
  // Show success feedback
  console.log('Results saved successfully')
}
</script>

<style scoped>
.query-results-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 20px;
}

.query-results-modal {
  background: white;
  border-radius: 16px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header-content {
  flex: 1;
}

.ai-branding {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.ai-icon {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.9);
}

.ai-label {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.query-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: white;
}

.confidence-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.confidence-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.confidence-bar {
  width: 60px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
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

.confidence-value {
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.action-btn.primary {
  background: white;
  color: #667eea;
  border: 1px solid white;
}

.action-btn.primary:hover {
  background: #f8fafc;
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
}

.modal-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 8px;
}

.modal-content h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.modal-content h5 {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.results-summary {
  margin-bottom: 32px;
}

.summary-text {
  font-size: 16px;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

.key-insights {
  margin-bottom: 32px;
}

.insights-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #f0fdf4;
  border-radius: 8px;
  border-left: 4px solid #10b981;
}

.insight-icon .icon {
  width: 16px;
  height: 16px;
  color: #10b981;
  flex-shrink: 0;
  margin-top: 2px;
}

.insight-text {
  flex: 1;
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
}

.data-visualization {
  margin-bottom: 32px;
}

.data-table-section {
  margin-bottom: 24px;
}

.data-table {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.header-cell {
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table-body {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  border-bottom: 1px solid #f1f5f9;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row.attention {
  background: #fef3c7;
}

.table-cell {
  padding: 12px 16px;
  font-size: 14px;
  color: #374151;
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.excellent {
  background: rgba(16, 185, 129, 0.1);
  color: #16a34a;
}

.status-badge.good {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-badge.attention {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.chart-section {
  margin-bottom: 24px;
}

.mini-chart {
  width: 100%;
  height: 100px;
  margin-bottom: 16px;
}

.chart-svg {
  width: 100%;
  height: 100%;
}

.opportunities-section {
  margin-bottom: 24px;
}

.opportunities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.opportunity-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
}

.opportunity-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}

.opportunity-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.opportunity-icon.cost {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.opportunity-icon.automation {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.opportunity-meta h5 {
  margin-bottom: 4px;
}

.savings-amount {
  font-size: 12px;
  color: #16a34a;
  font-weight: 600;
}

.opportunity-description {
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
  margin: 0 0 8px 0;
}

.opportunity-timeline {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.timeline-label {
  color: #94a3b8;
  font-weight: 500;
}

.timeline-value {
  color: #64748b;
}

.metrics-section {
  margin-bottom: 24px;
}

.score-display {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 20px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.score-circle {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}

.score-svg {
  width: 100%;
  height: 100%;
}

.score-text {
  font-size: 18px;
  font-weight: 700;
  fill: #1e293b;
}

.score-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.current-score,
.target-score {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.score-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.score-value {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 16px;
  align-self: flex-start;
}

.trend-indicator.positive {
  background: rgba(16, 185, 129, 0.1);
  color: #16a34a;
}

.trend-indicator.negative {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.trend-icon {
  width: 12px;
  height: 12px;
}

.regional-scores {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.regional-score-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.region-name {
  width: 80px;
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.score-bar {
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981 0%, #16a34a 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.region-score {
  width: 40px;
  text-align: right;
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
}

.suggested-actions {
  margin-bottom: 32px;
}

.suggestion-box {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #fef3c7;
  border-radius: 8px;
  border-left: 4px solid #f59e0b;
}

.suggestion-icon .icon {
  width: 20px;
  height: 20px;
  color: #d97706;
  flex-shrink: 0;
}

.suggestion-text {
  flex: 1;
  font-size: 14px;
  color: #92400e;
  line-height: 1.5;
}

.follow-up-questions {
  margin-bottom: 16px;
}

.question-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.question-btn {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 12px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.question-btn:hover {
  background: #e2e8f0;
  color: #334155;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.footer-info {
  flex: 1;
}

.analysis-time {
  font-size: 12px;
  color: #64748b;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

/* Responsive */
@media (max-width: 768px) {
  .query-results-modal {
    margin: 10px;
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 20px;
  }
  
  .modal-content {
    padding: 20px;
  }
  
  .opportunities-grid {
    grid-template-columns: 1fr;
  }
  
  .score-display {
    flex-direction: column;
    text-align: center;
  }
  
  .question-suggestions {
    flex-direction: column;
  }
  
  .question-btn {
    text-align: left;
  }
}
</style>