<template>
  <div class="role-switcher">
    <div class="switcher-label">Demo Mode:</div>
    <select 
      v-model="selectedRole" 
      @change="handleRoleChange"
      class="role-select"
    >
      <option v-for="role in roles" :key="role.id" :value="role.id">
        {{ role.icon }} {{ role.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const emit = defineEmits(['switch-role'])

const { user } = useAuth()
const selectedRole = ref(user.value?.role || 'executive')

const roles = [
  { id: 'executive', name: 'Executive', icon: '👔' },
  { id: 'agent', name: 'Agent', icon: '🤝' },
  { id: 'underwriter', name: 'Underwriter', icon: '📊' },
  { id: 'customer', name: 'Customer', icon: '👤' }
]

const handleRoleChange = () => {
  emit('switch-role', selectedRole.value)
}
</script>

<style scoped>
.role-switcher {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f1f5f9;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.switcher-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.role-select {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  color: #374151;
  cursor: pointer;
  min-width: 120px;
}

.role-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

@media (max-width: 768px) {
  .role-switcher {
    padding: 6px 8px;
  }
  
  .role-select {
    min-width: 100px;
    font-size: 11px;
  }
}
</style>