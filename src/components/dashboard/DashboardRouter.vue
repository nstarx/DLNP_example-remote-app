<template>
  <div class="dashboard-router">
    <component 
      :is="currentDashboard" 
      :user="user"
      @switch-role="handleRoleSwitch"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import ExecutiveDashboard from './ExecutiveDashboard.vue'
import AgentDashboard from './AgentDashboard.vue'
import CustomerDashboard from './CustomerDashboard.vue'
import UnderwriterDashboard from './UnderwriterDashboard.vue'
import LoginView from '../auth/LoginView.vue'

const { user, isAuthenticated, userRole } = useAuth()

const currentDashboard = computed(() => {
  if (!isAuthenticated.value) {
    return LoginView
  }
  
  switch (userRole.value) {
    case 'executive':
      return ExecutiveDashboard
    case 'agent':
      return AgentDashboard
    case 'customer':
      return CustomerDashboard
    case 'underwriter':
      return UnderwriterDashboard
    default:
      return LoginView
  }
})

const handleRoleSwitch = (newRole) => {
  // Demo functionality to switch between roles
  if (user.value) {
    user.value.role = newRole
  }
}
</script>

<style scoped>
.dashboard-router {
  width: 100%;
  min-height: 100vh;
}
</style>