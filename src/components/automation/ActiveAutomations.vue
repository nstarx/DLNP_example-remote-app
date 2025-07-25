<template>
  <div class="active-automations">
    <div class="section-header">
      <h2 class="section-title">Active & Upcoming Automations</h2>
      <div class="header-actions">
        <button class="action-btn secondary" @click="refreshAutomations">
          <span class="btn-icon">↻</span>
          Refresh
        </button>
        <button class="action-btn primary" @click="showScheduleModal = true">
          <span class="btn-icon">+</span>
          Schedule Task
        </button>
      </div>
    </div>

    <div class="automations-content">
      <!-- Quick Filters -->
      <div class="filters-bar">
        <div class="filter-tabs">
          <button
            v-for="filter in statusFilters"
            :key="filter.value"
            class="filter-tab"
            :class="{ active: activeFilter === filter.value }"
            @click="activeFilter = filter.value"
          >
            <span class="filter-count" :class="filter.value">{{ filter.count }}</span>
            {{ filter.label }}
          </button>
        </div>
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search automations..."
            class="search-input"
          />
          <span class="search-icon">🔍</span>
        </div>
      </div>

      <!-- Automations Table -->
      <div class="automations-table">
        <div class="table-header">
          <div class="header-cell task-name">Task Name</div>
          <div class="header-cell status">Status</div>
          <div class="header-cell devices">Target Devices</div>
          <div class="header-cell eta">ETA</div>
          <div class="header-cell actions">Actions</div>
        </div>

        <div class="table-body">
          <div
            v-for="automation in filteredAutomations"
            :key="automation.id"
            class="table-row"
            :class="automation.status"
          >
            <div class="cell task-name">
              <div class="task-info">
                <div class="task-title">{{ automation.name }}</div>
                <div class="task-description">{{ automation.description }}</div>
              </div>
            </div>

            <div class="cell status">
              <span class="status-badge" :class="automation.status">
                <span class="status-indicator"></span>
                {{ getStatusLabel(automation.status) }}
              </span>
            </div>

            <div class="cell devices">
              <div class="device-info">
                <div class="device-count">{{ automation.targetDevices.length }} devices</div>
                <div class="device-preview">
                  {{ automation.targetDevices.slice(0, 2).join(', ') }}
                  <span v-if="automation.targetDevices.length > 2">
                    +{{ automation.targetDevices.length - 2 }} more
                  </span>
                </div>
              </div>
            </div>

            <div class="cell eta">
              <div class="eta-info">
                <div class="eta-time">{{ automation.eta }}</div>
                <div class="eta-progress" v-if="automation.progress !== undefined">
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{ width: automation.progress + '%' }"
                    ></div>
                  </div>
                  <span class="progress-text">{{ automation.progress }}%</span>
                </div>
              </div>
            </div>

            <div class="cell actions">
              <div class="action-buttons">
                <button
                  v-for="action in getAvailableActions(automation)"
                  :key="action.type"
                  class="table-action-btn"
                  :class="action.variant"
                  @click="$emit('action', { type: action.type, automation })"
                  :title="action.title"
                >
                  {{ action.icon }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredAutomations.length === 0" class="empty-state">
          <div class="empty-icon">📋</div>
          <div class="empty-message">
            {{ searchQuery ? 'No automations match your search' : 'No automations found' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  automations: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['action'])

const activeFilter = ref('all')
const searchQuery = ref('')
const showScheduleModal = ref(false)

const statusFilters = computed(() => [
  { value: 'all', label: 'All', count: props.automations.length },
  { value: 'running', label: 'Running', count: props.automations.filter(a => a.status === 'running').length },
  { value: 'scheduled', label: 'Scheduled', count: props.automations.filter(a => a.status === 'scheduled').length },
  { value: 'failed', label: 'Failed', count: props.automations.filter(a => a.status === 'failed').length }
])

const filteredAutomations = computed(() => {
  let filtered = props.automations

  // Apply status filter
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(automation => automation.status === activeFilter.value)
  }

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(automation =>
      automation.name.toLowerCase().includes(query) ||
      automation.description.toLowerCase().includes(query) ||
      automation.targetDevices.some(device => device.toLowerCase().includes(query))
    )
  }

  return filtered
})

const getStatusLabel = (status) => {
  const labels = {
    running: 'Running',
    scheduled: 'Scheduled',
    failed: 'Failed',
    completed: 'Completed',
    paused: 'Paused'
  }
  return labels[status] || status
}

const getAvailableActions = (automation) => {
  const actions = []

  switch (automation.status) {
    case 'running':
      actions.push(
        { type: 'pause', icon: '⏸', variant: 'warning', title: 'Pause' },
        { type: 'details', icon: '👁', variant: 'secondary', title: 'View Details' }
      )
      break
    case 'scheduled':
      actions.push(
        { type: 'run-now', icon: '▶', variant: 'primary', title: 'Run Now' },
        { type: 'edit', icon: '✏', variant: 'secondary', title: 'Edit' },
        { type: 'cancel', icon: '✕', variant: 'danger', title: 'Cancel' }
      )
      break
    case 'failed':
      actions.push(
        { type: 'retry', icon: '↻', variant: 'primary', title: 'Retry' },
        { type: 'details', icon: '👁', variant: 'secondary', title: 'View Details' }
      )
      break
    case 'paused':
      actions.push(
        { type: 'resume', icon: '▶', variant: 'primary', title: 'Resume' },
        { type: 'cancel', icon: '✕', variant: 'danger', title: 'Cancel' }
      )
      break
  }

  return actions
}

const refreshAutomations = () => {
  emit('action', { type: 'refresh' })
}
</script>

<style scoped>
.active-automations {
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

.action-btn.primary {
  background: var(--color-primary, #0078d4);
  color: white;
  border-color: var(--color-primary, #0078d4);
}

.action-btn.primary:hover {
  background: var(--color-primary-hover, #106ebe);
}

.btn-icon {
  font-size: 14px;
}

.automations-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filters-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--color-surface-2, #f8f9fa);
  border-radius: var(--border-radius, 4px);
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid transparent;
  border-radius: var(--border-radius, 4px);
  background: transparent;
  color: var(--color-text-secondary, #605e5c);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-tab:hover {
  background: var(--color-surface, #ffffff);
  border-color: var(--color-border, #d1d5db);
}

.filter-tab.active {
  background: var(--color-surface, #ffffff);
  border-color: var(--color-primary, #0078d4);
  color: var(--color-primary, #0078d4);
}

.filter-count {
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-3, #e5e7eb);
  color: var(--color-text, #323130);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

.filter-count.running {
  background: #e6f3ff;
  color: var(--color-primary, #0078d4);
}

.filter-count.failed {
  background: #fef2f2;
  color: var(--color-danger, #d13438);
}

.search-box {
  position: relative;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 32px;
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: var(--border-radius, 4px);
  background: var(--color-surface, #ffffff);
  color: var(--color-text, #323130);
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary, #0078d4);
  box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.1);
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary, #605e5c);
  font-size: 14px;
}

.automations-table {
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: var(--border-radius, 4px);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 120px 150px 120px 140px;
  background: var(--color-surface-2, #f8f9fa);
  border-bottom: 1px solid var(--color-border, #d1d5db);
}

.header-cell {
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary, #605e5c);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-body {
  background: var(--color-surface, #ffffff);
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 120px 150px 120px 140px;
  border-bottom: 1px solid var(--color-surface-3, #e5e7eb);
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background: var(--color-surface-2, #f8f9fa);
}

.table-row:last-child {
  border-bottom: none;
}

.cell {
  padding: 16px;
  display: flex;
  align-items: center;
}

.task-info {
  min-width: 0;
}

.task-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text, #323130);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-description {
  font-size: 12px;
  color: var(--color-text-secondary, #605e5c);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.status-badge.running {
  background: #e6f3ff;
  color: var(--color-primary, #0078d4);
}

.status-badge.scheduled {
  background: #f0f9f0;
  color: var(--color-success, #107c10);
}

.status-badge.failed {
  background: #fef2f2;
  color: var(--color-danger, #d13438);
}

.status-badge.paused {
  background: #fef8f0;
  color: var(--color-warning, #ff8c00);
}

.status-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.device-info {
  min-width: 0;
}

.device-count {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text, #323130);
  margin-bottom: 2px;
}

.device-preview {
  font-size: 12px;
  color: var(--color-text-secondary, #605e5c);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.eta-info {
  min-width: 0;
}

.eta-time {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text, #323130);
  margin-bottom: 4px;
}

.eta-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: var(--color-surface-3, #e5e7eb);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary, #0078d4);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 11px;
  color: var(--color-text-secondary, #605e5c);
  font-weight: 600;
  min-width: 30px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.table-action-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: var(--border-radius, 4px);
  background: var(--color-surface, #ffffff);
  color: var(--color-text, #323130);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-action-btn:hover {
  background: var(--color-surface-2, #f8f9fa);
}

.table-action-btn.primary {
  background: var(--color-primary, #0078d4);
  color: white;
  border-color: var(--color-primary, #0078d4);
}

.table-action-btn.warning {
  background: var(--color-warning, #ff8c00);
  color: white;
  border-color: var(--color-warning, #ff8c00);
}

.table-action-btn.danger {
  background: var(--color-danger, #d13438);
  color: white;
  border-color: var(--color-danger, #d13438);
}

.empty-state {
  padding: 48px 24px;
  text-align: center;
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
  .active-automations {
    padding: 16px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .filters-bar {
    flex-direction: column;
    gap: 12px;
  }
  
  .filter-tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .header-cell {
    display: none;
  }
  
  .cell {
    padding: 12px 16px;
    border-bottom: 1px solid var(--color-surface-3, #e5e7eb);
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .cell::before {
    content: attr(data-label);
    font-size: 12px;
    font-weight: 600;
    color: var(--color-text-secondary, #605e5c);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .action-buttons {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>