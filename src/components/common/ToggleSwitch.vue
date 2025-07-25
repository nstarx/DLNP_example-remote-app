<template>
  <label class="toggle-switch" :class="{ disabled }">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="$emit('update:modelValue', $event.target.checked); $emit('change', $event.target.checked)"
      class="toggle-input"
    />
    <span class="toggle-slider"></span>
  </label>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue', 'change'])
</script>

<style scoped>
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  cursor: pointer;
}

.toggle-switch.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-surface-3, #e5e7eb);
  border-radius: 12px;
  transition: all 0.2s ease;
  border: 1px solid var(--color-border, #d1d5db);
}

.toggle-slider::before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  top: 2px;
  background: var(--color-surface, #ffffff);
  border-radius: 50%;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.toggle-input:checked + .toggle-slider {
  background: var(--color-primary, #0078d4);
  border-color: var(--color-primary, #0078d4);
}

.toggle-input:checked + .toggle-slider::before {
  transform: translateX(20px);
}

.toggle-input:focus + .toggle-slider {
  box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.1);
}

.toggle-input:disabled + .toggle-slider {
  cursor: not-allowed;
}

.toggle-input:disabled + .toggle-slider::before {
  cursor: not-allowed;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .toggle-slider {
    border-width: 2px;
  }
  
  .toggle-input:checked + .toggle-slider {
    background: #000000;
    border-color: #000000;
  }
}
</style>