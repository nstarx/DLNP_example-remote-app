<template>
  <div class="coo-dashboard">
    <!-- Main Header -->
    <header class="dashboard-header">
      <div class="header-left">
        <div class="company-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#1f2937"/>
            <text x="16" y="22" text-anchor="middle" fill="white" font-size="16" font-weight="bold">K</text>
          </svg>
          <div class="header-text">
            <h1 class="dashboard-title">Kemper Operations Command</h1>
            <p class="dashboard-subtitle">AI-Powered COO Dashboard</p>
          </div>
        </div>
      </div>
      <div class="header-right">
        <div class="status-indicator">
          <div class="status-dot active"></div>
          <span>Live</span>
        </div>
        <div class="last-updated">
          Last updated: {{ formatTime(lastUpdated) }}
        </div>
      </div>
    </header>

    <!-- AI Insights Bar -->
    <div class="ai-insights-bar">
      <div class="ai-icon">🤖</div>
      <div class="insight-content">
        <div class="insight-text">{{ currentInsight.text }}</div>
        <button v-if="currentInsight.action" class="insight-action" @click="handleInsightAction(currentInsight.action)">
          {{ currentInsight.actionText }}
        </button>
      </div>
      <button class="dismiss-btn" @click="dismissInsight">×</button>
    </div>

    <!-- Natural Language Query -->
    <div class="query-section">
      <div class="query-input-container">
        <input 
          v-model="queryText" 
          @keyup.enter="processQuery"
          class="query-input" 
          placeholder="Ask me anything... 'Show regions with slowest claim times this week'"
        />
        <button @click="processQuery" class="query-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="dashboard-content">
      <!-- Critical Alerts Section -->
      <section v-if="criticalAlerts.length > 0" class="alerts-section">
        <h2 class="section-title">🚨 Critical Alerts</h2>
        <div class="alerts-grid">
          <div v-for="alert in criticalAlerts" :key="alert.id" class="alert-card critical">
            <div class="alert-header">
              <span class="alert-severity">{{ alert.severity }}</span>
              <span class="alert-time">{{ formatTime(alert.timestamp) }}</span>
            </div>
            <div class="alert-message">{{ alert.message }}</div>
            <div class="alert-actions">
              <button class="btn-primary">Take Action</button>
              <button class="btn-secondary">View Details</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Executive KPIs -->
      <section class="kpi-section">
        <h2 class="section-title">📊 Executive KPIs</h2>
        <div class="kpi-grid">
          <div v-for="kpi in executiveKPIs" :key="kpi.id" class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">{{ kpi.title }}</span>
              <span class="kpi-trend" :class="kpi.trend">
                {{ kpi.trend === 'up' ? '↗' : kpi.trend === 'down' ? '↘' : '→' }}
              </span>
            </div>
            <div class="kpi-value">{{ kpi.value }}</div>
            <div class="kpi-change" :class="kpi.changeType">{{ kpi.change }}</div>
            <div class="kpi-insight">{{ kpi.insight }}</div>
          </div>
        </div>
      </section>

      <!-- Operations Grid -->
      <div class="operations-grid">
        <!-- Claims Processing -->
        <section class="operations-card">
          <h3 class="card-title">Claims Processing</h3>
          <div class="mini-kpis">
            <div class="mini-kpi">
              <span class="mini-value">{{ claimsMetrics.pending }}</span>
              <span class="mini-label">Pending Claims</span>
            </div>
            <div class="mini-kpi">
              <span class="mini-value">{{ claimsMetrics.avgTime }}</span>
              <span class="mini-label">Avg Process Time</span>
            </div>
          </div>
          <div class="quick-insights">
            <div class="insight-item">📈 Claims volume up 15% vs last week</div>
            <div class="insight-item">⚠️ Southeast region showing delays</div>
          </div>
        </section>

        <!-- Customer Service -->
        <section class="operations-card">
          <h3 class="card-title">Customer Service</h3>
          <div class="mini-kpis">
            <div class="mini-kpi">
              <span class="mini-value">{{ serviceMetrics.satisfaction }}</span>
              <span class="mini-label">CSAT Score</span>
            </div>
            <div class="mini-kpi">
              <span class="mini-value">{{ serviceMetrics.response }}</span>
              <span class="mini-label">Avg Response</span>
            </div>
          </div>
          <div class="quick-insights">
            <div class="insight-item">🎯 Meeting SLA targets across all channels</div>
            <div class="insight-item">💡 AI suggests staffing increase for PM shift</div>
          </div>
        </section>

        <!-- Financial Performance -->
        <section class="operations-card">
          <h3 class="card-title">Financial Performance</h3>
          <div class="mini-kpis">
            <div class="mini-kpi">
              <span class="mini-value">{{ financialMetrics.expenses }}</span>
              <span class="mini-label">Operating Expenses</span>
            </div>
            <div class="mini-kpi">
              <span class="mini-value">{{ financialMetrics.efficiency }}</span>
              <span class="mini-label">Cost Efficiency</span>
            </div>
          </div>
          <div class="quick-insights">
            <div class="insight-item">💰 Cost per claim down 8% this quarter</div>
            <div class="insight-item">📊 ROI on automation tools: 340%</div>
          </div>
        </section>

        <!-- Operational Efficiency -->
        <section class="operations-card">
          <h3 class="card-title">Operational Efficiency</h3>
          <div class="mini-kpis">
            <div class="mini-kpi">
              <span class="mini-value">{{ efficiencyMetrics.automation }}</span>
              <span class="mini-label">Automation Rate</span>
            </div>
            <div class="mini-kpi">
              <span class="mini-value">{{ efficiencyMetrics.errors }}</span>
              <span class="mini-label">Error Rate</span>
            </div>
          </div>
          <div class="quick-insights">
            <div class="insight-item">🤖 New workflow automation ready for deployment</div>
            <div class="insight-item">📋 Process optimization identified in claims routing</div>
          </div>
        </section>
      </div>

      <!-- Forecasting & Predictions -->
      <section class="forecasting-section">
        <h2 class="section-title">🔮 Smart Forecasting</h2>
        <div class="forecast-grid">
          <div class="forecast-card">
            <h4>Claims Volume Prediction</h4>
            <div class="forecast-chart">
              <div class="forecast-value">+23%</div>
              <div class="forecast-period">Next 7 Days</div>
            </div>
            <div class="forecast-reasoning">
              Based on seasonal patterns, weather data, and historical trends
            </div>
          </div>
          <div class="forecast-card">
            <h4>Resource Needs</h4>
            <div class="forecast-chart">
              <div class="forecast-value">+12 FTE</div>
              <div class="forecast-period">Peak Period</div>
            </div>
            <div class="forecast-reasoning">
              Recommended staffing increase for upcoming volume surge
            </div>
          </div>
        </div>
      </section>

      <!-- Automation Triggers -->
      <section class="automation-section">
        <h2 class="section-title">⚡ Active Automation</h2>
        <div class="automation-grid">
          <div v-for="trigger in activeTriggers" :key="trigger.id" class="trigger-card">
            <div class="trigger-header">
              <span class="trigger-status" :class="trigger.status">{{ trigger.status }}</span>
              <span class="trigger-time">{{ formatTime(trigger.lastRun) }}</span>
            </div>
            <div class="trigger-name">{{ trigger.name }}</div>
            <div class="trigger-description">{{ trigger.description }}</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'

// Reactive data for the COO dashboard
const lastUpdated = ref(new Date())
const queryText = ref('')

// Current AI insight
const currentInsight = ref({
  text: "Claims processing efficiency has improved 12% this week. Your automation initiatives are delivering strong ROI.",
  action: "view_automation_report",
  actionText: "View Report"
})

// Critical alerts
const criticalAlerts = ref([
  {
    id: 1,
    severity: 'HIGH',
    message: 'Claims processing backlog detected in Southeast region. Estimated 4-hour delay.',
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
  },
  {
    id: 2,
    severity: 'MEDIUM',
    message: 'Customer satisfaction scores trending below target in digital channels.',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
  }
])

// Executive KPIs
const executiveKPIs = ref([
  {
    id: 'operational_efficiency',
    title: 'Operational Efficiency',
    value: '94.2%',
    change: '+2.1% vs last week',
    changeType: 'positive',
    trend: 'up',
    insight: 'Automation driving efficiency gains'
  },
  {
    id: 'cost_per_claim',
    title: 'Cost per Claim',
    value: '$127',
    change: '-$8 vs target',
    changeType: 'positive',
    trend: 'down',
    insight: 'Below benchmark by 6%'
  },
  {
    id: 'customer_satisfaction',
    title: 'Customer Satisfaction',
    value: '4.3/5.0',
    change: '+0.2 vs last month',
    changeType: 'positive',
    trend: 'up',
    insight: 'Digital initiatives showing impact'
  },
  {
    id: 'claim_cycle_time',
    title: 'Avg Claim Cycle Time',
    value: '3.2 days',
    change: '-0.5 days vs target',
    changeType: 'positive',
    trend: 'down',
    insight: 'Fastest processing this quarter'
  }
])

// Operations metrics
const claimsMetrics = reactive({
  pending: '1,247',
  avgTime: '3.2 days'
})

const serviceMetrics = reactive({
  satisfaction: '4.3/5.0',
  response: '2.1 hrs'
})

const financialMetrics = reactive({
  expenses: '$2.4M',
  efficiency: '94.2%'
})

const efficiencyMetrics = reactive({
  automation: '78%',
  errors: '0.3%'
})

// Active automation triggers
const activeTriggers = ref([
  {
    id: 1,
    name: 'Claims Surge Detection',
    description: 'Auto-allocate resources when claims volume exceeds threshold',
    status: 'active',
    lastRun: new Date(Date.now() - 900000) // 15 minutes ago
  },
  {
    id: 2,
    name: 'Customer Escalation',
    description: 'Priority routing for high-value customer issues',
    status: 'active',
    lastRun: new Date(Date.now() - 1800000) // 30 minutes ago
  },
  {
    id: 3,
    name: 'Staffing Optimization',
    description: 'Dynamic scheduling based on predicted workload',
    status: 'pending',
    lastRun: new Date(Date.now() - 3600000) // 1 hour ago
  }
])

// Computed properties
const formatTime = computed(() => {
  return (date) => {
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    
    if (minutes < 60) {
      return `${minutes}m ago`
    } else if (hours < 24) {
      return `${hours}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }
})

// Methods
const processQuery = () => {
  if (!queryText.value.trim()) return
  
  // Simulate AI processing
  console.log('Processing query:', queryText.value)
  
  // Mock response based on query
  const mockResponses = {
    'slow claim': 'Southeast region showing 4-hour delays due to staffing constraints',
    'customer satisfaction': 'Digital channels at 4.1/5.0, phone support at 4.5/5.0',
    'cost': 'Operating costs down 8% this quarter, automation ROI at 340%',
    'forecast': 'Claims volume expected to increase 23% over next 7 days'
  }
  
  const query = queryText.value.toLowerCase()
  let response = 'I analyzed your request. Here are the key insights...'
  
  for (const [key, value] of Object.entries(mockResponses)) {
    if (query.includes(key)) {
      response = value
      break
    }
  }
  
  // Update current insight with query response
  currentInsight.value = {
    text: response,
    action: null,
    actionText: null
  }
  
  queryText.value = ''
}

const handleInsightAction = (action) => {
  console.log('Handling insight action:', action)
  // In a real app, this would navigate to detailed reports or trigger actions
}

const dismissInsight = () => {
  // Rotate to next insight
  const insights = [
    {
      text: "Customer satisfaction scores are trending upward thanks to your recent process improvements.",
      action: "view_csat_details",
      actionText: "View Details"
    },
    {
      text: "Automated claim routing has reduced processing time by 18% this month.",
      action: "view_automation_metrics",
      actionText: "See Metrics"
    },
    {
      text: "Cost efficiency is exceeding targets. Consider scaling successful initiatives.",
      action: "view_cost_analysis",
      actionText: "Analyze Costs"
    }
  ]
  
  const randomInsight = insights[Math.floor(Math.random() * insights.length)]
  currentInsight.value = randomInsight
}

// Lifecycle
onMounted(() => {
  // Simulate real-time updates
  setInterval(() => {
    lastUpdated.value = new Date()
    
    // Simulate minor metric fluctuations
    const randomChange = () => (Math.random() - 0.5) * 0.1
    
    // Update some metrics slightly
    if (Math.random() > 0.7) {
      const pendingCount = parseInt(claimsMetrics.pending.replace(',', ''))
      claimsMetrics.pending = (pendingCount + Math.floor(randomChange() * 20)).toLocaleString()
    }
    
  }, 30000) // Update every 30 seconds
  
  // Rotate insights every 2 minutes
  setInterval(() => {
    if (Math.random() > 0.5) {
      dismissInsight()
    }
  }, 120000)
})
</script>

<style scoped>
/* Global Dashboard Styles */
.coo-dashboard {
  min-height: 100vh;
  background: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
}

/* Header */
.dashboard-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.company-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-text {
  display: flex;
  flex-direction: column;
}

.dashboard-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.2;
}

.dashboard-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #0f766e;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.last-updated {
  font-size: 12px;
  color: #64748b;
}

/* AI Insights Bar */
.ai-insights-bar {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
}

.ai-icon {
  font-size: 24px;
  opacity: 0.9;
}

.insight-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
}

.insight-text {
  font-size: 14px;
  line-height: 1.4;
}

.insight-action {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.insight-action:hover {
  background: rgba(255, 255, 255, 0.3);
}

.dismiss-btn {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.7;
  padding: 4px;
  line-height: 1;
}

.dismiss-btn:hover {
  opacity: 1;
}

/* Query Section */
.query-section {
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.query-input-container {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  gap: 8px;
}

.query-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.query-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.query-btn {
  background: #3b82f6;
  border: none;
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.query-btn:hover {
  background: #2563eb;
}

/* Dashboard Content */
.dashboard-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Alerts Section */
.alerts-section {
  background: #fef2f2;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #fecaca;
}

.alerts-grid {
  display: grid;
  gap: 16px;
}

.alert-card {
  background: white;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #ef4444;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.alert-severity {
  background: #ef4444;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.alert-time {
  font-size: 12px;
  color: #64748b;
}

.alert-message {
  font-size: 14px;
  color: #374151;
  margin-bottom: 12px;
}

.alert-actions {
  display: flex;
  gap: 8px;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}

/* KPI Section */
.kpi-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.kpi-card {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.kpi-title {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
}

.kpi-trend {
  font-size: 16px;
}

.kpi-trend.up { color: #10b981; }
.kpi-trend.down { color: #ef4444; }
.kpi-trend.neutral { color: #64748b; }

.kpi-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.kpi-change {
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
}

.kpi-change.positive { color: #10b981; }
.kpi-change.negative { color: #ef4444; }

.kpi-insight {
  font-size: 12px;
  color: #64748b;
  font-style: italic;
}

/* Operations Grid */
.operations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.operations-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.mini-kpis {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.mini-kpi {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mini-value {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.mini-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.quick-insights {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.insight-item {
  font-size: 13px;
  color: #475569;
  padding: 8px 12px;
  background: #f1f5f9;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
}

/* Forecasting Section */
.forecasting-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.forecast-card {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #bae6fd;
}

.forecast-card h4 {
  font-size: 14px;
  font-weight: 600;
  color: #0c4a6e;
  margin: 0 0 12px 0;
}

.forecast-chart {
  text-align: center;
  margin-bottom: 12px;
}

.forecast-value {
  font-size: 32px;
  font-weight: 700;
  color: #0c4a6e;
}

.forecast-period {
  font-size: 12px;
  color: #0369a1;
  font-weight: 500;
}

.forecast-reasoning {
  font-size: 12px;
  color: #64748b;
  font-style: italic;
}

/* Automation Section */
.automation-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.automation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.trigger-card {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.trigger-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.trigger-status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.trigger-status.active {
  background: #dcfce7;
  color: #166534;
}

.trigger-status.pending {
  background: #fef3c7;
  color: #92400e;
}

.trigger-time {
  font-size: 11px;
  color: #64748b;
}

.trigger-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.trigger-description {
  font-size: 12px;
  color: #64748b;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .operations-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  
  .kpi-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }
  
  .header-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .dashboard-title {
    font-size: 20px;
  }
  
  .dashboard-content {
    padding: 16px;
  }
  
  .operations-grid {
    grid-template-columns: 1fr;
  }
  
  .kpi-grid {
    grid-template-columns: 1fr;
  }
  
  .forecast-grid {
    grid-template-columns: 1fr;
  }
  
  .automation-grid {
    grid-template-columns: 1fr;
  }
  
  .query-input-container {
    max-width: none;
  }
}

@media (max-width: 480px) {
  .company-logo {
    flex-direction: column;
    gap: 8px;
  }
  
  .mini-kpis {
    flex-direction: column;
    gap: 12px;
  }
  
  .alert-actions {
    flex-direction: column;
  }
}
</style>