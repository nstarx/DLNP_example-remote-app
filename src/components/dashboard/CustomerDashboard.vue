<template>
  <div class="customer-dashboard">
    <DashboardHeader 
      title="My Insurance Hub"
      :user="user"
      @logout="$emit('logout')"
    >
      <template #actions>
        <RoleSwitcher @switch-role="$emit('switch-role', $event)" />
        <NotificationCenter :notifications="notifications" />
      </template>
    </DashboardHeader>

    <div class="dashboard-content">
      <!-- Welcome Section with AI Personalization -->
      <section class="welcome-section">
        <div class="welcome-card">
          <div class="welcome-content">
            <div class="greeting">
              <h2>Good {{ getTimeOfDay() }}, {{ user?.name?.split(' ')[0] || 'Customer' }}! 👋</h2>
              <p class="greeting-subtitle">Here's your personalized insurance overview</p>
            </div>
            <div class="ai-summary">
              <div class="summary-icon">🤖</div>
              <div class="summary-content">
                <div class="summary-title">AI Insights for You</div>
                <div class="summary-message">{{ personalizedMessage }}</div>
              </div>
            </div>
          </div>
          <div class="welcome-actions">
            <button class="action-btn primary" @click="openChatbot">
              <span class="btn-icon">💬</span>
              Ask AI Assistant
            </button>
            <button class="action-btn secondary" @click="fileNewClaim">
              <span class="btn-icon">📋</span>
              File Claim
            </button>
          </div>
        </div>
      </section>

      <!-- Policy Overview Cards -->
      <section class="policies-section">
        <div class="section-header">
          <h3 class="section-title">Your Policies</h3>
          <button class="view-all-btn">View All</button>
        </div>
        <div class="policies-grid">
          <div 
            v-for="policy in customerPolicies" 
            :key="policy.id"
            class="policy-card"
            :class="policy.status"
          >
            <div class="policy-header">
              <div class="policy-icon">{{ policy.icon }}</div>
              <div class="policy-info">
                <div class="policy-type">{{ policy.type }}</div>
                <div class="policy-number">{{ policy.number }}</div>
              </div>
              <div class="policy-status" :class="policy.status">
                {{ policy.status }}
              </div>
            </div>
            
            <div class="policy-details">
              <div class="detail-row">
                <span class="detail-label">Coverage:</span>
                <span class="detail-value">${{ policy.coverage.toLocaleString() }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Premium:</span>
                <span class="detail-value">${{ policy.premium }}/{{ policy.term }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Renewal:</span>
                <span class="detail-value">{{ formatDate(policy.renewalDate) }}</span>
              </div>
            </div>
            
            <div v-if="policy.aiRecommendation" class="ai-recommendation">
              <div class="rec-header">
                <span class="rec-icon">💡</span>
                <span class="rec-title">AI Recommendation</span>
              </div>
              <div class="rec-message">{{ policy.aiRecommendation.message }}</div>
              <button class="rec-btn">{{ policy.aiRecommendation.action }}</button>
            </div>
            
            <div class="policy-actions">
              <button class="policy-btn primary">View Details</button>
              <button class="policy-btn secondary">Download</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content Grid -->
      <div class="main-content-grid">
        <!-- Claims History -->
        <div class="card">
          <div class="card-header">
            <h3>📋 Recent Claims</h3>
            <button class="header-btn" @click="viewAllClaims">View All</button>
          </div>
          <div class="claims-list">
            <div 
              v-for="claim in recentClaims" 
              :key="claim.id"
              class="claim-item"
              :class="claim.status"
            >
              <div class="claim-header">
                <div class="claim-info">
                  <div class="claim-type">{{ claim.type }}</div>
                  <div class="claim-number">{{ claim.number }}</div>
                </div>
                <div class="claim-status" :class="claim.status">
                  {{ claim.status }}
                </div>
              </div>
              <div class="claim-details">
                <div class="claim-amount">${{ claim.amount.toLocaleString() }}</div>
                <div class="claim-date">{{ formatDate(claim.date) }}</div>
              </div>
              <div class="claim-progress">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: claim.progress + '%' }"
                  ></div>
                </div>
                <div class="progress-text">{{ claim.progressText }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Information -->
        <div class="card">
          <div class="card-header">
            <h3>💳 Payment Center</h3>
          </div>
          <div class="payment-overview">
            <div class="payment-summary">
              <div class="summary-item">
                <div class="summary-label">Next Payment</div>
                <div class="summary-value">${{ nextPayment.amount }}</div>
                <div class="summary-date">Due {{ formatDate(nextPayment.dueDate) }}</div>
              </div>
              <div class="payment-actions">
                <button class="payment-btn primary">Pay Now</button>
                <button class="payment-btn secondary">Auto-Pay</button>
              </div>
            </div>
            
            <div class="payment-history">
              <h5>Recent Payments</h5>
              <div class="history-list">
                <div 
                  v-for="payment in paymentHistory" 
                  :key="payment.id"
                  class="history-item"
                >
                  <div class="payment-date">{{ formatDate(payment.date) }}</div>
                  <div class="payment-amount">${{ payment.amount }}</div>
                  <div class="payment-method">{{ payment.method }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Insurance Assistant Chat -->
        <div class="card large" v-if="showChatbot">
          <div class="card-header">
            <h3>🤖 AI Insurance Assistant</h3>
            <button @click="closeChatbot" class="close-chat-btn">×</button>
          </div>
          <div class="chatbot-container">
            <div class="chat-messages" ref="chatMessages">
              <div 
                v-for="message in chatHistory" 
                :key="message.id"
                class="chat-message"
                :class="message.sender"
              >
                <div class="message-avatar">
                  {{ message.sender === 'user' ? '👤' : '🤖' }}
                </div>
                <div class="message-content">
                  <div class="message-text">{{ message.text }}</div>
                  <div class="message-time">{{ formatTime(message.timestamp) }}</div>
                </div>
              </div>
              
              <div v-if="chatLoading" class="chat-message bot">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                  <div class="typing-indicator">
                    <div class="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="chat-input-area">
              <div class="quick-actions">
                <button 
                  v-for="action in quickActions" 
                  :key="action.text"
                  @click="sendQuickMessage(action.text)"
                  class="quick-action-btn"
                >
                  {{ action.icon }} {{ action.text }}
                </button>
              </div>
              <div class="chat-input-container">
                <input 
                  v-model="chatInput"
                  @keyup.enter="sendMessage"
                  placeholder="Ask about your policies, claims, or coverage..."
                  class="chat-input"
                />
                <button 
                  @click="sendMessage"
                  class="send-btn"
                  :disabled="!chatInput.trim() || chatLoading"
                >
                  <span v-if="chatLoading">⏳</span>
                  <span v-else>🚀</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Personalized Recommendations -->
        <div class="card">
          <div class="card-header">
            <h3>🎯 Personalized for You</h3>
          </div>
          <div class="recommendations-list">
            <div 
              v-for="rec in personalizedRecommendations" 
              :key="rec.id"
              class="recommendation-card"
              :class="rec.priority"
            >
              <div class="rec-icon">{{ rec.icon }}</div>
              <div class="rec-content">
                <div class="rec-title">{{ rec.title }}</div>
                <div class="rec-description">{{ rec.description }}</div>
                <div class="rec-benefit">{{ rec.benefit }}</div>
              </div>
              <div class="rec-actions">
                <button class="rec-action-btn primary">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import DashboardHeader from './common/DashboardHeader.vue'
import RoleSwitcher from './common/RoleSwitcher.vue'
import NotificationCenter from './common/NotificationCenter.vue'

const props = defineProps({
  user: Object
})

const emit = defineEmits(['logout', 'switch-role'])

// Reactive data
const showChatbot = ref(false)
const chatInput = ref('')
const chatLoading = ref(false)
const chatMessages = ref(null)

// Mock customer data
const customerPolicies = ref([
  {
    id: 'POL-AUTO-001',
    type: 'Auto Insurance',
    number: 'AU-2024-789456',
    icon: '🚗',
    status: 'active',
    coverage: 50000,
    premium: 156,
    term: 'month',
    renewalDate: new Date('2024-08-15'),
    aiRecommendation: {
      message: 'Based on your safe driving record, you may qualify for a 15% discount',
      action: 'Get Quote'
    }
  },
  {
    id: 'POL-HOME-001',
    type: 'Home Insurance',
    number: 'HM-2024-345678',
    icon: '🏠',
    status: 'active',
    coverage: 350000,
    premium: 234,
    term: 'month',
    renewalDate: new Date('2024-12-01'),
    aiRecommendation: null
  },
  {
    id: 'POL-LIFE-001',
    type: 'Life Insurance',
    number: 'LF-2024-123456',
    icon: '🛡️',
    status: 'pending',
    coverage: 500000,
    premium: 89,
    term: 'month',
    renewalDate: new Date('2025-01-15'),
    aiRecommendation: {
      message: 'Your application is being processed. Expected approval in 3-5 days',
      action: 'Track Status'
    }
  }
])

const recentClaims = ref([
  {
    id: 'CLM-001',
    type: 'Auto Accident',
    number: 'CL-2024-8901',
    status: 'approved',
    amount: 3200,
    date: new Date('2024-03-15'),
    progress: 100,
    progressText: 'Settled'
  },
  {
    id: 'CLM-002',
    type: 'Water Damage',
    number: 'CL-2024-8902',
    status: 'processing',
    amount: 5800,
    date: new Date('2024-03-28'),
    progress: 65,
    progressText: 'Under Review'
  }
])

const nextPayment = ref({
  amount: 479,
  dueDate: new Date('2024-04-15')
})

const paymentHistory = ref([
  {
    id: 1,
    date: new Date('2024-03-15'),
    amount: 479,
    method: 'Auto-Pay'
  },
  {
    id: 2,
    date: new Date('2024-02-15'),
    amount: 479,
    method: 'Credit Card'
  },
  {
    id: 3,
    date: new Date('2024-01-15'),
    amount: 479,
    method: 'Bank Transfer'
  }
])

const chatHistory = ref([
  {
    id: 1,
    sender: 'bot',
    text: 'Hello! I\'m your AI insurance assistant. I can help you with policy questions, claims status, coverage recommendations, and more. How can I assist you today?',
    timestamp: new Date()
  }
])

const quickActions = [
  { icon: '📋', text: 'Check claim status' },
  { icon: '💰', text: 'Payment options' },
  { icon: '📑', text: 'Policy details' },
  { icon: '🛡️', text: 'Coverage gaps' }
]

const personalizedRecommendations = ref([
  {
    id: 1,
    icon: '☂️',
    title: 'Umbrella Policy',
    description: 'Enhanced liability protection for your growing assets',
    benefit: 'Save up to $200/year with bundling',
    priority: 'high'
  },
  {
    id: 2,
    icon: '🏥',
    title: 'Health Insurance',
    description: 'Comprehensive health coverage with preferred rates',
    benefit: 'Family plans starting at $285/month',
    priority: 'medium'
  },
  {
    id: 3,
    icon: '📱',
    title: 'Digital Security',
    description: 'Protect against identity theft and cyber threats',
    benefit: 'Free for existing customers',
    priority: 'low'
  }
])

const notifications = ref([
  {
    id: 1,
    type: 'success',
    title: 'Claim approved',
    message: 'Your auto accident claim has been approved',
    timestamp: new Date(),
    read: false
  },
  {
    id: 2,
    type: 'info',
    title: 'Payment reminder',
    message: 'Next payment due in 3 days',
    timestamp: new Date(),
    read: false
  }
])

// Computed properties
const personalizedMessage = computed(() => {
  const messages = [
    'Your claim for water damage is 65% complete and progressing well.',
    'You could save $180/year by bundling your auto and home policies.',
    'Based on your payment history, you qualify for our loyalty discount.',
    'Your safe driving record has improved your risk profile significantly.'
  ]
  return messages[Math.floor(Math.random() * messages.length)]
})

// Methods
const getTimeOfDay = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const openChatbot = () => {
  showChatbot.value = true
  nextTick(() => {
    if (chatMessages.value) {
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight
    }
  })
}

const closeChatbot = () => {
  showChatbot.value = false
}

const fileNewClaim = () => {
  console.log('Opening claim filing process...')
}

const viewAllClaims = () => {
  console.log('Viewing all claims...')
}

const sendQuickMessage = (message) => {
  chatInput.value = message
  sendMessage()
}

const sendMessage = async () => {
  if (!chatInput.value.trim() || chatLoading.value) return
  
  const userMessage = {
    id: Date.now(),
    sender: 'user',
    text: chatInput.value,
    timestamp: new Date()
  }
  
  chatHistory.value.push(userMessage)
  chatInput.value = ''
  chatLoading.value = true
  
  // Scroll to bottom
  nextTick(() => {
    if (chatMessages.value) {
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight
    }
  })
  
  // Simulate AI response
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const responses = [
    'Your auto insurance policy AU-2024-789456 has excellent coverage with a $500 deductible. Your next renewal is on August 15th, 2024.',
    'I can see your water damage claim CL-2024-8902 is currently under review. The adjuster has completed the initial assessment and we expect a decision within 5-7 business days.',
    'Based on your payment history and safe driving record, you qualify for several discounts. Would you like me to review potential savings opportunities?',
    'Your current coverage looks comprehensive! However, I notice you might benefit from an umbrella policy given your asset profile. This could provide additional liability protection.',
    'I\'d be happy to help you with that! Let me pull up your policy details and walk you through the options available to you.',
    'Great question! Your policy includes comprehensive coverage for situations like this. Let me explain how the claims process works and what you can expect.'
  ]
  
  const botMessage = {
    id: Date.now() + 1,
    sender: 'bot',
    text: responses[Math.floor(Math.random() * responses.length)],
    timestamp: new Date()
  }
  
  chatHistory.value.push(botMessage)
  chatLoading.value = false
  
  // Scroll to bottom
  nextTick(() => {
    if (chatMessages.value) {
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight
    }
  })
}
</script>

<style scoped>
.customer-dashboard {
  min-height: 100vh;
  background: #f8fafc;
}

.dashboard-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.welcome-section {
  width: 100%;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 32px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
}

.welcome-content {
  flex: 1;
}

.greeting h2 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.greeting-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0 0 24px 0;
}

.ai-summary {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.summary-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.summary-title {
  font-weight: 600;
  margin-bottom: 6px;
}

.summary-message {
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.5;
}

.welcome-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 160px;
}

.action-btn.primary {
  background: white;
  color: #667eea;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-icon {
  font-size: 16px;
}

.policies-section {
  width: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.view-all-btn {
  background: none;
  border: none;
  color: #3b82f6;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
}

.view-all-btn:hover {
  text-decoration: underline;
}

.policies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.policy-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.policy-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.policy-card.active {
  border-color: #16a34a;
}

.policy-card.pending {
  border-color: #d97706;
}

.policy-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.policy-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.policy-info {
  flex: 1;
}

.policy-type {
  font-weight: 700;
  color: #1e293b;
  font-size: 16px;
  margin-bottom: 4px;
}

.policy-number {
  font-size: 12px;
  color: #64748b;
  font-family: monospace;
}

.policy-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.policy-status.active {
  background: #dcfce7;
  color: #16a34a;
}

.policy-status.pending {
  background: #fef3c7;
  color: #d97706;
}

.policy-details {
  margin-bottom: 20px;
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

.ai-recommendation {
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.rec-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-weight: 600;
  color: #0c4a6e;
  font-size: 14px;
}

.rec-message {
  font-size: 13px;
  color: #075985;
  line-height: 1.4;
  margin-bottom: 12px;
}

.rec-btn {
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rec-btn:hover {
  background: #0284c7;
}

.policy-actions {
  display: flex;
  gap: 8px;
}

.policy-btn {
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 14px;
}

.policy-btn.primary {
  background: #3b82f6;
  color: white;
}

.policy-btn.primary:hover {
  background: #2563eb;
}

.policy-btn.secondary {
  background: #f1f5f9;
  color: #374151;
  border: 1px solid #d1d5db;
}

.policy-btn.secondary:hover {
  background: #e2e8f0;
}

.main-content-grid {
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

.header-btn,
.close-chat-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.close-chat-btn {
  font-size: 24px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.close-chat-btn:hover {
  background: #f1f5f9;
}

.claims-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.claim-item {
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid;
}

.claim-item.approved {
  border-left-color: #16a34a;
}

.claim-item.processing {
  border-left-color: #d97706;
}

.claim-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.claim-type {
  font-weight: 600;
  color: #1e293b;
}

.claim-number {
  font-size: 12px;
  color: #64748b;
  font-family: monospace;
}

.claim-status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.claim-status.approved {
  background: #dcfce7;
  color: #16a34a;
}

.claim-status.processing {
  background: #fef3c7;
  color: #d97706;
}

.claim-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.claim-amount {
  font-weight: 700;
  color: #1e293b;
  font-size: 18px;
}

.claim-date {
  color: #64748b;
  font-size: 14px;
}

.claim-progress {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.progress-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #16a34a);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #64748b;
  text-align: right;
}

.payment-overview {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.payment-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f0f9ff;
  border-radius: 12px;
  border: 1px solid #0ea5e9;
}

.summary-label {
  color: #075985;
  font-size: 14px;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 24px;
  font-weight: 700;
  color: #0c4a6e;
  margin-bottom: 4px;
}

.summary-date {
  color: #0369a1;
  font-size: 12px;
}

.payment-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.payment-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.payment-btn.primary {
  background: #0ea5e9;
  color: white;
}

.payment-btn.primary:hover {
  background: #0284c7;
}

.payment-btn.secondary {
  background: white;
  color: #0369a1;
  border: 1px solid #0ea5e9;
}

.payment-btn.secondary:hover {
  background: #f0f9ff;
}

.payment-history h5 {
  margin: 0 0 12px 0;
  color: #374151;
  font-size: 14px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 12px;
}

.payment-date {
  color: #64748b;
}

.payment-amount {
  font-weight: 600;
  color: #1e293b;
}

.payment-method {
  color: #64748b;
}

.chatbot-container {
  display: flex;
  flex-direction: column;
  height: 500px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chat-message {
  display: flex;
  gap: 12px;
  max-width: 80%;
}

.chat-message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.chat-message.user .message-avatar {
  background: #3b82f6;
  color: white;
}

.chat-message.bot .message-avatar {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
}

.message-content {
  flex: 1;
}

.message-text {
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.5;
  font-size: 14px;
}

.chat-message.user .message-text {
  background: #3b82f6;
  color: white;
  border-bottom-right-radius: 4px;
}

.chat-message.bot .message-text {
  background: #f8fafc;
  color: #374151;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 4px;
  text-align: right;
}

.chat-message.user .message-time {
  text-align: left;
}

.typing-indicator {
  padding: 12px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  border-bottom-left-radius: 4px;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  background: #94a3b8;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

.chat-input-area {
  border-top: 1px solid #e2e8f0;
  padding-top: 16px;
}

.quick-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.quick-action-btn {
  padding: 6px 12px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #374151;
}

.quick-action-btn:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

.chat-input-container {
  display: flex;
  gap: 8px;
}

.chat-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 24px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.chat-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.chat-input::placeholder {
  color: #94a3b8;
  font-style: italic;
}

.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recommendation-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid;
}

.recommendation-card.high {
  border-left-color: #dc2626;
  background: #fef2f2;
}

.recommendation-card.medium {
  border-left-color: #d97706;
  background: #fef3c7;
}

.recommendation-card.low {
  border-left-color: #16a34a;
  background: #f0fdf4;
}

.rec-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.rec-content {
  flex: 1;
}

.rec-title {
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
  font-size: 16px;
}

.rec-description {
  color: #64748b;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 4px;
}

.rec-benefit {
  color: #16a34a;
  font-size: 13px;
  font-weight: 600;
}

.rec-actions {
  flex-shrink: 0;
}

.rec-action-btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rec-action-btn:hover {
  background: #2563eb;
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
  
  .welcome-card {
    flex-direction: column;
    gap: 24px;
    padding: 24px;
  }
  
  .welcome-actions {
    width: 100%;
    flex-direction: row;
    gap: 12px;
  }
  
  .action-btn {
    flex: 1;
    min-width: auto;
  }
  
  .policies-grid,
  .main-content-grid {
    grid-template-columns: 1fr;
  }
  
  .payment-summary {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
    text-align: center;
  }
  
  .payment-actions {
    flex-direction: row;
    gap: 12px;
  }
  
  .chatbot-container {
    height: 400px;
  }
  
  .chat-message {
    max-width: 90%;
  }
  
  .quick-actions {
    gap: 6px;
  }
  
  .quick-action-btn {
    font-size: 11px;
    padding: 5px 8px;
  }
}
</style>