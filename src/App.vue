<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="header-left">
        <h1 class="dashboard-title">Analytics Dashboard</h1>
      </div>
      <div class="header-right">
        <div class="magic-buttons">
          <button 
            @click="performMagic('sparkle')" 
            class="magic-button sparkle"
            :class="{ active: activeMagic === 'sparkle' }"
          >
            ✨ Sparkle
          </button>
          <button 
            @click="performMagic('rainbow')" 
            class="magic-button rainbow"
            :class="{ active: activeMagic === 'rainbow' }"
          >
            🌈 Rainbow
          </button>
          <button 
            @click="performMagic('lightning')" 
            class="magic-button lightning"
            :class="{ active: activeMagic === 'lightning' }"
          >
            ⚡ Lightning
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
const activeMagic = ref(null)
const { metrics, chartData, loading, error, fetchAnalytics } = useAnalytics()

const performMagic = (type) => {
  activeMagic.value = type
  
  // Clear previous magic effect
  document.body.className = document.body.className.replace(/magic-\w+/g, '')
  
  // Apply new magic effect
  document.body.classList.add(`magic-${type}`)
  
  // Show visual feedback
  const messages = {
    sparkle: '✨ Sparkle magic activated! ✨',
    rainbow: '🌈 Rainbow magic activated! 🌈',
    lightning: '⚡ Lightning magic activated! ⚡'
  }
  
  console.log(messages[type])
  
  // Auto-clear after 3 seconds
  setTimeout(() => {
    activeMagic.value = null
    document.body.classList.remove(`magic-${type}`)
  }, 3000)
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
  padding: 8px 16px;
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
  color: #374151;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.magic-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.magic-button.sparkle {
  border-color: #fbbf24;
}

.magic-button.sparkle:hover,
.magic-button.sparkle.active {
  background: #fbbf24;
  color: #fff;
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
}

.magic-button.rainbow {
  border-color: #ec4899;
}

.magic-button.rainbow:hover,
.magic-button.rainbow.active {
  background: linear-gradient(45deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6, #ec4899);
  color: #fff;
  box-shadow: 0 0 20px rgba(236, 72, 153, 0.5);
}

.magic-button.lightning {
  border-color: #3b82f6;
}

.magic-button.lightning:hover,
.magic-button.lightning.active {
  background: #3b82f6;
  color: #fff;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
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
    order: -1;
    width: 100%;
    justify-content: center;
    margin-bottom: 8px;
  }
  
  .magic-button {
    flex: 1;
    max-width: 100px;
    font-size: 12px;
    padding: 6px 12px;
  }
  
  .dashboard-title {
    font-size: 24px;
  }
  
  .metrics-grid,
  .charts-grid {
    grid-template-columns: 1fr;
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
  
  .magic-button {
    background: #374151;
    color: #f9fafb;
  }
}

/* Global magic effects */
:global(body.magic-sparkle) {
  animation: sparkle-animation 3s ease-in-out;
  background: radial-gradient(circle, #fbbf24 0%, #f9fafb 100%);
}

:global(body.magic-rainbow) {
  animation: rainbow-animation 3s ease-in-out;
  background: linear-gradient(45deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6, #ec4899);
  background-size: 300% 300%;
}

:global(body.magic-lightning) {
  animation: lightning-animation 3s ease-in-out;
  background: radial-gradient(circle, #3b82f6 0%, #f9fafb 100%);
}

@keyframes sparkle-animation {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes rainbow-animation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes lightning-animation {
  0%, 100% { opacity: 1; }
  10% { opacity: 0.3; }
  20% { opacity: 1; }
  30% { opacity: 0.5; }
  40% { opacity: 1; }
}
</style>