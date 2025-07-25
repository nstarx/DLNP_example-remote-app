<template>
  <div v-if="alerts.length > 0" class="alert-container">
    <div 
      v-for="alert in alerts" 
      :key="alert.id"
      class="alert-banner"
      :class="`alert-${alert.type}`"
    >
      <div class="alert-content">
        <div class="alert-icon">
          <span v-if="alert.type === 'critical'">🚨</span>
          <span v-else-if="alert.type === 'warning'">⚠️</span>
          <span v-else>ℹ️</span>
        </div>
        <div class="alert-message">
          {{ alert.message }}
        </div>
        <div class="alert-actions">
          <button 
            class="alert-action-button"
            @click="$emit('view-details', alert.zone)"
          >
            View Details
          </button>
          <button 
            class="alert-dismiss-button"
            @click="$emit('dismiss-alert', alert.id)"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  alerts: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['view-details', 'dismiss-alert'])
</script>

<style scoped>
.alert-container {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-banner {
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.alert-critical {
  background: #fef2f2;
  border-left-color: #dc2626;
  color: #7f1d1d;
}

.alert-warning {
  background: #fffbeb;
  border-left-color: #f59e0b;
  color: #92400e;
}

.alert-info {
  background: #eff6ff;
  border-left-color: #3b82f6;
  color: #1e40af;
}

.alert-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.alert-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.alert-message {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.alert-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.alert-action-button {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid currentColor;
  color: inherit;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.alert-action-button:hover {
  background: white;
  transform: translateY(-1px);
}

.alert-dismiss-button {
  background: none;
  border: none;
  color: inherit;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  opacity: 0.7;
}

.alert-dismiss-button:hover {
  background: rgba(0, 0, 0, 0.1);
  opacity: 1;
}

@media (max-width: 768px) {
  .alert-content {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .alert-actions {
    justify-content: space-between;
  }
}

@media (prefers-color-scheme: dark) {
  .alert-critical {
    background: #7f1d1d;
    color: #fecaca;
  }
  
  .alert-warning {
    background: #92400e;
    color: #fde68a;
  }
  
  .alert-info {
    background: #1e40af;
    color: #dbeafe;
  }
  
  .alert-action-button {
    background: rgba(0, 0, 0, 0.3);
  }
  
  .alert-action-button:hover {
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>