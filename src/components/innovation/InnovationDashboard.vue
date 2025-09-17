<template>
  <div class="innovation-dashboard">
    <header class="dashboard-header">
      <div class="header-left">
        <h1 class="dashboard-title">SHI Innovation Dashboard</h1>
        <p class="dashboard-subtitle">Chief Innovation Officer View</p>
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
      <!-- Key Innovation Metrics Overview -->
      <section class="overview-section">
        <div class="overview-cards">
          <div class="overview-card revenue-card">
            <h3>Innovation Revenue Impact</h3>
            <div class="card-value">{{ getOverviewMetric('Innovation Revenue (12M)', 'value') }}</div>
            <div class="card-change" :class="getOverviewMetric('Innovation Revenue (12M)', 'trend')">
              {{ getOverviewMetric('Innovation Revenue (12M)', 'change') }}%
            </div>
          </div>
          <div class="overview-card pipeline-card">
            <h3>Ideas → Pilots Conversion</h3>
            <div class="card-value">{{ getOverviewMetric('Ideas → Pilots Conversion', 'value') }}</div>
            <div class="card-change" :class="getOverviewMetric('Ideas → Pilots Conversion', 'trend')">
              {{ getOverviewMetric('Ideas → Pilots Conversion', 'change') }}%
            </div>
          </div>
          <div class="overview-card partnership-card">
            <h3>New Partnerships</h3>
            <div class="card-value">{{ getOverviewMetric('New Partnerships', 'value') }}</div>
            <div class="card-change" :class="getOverviewMetric('New Partnerships', 'trend')">
              {{ getOverviewMetric('New Partnerships', 'change') }}%
            </div>
          </div>
          <div class="overview-card roi-card">
            <h3>Innovation ROI</h3>
            <div class="card-value">{{ getOverviewMetric('Innovation ROI', 'value') }}</div>
            <div class="card-change" :class="getOverviewMetric('Innovation ROI', 'trend')">
              {{ getOverviewMetric('Innovation ROI', 'change') }}%
            </div>
          </div>
        </div>
      </section>

      <!-- Portfolio Mix and Strategic Charts -->
      <section class="charts-section">
        <div class="charts-grid">
          <PortfolioMixChart 
            v-if="portfolioMix"
            :portfolio-data="portfolioMix"
          />
          <LineChart
            v-if="chartData"
            title="Innovation Revenue Trend ($M)"
            :data="chartData.innovationRevenue"
            :labels="chartData.labels"
            color="#3b82f6"
          />
          <BarChart
            v-if="chartData"
            title="Partnership Growth"
            :data="chartData.partnershipGrowth"
            :labels="chartData.labels"
            color="#10b981"
          />
          <LineChart
            v-if="chartData"
            title="Software Attach Rate Trend"
            :data="chartData.attachRates"
            :labels="chartData.labels"
            color="#f59e0b"
          />
        </div>
      </section>

      <!-- Strategic Metrics -->
      <section v-if="strategicMetrics" class="strategic-section">
        <StrategicMetrics :strategic-data="strategicMetrics" />
      </section>

      <!-- Category Sections -->
      <div class="categories-container">
        <CategorySection
          v-for="(categoryMetrics, categoryKey) in metricsByCategory"
          :key="categoryKey"
          :title="categoryLabels[categoryKey]"
          :metrics="categoryMetrics"
        />
      </div>
    </div>

    <DocumentationModal v-model="showDocs" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, inject, computed } from 'vue'
import { useInnovationAnalytics } from '@/composables/useInnovationAnalytics'
import PeriodSelector from '@/components/dashboard/PeriodSelector.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import DocumentationButton from '@/components/common/DocumentationButton.vue'
import DocumentationModal from '@/components/common/DocumentationModal.vue'
import CategorySection from '@/components/innovation/CategorySection.vue'
import PortfolioMixChart from '@/components/innovation/PortfolioMixChart.vue'
import StrategicMetrics from '@/components/innovation/StrategicMetrics.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'

const analyticsConfig = inject('analyticsConfig', {})
const selectedPeriod = ref(analyticsConfig.defaultPeriod || '30d')
const showDocs = ref(false)

const { 
  metrics, 
  chartData, 
  portfolioMix,
  strategicMetrics,
  metricsByCategory,
  categoryLabels,
  loading, 
  error, 
  fetchInnovationAnalytics 
} = useInnovationAnalytics()

// Helper function to get overview metrics
const getOverviewMetric = (label, property) => {
  const metric = metrics.value.find(m => m.label === label)
  return metric ? metric[property] : property === 'value' ? 'N/A' : '0'
}

watch(selectedPeriod, (newPeriod) => {
  fetchInnovationAnalytics(newPeriod)
})

onMounted(() => {
  fetchInnovationAnalytics(selectedPeriod.value)
  
  if (analyticsConfig.refreshInterval) {
    setInterval(() => {
      fetchInnovationAnalytics(selectedPeriod.value)
    }, analyticsConfig.refreshInterval)
  }
})
</script>

<style scoped>
.innovation-dashboard {
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
  flex-direction: column;
  gap: 4px;
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

.dashboard-subtitle {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
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

/* Overview Cards */
.overview-section {
  width: 100%;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.overview-card {
  padding: 24px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.overview-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
}

.revenue-card::before { background: linear-gradient(90deg, #3b82f6, #1d4ed8); }
.pipeline-card::before { background: linear-gradient(90deg, #10b981, #059669); }
.partnership-card::before { background: linear-gradient(90deg, #f59e0b, #d97706); }
.roi-card::before { background: linear-gradient(90deg, #8b5cf6, #7c3aed); }

.overview-card h3 {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 8px 0;
}

.card-value {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 8px 0;
}

.card-change {
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.card-change.up {
  color: #059669;
}

.card-change.down {
  color: #dc2626;
}

/* Charts Section */
.charts-section {
  width: 100%;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.strategic-section {
  width: 100%;
}

.categories-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (max-width: 768px) {
  .innovation-dashboard {
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
  
  .overview-cards,
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-color-scheme: dark) {
  .innovation-dashboard {
    background: #111827;
  }
  
  .dashboard-title {
    color: #f9fafb;
  }
  
  .dashboard-subtitle {
    color: #9ca3af;
  }
  
  .error-message {
    background: #7f1d1d;
    color: #fecaca;
  }
  
  .overview-card {
    background: #1f2937;
  }
  
  .overview-card h3 {
    color: #9ca3af;
  }
  
  .card-value {
    color: #f9fafb;
  }
}
</style>