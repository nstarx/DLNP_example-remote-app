<template>
  <div class="mode-selector">
    <div class="selector-tabs">
      <button 
        v-for="mode in modes" 
        :key="mode.id"
        @click="$emit('mode-changed', mode.id)"
        :class="{ active: selectedMode === mode.id }"
        class="mode-tab"
      >
        <span class="mode-icon">{{ mode.icon }}</span>
        <span class="mode-label">{{ mode.label }}</span>
        <span v-if="mode.badge" class="mode-badge" :class="mode.badgeType">{{ mode.badge }}</span>
      </button>
    </div>
    
    <div class="mode-description">
      <p>{{ currentModeDescription }}</p>
    </div>
    
    <div class="quick-filters" v-if="selectedMode === 'portfolio'">
      <div class="filter-group">
        <label class="filter-label">Health Status:</label>
        <select v-model="healthFilter" @change="updateFilters" class="filter-select">
          <option value="all">All Companies</option>
          <option value="healthy">Healthy Only</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label class="filter-label">Sector:</label>
        <select v-model="sectorFilter" @change="updateFilters" class="filter-select">
          <option value="all">All Sectors</option>
          <option v-for="sector in availableSectors" :key="sector" :value="sector">
            {{ sector }}
          </option>
        </select>
      </div>
      
      <div class="filter-group">
        <label class="filter-label">Stage:</label>
        <select v-model="stageFilter" @change="updateFilters" class="filter-select">
          <option value="all">All Stages</option>
          <option value="Seed">Seed</option>
          <option value="Series A">Series A</option>
          <option value="Series B">Series B</option>
          <option value="Series C">Series C</option>
          <option value="Series C+">Series C+</option>
        </select>
      </div>
    </div>
    
    <div class="quick-actions" v-if="selectedMode === 'thesis'">
      <button @click="$emit('refresh-thesis')" class="action-button refresh">
        <span class="action-icon">🔄</span>
        Refresh Market Data
      </button>
      
      <button @click="$emit('run-scenarios')" class="action-button scenarios">
        <span class="action-icon">📊</span>
        Run Scenarios
      </button>
      
      <button @click="$emit('export-report')" class="action-button export">
        <span class="action-icon">📄</span>
        Export Report
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  selectedMode: {
    type: String,
    default: 'portfolio'
  },
  availableSectors: {
    type: Array,
    default: () => ['Enterprise SaaS', 'FinTech', 'HealthTech', 'CleanTech', 'Logistics Tech']
  },
  portfolioHealth: {
    type: Object,
    default: () => ({ healthy: { count: 0 }, warning: { count: 0 }, critical: { count: 0 } })
  }
})

const emit = defineEmits([
  'mode-changed', 
  'filters-changed', 
  'refresh-thesis', 
  'run-scenarios', 
  'export-report'
])

const healthFilter = ref('all')
const sectorFilter = ref('all')
const stageFilter = ref('all')

const modes = computed(() => [
  {
    id: 'portfolio',
    label: 'Portfolio Monitor',
    icon: '📊',
    description: 'Monitor individual company performance, health indicators, and portfolio-level metrics',
    badge: props.portfolioHealth.critical?.count > 0 ? props.portfolioHealth.critical.count : null,
    badgeType: 'critical'
  },
  {
    id: 'thesis',
    label: 'Thesis Validation',
    icon: '🎯',
    description: 'Validate investment thesis with market data, competitive analysis, and scenario modeling',
    badge: null,
    badgeType: null
  }
])

const currentModeDescription = computed(() => {
  return modes.value.find(mode => mode.id === props.selectedMode)?.description || ''
})

function updateFilters() {
  emit('filters-changed', {
    health: healthFilter.value,
    sector: sectorFilter.value,
    stage: stageFilter.value
  })
}
</script>

<style scoped>
.mode-selector {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.selector-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 10px;
}

.mode-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 14px;
  color: #6b7280;
  position: relative;
}

.mode-tab:hover {
  color: #374151;
  background: rgba(255, 255, 255, 0.5);
}

.mode-tab.active {
  background: white;
  color: #111827;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mode-icon {
  font-size: 18px;
}

.mode-label {
  font-weight: 600;
}

.mode-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  padding: 0 6px;
}

.mode-badge.critical {
  background: #ef4444;
  color: white;
}

.mode-badge.warning {
  background: #f59e0b;
  color: white;
}

.mode-badge.info {
  background: #3b82f6;
  color: white;
}

.mode-description {
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.mode-description p {
  margin: 0;
  color: #4b5563;
  font-size: 14px;
  line-height: 1.5;
}

.quick-filters {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

.filter-select {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 13px;
  color: #374151;
  min-width: 120px;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.quick-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.action-button:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.action-button.refresh:hover {
  background: #ecfdf5;
  border-color: #10b981;
  color: #065f46;
}

.action-button.scenarios:hover {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #1e40af;
}

.action-button.export:hover {
  background: #fef3c7;
  border-color: #f59e0b;
  color: #92400e;
}

.action-icon {
  font-size: 14px;
}

@media (max-width: 768px) {
  .mode-selector {
    padding: 16px;
  }
  
  .selector-tabs {
    flex-direction: column;
  }
  
  .mode-tab {
    justify-content: flex-start;
  }
  
  .quick-filters,
  .quick-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .filter-select {
    min-width: 100%;
  }
}

@media (prefers-color-scheme: dark) {
  .mode-selector {
    background: #1f2937;
    border-color: #4b5563;
  }
  
  .selector-tabs {
    background: #374151;
  }
  
  .mode-tab {
    color: #d1d5db;
  }
  
  .mode-tab:hover {
    color: #f3f4f6;
    background: rgba(75, 85, 99, 0.5);
  }
  
  .mode-tab.active {
    background: #1f2937;
    color: #f9fafb;
  }
  
  .mode-description {
    background: #374151;
    border-left-color: #60a5fa;
  }
  
  .mode-description p {
    color: #d1d5db;
  }
  
  .quick-filters,
  .quick-actions {
    background: #374151;
    border-color: #4b5563;
  }
  
  .filter-label {
    color: #d1d5db;
  }
  
  .filter-select,
  .action-button {
    background: #1f2937;
    border-color: #4b5563;
    color: #d1d5db;
  }
  
  .filter-select:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
  }
  
  .action-button:hover {
    background: #4b5563;
  }
}
</style>