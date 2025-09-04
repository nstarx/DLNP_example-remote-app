<template>
  <div class="dashboard-filters">
    <div class="filter-group">
      <label class="filter-label">Time Period</label>
      <select 
        :value="period" 
        @change="$emit('update:period', $event.target.value)"
        class="filter-select"
      >
        <option value="24h">Last 24 Hours</option>
        <option value="7d">Last 7 Days</option>
        <option value="30d">Last 30 Days</option>
        <option value="90d">Last 90 Days</option>
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label">Desk</label>
      <select 
        :value="desk" 
        @change="$emit('update:desk', $event.target.value)"
        class="filter-select"
      >
        <option value="all">All Desks</option>
        <option value="politics">Politics</option>
        <option value="sports">Sports</option>
        <option value="local">Local News</option>
        <option value="investigations">Investigations</option>
        <option value="entertainment">Entertainment</option>
        <option value="business">Business</option>
        <option value="opinion">Opinion</option>
        <option value="breaking">Breaking News</option>
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label">Publication</label>
      <select 
        :value="publication" 
        @change="$emit('update:publication', $event.target.value)"
        class="filter-select"
      >
        <option value="all">All Publications</option>
        <option value="miami-herald">Miami Herald</option>
        <option value="charlotte-observer">Charlotte Observer</option>
        <option value="kansas-city-star">Kansas City Star</option>
        <option value="sacramento-bee">Sacramento Bee</option>
        <option value="fort-worth-star-telegram">Fort Worth Star-Telegram</option>
        <option value="fresno-bee">Fresno Bee</option>
        <option value="modesto-bee">Modesto Bee</option>
        <option value="bellingham-herald">Bellingham Herald</option>
        <option value="bradenton-herald">Bradenton Herald</option>
        <option value="lexington-herald-leader">Lexington Herald-Leader</option>
      </select>
    </div>

    <button 
      class="refresh-button"
      :class="{ refreshing: isRefreshing }"
      @click="handleRefresh"
      :disabled="isRefreshing"
      title="Refresh data"
    >
      🔄
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  period: {
    type: String,
    required: true
  },
  desk: {
    type: String,
    required: true
  },
  publication: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:period', 'update:desk', 'update:publication', 'refresh'])

const isRefreshing = ref(false)

const handleRefresh = async () => {
  if (isRefreshing.value) return
  
  isRefreshing.value = true
  emit('refresh')
  
  // Add visual feedback for refresh
  setTimeout(() => {
    isRefreshing.value = false
  }, 1000)
}
</script>

<style scoped>
.dashboard-filters {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 120px;
}

.filter-label {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-select:hover {
  border-color: #9ca3af;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.refresh-button {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  height: fit-content;
}

.refresh-button:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.refresh-button:active {
  transform: rotate(180deg);
}

.refresh-button.refreshing {
  animation: spin 1s linear infinite;
  pointer-events: none;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .dashboard-filters {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .filter-group {
    min-width: auto;
  }
}

@media (prefers-color-scheme: dark) {
  .filter-label {
    color: #9ca3af;
  }
  
  .filter-select,
  .refresh-button {
    background: #1f2937;
    border-color: #374151;
    color: #f9fafb;
  }
  
  .filter-select:hover,
  .refresh-button:hover {
    background: #374151;
    border-color: #4b5563;
  }
  
  .filter-select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
}
</style>