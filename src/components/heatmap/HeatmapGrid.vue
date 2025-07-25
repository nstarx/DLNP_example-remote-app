<template>
  <div class="heatmap-grid">
    <div 
      v-for="zone in zones" 
      :key="zone.id"
      class="zone-card"
      :style="{ borderLeftColor: getScoreColor(zone.score) }"
      @click="$emit('zone-click', zone)"
    >
      <div class="zone-header">
        <h3 class="zone-name">{{ zone.name }}</h3>
        <div class="zone-score" :style="{ color: getScoreColor(zone.score) }">
          {{ zone.score }}
        </div>
      </div>
      
      <div class="zone-metrics">
        <div class="metric-item">
          <span class="metric-label">Devices:</span>
          <span class="metric-value">{{ zone.devices }}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">Status:</span>
          <span class="metric-value" :style="{ color: getScoreColor(zone.score) }">
            {{ getScoreLabel(zone.score) }}
          </span>
        </div>
      </div>

      <div class="zone-issues" v-if="zone.issues.length > 0">
        <div class="issues-header">Issues:</div>
        <div class="issues-list">
          <span 
            v-for="issue in zone.issues.slice(0, 2)" 
            :key="issue.type"
            class="issue-tag"
            :class="`issue-${issue.severity}`"
          >
            {{ issue.type }} ({{ issue.count }})
          </span>
          <span v-if="zone.issues.length > 2" class="more-issues">
            +{{ zone.issues.length - 2 }} more
          </span>
        </div>
      </div>

      <div class="zone-health-bar">
        <div 
          class="health-bar-fill"
          :style="{ 
            width: `${zone.score}%`, 
            backgroundColor: getScoreColor(zone.score) 
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  zones: {
    type: Array,
    required: true
  },
  getScoreColor: {
    type: Function,
    required: true
  },
  getScoreLabel: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['zone-click'])
</script>

<style scoped>
.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.zone-card {
  background: white;
  border-radius: 8px;
  border-left: 4px solid;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.zone-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.zone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.zone-name {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.zone-score {
  font-size: 24px;
  font-weight: 700;
}

.zone-metrics {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.metric-value {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.zone-issues {
  margin-bottom: 16px;
}

.issues-header {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.issues-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.issue-tag {
  background: #f3f4f6;
  color: #374151;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.issue-high {
  background: #fee2e2;
  color: #dc2626;
}

.issue-medium {
  background: #fef3c7;
  color: #d97706;
}

.issue-low {
  background: #dbeafe;
  color: #2563eb;
}

.more-issues {
  background: #e5e7eb;
  color: #6b7280;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.zone-health-bar {
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.health-bar-fill {
  height: 100%;
  transition: width 0.3s ease;
}

@media (max-width: 768px) {
  .heatmap-grid {
    grid-template-columns: 1fr;
  }
  
  .zone-card {
    padding: 16px;
  }
  
  .zone-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

@media (prefers-color-scheme: dark) {
  .zone-card {
    background: #1f2937;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
  
  .zone-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  }
  
  .zone-name {
    color: #f9fafb;
  }
  
  .metric-value {
    color: #f9fafb;
  }
  
  .metric-label {
    color: #9ca3af;
  }
  
  .issues-header {
    color: #d1d5db;
  }
  
  .issue-tag {
    background: #374151;
    color: #d1d5db;
  }
  
  .more-issues {
    background: #4b5563;
    color: #9ca3af;
  }
  
  .zone-health-bar {
    background: #374151;
  }
}
</style>