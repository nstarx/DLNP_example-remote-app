<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">Command Center Settings</h2>
        <button class="close-btn" @click="close">
          <span class="close-icon">✕</span>
        </button>
      </div>

      <div class="modal-content">
        <div class="settings-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-btn"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            {{ tab.label }}
          </button>
        </div>

        <div class="settings-content">
          <!-- General Settings -->
          <div v-if="activeTab === 'general'" class="settings-panel">
            <div class="setting-group">
              <h3 class="group-title">Display Preferences</h3>
              
              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" v-model="settings.darkMode" />
                  Enable dark mode
                </label>
              </div>

              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" v-model="settings.compactView" />
                  Use compact view
                </label>
              </div>

              <div class="setting-item">
                <label class="setting-label">Auto-refresh interval</label>
                <select v-model="settings.refreshInterval" class="setting-select">
                  <option value="10000">10 seconds</option>
                  <option value="30000">30 seconds</option>
                  <option value="60000">1 minute</option>
                  <option value="300000">5 minutes</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
            </div>

            <div class="setting-group">
              <h3 class="group-title">Dashboard Layout</h3>
              
              <div class="setting-item">
                <label class="setting-label">Default KPI period</label>
                <select v-model="settings.defaultPeriod" class="setting-select">
                  <option value="24h">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>

              <div class="setting-item">
                <label class="setting-label">Items per page</label>
                <select v-model="settings.itemsPerPage" class="setting-select">
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Notifications -->
          <div v-if="activeTab === 'notifications'" class="settings-panel">
            <div class="setting-group">
              <h3 class="group-title">Browser Notifications</h3>
              
              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" v-model="settings.browserNotifications" />
                  Enable browser notifications
                </label>
              </div>

              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" v-model="settings.soundNotifications" />
                  Play notification sounds
                </label>
              </div>
            </div>

            <div class="setting-group">
              <h3 class="group-title">Notification Types</h3>
              
              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" v-model="settings.notifySuccess" />
                  Automation successes
                </label>
              </div>

              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" v-model="settings.notifyFailures" />
                  Automation failures
                </label>
              </div>

              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" v-model="settings.notifyInsights" />
                  New AI insights
                </label>
              </div>

              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" v-model="settings.notifyPolicyChanges" />
                  Policy changes
                </label>
              </div>
            </div>
          </div>

          <!-- Security -->
          <div v-if="activeTab === 'security'" class="settings-panel">
            <div class="setting-group">
              <h3 class="group-title">Session Management</h3>
              
              <div class="setting-item">
                <label class="setting-label">Auto-logout after inactivity</label>
                <select v-model="settings.sessionTimeout" class="setting-select">
                  <option value="900000">15 minutes</option>
                  <option value="1800000">30 minutes</option>
                  <option value="3600000">1 hour</option>
                  <option value="7200000">2 hours</option>
                  <option value="false">Disabled</option>
                </select>
              </div>

              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" v-model="settings.requireApprovalForCritical" />
                  Require approval for critical operations
                </label>
              </div>
            </div>

            <div class="setting-group">
              <h3 class="group-title">Audit & Compliance</h3>
              
              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" v-model="settings.auditLogging" />
                  Enable detailed audit logging
                </label>
              </div>

              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" v-model="settings.exportLogs" />
                  Allow log exports
                </label>
              </div>
            </div>
          </div>

          <!-- Advanced -->
          <div v-if="activeTab === 'advanced'" class="settings-panel">
            <div class="setting-group">
              <h3 class="group-title">API Configuration</h3>
              
              <div class="setting-item">
                <label class="setting-label">API Endpoint</label>
                <input
                  type="url"
                  v-model="settings.apiEndpoint"
                  class="setting-input"
                  placeholder="https://api.example.com"
                />
              </div>

              <div class="setting-item">
                <label class="setting-label">Request timeout (seconds)</label>
                <input
                  type="number"
                  v-model.number="settings.requestTimeout"
                  class="setting-input"
                  min="5"
                  max="300"
                />
              </div>
            </div>

            <div class="setting-group">
              <h3 class="group-title">Debug Options</h3>
              
              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" v-model="settings.debugMode" />
                  Enable debug mode
                </label>
              </div>

              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" v-model="settings.showPerformanceMetrics" />
                  Show performance metrics
                </label>
              </div>
            </div>

            <div class="setting-group">
              <h3 class="group-title">Data Management</h3>
              
              <div class="setting-actions">
                <button class="setting-action-btn secondary" @click="exportSettings">
                  <span class="btn-icon">📥</span>
                  Export Settings
                </button>
                <button class="setting-action-btn secondary" @click="importSettings">
                  <span class="btn-icon">📤</span>
                  Import Settings
                </button>
                <button class="setting-action-btn danger" @click="resetSettings">
                  <span class="btn-icon">🔄</span>
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="footer-btn secondary" @click="close">
          Cancel
        </button>
        <button class="footer-btn primary" @click="saveSettings">
          Save Settings
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'save'])

const activeTab = ref('general')

const tabs = [
  { id: 'general', label: 'General', icon: '⚙️' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'security', label: 'Security', icon: '🔒' },
  { id: 'advanced', label: 'Advanced', icon: '🔧' }
]

const settings = reactive({
  // General
  darkMode: false,
  compactView: false,
  refreshInterval: 30000,
  defaultPeriod: '7d',
  itemsPerPage: 20,
  
  // Notifications
  browserNotifications: true,
  soundNotifications: false,
  notifySuccess: false,
  notifyFailures: true,
  notifyInsights: true,
  notifyPolicyChanges: true,
  
  // Security
  sessionTimeout: 1800000,
  requireApprovalForCritical: true,
  auditLogging: true,
  exportLogs: false,
  
  // Advanced
  apiEndpoint: '',
  requestTimeout: 30,
  debugMode: false,
  showPerformanceMetrics: false
})

const close = () => {
  emit('update:modelValue', false)
}

const saveSettings = () => {
  emit('save', { ...settings })
  close()
}

const exportSettings = () => {
  const dataStr = JSON.stringify(settings, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'automation-center-settings.json'
  link.click()
  URL.revokeObjectURL(url)
}

const importSettings = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result)
          Object.assign(settings, importedSettings)
        } catch (error) {
          alert('Invalid settings file')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

const resetSettings = () => {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    Object.assign(settings, {
      darkMode: false,
      compactView: false,
      refreshInterval: 30000,
      defaultPeriod: '7d',
      itemsPerPage: 20,
      browserNotifications: true,
      soundNotifications: false,
      notifySuccess: false,
      notifyFailures: true,
      notifyInsights: true,
      notifyPolicyChanges: true,
      sessionTimeout: 1800000,
      requireApprovalForCritical: true,
      auditLogging: true,
      exportLogs: false,
      apiEndpoint: '',
      requestTimeout: 30,
      debugMode: false,
      showPerformanceMetrics: false
    })
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: var(--color-surface, #ffffff);
  border-radius: var(--border-radius, 4px);
  box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--color-border, #d1d5db);
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text, #323130);
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary, #605e5c);
  cursor: pointer;
  border-radius: var(--border-radius, 4px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--color-surface-2, #f8f9fa);
  color: var(--color-text, #323130);
}

.close-icon {
  font-size: 16px;
}

.modal-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.settings-tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border, #d1d5db);
  background: var(--color-surface-2, #f8f9fa);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary, #605e5c);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
}

.tab-btn:hover {
  background: var(--color-surface, #ffffff);
  color: var(--color-text, #323130);
}

.tab-btn.active {
  background: var(--color-surface, #ffffff);
  color: var(--color-primary, #0078d4);
  border-bottom-color: var(--color-primary, #0078d4);
}

.tab-icon {
  font-size: 16px;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.settings-panel {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.group-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #323130);
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-surface-3, #e5e7eb);
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text, #323130);
  font-weight: 500;
  cursor: pointer;
}

.setting-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary, #0078d4);
}

.setting-select,
.setting-input {
  padding: 8px 12px;
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: var(--border-radius, 4px);
  background: var(--color-surface, #ffffff);
  color: var(--color-text, #323130);
  font-size: 14px;
  max-width: 300px;
}

.setting-select:focus,
.setting-input:focus {
  outline: none;
  border-color: var(--color-primary, #0078d4);
  box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.1);
}

.setting-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.setting-action-btn {
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

.setting-action-btn:hover {
  background: var(--color-surface-2, #f8f9fa);
}

.setting-action-btn.danger {
  border-color: var(--color-danger, #d13438);
  color: var(--color-danger, #d13438);
}

.setting-action-btn.danger:hover {
  background: #fef2f2;
}

.btn-icon {
  font-size: 14px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid var(--color-border, #d1d5db);
  background: var(--color-surface-2, #f8f9fa);
}

.footer-btn {
  padding: 10px 20px;
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: var(--border-radius, 4px);
  background: var(--color-surface, #ffffff);
  color: var(--color-text, #323130);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.footer-btn:hover {
  background: var(--color-surface-2, #f8f9fa);
}

.footer-btn.primary {
  background: var(--color-primary, #0078d4);
  color: white;
  border-color: var(--color-primary, #0078d4);
}

.footer-btn.primary:hover {
  background: var(--color-primary-hover, #106ebe);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px;
  }
  
  .modal-container {
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 16px;
  }
  
  .settings-tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .tab-btn {
    padding: 12px 16px;
    white-space: nowrap;
  }
  
  .settings-content {
    padding: 16px;
  }
  
  .setting-select,
  .setting-input {
    max-width: 100%;
  }
  
  .modal-footer {
    padding: 16px;
    flex-direction: column;
  }
  
  .footer-btn {
    width: 100%;
  }
}
</style>