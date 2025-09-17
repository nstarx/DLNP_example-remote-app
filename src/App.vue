<template>
  <div class="innovation-dashboard">
    <header class="dashboard-header">
      <div class="header-left">
        <div class="brand-section">
          <div class="company-logo">SHI</div>
          <div class="title-section">
            <h1 class="dashboard-title">Chief Innovation Officer Dashboard</h1>
            <p class="dashboard-subtitle">Innovation Performance & Strategic Metrics</p>
          </div>
        </div>
      </div>
      <div class="header-right">
        <PeriodSelector v-model="selectedPeriod" />
        <button @click="refreshData" class="refresh-btn" :disabled="loading">
          <span class="refresh-icon">↻</span>
        </button>
      </div>
    </header>

    <LoadingSpinner v-if="loading" />
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else class="dashboard-content">
      <!-- Key Performance Indicators -->
      <section class="kpi-section">
        <h2 class="section-title">Key Innovation Indicators</h2>
        <div class="kpi-grid">
          <KPICard
            v-for="kpi in keyKPIs"
            :key="kpi.label"
            :kpi="kpi"
          />
        </div>
      </section>

      <!-- Innovation Pipeline & Portfolio -->
      <section class="pipeline-section">
        <h2 class="section-title">Innovation Pipeline & Portfolio</h2>
        <div class="pipeline-content">
          <div class="pipeline-metrics">
            <MetricCard
              v-for="metric in pipelineMetrics"
              :key="metric.label"
              :metric="metric"
            />
          </div>
          <div class="pipeline-charts">
            <FunnelChart
              title="Innovation Funnel Health"
              :data="innovationFunnelData"
            />
            <DonutChart
              title="Portfolio Mix"
              :data="portfolioMixData"
            />
          </div>
        </div>
      </section>

      <!-- Revenue & EBITDA Impact -->
      <section class="revenue-section">
        <h2 class="section-title">Revenue & EBITDA Impact from Innovation</h2>
        <div class="revenue-content">
          <div class="revenue-metrics">
            <MetricCard
              v-for="metric in revenueMetrics"
              :key="metric.label"
              :metric="metric"
            />
          </div>
          <div class="revenue-charts">
            <LineChart
              title="Innovation-Attributed Revenue Trend"
              :data="revenueChartData.values"
              :labels="revenueChartData.labels"
            />
            <BarChart
              title="Recurring vs One-time Revenue"
              :data="recurringRevenueData.values"
              :labels="recurringRevenueData.labels"
            />
          </div>
        </div>
      </section>

      <!-- Customer Value & Differentiation -->
      <section class="customer-section">
        <h2 class="section-title">Customer Value & Differentiation</h2>
        <div class="customer-content">
          <div class="customer-metrics">
            <MetricCard
              v-for="metric in customerMetrics"
              :key="metric.label"
              :metric="metric"
            />
          </div>
          <div class="customer-charts">
            <LineChart
              title="Attach Rate Trend"
              :data="attachRateData.values"
              :labels="attachRateData.labels"
            />
            <BarChart
              title="NPS: Innovation vs Legacy Offerings"
              :data="npsComparisonData.values"
              :labels="npsComparisonData.labels"
            />
          </div>
        </div>
      </section>

      <!-- Partner & Ecosystem -->
      <section class="partner-section">
        <h2 class="section-title">Partner & Ecosystem Leverage</h2>
        <div class="partner-grid">
          <MetricCard
            v-for="metric in partnerMetrics"
            :key="metric.label"
            :metric="metric"
          />
        </div>
      </section>

      <!-- Operational Efficiency -->
      <section class="operational-section">
        <h2 class="section-title">Operational & Execution Efficiency</h2>
        <div class="operational-content">
          <div class="operational-metrics">
            <MetricCard
              v-for="metric in operationalMetrics"
              :key="metric.label"
              :metric="metric"
            />
          </div>
          <div class="operational-chart">
            <LineChart
              title="Innovation ROI per $ Invested"
              :data="roiTrendData.values"
              :labels="roiTrendData.labels"
            />
          </div>
        </div>
      </section>

      <!-- Strategic Foresight -->
      <section class="strategic-section">
        <h2 class="section-title">Strategic Foresight & Differentiation</h2>
        <div class="strategic-grid">
          <MetricCard
            v-for="metric in strategicMetrics"
            :key="metric.label"
            :metric="metric"
          />
        </div>
      </section>

      <!-- Culture & Talent -->
      <section class="culture-section">
        <h2 class="section-title">Culture & Talent for Innovation</h2>
        <div class="culture-content">
          <div class="culture-metrics">
            <MetricCard
              v-for="metric in cultureMetrics"
              :key="metric.label"
              :metric="metric"
            />
          </div>
          <div class="culture-chart">
            <BarChart
              title="Employee Innovation Engagement"
              :data="engagementData.values"
              :labels="engagementData.labels"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, inject } from 'vue'
import { useInnovationAnalytics } from '@/composables/useInnovationAnalytics'
import PeriodSelector from '@/components/dashboard/PeriodSelector.vue'
import MetricCard from '@/components/dashboard/MetricCard.vue'
import KPICard from '@/components/dashboard/KPICard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import FunnelChart from '@/components/charts/FunnelChart.vue'
import DonutChart from '@/components/charts/DonutChart.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const analyticsConfig = inject('analyticsConfig', {})
const selectedPeriod = ref(analyticsConfig.defaultPeriod || '30d')

const { 
  keyKPIs,
  pipelineMetrics,
  revenueMetrics,
  customerMetrics,
  partnerMetrics,
  operationalMetrics,
  strategicMetrics,
  cultureMetrics,
  innovationFunnelData,
  portfolioMixData,
  revenueChartData,
  recurringRevenueData,
  attachRateData,
  npsComparisonData,
  roiTrendData,
  engagementData,
  loading,
  error,
  fetchInnovationData
} = useInnovationAnalytics()

watch(selectedPeriod, (newPeriod) => {
  fetchInnovationData(newPeriod)
})

const refreshData = () => {
  fetchInnovationData(selectedPeriod.value)
}

onMounted(() => {
  fetchInnovationData(selectedPeriod.value)
  
  // Auto-refresh every 5 minutes for real-time dashboard
  if (analyticsConfig.refreshInterval) {
    setInterval(() => {
      fetchInnovationData(selectedPeriod.value)
    }, analyticsConfig.refreshInterval || 300000)
  }
})
</script>

<style scoped>
.innovation-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 24px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.company-logo {
  font-size: 36px;
  font-weight: 900;
  color: #1e40af;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding: 12px 20px;
  border: 3px solid #1e40af;
  border-radius: 12px;
}

.title-section h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.2;
}

.dashboard-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 4px 0 0 0;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.refresh-btn {
  background: #f1f5f9;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 18px;
}

.refresh-btn:hover:not(:disabled) {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 24px 0;
  padding-bottom: 12px;
  border-bottom: 3px solid #e2e8f0;
}

/* KPI Section */
.kpi-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

/* Pipeline Section */
.pipeline-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.pipeline-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.pipeline-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.pipeline-charts {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

/* Revenue Section */
.revenue-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.revenue-content {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 32px;
}

.revenue-metrics {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.revenue-charts {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

/* Customer Section */
.customer-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.customer-content {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 32px;
}

.customer-metrics {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.customer-charts {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

/* Partner Section */
.partner-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.partner-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

/* Operational Section */
.operational-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.operational-content {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 32px;
}

.operational-metrics {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* Strategic Section */
.strategic-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.strategic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

/* Culture Section */
.culture-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.culture-content {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 32px;
}

.culture-metrics {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.error-message {
  background: #fef2f2;
  color: #dc2626;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #fecaca;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .pipeline-content,
  .revenue-content,
  .customer-content,
  .operational-content,
  .culture-content {
    grid-template-columns: 1fr;
  }
  
  .pipeline-metrics {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .innovation-dashboard {
    padding: 16px;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
    padding: 20px;
  }
  
  .brand-section {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .title-section h1 {
    font-size: 24px;
  }
  
  .company-logo {
    font-size: 28px;
    align-self: center;
  }
  
  .header-right {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .pipeline-section,
  .revenue-section,
  .customer-section,
  .partner-section,
  .operational-section,
  .strategic-section,
  .culture-section,
  .kpi-section {
    padding: 20px;
  }
  
  .kpi-grid,
  .partner-grid,
  .strategic-grid {
    grid-template-columns: 1fr;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .innovation-dashboard {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  }
  
  .dashboard-header,
  .kpi-section,
  .pipeline-section,
  .revenue-section,
  .customer-section,
  .partner-section,
  .operational-section,
  .strategic-section,
  .culture-section {
    background: #1e293b;
  }
  
  .section-title,
  .title-section h1 {
    color: #f1f5f9;
  }
  
  .dashboard-subtitle {
    color: #94a3b8;
  }
  
  .refresh-btn {
    background: #334155;
    border-color: #475569;
    color: #f1f5f9;
  }
  
  .refresh-btn:hover:not(:disabled) {
    background: #475569;
    border-color: #64748b;
  }
  
  .error-message {
    background: #7f1d1d;
    color: #fecaca;
    border-color: #991b1b;
  }
}
</style>