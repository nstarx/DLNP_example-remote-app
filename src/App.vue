<template>
  <div class="command-center">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <div class="logo-section">
          <div class="logo-icon">⚡</div>
          <h1 class="title">IT Automation Command Center</h1>
        </div>
      </div>
      <div class="header-right">
        <div class="status-indicator">
          <span class="status-dot active"></span>
          <span class="status-text">Systems Online</span>
        </div>
        <button class="refresh-btn" @click="refreshDashboard" :disabled="loading">
          <span class="refresh-icon">🔄</span>
          {{ loading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <div class="main-content">
      <!-- KPI Dashboard -->
      <section class="kpi-section">
        <div class="kpi-grid">
          <KPICard
            v-for="kpi in kpiMetrics"
            :key="kpi.id"
            :kpi="kpi"
          />
        </div>
      </section>

      <!-- Two-column layout -->
      <div class="content-grid">
        <!-- Left Column -->
        <div class="left-panel">
          <!-- Active Automations -->
          <section class="automations-section">
            <div class="section-header">
              <h2 class="section-title">Active & Upcoming Automations</h2>
              <div class="section-actions">
                <select v-model="automationFilter" class="filter-select">
                  <option value="all">All Tasks</option>
                  <option value="running">Running</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
            <AutomationTable
              :automations="filteredAutomations"
              @action="handleAutomationAction"
            />
          </section>

          <!-- Activity Log -->
          <section class="activity-section">
            <div class="section-header">
              <h2 class="section-title">Recent Activity</h2>
              <div class="section-actions">
                <input 
                  v-model="activitySearch" 
                  type="text" 
                  placeholder="Search devices, actions..."
                  class="search-input"
                >
              </div>
            </div>
            <ActivityLog
              :activities="filteredActivities"
              :loading="loading"
            />
          </section>
        </div>

        <!-- Right Panel -->
        <div class="right-panel">
          <!-- AI Insights -->
          <section class="insights-section">
            <div class="section-header">
              <h2 class="section-title">AI Insights & Suggestions</h2>
            </div>
            <AIInsightsPanel :insights="aiInsights" />
          </section>

          <!-- Policy Controls -->
          <section class="policies-section">
            <div class="section-header">
              <h2 class="section-title">Automation Policies</h2>
            </div>
            <PolicyControlPanel
              :policies="policies"
              @update="updatePolicy"
            />
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import KPICard from '@/components/automation/KPICard.vue'
import AutomationTable from '@/components/automation/AutomationTable.vue'
import ActivityLog from '@/components/automation/ActivityLog.vue'
import AIInsightsPanel from '@/components/automation/AIInsightsPanel.vue'
import PolicyControlPanel from '@/components/automation/PolicyControlPanel.vue'

// Reactive state
const loading = ref(false)
const automationFilter = ref('all')
const activitySearch = ref('')

// Mock data for demonstration
const kpiMetrics = ref([
  {
    id: 'auto-resolved',
    label: 'Issues Auto-Resolved',
    value: 247,
    subtext: 'This week',
    trend: '+12%',
    trendUp: true,
    icon: '✅'
  },
  {
    id: 'downtime-avoided',
    label: 'Downtime Avoided',
    value: '32.5',
    unit: 'hours',
    subtext: 'Estimated this week',
    trend: '+8%',
    trendUp: true,
    icon: '⏱️'
  },
  {
    id: 'recurring-issues',
    label: 'Recurring Issues',
    value: 18,
    subtext: 'Devices affected',
    trend: '-4',
    trendUp: false,
    icon: '🔄'
  },
  {
    id: 'success-rate',
    label: 'Success Rate',
    value: '94.2',
    unit: '%',
    subtext: 'Last 30 days',
    trend: '+2.1%',
    trendUp: true,
    icon: '📊'
  }
])

const automations = ref([
  {
    id: 1,
    name: 'Windows Update Deployment',
    status: 'running',
    devices: 145,
    eta: '2h 15m',
    progress: 67,
    category: 'maintenance'
  },
  {
    id: 2,
    name: 'Audio Driver Fix',
    status: 'scheduled',
    devices: 28,
    eta: '4:30 PM',
    progress: 0,
    category: 'repair'
  },
  {
    id: 3,
    name: 'Disk Cleanup',
    status: 'failed',
    devices: 12,
    eta: 'Failed',
    progress: 0,
    category: 'maintenance',
    error: 'Permission denied on 3 devices'
  },
  {
    id: 4,
    name: 'Security Patch Install',
    status: 'scheduled',
    devices: 89,
    eta: '6:00 PM',
    progress: 0,
    category: 'security'
  }
])

const activities = ref([
  {
    id: 1,
    device: 'LAPTOP-IT-045',
    action: 'Audio driver updated',
    timestamp: '2024-01-15 14:32:18',
    result: 'success',
    triggeredBy: 'system',
    details: 'Realtek Audio Driver v6.0.9583.1'
  },
  {
    id: 2,
    device: 'DESKTOP-HR-102',
    action: 'Disk cleanup completed',
    timestamp: '2024-01-15 14:28:45',
    result: 'success',
    triggeredBy: 'admin',
    details: 'Freed 2.3 GB disk space'
  },
  {
    id: 3,
    device: 'LAPTOP-FIN-023',
    action: 'Windows update failed',
    timestamp: '2024-01-15 14:15:22',
    result: 'failed',
    triggeredBy: 'system',
    details: 'Error code: 0x80070643'
  },
  {
    id: 4,
    device: 'DESKTOP-ENG-078',
    action: 'Battery replacement alert sent',
    timestamp: '2024-01-15 13:55:10',
    result: 'success',
    triggeredBy: 'system',
    details: 'Battery health: 67%'
  }
])

const aiInsights = ref([
  {
    id: 1,
    type: 'suggestion',
    title: 'High Audio Driver Failures',
    description: 'You\'ve fixed 50+ audio driver crashes this week. Consider auto-deploying patch KB5034203.',
    confidence: 'high',
    action: 'Deploy patch automatically',
    priority: 'medium'
  },
  {
    id: 2,
    type: 'alert',
    title: 'Battery Degradation Pattern',
    description: 'Battery degradation alerts on 8% of fleet (42 devices). Recommend proactive replacement notifications.',
    confidence: 'high',
    action: 'Send replacement alerts',
    priority: 'low'
  },
  {
    id: 3,
    type: 'optimization',
    title: 'Maintenance Window',
    description: 'Disk cleanup tasks are 40% faster when run between 2-4 AM. Adjust scheduling?',
    confidence: 'medium',
    action: 'Optimize schedule',
    priority: 'low'
  }
])

const policies = ref([
  {
    id: 'auto-approve-safe',
    label: 'Auto-approve safe remediations',
    description: 'Cache clearing, temp file cleanup, basic driver updates',
    enabled: true,
    category: 'automation'
  },
  {
    id: 'manual-security',
    label: 'Manual review for security tasks',
    description: 'Security patches, policy changes, access modifications',
    enabled: true,
    category: 'security'
  },
  {
    id: 'work-hours-limit',
    label: 'Respect work hours',
    description: 'No disruptive installs during 9 AM - 5 PM',
    enabled: true,
    category: 'scheduling'
  },
  {
    id: 'auto-rollback',
    label: 'Auto-rollback on failure',
    description: 'Automatically revert changes if automation fails',
    enabled: false,
    category: 'safety'
  }
])

// Computed properties
const filteredAutomations = computed(() => {
  if (automationFilter.value === 'all') return automations.value
  return automations.value.filter(auto => auto.status === automationFilter.value)
})

const filteredActivities = computed(() => {
  if (!activitySearch.value) return activities.value
  const search = activitySearch.value.toLowerCase()
  return activities.value.filter(activity => 
    activity.device.toLowerCase().includes(search) ||
    activity.action.toLowerCase().includes(search)
  )
})

// Methods
const refreshDashboard = () => {
  loading.value = true
  // Simulate API call
  setTimeout(() => {
    loading.value = false
    // In real app, refresh all data here
  }, 1500)
}

const handleAutomationAction = (action, automation) => {
  console.log(`${action} action on automation:`, automation)
  // Handle different actions: approve, pause, run, retry, details
}

const updatePolicy = (policyId, enabled) => {
  const policy = policies.value.find(p => p.id === policyId)
  if (policy) {
    policy.enabled = enabled
  }
}

onMounted(() => {
  // Initialize dashboard data
  refreshDashboard()
})
</script>

<style scoped>
/* Global Styles */
.command-center {
  min-height: 100vh;
  background: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1e293b;
}

/* Header */
.header {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 24px;
  padding: 8px;
  background: #0ea5e9;
  color: white;
  border-radius: 8px;
  line-height: 1;
}

.title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #0f172a;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #64748b;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
}

.status-dot.active {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background: #0284c7;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-icon {
  font-size: 12px;
}

/* Main Content */
.main-content {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* KPI Section */
.kpi-section {
  margin-bottom: 32px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  align-items: start;
}

.left-panel {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.right-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Section Styling */
.automations-section,
.activity-section,
.insights-section,
.policies-section {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafbfc;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #0f172a;
}

.section-actions {
  display: flex;
  gap: 12px;
}

/* Form Controls */
.filter-select {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  width: 240px;
  font-size: 14px;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.search-input::placeholder {
  color: #9ca3af;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .right-panel {
    order: -1;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }
  
  .header {
    padding: 12px 16px;
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
    position: static;
  }
  
  .header-right {
    justify-content: space-between;
  }
  
  .title {
    font-size: 18px;
  }
  
  .kpi-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .section-header {
    padding: 16px;
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .search-input {
    width: 100%;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .status-dot.active {
    animation: none;
  }
  
  .refresh-btn {
    transition: none;
  }
}

/* Focus States */
.refresh-btn:focus-visible,
.filter-select:focus-visible,
.search-input:focus-visible {
  outline: 2px solid #0ea5e9;
  outline-offset: 2px;
}

/* Loading States */
.refresh-btn:disabled .refresh-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Print Styles */
@media print {
  .header {
    position: static;
    box-shadow: none;
  }
  
  .refresh-btn {
    display: none;
  }
}
</style>