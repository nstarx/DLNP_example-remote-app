<template>
  <div v-if="show" class="popup-overlay" @click="closePopup">
    <div class="popup-container" @click.stop>
      <!-- Dell Header -->
      <div class="popup-header">
        <div class="dell-brand">
          <div class="dell-logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="#007DB8"/>
              <path d="M10 12H30V28H10V12Z" fill="white"/>
              <path d="M12 15H18V25H12V15Z" fill="#007DB8"/>
              <path d="M20 15H28V17H20V15Z" fill="#007DB8"/>
              <path d="M20 19H28V21H20V19Z" fill="#007DB8"/>
              <path d="M20 23H28V25H20V23Z" fill="#007DB8"/>
            </svg>
          </div>
          <div class="brand-info">
            <h2 class="brand-title">Dell Technologies</h2>
            <div class="region-badge">
              <span class="region-flag">🇪🇺</span>
              <span class="region-text">Europe Zone</span>
            </div>
          </div>
        </div>
        <button class="close-btn" @click="closePopup">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- Status Overview -->
      <div class="status-overview">
        <div class="status-card active">
          <div class="status-icon">
            <div class="pulse-dot"></div>
          </div>
          <div class="status-info">
            <h3>{{ runningModels }} Models Running</h3>
            <p>Active across {{ regions.length }} regions</p>
          </div>
        </div>
        <div class="performance-metrics">
          <div class="metric">
            <span class="metric-value">{{ totalRequests.toLocaleString() }}</span>
            <span class="metric-label">Total Requests</span>
          </div>
          <div class="metric">
            <span class="metric-value">{{ avgResponseTime }}ms</span>
            <span class="metric-label">Avg Response</span>
          </div>
          <div class="metric">
            <span class="metric-value">{{ uptime }}%</span>
            <span class="metric-label">Uptime</span>
          </div>
        </div>
      </div>

      <!-- Models Grid -->
      <div class="models-section">
        <h3 class="section-title">Active Models</h3>
        <div class="models-grid">
          <div 
            v-for="model in models" 
            :key="model.id"
            class="model-card"
            :class="{ 'high-performance': model.performance > 85 }"
          >
            <div class="model-header">
              <div class="model-info">
                <h4 class="model-name">{{ model.name }}</h4>
                <span class="model-version">v{{ model.version }}</span>
              </div>
              <div class="model-status" :class="model.status">
                <span class="status-dot"></span>
                <span class="status-text">{{ model.status }}</span>
              </div>
            </div>
            
            <div class="model-metrics">
              <div class="metric-row">
                <span class="metric-name">CPU Usage</span>
                <div class="metric-bar">
                  <div class="metric-fill" :style="{ width: model.cpu + '%' }"></div>
                </div>
                <span class="metric-percent">{{ model.cpu }}%</span>
              </div>
              <div class="metric-row">
                <span class="metric-name">Memory</span>
                <div class="metric-bar">
                  <div class="metric-fill memory" :style="{ width: model.memory + '%' }"></div>
                </div>
                <span class="metric-percent">{{ model.memory }}%</span>
              </div>
              <div class="metric-row">
                <span class="metric-name">Performance</span>
                <div class="metric-bar">
                  <div class="metric-fill performance" :style="{ width: model.performance + '%' }"></div>
                </div>
                <span class="metric-percent">{{ model.performance }}%</span>
              </div>
            </div>

            <div class="model-details">
              <div class="detail-item">
                <span class="detail-label">Region</span>
                <span class="detail-value">{{ model.region }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Instance</span>
                <span class="detail-value">{{ model.instance }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Requests/min</span>
                <span class="detail-value">{{ model.requestsPerMin.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Region Map -->
      <div class="region-section">
        <h3 class="section-title">European Deployment</h3>
        <div class="region-map">
          <div v-for="region in regions" :key="region.code" class="region-item">
            <div class="region-dot" :class="region.status"></div>
            <div class="region-info">
              <span class="region-name">{{ region.name }}</span>
              <span class="region-models">{{ region.models }} models</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="popup-actions">
        <button class="action-btn secondary" @click="refreshData">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.65 2.35C12.2 0.9 10.2 0 8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.65 2.35Z" fill="currentColor"/>
          </svg>
          Refresh
        </button>
        <button class="action-btn primary" @click="viewDetails">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2C4.5 2 1.73 4.61 1 8C1.73 11.39 4.5 14 8 14C11.5 14 14.27 11.39 15 8C14.27 4.61 11.5 2 8 2ZM8 12C6.34 12 5 10.66 5 9C5 7.34 6.34 6 8 6C9.66 6 11 7.34 11 9C11 10.66 9.66 12 8 12ZM8 7C6.89 7 6 7.89 6 9C6 10.11 6.89 11 8 11C9.11 11 10 10.11 10 9C10 7.89 9.11 7 8 7Z" fill="currentColor"/>
          </svg>
          View Details
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'refresh', 'view-details'])

// Mock data for Dell models in Europe
const models = ref([
  {
    id: 'dell-optiplex-7090',
    name: 'OptiPlex 7090',
    version: '2.1.4',
    status: 'running',
    cpu: 78,
    memory: 65,
    performance: 92,
    region: 'Frankfurt',
    instance: 'c5.2xlarge',
    requestsPerMin: 1247
  },
  {
    id: 'dell-latitude-5520',
    name: 'Latitude 5520',
    version: '1.8.2',
    status: 'running',
    cpu: 45,
    memory: 58,
    performance: 87,
    region: 'Dublin',
    instance: 'c5.xlarge',
    requestsPerMin: 892
  },
  {
    id: 'dell-precision-7560',
    name: 'Precision 7560',
    version: '3.0.1',
    status: 'running',
    cpu: 89,
    memory: 72,
    performance: 95,
    region: 'Milan',
    instance: 'c5.4xlarge',
    requestsPerMin: 1456
  },
  {
    id: 'dell-inspiron-5510',
    name: 'Inspiron 5510',
    version: '2.3.7',
    status: 'running',
    cpu: 34,
    memory: 41,
    performance: 83,
    region: 'Stockholm',
    instance: 'c5.large',
    requestsPerMin: 634
  },
  {
    id: 'dell-vostro-7500',
    name: 'Vostro 7500',
    version: '1.9.5',
    status: 'running',
    cpu: 67,
    memory: 55,
    performance: 89,
    region: 'Paris',
    instance: 'c5.xlarge',
    requestsPerMin: 1023
  },
  {
    id: 'dell-alienware-m15',
    name: 'Alienware m15',
    version: '2.7.3',
    status: 'running',
    cpu: 91,
    memory: 84,
    performance: 97,
    region: 'Amsterdam',
    instance: 'c5.8xlarge',
    requestsPerMin: 1789
  }
])

const regions = ref([
  { code: 'fra', name: 'Frankfurt', models: 2, status: 'active' },
  { code: 'dub', name: 'Dublin', models: 1, status: 'active' },
  { code: 'mil', name: 'Milan', models: 1, status: 'active' },
  { code: 'sto', name: 'Stockholm', models: 1, status: 'active' },
  { code: 'par', name: 'Paris', models: 1, status: 'active' },
  { code: 'ams', name: 'Amsterdam', models: 1, status: 'active' }
])

const runningModels = computed(() => models.value.length)
const totalRequests = computed(() => models.value.reduce((sum, model) => sum + model.requestsPerMin, 0) * 60)
const avgResponseTime = computed(() => Math.round(Math.random() * 50 + 150))
const uptime = computed(() => 99.7)

const closePopup = () => {
  emit('close')
}

const refreshData = () => {
  emit('refresh')
  // Simulate data refresh
  models.value.forEach(model => {
    model.cpu = Math.max(20, Math.min(95, model.cpu + (Math.random() - 0.5) * 10))
    model.memory = Math.max(20, Math.min(90, model.memory + (Math.random() - 0.5) * 8))
    model.performance = Math.max(70, Math.min(99, model.performance + (Math.random() - 0.5) * 5))
    model.requestsPerMin = Math.max(100, Math.round(model.requestsPerMin + (Math.random() - 0.5) * 200))
  })
}

const viewDetails = () => {
  emit('view-details')
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.popup-container {
  background: white;
  border-radius: 20px;
  width: 90vw;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: linear-gradient(135deg, #007DB8 0%, #005c8a 100%);
  color: white;
  border-radius: 20px 20px 0 0;
}

.dell-brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dell-logo {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.brand-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.region-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 14px;
}

.region-flag {
  font-size: 16px;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.status-overview {
  display: flex;
  gap: 24px;
  padding: 32px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  border: 2px solid #10b981;
  box-shadow: 0 4px 6px rgba(16, 185, 129, 0.1);
  flex: 1;
}

.status-icon {
  position: relative;
}

.pulse-dot {
  width: 16px;
  height: 16px;
  background: #10b981;
  border-radius: 50%;
  position: relative;
}

.pulse-dot::after {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 2px solid #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(0.8);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
  100% {
    opacity: 0;
    transform: scale(1.5);
  }
}

.status-info h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.status-info p {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 14px;
}

.performance-metrics {
  display: flex;
  gap: 24px;
  flex: 1;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  flex: 1;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.models-section {
  padding: 32px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 24px;
}

.models-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
}

.model-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.model-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.model-card.high-performance {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
}

.model-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.model-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.model-version {
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 6px;
  margin-top: 4px;
  display: inline-block;
}

.model-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.model-status.running {
  background: #d1fae5;
  color: #065f46;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.model-metrics {
  margin-bottom: 16px;
}

.metric-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.metric-row:last-child {
  margin-bottom: 0;
}

.metric-name {
  font-size: 12px;
  color: #6b7280;
  width: 80px;
  flex-shrink: 0;
}

.metric-bar {
  flex: 1;
  height: 6px;
  background: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.metric-fill.memory {
  background: #10b981;
}

.metric-fill.performance {
  background: #f59e0b;
}

.metric-percent {
  font-size: 12px;
  font-weight: 500;
  color: #1f2937;
  width: 35px;
  text-align: right;
}

.model-details {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-label {
  font-size: 10px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 12px;
  font-weight: 500;
  color: #1f2937;
}

.region-section {
  padding: 0 32px 32px;
}

.region-map {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.region-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  flex: 1;
  min-width: 150px;
}

.region-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s infinite;
}

.region-dot.active {
  background: #10b981;
}

.region-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.region-name {
  font-size: 12px;
  font-weight: 500;
  color: #1f2937;
}

.region-models {
  font-size: 10px;
  color: #6b7280;
}

.popup-actions {
  display: flex;
  gap: 16px;
  padding: 24px 32px;
  background: #f8fafc;
  border-radius: 0 0 20px 20px;
  border-top: 1px solid #e5e7eb;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  justify-content: center;
}

.action-btn.secondary {
  background: white;
  color: #6b7280;
  border: 1px solid #e5e7eb;
}

.action-btn.secondary:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.action-btn.primary {
  background: #007DB8;
  color: white;
}

.action-btn.primary:hover {
  background: #005c8a;
}

@media (max-width: 768px) {
  .popup-container {
    width: 95vw;
    max-height: 95vh;
  }
  
  .popup-header {
    padding: 16px 20px;
  }
  
  .brand-title {
    font-size: 20px;
  }
  
  .status-overview {
    flex-direction: column;
    padding: 20px;
  }
  
  .performance-metrics {
    flex-direction: column;
    gap: 12px;
  }
  
  .models-section {
    padding: 20px;
  }
  
  .models-grid {
    grid-template-columns: 1fr;
  }
  
  .region-map {
    flex-direction: column;
  }
  
  .popup-actions {
    padding: 16px 20px;
    flex-direction: column;
  }
}
</style>