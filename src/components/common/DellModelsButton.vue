<template>
  <button class="dell-models-btn" @click="$emit('click')" :class="{ 'has-alerts': hasAlerts }">
    <div class="btn-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
        <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2"/>
        <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2"/>
        <circle cx="18" cy="8" r="3" fill="#dc2626" v-if="hasAlerts"/>
      </svg>
    </div>
    <div class="btn-content">
      <span class="btn-title">Dell Models</span>
      <span class="btn-subtitle">Europe Zone</span>
    </div>
    <div class="btn-badge" v-if="hasAlerts">
      <span>{{ alertCount }}</span>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'

defineEmits(['click'])

// Mock alert data - in real app this would come from props or store
const alerts = [
  { type: 'warning', message: 'High CPU usage on Vision API' },
  { type: 'critical', message: 'Security Analyzer needs attention' }
]

const hasAlerts = computed(() => alerts.length > 0)
const alertCount = computed(() => alerts.length)
</script>

<style scoped>
.dell-models-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  min-width: 160px;
}

.dell-models-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dell-models-btn.has-alerts {
  border-color: #f59e0b;
  background: #fffbeb;
}

.dell-models-btn.has-alerts:hover {
  background: #fef3c7;
  border-color: #d97706;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #007DB8;
  position: relative;
}

.btn-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.btn-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.2;
}

.btn-subtitle {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.2;
}

.btn-badge {
  background: #dc2626;
  color: white;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
  line-height: 1;
}

@media (max-width: 768px) {
  .dell-models-btn {
    min-width: auto;
    padding: 10px 12px;
  }
  
  .btn-content {
    gap: 1px;
  }
  
  .btn-title {
    font-size: 13px;
  }
  
  .btn-subtitle {
    font-size: 11px;
  }
}

@media (prefers-color-scheme: dark) {
  .dell-models-btn {
    background: #374151;
    border-color: #4b5563;
  }
  
  .dell-models-btn:hover {
    background: #4b5563;
    border-color: #6b7280;
  }
  
  .dell-models-btn.has-alerts {
    background: #451a03;
    border-color: #f59e0b;
  }
  
  .dell-models-btn.has-alerts:hover {
    background: #78350f;
  }
  
  .btn-title {
    color: #f9fafb;
  }
  
  .btn-subtitle {
    color: #d1d5db;
  }
  
  .btn-icon {
    color: #60a5fa;
  }
}
</style>