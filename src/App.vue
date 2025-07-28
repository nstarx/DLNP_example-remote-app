<template>
  <div class="coo-dashboard">
    <!-- Header with Executive Summary and AI Query -->
    <header class="dashboard-header">
      <div class="header-top">
        <div class="executive-info">
          <h1 class="dashboard-title">Kemper Operations Command Center</h1>
          <div class="status-indicator">
            <span class="status-dot" :class="operationalStatus.status"></span>
            <span class="status-text">{{ operationalStatus.message }}</span>
            <span class="last-updated">Updated {{ formatTimeAgo(lastUpdated) }}</span>
          </div>
        </div>
        
        <div class="header-actions">
          <AIQueryInput @query="handleAIQuery" :loading="queryLoading" />
          <NotificationCenter :alerts="criticalAlerts" />
        </div>
      </div>
      
      <!-- Executive Summary Banner -->
      <div class="executive-summary">
        <div class="summary-metric">
          <span class="metric-label">Claims Processed Today</span>
          <span class="metric-value">{{ executiveSummary.claimsProcessed.toLocaleString() }}</span>
          <span class="metric-change" :class="executiveSummary.claimsChange >= 0 ? 'positive' : 'negative'">
            {{ executiveSummary.claimsChange >= 0 ? '+' : '' }}{{ executiveSummary.claimsChange }}%
          </span>
        </div>
        <div class="summary-metric">
          <span class="metric-label">Avg Processing Time</span>
          <span class="metric-value">{{ executiveSummary.avgProcessingTime }}</span>
          <span class="metric-change" :class="executiveSummary.timeChange <= 0 ? 'positive' : 'negative'">
            {{ executiveSummary.timeChange <= 0 ? '' : '+' }}{{ executiveSummary.timeChange }}%
          </span>
        </div>
        <div class="summary-metric">
          <span class="metric-label">Customer Satisfaction</span>
          <span class="metric-value">{{ executiveSummary.customerSat }}%</span>
          <span class="metric-change" :class="executiveSummary.satChange >= 0 ? 'positive' : 'negative'">
            {{ executiveSummary.satChange >= 0 ? '+' : '' }}{{ executiveSummary.satChange }}%
          </span>
        </div>
        <div class="summary-metric">
          <span class="metric-label">Cost per Claim</span>
          <span class="metric-value">${{ executiveSummary.costPerClaim }}</span>
          <span class="metric-change" :class="executiveSummary.costChange <= 0 ? 'positive' : 'negative'">
            {{ executiveSummary.costChange <= 0 ? '' : '+' }}{{ executiveSummary.costChange }}%
          </span>
        </div>
      </div>
    </header>

    <LoadingSpinner v-if="loading" />
    
    <div v-else-if="error" class="error-message">
      <strong>System Error:</strong> {{ error }}
      <button @click="retryConnection" class="retry-btn">Retry Connection</button>
    </div>

    <div v-else class="dashboard-content">
      <!-- AI Insights & Alerts Panel -->
      <aside class="ai-insights-panel">
        <div class="panel-header">
          <h2>AI Insights</h2>
          <div class="ai-status">
            <span class="ai-indicator active"></span>
            <span>AI Active</span>
          </div>
        </div>
        
        <AIAlertsWidget :alerts="aiAlerts" @dismiss="dismissAlert" />
        <AIRecommendationsWidget :recommendations="aiRecommendations" @action="executeRecommendation" />
        <RootCauseAnalysisWidget :analysis="rootCauseAnalysis" />
      </aside>

      <!-- Main Dashboard Content -->
      <main class="main-content">
        <!-- Critical Alerts Row -->
        <section class="alerts-section" v-if="criticalAlerts.length > 0">
          <CriticalAlertsBar :alerts="criticalAlerts" @action="handleAlertAction" />
        </section>

        <!-- Operational KPIs -->
        <section class="kpi-section">
          <div class="section-header">
            <h2>Operational Performance</h2>
            <div class="kpi-filters">
              <select v-model="selectedRegion" @change="updateKPIs">
                <option value="all">All Regions</option>
                <option value="northeast">Northeast</option>
                <option value="southeast">Southeast</option>
                <option value="midwest">Midwest</option>
                <option value="west">West</option>
              </select>
              <select v-model="selectedTimeframe" @change="updateKPIs">
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
          </div>
          
          <div class="kpi-grid">
            <OperationalKPICard
              v-for="kpi in operationalKPIs"
              :key="kpi.id"
              :kpi="kpi"
              @drill-down="handleKPIDrillDown"
            />
          </div>
        </section>

        <!-- Smart Forecasting & Trends -->
        <section class="forecasting-section">
          <div class="section-header">
            <h2>Smart Forecasting</h2>
            <div class="forecast-controls">
              <button @click="refreshForecast" class="refresh-btn">
                <RefreshIcon /> Refresh Forecast
              </button>
            </div>
          </div>
          
          <div class="forecast-grid">
            <SmartForecastWidget
              title="Claims Volume Forecast"
              :forecast="claimsForecast"
              type="volume"
            />
            <SmartForecastWidget
              title="Processing Delay Prediction"
              :forecast="delayForecast"
              type="delay"
            />
            <SmartForecastWidget
              title="Resource Requirements"
              :forecast="resourceForecast"
              type="resource"
            />
          </div>
        </section>

        <!-- Performance Trends -->
        <section class="trends-section">
          <div class="section-header">
            <h2>Performance Trends</h2>
            <div class="trend-controls">
              <button @click="detectAnomalies" class="anomaly-btn">
                <AnomalyIcon /> Detect Anomalies
              </button>
            </div>
          </div>
          
          <div class="trends-grid">
            <PerformanceTrendChart
              title="Claims Processing Efficiency"
              :data="claimsEfficiencyTrend"
              :anomalies="detectedAnomalies.efficiency"
            />
            <PerformanceTrendChart
              title="Customer Experience Score"
              :data="customerExperienceTrend"
              :anomalies="detectedAnomalies.experience"
            />
            <PerformanceTrendChart
              title="Operational Cost Trends"
              :data="operationalCostTrend"
              :anomalies="detectedAnomalies.cost"
            />
          </div>
        </section>
      </main>
    </div>

    <!-- AI Query Results Modal -->
    <AIQueryResultsModal v-model="showQueryResults" :results="queryResults" />
    
    <!-- Automation Trigger Modal -->
    <AutomationTriggerModal v-model="showAutomationModal" :trigger="activeTrigger" @execute="executeAutomation" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted, inject } from 'vue'
import { useOperationalDashboard } from '@/composables/useOperationalDashboard'
import { useAIInsights } from '@/composables/useAIInsights'
import { useRealTimeData } from '@/composables/useRealTimeData'

// Components
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import AIQueryInput from '@/components/ai/AIQueryInput.vue'
import NotificationCenter from '@/components/ai/NotificationCenter.vue'
import AIAlertsWidget from '@/components/ai/AIAlertsWidget.vue'
import AIRecommendationsWidget from '@/components/ai/AIRecommendationsWidget.vue'
import RootCauseAnalysisWidget from '@/components/ai/RootCauseAnalysisWidget.vue'
import CriticalAlertsBar from '@/components/alerts/CriticalAlertsBar.vue'
import OperationalKPICard from '@/components/kpi/OperationalKPICard.vue'
import SmartForecastWidget from '@/components/forecasting/SmartForecastWidget.vue'
import PerformanceTrendChart from '@/components/trends/PerformanceTrendChart.vue'
import AIQueryResultsModal from '@/components/ai/AIQueryResultsModal.vue'
import AutomationTriggerModal from '@/components/automation/AutomationTriggerModal.vue'
import RefreshIcon from '@/components/icons/RefreshIcon.vue'
import AnomalyIcon from '@/components/icons/AnomalyIcon.vue'

// Configuration
const dashboardConfig = inject('dashboardConfig', {
  refreshInterval: 30000, // 30 seconds
  aiUpdateInterval: 60000, // 1 minute
  enableRealTime: true,
  defaultRegion: 'all',
  defaultTimeframe: '24h'
})

// Core state
const loading = ref(true)
const error = ref(null)
const lastUpdated = ref(new Date())

// User selections
const selectedRegion = ref(dashboardConfig.defaultRegion)
const selectedTimeframe = ref(dashboardConfig.defaultTimeframe)

// AI Query state
const queryLoading = ref(false)
const showQueryResults = ref(false)
const queryResults = ref(null)

// Automation state
const showAutomationModal = ref(false)
const activeTrigger = ref(null)

// Composables
const {
  operationalKPIs,
  executiveSummary,
  operationalStatus,
  claimsEfficiencyTrend,
  customerExperienceTrend,
  operationalCostTrend,
  updateKPIs,
  refreshData
} = useOperationalDashboard()

const {
  aiAlerts,
  aiRecommendations,
  rootCauseAnalysis,
  claimsForecast,
  delayForecast,
  resourceForecast,
  detectedAnomalies,
  criticalAlerts,
  processAIQuery,
  dismissAlert,
  executeRecommendation,
  refreshForecast,
  detectAnomalies
} = useAIInsights()

const {
  connect,
  disconnect,
  isConnected
} = useRealTimeData()

// Utility methods
const formatTimeAgo = (date) => {
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)
  
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const retryConnection = async () => {
  error.value = null
  loading.value = true
  try {
    await refreshData()
    if (dashboardConfig.enableRealTime) {
      await connect()
    }
  } catch (err) {
    error.value = err.message || 'Failed to connect to operational systems'
  } finally {
    loading.value = false
  }
}

// Event handlers
const handleAIQuery = async (query) => {
  queryLoading.value = true
  try {
    queryResults.value = await processAIQuery(query)
    showQueryResults.value = true
  } catch (err) {
    error.value = `AI Query failed: ${err.message}`
  } finally {
    queryLoading.value = false
  }
}

const handleKPIDrillDown = (kpiId) => {
  // Navigate to detailed view for specific KPI
  console.log('Drill down into KPI:', kpiId)
}

const handleAlertAction = (alert, action) => {
  if (action === 'trigger_automation') {
    activeTrigger.value = {
      id: `auto_${Date.now()}`,
      type: alert.automationType,
      title: alert.automationTitle,
      description: alert.automationDescription,
      actions: alert.suggestedActions
    }
    showAutomationModal.value = true
  }
}

const executeAutomation = async (trigger, selectedActions) => {
  try {
    // Execute automation triggers
    console.log('Executing automation:', trigger, selectedActions)
    showAutomationModal.value = false
    activeTrigger.value = null
    
    // Refresh data after automation
    await refreshData()
  } catch (err) {
    error.value = `Automation failed: ${err.message}`
  }
}

// Watchers
watch([selectedRegion, selectedTimeframe], () => {
  updateKPIs(selectedRegion.value, selectedTimeframe.value)
})

// Lifecycle
onMounted(async () => {
  try {
    // Initialize dashboard data
    await refreshData()
    
    // Connect to real-time data if enabled
    if (dashboardConfig.enableRealTime) {
      await connect()
    }
    
    // Set up refresh intervals
    const dataRefreshInterval = setInterval(() => {
      refreshData()
      lastUpdated.value = new Date()
    }, dashboardConfig.refreshInterval)
    
    const aiRefreshInterval = setInterval(() => {
      detectAnomalies()
      refreshForecast()
    }, dashboardConfig.aiUpdateInterval)
    
    // Store intervals for cleanup
    window.dashboardIntervals = {
      dataRefresh: dataRefreshInterval,
      aiRefresh: aiRefreshInterval
    }
    
  } catch (err) {
    error.value = err.message || 'Failed to initialize dashboard'
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  // Cleanup intervals
  if (window.dashboardIntervals) {
    clearInterval(window.dashboardIntervals.dataRefresh)
    clearInterval(window.dashboardIntervals.aiRefresh)
  }
  
  // Disconnect real-time connection
  if (isConnected.value) {
    disconnect()
  }
})
</script>

<style scoped>
/* Executive Dashboard Styles */
.coo-dashboard {
  min-height: 100vh;
  background: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Header Styles */
.dashboard-header {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 24px 32px;
  border-bottom: 1px solid #e2e8f0;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 32px;
}

.executive-info {
  flex: 1;
}

.dashboard-title {
  font-size: 28px;
  font-weight: 600;
  color: white;
  margin: 0 0 8px 0;
  letter-spacing: -0.025em;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #cbd5e1;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
}

.status-dot.warning {
  background: #f59e0b;
}

.status-dot.critical {
  background: #ef4444;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Executive Summary Banner */
.executive-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-metric {
  text-align: center;
}

.metric-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #cbd5e1;
  margin-bottom: 4px;
}

.metric-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin-bottom: 4px;
}

.metric-change {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 12px;
}

.metric-change.positive {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.metric-change.negative {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

/* Dashboard Content */
.dashboard-content {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  padding: 24px 32px;
  min-height: calc(100vh - 200px);
}

/* AI Insights Panel */
.ai-insights-panel {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  height: fit-content;
  position: sticky;
  top: 24px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.panel-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
}

.ai-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #94a3b8;
}

.ai-indicator.active {
  background: #10b981;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Main Content */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Section Headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

/* KPI Section */
.kpi-section {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 24px;
}

.kpi-filters {
  display: flex;
  gap: 12px;
}

.kpi-filters select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  color: #374151;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

/* Forecasting Section */
.forecasting-section {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 24px;
}

.forecast-controls {
  display: flex;
  gap: 12px;
}

.refresh-btn, .anomaly-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.refresh-btn:hover, .anomaly-btn:hover {
  background: #2563eb;
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

/* Trends Section */
.trends-section {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 24px;
}

.trends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

/* Error States */
.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 16px 20px;
  border-radius: 8px;
  text-align: center;
  margin: 24px 32px;
}

.retry-btn {
  margin-left: 12px;
  padding: 6px 12px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.retry-btn:hover {
  background: #b91c1c;
}

/* Loading States */
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .dashboard-content {
    grid-template-columns: 280px 1fr;
    gap: 20px;
    padding: 20px 24px;
  }
  
  .executive-summary {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .coo-dashboard {
    font-size: 14px;
  }
  
  .dashboard-header {
    padding: 20px 24px;
  }
  
  .header-top {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }
  
  .dashboard-title {
    font-size: 24px;
  }
  
  .executive-summary {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .dashboard-content {
    grid-template-columns: 1fr;
    padding: 16px 20px;
  }
  
  .ai-insights-panel {
    position: static;
    order: 2;
  }
  
  .kpi-filters {
    flex-wrap: wrap;
  }
  
  .forecast-grid,
  .trends-grid {
    grid-template-columns: 1fr;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .coo-dashboard {
    background: #0f172a;
    color: #e2e8f0;
  }
  
  .ai-insights-panel,
  .kpi-section,
  .forecasting-section,
  .trends-section {
    background: #1e293b;
    border-color: #334155;
  }
  
  .panel-header {
    border-color: #334155;
  }
  
  .panel-header h2,
  .section-header h2 {
    color: #f1f5f9;
  }
  
  .kpi-filters select {
    background: #334155;
    border-color: #475569;
    color: #e2e8f0;
  }
  
  .error-message {
    background: #7f1d1d;
    border-color: #b91c1c;
    color: #fecaca;
  }
}

/* Utility Classes */
.text-sm { font-size: 14px; }
.text-xs { font-size: 12px; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.text-gray-500 { color: #6b7280; }
.text-gray-600 { color: #4b5563; }
.text-blue-600 { color: #2563eb; }
.text-green-600 { color: #16a34a; }
.text-red-600 { color: #dc2626; }
</style>