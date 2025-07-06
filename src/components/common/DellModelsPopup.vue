<template>
  <div v-if="isVisible" class="popup-overlay" @click="closePopup">
    <div class="popup-container" @click.stop>
      <div class="popup-header">
        <div class="header-info">
          <div class="client-badge">
            <div class="dell-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="6" width="20" height="12" rx="2" fill="#007DB8"/>
                <rect x="4" y="8" width="16" height="2" fill="white"/>
                <rect x="4" y="11" width="12" height="2" fill="white"/>
                <rect x="4" y="14" width="8" height="2" fill="white"/>
              </svg>
            </div>
            <div class="client-info">
              <h3>Dell Technologies</h3>
              <span class="zone-tag">Europe Zone</span>
            </div>
          </div>
          <button class="close-btn" @click="closePopup">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="summary-stats">
          <div class="stat-item">
            <span class="stat-value">{{ runningModels.length }}</span>
            <span class="stat-label">Active Models</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ totalRequests.toLocaleString() }}</span>
            <span class="stat-label">Total Requests</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ averageLatency }}ms</span>
            <span class="stat-label">Avg Latency</span>
          </div>
        </div>
      </div>

      <div class="popup-content">
        <div class="models-grid">
          <div 
            v-for="model in runningModels" 
            :key="model.id"
            class="model-card"
            :class="{ 'high-load': model.cpuUsage > 80 }"
          >
            <div class="model-header">
              <div class="model-name">
                <h4>{{ model.name }}</h4>
                <span class="model-type">{{ model.type }}</span>
              </div>
              <div class="status-indicator" :class="model.status">
                <div class="status-dot"></div>
                <span>{{ model.status }}</span>
              </div>
            </div>

            <div class="model-metrics">
              <div class="metric-row">
                <div class="metric">
                  <span class="metric-label">CPU Usage</span>
                  <div class="metric-bar-container">
                    <div class="metric-bar">
                      <div 
                        class="metric-fill cpu"
                        :style="{ width: `${model.cpuUsage}%` }"
                      ></div>
                    </div>
                    <span class="metric-value">{{ model.cpuUsage }}%</span>
                  </div>
                </div>
                <div class="metric">
                  <span class="metric-label">Memory</span>
                  <div class="metric-bar-container">
                    <div class="metric-bar">
                      <div 
                        class="metric-fill memory"
                        :style="{ width: `${model.memoryUsage}%` }"
                      ></div>
                    </div>
                    <span class="metric-value">{{ model.memoryUsage }}%</span>
                  </div>
                </div>
              </div>

              <div class="metric-row">
                <div class="metric-item">
                  <span class="metric-label">Requests/min</span>
                  <span class="metric-value">{{ model.requestsPerMinute }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">Latency</span>
                  <span class="metric-value">{{ model.latency }}ms</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">Uptime</span>
                  <span class="metric-value">{{ model.uptime }}</span>
                </div>
              </div>
            </div>

            <div class="model-actions">
              <button class="action-btn secondary" @click="viewLogs(model.id)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2"/>
                </svg>
                View Logs
              </button>
              <button class="action-btn primary" @click="viewDetails(model.id)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 1v6m0 10v6m11-7h-6M6 12H1" stroke="currentColor" stroke-width="2"/>
                </svg>
                Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="popup-footer">
        <div class="footer-info">
          <span class="last-updated">Last updated: {{ lastUpdated }}</span>
        </div>
        <div class="footer-actions">
          <button class="action-btn secondary" @click="refreshData">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="23 4 23 10 17 10" stroke="currentColor" stroke-width="2"/>
              <polyline points="1 20 1 14 7 14" stroke="currentColor" stroke-width="2"/>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" stroke-width="2"/>
            </svg>
            Refresh
          </button>
          <button class="action-btn primary" @click="exportData">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2"/>
              <polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2"/>
              <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2"/>
            </svg>
            Export Data
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Mock data for Dell models in Europe zone
const runningModels = ref([
  {
    id: 'dell-eu-ai-001',
    name: 'Dell AI Optimizer Pro',
    type: 'ML Inference',
    status: 'healthy',
    cpuUsage: 67,
    memoryUsage: 54,
    requestsPerMinute: 1247,
    latency: 23,
    uptime: '7d 14h'
  },
  {
    id: 'dell-eu-analytics-002',
    name: 'Analytics Engine v2.1',
    type: 'Data Processing',
    status: 'healthy',
    cpuUsage: 43,
    memoryUsage: 72,
    requestsPerMinute: 892,
    latency: 18,
    uptime: '12d 3h'
  },
  {
    id: 'dell-eu-vision-003',
    name: 'Computer Vision API',
    type: 'Image Processing',
    status: 'warning',
    cpuUsage: 89,
    memoryUsage: 91,
    requestsPerMinute: 2156,
    latency: 47,
    uptime: '3d 8h'
  },
  {
    id: 'dell-eu-nlp-004',
    name: 'Natural Language Processor',
    type: 'NLP',
    status: 'healthy',
    cpuUsage: 35,
    memoryUsage: 48,
    requestsPerMinute: 567,
    latency: 15,
    uptime: '15d 22h'
  },
  {
    id: 'dell-eu-recommender-005',
    name: 'Recommendation Engine',
    type: 'ML Inference',
    status: 'healthy',
    cpuUsage: 58,
    memoryUsage: 63,
    requestsPerMinute: 1834,
    latency: 31,
    uptime: '9d 6h'
  },
  {
    id: 'dell-eu-security-006',
    name: 'Security Analyzer',
    type: 'Security',
    status: 'critical',
    cpuUsage: 95,
    memoryUsage: 87,
    requestsPerMinute: 3245,
    latency: 89,
    uptime: '1d 2h'
  }
])

const totalRequests = computed(() => {
  return runningModels.value.reduce((total, model) => total + model.requestsPerMinute, 0)
})

const averageLatency = computed(() => {
  const total = runningModels.value.reduce((sum, model) => sum + model.latency, 0)
  return Math.round(total / runningModels.value.length)
})

const lastUpdated = ref(new Date().toLocaleString())

const closePopup = () => {
  isVisible.value = false
}

const viewLogs = (modelId) => {
  console.log('Viewing logs for model:', modelId)
  // Implement log viewing functionality
}

const viewDetails = (modelId) => {
  console.log('Viewing details for model:', modelId)
  // Implement details viewing functionality
}

const refreshData = () => {
  lastUpdated.value = new Date().toLocaleString()
  console.log('Refreshing model data...')
  // Implement data refresh functionality
}

const exportData = () => {
  console.log('Exporting model data...')
  // Implement data export functionality
}

onMounted(() => {
  // Auto-refresh every 30 seconds when popup is open
  const interval = setInterval(() => {
    if (isVisible.value) {
      refreshData()
    }
  }, 30000)

  // Cleanup interval on unmount
  return () => clearInterval(interval)
})
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.popup-container {
  background: white;
  border-radius: 16px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
}

.popup-header {
  background: linear-gradient(135deg, #007DB8 0%, #005A87 100%);
  color: white;
  padding: 24px;
  border-radius: 16px 16px 0 0;
}

.header-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.client-badge {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dell-logo {
  background: white;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.client-info h3 {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 700;
}

.zone-tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.popup-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.models-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.model-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
}

.model-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.model-card.high-load {
  border-color: #f59e0b;
  background: #fffbeb;
}

.model-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.model-name h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.model-type {
  font-size: 12px;
  color: #6b7280;
  background: #e5e7eb;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.healthy {
  color: #16a34a;
}

.status-indicator.healthy .status-dot {
  background: #16a34a;
}

.status-indicator.warning {
  color: #d97706;
}

.status-indicator.warning .status-dot {
  background: #d97706;
}

.status-indicator.critical {
  color: #dc2626;
}

.status-indicator.critical .status-dot {
  background: #dc2626;
}

.model-metrics {
  margin-bottom: 20px;
}

.metric-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.metric-row:last-child {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 0;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.metric-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.metric-bar-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.metric-bar {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.metric-fill.cpu {
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
}

.metric-fill.memory {
  background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%);
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.model-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.primary {
  background: #007DB8;
  color: white;
}

.action-btn.primary:hover {
  background: #005A87;
}

.action-btn.secondary {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.action-btn.secondary:hover {
  background: #e2e8f0;
}

.popup-footer {
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.last-updated {
  font-size: 12px;
  color: #6b7280;
}

.footer-actions {
  display: flex;
  gap: 8px;
}

@media (max-width: 768px) {
  .popup-overlay {
    padding: 10px;
  }
  
  .popup-container {
    max-height: 95vh;
  }
  
  .summary-stats {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .models-grid {
    grid-template-columns: 1fr;
  }
  
  .popup-footer {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .footer-actions {
    justify-content: center;
  }
}

@media (prefers-color-scheme: dark) {
  .popup-container {
    background: #1f2937;
    color: #f9fafb;
  }
  
  .model-card {
    background: #374151;
    border-color: #4b5563;
  }
  
  .model-card.high-load {
    background: #451a03;
    border-color: #f59e0b;
  }
  
  .model-name h4 {
    color: #f9fafb;
  }
  
  .model-type {
    background: #4b5563;
    color: #d1d5db;
  }
  
  .metric-label {
    color: #9ca3af;
  }
  
  .metric-value {
    color: #f9fafb;
  }
  
  .metric-bar {
    background: #4b5563;
  }
  
  .action-btn.secondary {
    background: #374151;
    color: #d1d5db;
    border-color: #4b5563;
  }
  
  .action-btn.secondary:hover {
    background: #4b5563;
  }
  
  .popup-footer {
    background: #374151;
    border-color: #4b5563;
  }
  
  .last-updated {
    color: #9ca3af;
  }
}
</style>