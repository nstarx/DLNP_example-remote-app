<template>
  <div class="kpi-card">
    <div class="kpi-header">
      <div class="kpi-icon">{{ icon }}</div>
      <div class="kpi-meta">
        <div class="kpi-title">{{ title }}</div>
        <div class="kpi-trend" :class="trend">
          <span class="trend-icon">{{ trendIcon }}</span>
          <span class="trend-value">{{ Math.abs(change) }}%</span>
        </div>
      </div>
    </div>
    
    <div class="kpi-value">
      <span class="value-main">{{ formattedValue }}</span>
      <span v-if="hasSubValue" class="value-sub">{{ subValue }}</span>
    </div>
    
    <div class="kpi-footer">
      <div class="kpi-chart">
        <div class="mini-chart">
          <div 
            v-for="(bar, index) in chartData" 
            :key="index"
            class="chart-bar"
            :style="{ height: bar + '%' }"
          ></div>
        </div>
      </div>
      <div class="kpi-period">Last 30 days</div>
    </div>
    
    <!-- AI Insight Badge -->
    <div v-if="hasAIInsight" class="ai-insight-badge" @click="showAIInsight">
      <span class="ai-icon">🤖</span>
    </div>
    
    <!-- AI Insight Modal -->
    <div v-if="showingAIInsight" class="ai-insight-modal" @click.self="hideAIInsight">
      <div class="modal-content">
        <div class="modal-header">
          <h4>🤖 AI Analysis: {{ title }}</h4>
          <button @click="hideAIInsight" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="insight-content">
            <p>{{ aiInsightText }}</p>
            <div class="confidence-score">
              <span class="confidence-label">Confidence:</span>
              <div class="confidence-bar">
                <div 
                  class="confidence-fill" 
                  :style="{ width: aiConfidence + '%' }"
                ></div>
              </div>
              <span class="confidence-value">{{ aiConfidence }}%</span>
            </div>
          </div>
          <div class="recommendation">
            <h5>💡 Recommended Actions:</h5>
            <ul>
              <li v-for="action in recommendations" :key="action">{{ action }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: String,
  value: Number,
  change: Number,
  trend: {
    type: String,
    validator: value => ['up', 'down', 'stable'].includes(value),
    default: 'stable'
  },
  format: {
    type: String,
    validator: value => ['currency', 'percentage', 'number', 'score'].includes(value),
    default: 'number'
  },
  icon: {
    type: String,
    default: '📊'
  }
})

const showingAIInsight = ref(false)

const trendIcon = computed(() => {
  switch (props.trend) {
    case 'up': return '📈'
    case 'down': return '📉'
    default: return '➡️'
  }
})

const formattedValue = computed(() => {
  switch (props.format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(props.value)
    
    case 'percentage':
      return (props.value * 100).toFixed(1) + '%'
    
    case 'score':
      return props.value.toFixed(1)
    
    default:
      return new Intl.NumberFormat('en-US').format(props.value)
  }
})

const hasSubValue = computed(() => {
  return props.format === 'currency' && props.value > 1000000
})

const subValue = computed(() => {
  if (!hasSubValue.value) return ''
  const millions = props.value / 1000000
  return `${millions.toFixed(1)}M`
})

// Generate mock chart data
const chartData = computed(() => {
  const data = []
  for (let i = 0; i < 12; i++) {
    const baseValue = 50
    const variation = Math.sin(i * 0.5) * 20 + Math.random() * 10
    const trendAdjustment = props.trend === 'up' ? i * 2 : props.trend === 'down' ? -i * 2 : 0
    data.push(Math.max(10, Math.min(90, baseValue + variation + trendAdjustment)))
  }
  return data
})

const hasAIInsight = computed(() => {
  // Show AI insights for metrics with significant changes
  return Math.abs(props.change) > 5
})

const aiInsightText = computed(() => {
  const insights = {
    'Total Premium': 'Premium growth of 12.3% indicates strong market performance. This increase correlates with improved customer retention and successful cross-selling initiatives.',
    'Claims Ratio': 'Claims ratio improvement of 2.1% suggests better risk selection and fraud detection effectiveness. Weather patterns and economic factors also contributed positively.',
    'Customer Satisfaction': 'Customer satisfaction increase is driven by faster claims processing and enhanced digital experience. AI-powered support has reduced response times by 40%.',
    'Fraud Detection Rate': 'Fraud detection improvement of 8.2% demonstrates the effectiveness of machine learning models. New pattern recognition algorithms identified 15% more suspicious cases.'
  }
  return insights[props.title] || 'AI analysis indicates positive trends in this metric based on historical patterns and current market conditions.'
})

const aiConfidence = computed(() => {
  return Math.floor(Math.random() * 15) + 85 // 85-99% confidence
})

const recommendations = computed(() => {
  const recs = {
    'Total Premium': [
      'Continue current retention strategies',
      'Expand successful product lines',
      'Target similar customer segments'
    ],
    'Claims Ratio': [
      'Maintain current underwriting standards',
      'Invest in preventive risk programs',
      'Enhance fraud detection capabilities'
    ],
    'Customer Satisfaction': [
      'Scale digital experience improvements',
      'Train staff on new service protocols',
      'Implement feedback-driven enhancements'
    ],
    'Fraud Detection Rate': [
      'Expand ML model training data',
      'Implement real-time detection systems',
      'Enhance investigation workflows'
    ]
  }
  return recs[props.title] || [
    'Monitor metric trends closely',
    'Implement data-driven improvements',
    'Review performance regularly'
  ]
})

const showAIInsight = () => {
  showingAIInsight.value = true
}

const hideAIInsight = () => {
  showingAIInsight.value = false
}
</script>

<style scoped>
.kpi-card {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  overflow: hidden;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.kpi-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.kpi-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  flex-shrink: 0;
}

.kpi-meta {
  flex: 1;
}

.kpi-title {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
}

.kpi-trend.up {
  color: #16a34a;
}

.kpi-trend.down {
  color: #dc2626;
}

.kpi-trend.stable {
  color: #64748b;
}

.kpi-value {
  margin-bottom: 20px;
}

.value-main {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.value-sub {
  font-size: 14px;
  color: #64748b;
  margin-left: 8px;
}

.kpi-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
}

.mini-chart {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 32px;
  width: 80px;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(to top, #3b82f6, #60a5fa);
  border-radius: 1px;
  min-height: 4px;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.chart-bar:hover {
  opacity: 1;
}

.kpi-period {
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ai-insight-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  animation: pulse-glow 2s infinite;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

@keyframes pulse-glow {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.5);
  }
}

.ai-insight-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 0;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  margin-bottom: 20px;
}

.modal-header h4 {
  margin: 0;
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #64748b;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #374151;
}

.modal-body {
  padding: 0 24px 24px 24px;
}

.insight-content {
  margin-bottom: 24px;
}

.insight-content p {
  color: #374151;
  line-height: 1.6;
  margin-bottom: 16px;
}

.confidence-score {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.confidence-label {
  color: #64748b;
  font-weight: 500;
  min-width: 80px;
}

.confidence-bar {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #16a34a);
  transition: width 0.3s ease;
}

.confidence-value {
  font-weight: 600;
  color: #16a34a;
  min-width: 40px;
}

.recommendation {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.recommendation h5 {
  margin: 0 0 12px 0;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
}

.recommendation ul {
  margin: 0;
  padding-left: 18px;
  color: #4b5563;
}

.recommendation li {
  margin-bottom: 6px;
  font-size: 14px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .kpi-card {
    padding: 20px;
  }
  
  .value-main {
    font-size: 28px;
  }
  
  .kpi-footer {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .mini-chart {
    width: 100%;
  }
  
  .modal-content {
    margin: 20px;
    max-height: calc(100vh - 40px);
  }
  
  .modal-header,
  .modal-body {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>