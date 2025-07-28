<template>
  <div class="notification-center">
    <button @click="toggleNotifications" class="notification-trigger" :class="{ 'has-alerts': hasUnreadAlerts }">
      <BellIcon class="bell-icon" />
      <span v-if="unreadCount > 0" class="alert-badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
    </button>
    
    <!-- Notification Dropdown -->
    <div v-if="showNotifications" class="notifications-dropdown">
      <div class="notifications-header">
        <div class="header-left">
          <h3>Notifications</h3>
          <span class="alert-count">{{ alerts.length }} active</span>
        </div>
        <div class="header-actions">
          <button @click="markAllAsRead" :disabled="unreadCount === 0" class="mark-all-read">
            Mark all read
          </button>
          <button @click="showNotifications = false" class="close-notifications">
            <CloseIcon />
          </button>
        </div>
      </div>
      
      <div class="notifications-content">
        <div v-if="alerts.length === 0" class="empty-state">
          <CheckCircleIcon class="empty-icon" />
          <h4>All clear!</h4>
          <p>No active alerts at this time.</p>
        </div>
        
        <div v-else class="notifications-list">
          <div
            v-for="alert in sortedAlerts"
            :key="alert.id"
            class="notification-item"
            :class="[`priority-${alert.priority}`, { unread: !alert.read }]"
            @click="handleNotificationClick(alert)"
          >
            <div class="notification-icon">
              <AlertTriangleIcon v-if="alert.priority === 'critical'" class="icon critical" />
              <ExclamationIcon v-else-if="alert.priority === 'high'" class="icon high" />
              <InfoIcon v-else class="icon medium" />
            </div>
            
            <div class="notification-content">
              <div class="notification-title">{{ alert.title }}</div>
              <div class="notification-message">{{ alert.message }}</div>
              <div class="notification-meta">
                <span class="notification-time">{{ formatTime(alert.timestamp) }}</span>
                <span class="notification-source">{{ alert.source }}</span>
                <span v-if="alert.affectedSystems" class="affected-systems">
                  {{ alert.affectedSystems.join(', ') }}
                </span>
              </div>
            </div>
            
            <div class="notification-actions">
              <button
                v-if="alert.actionable"
                @click.stop="handleAlertAction(alert)"
                class="action-btn primary"
              >
                {{ alert.actionLabel || 'Take Action' }}
              </button>
              <button @click.stop="dismissAlert(alert.id)" class="action-btn secondary">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Quick Filters -->
      <div class="notifications-footer">
        <div class="filter-tabs">
          <button
            v-for="filter in filters"
            :key="filter.key"
            @click="activeFilter = filter.key"
            class="filter-tab"
            :class="{ active: activeFilter === filter.key }"
          >
            {{ filter.label }}
            <span v-if="filter.count > 0" class="filter-count">{{ filter.count }}</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Overlay -->
    <div v-if="showNotifications" class="notifications-overlay" @click="showNotifications = false"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import BellIcon from '@/components/icons/BellIcon.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import AlertTriangleIcon from '@/components/icons/AlertTriangleIcon.vue'
import ExclamationIcon from '@/components/icons/ExclamationIcon.vue'
import InfoIcon from '@/components/icons/InfoIcon.vue'
import CheckCircleIcon from '@/components/icons/CheckCircleIcon.vue'

const props = defineProps({
  alerts: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['action', 'dismiss', 'mark-read'])

// State
const showNotifications = ref(false)
const activeFilter = ref('all')

// Computed
const hasUnreadAlerts = computed(() => {
  return props.alerts.some(alert => !alert.read)
})

const unreadCount = computed(() => {
  return props.alerts.filter(alert => !alert.read).length
})

const filters = computed(() => [
  {
    key: 'all',
    label: 'All',
    count: props.alerts.length
  },
  {
    key: 'critical',
    label: 'Critical',
    count: props.alerts.filter(a => a.priority === 'critical').length
  },
  {
    key: 'high',
    label: 'High',
    count: props.alerts.filter(a => a.priority === 'high').length
  },
  {
    key: 'unread',
    label: 'Unread',
    count: unreadCount.value
  }
])

const filteredAlerts = computed(() => {
  let filtered = props.alerts
  
  if (activeFilter.value === 'critical') {
    filtered = filtered.filter(a => a.priority === 'critical')
  } else if (activeFilter.value === 'high') {
    filtered = filtered.filter(a => a.priority === 'high')
  } else if (activeFilter.value === 'unread') {
    filtered = filtered.filter(a => !a.read)
  }
  
  return filtered
})

const sortedAlerts = computed(() => {
  return [...filteredAlerts.value].sort((a, b) => {
    // Sort by priority first (critical > high > medium)
    const priorityOrder = { critical: 3, high: 2, medium: 1 }
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
    if (priorityDiff !== 0) return priorityDiff
    
    // Then by timestamp (newest first)
    return new Date(b.timestamp) - new Date(a.timestamp)
  })
})

// Methods
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const handleNotificationClick = (alert) => {
  if (!alert.read) {
    emit('mark-read', alert.id)
  }
}

const handleAlertAction = (alert) => {
  emit('action', alert, 'primary')
}

const dismissAlert = (alertId) => {
  emit('dismiss', alertId)
}

const markAllAsRead = () => {
  props.alerts.forEach(alert => {
    if (!alert.read) {
      emit('mark-read', alert.id)
    }
  })
}

const formatTime = (timestamp) => {
  const now = new Date()
  const alertTime = new Date(timestamp)
  const diffInMinutes = Math.floor((now - alertTime) / 60000)
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return alertTime.toLocaleDateString()
}

// Auto-close on outside click
const handleClickOutside = (event) => {
  if (!event.target.closest('.notification-center')) {
    showNotifications.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Auto-close after 30 seconds of inactivity
let autoCloseTimer = null

watch(showNotifications, (isOpen) => {
  if (isOpen) {
    autoCloseTimer = setTimeout(() => {
      showNotifications.value = false
    }, 30000)
  } else {
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer)
      autoCloseTimer = null
    }
  }
})

onUnmounted(() => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
  }
})
</script>

<style scoped>
.notification-center {
  position: relative;
}

.notification-trigger {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-trigger:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.notification-trigger.has-alerts {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
}

.notification-trigger.has-alerts:hover {
  background: rgba(239, 68, 68, 0.3);
}

.bell-icon {
  width: 20px;
  height: 20px;
}

.alert-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.notifications-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.notifications-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 420px;
  max-height: 600px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.header-left h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 2px 0;
}

.alert-count {
  font-size: 12px;
  color: #64748b;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mark-all-read {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 0;
}

.mark-all-read:hover:not(:disabled) {
  color: #2563eb;
}

.mark-all-read:disabled {
  color: #94a3b8;
  cursor: not-allowed;
}

.close-notifications {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-notifications:hover {
  color: #374151;
}

.notifications-content {
  max-height: 400px;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  color: #10b981;
}

.empty-state h4 {
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

.notifications-list {
  padding: 8px 0;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.15s ease;
  position: relative;
}

.notification-item:hover {
  background: #f8fafc;
}

.notification-item.unread {
  background: #eff6ff;
  border-left: 3px solid #3b82f6;
}

.notification-item.unread::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 20px;
  width: 6px;
  height: 6px;
  background: #3b82f6;
  border-radius: 50%;
}

.notification-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.icon {
  width: 16px;
  height: 16px;
}

.icon.critical {
  color: #ef4444;
}

.icon.high {
  color: #f59e0b;
}

.icon.medium {
  color: #3b82f6;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 4px;
  line-height: 1.3;
}

.notification-message {
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
  margin-bottom: 6px;
}

.notification-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #94a3b8;
}

.notification-meta span {
  white-space: nowrap;
}

.notification-meta span:not(:last-child)::after {
  content: '•';
  margin-left: 8px;
  color: #cbd5e1;
}

.notification-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
}

.action-btn {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
  border: 1px solid #3b82f6;
}

.action-btn.primary:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.action-btn.secondary {
  background: white;
  color: #64748b;
  border: 1px solid #d1d5db;
}

.action-btn.secondary:hover {
  background: #f8fafc;
  color: #374151;
}

.notifications-footer {
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.filter-tabs {
  display: flex;
  padding: 0;
}

.filter-tab {
  flex: 1;
  background: none;
  border: none;
  padding: 12px 8px;
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  position: relative;
}

.filter-tab:hover {
  color: #374151;
  background: rgba(59, 130, 246, 0.05);
}

.filter-tab.active {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.filter-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #3b82f6;
}

.filter-count {
  background: #e2e8f0;
  color: #64748b;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.filter-tab.active .filter-count {
  background: #3b82f6;
  color: white;
}

/* Priority-specific styles */
.priority-critical .notification-title {
  color: #dc2626;
}

.priority-high .notification-title {
  color: #d97706;
}

/* Responsive */
@media (max-width: 768px) {
  .notifications-dropdown {
    width: 100vw;
    right: -20px;
    max-width: 400px;
  }
  
  .notification-actions {
    flex-direction: row;
  }
  
  .action-btn {
    padding: 6px 8px;
  }
}
</style>