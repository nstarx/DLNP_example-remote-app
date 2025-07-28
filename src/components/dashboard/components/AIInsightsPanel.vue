<template>
  <div class="ai-insights-panel">
    <div class="panel-header">
      <div class="header-left">
        <h2 class="panel-title">🤖 AI Intelligence Hub</h2>
        <div class="panel-subtitle">Real-time insights powered by machine learning</div>
      </div>
      <div class="header-actions">
        <button @click="$emit('refresh')" class="refresh-btn" :disabled="loading">
          <span class="refresh-icon" :class="{ spinning: loading }">🔄</span>
          Refresh
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <div class="loading-text">AI is analyzing your data...</div>
    </div>

    <div v-else-if="insights.length === 0" class="empty-state">
      <div class="empty-icon">🔍</div>
      <div class="empty-text">No insights available</div>
      <div class="empty-subtitle">AI will generate insights as data becomes available</div>
    </div>

    <div v-else class="insights-grid">
      <div 
        v-for="insight in insights" 
        :key="insight.type + insight.title"
        class="insight-card"
        :class="insight.priority"
      >
        <div class="insight-header">
          <div class="insight-icon" :class="insight.type">
            {{ getInsightIcon(insight.type) }}
          </div>
          <div class="insight-meta">
            <div class="insight-title">{{ insight.title }}</div>
            <div class="insight-timestamp">{{ formatTimestamp(insight.timestamp) }}</div>
          </div>
          <div class="priority-badge" :class="insight.priority">
            {{ insight.priority.toUpperCase() }}
          </div>
        </div>
        
        <div class="insight-content">
          <div class="insight-message">{{ insight.message }}</div>
          
          <div v-if="insight.actionable" class="insight-actions">
            <button class="action-btn primary">Take Action</button>
            <button class="action-btn secondary">Learn More</button>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Chat Interface -->
    <div class="ai-chat-section">
      <div class="chat-header">
        <span class="chat-icon">💬</span>
        <span class="chat-title">Ask AI Assistant</span>
      </div>
      <div class="chat-input-container">
        <input 
          v-model="chatMessage"
          @keyup.enter="sendChatMessage"
          placeholder="Ask about fraud patterns, compliance issues, or risk insights..."
          class="chat-input"
        />
        <button 
          @click="sendChatMessage" 
          class="send-btn"
          :disabled="!chatMessage.trim() || chatLoading"
        >
          <span v-if="chatLoading" class="loading-dots">⋯</span>
          <span v-else>🚀</span>
        </button>
      </div>
      
      <div v-if="chatResponse" class="chat-response">
        <div class="response-header">
          <span class="ai-icon">🤖</span>
          <span class="ai-name">Vertafore AI Assistant</span>
        </div>
        <div class="response-content">{{ chatResponse }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  insights: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['refresh'])

const chatMessage = ref('')
const chatResponse = ref('')
const chatLoading = ref(false)

const getInsightIcon = (type) => {
  const icons = {
    trend: '📈',
    opportunity: '💡',
    risk: '⚠️',
    alert: '🚨',
    recommendation: '🎯'
  }
  return icons[type] || '💡'
}

const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const sendChatMessage = async () => {
  if (!chatMessage.value.trim()) return
  
  chatLoading.value = true
  
  // Mock AI response
  const responses = [
    "Based on current data patterns, I've identified a 23% increase in auto claims in the Northeast region. This spike correlates with recent weather events and suggests potential claims processing bottlenecks.",
    "Our fraud detection models show elevated risk scores for commercial property claims filed between 2-4 AM. I recommend implementing additional verification steps for these time-sensitive submissions.",
    "Customer churn prediction indicates 340 high-risk customers. The primary factors are decreased engagement and payment delays. I suggest proactive retention campaigns targeting these segments.",
    "Compliance analysis reveals missing documentation in 12% of new policies. The primary gap is in disclosure forms for California residents. Immediate action recommended to avoid regulatory issues."
  ]
  
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  chatResponse.value = responses[Math.floor(Math.random() * responses.length)]
  chatMessage.value = ''
  chatLoading.value = false
}
</script>

<style scoped>
.ai-insights-panel {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 24px;
}

.panel-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-subtitle {
  color: #64748b;
  font-size: 14px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-icon {
  transition: transform 0.5s ease;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  color: #64748b;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  font-size: 16px;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.empty-subtitle {
  font-size: 14px;
}

.insights-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
}

.insight-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
  border-left: 4px solid;
}

.insight-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.insight-card.high {
  border-left-color: #dc2626;
  background: #fefefe;
}

.insight-card.medium {
  border-left-color: #d97706;
  background: #fefefe;
}

.insight-card.low {
  border-left-color: #16a34a;
  background: #fefefe;
}

.insight-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.insight-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
}

.insight-meta {
  flex: 1;
}

.insight-title {
  font-weight: 600;
  color: #1e293b;
  font-size: 16px;
  margin-bottom: 2px;
}

.insight-timestamp {
  font-size: 12px;
  color: #94a3b8;
}

.priority-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.priority-badge.high {
  background: #fef2f2;
  color: #dc2626;
}

.priority-badge.medium {
  background: #fef3c7;
  color: #d97706;
}

.priority-badge.low {
  background: #f0fdf4;
  color: #16a34a;
}

.insight-message {
  color: #374151;
  line-height: 1.6;
  margin-bottom: 16px;
}

.insight-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
}

.action-btn.primary:hover {
  background: #2563eb;
}

.action-btn.secondary {
  background: #f1f5f9;
  color: #374151;
  border: 1px solid #d1d5db;
}

.action-btn.secondary:hover {
  background: #e2e8f0;
}

.ai-chat-section {
  border-top: 1px solid #e2e8f0;
  padding-top: 24px;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #374151;
  font-weight: 600;
}

.chat-input-container {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
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

.loading-dots {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0.5; }
}

.chat-response {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
}

.response-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.response-content {
  color: #374151;
  line-height: 1.6;
  font-size: 14px;
}

@media (max-width: 768px) {
  .ai-insights-panel {
    padding: 20px;
  }
  
  .panel-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .panel-title {
    font-size: 20px;
  }
  
  .insight-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
  
  .chat-input-container {
    flex-direction: column;
  }
  
  .send-btn {
    align-self: flex-end;
  }
}
</style>