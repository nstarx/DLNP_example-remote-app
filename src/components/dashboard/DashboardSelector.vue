<template>
  <div class="dashboard-selector">
    <label class="selector-label">Dashboard View:</label>
    <select 
      :value="modelValue" 
      @change="$emit('update:modelValue', $event.target.value)"
      class="selector-dropdown"
    >
      <option value="executive">Executive/CEO Dashboard</option>
      <option value="cio">Technology & Operations/CIO Dashboard</option>
      <option value="analytics">Analytics Dashboard</option>
    </select>
  </div>
</template>

<script setup>
defineEmits(['update:modelValue'])

defineProps({
  modelValue: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.dashboard-selector {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selector-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.selector-dropdown {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  color: #111827;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 200px;
}

.selector-dropdown:hover {
  border-color: #9ca3af;
}

.selector-dropdown:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

@media (prefers-color-scheme: dark) {
  .selector-label {
    color: #d1d5db;
  }
  
  .selector-dropdown {
    background: #374151;
    color: #f9fafb;
    border-color: #4b5563;
  }
  
  .selector-dropdown:hover {
    border-color: #6b7280;
  }
  
  .selector-dropdown:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
  }
}

@media (max-width: 600px) {
  .dashboard-selector {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .selector-dropdown {
    min-width: auto;
  }
}
</style>