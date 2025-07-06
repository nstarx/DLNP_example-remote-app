<template>
  <div class="card">
    <slot />
  </div>
</template>

<script setup>
</script>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (prefers-color-scheme: dark) {
  .card {
    background: #1f2937;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
  
  .card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  }
}
</style>