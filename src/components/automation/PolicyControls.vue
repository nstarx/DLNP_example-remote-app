<template>
  <div class="policy-controls">
    <div class="section-header">
      <h2 class="section-title">Automation Policies</h2>
      <div class="header-actions">
        <button class="action-btn secondary" @click="exportPolicies">
          <span class="btn-icon">📥</span>
          Export
        </button>
        <button class="action-btn secondary" @click="resetToDefaults" v-if="hasChanges">
          <span class="btn-icon">↻</span>
          Reset
        </button>
        <button class="action-btn primary" @click="savePolicies" v-if="hasChanges">
          <span class="btn-icon">💾</span>
          Save Changes
        </button>
      </div>
    </div>

    <div class="policies-content">
      <!-- General Automation Policies -->
      <div class="policy-group">
        <div class="group-header">
          <h3 class="group-title">
            <span class="group-icon">⚡</span>
            General Automation
          </h3>
          <div class="group-description">
            Control automatic execution of common maintenance tasks
          </div>
        </div>

        <div class="policy-items">
          <div class="policy-item">
            <div class="policy-info">
              <div class="policy-title">Auto-approve safe remediations</div>
              <div class="policy-description">
                Automatically execute low-risk fixes like cache clearing, temporary file cleanup, and service restarts
              </div>
              <div class="policy-examples">
                Examples: Clear browser cache, restart stuck services, clean temp files
              </div>
            </div>
            <div class="policy-control">
              <ToggleSwitch
                v-model="localPolicies.autoApproveSafe"
                :disabled="!canModify('autoApproveSafe')"
                @change="markChanged"
              />
            </div>
          </div>

          <div class="policy-item">
            <div class="policy-info">
              <div class="policy-title">Auto-remediate known issues</div>
              <div class="policy-description">
                Automatically fix recurring problems that have been successfully resolved before
              </div>
              <div class="policy-examples">
                Examples: Driver reinstalls, network connectivity fixes, registry repairs
              </div>
            </div>
            <div class="policy-control">
              <ToggleSwitch
                v-model="localPolicies.autoRemediateKnown"
                :disabled="!canModify('autoRemediateKnown')"
                @change="markChanged"
              />
            </div>
          </div>

          <div class="policy-item">
            <div class="policy-info">
              <div class="policy-title">Proactive maintenance</div>
              <div class="policy-description">
                Automatically perform preventive maintenance based on usage patterns and system health
              </div>
              <div class="policy-examples">
                Examples: Disk cleanup, registry optimization, update installations
              </div>
            </div>
            <div class="policy-control">
              <ToggleSwitch
                v-model="localPolicies.proactiveMaintenance"
                :disabled="!canModify('proactiveMaintenance')"
                @change="markChanged"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Security & Compliance -->
      <div class="policy-group">
        <div class="group-header">
          <h3 class="group-title">
            <span class="group-icon">🔒</span>
            Security & Compliance
          </h3>
          <div class="group-description">
            Security-related automation policies and approval requirements
          </div>
        </div>

        <div class="policy-items">
          <div class="policy-item">
            <div class="policy-info">
              <div class="policy-title">Require manual review for security tasks</div>
              <div class="policy-description">
                All security-related automations require explicit approval before execution
              </div>
              <div class="policy-examples">
                Examples: Firewall changes, user permission updates, security patches
              </div>
            </div>
            <div class="policy-control">
              <ToggleSwitch
                v-model="localPolicies.requireSecurityApproval"
                :disabled="!canModify('requireSecurityApproval')"
                @change="markChanged"
              />
            </div>
          </div>

          <div class="policy-item">
            <div class="policy-info">
              <div class="policy-title">Auto-install critical security updates</div>
              <div class="policy-description">
                Automatically install high-priority security patches during maintenance windows
              </div>
              <div class="policy-examples">
                Examples: Zero-day vulnerability patches, critical OS updates
              </div>
            </div>
            <div class="policy-control">
              <ToggleSwitch
                v-model="localPolicies.autoSecurityUpdates"
                :disabled="!canModify('autoSecurityUpdates')"
                @change="markChanged"
              />
            </div>
          </div>

          <div class="policy-item">
            <div class="policy-info">
              <div class="policy-title">Compliance monitoring</div>
              <div class="policy-description">
                Automatically check and remediate compliance violations
              </div>
              <div class="policy-examples">
                Examples: Password policy enforcement, software licensing checks
              </div>
            </div>
            <div class="policy-control">
              <ToggleSwitch
                v-model="localPolicies.complianceMonitoring"
                :disabled="!canModify('complianceMonitoring')"
                @change="markChanged"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Scheduling & Timing -->
      <div class="policy-group">
        <div class="group-header">
          <h3 class="group-title">
            <span class="group-icon">📅</span>
            Scheduling & Timing
          </h3>
          <div class="group-description">
            Control when automated tasks can run to minimize business disruption
          </div>
        </div>

        <div class="policy-items">
          <div class="policy-item">
            <div class="policy-info">
              <div class="policy-title">Maintenance window restrictions</div>
              <div class="policy-description">
                Restrict disruptive automations to designated maintenance windows
              </div>
              <div class="schedule-settings" v-if="localPolicies.maintenanceWindows">
                <div class="schedule-item">
                  <span class="schedule-label">Weekdays:</span>
                  <span class="schedule-value">{{ localPolicies.maintenanceWindows.weekdays }}</span>
                  <button class="edit-schedule-btn" @click="editSchedule('weekdays')">Edit</button>
                </div>
                <div class="schedule-item">
                  <span class="schedule-label">Weekends:</span>
                  <span class="schedule-value">{{ localPolicies.maintenanceWindows.weekends }}</span>
                  <button class="edit-schedule-btn" @click="editSchedule('weekends')">Edit</button>
                </div>
              </div>
            </div>
            <div class="policy-control">
              <ToggleSwitch
                v-model="localPolicies.respectMaintenanceWindows"
                :disabled="!canModify('respectMaintenanceWindows')"
                @change="markChanged"
              />
            </div>
          </div>

          <div class="policy-item">
            <div class="policy-info">
              <div class="policy-title">Business hours protection</div>
              <div class="policy-description">
                Prevent high-impact automations during business hours (9 AM - 5 PM)
              </div>
              <div class="policy-examples">
                Examples: System reboots, major software installations, network changes
              </div>
            </div>
            <div class="policy-control">
              <ToggleSwitch
                v-model="localPolicies.businessHoursProtection"
                :disabled="!canModify('businessHoursProtection')"
                @change="markChanged"
              />
            </div>
          </div>

          <div class="policy-item">
            <div class="policy-info">
              <div class="policy-title">Batch automation execution</div>
              <div class="policy-description">
                Group similar automations together to reduce overall system impact
              </div>
              <div class="policy-examples">
                Examples: Combine multiple updates, coordinate related fixes
              </div>
            </div>
            <div class="policy-control">
              <ToggleSwitch
                v-model="localPolicies.batchExecution"
                :disabled="!canModify('batchExecution')"
                @change="markChanged"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications & Reporting -->
      <div class="policy-group">
        <div class="group-header">
          <h3 class="group-title">
            <span class="group-icon">📢</span>
            Notifications & Reporting
          </h3>
          <div class="group-description">
            Configure how and when you receive automation updates
          </div>
        </div>

        <div class="policy-items">
          <div class="policy-item">
            <div class="policy-info">
              <div class="policy-title">Real-time notifications</div>
              <div class="policy-description">
                Receive immediate notifications for automation successes and failures
              </div>
              <div class="notification-settings" v-if="localPolicies.notificationChannels">
                <div class="notification-channels">
                  <label class="channel-option">
                    <input
                      type="checkbox"
                      v-model="localPolicies.notificationChannels.email"
                      @change="markChanged"
                    />
                    Email
                  </label>
                  <label class="channel-option">
                    <input
                      type="checkbox"
                      v-model="localPolicies.notificationChannels.teams"
                      @change="markChanged"
                    />
                    Teams
                  </label>
                  <label class="channel-option">
                    <input
                      type="checkbox"
                      v-model="localPolicies.notificationChannels.slack"
                      @change="markChanged"
                    />
                    Slack
                  </label>
                </div>
              </div>
            </div>
            <div class="policy-control">
              <ToggleSwitch
                v-model="localPolicies.realTimeNotifications"
                :disabled="!canModify('realTimeNotifications')"
                @change="markChanged"
              />
            </div>
          </div>

          <div class="policy-item">
            <div class="policy-info">
              <div class="policy-title">Weekly summary reports</div>
              <div class="policy-description">
                Receive comprehensive weekly reports on automation activity and performance
              </div>
              <div class="report-settings" v-if="localPolicies.weeklyReports">
                <div class="report-day">
                  <span class="report-label">Delivery day:</span>
                  <select
                    v-model="localPolicies.weeklyReportDay"
                    class="report-select"
                    @change="markChanged"
                  >
                    <option value="monday">Monday</option>
                    <option value="friday">Friday</option>
                    <option value="sunday">Sunday</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="policy-control">
              <ToggleSwitch
                v-model="localPolicies.weeklyReports"
                :disabled="!canModify('weeklyReports')"
                @change="markChanged"
              />
            </div>
          </div>

          <div class="policy-item">
            <div class="policy-info">
              <div class="policy-title">Failure escalation</div>
              <div class="policy-description">
                Automatically escalate repeated automation failures to senior IT staff
              </div>
              <div class="escalation-settings" v-if="localPolicies.failureEscalation">
                <div class="escalation-threshold">
                  <span class="escalation-label">Escalate after:</span>
                  <select
                    v-model="localPolicies.escalationThreshold"
                    class="escalation-select"
                    @change="markChanged"
                  >
                    <option value="2">2 failures</option>
                    <option value="3">3 failures</option>
                    <option value="5">5 failures</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="policy-control">
              <ToggleSwitch
                v-model="localPolicies.failureEscalation"
                :disabled="!canModify('failureEscalation')"
                @change="markChanged"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Policy Status -->
      <div class="policy-status" v-if="hasChanges">
        <div class="status-content">
          <div class="status-icon">⚠</div>
          <div class="status-text">
            <div class="status-title">Unsaved Changes</div>
            <div class="status-description">
              You have {{ changedPolicies.length }} unsaved policy changes.
              Don't forget to save your changes.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ToggleSwitch from '@/components/common/ToggleSwitch.vue'

const props = defineProps({
  policies: {
    type: Object,
    required: true
  },
  permissions: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update', 'export', 'reset'])

// Local copy of policies for editing
const localPolicies = ref({ ...props.policies })
const originalPolicies = ref({ ...props.policies })
const changedPolicies = ref([])

// Watch for external policy updates
watch(() => props.policies, (newPolicies) => {
  localPolicies.value = { ...newPolicies }
  originalPolicies.value = { ...newPolicies }
  changedPolicies.value = []
}, { deep: true })

const hasChanges = computed(() => changedPolicies.value.length > 0)

const canModify = (policyKey) => {
  return props.permissions[policyKey] !== false
}

const markChanged = () => {
  // Find all changed policies
  const changed = []
  for (const key in localPolicies.value) {
    if (JSON.stringify(localPolicies.value[key]) !== JSON.stringify(originalPolicies.value[key])) {
      changed.push(key)
    }
  }
  changedPolicies.value = changed
}

const savePolicies = () => {
  emit('update', { ...localPolicies.value })
  originalPolicies.value = { ...localPolicies.value }
  changedPolicies.value = []
}

const resetToDefaults = () => {
  localPolicies.value = { ...originalPolicies.value }
  changedPolicies.value = []
}

const exportPolicies = () => {
  emit('export', localPolicies.value)
}

const editSchedule = (type) => {
  // This would open a schedule editing modal
  console.log('Edit schedule for:', type)
}
</script>

<style scoped>
.policy-controls {
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

.policies-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.policy-group {
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: var(--border-radius, 4px);
  background: var(--color-surface, #ffffff);
  overflow: hidden;
}

.group-header {
  padding: 20px 24px;
  background: var(--color-surface-2, #f8f9fa);
  border-bottom: 1px solid var(--color-border, #d1d5db);
}

.group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #323130);
  margin: 0 0 8px 0;
}

.group-icon {
  font-size: 18px;
}

.group-description {
  font-size: 14px;
  color: var(--color-text-secondary, #605e5c);
  line-height: 1.4;
}

.policy-items {
  padding: 0;
}

.policy-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
  border-bottom: 1px solid var(--color-surface-3, #e5e7eb);
  gap: 24px;
}

.policy-item:last-child {
  border-bottom: none;
}

.policy-info {
  flex: 1;
  min-width: 0;
}

.policy-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #323130);
  margin-bottom: 8px;
  line-height: 1.2;
}

.policy-description {
  font-size: 14px;
  color: var(--color-text, #323130);
  line-height: 1.4;
  margin-bottom: 8px;
}

.policy-examples {
  font-size: 13px;
  color: var(--color-text-secondary, #605e5c);
  font-style: italic;
  line-height: 1.3;
}

.policy-control {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

/* Sub-settings */
.schedule-settings,
.notification-settings,
.report-settings,
.escalation-settings {
  margin-top: 12px;
  padding: 12px;
  background: var(--color-surface-2, #f8f9fa);
  border-radius: var(--border-radius, 4px);
  border: 1px solid var(--color-surface-3, #e5e7eb);
}

.schedule-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.schedule-item:last-child {
  margin-bottom: 0;
}

.schedule-label,
.report-label,
.escalation-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary, #605e5c);
  min-width: 80px;
}

.schedule-value {
  font-size: 13px;
  color: var(--color-text, #323130);
  font-weight: 600;
  flex: 1;
}

.edit-schedule-btn {
  padding: 4px 8px;
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: var(--border-radius, 4px);
  background: var(--color-surface, #ffffff);
  color: var(--color-text, #323130);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-schedule-btn:hover {
  background: var(--color-surface-2, #f8f9fa);
  border-color: var(--color-primary, #0078d4);
}

.notification-channels {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.channel-option {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text, #323130);
  cursor: pointer;
}

.channel-option input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary, #0078d4);
}

.report-day,
.escalation-threshold {
  display: flex;
  align-items: center;
  gap: 8px;
}

.report-select,
.escalation-select {
  padding: 4px 8px;
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: var(--border-radius, 4px);
  background: var(--color-surface, #ffffff);
  color: var(--color-text, #323130);
  font-size: 13px;
}

.report-select:focus,
.escalation-select:focus {
  outline: none;
  border-color: var(--color-primary, #0078d4);
  box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.1);
}

.policy-status {
  position: sticky;
  bottom: 24px;
  background: #fef8f0;
  border: 1px solid var(--color-warning, #ff8c00);
  border-radius: var(--border-radius, 4px);
  padding: 16px;
  box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
}

.status-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-icon {
  font-size: 20px;
  color: var(--color-warning, #ff8c00);
}

.status-text {
  flex: 1;
}

.status-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text, #323130);
  margin-bottom: 4px;
}

.status-description {
  font-size: 13px;
  color: var(--color-text-secondary, #605e5c);
  line-height: 1.3;
}

/* Responsive */
@media (max-width: 768px) {
  .policy-controls {
    padding: 16px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .policies-content {
    gap: 24px;
  }
  
  .group-header {
    padding: 16px;
  }
  
  .policy-item {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    align-items: stretch;
  }
  
  .policy-control {
    align-self: flex-end;
  }
  
  .schedule-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .notification-channels {
    flex-direction: column;
    gap: 8px;
  }
  
  .policy-status {
    bottom: 16px;
    margin: 0 -16px;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
}
</style>