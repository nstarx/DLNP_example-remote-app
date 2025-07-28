<template>
  <div class="notification-center">
    <button 
      @click="toggleNotifications" 
      class="notification-trigger"
      :class="{ active: showNotifications }"
    >
      <span class="notification-icon">🔔</span>
      <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
    </button>

    <div v-if="showNotifications" class="notification-dropdown">
      <div class="notification-header">
        <h3>Notifications</h3>
        <button @click="markAllAsRead" class="mark-all-read">
          Mark all read
        </button>
      </div>
      
      <div class="notification-list">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="notification-item"
          :class="{ unread: !notification.read }"
          @click="markAsRead(notification.id)"
        >
          <div class="notification-icon" :class="notification.type">
            {{ getNotificationIcon(notification.type) }}
          </div>
          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-time">{{ formatTime(notification.timestamp) }}</div>
          </div>
        </div>
      </div>
      
      <div class="notification-footer">
        <button class="view-all-btn">View All Notifications</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  notifications: {
    type: Array,
    default: () => []
  }
})

const showNotifications = ref(false)

const unreadCount = computed(() => {
  return props.notifications.filter(n => !n.read).length
})

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const markAsRead = (notificationId) => {
  const notification = props.notifications.find(n => n.id === notificationId)
  if (notification) {
    notification.read = true
  }
}

const markAllAsRead = () => {
  props.notifications.forEach(n => n.read = true)
}

const getNotificationIcon = (type) => {
  const icons = {
    alert: '🚨',
    insight: '💡',
    warning: '⚠️',
    success: '✅',
    info: 'ℹ️'
  }
  return icons[type] || '📢'
}

const formatTime = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

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
</script>

<style scoped>
.notification-center {
  position: relative;
}

.notification-trigger {
  position: relative;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 18px;
}

.notification-trigger:hover,
.notification-trigger.active {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 320px;
  max-height: 400px;
  overflow: hidden;
  z-index: 1000;
  margin-top: 8px;
}

.notification-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.mark-all-read {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 12px;
  cursor: pointer;
  font-weight: 500;
}

.mark-all-read:hover {
  text-decoration: underline;
}

.notification-list {
  max-height: 280px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.2s ease;
}

.notification-item:hover {
  background: #f8fafc;
}

.notification-item.unread {
  background: #eff6ff;
  border-left: 3px solid #3b82f6;
}

.notification-item .notification-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.notification-icon.alert {
  background: #fef2f2;
  color: #dc2626;
}

.notification-icon.insight {
  background: #fefce8;
  color: #ca8a04;
}

.notification-icon.warning {
  background: #fef3c7;
  color: #d97706;
}

.notification-icon.success {
  background: #f0fdf4;
  color: #16a34a;
}

.notification-icon.info {
  background: #eff6ff;
  color: #2563eb;
}

.notification-title {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
  margin-bottom: 4px;
}

.notification-message {
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
  margin-bottom: 4px;
}

.notification-time {
  font-size: 11px;
  color: #94a3b8;
}

.notification-footer {
  padding: 12px 20px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.view-all-btn {
  width: 100%;
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.view-all-btn:hover {
  background: #e2e8f0;
}

@media (max-width: 768px) {
  .notification-dropdown {
    width: 280px;
    right: -50px;
  }
  
  .notification-item {
    padding: 12px 16px;
  }
}
</style>