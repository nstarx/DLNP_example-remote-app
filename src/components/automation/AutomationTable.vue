<template>
  <div class="automation-table">
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Status</th>
            <th>Devices</th>
            <th>ETA / Progress</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="automation in automations" :key="automation.id" class="table-row">
            <td class="task-cell">
              <div class="task-info">
                <div class="task-name">{{ automation.name }}</div>
                <div class="task-category">{{ automation.category }}</div>
              </div>
            </td>
            
            <td class="status-cell">
              <div class="status-badge" :class="`status-${automation.status}`">
                <span class="status-dot"></span>
                <span class="status-text">{{ getStatusText(automation.status) }}</span>
              </div>
              <div v-if="automation.error" class="error-message">
                {{ automation.error }}
              </div>
            </td>
            
            <td class="devices-cell">
              <span class="devices-count">{{ automation.devices }}</span>
              <span class="devices-label">devices</span>
            </td>
            
            <td class="progress-cell">
              <div v-if="automation.status === 'running'" class="progress-info">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: `${automation.progress}%` }"></div>
                </div>
                <span class="progress-text">{{ automation.progress }}% - {{ automation.eta }}</span>
              </div>
              <div v-else class="eta-text">
                {{ automation.eta }}
              </div>
            </td>
            
            <td class="actions-cell">
              <div class="action-buttons">
                <button 
                  v-if="automation.status === 'scheduled'"
                  class="action-btn primary"
                  @click="$emit('action', 'approve', automation)"
                >
                  Approve
                </button>
                
                <button 
                  v-if="automation.status === 'running'"
                  class="action-btn secondary"
                  @click="$emit('action', 'pause', automation)"
                >
                  Pause
                </button>
                
                <button 
                  v-if="automation.status === 'failed'"
                  class="action-btn primary"
                  @click="$emit('action', 'retry', automation)"
                >
                  Retry
                </button>
                
                <button 
                  v-if="automation.status === 'scheduled'"
                  class="action-btn secondary"
                  @click="$emit('action', 'run', automation)"
                >
                  Run Now
                </button>
                
                <button 
                  class="action-btn tertiary"
                  @click="$emit('action', 'details', automation)"
                >
                  Details
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="automations.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <div class="empty-text">No automations found</div>
      <div class="empty-subtext">Check your filters or create a new automation task</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  automations: {
    type: Array,
    default: () => []
  }
})

defineEmits(['action'])

const getStatusText = (status) => {
  const statusMap = {
    running: 'Running',
    scheduled: 'Scheduled',
    failed: 'Failed',
    completed: 'Completed'
  }
  return statusMap[status] || status
}
</script>

<style scoped>
.automation-table {
  min-height: 300px;
}

.table-container {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table th {
  background: #f8fafc;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.table-row {
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s;
}

.table-row:hover {
  background: #f8fafc;
}

.table td {
  padding: 16px;
  vertical-align: middle;
}

.task-cell {
  min-width: 200px;
}

.task-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.task-name {
  font-weight: 500;
  color: #0f172a;
}

.task-category {
  font-size: 12px;
  color: #64748b;
  text-transform: capitalize;
}

.status-cell {
  min-width: 120px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-running {
  background: #dbeafe;
  color: #1e40af;
}

.status-running .status-dot {
  background: #3b82f6;
  animation: pulse 2s infinite;
}

.status-scheduled {
  background: #fef3c7;
  color: #92400e;
}

.status-scheduled .status-dot {
  background: #f59e0b;
}

.status-failed {
  background: #fee2e2;
  color: #991b1b;
}

.status-failed .status-dot {
  background: #ef4444;
}

.status-completed {
  background: #dcfce7;
  color: #166534;
}

.status-completed .status-dot {
  background: #22c55e;
}

.error-message {
  font-size: 11px;
  color: #ef4444;
  margin-top: 2px;
}

.devices-cell {
  text-align: center;
  min-width: 80px;
}

.devices-count {
  font-weight: 600;
  color: #0f172a;
}

.devices-label {
  font-size: 12px;
  color: #64748b;
  margin-left: 4px;
}

.progress-cell {
  min-width: 150px;
}

.progress-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #0ea5e9;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 11px;
  color: #64748b;
}

.eta-text {
  font-size: 13px;
  color: #475569;
}

.actions-cell {
  min-width: 180px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.action-btn.primary {
  background: #0ea5e9;
  color: white;
}

.action-btn.primary:hover {
  background: #0284c7;
}

.action-btn.secondary {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.action-btn.secondary:hover {
  background: #e2e8f0;
}

.action-btn.tertiary {
  background: transparent;
  color: #64748b;
  border: 1px solid #d1d5db;
}

.action-btn.tertiary:hover {
  background: #f8fafc;
  color: #475569;
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

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@media (max-width: 768px) {
  .table th,
  .table td {
    padding: 12px 8px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
  
  .action-btn {
    width: 100%;
    text-align: center;
  }
}
</style>