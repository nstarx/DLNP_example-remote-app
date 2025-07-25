<template>
  <div class="heatmap-filters">
    <div class="filter-group">
      <label class="filter-label">Location</label>
      <select 
        v-model="localFilters.location" 
        class="filter-select"
        @change="$emit('update:filters', localFilters)"
      >
        <option value="all">All Locations</option>
        <option value="floor1">Floor 1</option>
        <option value="floor2">Floor 2</option>
        <option value="floor3">Floor 3</option>
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label">Department</label>
      <select 
        v-model="localFilters.department" 
        class="filter-select"
        @change="$emit('update:filters', localFilters)"
      >
        <option value="all">All Departments</option>
        <option value="sales">Sales</option>
        <option value="engineering">Engineering</option>
        <option value="marketing">Marketing</option>
        <option value="support">Support</option>
        <option value="hr">HR</option>
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label">OS Version</label>
      <select 
        v-model="localFilters.osVersion" 
        class="filter-select"
        @change="$emit('update:filters', localFilters)"
      >
        <option value="all">All OS Versions</option>
        <option value="win11">Windows 11</option>
        <option value="win10">Windows 10</option>
        <option value="macos">macOS</option>
        <option value="linux">Linux</option>
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label">Device Type</label>
      <select 
        v-model="localFilters.deviceType" 
        class="filter-select"
        @change="$emit('update:filters', localFilters)"
      >
        <option value="all">All Device Types</option>
        <option value="laptop">Laptop</option>
        <option value="desktop">Desktop</option>
        <option value="tablet">Tablet</option>
        <option value="mobile">Mobile</option>
      </select>
    </div>

    <div class="filter-group toggle-group">
      <label class="toggle-label">
        <input 
          type="checkbox" 
          v-model="localFilters.showProblemsOnly"
          class="toggle-input"
          @change="$emit('update:filters', localFilters)"
        />
        <span class="toggle-text">Show problems only</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:filters'])

const localFilters = ref({ ...props.filters })

watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })
</script>

<style scoped>
.heatmap-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
  padding: 20px 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 140px;
}

.toggle-group {
  margin-left: auto;
  min-width: auto;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  color: #111827;
  outline: none;
  transition: all 0.2s ease;
}

.filter-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
}

.toggle-input {
  width: 16px;
  height: 16px;
  border: 2px solid #d1d5db;
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.toggle-input:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.toggle-text {
  font-weight: 500;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .heatmap-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    min-width: auto;
  }
  
  .toggle-group {
    margin-left: 0;
  }
}

@media (prefers-color-scheme: dark) {
  .heatmap-filters {
    border-bottom-color: #374151;
  }
  
  .filter-label,
  .toggle-label {
    color: #d1d5db;
  }
  
  .filter-select {
    background: #1f2937;
    border-color: #374151;
    color: #f9fafb;
  }
  
  .filter-select:focus {
    border-color: #60a5fa;
  }
  
  .toggle-input {
    border-color: #374151;
  }
  
  .toggle-input:checked {
    background-color: #60a5fa;
    border-color: #60a5fa;
  }
}
</style>