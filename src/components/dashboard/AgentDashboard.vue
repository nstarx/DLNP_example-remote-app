<template>
  <div class="agent-dashboard">
    <DashboardHeader 
      title="Agent Command Center"
      :user="user"
      @logout="$emit('logout')"
    >
      <template #actions>
        <RoleSwitcher @switch-role="$emit('switch-role', $event)" />
        <NotificationCenter :notifications="notifications" />
      </template>
    </DashboardHeader>

    <div class="dashboard-content">
      <!-- Quick Actions Bar -->
      <section class="quick-actions">
        <div class="actions-grid">
          <button class="action-button primary" @click="createNewQuote">
            <span class="action-icon">📝</span>
            <span class="action-text">New Quote</span>
          </button>
          <button class="action-button secondary" @click="viewPipeline">
            <span class="action-icon">🎯</span>
            <span class="action-text">Sales Pipeline</span>
          </button>
          <button class="action-button tertiary" @click="openCustomerChat">
            <span class="action-icon">💬</span>
            <span class="action-text">Customer Chat</span>
          </button>
          <button class="action-button quaternary" @click="viewCommissions">
            <span class="action-icon">💰</span>
            <span class="action-text">Commissions</span>
          </button>
        </div>
      </section>

      <!-- Agent KPIs -->
      <section class="kpi-section">
        <div class="kpi-grid">
          <KPICard
            title="Monthly Sales"
            :value="agentKPIs.monthlySales"
            trend="up"
            :change="agentKPIs.salesChange"
            format="currency"
            icon="💼"
          />
          <KPICard
            title="Conversion Rate"
            :value="agentKPIs.conversionRate"
            trend="up"
            :change="agentKPIs.conversionChange"
            format="percentage"
            icon="🎯"
          />
          <KPICard
            title="Customer Satisfaction"
            :value="agentKPIs.customerSat"
            trend="stable"
            :change="agentKPIs.satChange"
            format="score"
            icon="⭐"
          />
          <KPICard
            title="Active Prospects"
            :value="agentKPIs.activeProspects"
            trend="up"
            :change="agentKPIs.prospectsChange"
            format="number"
            icon="👥"
          />
        </div>
      </section>

      <!-- Main Content Grid -->
      <div class="main-grid">
        <!-- Customer Intelligence Panel -->
        <div class="card large">
          <div class="card-header">
            <h3>🧠 Customer Intelligence</h3>
            <button class="refresh-btn" @click="refreshCustomerData">
              <span class="refresh-icon">🔄</span>
            </button>
          </div>
          <div class="customer-insights">
            <div class="insight-tabs">
              <button 
                v-for="tab in insightTabs" 
                :key="tab.id"
                @click="activeTab = tab.id"
                class="tab-button"
                :class="{ active: activeTab === tab.id }"
              >
                {{ tab.icon }} {{ tab.label }}
              </button>
            </div>
            
            <div class="tab-content">
              <div v-if="activeTab === 'high-value'" class="customer-list">
                <div 
                  v-for="customer in highValueCustomers" 
                  :key="customer.id"
                  class="customer-item"
                  @click="selectCustomer(customer)"
                >
                  <div class="customer-avatar">{{ customer.initials }}</div>
                  <div class="customer-info">
                    <div class="customer-name">{{ customer.name }}</div>
                    <div class="customer-value">${{ customer.totalValue.toLocaleString() }}</div>
                  </div>
                  <div class="customer-actions">
                    <div class="ai-score" :class="customer.aiScore.level">
                      {{ customer.aiScore.value }}
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else-if="activeTab === 'churn-risk'" class="risk-list">
                <div 
                  v-for="customer in churnRiskCustomers" 
                  :key="customer.id"
                  class="risk-item"
                  :class="customer.riskLevel"
                >
                  <div class="risk-header">
                    <span class="customer-name">{{ customer.name }}</span>
                    <span class="risk-badge" :class="customer.riskLevel">{{ customer.riskLevel }}</span>
                  </div>
                  <div class="risk-factors">
                    {{ customer.riskFactors.join(', ') }}
                  </div>
                  <div class="risk-actions">
                    <button class="btn-small primary">Contact Now</button>
                    <button class="btn-small secondary">Schedule Call</button>
                  </div>
                </div>
              </div>
              
              <div v-else-if="activeTab === 'opportunities'" class="opportunities-list">
                <div 
                  v-for="opportunity in crossSellOpportunities" 
                  :key="opportunity.id"
                  class="opportunity-item"
                >
                  <div class="opportunity-header">
                    <span class="customer-name">{{ opportunity.customerName }}</span>
                    <span class="potential-value">${{ opportunity.potentialValue.toLocaleString() }}</span>
                  </div>
                  <div class="opportunity-product">{{ opportunity.recommendedProduct }}</div>
                  <div class="opportunity-reason">{{ opportunity.reason }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sales Pipeline -->
        <div class="card">
          <div class="card-header">
            <h3>📊 Sales Pipeline</h3>
          </div>
          <div class="pipeline-overview">
            <div class="pipeline-stage" v-for="stage in pipelineStages" :key="stage.name">
              <div class="stage-header">
                <span class="stage-name">{{ stage.name }}</span>
                <span class="stage-count">{{ stage.count }}</span>
              </div>
              <div class="stage-value">${{ stage.value.toLocaleString() }}</div>
              <div class="stage-bar">
                <div 
                  class="stage-progress" 
                  :style="{ width: stage.percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activities -->
        <div class="card">
          <div class="card-header">
            <h3>⚡ Recent Activities</h3>
          </div>
          <div class="activities-list">
            <div 
              v-for="activity in recentActivities" 
              :key="activity.id"
              class="activity-item"
            >
              <div class="activity-icon" :class="activity.type">
                {{ getActivityIcon(activity.type) }}
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-details">{{ activity.details }}</div>
                <div class="activity-time">{{ formatTime(activity.timestamp) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Coaching Assistant -->
        <div class="card large">
          <div class="card-header">
            <h3>🎓 AI Sales Coach</h3>
          </div>
          <div class="coaching-panel">
            <div class="coaching-insights">
              <div class="insight-card">
                <div class="insight-icon">💡</div>
                <div class="insight-content">
                  <div class="insight-title">Timing Recommendation</div>
                  <div class="insight-message">
                    Best time to contact prospects is Tuesday-Thursday, 10 AM - 2 PM. 
                    Your conversion rate is 34% higher during these windows.
                  </div>
                </div>
              </div>
              
              <div class="insight-card">
                <div class="insight-icon">📈</div>
                <div class="insight-content">
                  <div class="insight-title">Product Focus</div>
                  <div class="insight-message">
                    Auto insurance cross-sell success rate is 67% for customers with home policies. 
                    Focus on bundling opportunities.
                  </div>
                </div>
              </div>
            </div>
            
            <div class="coaching-actions">
              <button class="coaching-btn">View Full Analysis</button>
              <button class="coaching-btn secondary">Schedule Coaching</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DashboardHeader from './common/DashboardHeader.vue'
import RoleSwitcher from './common/RoleSwitcher.vue'
import NotificationCenter from './common/NotificationCenter.vue'
import KPICard from './components/KPICard.vue'

const props = defineProps({
  user: Object
})

const emit = defineEmits(['logout', 'switch-role'])

const activeTab = ref('high-value')

// Agent KPIs
const agentKPIs = ref({
  monthlySales: 125000,
  salesChange: 18.5,
  conversionRate: 0.23,
  conversionChange: 5.2,
  customerSat: 4.7,
  satChange: 0.1,
  activeProspects: 47,
  prospectsChange: 12.3
})

// Insight tabs
const insightTabs = [
  { id: 'high-value', label: 'High Value', icon: '💎' },
  { id: 'churn-risk', label: 'Churn Risk', icon: '⚠️' },
  { id: 'opportunities', label: 'Cross-sell', icon: '🎯' }
]

// Mock customer data
const highValueCustomers = ref([
  {
    id: 1,
    name: 'Sarah Johnson',
    initials: 'SJ',
    totalValue: 45000,
    aiScore: { value: 95, level: 'high' }
  },
  {
    id: 2,
    name: 'Michael Chen',
    initials: 'MC',
    totalValue: 38000,
    aiScore: { value: 87, level: 'high' }
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    initials: 'ER',
    totalValue: 32000,
    aiScore: { value: 92, level: 'high' }
  }
])

const churnRiskCustomers = ref([
  {
    id: 1,
    name: 'Robert Smith',
    riskLevel: 'high',
    riskFactors: ['Payment delays', 'Decreased engagement']
  },
  {
    id: 2,
    name: 'Lisa Wang',
    riskLevel: 'medium',
    riskFactors: ['Multiple support tickets', 'Policy comparison searches']
  }
])

const crossSellOpportunities = ref([
  {
    id: 1,
    customerName: 'David Thompson',
    potentialValue: 8500,
    recommendedProduct: 'Life Insurance',
    reason: 'Recent home purchase, family expansion'
  },
  {
    id: 2,
    customerName: 'Jennifer Adams',
    potentialValue: 6200,
    recommendedProduct: 'Umbrella Policy',
    reason: 'High net worth, increased liability exposure'
  }
])

// Pipeline data
const pipelineStages = ref([
  { name: 'Prospects', count: 24, value: 180000, percentage: 100 },
  { name: 'Qualified', count: 18, value: 135000, percentage: 75 },
  { name: 'Proposal', count: 12, value: 90000, percentage: 50 },
  { name: 'Negotiation', count: 8, value: 60000, percentage: 33 },
  { name: 'Closed', count: 3, value: 22500, percentage: 12 }
])

// Recent activities
const recentActivities = ref([
  {
    id: 1,
    type: 'call',
    title: 'Call with Sarah Johnson',
    details: 'Discussed auto insurance renewal',
    timestamp: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: 2,
    type: 'quote',
    title: 'Quote generated for Michael Chen',
    details: 'Home insurance bundle quote',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    id: 3,
    type: 'meeting',
    title: 'Meeting scheduled with Emily Rodriguez',
    details: 'Life insurance consultation',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4)
  }
])

// Notifications
const notifications = ref([
  {
    id: 1,
    type: 'alert',
    title: 'High churn risk detected',
    message: 'Robert Smith showing concerning patterns',
    timestamp: new Date(),
    read: false
  },
  {
    id: 2,
    type: 'opportunity',
    title: 'Cross-sell opportunity',
    message: 'David Thompson - Life insurance potential',
    timestamp: new Date(),
    read: false
  }
])

// Methods
const createNewQuote = () => {
  console.log('Creating new quote...')
}

const viewPipeline = () => {
  console.log('Opening pipeline view...')
}

const openCustomerChat = () => {
  console.log('Opening customer chat...')
}

const viewCommissions = () => {
  console.log('Opening commissions view...')
}

const selectCustomer = (customer) => {
  console.log('Selected customer:', customer.name)
}

const refreshCustomerData = () => {
  console.log('Refreshing customer data...')
}

const getActivityIcon = (type) => {
  const icons = {
    call: '📞',
    quote: '📄',
    meeting: '📅',
    email: '📧',
    follow_up: '🔄'
  }
  return icons[type] || '📋'
}

const formatTime = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp
  const hours = Math.floor(diff / 3600000)
  
  if (hours < 1) return 'Less than 1 hour ago'
  if (hours < 24) return `${hours} hours ago`
  return timestamp.toLocaleDateString()
}
</script>

<style scoped>
.agent-dashboard {
  min-height: 100vh;
  background: #f8fafc;
}

.dashboard-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.quick-actions {
  width: 100%;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  text-align: left;
}

.action-button.primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.action-button.secondary {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.action-button.tertiary {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.action-button.quaternary {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.action-icon {
  font-size: 20px;
}

.action-text {
  font-size: 14px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.main-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.card.large {
  grid-column: span 2;
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
}

.refresh-btn {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  background: #e2e8f0;
}

.insight-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.tab-button {
  padding: 8px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.customer-list,
.risk-list,
.opportunities-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.customer-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.customer-item:hover {
  background: #e2e8f0;
}

.customer-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

.customer-info {
  flex: 1;
}

.customer-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.customer-value {
  font-size: 14px;
  color: #64748b;
}

.ai-score {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.ai-score.high {
  background: #dcfce7;
  color: #16a34a;
}

.risk-item {
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid;
}

.risk-item.high {
  background: #fef2f2;
  border-left-color: #dc2626;
}

.risk-item.medium {
  background: #fef3c7;
  border-left-color: #d97706;
}

.risk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.risk-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.risk-badge.high {
  background: #dc2626;
  color: white;
}

.risk-badge.medium {
  background: #d97706;
  color: white;
}

.risk-factors {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 12px;
}

.risk-actions,
.opportunity-actions {
  display: flex;
  gap: 8px;
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

.btn-small.secondary {
  background: #f1f5f9;
  color: #374151;
  border: 1px solid #d1d5db;
}

.opportunity-item {
  padding: 16px;
  background: #f0f9ff;
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
}

.opportunity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.potential-value {
  font-weight: 700;
  color: #16a34a;
}

.opportunity-product {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.opportunity-reason {
  font-size: 12px;
  color: #64748b;
}

.pipeline-overview {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pipeline-stage {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.stage-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.stage-name {
  font-weight: 600;
  color: #1e293b;
}

.stage-count {
  font-size: 14px;
  color: #64748b;
}

.stage-value {
  font-size: 18px;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 8px;
}

.stage-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.stage-progress {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  transition: width 0.3s ease;
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e2e8f0;
  font-size: 14px;
}

.activity-title {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.activity-details {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 11px;
  color: #94a3b8;
}

.coaching-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.coaching-insights {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.insight-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f0f9ff;
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
}

.insight-icon {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.insight-title {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 6px;
}

.insight-message {
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
}

.coaching-actions {
  display: flex;
  gap: 12px;
}

.coaching-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: #3b82f6;
  color: white;
}

.coaching-btn.secondary {
  background: #f1f5f9;
  color: #374151;
  border: 1px solid #d1d5db;
}

.coaching-btn:hover {
  transform: translateY(-1px);
}

@media (max-width: 1200px) {
  .card.large {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 16px;
    gap: 24px;
  }
  
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .kpi-grid,
  .main-grid {
    grid-template-columns: 1fr;
  }
  
  .coaching-actions {
    flex-direction: column;
  }
}
</style>