<template>
  <div class="smart-forecast-widget" :class="[`type-${type}`, { 'has-alert': hasAlert }]">
    <div class="widget-header">
      <div class="header-content">
        <div class="forecast-icon" :class="type">
          <TrendingUpIcon v-if="type === 'volume'" />
          <ClockIcon v-else-if="type === 'delay'" />
          <UsersIcon v-else-if="type === 'resource'" />
          <BarChartIcon v-else />
        </div>
        <div class="forecast-meta">
          <h3 class="forecast-title">{{ title }}</h3>
          <span class="forecast-timeframe">{{ forecast.timeframe }} forecast</span>
        </div>
      </div>
      
      <div class="header-actions">
        <div class="confidence-indicator">
          <span class="confidence-label">Confidence</span>
          <div class="confidence-bar">
            <div 
              class="confidence-fill" 
              :style="{ width: `${forecast.confidence * 100}%` }"
              :class="getConfidenceClass(forecast.confidence)"
            ></div>
          </div>
          <span class="confidence-value">{{ Math.round(forecast.confidence * 100) }}%</span>
        </div>
        
        <button @click="showDetails = !showDetails" class="details-toggle" :class="{ active: showDetails }">
          <ChevronDownIcon />
        </button>
      </div>
    </div>
    
    <div class="forecast-content">
      <!-- Current vs Forecast Values -->
      <div class="forecast-comparison">
        <div class="current-value">
          <span class="value-label">Current</span>
          <span class="value-number">{{ formatValue(forecast.currentValue) }}</span>
        </div>
        
        <div class="forecast-arrow" :class="forecast.trend">
          <TrendingUpIcon v-if="forecast.change > 0" />
          <TrendingDownIcon v-else-if="forecast.change < 0" />
          <MinusIcon v-else />
        </div>
        
        <div class="forecast-value">
          <span class="value-label">Forecast</span>
          <span class="value-number">{{ formatValue(forecast.forecastValue) }}</span>
          <span class="change-indicator" :class="forecast.trend">
            {{ forecast.change >= 0 ? '+' : '' }}{{ forecast.change.toFixed(1) }}%
          </span>
        </div>
      </div>
      
      <!-- Mini Forecast Chart -->
      <div class="forecast-chart">
        <svg class="chart-svg" viewBox="0 0 300 80">
          <!-- Background -->
          <rect width="300" height="80" fill="#f8fafc" rx="4" />
          
          <!-- Grid lines -->
          <g class="grid-lines">
            <line v-for="i in 4" :key="`h-${i}`" 
              :x1="0" :x2="300" 
              :y1="i * 20" :y2="i * 20" 
              stroke="#e2e8f0" stroke-width="0.5" />
          </g>
          
          <!-- Actual data line (past) -->
          <polyline
            :points="generateActualDataPoints()"
            fill="none"
            stroke="#64748b"
            stroke-width="2"
            stroke-dasharray="none"
          />
          
          <!-- Forecast data line (future) -->
          <polyline
            :points="generateForecastPoints()"
            fill="none"
            :stroke="getForecastColor()"
            stroke-width="2"
            stroke-dasharray="5,3"
          />
          
          <!-- Confidence band -->
          <path
            :d="generateConfidenceBand()"
            :fill="getForecastColor()"
            fill-opacity="0.1"
          />
          
          <!-- Data points -->
          <g class="data-points">
            <circle
              v-for="(point, index) in allDataPoints"
              :key="index"
              :cx="(index / (allDataPoints.length - 1)) * 280 + 10"
              :cy="getYPosition(point.value)"
              :r="point.type === 'actual' ? 2 : 3"
              :fill="point.type === 'actual' ? '#64748b' : getForecastColor()"
              :stroke="point.type === 'actual' ? '#64748b' : getForecastColor()"
              stroke-width="1"
            />
          </g>
          
          <!-- Current position indicator -->
          <line
            :x1="currentPositionX"
            :x2="currentPositionX"
            y1="5"
            y2="75"
            stroke="#ef4444"
            stroke-width="1"
            stroke-dasharray="2,2"
          />
          <text
            :x="currentPositionX"
            y="15"
            text-anchor="middle"
            class="current-label"
            fill="#ef4444"
            font-size="10"
          >
            Now
          </text>
        </svg>
      </div>
      
      <!-- Key Factors -->
      <div class="forecast-factors" v-if="forecast.factors && forecast.factors.length > 0">
        <h4>Key Influencing Factors</h4>
        <div class="factors-list">
          <div
            v-for="factor in forecast.factors"
            :key="factor"
            class="factor-item"
          >
            <div class="factor-icon">
              <CircleIcon />
            </div>
            <span class="factor-text">{{ factor }}</span>
          </div>
        </div>
      </div>
      
      <!-- Expanded Details -->
      <div v-if="showDetails" class="expanded-details">
        <div class="details-grid">
          <!-- Scenario Analysis -->
          <div class="detail-section">
            <h5>Scenario Analysis</h5>
            <div class="scenarios">
              <div class="scenario-item best">
                <span class="scenario-label">Best Case</span>
                <span class="scenario-value">
                  {{ formatValue(forecast.forecastValue * 1.15) }}
                </span>
                <span class="scenario-probability">20% chance</span>
              </div>
              <div class="scenario-item likely">
                <span class="scenario-label">Most Likely</span>
                <span class="scenario-value">
                  {{ formatValue(forecast.forecastValue) }}
                </span>
                <span class="scenario-probability">60% chance</span>
              </div>
              <div class="scenario-item worst">
                <span class="scenario-label">Worst Case</span>
                <span class="scenario-value">
                  {{ formatValue(forecast.forecastValue * 0.85) }}
                </span>
                <span class="scenario-probability">20% chance</span>
              </div>
            </div>
          </div>
          
          <!-- Historical Accuracy -->
          <div class="detail-section">
            <h5>Historical Accuracy</h5>
            <div class="accuracy-metrics">
              <div class="accuracy-item">
                <span class="accuracy-label">Last 30 days</span>
                <div class="accuracy-bar">
                  <div class="accuracy-fill" style="width: 87%"></div>
                </div>
                <span class="accuracy-value">87%</span>
              </div>
              <div class="accuracy-item">
                <span class="accuracy-label">Last 90 days</span>
                <div class="accuracy-bar">
                  <div class="accuracy-fill" style="width: 91%"></div>
                </div>
                <span class="accuracy-value">91%</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Recommendations -->
        <div class="forecast-recommendations">
          <h5>AI Recommendations</h5>
          <div class="recommendation-text">
            {{ forecast.recommendation }}
          </div>
          
          <div class="action-buttons">
            <button @click="acceptRecommendation" class="action-btn primary">
              Accept Recommendation
            </button>
            <button @click="scheduleReview" class="action-btn secondary">
              Schedule Review
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="widget-footer">
      <div class="last-updated">
        <span class="update-label">Updated:</span>
        <span class="update-time">{{ formatTimeAgo(lastUpdated) }}</span>
      </div>
      
      <div class="forecast-actions">
        <button @click="exportForecast" class="action-btn tertiary small">
          Export
        </button>
        <button @click="refreshForecast" class="action-btn tertiary small" :disabled="refreshing">
          {{ refreshing ? 'Updating...' : 'Refresh' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TrendingUpIcon from '@/components/icons/TrendingUpIcon.vue'
import TrendingDownIcon from '@/components/icons/TrendingDownIcon.vue'
import ClockIcon from '@/components/icons/ClockIcon.vue'
import UsersIcon from '@/components/icons/UsersIcon.vue'
import BarChartIcon from '@/components/icons/BarChartIcon.vue'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'
import MinusIcon from '@/components/icons/MinusIcon.vue'
import CircleIcon from '@/components/icons/CircleIcon.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  forecast: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: value => ['volume', 'delay', 'resource'].includes(value)
  }
})

const emit = defineEmits(['refresh', 'accept-recommendation', 'schedule-review'])

// State
const showDetails = ref(false)
const refreshing = ref(false)
const lastUpdated = ref(new Date())

// Computed
const hasAlert = computed(() => {
  if (props.type === 'delay' && props.forecast.change > 10) return true
  if (props.type === 'volume' && props.forecast.change > 15) return true
  if (props.type === 'resource' && props.forecast.change > 20) return true
  return false
})

const allDataPoints = computed(() => {
  if (!props.forecast.data) return []
  
  return props.forecast.data.map(point => ({
    ...point,
    date: new Date(point.date)
  }))
})

const currentPositionX = computed(() => {
  if (!allDataPoints.value.length) return 150
  
  const actualData = allDataPoints.value.filter(p => p.type === 'actual')
  if (actualData.length === 0) return 10
  
  return (actualData.length / allDataPoints.value.length) * 280 + 10
})

// Methods
const formatValue = (value) => {
  if (!value && value !== 0) return 'N/A'
  
  switch (props.type) {
    case 'volume':
      return value.toLocaleString()
    case 'delay':
      return `${value.toFixed(1)}h`
    case 'resource':
      return `${value} staff`
    default:
      return value.toString()
  }
}

const getConfidenceClass = (confidence) => {
  if (confidence >= 0.8) return 'high-confidence'
  if (confidence >= 0.6) return 'medium-confidence'
  return 'low-confidence'
}

const getForecastColor = () => {
  switch (props.type) {
    case 'volume':
      return '#3b82f6'
    case 'delay':
      return '#f59e0b'
    case 'resource':
      return '#10b981'
    default:
      return '#64748b'
  }
}

const getYPosition = (value) => {
  if (!allDataPoints.value.length) return 40
  
  const allValues = allDataPoints.value.map(p => p.value)
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)
  const range = maxValue - minValue || 1
  
  return 70 - ((value - minValue) / range) * 60
}

const generateActualDataPoints = () => {
  if (!allDataPoints.value.length) return ''
  
  const actualData = allDataPoints.value.filter(p => p.type === 'actual')
  if (actualData.length === 0) return ''
  
  return actualData
    .map((point, index) => {
      const x = (index / (allDataPoints.value.length - 1)) * 280 + 10
      const y = getYPosition(point.value)
      return `${x},${y}`
    })
    .join(' ')
}

const generateForecastPoints = () => {
  if (!allDataPoints.value.length) return ''
  
  const actualData = allDataPoints.value.filter(p => p.type === 'actual')
  const forecastData = allDataPoints.value.filter(p => p.type === 'forecast')
  
  if (actualData.length === 0 || forecastData.length === 0) return ''
  
  // Start from the last actual point
  const startIndex = actualData.length - 1
  const points = []
  
  // Add the last actual point as starting point
  const startX = (startIndex / (allDataPoints.value.length - 1)) * 280 + 10
  const startY = getYPosition(actualData[actualData.length - 1].value)
  points.push(`${startX},${startY}`)
  
  // Add forecast points
  forecastData.forEach((point, index) => {
    const x = ((startIndex + 1 + index) / (allDataPoints.value.length - 1)) * 280 + 10
    const y = getYPosition(point.value)
    points.push(`${x},${y}`)
  })
  
  return points.join(' ')
}

const generateConfidenceBand = () => {
  // Generate confidence band path (simplified)
  const forecastData = allDataPoints.value.filter(p => p.type === 'forecast')
  if (forecastData.length === 0) return ''
  
  const actualData = allDataPoints.value.filter(p => p.type === 'actual')
  const startIndex = actualData.length - 1
  
  const upperPoints = []
  const lowerPoints = []
  
  forecastData.forEach((point, index) => {
    const x = ((startIndex + 1 + index) / (allDataPoints.value.length - 1)) * 280 + 10
    const baseY = getYPosition(point.value)
    const confidence = point.confidence || props.forecast.confidence
    const uncertainty = (1 - confidence) * 20 // Max ±20px uncertainty
    
    upperPoints.push(`${x},${baseY - uncertainty}`)
    lowerPoints.unshift(`${x},${baseY + uncertainty}`)
  })
  
  return `M ${upperPoints.join(' L ')} L ${lowerPoints.join(' L ')} Z`
}

const formatTimeAgo = (date) => {
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / 60000)
  
  if (diffInMinutes < 1) return 'just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  return date.toLocaleDateString()
}

const refreshForecast = async () => {
  refreshing.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
    lastUpdated.value = new Date()
    emit('refresh')
  } finally {
    refreshing.value = false
  }
}

const acceptRecommendation = () => {
  emit('accept-recommendation', props.forecast)
}

const scheduleReview = () => {
  emit('schedule-review', props.forecast)
}

const exportForecast = () => {
  const data = {
    title: props.title,
    type: props.type,
    forecast: props.forecast,
    exported: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `forecast-${props.type}-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.smart-forecast-widget {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.smart-forecast-widget:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-color: #cbd5e1;
}

.smart-forecast-widget.has-alert {
  border-left: 4px solid #f59e0b;
  background: linear-gradient(135deg, #fefbf3 0%, white 100%);
}

.smart-forecast-widget.type-volume {
  border-top: 3px solid #3b82f6;
}

.smart-forecast-widget.type-delay {
  border-top: 3px solid #f59e0b;
}

.smart-forecast-widget.type-resource {
  border-top: 3px solid #10b981;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.header-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.forecast-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.forecast-icon.volume {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.forecast-icon.delay {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.forecast-icon.resource {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.forecast-meta {
  flex: 1;
}

.forecast-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.forecast-timeframe {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.confidence-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}

.confidence-label {
  color: #64748b;
  font-weight: 500;
}

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

.confidence-value {
  font-weight: 600;
  color: #1e293b;
}

.details-toggle {
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 4px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.details-toggle:hover {
  background: #f1f5f9;
  color: #374151;
}

.details-toggle.active {
  transform: rotate(180deg);
  color: #3b82f6;
}

.forecast-content {
  padding: 20px;
}

.forecast-comparison {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.current-value,
.forecast-value {
  text-align: center;
}

.value-label {
  display: block;
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.value-number {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 4px;
}

.change-indicator {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 12px;
}

.change-indicator.increasing {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.change-indicator.decreasing {
  background: rgba(16, 185, 129, 0.1);
  color: #16a34a;
}

.forecast-arrow {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.forecast-arrow.increasing {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.forecast-arrow.decreasing {
  background: rgba(16, 185, 129, 0.1);
  color: #16a34a;
}

.forecast-chart {
  margin-bottom: 20px;
}

.chart-svg {
  width: 100%;
  height: 80px;
}

.current-label {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 500;
}

.forecast-factors {
  margin-bottom: 20px;
}

.forecast-factors h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.factors-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.factor-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
}

.factor-icon {
  width: 6px;
  height: 6px;
  color: #94a3b8;
  flex-shrink: 0;
}

.expanded-details {
  border-top: 1px solid #e2e8f0;
  padding-top: 20px;
  margin-top: 20px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.detail-section h5 {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.scenarios {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.scenario-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
}

.scenario-item.best {
  background: rgba(16, 185, 129, 0.05);
  border-left: 3px solid #10b981;
}

.scenario-item.likely {
  background: rgba(59, 130, 246, 0.05);
  border-left: 3px solid #3b82f6;
}

.scenario-item.worst {
  background: rgba(239, 68, 68, 0.05);
  border-left: 3px solid #ef4444;
}

.scenario-label {
  font-weight: 500;
  color: #374151;
}

.scenario-value {
  font-weight: 600;
  color: #1e293b;
}

.scenario-probability {
  color: #64748b;
  font-size: 11px;
}

.accuracy-metrics {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.accuracy-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.accuracy-label {
  min-width: 80px;
  color: #64748b;
  font-weight: 500;
}

.accuracy-bar {
  flex: 1;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.accuracy-fill {
  height: 100%;
  background: #10b981;
  border-radius: 2px;
}

.accuracy-value {
  min-width: 30px;
  text-align: right;
  font-weight: 600;
  color: #1e293b;
}

.forecast-recommendations {
  padding: 16px;
  background: #f0fdf4;
  border-radius: 8px;
  border-left: 4px solid #10b981;
}

.forecast-recommendations h5 {
  margin-bottom: 8px;
}

.recommendation-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
  margin-bottom: 16px;
}

.action-buttons {
  display: flex;
  gap: 8px;
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

.last-updated {
  display: flex;
  align-items: center;
  gap: 4px;
}

.update-label {
  color: #94a3b8;
  font-weight: 500;
}

.update-time {
  color: #64748b;
}

.forecast-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  border: none;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
  padding: 8px 16px;
}

.action-btn.primary:hover {
  background: #2563eb;
}

.action-btn.secondary {
  background: #f1f5f9;
  color: #64748b;
  padding: 8px 16px;
}

.action-btn.secondary:hover {
  background: #e2e8f0;
  color: #374151;
}

.action-btn.tertiary {
  background: none;
  color: #64748b;
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
}

.action-btn.tertiary:hover:not(:disabled) {
  background: #f8fafc;
  color: #374151;
}

.action-btn.tertiary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.small {
  padding: 4px 8px;
  font-size: 10px;
}

/* Responsive */
@media (max-width: 768px) {
  .smart-forecast-widget {
    margin: 0 -4px;
  }
  
  .widget-header,
  .forecast-content,
  .widget-footer {
    padding: 16px;
  }
  
  .forecast-comparison {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .forecast-arrow {
    transform: rotate(90deg);
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>