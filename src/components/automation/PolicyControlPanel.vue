<template>
  <div class="policy-panel">
    <div class="policy-list">
      <div 
        v-for="policy in groupedPolicies" 
        :key="policy.category"
        class="policy-group"
      >
        <h3 class="group-title">{{ getCategoryTitle(policy.category) }}</h3>
        
        <div class="policy-items">
          <div 
            v-for="item in policy.items" 
            :key="item.id"
            class="policy-item"
          >
            <div class="policy-content">
              <div class="policy-header">
                <label class="policy-label" :for="item.id">
                  {{ item.label }}
                </label>
                <div class="policy-toggle">
                  <input 
                    type="checkbox"
                    :id="item.id"
                    :checked="item.enabled"
                    @change="$emit('update', item.id, $event.target.checked)"
                    class="toggle-input"
                  >
                  <span class="toggle-slider"></span>
                </div>
              </div>
              <p class="policy-description">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="policy-footer">
      <div class="footer-info">
        <span class="info-icon">ℹ️</span>
        <span class="info-text">Policy changes take effect immediately and apply to all new automation tasks.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  policies: {
    type: Array,
    default: () => []
  }
})

defineEmits(['update'])

const groupedPolicies = computed(() => {
  const groups = {}
  
  props.policies.forEach(policy => {
    if (!groups[policy.category]) {
      groups[policy.category] = {
        category: policy.category,
        items: []
      }
    }
    groups[policy.category].items.push(policy)
  })
  
  return Object.values(groups)
})

const getCategoryTitle = (category) => {
  const titles = {
    automation: 'Automation Controls',
    security: 'Security Policies',
    scheduling: 'Scheduling Rules',
    safety: 'Safety & Rollback'
  }
  return titles[category] || category
}
</script>

<style scoped>
.policy-panel {
  padding: 24px;
}

.policy-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.policy-group {
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 20px;
}

.policy-group:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.group-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.policy-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.policy-item {
  padding: 16px;
  background: #fafbfc;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.policy-item:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.policy-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.policy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.policy-label {
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
  cursor: pointer;
  flex: 1;
}

.policy-description {
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
  margin: 0;
}

/* Toggle Switch Styles */
.policy-toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toggle-input:checked + .toggle-slider {
  background-color: #0ea5e9;
}

.toggle-input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.toggle-input:focus + .toggle-slider {
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.toggle-input:disabled + .toggle-slider {
  opacity: 0.5;
  cursor: not-allowed;
}

.policy-footer {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}

.footer-info {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 6px;
  border: 1px solid #e0f2fe;
}

.info-icon {
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 1px;
}

.info-text {
  font-size: 12px;
  color: #0c4a6e;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .policy-panel {
    padding: 16px;
  }
  
  .policy-item {
    padding: 12px;
  }
  
  .policy-header {
    gap: 12px;
  }
  
  .policy-label {
    font-size: 13px;
  }
  
  .policy-description {
    font-size: 12px;
  }
  
  .group-title {
    font-size: 13px;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .toggle-slider {
    border: 2px solid #374151;
  }
  
  .toggle-input:checked + .toggle-slider {
    border-color: #0ea5e9;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .toggle-slider,
  .toggle-slider:before {
    transition: none;
  }
  
  .policy-item {
    transition: none;
  }
}
</style>