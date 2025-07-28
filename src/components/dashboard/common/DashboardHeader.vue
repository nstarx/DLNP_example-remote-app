<template>
  <header class="dashboard-header">
    <div class="header-left">
      <div class="brand">
        <div class="brand-logo">🏢</div>
        <div class="brand-info">
          <h1 class="dashboard-title">{{ title }}</h1>
          <div class="brand-tagline">Vertafore AI Intelligence</div>
        </div>
      </div>
    </div>
    
    <div class="header-center">
      <div class="search-bar">
        <input 
          type="text" 
          placeholder="Ask AI anything..." 
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          class="ai-search-input"
        />
        <button @click="handleSearch" class="search-btn">
          <span class="search-icon">🔍</span>
        </button>
      </div>
    </div>

    <div class="header-right">
      <slot name="actions"></slot>
      
      <div class="user-menu">
        <div class="user-info">
          <div class="user-avatar">{{ user?.avatar || '👤' }}</div>
          <div class="user-details">
            <div class="user-name">{{ user?.name || 'User' }}</div>
            <div class="user-role">{{ formatRole(user?.role) }}</div>
          </div>
        </div>
        <button @click="$emit('logout')" class="logout-btn">
          <span>🚪</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  title: String,
  user: Object
})

defineEmits(['logout'])

const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // TODO: Implement AI-powered search
    console.log('Searching:', searchQuery.value)
  }
}

const formatRole = (role) => {
  if (!role) return ''
  return role.charAt(0).toUpperCase() + role.slice(1)
}
</script>

<style scoped>
.dashboard-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.dashboard-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.2;
}

.brand-tagline {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.header-center {
  flex: 1;
  max-width: 400px;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
}

.ai-search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 24px;
  font-size: 14px;
  background: #f8fafc;
  transition: all 0.2s ease;
}

.ai-search-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.ai-search-input::placeholder {
  color: #94a3b8;
  font-style: italic;
}

.search-btn {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.search-btn:hover {
  background: #e2e8f0;
}

.search-icon {
  font-size: 16px;
  color: #64748b;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
}

.user-details {
  text-align: right;
}

.user-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
  line-height: 1.2;
}

.user-role {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.logout-btn {
  padding: 8px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
}

.logout-btn:hover {
  background: #ef4444;
  border-color: #dc2626;
  color: white;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }
  
  .header-center {
    max-width: 100%;
    width: 100%;
  }
  
  .header-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .dashboard-title {
    font-size: 18px;
  }
}
</style>