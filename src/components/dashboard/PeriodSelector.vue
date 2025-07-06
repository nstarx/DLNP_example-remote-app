<template>
  <div class="period-selector">
    <button
      v-for="period in periods"
      :key="period.value"
      :class="['period-button', { active: modelValue === period.value }]"
      @click="$emit('update:modelValue', period.value)"
    >
      {{ period.label }}
    </button>
  </div>
</template>

<script setup>
import { PERIODS } from '@/data/constants'

defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

defineEmits(['update:modelValue'])

const periods = PERIODS
</script>

<style scoped>
.period-selector {
  display: flex;
  gap: 8px;
  padding: 4px;
  background: #f3f4f6;
  border-radius: 8px;
}

.period-button {
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.period-button:hover {
  color: #111827;
}

.period-button.active {
  background: white;
  color: #4f46e5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

@media (prefers-color-scheme: dark) {
  .period-selector {
    background: #374151;
  }
  
  .period-button {
    color: #9ca3af;
  }
  
  .period-button:hover {
    color: #f3f4f6;
  }
  
  .period-button.active {
    background: #1f2937;
    color: #6366f1;
  }
}
</style>