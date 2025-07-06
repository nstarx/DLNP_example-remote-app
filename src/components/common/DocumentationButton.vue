<template>
  <button class="docs-button" @click="$emit('click')" title="View Documentation">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
      <path d="M12 16v-4M12 8h.01"/>
    </svg>
    <span class="button-text">Docs</span>
  </button>
</template>

<script setup>
defineEmits(['click'])
</script>

<style scoped>
.docs-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.docs-button:hover {
  background: #e5e7eb;
  color: #111827;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.docs-button:active {
  transform: translateY(0);
  box-shadow: none;
}

.button-text {
  display: inline;
}

@media (max-width: 640px) {
  .button-text {
    display: none;
  }
  
  .docs-button {
    padding: 8px;
  }
}

@media (prefers-color-scheme: dark) {
  .docs-button {
    background: #374151;
    border-color: #4b5563;
    color: #d1d5db;
  }
  
  .docs-button:hover {
    background: #4b5563;
    color: #f3f4f6;
  }
}
</style>