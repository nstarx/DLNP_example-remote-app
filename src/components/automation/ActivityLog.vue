<template>
  <div class="activity-log">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <span>Loading activities...</span>
    </div>
    
    <div v-else-if="activities.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <div class="empty-text">No activities found</div>
      <div class="empty-subtext">Recent automation activities will appear here</div>
    </div>
    
    <div v-else class="activity-list">
      <div 
        v-for="activity in activities" 
        :key="activity.id" 
        class="activity-item"
      >
        <div class="activity-status">
          <div class="status-indicator" :class="`status-${activity.result}`"></div>
        </div>
        
        <div class="activity-content">
          <div class="activity-header">
            <div class="activity-device">{{ activity.device }}</div>
            <div class="activity-time">{{ formatTime(activity.timestamp) }}</div>
          </div>
          
          <div class="activity-action">{{ activity.action }}</div>
          
          <div class="activity-footer">
            <div class="activity-details">{{ activity.details }}</div>
            <div class="activity-trigger">
              <span class="trigger-label">Triggered by:</span>
              <span class="trigger-value" :class="`trigger-${activity.triggeredBy}`">
                {{ activity.triggeredBy }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activities: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  // Less than 1 minute
  if (diff < 60000) {
    return 'Just now'
  }
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes}m ago`
  }
  
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours}h ago`
  }
  
  // Format as date
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>

<style scoped>
.activity-log {
  max-height: 600px;
  overflow-y: auto;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 24px;
  color: #64748b;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #0ea5e9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.5;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
  color: #475569;
  margin-bottom: 4px;
}

.empty-subtext {
  font-size: 14px;
  color: #64748b;
}

.activity-list {
  padding: 0 24px 24px;
}

.activity-item {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #f1f5f9;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-status {
  flex-shrink: 0;
  padding-top: 2px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-success {
  background: #22c55e;
}

.status-failed {
  background: #ef4444;
}

.status-warning {
  background: #f59e0b;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  gap: 12px;
}

.activity-device {
  font-weight: 600;
  color: #0f172a;
  font-size: 14px;
}

.activity-time {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
}

.activity-action {
  font-size: 14px;
  color: #475569;
  margin-bottom: 8px;
}

.activity-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.activity-details {
  font-size: 12px;
  color: #64748b;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  white-space: nowrap;
}

.trigger-label {
  color: #94a3b8;
}

.trigger-value {
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 3px;
}

.trigger-system {
  background: #dbeafe;
  color: #1e40af;
}

.trigger-admin {
  background: #fef3c7;
  color: #92400e;
}

.trigger-user {
  background: #f3e8ff;
  color: #7c3aed;
}

/* Custom scrollbar */
.activity-log::-webkit-scrollbar {
  width: 6px;
}

.activity-log::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.activity-log::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.activity-log::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

@media (max-width: 768px) {
  .activity-list {
    padding: 0 16px 16px;
  }
  
  .activity-item {
    padding: 12px 0;
  }
  
  .activity-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .activity-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .activity-details {
    white-space: normal;
  }
}
</style>