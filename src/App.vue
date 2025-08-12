<template>
  <div class="vc-dashboard">
    <header class="dashboard-header">
      <div class="header-left">
        <h1 class="dashboard-title">
          {{ dashboardMode === 'portfolio' ? 'VC Portfolio Dashboard' : 'Investment Thesis Dashboard' }}
        </h1>
        <div class="header-subtitle">
          {{ dashboardMode === 'portfolio' ? 'Monitor portfolio companies and performance' : 'Validate thesis and market opportunities' }}
        </div>
      </div>
      <div class="header-right">
        <button @click="refreshData" class="refresh-button" :disabled="loading">
          <span class="refresh-icon">🔄</span>
          Refresh
        </button>
        <DocumentationButton @click="showDocs = true" />
      </div>
    </header>

    <DashboardModeSelector 
      :selected-mode="dashboardMode"
      :available-sectors="availableSectors"
      :portfolio-health="portfolioHealth"
      @mode-changed="handleModeChange"
      @filters-changed="handleFiltersChange"
      @refresh-thesis="refreshThesisData"
      @run-scenarios="runScenarios"
      @export-report="exportReport"
    />

    <LoadingSpinner v-if="loading" />
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Portfolio Monitoring Dashboard -->
    <div v-else-if="dashboardMode === 'portfolio'" class="dashboard-content">
      <!-- Key Metrics Section -->
      <section class="metrics-section">
        <h2 class="section-title">Portfolio Overview</h2>
        <div class="metrics-grid">
          <MetricCard
            v-for="metric in portfolioMetrics"
            :key="metric.label"
            :metric="metric"
          />
        </div>
      </section>

      <!-- Portfolio Health & Performance -->
      <section class="performance-section">
        <div class="performance-grid">
          <!-- Portfolio Heatmap -->
          <div class="heatmap-container">
            <PortfolioHeatmap 
              :companies="filteredCompanies"
              @company-selected="handleCompanySelection"
            />
          </div>
          
          <!-- Allocation Charts -->
          <div class="allocation-container">
            <AllocationCharts 
              :sector-allocation="sectorAllocationData"
              :geography-allocation="geographyAllocationData"
              :stage-allocation="stageAllocationData"
              @sector-selected="handleSectorFilter"
              @region-selected="handleRegionFilter"
              @stage-selected="handleStageFilter"
            />
          </div>
        </div>
      </section>

      <!-- Portfolio Companies Grid -->
      <section class="companies-section">
        <div class="companies-header">
          <h2 class="section-title">Portfolio Companies</h2>
          <div class="companies-stats">
            <span class="stat-item">
              <span class="stat-value healthy">{{ portfolioHealth.healthy.count }}</span>
              <span class="stat-label">Healthy</span>
            </span>
            <span class="stat-item">
              <span class="stat-value warning">{{ portfolioHealth.warning.count }}</span>
              <span class="stat-label">Warning</span>
            </span>
            <span class="stat-item">
              <span class="stat-value critical">{{ portfolioHealth.critical.count }}</span>
              <span class="stat-label">Critical</span>
            </span>
          </div>
        </div>
        
        <div class="companies-grid">
          <PortfolioCompanyCard
            v-for="company in filteredCompanies"
            :key="company.id"
            :company="company"
          />
        </div>
      </section>

      <!-- At Risk Companies Alert -->
      <section v-if="atRiskCompanies.length > 0" class="alerts-section">
        <div class="alert-card">
          <div class="alert-header">
            <span class="alert-icon">⚠️</span>
            <h3 class="alert-title">Companies Requiring Attention ({{ atRiskCompanies.length }})</h3>
          </div>
          <div class="alert-companies">
            <div 
              v-for="company in atRiskCompanies" 
              :key="company.id"
              class="alert-company"
            >
              <span class="company-logo">{{ company.logo }}</span>
              <div class="company-info">
                <span class="company-name">{{ company.name }}</span>
                <span class="company-issues">
                  <span v-if="company.financials.cashRunway < 12" class="issue">Low runway</span>
                  <span v-if="company.risks.managementTurnover" class="issue">Mgmt changes</span>
                  <span v-if="company.healthStatus === 'critical'" class="issue">Critical metrics</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Investment Thesis Validation Dashboard -->
    <div v-else class="dashboard-content">
      <ThesisValidationDashboard />
    </div>

    <DocumentationModal v-model="showDocs" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { usePortfolio } from '@/composables/usePortfolio'
import { useThesis } from '@/composables/useThesis'
import { fundMetrics } from '@/data/vcMockData'

// Components
import DashboardModeSelector from '@/components/dashboard/DashboardModeSelector.vue'
import MetricCard from '@/components/dashboard/MetricCard.vue'
import PortfolioCompanyCard from '@/components/portfolio/PortfolioCompanyCard.vue'
import PortfolioHeatmap from '@/components/portfolio/PortfolioHeatmap.vue'
import AllocationCharts from '@/components/charts/AllocationCharts.vue'
import ThesisValidationDashboard from '@/components/thesis/ThesisValidationDashboard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import DocumentationButton from '@/components/common/DocumentationButton.vue'
import DocumentationModal from '@/components/common/DocumentationModal.vue'

// Analytics and VC composables
const analyticsConfig = inject('analyticsConfig', {})
const {
  companies,
  loading: portfolioLoading,
  error: portfolioError,
  portfolioHealth,
  keyMetrics: portfolioMetrics,
  atRiskCompanies,
  refreshPortfolioData
} = usePortfolio()

const {
  loading: thesisLoading,
  error: thesisError,
  refreshThesisData
} = useThesis()

// Dashboard state
const dashboardMode = ref('portfolio')
const showDocs = ref(false)
const currentFilters = ref({
  health: 'all',
  sector: 'all',
  stage: 'all'
})

// Computed properties
const loading = computed(() => portfolioLoading.value || thesisLoading.value)
const error = computed(() => portfolioError.value || thesisError.value)

const availableSectors = computed(() => {
  if (!companies.value || companies.value.length === 0) return []
  const sectors = new Set(companies.value.map(c => c.sector))
  return Array.from(sectors)
})

const filteredCompanies = computed(() => {
  if (!companies.value) return []
  return companies.value.filter(company => {
    if (currentFilters.value.health !== 'all' && company.healthStatus !== currentFilters.value.health) {
      return false
    }
    if (currentFilters.value.sector !== 'all' && company.sector !== currentFilters.value.sector) {
      return false
    }
    if (currentFilters.value.stage !== 'all' && company.stage !== currentFilters.value.stage) {
      return false
    }
    return true
  })
})

// Convert fund metrics to the format expected by AllocationCharts
const sectorAllocationData = computed(() => {
  return Object.entries(fundMetrics.sectorAllocation || {}).map(([sector, data]) => ({
    sector,
    amount: data.amount,
    percentage: data.percentage,
    companies: data.companies || 0
  }))
})

const geographyAllocationData = computed(() => {
  return Object.entries(fundMetrics.geographyAllocation || {}).map(([region, data]) => ({
    region,
    amount: data.amount,
    percentage: data.percentage,
    companies: data.companies || 0
  }))
})

const stageAllocationData = computed(() => {
  return Object.entries(fundMetrics.stageAllocation || {}).map(([stage, data]) => ({
    stage,
    amount: data.amount,
    percentage: data.percentage,
    companies: data.companies || 0
  }))
})

// Event handlers
function handleModeChange(mode) {
  dashboardMode.value = mode
}

function handleFiltersChange(filters) {
  currentFilters.value = filters
}

function handleCompanySelection(company) {
  // Could emit event or show detailed view
  console.log('Company selected:', company.name)
}

function handleSectorFilter(sector) {
  currentFilters.value.sector = sector
}

function handleRegionFilter(region) {
  // Could add region filtering
  console.log('Region selected:', region)
}

function handleStageFilter(stage) {
  currentFilters.value.stage = stage
}

async function refreshData() {
  if (dashboardMode.value === 'portfolio') {
    await refreshPortfolioData()
  } else {
    await refreshThesisData()
  }
}

function runScenarios() {
  // Handle scenario running
  console.log('Running scenarios...')
}

function exportReport() {
  // Handle report export
  console.log('Exporting report...')
}

// Initialize
onMounted(() => {
  refreshPortfolioData()
  
  if (analyticsConfig.refreshInterval) {
    setInterval(() => {
      refreshData()
    }, analyticsConfig.refreshInterval)
  }
})
</script>

<style scoped>
.vc-dashboard {
  min-height: 100vh;
  background: #f9fafb;
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
  margin: 0 0 4px 0;
}

.header-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.refresh-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.refresh-button:hover:not(:disabled) {
  background: #2563eb;
}

.refresh-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.refresh-icon {
  font-size: 14px;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #fecaca;
}

.metrics-section {
  width: 100%;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.performance-section {
  width: 100%;
}

.performance-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.heatmap-container,
.allocation-container {
  min-height: 400px;
}

.companies-section {
  width: 100%;
}

.companies-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.companies-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
}

.stat-value.healthy {
  color: #10b981;
}

.stat-value.warning {
  color: #f59e0b;
}

.stat-value.critical {
  color: #ef4444;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 500;
}

.companies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.alerts-section {
  width: 100%;
}

.alert-card {
  background: linear-gradient(135deg, #fef2f2, #fff5f5);
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 20px;
}

.alert-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.alert-icon {
  font-size: 24px;
}

.alert-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #dc2626;
}

.alert-companies {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.alert-company {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #fecaca;
}

.company-logo {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border-radius: 6px;
}

.company-info {
  flex: 1;
}

.company-name {
  font-weight: 600;
  color: #111827;
  display: block;
  margin-bottom: 4px;
}

.company-issues {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.issue {
  padding: 2px 6px;
  background: #fecaca;
  color: #dc2626;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

@media (max-width: 1200px) {
  .performance-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .vc-dashboard {
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
  
  .companies-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .companies-stats {
    justify-content: space-around;
    width: 100%;
  }
  
  .metrics-grid,
  .companies-grid {
    grid-template-columns: 1fr;
  }
  
  .alert-companies {
    grid-template-columns: 1fr;
  }
}

@media (prefers-color-scheme: dark) {
  .vc-dashboard {
    background: #111827;
  }
  
  .dashboard-title {
    color: #f9fafb;
  }
  
  .header-subtitle {
    color: #9ca3af;
  }
  
  .section-title {
    color: #f9fafb;
  }
  
  .error-message {
    background: #7f1d1d;
    color: #fecaca;
    border-color: #991b1b;
  }
  
  .stat-label {
    color: #9ca3af;
  }
  
  .alert-card {
    background: linear-gradient(135deg, #1f2937, #374151);
    border-color: #4b5563;
  }
  
  .alert-title {
    color: #f87171;
  }
  
  .alert-company {
    background: #1f2937;
    border-color: #4b5563;
  }
  
  .company-logo {
    background: #374151;
  }
  
  .company-name {
    color: #f9fafb;
  }
  
  .issue {
    background: #7f1d1d;
    color: #fecaca;
  }
}
</style>