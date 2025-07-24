<template>
  <div class="insights-panel">
    <div v-if="insights.length === 0" class="empty-state">
      <div class="empty-icon">🤖</div>
      <div class="empty-text">No insights available</div>
      <div class="empty-subtext">AI insights will appear as patterns are detected</div>
    </div>
    
    <div v-else class="insights-list">
      <div 
        v-for="insight in insights" 
        :key="insight.id" 
        class="insight-card"
        :class="`insight-${insight.type}`"
      >
        <div class="insight-header">
          <div class="insight-type">
            <span class="type-icon">{{ getTypeIcon(insight.type) }}</span>
            <span class="type-text">{{ getTypeText(insight.type) }}</span>
          </div>
          <div class="insight-priority" :class="`priority-${insight.priority}`">
            {{ insight.priority }}
          </div>
        </div>
        
        <div class="insight-content">
          <h3 class="insight-title">{{ insight.title }}</h3>
          <p class="insight-description">{{ insight.description }}</p>
        </div>
        
        <div class="insight-footer">
          <div class="confidence-indicator">
            <span class="confidence-label">Confidence:</span>
            <div class="confidence-bar">
              <div 
                class="confidence-fill" 
                :class="`confidence-${insight.confidence}`"
                :style="{ width: getConfidenceWidth(insight.confidence) }"
              ></div>
            </div>
            <span class="confidence-text">{{ insight.confidence }}</span>
          </div>
          
          <div class="insight-actions">
            <button 
              class="action-btn primary"
              @click="$emit('takeAction', insight)"
            >
              {{ insight.action }}
            </button>
            <button 
              class="action-btn secondary"
              @click="$emit('dismissInsight', insight.id)"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  insights: {
    type: Array,
    default: () => []
  }
})

defineEmits(['takeAction', 'dismissInsight'])

const getTypeIcon = (type) => {
  const icons = {
    suggestion: '💡',
    alert: '⚠️',
    optimization: '⚡',
    warning: '🔔'
  }
  return icons[type] || '🤖'
}

const getTypeText = (type) => {
  const texts = {
    suggestion: 'Suggestion',
    alert: 'Alert',
    optimization: 'Optimization',
    warning: 'Warning'
  }
  return texts[type] || type
}

const getConfidenceWidth = (confidence) => {
  const widths = {
    low: '30%',
    medium: '60%',
    high: '90%'
  }
  return widths[confidence] || '50%'
}
</script>

<style scoped>
.insights-panel {
  padding: 24px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
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

.insights-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.insight-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s ease;
}

.insight-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.insight-suggestion {
  border-left: 4px solid #0ea5e9;
}

.insight-alert {
  border-left: 4px solid #f59e0b;
}

.insight-optimization {
  border-left: 4px solid #10b981;
}

.insight-warning {
  border-left: 4px solid #ef4444;
}

.insight-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.insight-type {
  display: flex;
  align-items: center;
  gap: 6px;
}

.type-icon {
  font-size: 16px;
}

.type-text {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.insight-priority {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 3px;
  text-transform: uppercase;
}

.priority-high {
  background: #fee2e2;
  color: #991b1b;
}

.priority-medium {
  background: #fef3c7;
  color: #92400e;
}

.priority-low {
  background: #e0f2fe;
  color: #0c4a6e;
}

.insight-content {
  margin-bottom: 16px;
}

.insight-title {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.insight-description {
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
  margin: 0;
}

.insight-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.confidence-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.confidence-label {
  font-size: 11px;
  color: #64748b;
  white-space: nowrap;
}

.confidence-bar {
  flex: 1;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.confidence-low {
  background: #f59e0b;
}

.confidence-medium {
  background: #0ea5e9;
}

.confidence-high {
  background: #10b981;
}

.confidence-text {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
  text-transform: capitalize;
}

.insight-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  flex: 1;
}

.action-btn.primary {
  background: #0ea5e9;
  color: white;
}

.action-btn.primary:hover {
  background: #0284c7;
}

.action-btn.secondary {
  background: #f8fafc;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.action-btn.secondary:hover {
  background: #f1f5f9;
  color: #475569;
}

@media (max-width: 768px) {
  .insights-panel {
    padding: 16px;
  }
  
  .insight-card {
    padding: 12px;
  }
  
  .insight-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .confidence-indicator {
    flex-wrap: wrap;
  }
  
  .action-btn {
    font-size: 11px;
    padding: 5px 10px;
  }
}
</style>