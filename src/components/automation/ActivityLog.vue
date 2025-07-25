<template>
  <div class="activity-log">
    <div class="section-header">
      <h2 class="section-title">Recent Activity</h2>
      <div class="header-actions">
        <button class="action-btn secondary" @click="exportLog">
          <span class="btn-icon">📥</span>
          Export
        </button>
        <button class="action-btn secondary" @click="clearFilters" v-if="hasActiveFilters">
          <span class="btn-icon">✕</span>
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Advanced Filters -->
    <div class="filters-panel">
      <div class="filter-row">
        <div class="filter-group">
          <label class="filter-label">Device</label>
          <select v-model="filters.device" class="filter-select">
            <option value="">All Devices</option>
            <option v-for="device in uniqueDevices" :key="device" :value="device">
              {{ device }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Action Type</label>
          <select v-model="filters.action" class="filter-select">
            <option value="">All Actions</option>
            <option v-for="action in uniqueActions" :key="action" :value="action">
              {{ action }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Result</label>
          <select v-model="filters.result" class="filter-select">
            <option value="">All Results</option>
            <option value="success">Success</option>
            <option value="failure">Failure</option>
            <option value="warning">Warning</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Triggered By</label>
          <select v-model="filters.triggeredBy" class="filter-select">
            <option value="">All Triggers</option>
            <option value="system">System</option>
            <option value="admin">Admin</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Time Range</label>
          <select v-model="filters.timeRange" class="filter-select">
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>

      <div class="search-row">
        <div class="search-group">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by device name, action, or details..."
            class="search-input-large"
          />
          <span class="search-icon">🔍</span>
        </div>
        <div class="results-info">
          {{ filteredActivities.length }} of {{ activities.length }} activities
        </div>
      </div>
    </div>

    <!-- Activity Timeline -->
    <div class="activity-timeline">
      <div
        v-for="activity in paginatedActivities"
        :key="activity.id"
        class="activity-item"
        :class="activity.result"
      >
        <div class="activity-indicator">
          <div class="indicator-dot" :class="activity.result"></div>
          <div class="indicator-line"></div>
        </div>

        <div class="activity-content">
          <div class="activity-header">
            <div class="activity-main">
              <h3 class="activity-title">{{ activity.action }}</h3>
              <div class="activity-meta">
                <span class="device-name">{{ activity.deviceName }}</span>
                <span class="separator">•</span>
                <span class="timestamp">{{ formatTimestamp(activity.timestamp) }}</span>
                <span class="separator">•</span>
                <span class="triggered-by" :class="activity.triggeredBy">
                  {{ formatTrigger(activity.triggeredBy) }}
                </span>
              </div>
            </div>
            <div class="activity-status">
              <span class="status-badge" :class="activity.result">
                <span class="status-icon">{{ getStatusIcon(activity.result) }}</span>
                {{ formatResult(activity.result) }}
              </span>
            </div>
          </div>

          <div class="activity-details" v-if="activity.details">
            <p class="details-text">{{ activity.details }}</p>
          </div>

          <div class="activity-extra" v-if="activity.duration || activity.affectedUsers">
            <div class="extra-items">
              <span v-if="activity.duration" class="extra-item">
                <span class="extra-label">Duration:</span>
                <span class="extra-value">{{ activity.duration }}</span>
              </span>
              <span v-if="activity.affectedUsers" class="extra-item">
                <span class="extra-label">Affected Users:</span>
                <span class="extra-value">{{ activity.affectedUsers }}</span>
              </span>
              <span v-if="activity.automationId" class="extra-item">
                <span class="extra-label">Automation ID:</span>
                <span class="extra-value">{{ activity.automationId }}</span>
              </span>
            </div>
          </div>

          <div class="activity-actions" v-if="activity.result === 'failure'">
            <button class="retry-btn" @click="retryAction(activity)">
              <span class="btn-icon">↻</span>
              Retry
            </button>
            <button class="details-btn" @click="viewDetails(activity)">
              <span class="btn-icon">👁</span>
              View Details
            </button>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div v-if="hasMoreActivities" class="load-more">
        <button class="load-more-btn" @click="loadMoreActivities">
          Load More Activities
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="filteredActivities.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <div class="empty-message">
          {{ searchQuery || hasActiveFilters ? 'No activities match your criteria' : 'No recent activities' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  activities: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['filter', 'retry', 'viewDetails', 'export'])

// Reactive state
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 20

const filters = ref({
  device: '',
  action: '',
  result: '',
  triggeredBy: '',
  timeRange: '7d'
})

// Computed properties
const uniqueDevices = computed(() => 
  [...new Set(props.activities.map(activity => activity.deviceName))].sort()
)

const uniqueActions = computed(() => 
  [...new Set(props.activities.map(activity => activity.action))].sort()
)

const hasActiveFilters = computed(() => 
  Object.values(filters.value).some(value => value !== '') || searchQuery.value !== ''
)

const filteredActivities = computed(() => {
  let filtered = props.activities

  // Apply filters
  if (filters.value.device) {
    filtered = filtered.filter(activity => activity.deviceName === filters.value.device)
  }
  if (filters.value.action) {
    filtered = filtered.filter(activity => activity.action === filters.value.action)
  }
  if (filters.value.result) {
    filtered = filtered.filter(activity => activity.result === filters.value.result)
  }
  if (filters.value.triggeredBy) {
    filtered = filtered.filter(activity => activity.triggeredBy === filters.value.triggeredBy)
  }

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(activity =>
      activity.deviceName.toLowerCase().includes(query) ||
      activity.action.toLowerCase().includes(query) ||
      activity.details?.toLowerCase().includes(query)
    )
  }

  // Apply time range filter
  const now = new Date()
  let timeLimit
  switch (filters.value.timeRange) {
    case '24h':
      timeLimit = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      break
    case '7d':
      timeLimit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      timeLimit = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
  }

  if (timeLimit) {
    filtered = filtered.filter(activity => new Date(activity.timestamp) >= timeLimit)
  }

  return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
})

const paginatedActivities = computed(() => {
  const start = 0
  const end = currentPage.value * pageSize
  return filteredActivities.value.slice(start, end)
})

const hasMoreActivities = computed(() => 
  paginatedActivities.value.length < filteredActivities.value.length
)

// Methods
const clearFilters = () => {
  filters.value = {
    device: '',
    action: '',
    result: '',
    triggeredBy: '',
    timeRange: '7d'
  }
  searchQuery.value = ''
  currentPage.value = 1
}

const loadMoreActivities = () => {
  currentPage.value++
}

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatTrigger = (trigger) => {
  const labels = {
    system: 'System',
    admin: 'Admin',
    scheduled: 'Scheduled'
  }
  return labels[trigger] || trigger
}

const formatResult = (result) => {
  const labels = {
    success: 'Success',
    failure: 'Failed',
    warning: 'Warning'
  }
  return labels[result] || result
}

const getStatusIcon = (result) => {
  const icons = {
    success: '✓',
    failure: '✕',
    warning: '⚠'
  }
  return icons[result] || '•'
}

const retryAction = (activity) => {
  emit('retry', activity)
}

const viewDetails = (activity) => {
  emit('viewDetails', activity)
}

const exportLog = () => {
  emit('export', filteredActivities.value)
}
</script>

<style scoped>
.activity-log {
  padding: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text, #323130);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: var(--border-radius, 4px);
  background: var(--color-surface, #ffffff);
  color: var(--color-text, #323130);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--color-surface-2, #f8f9fa);
}

.btn-icon {
  font-size: 14px;
}

.filters-panel {
  background: var(--color-surface-2, #f8f9fa);
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: var(--border-radius, 4px);
  padding: 20px;
  margin-bottom: 24px;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary, #605e5c);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: var(--border-radius, 4px);
  background: var(--color-surface, #ffffff);
  color: var(--color-text, #323130);
  font-size: 14px;
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-primary, #0078d4);
  box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.1);
}

.search-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.search-group {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-input-large {
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: var(--border-radius, 4px);
  background: var(--color-surface, #ffffff);
  color: var(--color-text, #323130);
  font-size: 14px;
}

.search-input-large:focus {
  outline: none;
  border-color: var(--color-primary, #0078d4);
  box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.1);
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary, #605e5c);
  font-size: 16px;
}

.results-info {
  font-size: 14px;
  color: var(--color-text-secondary, #605e5c);
  font-weight: 500;
}

.activity-timeline {
  position: relative;
}

.activity-item {
  display: flex;
  position: relative;
  margin-bottom: 24px;
}

.activity-item:last-child .indicator-line {
  display: none;
}

.activity-indicator {
  position: relative;
  margin-right: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--color-surface, #ffffff);
  position: relative;
  z-index: 1;
}

.indicator-dot.success {
  background: var(--color-success, #107c10);
}

.indicator-dot.failure {
  background: var(--color-danger, #d13438);
}

.indicator-dot.warning {
  background: var(--color-warning, #ff8c00);
}

.indicator-line {
  width: 2px;
  flex: 1;
  background: var(--color-surface-3, #e5e7eb);
  margin-top: 8px;
  min-height: 40px;
}

.activity-content {
  flex: 1;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: var(--border-radius, 4px);
  padding: 16px;
  box-shadow: var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.activity-main {
  flex: 1;
  min-width: 0;
}

.activity-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #323130);
  margin: 0 0 6px 0;
  line-height: 1.2;
}

.activity-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-secondary, #605e5c);
  flex-wrap: wrap;
}

.device-name {
  font-weight: 600;
  color: var(--color-primary, #0078d4);
}

.separator {
  color: var(--color-surface-3, #e5e7eb);
}

.triggered-by.system {
  color: var(--color-primary, #0078d4);
}

.triggered-by.admin {
  color: var(--color-success, #107c10);
}

.triggered-by.scheduled {
  color: var(--color-warning, #ff8c00);
}

.activity-status {
  flex-shrink: 0;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.success {
  background: #f0f9f0;
  color: var(--color-success, #107c10);
}

.status-badge.failure {
  background: #fef2f2;
  color: var(--color-danger, #d13438);
}

.status-badge.warning {
  background: #fef8f0;
  color: var(--color-warning, #ff8c00);
}

.status-icon {
  font-size: 10px;
}

.activity-details {
  margin-bottom: 12px;
}

.details-text {
  font-size: 14px;
  color: var(--color-text, #323130);
  margin: 0;
  line-height: 1.4;
}

.activity-extra {
  margin-bottom: 12px;
}

.extra-items {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.extra-item {
  display: flex;
  gap: 4px;
  font-size: 13px;
}

.extra-label {
  color: var(--color-text-secondary, #605e5c);
  font-weight: 500;
}

.extra-value {
  color: var(--color-text, #323130);
  font-weight: 600;
}

.activity-actions {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--color-surface-3, #e5e7eb);
}

.retry-btn,
.details-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: var(--border-radius, 4px);
  background: var(--color-surface, #ffffff);
  color: var(--color-text, #323130);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover,
.details-btn:hover {
  background: var(--color-surface-2, #f8f9fa);
}

.load-more {
  text-align: center;
  padding: 24px;
}

.load-more-btn {
  padding: 12px 24px;
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: var(--border-radius, 4px);
  background: var(--color-surface, #ffffff);
  color: var(--color-text, #323130);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-more-btn:hover {
  background: var(--color-surface-2, #f8f9fa);
  border-color: var(--color-primary, #0078d4);
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-message {
  font-size: 16px;
  color: var(--color-text-secondary, #605e5c);
}

/* Responsive */
@media (max-width: 768px) {
  .activity-log {
    padding: 16px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .filters-panel {
    padding: 16px;
  }
  
  .filter-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .search-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .activity-item {
    margin-bottom: 16px;
  }
  
  .activity-indicator {
    margin-right: 12px;
  }
  
  .activity-content {
    padding: 12px;
  }
  
  .activity-header {
    flex-direction: column;
    gap: 8px;
  }
  
  .activity-meta {
    font-size: 12px;
  }
  
  .extra-items {
    flex-direction: column;
    gap: 8px;
  }
}
</style>