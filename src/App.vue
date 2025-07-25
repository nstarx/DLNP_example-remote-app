<template>
  <div class="command-center">
    <header class="command-center-header">
      <div class="header-left">
        <h1 class="command-center-title">IT Automation Command Center</h1>
        <div class="system-status">
          <span class="status-indicator" :class="systemHealth.status"></span>
          All Systems {{ systemHealth.label }}
        </div>
      </div>
      <div class="header-right">
        <button class="header-btn secondary" @click="refreshData">
          <span class="btn-icon">↻</span>
          Refresh
        </button>
        <button class="header-btn primary" @click="showSettings = true">
          Settings
        </button>
      </div>
    </header>

    <LoadingSpinner v-if="loading" />
    
    <div v-else-if="error" class="error-message">
      <span class="error-icon">⚠</span>
      {{ error }}
    </div>

    <div v-else class="command-center-content">
      <!-- KPI Dashboard -->
      <section class="kpi-section">
        <div class="kpi-grid">
          <KpiCard
            v-for="kpi in kpis"
            :key="kpi.id"
            :kpi="kpi"
          />
        </div>
      </section>

      <!-- Main Content Grid -->
      <div class="main-content-grid">
        <!-- Active Automations -->
        <section class="automations-section">
          <ActiveAutomations 
            :automations="activeAutomations"
            @action="handleAutomationAction"
          />
        </section>

        <!-- AI Insights Panel -->
        <section class="insights-section">
          <AiInsights :insights="aiInsights" @approve="handleInsightApproval" />
        </section>
      </div>

      <!-- Activity Log -->
      <section class="activity-section">
        <ActivityLog 
          :activities="recentActivities"
          @filter="handleActivityFilter"
        />
      </section>

      <!-- Policy Controls -->
      <section class="policy-section">
        <PolicyControls 
          :policies="policies"
          @update="handlePolicyUpdate"
        />
      </section>
    </div>

    <SettingsModal v-model="showSettings" />
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useAutomationCenter } from '@/composables/useAutomationCenter'
import KpiCard from '@/components/automation/KpiCard.vue'
import ActiveAutomations from '@/components/automation/ActiveAutomations.vue'
import ActivityLog from '@/components/automation/ActivityLog.vue'
import AiInsights from '@/components/automation/AiInsights.vue'
import PolicyControls from '@/components/automation/PolicyControls.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import SettingsModal from '@/components/automation/SettingsModal.vue'

const automationConfig = inject('automationConfig', {})
const showSettings = ref(false)

const {
  kpis,
  activeAutomations,
  recentActivities,
  aiInsights,
  policies,
  systemHealth,
  loading,
  error,
  refreshData,
  handleAutomationAction,
  handleActivityFilter,
  handleInsightApproval,
  handlePolicyUpdate
} = useAutomationCenter()

onMounted(() => {
  refreshData()
  
  // Auto-refresh every 30 seconds
  if (automationConfig.refreshInterval !== false) {
    setInterval(() => {
      refreshData()
    }, automationConfig.refreshInterval || 30000)
  }
})
</script>

<style scoped>
/* Enterprise Design System Variables */
.command-center {
  --color-primary: #0078d4;
  --color-primary-hover: #106ebe;
  --color-secondary: #6b7280;
  --color-success: #107c10;
  --color-warning: #ff8c00;
  --color-danger: #d13438;
  --color-surface: #ffffff;
  --color-surface-2: #f8f9fa;
  --color-surface-3: #e5e7eb;
  --color-text: #323130;
  --color-text-secondary: #605e5c;
  --color-border: #d1d5db;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --border-radius: 4px;
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  
  min-height: 100vh;
  background: var(--color-surface-2);
  font-family: var(--font-family);
  color: var(--color-text);
  padding: 0;
}

/* Header */
.command-center-header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.command-center-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  line-height: 1.2;
}

.system-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-indicator.operational {
  background: var(--color-success);
}

.status-indicator.warning {
  background: var(--color-warning);
}

.status-indicator.critical {
  background: var(--color-danger);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Buttons */
.header-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.header-btn:hover {
  background: var(--color-surface-2);
  border-color: var(--color-secondary);
}

.header-btn.primary {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.header-btn.primary:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.btn-icon {
  font-size: 16px;
  line-height: 1;
}

/* Content Layout */
.command-center-content {
  padding: 24px;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* KPI Section */
.kpi-section {
  width: 100%;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

/* Main Content Grid */
.main-content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  align-items: start;
}

.automations-section,
.insights-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}

/* Full-width sections */
.activity-section,
.policy-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fef2f2;
  color: var(--color-danger);
  padding: 16px 24px;
  border-radius: var(--border-radius);
  border: 1px solid #fecaca;
  margin: 24px;
  font-weight: 500;
}

.error-icon {
  font-size: 18px;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .main-content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .command-center-header {
    padding: 12px 16px;
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .header-left,
  .header-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .command-center-title {
    font-size: 18px;
  }
  
  .command-center-content {
    padding: 16px;
    gap: 16px;
  }
  
  .kpi-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

/* High contrast accessibility */
@media (prefers-contrast: high) {
  .command-center {
    --color-border: #000000;
    --color-text-secondary: #000000;
  }
}

/* Reduced motion accessibility */
@media (prefers-reduced-motion: reduce) {
  .header-btn {
    transition: none;
  }
}
</style>