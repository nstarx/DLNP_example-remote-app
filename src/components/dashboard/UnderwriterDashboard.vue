<template>
  <div class="underwriter-dashboard">
    <DashboardHeader 
      title="Underwriter AI Workbench"
      :user="user"
      @logout="$emit('logout')"
    >
      <template #actions>
        <RoleSwitcher @switch-role="$emit('switch-role', $event)" />
        <NotificationCenter :notifications="notifications" />
      </template>
    </DashboardHeader>

    <div class="dashboard-content">
      <!-- AI Risk Assessment Queue -->
      <section class="risk-queue-section">
        <div class="section-header">
          <h2 class="section-title">🤖 AI-Powered Risk Assessment Queue</h2>
          <div class="queue-stats">
            <span class="stat-item">{{ pendingApplications.length }} Pending</span>
            <span class="stat-item">{{ highRiskCount }} High Risk</span>
            <span class="stat-item">{{ autoApprovedToday }} Auto-Approved Today</span>
          </div>
        </div>
        
        <div class="risk-queue">
          <div 
            v-for="application in pendingApplications" 
            :key="application.id"
            class="application-card"
            :class="application.riskLevel"
            @click="selectApplication(application)"
          >
            <div class="application-header">
              <div class="applicant-info">
                <div class="applicant-name">{{ application.applicantName }}</div>
                <div class="application-type">{{ application.policyType }}</div>
              </div>
              <div class="risk-indicator">
                <div class="ai-score" :class="application.riskLevel">
                  {{ application.aiRiskScore }}
                </div>
                <div class="confidence-bar">
                  <div 
                    class="confidence-fill" 
                    :style="{ width: application.confidence + '%' }"
                  ></div>
                </div>
              </div>
            </div>
            
            <div class="application-details">
              <div class="detail-row">
                <span class="detail-label">Coverage Amount:</span>
                <span class="detail-value">${{ application.coverageAmount.toLocaleString() }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Premium:</span>
                <span class="detail-value">${{ application.premium.toLocaleString() }}/year</span>
              </div>
            </div>
            
            <div class="ai-flags" v-if="application.aiFlags.length > 0">
              <div class="flags-header">🚩 AI Flags:</div>
              <div class="flags-list">
                <span 
                  v-for="flag in application.aiFlags" 
                  :key="flag"
                  class="flag-item"
                  :class="getFlagSeverity(flag)"
                >
                  {{ flag }}
                </span>
              </div>
            </div>
            
            <div class="application-actions">
              <button class="action-btn approve" @click.stop="quickApprove(application)">
                ✅ Approve
              </button>
              <button class="action-btn review" @click.stop="reviewApplication(application)">
                🔍 Deep Review
              </button>
              <button class="action-btn decline" @click.stop="declineApplication(application)">
                ❌ Decline
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- AI Insights and Analytics -->
      <div class="insights-grid">
        <!-- Risk Distribution Chart -->
        <div class="card">
          <div class="card-header">
            <h3>📊 Risk Distribution</h3>
          </div>
          <div class="risk-distribution">
            <div class="distribution-chart">
              <div 
                v-for="risk in riskDistribution" 
                :key="risk.level"
                class="risk-segment"
                :class="risk.level"
                :style="{ width: risk.percentage + '%' }"
                :title="`${risk.level}: ${risk.count} applications`"
              >
                <span class="segment-label">{{ risk.count }}</span>
              </div>
            </div>
            <div class="distribution-legend">
              <div v-for="risk in riskDistribution" :key="risk.level" class="legend-item">
                <div class="legend-color" :class="risk.level"></div>
                <span class="legend-label">{{ risk.level }} ({{ risk.percentage }}%)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Model Performance -->
        <div class="card">
          <div class="card-header">
            <h3>🧠 AI Model Performance</h3>
          </div>
          <div class="model-metrics">
            <div class="metric-item">
              <div class="metric-label">Accuracy</div>
              <div class="metric-value">94.2%</div>
              <div class="metric-trend up">+2.1%</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">Precision</div>
              <div class="metric-value">91.8%</div>
              <div class="metric-trend up">+1.3%</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">Recall</div>
              <div class="metric-value">88.9%</div>
              <div class="metric-trend stable">+0.2%</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">Processing Time</div>
              <div class="metric-value">1.2s</div>
              <div class="metric-trend down">-0.3s</div>
            </div>
          </div>
        </div>

        <!-- Claims Prediction -->
        <div class="card">
          <div class="card-header">
            <h3>🔮 Claims Prediction</h3>
          </div>
          <div class="claims-predictions">
            <div class="prediction-item">
              <div class="prediction-header">
                <span class="prediction-type">Auto Claims Surge</span>
                <span class="prediction-probability high">High (85%)</span>
              </div>
              <div class="prediction-details">
                Expected 23% increase in Northeast region next week due to weather patterns
              </div>
            </div>
            <div class="prediction-item">
              <div class="prediction-header">
                <span class="prediction-type">Fraud Pattern</span>
                <span class="prediction-probability medium">Medium (67%)</span>
              </div>
              <div class="prediction-details">
                Suspicious activity detected in commercial property segment
              </div>
            </div>
            <div class="prediction-item">
              <div class="prediction-header">
                <span class="prediction-type">Rate Optimization</span>
                <span class="prediction-probability low">Low (34%)</span>
              </div>
              <div class="prediction-details">
                Current pricing models performing within expected parameters
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Application Review Modal -->
      <div v-if="selectedApplication" class="application-modal" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>🔍 Detailed Risk Assessment</h3>
            <button @click="closeModal" class="close-btn">×</button>
          </div>
          
          <div class="modal-body">
            <div class="applicant-summary">
              <div class="summary-left">
                <h4>{{ selectedApplication.applicantName }}</h4>
                <p class="application-id">Application #{{ selectedApplication.id }}</p>
                <p class="policy-details">{{ selectedApplication.policyType }} - ${{ selectedApplication.coverageAmount.toLocaleString() }}</p>
              </div>
              <div class="summary-right">
                <div class="overall-score" :class="selectedApplication.riskLevel">
                  <div class="score-value">{{ selectedApplication.aiRiskScore }}</div>
                  <div class="score-label">AI Risk Score</div>
                </div>
              </div>
            </div>
            
            <div class="risk-factors">
              <h5>🎯 Risk Factor Analysis</h5>
              <div class="factors-grid">
                <div 
                  v-for="factor in selectedApplication.riskFactors" 
                  :key="factor.category"
                  class="factor-item"
                >
                  <div class="factor-header">
                    <span class="factor-name">{{ factor.category }}</span>
                    <span class="factor-score" :class="factor.impact">{{ factor.score }}</span>
                  </div>
                  <div class="factor-details">
                    <div class="factor-bar">
                      <div 
                        class="factor-fill" 
                        :class="factor.impact"
                        :style="{ width: factor.score + '%' }"
                      ></div>
                    </div>
                    <div class="factor-explanation">{{ factor.explanation }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="ai-recommendations">
              <h5>💡 AI Recommendations</h5>
              <div class="recommendations-list">
                <div 
                  v-for="rec in selectedApplication.recommendations" 
                  :key="rec.type"
                  class="recommendation-item"
                  :class="rec.priority"
                >
                  <div class="rec-icon">{{ getRecommendationIcon(rec.type) }}</div>
                  <div class="rec-content">
                    <div class="rec-title">{{ rec.title }}</div>
                    <div class="rec-description">{{ rec.description }}</div>
                  </div>
                  <div class="rec-action">
                    <button class="rec-btn">Apply</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="btn-large approve" @click="approveApplication">
              ✅ Approve Application
            </button>
            <button class="btn-large conditional" @click="conditionalApproval">
              ⚠️ Conditional Approval
            </button>
            <button class="btn-large decline" @click="declineApplicationFinal">
              ❌ Decline Application
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAI } from '@/composables/useAI'
import DashboardHeader from './common/DashboardHeader.vue'
import RoleSwitcher from './common/RoleSwitcher.vue'
import NotificationCenter from './common/NotificationCenter.vue'

const props = defineProps({
  user: Object
})

const emit = defineEmits(['logout', 'switch-role'])

const { calculateRiskScore } = useAI()
const selectedApplication = ref(null)

// Mock pending applications with AI risk assessments
const pendingApplications = ref([
  {
    id: 'APP-2024-001',
    applicantName: 'Jennifer Martinez',
    policyType: 'Auto Insurance',
    coverageAmount: 50000,
    premium: 1200,
    aiRiskScore: 340,
    riskLevel: 'low',
    confidence: 92,
    aiFlags: [],
    riskFactors: [
      {
        category: 'Driving History',
        score: 85,
        impact: 'positive',
        explanation: 'Clean driving record for 8 years'
      },
      {
        category: 'Credit Score',
        score: 78,
        impact: 'positive',
        explanation: 'Above average credit score (745)'
      },
      {
        category: 'Location Risk',
        score: 65,
        impact: 'neutral',
        explanation: 'Moderate risk area with average claim frequency'
      }
    ],
    recommendations: [
      {
        type: 'discount',
        priority: 'high',
        title: 'Safe Driver Discount',
        description: 'Apply 15% discount for excellent driving record'
      }
    ]
  },
  {
    id: 'APP-2024-002',
    applicantName: 'Robert Thompson',
    policyType: 'Home Insurance',
    coverageAmount: 350000,
    premium: 2400,
    aiRiskScore: 285,
    riskLevel: 'high',
    confidence: 87,
    aiFlags: ['Previous Claims', 'High-Risk Location'],
    riskFactors: [
      {
        category: 'Property Age',
        score: 45,
        impact: 'negative',
        explanation: 'Property built in 1970, older construction materials'
      },
      {
        category: 'Location Risk',
        score: 35,
        impact: 'negative',
        explanation: 'High flood risk area with recent weather events'
      },
      {
        category: 'Claim History',
        score: 40,
        impact: 'negative',
        explanation: 'Two water damage claims in past 5 years'
      }
    ],
    recommendations: [
      {
        type: 'inspection',
        priority: 'high',
        title: 'Property Inspection Required',
        description: 'Schedule inspection to assess current property condition'
      },
      {
        type: 'premium_adjustment',
        priority: 'medium',
        title: 'Premium Adjustment',
        description: 'Consider 20% premium increase due to risk factors'
      }
    ]
  },
  {
    id: 'APP-2024-003',
    applicantName: 'Sarah Kim',
    policyType: 'Life Insurance',
    coverageAmount: 500000,
    premium: 1800,
    aiRiskScore: 320,
    riskLevel: 'medium',
    confidence: 89,
    aiFlags: ['Medical History'],
    riskFactors: [
      {
        category: 'Age',
        score: 70,
        impact: 'neutral',
        explanation: '45 years old, within standard risk parameters'
      },
      {
        category: 'Health Score',
        score: 60,
        impact: 'neutral',
        explanation: 'Minor health concerns, regular medical monitoring'
      },
      {
        category: 'Lifestyle',
        score: 80,
        impact: 'positive',
        explanation: 'Non-smoker, active lifestyle, good health habits'
      }
    ],
    recommendations: [
      {
        type: 'medical_exam',
        priority: 'medium',
        title: 'Medical Examination',
        description: 'Require updated medical examination for current health status'
      }
    ]
  }
])

// Computed properties
const highRiskCount = computed(() => 
  pendingApplications.value.filter(app => app.riskLevel === 'high').length
)

const autoApprovedToday = computed(() => 23) // Mock value

const riskDistribution = computed(() => {
  const total = pendingApplications.value.length
  const low = pendingApplications.value.filter(app => app.riskLevel === 'low').length
  const medium = pendingApplications.value.filter(app => app.riskLevel === 'medium').length
  const high = pendingApplications.value.filter(app => app.riskLevel === 'high').length
  
  return [
    { level: 'low', count: low, percentage: Math.round((low / total) * 100) },
    { level: 'medium', count: medium, percentage: Math.round((medium / total) * 100) },
    { level: 'high', count: high, percentage: Math.round((high / total) * 100) }
  ]
})

// Notifications
const notifications = ref([
  {
    id: 1,
    type: 'warning',
    title: 'High-risk application flagged',
    message: 'Robert Thompson - Multiple risk factors detected',
    timestamp: new Date(),
    read: false
  },
  {
    id: 2,
    type: 'info',
    title: 'AI model updated',
    message: 'Risk assessment accuracy improved to 94.2%',
    timestamp: new Date(),
    read: false
  }
])

// Methods
const selectApplication = (application) => {
  selectedApplication.value = application
}

const closeModal = () => {
  selectedApplication.value = null
}

const quickApprove = async (application) => {
  console.log('Quick approving:', application.applicantName)
  // Remove from pending list
  const index = pendingApplications.value.findIndex(app => app.id === application.id)
  if (index > -1) {
    pendingApplications.value.splice(index, 1)
  }
}

const reviewApplication = (application) => {
  selectApplication(application)
}

const declineApplication = (application) => {
  console.log('Declining:', application.applicantName)
  const index = pendingApplications.value.findIndex(app => app.id === application.id)
  if (index > -1) {
    pendingApplications.value.splice(index, 1)
  }
}

const getFlagSeverity = (flag) => {
  const severityMap = {
    'Previous Claims': 'high',
    'High-Risk Location': 'high',
    'Medical History': 'medium',
    'Credit Issues': 'medium',
    'Age Factor': 'low'
  }
  return severityMap[flag] || 'medium'
}

const getRecommendationIcon = (type) => {
  const icons = {
    discount: '💰',
    inspection: '🔍',
    premium_adjustment: '📊',
    medical_exam: '🏥',
    additional_coverage: '🛡️'
  }
  return icons[type] || '💡'
}

const approveApplication = () => {
  if (selectedApplication.value) {
    quickApprove(selectedApplication.value)
    closeModal()
  }
}

const conditionalApproval = () => {
  console.log('Conditional approval for:', selectedApplication.value?.applicantName)
  closeModal()
}

const declineApplicationFinal = () => {
  if (selectedApplication.value) {
    declineApplication(selectedApplication.value)
    closeModal()
  }
}
</script>

<style scoped>
.underwriter-dashboard {
  min-height: 100vh;
  background: #f8fafc;
}

.dashboard-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.queue-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  padding: 8px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.risk-queue {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.application-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.application-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.application-card.low {
  border-left: 4px solid #16a34a;
}

.application-card.medium {
  border-left: 4px solid #d97706;
}

.application-card.high {
  border-left: 4px solid #dc2626;
}

.application-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.applicant-name {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.application-type {
  font-size: 14px;
  color: #64748b;
}

.risk-indicator {
  text-align: right;
}

.ai-score {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 4px;
}

.ai-score.low {
  color: #16a34a;
}

.ai-score.medium {
  color: #d97706;
}

.ai-score.high {
  color: #dc2626;
}

.confidence-bar {
  width: 80px;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
  margin-left: auto;
}

.confidence-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.application-details {
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.detail-label {
  color: #64748b;
}

.detail-value {
  font-weight: 600;
  color: #1e293b;
}

.ai-flags {
  margin-bottom: 16px;
}

.flags-header {
  font-size: 12px;
  font-weight: 600;
  color: #dc2626;
  margin-bottom: 8px;
}

.flags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.flag-item {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.flag-item.high {
  background: #fef2f2;
  color: #dc2626;
}

.flag-item.medium {
  background: #fef3c7;
  color: #d97706;
}

.flag-item.low {
  background: #f0fdf4;
  color: #16a34a;
}

.application-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.approve {
  background: #dcfce7;
  color: #16a34a;
}

.action-btn.approve:hover {
  background: #bbf7d0;
}

.action-btn.review {
  background: #dbeafe;
  color: #2563eb;
}

.action-btn.review:hover {
  background: #bfdbfe;
}

.action-btn.decline {
  background: #fef2f2;
  color: #dc2626;
}

.action-btn.decline:hover {
  background: #fecaca;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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
}

.risk-distribution {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.distribution-chart {
  display: flex;
  height: 40px;
  border-radius: 20px;
  overflow: hidden;
  background: #f1f5f9;
}

.risk-segment {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.risk-segment.low {
  background: #16a34a;
}

.risk-segment.medium {
  background: #d97706;
}

.risk-segment.high {
  background: #dc2626;
}

.distribution-legend {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.low {
  background: #16a34a;
}

.legend-color.medium {
  background: #d97706;
}

.legend-color.high {
  background: #dc2626;
}

.model-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.metric-item {
  text-align: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
}

.metric-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
  text-transform: uppercase;
  font-weight: 600;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.metric-trend {
  font-size: 12px;
  font-weight: 600;
}

.metric-trend.up {
  color: #16a34a;
}

.metric-trend.down {
  color: #dc2626;
}

.metric-trend.stable {
  color: #64748b;
}

.claims-predictions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.prediction-item {
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
}

.prediction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.prediction-type {
  font-weight: 600;
  color: #1e293b;
}

.prediction-probability {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.prediction-probability.high {
  background: #fef2f2;
  color: #dc2626;
}

.prediction-probability.medium {
  background: #fef3c7;
  color: #d97706;
}

.prediction-probability.low {
  background: #f0fdf4;
  color: #16a34a;
}

.prediction-details {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
}

.application-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 75px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  margin-bottom: 24px;
}

.modal-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 20px;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #64748b;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #374151;
}

.modal-body {
  padding: 0 24px;
}

.applicant-summary {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 24px;
}

.applicant-summary h4 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #1e293b;
}

.application-id {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
}

.policy-details {
  margin: 0;
  font-weight: 600;
  color: #374151;
}

.overall-score {
  text-align: center;
}

.score-value {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 4px;
}

.score-label {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
}

.risk-factors,
.ai-recommendations {
  margin-bottom: 24px;
}

.risk-factors h5,
.ai-recommendations h5 {
  margin: 0 0 16px 0;
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
}

.factors-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.factor-item {
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
}

.factor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.factor-name {
  font-weight: 600;
  color: #1e293b;
}

.factor-score {
  font-weight: 700;
  font-size: 18px;
}

.factor-score.positive {
  color: #16a34a;
}

.factor-score.negative {
  color: #dc2626;
}

.factor-score.neutral {
  color: #d97706;
}

.factor-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.factor-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.factor-fill.positive {
  background: #16a34a;
}

.factor-fill.negative {
  background: #dc2626;
}

.factor-fill.neutral {
  background: #d97706;
}

.factor-explanation {
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recommendation-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid;
}

.recommendation-item.high {
  background: #fef2f2;
  border-left-color: #dc2626;
}

.recommendation-item.medium {
  background: #fef3c7;
  border-left-color: #d97706;
}

.recommendation-item.low {
  background: #f0fdf4;
  border-left-color: #16a34a;
}

.rec-icon {
  font-size: 20px;
  width: 40px;
  text-align: center;
}

.rec-content {
  flex: 1;
}

.rec-title {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.rec-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.4;
}

.rec-btn {
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rec-btn:hover {
  background: #2563eb;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e2e8f0;
}

.btn-large {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-large.approve {
  background: #dcfce7;
  color: #16a34a;
}

.btn-large.approve:hover {
  background: #bbf7d0;
}

.btn-large.conditional {
  background: #fef3c7;
  color: #d97706;
}

.btn-large.conditional:hover {
  background: #fed7aa;
}

.btn-large.decline {
  background: #fef2f2;
  color: #dc2626;
}

.btn-large.decline:hover {
  background: #fecaca;
}

@media (max-width: 1200px) {
  .risk-queue {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 16px;
    gap: 24px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .queue-stats {
    justify-content: space-between;
    gap: 8px;
  }
  
  .stat-item {
    flex: 1;
    text-align: center;
    padding: 6px 8px;
    font-size: 12px;
  }
  
  .risk-queue {
    grid-template-columns: 1fr;
  }
  
  .insights-grid {
    grid-template-columns: 1fr;
  }
  
  .model-metrics {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    margin: 20px;
    max-height: calc(100vh - 40px);
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .applicant-summary {
    flex-direction: column;
    gap: 16px;
  }
}
</style>