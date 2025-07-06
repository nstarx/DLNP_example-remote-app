<template>
  <div class="loading-container">
    <div class="spinner"></div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(79, 70, 229, 0.1);
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-color-scheme: dark) {
  .spinner {
    border-color: rgba(79, 70, 229, 0.2);
    border-top-color: #6366f1;
  }
}
</style>