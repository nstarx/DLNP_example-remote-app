<template>
  <div class="root-cause-analysis">
    <div class="rca-header">
      <h3 class="rca-title">🔍 Root Cause Analysis</h3>
      <div class="confidence-badge">
        <span class="confidence-label">Confidence:</span>
        <span class="confidence-value" :class="confidenceClass">{{ Math.round(analysis.confidence * 100) }}%</span>
      </div>
    </div>
    
    <div class="rca-content">
      <!-- Primary Root Cause -->
      <div class="cause-section primary">
        <div class="cause-header">
          <span class="cause-icon">🎯</span>
          <h4 class="cause-title">Primary Root Cause</h4>
        </div>
        <div class="cause-description">{{ analysis.primary }}</div>
      </div>
      
      <!-- Contributing Factors -->
      <div class="cause-section contributing">
        <div class="cause-header">
          <span class="cause-icon">🔗</span>
          <h4 class="cause-title">Contributing Factors</h4>
        </div>
        <div class="factors-list">
          <div 
            v-for="(factor, index) in analysis.contributing" 
            :key="index"
            class="factor-item"
          >
            <span class="factor-bullet">•</span>
            <span class="factor-text">{{ factor }}</span>
          </div>
        </div>
      </div>
      
      <!-- AI Reasoning -->
      <div class="cause-section reasoning">
        <div class="cause-header">
          <span class="cause-icon">🧠</span>
          <h4 class="cause-title">AI Reasoning</h4>
        </div>
        <div class="reasoning-content">
          <div class="reasoning-method">
            <strong>Analysis Method:</strong> {{ analysisMethod }}
          </div>
          <div class="reasoning-factors">
            <strong>Data Sources:</strong> {{ dataSources.join(', ') }}
          </div>
          <div class="reasoning-explanation">
            {{ reasoning }}
          </div>
        </div>
      </div>
      
      <!-- Impact Assessment -->
      <div class="cause-section impact">
        <div class="cause-header">
          <span class="cause-icon">📊</span>
          <h4 class="cause-title">Impact Assessment</h4>
        </div>
        <div class="impact-metrics">
          <div class="impact-item">
            <span class="impact-label">Financial Impact:</span>
            <span class="impact-value negative">${{ formatNumber(impactMetrics.financial) }}K</span>
          </div>
          <div class="impact-item">
            <span class="impact-label">Customer Satisfaction:</span>
            <span class="impact-value negative">-{{ impactMetrics.satisfaction }}%</span>
          </div>
          <div class="impact-item">
            <span class="impact-label">Processing Efficiency:</span>
            <span class="impact-value negative">-{{ impactMetrics.efficiency }}%</span>
          </div>
        </div>
      </div>
      
      <!-- Recommendations -->
      <div class="cause-section recommendations">
        <div class="cause-header">
          <span class="cause-icon">💡</span>
          <h4 class="cause-title">AI Recommendations</h4>
        </div>
        <div class="recommendation-content">
          <div class="primary-recommendation">
            <strong>Primary Action:</strong> {{ analysis.recommendation }}
          </div>
          <div class="additional-recommendations">
            <h5>Additional Recommendations:</h5>
            <div class="rec-list">
              <div v-for="(rec, index) in additionalRecommendations" :key="index" class="rec-item">
                <span class="rec-priority" :class="rec.priority">{{ rec.priority.toUpperCase() }}</span>
                <span class="rec-text">{{ rec.action }}</span>
                <span class="rec-timeline">{{ rec.timeline }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Validation & Evidence -->
      <div class="cause-section validation">
        <div class="cause-header">
          <span class="cause-icon">✅</span>
          <h4 class="cause-title">Evidence & Validation</h4>
        </div>
        <div class="evidence-content">
          <div class="evidence-sources">
            <h5>Supporting Evidence:</h5>
            <div v-for="(evidence, index) in evidenceList" :key="index" class="evidence-item">
              <span class="evidence-type">{{ evidence.type }}:</span>
              <span class="evidence-description">{{ evidence.description }}</span>
              <span class="evidence-strength" :class="evidence.strength">{{ evidence.strength }}</span>
            </div>
          </div>
          
          <div class="validation-tests">
            <h5>Validation Tests Performed:</h5>
            <div class="test-results">
              <div v-for="(test, index) in validationTests" :key="index" class="test-item">
                <span class="test-name">{{ test.name }}</span>
                <span class="test-result" :class="test.result">{{ test.result }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="rca-actions">
      <button class="btn-primary" @click="implementRecommendation">
        Implement Primary Recommendation
      </button>
      <button class="btn-secondary" @click="scheduleReview">
        Schedule Follow-up Review
      </button>
      <button class="btn-tertiary" @click="exportAnalysis">
        Export Analysis
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

// Props
const props = defineProps({
  analysis: {
    type: Object,
    required: true,
    default: () => ({
      primary: '',
      contributing: [],
      recommendation: '',
      confidence: 0.85
    })
  },
  issue: {
    type: String,
    default: 'general'
  }
})

// AI Analysis Details
const analysisMethod = ref('Multi-factor causal inference with statistical correlation analysis')
const dataSources = ref([
  'Claims processing metrics',
  'System performance logs', 
  'Staffing data',
  'Customer feedback',
  'Historical patterns'
])

const reasoning = ref(
  'AI identified correlation between staffing levels and processing delays through time-series analysis. Statistical significance: p < 0.001. Cross-validated against historical data showing similar patterns during previous staffing constraints.'
)

// Impact metrics
const impactMetrics = ref({
  financial: 47.3,
  satisfaction: 12,
  efficiency: 18
})

// Additional recommendations
const additionalRecommendations = ref([
  {
    priority: 'high',
    action: 'Implement automated claim triage to reduce manual workload',
    timeline: '2-3 weeks'
  },
  {
    priority: 'medium', 
    action: 'Cross-train staff for flexible deployment across regions',
    timeline: '4-6 weeks'
  },
  {
    priority: 'low',
    action: 'Evaluate long-term capacity planning models',
    timeline: '8-10 weeks'
  }
])

// Evidence supporting the analysis
const evidenceList = ref([
  {
    type: 'Statistical',
    description: 'Processing time correlation with staffing levels: r = -0.87',
    strength: 'strong'
  },
  {
    type: 'Historical',
    description: 'Similar pattern observed in Q2 2023 with identical causes',
    strength: 'strong'
  },
  {
    type: 'Comparative',
    description: 'Other regions with adequate staffing show normal processing times',
    strength: 'moderate'
  },
  {
    type: 'Operational',
    description: 'Manager reports confirm staffing shortage impact',
    strength: 'moderate'
  }
])

// Validation tests performed
const validationTests = ref([
  { name: 'Statistical Significance Test', result: 'passed' },
  { name: 'Cross-validation Analysis', result: 'passed' },
  { name: 'Outlier Detection', result: 'passed' },
  { name: 'Temporal Consistency Check', result: 'warning' }
])

// Computed properties
const confidenceClass = computed(() => {
  const confidence = props.analysis.confidence
  if (confidence >= 0.9) return 'high'
  if (confidence >= 0.8) return 'medium'
  return 'low'
})

// Methods
const formatNumber = (num) => {
  return num.toFixed(1)
}

const implementRecommendation = () => {
  console.log('Implementing primary recommendation:', props.analysis.recommendation)
  // In real app: trigger workflow, create tasks, notify stakeholders
}

const scheduleReview = () => {
  console.log('Scheduling follow-up review')
  // In real app: create calendar event, set reminders
}

const exportAnalysis = () => {
  console.log('Exporting root cause analysis')
  // In real app: generate PDF/Excel report
}
</script>

<style scoped>
.root-cause-analysis {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.rca-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
}

.rca-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.confidence-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #f1f5f9;
  border-radius: 8px;
}

.confidence-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.confidence-value {
  font-size: 14px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
}

.confidence-value.high {
  background: #dcfce7;
  color: #166534;
}

.confidence-value.medium {
  background: #fef3c7;
  color: #92400e;
}

.confidence-value.low {
  background: #fee2e2;
  color: #991b1b;
}

.rca-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cause-section {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #3b82f6;
}

.cause-section.primary {
  border-left-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%);
}

.cause-section.contributing {
  border-left-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #fefce8 100%);
}

.cause-section.reasoning {
  border-left-color: #8b5cf6;
  background: linear-gradient(135deg, #f3f4f6 0%, #faf9ff 100%);
}

.cause-section.impact {
  border-left-color: #ec4899;
  background: linear-gradient(135deg, #fdf2f8 0%, #fef7f7 100%);
}

.cause-section.recommendations {
  border-left-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4 0%, #f7fef7 100%);
}

.cause-section.validation {
  border-left-color: #06b6d4;
  background: linear-gradient(135deg, #f0f9ff 0%, #f7fcff 100%);
}

.cause-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.cause-icon {
  font-size: 16px;
}

.cause-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.cause-description {
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
}

.factors-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.factor-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: #374151;
}

.factor-bullet {
  color: #f59e0b;
  font-weight: bold;
  margin-top: 2px;
}

.reasoning-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reasoning-method,
.reasoning-factors {
  font-size: 14px;
  color: #374151;
}

.reasoning-explanation {
  font-size: 13px;
  color: #64748b;
  font-style: italic;
  padding: 12px;
  background: rgba(139, 92, 246, 0.05);
  border-radius: 6px;
  border-left: 3px solid #8b5cf6;
}

.impact-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.impact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.impact-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.impact-value {
  font-size: 14px;
  font-weight: 700;
}

.impact-value.negative {
  color: #ef4444;
}

.recommendation-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.primary-recommendation {
  font-size: 14px;
  color: #374151;
  padding: 12px;
  background: rgba(16, 185, 129, 0.05);
  border-radius: 6px;
  border-left: 3px solid #10b981;
}

.additional-recommendations h5 {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.rec-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rec-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.rec-priority {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.rec-priority.high {
  background: #fee2e2;
  color: #991b1b;
}

.rec-priority.medium {
  background: #fef3c7;
  color: #92400e;
}

.rec-priority.low {
  background: #dbeafe;
  color: #1e40af;
}

.rec-text {
  flex: 1;
  font-size: 13px;
  color: #374151;
}

.rec-timeline {
  font-size: 12px;
  color: #64748b;
  font-style: italic;
}

.evidence-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.evidence-content h5 {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.evidence-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-size: 13px;
}

.evidence-type {
  font-weight: 600;
  color: #1e293b;
  min-width: 80px;
}

.evidence-description {
  flex: 1;
  color: #374151;
}

.evidence-strength {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.evidence-strength.strong {
  background: #dcfce7;
  color: #166534;
}

.evidence-strength.moderate {
  background: #fef3c7;
  color: #92400e;
}

.test-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.test-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-size: 13px;
}

.test-name {
  color: #374151;
}

.test-result {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.test-result.passed {
  background: #dcfce7;
  color: #166534;
}

.test-result.warning {
  background: #fef3c7;
  color: #92400e;
}

.rca-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: white;
  color: #3b82f6;
  border: 1px solid #3b82f6;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #3b82f6;
  color: white;
}

.btn-tertiary {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-tertiary:hover {
  background: #e2e8f0;
}

@media (max-width: 768px) {
  .rca-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .impact-metrics {
    grid-template-columns: 1fr;
  }
  
  .rca-actions {
    flex-direction: column;
  }
  
  .rec-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>