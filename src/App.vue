<template>
  <div class="innovation-dashboard">
    <header class="dashboard-header">
      <div class="header-left">
        <h1 class="dashboard-title">
          <span class="company-logo">SHI</span>
          Innovation Dashboard
        </h1>
        <p class="dashboard-subtitle">Track innovation metrics across the organization</p>
      </div>
      <div class="header-right">
        <PeriodSelector v-model="selectedPeriod" />
        <DocumentationButton @click="showDocs = true" />
      </div>
    </header>

    <CategorySelector
      v-model="selectedCategory"
      :categories="categories"
      :selected-category="selectedCategory"
    />

    <LoadingSpinner v-if="loading" />
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else class="dashboard-content">
      <!-- Executive Summary or Category View -->
      <section class="metrics-section">
        <div class="section-header">
          <h2 class="section-title">{{ currentCategoryName }}</h2>
          <div v-if="selectedCategory === 'all'" class="summary-stats">
            <div class="summary-stat">
              <span class="stat-value">{{ totalActiveProjects }}</span>
              <span class="stat-label">Active Projects</span>
            </div>
            <div class="summary-stat">
              <span class="stat-value">${{ totalInnovationRevenue }}M</span>
              <span class="stat-label">Innovation Revenue</span>
            </div>
            <div class="summary-stat">
              <span class="stat-value">{{ overallHealth }}</span>
              <span class="stat-label">Portfolio Health</span>
            </div>
          </div>
        </div>
        
        <div class="metrics-grid">
          <InnovationMetricCard
            v-for="metric in metrics"
            :key="metric.label"
            :metric="metric"
            :show-benchmark="selectedCategory === 'all'"
          />
        </div>
      </section>

      <!-- Charts Section -->
      <section class="charts-section">
        <div class="charts-grid">
          <!-- Pipeline Funnel Chart -->
          <FunnelChart
            v-if="pipelineFunnelData"
            title="Innovation Pipeline"
            description="Track ideas from submission to scaled deployment"
            :data="pipelineFunnelData.data"
            :labels="pipelineFunnelData.labels"
            :colors="pipelineFunnelData.colors"
          />
          
          <!-- Portfolio Mix Chart -->
          <DonutChart
            v-if="portfolioMixData"
            title="Portfolio Distribution"
            description="Innovation investment by category"
            :data="portfolioMixData.data"
            :labels="portfolioMixData.labels"
            :colors="portfolioMixData.colors"
            unit="%"
          />
          
          <!-- Revenue Trend Chart -->
          <RevenueChart
            v-if="revenueTrendData"
            title="Revenue Growth Comparison"
            description="Innovation vs Traditional Revenue Trends"
            :data="revenueTrendData"
            :chart-width="500"
            :chart-height="300"
          />
          
          <!-- Competitive Benchmark Chart -->
          <CompetitiveBenchmarkChart
            v-if="competitiveData && selectedCategory === 'all'"
            title="Market Position"
            description="SHI vs Competitors on Key Metrics"
            :data="competitiveData"
            :chart-width="600"
            :chart-height="350"
          />
        </div>
      </section>
      
      <!-- Key Insights Section -->
      <section v-if="selectedCategory === 'all'" class="insights-section">
        <div class="insights-grid">
          <div class="insight-card">
            <h3 class="insight-title">🎯 Strategic Focus</h3>
            <p class="insight-text">
              AI and cloud-native solutions now represent 74% of our innovation portfolio, 
              positioning SHI ahead of traditional competitors in emerging technology readiness.
            </p>
          </div>
          
          <div class="insight-card">
            <h3 class="insight-title">📈 Market Leadership</h3>
            <p class="insight-text">
              Software attach rate of 76% leads the industry, driving $268M in incremental 
              innovation revenue with 4.1x ROI exceeding competitive benchmarks.
            </p>
          </div>
          
          <div class="insight-card">
            <h3 class="insight-title">🚀 Pipeline Health</h3>
            <p class="insight-text">
              13% idea-to-deployment conversion rate with 32-day average pilot time demonstrates 
              excellent execution velocity and innovation funnel efficiency.
            </p>
          </div>
        </div>
      </section>
    </div>

    <DocumentationModal v-model="showDocs" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, inject, computed } from 'vue'
import { useInnovation } from '@/composables/useInnovation'
import { innovationService } from '@/services/innovationService'
import PeriodSelector from '@/components/dashboard/PeriodSelector.vue'
import CategorySelector from '@/components/dashboard/CategorySelector.vue'
import InnovationMetricCard from '@/components/dashboard/InnovationMetricCard.vue'
import FunnelChart from '@/components/charts/FunnelChart.vue'
import DonutChart from '@/components/charts/DonutChart.vue'
import RevenueChart from '@/components/charts/RevenueChart.vue'
import CompetitiveBenchmarkChart from '@/components/charts/CompetitiveBenchmarkChart.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import DocumentationButton from '@/components/common/DocumentationButton.vue'
import DocumentationModal from '@/components/common/DocumentationModal.vue'

const analyticsConfig = inject('analyticsConfig', {})
const selectedPeriod = ref(analyticsConfig.defaultPeriod || '30d')
const selectedCategory = ref('all')
const showDocs = ref(false)

// Chart data refs
const pipelineFunnelData = ref(null)
const portfolioMixData = ref(null)
const revenueTrendData = ref(null)
const competitiveData = ref(null)

const { 
  metrics, 
  categories, 
  currentCategoryName,
  loading, 
  error, 
  fetchCategories, 
  fetchMetrics,
  fetchChartData 
} = useInnovation()

// Computed summary stats for executive view
const totalActiveProjects = computed(() => {
  const pipelineMetric = metrics.value.find(m => m.label === 'Active Pilots')
  return pipelineMetric?.value || 125
})

const totalInnovationRevenue = computed(() => {
  const revenueMetric = metrics.value.find(m => m.label === 'Innovation Revenue')
  return revenueMetric?.value || 268
})

const overallHealth = computed(() => {
  // Calculate based on key metrics performance
  const roi = metrics.value.find(m => m.label === 'Innovation ROI')?.value || 4.1
  if (roi >= 4.0) return 'Excellent'
  if (roi >= 3.0) return 'Good'
  if (roi >= 2.0) return 'Fair'
  return 'Needs Focus'
})

// Load all chart data
async function loadChartData(period) {
  try {
    const [funnel, portfolio, revenue, competitive] = await Promise.all([
      innovationService.getChartData('pipelineFunnel', period),
      innovationService.getChartData('portfolioMix', period),
      innovationService.getChartData('revenueTrend', period),
      innovationService.getChartData('competitive', period)
    ])
    
    pipelineFunnelData.value = funnel
    portfolioMixData.value = portfolio
    revenueTrendData.value = revenue
    competitiveData.value = competitive
  } catch (err) {
    console.error('Failed to load chart data:', err)
  }
}

// Watch for period changes
watch(selectedPeriod, (newPeriod) => {
  fetchMetrics(newPeriod, selectedCategory.value)
  loadChartData(newPeriod)
})

// Watch for category changes
watch(selectedCategory, (newCategory) => {
  fetchMetrics(selectedPeriod.value, newCategory)
})

// Initialize dashboard
onMounted(async () => {
  await fetchCategories()
  await fetchMetrics(selectedPeriod.value, selectedCategory.value)
  await loadChartData(selectedPeriod.value)
  
  // Auto-refresh data every 5 minutes for executive dashboard
  if (analyticsConfig.refreshInterval) {
    setInterval(() => {
      fetchMetrics(selectedPeriod.value, selectedCategory.value)
      loadChartData(selectedPeriod.value)
    }, analyticsConfig.refreshInterval)
  }
})
</script>

<style scoped>
.innovation-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 24px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 24px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dashboard-title {
  font-size: 32px;
  font-weight: 800;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.company-logo {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: -0.5px;
}

.dashboard-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 4px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.summary-stats {
  display: flex;
  gap: 32px;
}

.summary-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.charts-section {
  width: 100%;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 24px;
}

.insights-section {
  width: 100%;
  margin-top: 16px;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.insight-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.insight-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.insight-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.insight-text {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin: 0;
}

/* Mobile responsiveness */
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
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .company-logo {
    align-self: flex-start;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .summary-stats {
    gap: 16px;
    justify-content: space-between;
    width: 100%;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .insights-grid {
    grid-template-columns: 1fr;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .innovation-dashboard {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  }
  
  .dashboard-title {
    color: #f8fafc;
  }
  
  .dashboard-subtitle {
    color: #cbd5e1;
  }
  
  .section-title {
    color: #f8fafc;
  }
  
  .stat-value {
    color: #f1f5f9;
  }
  
  .stat-label {
    color: #94a3b8;
  }
  
  .error-message {
    background: #7f1d1d;
    color: #fecaca;
  }
  
  .insight-card {
    background: #1e293b;
    border-color: #334155;
  }
  
  .insight-title {
    color: #f1f5f9;
  }
  
  .insight-text {
    color: #cbd5e1;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .company-logo {
    background: #000;
    border: 2px solid #fff;
  }
  
  .insight-card {
    border-width: 2px;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .insight-card {
    transition: none;
  }
  
  .insight-card:hover {
    transform: none;
  }
}
</style>