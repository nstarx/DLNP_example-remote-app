<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1 class="login-title">Vertafore AI Insurance Platform</h1>
        <p class="login-subtitle">Intelligent insights for modern insurance</p>
      </div>
      
      <div class="demo-roles">
        <h3>Demo Access - Select Your Role:</h3>
        <div class="role-buttons">
          <button 
            v-for="role in roles" 
            :key="role.id"
            @click="loginAsRole(role)"
            class="role-button"
            :class="role.id"
          >
            <div class="role-icon">{{ role.icon }}</div>
            <div class="role-info">
              <div class="role-name">{{ role.name }}</div>
              <div class="role-description">{{ role.description }}</div>
            </div>
          </button>
        </div>
      </div>
      
      <div class="ai-features">
        <h4>🤖 AI-Powered Features:</h4>
        <ul>
          <li>Real-time fraud detection</li>
          <li>Predictive churn analysis</li>
          <li>Intelligent underwriting</li>
          <li>Compliance monitoring</li>
          <li>Claims surge prediction</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

const { login } = useAuth()

const roles = [
  {
    id: 'executive',
    name: 'Executive',
    description: 'Strategic insights & company performance',
    icon: '👔'
  },
  {
    id: 'agent',
    name: 'Insurance Agent',
    description: 'Customer management & sales tools',
    icon: '🤝'
  },
  {
    id: 'underwriter',
    name: 'Underwriter',
    description: 'Risk assessment & policy approval',
    icon: '📊'
  },
  {
    id: 'customer',
    name: 'Customer',
    description: 'Policy management & support',
    icon: '👤'
  }
]

const loginAsRole = (role) => {
  const userData = {
    id: `${role.id}_demo`,
    name: `Demo ${role.name}`,
    role: role.id,
    email: `demo.${role.id}@vertafore.com`,
    avatar: role.icon,
    permissions: getRolePermissions(role.id)
  }
  
  login(userData)
}

const getRolePermissions = (roleId) => {
  const permissions = {
    executive: ['view_all_metrics', 'view_compliance', 'view_fraud_detection', 'manage_policies'],
    agent: ['view_customer_data', 'manage_policies', 'view_commissions', 'create_quotes'],
    underwriter: ['view_risk_scores', 'approve_policies', 'view_claims', 'ai_recommendations'],
    customer: ['view_own_policies', 'file_claims', 'chat_support', 'view_recommendations']
  }
  return permissions[roleId] || []
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-title {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.login-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.demo-roles h3 {
  color: #374151;
  margin-bottom: 24px;
  font-size: 18px;
}

.role-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.role-button {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.role-button:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  transform: translateY(-2px);
}

.role-button.executive:hover {
  border-color: #7c3aed;
  background: #f3e8ff;
}

.role-button.agent:hover {
  border-color: #059669;
  background: #ecfdf5;
}

.role-button.underwriter:hover {
  border-color: #dc2626;
  background: #fef2f2;
}

.role-button.customer:hover {
  border-color: #2563eb;
  background: #eff6ff;
}

.role-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.role-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 16px;
}

.role-description {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

.ai-features {
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  padding: 20px;
  margin-top: 24px;
}

.ai-features h4 {
  margin: 0 0 12px 0;
  color: #0c4a6e;
  font-size: 16px;
}

.ai-features ul {
  margin: 0;
  padding-left: 20px;
  color: #075985;
}

.ai-features li {
  margin-bottom: 4px;
}

@media (max-width: 768px) {
  .login-card {
    padding: 24px;
  }
  
  .login-title {
    font-size: 24px;
  }
  
  .role-buttons {
    grid-template-columns: 1fr;
  }
}
</style>