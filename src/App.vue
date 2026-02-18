

<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="header-left">
        <h1 class="dashboard-title">Data Science Dashboard</h1>
      </div>
      <div class="header-right">
        <PeriodSelector v-model="selectedPeriod" />
        <DocumentationButton @click="showDocs = true" />
      </div>
    </header>

    <LoadingSpinner v-if="loading" />

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else class="dashboard-content">
      <div class="dashboard-layout">
        <aside class="sidebar">
          <FilterPanel v-model="filters" />
        </aside>
        <main class="main-content">
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
              <DistributionChart
                title="Session Duration Distribution"
                :data="sessionDurationData"
              />
              <CorrelationMatrix
                title="Metric Correlation"
                :metrics="correlationMetrics"
                :correlationData="correlationData"
              />
            </div>
          </section>

          <section class="data-section">
            <DataTable
              title="Raw Analytics Data"
              :columns="tableColumns"
              :data="tableData"
            />
          </section>
        </main>
      </div>
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
import DistributionChart from '@/components/charts/DistributionChart.vue'
import CorrelationMatrix from '@/components/charts/CorrelationMatrix.vue'
import DataTable from '@/components/dashboard/DataTable.vue'
import FilterPanel from '@/components/dashboard/FilterPanel.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import DocumentationButton from '@/components/common/DocumentationButton.vue'
import DocumentationModal from '@/components/common/DocumentationModal.vue'

const analyticsConfig = inject('analyticsConfig', {})
const selectedPeriod = ref(analyticsConfig.defaultPeriod || '7d')
const showDocs = ref(false)
const { metrics, chartData, loading, error, fetchAnalytics } = useAnalytics()

const filters = ref({
  dateRange: '7d',
  metrics: ['pageViews', 'visitors'],
  trafficSources: ['direct', 'social', 'email', 'organic', 'referral']
})

// Mock data for new components
const sessionDurationData = ref(Array.from({ length: 100 }, () =>
  Math.floor(Math.random() * 3000 + 300)
))

const correlationMetrics = ref([
  'Page Views',
  'Visitors',
  'Bounce Rate',
  'Session Duration'
])

const correlationData = ref([
  [1.0, 0.85, -0.65, 0.72],
  [0.85, 1.0, -0.78, 0.81],
  [-0.65, -0.78, 1.0, -0.60],
  [0.72, 0.81, -0.60, 1.0]
])

const tableColumns = ref([
  { key: 'date', label: 'Date' },
  { key: 'pageViews', label: 'Page Views' },
  { key: 'visitors', label: 'Unique Visitors' },
  { key: 'sessionDuration', label: 'Session Duration (s)' },
  { key: 'bounceRate', label: 'Bounce Rate (%)' },
  { key: 'source', label: 'Traffic Source' }
])

const tableData = ref(generateTableData())

function generateTableData() {
  const sources = ['Direct', 'Social', 'Email', 'Organic', 'Referral']
  return Array.from({ length: 50 }, (_, i) => ({
    date: `2023-0${Math.floor(i / 10) + 1}-0${i % 10 + 1}`,
    pageViews: Math.floor(Math.random() * 5000 + 1000),
    visitors: Math.floor(Math.random() * 1000 + 500),
    sessionDuration: Math.floor(Math.random() * 300 + 60),
    bounceRate: (Math.random() * 60 + 20).toFixed(1),
    source: sources[Math.floor(Math.random() * sources.length)]
  }))
}

watch(selectedPeriod, (newPeriod) => {
  fetchAnalytics(newPeriod)
})

watch(filters, (newFilters) => {
  console.log('Filters updated:', newFilters)
  // In a real app, this would trigger data refetch with new filters
}, { deep: true })

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

.dashboard-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
  width: 100%;
}

.sidebar {
  position: sticky;
  top: 24px;
  height: fit-content;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
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

.data-section {
  width: 100%;
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

  .dashboard-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
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
}
</style>

