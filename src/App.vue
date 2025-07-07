<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="header-left">
        <h1 class="dashboard-title">Analytics Dashboard</h1>
      </div>
      <div class="header-right">
        <div class="magic-buttons">
          <button 
            class="magic-button model-1" 
            @click="handleModelClick('model1')"
            title="GPT-4 Model"
          >
            <span class="button-icon">🤖</span>
            <span class="button-text">GPT-4</span>
          </button>
          <button 
            class="magic-button model-2" 
            @click="handleModelClick('model2')"
            title="Claude Model"
          >
            <span class="button-icon">🧠</span>
            <span class="button-text">Claude</span>
          </button>
          <button 
            class="magic-button model-3" 
            @click="handleModelClick('model3')"
            title="Gemini Model"
          >
            <span class="button-icon">💎</span>
            <span class="button-text">Gemini</span>
          </button>
          <button 
            class="magic-button model-4" 
            @click="handleSujayClick"
            title="Special Model 7044"
          >
            <span class="button-icon">✨</span>
            <span class="button-text">7044</span>
          </button>
        </div>
        <PeriodSelector v-model="selectedPeriod" />
        <DocumentationButton @click="showDocs = true" />
      </div>
    </header>

    <LoadingSpinner v-if="loading" />
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else class="dashboard-content">
      <!-- Model Data Display -->
      <section v-if="selectedModel" class="model-data-section">
        <div class="model-data-container">
          <div class="model-header">
            <h2>{{ selectedModel.name }} Model Data</h2>
            <button class="close-btn" @click="selectedModel = null">×</button>
          </div>
          <div class="model-metrics">
            <div class="model-metric" v-for="metric in selectedModel.metrics" :key="metric.label">
              <span class="metric-label">{{ metric.label }}</span>
              <span class="metric-value">{{ metric.value }}</span>
            </div>
          </div>
          <div class="model-chart">
            <canvas ref="modelChart" width="400" height="200"></canvas>
          </div>
        </div>
      </section>

      <section class="metrics-section">
        <div class="metrics-grid">
          <MetricCard
            v-for="metric in metrics"
            :key="metric.label"
            :metric="metric"
          />
        </div>
      </section>

      <section v-if="chartData" class="charts-section">
        <div class="charts-grid">
          <LineChart
            title="Page Views Trend"
            :data="chartData.pageViews"
            :labels="chartData.labels"
          />
          <BarChart
            title="Traffic Sources"
            :data="barChartData.values"
            :labels="barChartData.labels"
          />
        </div>
      </section>
    </div>

    <!-- Notification -->
    <div v-if="notification" class="notification" :class="notification.type">
      {{ notification.message }}
    </div>

    <DocumentationModal v-model="showDocs" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, inject } from 'vue'
import { useAnalytics } from '@/composables/useAnalytics'
import { barChartData } from '@/data/mockData'
import PeriodSelector from '@/components/dashboard/PeriodSelector.vue'
import MetricCard from '@/components/dashboard/MetricCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import DocumentationButton from '@/components/common/DocumentationButton.vue'
import DocumentationModal from '@/components/common/DocumentationModal.vue'

const analyticsConfig = inject('analyticsConfig', {})
const selectedPeriod = ref(analyticsConfig.defaultPeriod || '7d')
const showDocs = ref(false)
const selectedModel = ref(null)
const notification = ref(null)
const modelChart = ref(null)
const { metrics, chartData, loading, error, fetchAnalytics } = useAnalytics()

// Mock data for models
const mockModelData = {
  model1: {
    name: 'GPT-4',
    metrics: [
      { label: 'Accuracy', value: '94.2%' },
      { label: 'Tokens/sec', value: '1,250' },
      { label: 'Response Time', value: '2.3s' },
      { label: 'Cost per 1K', value: '$0.03' }
    ],
    chartData: [85, 92, 78, 94, 88, 96, 91]
  },
  model2: {
    name: 'Claude',
    metrics: [
      { label: 'Accuracy', value: '96.1%' },
      { label: 'Tokens/sec', value: '1,180' },
      { label: 'Response Time', value: '1.8s' },
      { label: 'Cost per 1K', value: '$0.025' }
    ],
    chartData: [88, 94, 82, 96, 92, 98, 95]
  },
  model3: {
    name: 'Gemini',
    metrics: [
      { label: 'Accuracy', value: '92.8%' },
      { label: 'Tokens/sec', value: '1,350' },
      { label: 'Response Time', value: '2.1s' },
      { label: 'Cost per 1K', value: '$0.02' }
    ],
    chartData: [82, 89, 76, 92, 85, 94, 88]
  }
}

// Handle model button clicks
const handleModelClick = (modelId) => {
  selectedModel.value = mockModelData[modelId]
  showNotification(`Loading ${mockModelData[modelId].name} model data...`, 'info')
  
  // Draw chart after a small delay to ensure DOM is updated
  setTimeout(() => {
    drawModelChart(mockModelData[modelId].chartData)
  }, 100)
}

// Handle special 7044 button click
const handleSujayClick = () => {
  showNotification('Hello Sujay', 'success')
}

// Show notification
const showNotification = (message, type = 'info') => {
  notification.value = { message, type }
  setTimeout(() => {
    notification.value = null
  }, 3000)
}

// Draw simple chart on canvas
const drawModelChart = (data) => {
  if (!modelChart.value) return
  
  const ctx = modelChart.value.getContext('2d')
  const width = modelChart.value.width
  const height = modelChart.value.height
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height)
  
  // Chart settings
  const padding = 40
  const chartWidth = width - 2 * padding
  const chartHeight = height - 2 * padding
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue
  
  // Draw grid lines
  ctx.strokeStyle = '#e5e7eb'
  ctx.lineWidth = 1
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * chartHeight / 5)
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(width - padding, y)
    ctx.stroke()
  }
  
  // Draw line chart
  ctx.strokeStyle = '#3b82f6'
  ctx.lineWidth = 3
  ctx.beginPath()
  
  data.forEach((value, index) => {
    const x = padding + (index * chartWidth / (data.length - 1))
    const y = padding + ((maxValue - value) / range) * chartHeight
    
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  
  ctx.stroke()
  
  // Draw data points
  ctx.fillStyle = '#3b82f6'
  data.forEach((value, index) => {
    const x = padding + (index * chartWidth / (data.length - 1))
    const y = padding + ((maxValue - value) / range) * chartHeight
    
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, 2 * Math.PI)
    ctx.fill()
  })
}

watch(selectedPeriod, (newPeriod) => {
  fetchAnalytics(newPeriod)
})

onMounted(() => {
  fetchAnalytics(selectedPeriod.value)
  
  if (analyticsConfig.refreshInterval) {
    setInterval(() => {
      fetchAnalytics(selectedPeriod.value)
    }, analyticsConfig.refreshInterval)
  }
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f9fafb;
  padding: 24px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 24px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.magic-buttons {
  display: flex;
  gap: 8px;
}

.magic-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 2px solid transparent;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;
}

.magic-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.magic-button:hover::before {
  left: 100%;
}

.magic-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.magic-button:active {
  transform: translateY(0);
}

.magic-button.model-1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.magic-button.model-2 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
}

.magic-button.model-2:hover {
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.6);
}

.magic-button.model-3 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
}

.magic-button.model-3:hover {
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.6);
}

.magic-button.model-4 {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  box-shadow: 0 4px 15px rgba(250, 112, 154, 0.4);
  animation: pulse 2s infinite;
}

.magic-button.model-4:hover {
  box-shadow: 0 6px 20px rgba(250, 112, 154, 0.6);
}

@keyframes pulse {
  0% { box-shadow: 0 4px 15px rgba(250, 112, 154, 0.4); }
  50% { box-shadow: 0 6px 25px rgba(250, 112, 154, 0.7); }
  100% { box-shadow: 0 4px 15px rgba(250, 112, 154, 0.4); }
}

.button-icon {
  font-size: 16px;
}

.button-text {
  font-size: 13px;
  font-weight: 700;
}

.dashboard-title {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.error-message {
  background: #fee;
  color: #c00;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
}

.metrics-section {
  width: 100%;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.charts-section {
  width: 100%;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .header-left,
  .header-right {
    width: 100%;
  }
  
  .header-right {
    flex-wrap: wrap;
  }
  
  .magic-buttons {
    order: 1;
    width: 100%;
    justify-content: center;
  }
  
  .magic-button {
    flex: 1;
    min-width: 0;
    justify-content: center;
  }
  
  .dashboard-title {
    font-size: 24px;
  }
  
  .metrics-grid,
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .model-metrics {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
}

/* Model Data Styles */
.model-data-section {
  margin-bottom: 32px;
}

.model-data-container {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
}

.model-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.model-header h2 {
  color: #111827;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.close-btn {
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  color: #6b7280;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.model-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.model-metric {
  background: #f9fafb;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid #e5e7eb;
}

.metric-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.metric-value {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.model-chart {
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #e5e7eb;
}

/* Notification Styles */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 600;
  z-index: 1000;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease;
}

.notification.info {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #3b82f6;
}

.notification.success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #10b981;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (prefers-color-scheme: dark) {
  .dashboard {
    background: #111827;
  }
  
  .dashboard-title {
    color: #f9fafb;
  }
  
  .error-message {
    background: #7f1d1d;
    color: #fecaca;
  }
  
  .model-data-container {
    background: #1f2937;
    border-color: #374151;
  }
  
  .model-header h2 {
    color: #f9fafb;
  }
  
  .close-btn {
    background: #374151;
    color: #9ca3af;
  }
  
  .close-btn:hover {
    background: #4b5563;
    color: #f3f4f6;
  }
  
  .model-metric {
    background: #111827;
    border-color: #374151;
  }
  
  .metric-label {
    color: #9ca3af;
  }
  
  .metric-value {
    color: #f9fafb;
  }
  
  .model-chart {
    background: #111827;
    border-color: #374151;
  }
}
</style>