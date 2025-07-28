<template>
  <div class="ai-recommendations-widget">
    <div class="widget-header">
      <div class="header-content">
        <h3>AI Recommendations</h3>
        <span class="recommendation-summary">{{ totalRecommendations }} insights available</span>
      </div>
      <div class="header-actions">
        <select v-model="selectedCategory" class="category-filter">
          <option value="all">All Categories</option>
          <option value="cost">Cost Optimization</option>
          <option value="efficiency">Efficiency</option>
          <option value="quality">Quality</option>
          <option value="automation">Automation</option>
          <option value="staffing">Staffing</option>
        </select>
      </div>
    </div>
    
    <div class="recommendations-content">
      <div v-if="filteredRecommendations.length === 0" class="empty-state">
        <LightbulbIcon class="empty-icon" />
        <h4>No recommendations</h4>
        <p>AI is analyzing your operations for optimization opportunities.</p>
      </div>
      
      <div v-else class="recommendations-list">
        <div
          v-for="recommendation in filteredRecommendations"
          :key="recommendation.id"
          class="recommendation-item"
          :class="[`priority-${recommendation.priority}`, { implemented: recommendation.implemented }]"
        >
          <div class="recommendation-header">
            <div class="priority-indicator">
              <div class="priority-dot" :class="recommendation.priority"></div>
              <div class="category-icon">
                <DollarSignIcon v-if="recommendation.category === 'cost'" />
                <ZapIcon v-else-if="recommendation.category === 'efficiency'" />
                <ShieldIcon v-else-if="recommendation.category === 'quality'" />
                <CogIcon v-else-if="recommendation.category === 'automation'" />
                <UsersIcon v-else-if="recommendation.category === 'staffing'" />
                <TrendingUpIcon v-else />
              </div>
            </div>
            
            <div class="recommendation-meta">
              <span class="category-badge" :class="recommendation.category">
                {{ getCategoryLabel(recommendation.category) }}
              </span>
              <span class="confidence-score">
                {{ Math.round(recommendation.confidence * 100) }}% confidence
              </span>
            </div>
          </div>
          
          <div class="recommendation-content">
            <h4 class="recommendation-title">{{ recommendation.title }}</h4>
            <p class="recommendation-description">{{ recommendation.description }}</p>
            
            <div class="impact-metrics">
              <div class="impact-item" v-if="recommendation.estimatedSavings">
                <span class="impact-label">Est. Savings:</span>
                <span class="impact-value savings">
                  ${{ formatCurrency(recommendation.estimatedSavings) }}
                </span>
              </div>
              
              <div class="impact-item" v-if="recommendation.timeToImplement">
                <span class="impact-label">Time to Implement:</span>
                <span class="impact-value">{{ recommendation.timeToImplement }}</span>
              </div>
              
              <div class="impact-item" v-if="recommendation.roiTimeline">
                <span class="impact-label">ROI Timeline:</span>
                <span class="impact-value">{{ recommendation.roiTimeline }}</span>
              </div>
              
              <div class="impact-item" v-if="recommendation.difficultyLevel">
                <span class="impact-label">Difficulty:</span>
                <span class="impact-value difficulty" :class="recommendation.difficultyLevel">
                  {{ recommendation.difficultyLevel }}
                </span>
              </div>
            </div>
            
            <div v-if="recommendation.keySteps" class="key-steps">
              <h5>Key Implementation Steps:</h5>
              <ol class="steps-list">
                <li v-for="step in recommendation.keySteps" :key="step">{{ step }}</li>
              </ol>
            </div>
            
            <div class="recommendation-footer">
              <div class="generated-info">
                <BrainIcon class="ai-icon" />
                <span>Generated {{ formatTimeAgo(recommendation.generatedAt) }}</span>
              </div>
              
              <div class="recommendation-actions">
                <button
                  v-if="!recommendation.implemented"
                  @click="implementRecommendation(recommendation)"
                  class="action-btn primary"
                  :disabled="recommendation.implementing"
                >
                  <span v-if="recommendation.implementing">Implementing...</span>
                  <span v-else>Implement</span>
                </button>
                
                <button @click="viewDetails(recommendation)" class="action-btn secondary">
                  View Details
                </button>
                
                <button 
                  @click="dismissRecommendation(recommendation.id)" 
                  class="action-btn tertiary"
                  :disabled="recommendation.dismissed"
                >
                  {{ recommendation.dismissed ? 'Dismissed' : 'Dismiss' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recommendation Detail Modal -->
    <div v-if="selectedRecommendation" class="recommendation-modal-overlay" @click="closeModal">
      <div class="recommendation-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title-section">
            <h3>{{ selectedRecommendation.title }}</h3>
            <span class="category-badge" :class="selectedRecommendation.category">
              {{ getCategoryLabel(selectedRecommendation.category) }}
            </span>
          </div>
          <button @click="closeModal" class="close-btn">
            <CloseIcon />
          </button>
        </div>
        
        <div class="modal-content">
          <div class="detailed-analysis">
            <h4>AI Analysis</h4>
            <p>{{ selectedRecommendation.detailedAnalysis }}</p>
          </div>
          
          <div v-if="selectedRecommendation.dataPoints" class="supporting-data">
            <h4>Supporting Data</h4>
            <div class="data-points">
              <div v-for="point in selectedRecommendation.dataPoints" :key="point.metric" class="data-point">
                <span class="data-metric">{{ point.metric }}</span>
                <span class="data-value" :class="point.trend">
                  {{ point.value }} {{ point.change }}
                </span>
              </div>
            </div>
          </div>
          
          <div v-if="selectedRecommendation.riskAssessment" class="risk-assessment">
            <h4>Risk Assessment</h4>
            <div class="risk-level" :class="selectedRecommendation.riskAssessment.level">
              <span class="risk-label">Risk Level:</span>
              <span class="risk-value">{{ selectedRecommendation.riskAssessment.level }}</span>
            </div>
            <p class="risk-description">{{ selectedRecommendation.riskAssessment.description }}</p>
            
            <div v-if="selectedRecommendation.riskAssessment.mitigationSteps" class="mitigation-steps">
              <h5>Risk Mitigation:</h5>
              <ul>
                <li v-for="step in selectedRecommendation.riskAssessment.mitigationSteps" :key="step">
                  {{ step }}
                </li>
              </ul>
            </div>
          </div>
          
          <div v-if="selectedRecommendation.successMetrics" class="success-metrics">
            <h4>Success Metrics</h4>
            <div class="metrics-list">
              <div v-for="metric in selectedRecommendation.successMetrics" :key="metric.name" class="metric-card">
                <div class="metric-name">{{ metric.name }}</div>
                <div class="metric-target">Target: {{ metric.target }}</div>
                <div class="metric-timeframe">{{ metric.timeframe }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="implementRecommendation(selectedRecommendation)" class="action-btn primary">
            Implement Recommendation
          </button>
          <button @click="scheduleImplementation(selectedRecommendation)" class="action-btn secondary">
            Schedule Later
          </button>
          <button @click="closeModal" class="action-btn tertiary">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import LightbulbIcon from '@/components/icons/LightbulbIcon.vue'
import DollarSignIcon from '@/components/icons/DollarSignIcon.vue'
import ZapIcon from '@/components/icons/ZapIcon.vue'
import ShieldIcon from '@/components/icons/ShieldIcon.vue'
import CogIcon from '@/components/icons/CogIcon.vue'
import UsersIcon from '@/components/icons/UsersIcon.vue'
import TrendingUpIcon from '@/components/icons/TrendingUpIcon.vue'
import BrainIcon from '@/components/icons/BrainIcon.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'

const props = defineProps({
  recommendations: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['action', 'dismiss', 'schedule'])

// State
const selectedCategory = ref('all')
const selectedRecommendation = ref(null)

// Computed
const totalRecommendations = computed(() => {
  return props.recommendations.filter(r => !r.dismissed && !r.implemented).length
})

const filteredRecommendations = computed(() => {
  let filtered = props.recommendations.filter(r => !r.dismissed)
  
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(r => r.category === selectedCategory.value)
  }
  
  return filtered.sort((a, b) => {
    // Sort by priority first
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
    if (priorityDiff !== 0) return priorityDiff
    
    // Then by estimated savings (if available)
    if (a.estimatedSavings && b.estimatedSavings) {
      return b.estimatedSavings - a.estimatedSavings
    }
    
    // Finally by generation time (newest first)
    return new Date(b.generatedAt) - new Date(a.generatedAt)
  })
})

// Methods
const getCategoryLabel = (category) => {
  const labels = {
    cost: 'Cost',
    efficiency: 'Efficiency',
    quality: 'Quality',
    automation: 'Automation',
    staffing: 'Staffing'
  }
  return labels[category] || 'General'
}

const formatCurrency = (amount) => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K`
  }
  return amount.toLocaleString()
}

const formatTimeAgo = (timestamp) => {
  const now = new Date()
  const recTime = new Date(timestamp)
  const diffInHours = Math.floor((now - recTime) / 3600000)
  
  if (diffInHours < 1) return 'just now'
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return recTime.toLocaleDateString()
}

const implementRecommendation = (recommendation) => {
  emit('action', recommendation, 'implement')
}

const scheduleImplementation = (recommendation) => {
  emit('schedule', recommendation)
}

const dismissRecommendation = (recommendationId) => {
  emit('dismiss', recommendationId)
}

const viewDetails = (recommendation) => {
  selectedRecommendation.value = recommendation
}

const closeModal = () => {
  selectedRecommendation.value = null
}
</script>

<style scoped>
.ai-recommendations-widget {
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

.recommendation-summary {
  font-size: 11px;
  color: #64748b;
}

.category-filter {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 11px;
  color: #374151;
}

.recommendations-content {
  max-height: 500px;
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
  color: #f59e0b;
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

.recommendations-list {
  padding: 0;
}

.recommendation-item {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.15s ease;
}

.recommendation-item:hover {
  background: #f8fafc;
}

.recommendation-item.implemented {
  background: #f0fdf4;
  border-left: 3px solid #10b981;
}

.recommendation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.priority-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.priority-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.priority-dot.high {
  background: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

.priority-dot.medium {
  background: #f59e0b;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
}

.priority-dot.low {
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.category-icon {
  width: 16px;
  height: 16px;
  color: #64748b;
}

.recommendation-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.category-badge.cost {
  background: rgba(16, 185, 129, 0.1);
  color: #16a34a;
}

.category-badge.efficiency {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.category-badge.quality {
  background: rgba(168, 85, 247, 0.1);
  color: #9333ea;
}

.category-badge.automation {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.category-badge.staffing {
  background: rgba(236, 72, 153, 0.1);
  color: #db2777;
}

.confidence-score {
  font-size: 10px;
  color: #64748b;
}

.recommendation-content {
  margin-left: 24px;
}

.recommendation-title {
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
  margin: 0 0 6px 0;
  line-height: 1.3;
}

.recommendation-description {
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
  margin: 0 0 12px 0;
}

.impact-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  margin-bottom: 12px;
}

.impact-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.impact-label {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 500;
}

.impact-value {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}

.impact-value.savings {
  color: #16a34a;
  font-weight: 600;
}

.difficulty.easy { color: #16a34a; }
.difficulty.medium { color: #f59e0b; }
.difficulty.hard { color: #ef4444; }

.key-steps {
  margin-bottom: 12px;
}

.key-steps h5 {
  font-size: 11px;
  font-weight: 500;
  color: #1e293b;
  margin: 0 0 6px 0;
}

.steps-list {
  margin: 0;
  padding-left: 16px;
}

.steps-list li {
  font-size: 11px;
  color: #64748b;
  line-height: 1.4;
  margin-bottom: 2px;
}

.recommendation-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.generated-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #94a3b8;
}

.ai-icon {
  width: 12px;
  height: 12px;
  color: #3b82f6;
}

.recommendation-actions {
  display: flex;
  gap: 6px;
}

.action-btn {
  border: none;
  border-radius: 4px;
  font-size: 10px;
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

.action-btn.secondary:hover {
  background: #e2e8f0;
  color: #374151;
}

.action-btn.tertiary {
  background: none;
  color: #94a3b8;
  padding: 4px 8px;
}

.action-btn.tertiary:hover:not(:disabled) {
  color: #64748b;
  background: #f8fafc;
}

/* Modal Styles */
.recommendation-modal-overlay {
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

.recommendation-modal {
  background: white;
  border-radius: 12px;
  max-width: 700px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-title-section h3 {
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

.modal-content h5 {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin: 12px 0 6px 0;
}

.modal-content p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 20px 0;
}

.data-points {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.data-point {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
}

.data-metric {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.data-value {
  font-size: 12px;
  font-weight: 600;
}

.data-value.positive { color: #16a34a; }
.data-value.negative { color: #dc2626; }
.data-value.neutral { color: #64748b; }

.risk-level {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.risk-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.risk-value {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  text-transform: uppercase;
}

.risk-level.low .risk-value {
  background: rgba(16, 185, 129, 0.1);
  color: #16a34a;
}

.risk-level.medium .risk-value {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.risk-level.high .risk-value {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.risk-description {
  font-size: 13px;
  margin-bottom: 12px;
}

.mitigation-steps ul {
  margin: 0;
  padding-left: 20px;
}

.mitigation-steps li {
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
  margin-bottom: 4px;
}

.metrics-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.metric-card {
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.metric-name {
  font-size: 12px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 4px;
}

.metric-target {
  font-size: 11px;
  color: #64748b;
  margin-bottom: 2px;
}

.metric-timeframe {
  font-size: 10px;
  color: #94a3b8;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e2e8f0;
}
</style>