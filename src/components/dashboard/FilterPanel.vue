

<template>
  <BaseCard class="filter-panel">
    <div class="filter-header">
      <h3>Filters</h3>
      <button @click="resetFilters" class="reset-btn">Reset</button>
    </div>
    <div class="filter-group">
      <label>Date Range</label>
      <select v-model="localFilters.dateRange">
        <option v-for="option in dateRangeOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
    <div class="filter-group">
      <label>Metrics</label>
      <div class="checkbox-group">
        <label v-for="metric in metricOptions" :key="metric.value" class="checkbox-label">
          <input type="checkbox" v-model="localFilters.metrics" :value="metric.value">
          {{ metric.label }}
        </label>
      </div>
    </div>
    <div class="filter-group">
      <label>Traffic Sources</label>
      <div class="checkbox-group">
        <label v-for="source in trafficSourceOptions" :key="source.value" class="checkbox-label">
          <input type="checkbox" v-model="localFilters.trafficSources" :value="source.value">
          {{ source.label }}
        </label>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { ref, watch } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const localFilters = ref({ ...props.modelValue })

const dateRangeOptions = [
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' }
]

const metricOptions = [
  { label: 'Page Views', value: 'pageViews' },
  { label: 'Unique Visitors', value: 'visitors' },
  { label: 'Average Session', value: 'avgSession' },
  { label: 'Bounce Rate', value: 'bounceRate' }
]

const trafficSourceOptions = [
  { label: 'Direct', value: 'direct' },
  { label: 'Social', value: 'social' },
  { label: 'Email', value: 'email' },
  { label: 'Organic', value: 'organic' },
  { label: 'Referral', value: 'referral' }
]

watch(localFilters, (newFilters) => {
  emit('update:modelValue', { ...newFilters })
}, { deep: true })

function resetFilters() {
  localFilters.value = {
    dateRange: '7d',
    metrics: ['pageViews', 'visitors'],
    trafficSources: ['direct', 'social', 'email', 'organic', 'referral']
  }
}
</script>

<style scoped>
.filter-panel {
  width: 100%;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.reset-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.reset-btn:hover {
  background: #dc2626;
}

.filter-group {
  margin-bottom: 20px;
}

.filter-group label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.filter-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.checkbox-label input {
  margin: 0;
}

@media (prefers-color-scheme: dark) {
  .filter-panel {
    background: #1f2937;
  }

  .filter-header h3 {
    color: #f9fafb;
  }

  .filter-group label {
    color: #d1d5db;
  }

  .filter-group select {
    background: #374151;
    border-color: #4b5563;
    color: #d1d5db;
  }

  .checkbox-label {
    color: #d1d5db;
  }
}
</style>

