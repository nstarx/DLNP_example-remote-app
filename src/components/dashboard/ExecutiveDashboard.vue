<template>
  <div class="executive-dashboard">
    <DashboardHeader 
      title="Executive Intelligence Hub"
      :user="user"
      @logout="$emit('logout')"
    >
      <template #actions>
        <RoleSwitcher @switch-role="$emit('switch-role', $event)" />
        <NotificationCenter :notifications="notifications" />
      </template>
    </DashboardHeader>

    <div class="dashboard-content">
      <!-- AI Insights Panel -->
      <section class="insights-section">
        <AIInsightsPanel 
          :insights="aiInsights"
          :loading="aiLoading"
          @refresh="refreshAIInsights"
        />
      </section>

      <!-- KPI Overview -->
      <section class="kpi-section">
        <div class="kpi-grid">
          <KPICard
            title="Total Premium"
            :value="kpis.totalPremium"
            trend="up"
            :change="kpis.premiumChange"
            format="currency"
            icon="💰"
          />
          <KPICard
            title="Claims Ratio"
            :value="kpis.claimsRatio"
            trend="down"
            :change="kpis.claimsRatioChange"
            format="percentage"
            icon="📊"
          />
          <KPICard
            title="Customer Satisfaction"
            :value="kpis.customerSatisfaction"
            trend="up"
            :change="kpis.satisfactionChange"
            format="score"
            icon="⭐"
          />
          <KPICard
            title="Fraud Detection Rate"
            :value="kpis.fraudDetectionRate"
            trend="up"
            :change="kpis.fraudDetectionChange"
            format="percentage"
            icon="🛡️"
          />
        </div>
      </section>

      <!-- Risk & Compliance Dashboard -->
      <section class="risk-compliance-section">
        <div class="section-grid">
          <div class="card">
            <div class="card-header">
              <h3>🚨 Risk Alerts</h3>
              <span class="badge high">{{ riskAlerts.length }} Active</span>
            </div>
            <div class="risk-alerts">
              <div 
                v-for="alert in riskAlerts" 
                :key="alert.id"
                class="alert-item"
                :class="alert.severity"
              >
                <div class="alert-content">
                  <div class="alert-title">{{ alert.title }}</div>
                  <div class="alert-description">{{ alert.description }}</div>
                </div>
                <div class="alert-actions">
                  <button class="btn-small primary">Review</button>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3>📋 Compliance Status</h3>
              <span class="badge" :class="complianceStatus.level">
                {{ complianceStatus.score }}%
              </span>
            </div>
            <div class="compliance-overview">
              <div class="compliance-metric">
                <span>Regulatory Compliance</span>
                <div class="progress-bar">
                  <div 
                    class="progress-fill green" 
                    :style="{width: complianceStatus.regulatory + '%'}"
                  ></div>
                </div>
                <span>{{ complianceStatus.regulatory }}%</span>
              </div>
              <div class="compliance-metric">
                <span>Documentation</span>
                <div class="progress-bar">
                  <div 
                    class="progress-fill yellow" 
                    :style="{width: complianceStatus.documentation + '%'}"
                  ></div>
                </div>
                <span>{{ complianceStatus.documentation }}%</span>
              </div>
              <div class="compliance-metric">
                <span>Process Adherence</span>
                <div class="progress-bar">
                  <div 
                    class="progress-fill blue" 
                    :style="{width: complianceStatus.process + '%'}"
                  ></div>
                </div>
                <span>{{ complianceStatus.process }}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Predictive Analytics -->
      <section class="analytics-section">
        <div class="section-grid">
          <div class="card">
            <div class="card-header">
              <h3>🔮 Predictive Analytics</h3>
            </div>
            <div class="prediction-grid">
              <div class="prediction-item">
                <div class="prediction-icon">📈</div>
                <div class="prediction-content">
                  <div class="prediction-title">Claims Surge Forecast</div>
                  <div class="prediction-value">+23% Next Week</div>
                  <div class="prediction-region">Northeast Region</div>
                </div>
              </div>
              <div class="prediction-item">
                <div class="prediction-icon">👥</div>
                <div class="prediction-content">
                  <div class="prediction-title">Customer Churn Risk</div>
                  <div class="prediction-value">340 High Risk</div>
                  <div class="prediction-region">Across All Segments</div>
                </div>
              </div>
              <div class="prediction-item">
                <div class="prediction-icon">💡</div>
                <div class="prediction-content">
                  <div class="prediction-title">Revenue Opportunity</div>
                  <div class="prediction-value">$2.3M Potential</div>
                  <div class="prediction-region">Cross-sell Campaigns</div>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3>📊 Performance Trends</h3>
            </div>
            <div class="chart-container">
              <canvas ref="performanceChart" width="400" height="200"></canvas>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAI } from '@/composables/useAI'
import DashboardHeader from './common/DashboardHeader.vue'
import RoleSwitcher from './common/RoleSwitcher.vue'
import NotificationCenter from './common/NotificationCenter.vue'
import AIInsightsPanel from './components/AIInsightsPanel.vue'
import KPICard from './components/KPICard.vue'

const props = defineProps({
  user: Object
})

const emit = defineEmits(['logout', 'switch-role'])

const { generateInsights, aiInsights, isProcessing: aiLoading } = useAI()

// Mock KPI data
const kpis = ref({
  totalPremium: 45600000,
  premiumChange: 12.3,
  claimsRatio: 0.67,
  claimsRatioChange: -2.1,
  customerSatisfaction: 4.6,
  satisfactionChange: 0.3,
  fraudDetectionRate: 0.94,
  fraudDetectionChange: 8.2
})

// Risk alerts
const riskAlerts = ref([
  {
    id: 1,
    title: 'Unusual Claims Pattern',
    description: 'Auto claims in Northeast region showing 23% spike',
    severity: 'high',
    timestamp: new Date()
  },
  {
    id: 2,
    title: 'Fraud Pattern Detected',
    description: 'Suspicious activity in commercial property segment',
    severity: 'high',
    timestamp: new Date()
  },
  {
    id: 3,
    title: 'Compliance Review Required',
    description: 'Rate filing update needed for California market',
    severity: 'medium',
    timestamp: new Date()
  }
])

// Compliance status
const complianceStatus = ref({
  score: 92,
  level: 'high',
  regulatory: 96,
  documentation: 88,
  process: 94
})

// Notifications
const notifications = ref([
  {
    id: 1,
    type: 'alert',
    title: 'High fraud risk detected',
    message: 'Review claim #CL-2024-8901',
    timestamp: new Date(),
    read: false
  },
  {
    id: 2,
    type: 'insight',
    title: 'Revenue opportunity identified',
    message: '340 customers eligible for upsell',
    timestamp: new Date(),
    read: false
  }
])

const refreshAIInsights = async () => {
  await generateInsights({
    role: 'executive',
    timeframe: '30d'
  })
}

onMounted(async () => {
  await refreshAIInsights()
})
</script>

<style scoped>
.executive-dashboard {
  min-height: 100vh;
  background: #f8fafc;
}

.dashboard-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.insights-section {
  width: 100%;
}

.kpi-section {
  width: 100%;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.risk-compliance-section,
.analytics-section {
  width: 100%;
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge.high {
  background: #fef2f2;
  color: #dc2626;
}

.badge.medium {
  background: #fef3c7;
  color: #d97706;
}

.badge.low {
  background: #f0fdf4;
  color: #16a34a;
}

.risk-alerts {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.alert-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid;
}

.alert-item.high {
  background: #fef2f2;
  border-left-color: #dc2626;
}

.alert-item.medium {
  background: #fef3c7;
  border-left-color: #d97706;
}

.alert-title {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.alert-description {
  font-size: 14px;
  color: #64748b;
}

.btn-small {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-small.primary {
  background: #3b82f6;
  color: white;
}

.btn-small.primary:hover {
  background: #2563eb;
}

.compliance-overview {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.compliance-metric {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.compliance-metric span:first-child {
  min-width: 120px;
  color: #64748b;
}

.compliance-metric span:last-child {
  min-width: 40px;
  text-align: right;
  font-weight: 600;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-fill.green {
  background: #10b981;
}

.progress-fill.yellow {
  background: #f59e0b;
}

.progress-fill.blue {
  background: #3b82f6;
}

.prediction-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.prediction-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.prediction-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.prediction-title {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.prediction-value {
  font-size: 18px;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 2px;
}

.prediction-region {
  font-size: 12px;
  color: #64748b;
}

.chart-container {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 8px;
  color: #64748b;
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 16px;
    gap: 24px;
  }
  
  .kpi-grid,
  .section-grid {
    grid-template-columns: 1fr;
  }
  
  .card {
    padding: 16px;
  }
}
</style>