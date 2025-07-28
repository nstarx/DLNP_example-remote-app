<template>
  <div class="insurance-dashboard-app">
    <DashboardRouter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import DashboardRouter from '@/components/dashboard/DashboardRouter.vue'

const { initAuth } = useAuth()

onMounted(() => {
  initAuth()
})
</script>

<style scoped>
.insurance-dashboard-app {
  width: 100%;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1e293b;
  background: #f8fafc;
}

/* Global font loading for better typography */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

/* Reset and base styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>