<template>
  <div v-if="modelValue" class="automation-trigger-modal-overlay" @click="closeModal">
    <div class="automation-trigger-modal" @click.stop>
      <div class="modal-header">
        <div class="header-content">
          <div class="automation-icon">
            <CogIcon class="spinning" />
          </div>
          <div class="header-text">
            <h2>{{ trigger?.title || 'Automation Trigger' }}</h2>
            <span class="trigger-type">{{ getTriggerTypeLabel(trigger?.type) }}</span>
          </div>
        </div>
        
        <div class="header-actions">
          <div class="urgency-indicator" :class="getUrgencyClass(trigger?.urgency || 'medium')">
            <span class="urgency-dot"></span>
            <span class="urgency-text">{{ trigger?.urgency || 'Medium' }} Priority</span>
          </div>
          
          <button @click="closeModal" class="close-btn">
            <CloseIcon />
          </button>
        </div>
      </div>
      
      <div class="modal-content">
        <!-- Trigger Description -->
        <div class="trigger-description">
          <h3>Situation Analysis</h3>
          <p class="description-text">{{ trigger?.description }}</p>
          
          <div v-if="trigger?.context" class="context-details">
            <h4>Context & Impact</h4>
            <div class="context-grid">
              <div class="context-item" v-if="trigger.context.affectedSystems">
                <span class="context-label">Affected Systems:</span>
                <span class="context-value">{{ trigger.context.affectedSystems.join(', ') }}</span>
              </div>
              <div class="context-item" v-if="trigger.context.estimatedImpact">
                <span class="context-label">Estimated Impact:</span>
                <span class="context-value" :class="getImpactClass(trigger.context.estimatedImpact)">
                  {{ trigger.context.estimatedImpact }}
                </span>
              </div>
              <div class="context-item" v-if="trigger.context.timeframe">
                <span class="context-label">Time to Resolution:</span>
                <span class="context-value">{{ trigger.context.timeframe }}</span>
              </div>
              <div class="context-item" v-if="trigger.context.confidence">
                <span class="context-label">AI Confidence:</span>
                <span class="context-value">{{ Math.round(trigger.context.confidence * 100) }}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Available Actions -->
        <div class="automation-actions">
          <h3>Recommended Actions</h3>
          <p class="actions-subtitle">Select the actions you want to execute automatically:</p>
          
          <div class="actions-list">
            <div
              v-for="action in trigger?.actions || []"
              :key="action.id"
              class="action-item"
              :class="{ 
                selected: selectedActions.includes(action.id),
                recommended: action.recommended,
                risky: action.risk === 'high'
              }"
            >
              <div class="action-checkbox">
                <input
                  type="checkbox"
                  :id="`action-${action.id}`"
                  :value="action.id"
                  v-model="selectedActions"
                  class="checkbox-input"
                />
                <label :for="`action-${action.id}`" class="checkbox-label">
                  <CheckIcon class="check-icon" />
                </label>
              </div>
              
              <div class="action-content">
                <div class="action-header">
                  <div class="action-title">{{ action.title }}</div>
                  <div class="action-badges">
                    <span v-if="action.recommended" class="badge recommended">Recommended</span>
                    <span v-if="action.automated" class="badge automated">Automated</span>
                    <span v-if="action.risk === 'high'" class="badge risky">High Risk</span>
                  </div>
                </div>
                
                <div class="action-description">{{ action.description }}</div>
                
                <div class="action-details">
                  <div class="detail-item" v-if="action.estimatedTime">
                    <ClockIcon class="icon" />
                    <span>{{ action.estimatedTime }}</span>
                  </div>
                  <div class="detail-item" v-if="action.requiredResources">
                    <UsersIcon class="icon" />
                    <span>{{ action.requiredResources }}</span>
                  </div>
                  <div class="detail-item" v-if="action.successRate">
                    <TrendingUpIcon class="icon" />
                    <span>{{ action.successRate }}% success rate</span>
                  </div>
                </div>
                
                <!-- Risk Warning -->
                <div v-if="action.risk === 'high'" class="risk-warning">
                  <AlertTriangleIcon class="warning-icon" />
                  <div class="warning-text">
                    <strong>High Risk Action:</strong> {{ action.riskDescription }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Execution Timeline -->
        <div v-if="selectedActions.length > 0" class="execution-timeline">
          <h3>Execution Timeline</h3>
          <div class="timeline-preview">
            <div
              v-for="(step, index) in getExecutionSteps()"
              :key="index"
              class="timeline-step"
            >
              <div class="step-marker">
                <span class="step-number">{{ index + 1 }}</span>
              </div>
              <div class="step-content">
                <div class="step-title">{{ step.title }}</div>
                <div class="step-duration">{{ step.duration }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Rollback Plan -->
        <div v-if="hasRiskyActions" class="rollback-plan">
          <h3>Rollback Plan</h3>
          <div class="rollback-content">
            <div class="rollback-icon">
              <ShieldCheckIcon />
            </div>
            <div class="rollback-text">
              <p>If automation fails or causes issues, the system will automatically:</p>
              <ul class="rollback-steps">
                <li>Halt execution immediately</li>
                <li>Restore previous configurations</li>
                <li>Alert operations team</li>
                <li>Generate detailed failure report</li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Impact Simulation -->
        <div class="impact-simulation">
          <h3>Expected Impact</h3>
          <div class="simulation-grid">
            <div class="simulation-item positive">
              <div class="simulation-icon">
                <TrendingUpIcon />
              </div>
              <div class="simulation-content">
                <div class="simulation-label">Performance Improvement</div>
                <div class="simulation-value">+{{ getEstimatedImprovement() }}%</div>
              </div>
            </div>
            
            <div class="simulation-item neutral">
              <div class="simulation-icon">
                <ClockIcon />
              </div>
              <div class="simulation-content">
                <div class="simulation-label">Total Execution Time</div>
                <div class="simulation-value">{{ getTotalExecutionTime() }}</div>
              </div>
            </div>
            
            <div class="simulation-item risk" v-if="hasRiskyActions">
              <div class="simulation-icon">
                <AlertTriangleIcon />
              </div>
              <div class="simulation-content">
                <div class="simulation-label">Risk Level</div>
                <div class="simulation-value">{{ getRiskLevel() }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <div class="footer-info">
          <div class="approval-note">
            <InfoIcon class="info-icon" />
            <span>Actions will be executed with full audit trail and monitoring</span>
          </div>
        </div>
        
        <div class="footer-actions">
          <button @click="scheduleExecution" class="action-btn secondary">
            Schedule Later
          </button>
          <button @click="previewExecution" class="action-btn secondary" :disabled="selectedActions.length === 0">
            Preview Changes
          </button>
          <button 
            @click="executeAutomation" 
            class="action-btn primary"
            :disabled="selectedActions.length === 0 || executing"
            :class="{ executing }"
          >
            <span v-if="executing">
              <SpinnerIcon class="spinner" />
              Executing...
            </span>
            <span v-else>
              Execute {{ selectedActions.length }} Action{{ selectedActions.length !== 1 ? 's' : '' }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import CogIcon from '@/components/icons/CogIcon.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import CheckIcon from '@/components/icons/CheckIcon.vue'
import ClockIcon from '@/components/icons/ClockIcon.vue'
import UsersIcon from '@/components/icons/UsersIcon.vue'
import TrendingUpIcon from '@/components/icons/TrendingUpIcon.vue'
import AlertTriangleIcon from '@/components/icons/AlertTriangleIcon.vue'
import ShieldCheckIcon from '@/components/icons/ShieldCheckIcon.vue'
import InfoIcon from '@/components/icons/InfoIcon.vue'
import SpinnerIcon from '@/components/icons/SpinnerIcon.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  trigger: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'execute', 'schedule', 'preview'])

// State
const selectedActions = ref([])
const executing = ref(false)

// Computed
const hasRiskyActions = computed(() => {
  if (!props.trigger?.actions) return false
  return selectedActions.value.some(actionId => {
    const action = props.trigger.actions.find(a => a.id === actionId)
    return action?.risk === 'high'
  })
})

// Methods
const closeModal = () => {
  emit('update:modelValue', false)
  selectedActions.value = []
}

const getTriggerTypeLabel = (type) => {
  const labels = {
    resource_scaling: 'Resource Scaling',
    system_optimization: 'System Optimization',
    workflow_adjustment: 'Workflow Adjustment',
    priority_escalation: 'Priority Escalation',
    load_balancing: 'Load Balancing',
    maintenance_scheduling: 'Maintenance Scheduling'
  }
  return labels[type] || 'Automation'
}

const getUrgencyClass = (urgency) => {
  return {
    'urgency-critical': urgency === 'critical',
    'urgency-high': urgency === 'high',
    'urgency-medium': urgency === 'medium',
    'urgency-low': urgency === 'low'
  }
}

const getImpactClass = (impact) => {
  if (typeof impact === 'string') {
    if (impact.toLowerCase().includes('high') || impact.toLowerCase().includes('critical')) return 'high-impact'
    if (impact.toLowerCase().includes('medium') || impact.toLowerCase().includes('moderate')) return 'medium-impact'
    return 'low-impact'
  }
  return 'neutral-impact'
}

const getExecutionSteps = () => {
  if (!props.trigger?.actions) return []
  
  return selectedActions.value.map((actionId, index) => {
    const action = props.trigger.actions.find(a => a.id === actionId)
    return {
      title: action?.title || `Action ${index + 1}`,
      duration: action?.estimatedTime || '2-3 minutes'
    }
  })
}

const getEstimatedImprovement = () => {
  if (!selectedActions.value.length) return 0
  return Math.min(selectedActions.value.length * 15 + Math.floor(Math.random() * 20), 85)
}

const getTotalExecutionTime = () => {
  if (!selectedActions.value.length) return '0 minutes'
  
  const totalMinutes = selectedActions.value.reduce((total, actionId) => {
    const action = props.trigger?.actions?.find(a => a.id === actionId)
    if (action?.estimatedTime) {
      const match = action.estimatedTime.match(/(\d+)/)
      return total + (match ? parseInt(match[1]) : 2)
    }
    return total + 2
  }, 0)
  
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours}h ${minutes}m`
  }
  
  return `${totalMinutes} minutes`
}

const getRiskLevel = () => {
  if (!hasRiskyActions.value) return 'Low'
  
  const highRiskCount = selectedActions.value.filter(actionId => {
    const action = props.trigger?.actions?.find(a => a.id === actionId)
    return action?.risk === 'high'
  }).length
  
  if (highRiskCount >= 2) return 'High'
  return 'Medium'
}

const executeAutomation = async () => {
  if (selectedActions.value.length === 0) return
  
  executing.value = true
  
  try {
    // Simulate execution time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    emit('execute', {
      trigger: props.trigger,
      selectedActions: selectedActions.value.map(actionId => 
        props.trigger.actions.find(a => a.id === actionId)
      )
    })
    
    closeModal()
  } catch (error) {
    console.error('Automation execution failed:', error)
  } finally {
    executing.value = false
  }
}

const scheduleExecution = () => {
  emit('schedule', {
    trigger: props.trigger,
    selectedActions: selectedActions.value
  })
  closeModal()
}

const previewExecution = () => {
  emit('preview', {
    trigger: props.trigger,
    selectedActions: selectedActions.value
  })
}

// Auto-select recommended actions when modal opens
watch(() => props.modelValue, (isOpen) => {
  if (isOpen && props.trigger?.actions) {
    selectedActions.value = props.trigger.actions
      .filter(action => action.recommended && !action.risk)
      .map(action => action.id)
  }
})
</script>

<style scoped>
.automation-trigger-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4000;
  padding: 20px;
}

.automation-trigger-modal {
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 28px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.automation-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.automation-icon .spinning {
  width: 24px;
  height: 24px;
  animation: spin 3s linear infinite;
}

.header-text h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: white;
}

.trigger-type {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.urgency-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
}

.urgency-indicator.urgency-critical {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.urgency-indicator.urgency-high {
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid rgba(245, 158, 11, 0.4);
}

.urgency-indicator.urgency-medium {
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.4);
}

.urgency-indicator.urgency-low {
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.urgency-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
}

.modal-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.modal-content h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 16px 0 8px 0;
}

.trigger-description {
  margin-bottom: 32px;
}

.description-text {
  font-size: 16px;
  color: #4b5563;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.context-details {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}

.context-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.context-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.context-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.context-value {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.context-value.high-impact { color: #dc2626; }
.context-value.medium-impact { color: #d97706; }
.context-value.low-impact { color: #16a34a; }

.automation-actions {
  margin-bottom: 32px;
}

.actions-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 20px 0;
}

.actions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.action-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.action-item:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.action-item.selected {
  border-color: #3b82f6;
  background: #eff6ff;
}

.action-item.recommended {
  border-color: #10b981;
}

.action-item.risky {
  border-color: #f59e0b;
  background: #fffbeb;
}

.action-checkbox {
  position: relative;
  flex-shrink: 0;
  margin-top: 2px;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.checkbox-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.checkbox-input:checked + .checkbox-label {
  background: #3b82f6;
  border-color: #3b82f6;
}

.check-icon {
  width: 12px;
  height: 12px;
  color: white;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.checkbox-input:checked + .checkbox-label .check-icon {
  opacity: 1;
}

.action-content {
  flex: 1;
  min-width: 0;
}

.action-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 12px;
}

.action-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.3;
}

.action-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge.recommended {
  background: rgba(16, 185, 129, 0.1);
  color: #16a34a;
}

.badge.automated {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.badge.risky {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.action-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 12px;
}

.action-details {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
}

.detail-item .icon {
  width: 12px;
  height: 12px;
}

.risk-warning {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: #fef3c7;
  border-radius: 6px;
  border: 1px solid #f59e0b;
}

.warning-icon {
  width: 16px;
  height: 16px;
  color: #d97706;
  flex-shrink: 0;
  margin-top: 1px;
}

.warning-text {
  font-size: 12px;
  color: #92400e;
  line-height: 1.4;
}

.execution-timeline {
  margin-bottom: 32px;
}

.timeline-preview {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.timeline-step {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.timeline-step:last-child {
  margin-bottom: 0;
}

.step-marker {
  width: 24px;
  height: 24px;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-number {
  color: white;
  font-size: 12px;
  font-weight: 600;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.step-duration {
  font-size: 12px;
  color: #64748b;
}

.rollback-plan {
  margin-bottom: 32px;
  background: #f0fdf4;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #bbf7d0;
}

.rollback-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.rollback-icon {
  width: 32px;
  height: 32px;
  color: #16a34a;
  flex-shrink: 0;
}

.rollback-text p {
  font-size: 14px;
  color: #374151;
  margin: 0 0 12px 0;
}

.rollback-steps {
  margin: 0;
  padding-left: 20px;
}

.rollback-steps li {
  font-size: 13px;
  color: #374151;
  margin-bottom: 4px;
}

.impact-simulation {
  margin-bottom: 32px;
}

.simulation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.simulation-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid;
}

.simulation-item.positive {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.simulation-item.neutral {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.simulation-item.risk {
  background: #fef3c7;
  border-color: #fcd34d;
}

.simulation-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.simulation-item.positive .simulation-icon {
  color: #16a34a;
}

.simulation-item.neutral .simulation-icon {
  color: #64748b;
}

.simulation-item.risk .simulation-icon {
  color: #d97706;
}

.simulation-content {
  flex: 1;
}

.simulation-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 2px;
}

.simulation-value {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.footer-info {
  flex: 1;
}

.approval-note {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
}

.info-icon {
  width: 16px;
  height: 16px;
  color: #3b82f6;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
  border: 1px solid #3b82f6;
}

.action-btn.primary:hover:not(:disabled):not(.executing) {
  background: #2563eb;
  border-color: #2563eb;
}

.action-btn.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-btn.primary.executing {
  background: #94a3b8;
  border-color: #94a3b8;
  cursor: not-allowed;
}

.action-btn.secondary {
  background: white;
  color: #64748b;
  border: 1px solid #d1d5db;
}

.action-btn.secondary:hover:not(:disabled) {
  background: #f8fafc;
  color: #374151;
  border-color: #9ca3af;
}

.spinner {
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .automation-trigger-modal {
    margin: 10px;
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 20px;
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .modal-content {
    padding: 20px;
  }
  
  .context-grid,
  .simulation-grid {
    grid-template-columns: 1fr;
  }
  
  .action-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-details {
    flex-direction: column;
    gap: 8px;
  }
  
  .footer-actions {
    flex-direction: column;
  }
}
</style>