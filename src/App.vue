<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="header-left">
        <h1 class="dashboard-title">IT Operations Dashboard</h1>
        <nav class="dashboard-nav">
          <button 
            class="nav-button" 
            :class="{ active: currentView === 'analytics' }"
            @click="currentView = 'analytics'"
          >
            Analytics
          </button>
          <button 
            class="nav-button" 
            :class="{ active: currentView === 'heatmap' }"
            @click="currentView = 'heatmap'"
          >
            Experience Heatmap
          </button>
        </nav>
      </div>
      <div class="header-right">
        <PeriodSelector v-if="currentView === 'analytics'" v-model="selectedPeriod" />
        <DocumentationButton @click="showDocs = true" />
      </div>
    </header>

    <!-- Analytics View -->
    <div v-if="currentView === 'analytics'">
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
    </div>

    <!-- Experience Heatmap View -->
    <ExperienceHeatmap v-else-if="currentView === 'heatmap'" />

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
import ExperienceHeatmap from '@/components/ExperienceHeatmap.vue'

const analyticsConfig = inject('analyticsConfig', {})
const selectedPeriod = ref(analyticsConfig.defaultPeriod || '7d')
const showDocs = ref(false)
const currentView = ref('heatmap') // Start with heatmap view as default
const { metrics, chartData, loading, error, fetchAnalytics } = useAnalytics()

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

.dashboard-title {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px 0;
}

.dashboard-nav {
  display: flex;
  gap: 8px;
}

.nav-button {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-button:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.nav-button.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
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
  
  .nav-button {
    background: #374151;
    border-color: #4b5563;
    color: #d1d5db;
  }
  
  .nav-button:hover {
    background: #4b5563;
    border-color: #6b7280;
  }
  
  .nav-button.active {
    background: #60a5fa;
    border-color: #60a5fa;
    color: #111827;
  }
  
  .error-message {
    background: #7f1d1d;
    color: #fecaca;
  }
}
</style>