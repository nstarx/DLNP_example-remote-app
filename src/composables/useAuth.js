import { ref, computed } from 'vue'

const user = ref(null)
const isAuthenticated = ref(false)

export function useAuth() {
  const userRole = computed(() => user.value?.role || null)
  const isExecutive = computed(() => userRole.value === 'executive')
  const isAgent = computed(() => userRole.value === 'agent') 
  const isCustomer = computed(() => userRole.value === 'customer')
  const isUnderwriter = computed(() => userRole.value === 'underwriter')

  const login = (userData) => {
    user.value = userData
    isAuthenticated.value = true
    localStorage.setItem('insurance_user', JSON.stringify(userData))
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('insurance_user')
  }

  const initAuth = () => {
    const savedUser = localStorage.getItem('insurance_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        user.value = userData
        isAuthenticated.value = true
      } catch (error) {
        localStorage.removeItem('insurance_user')
      }
    }
  }

  const hasPermission = (permission) => {
    if (!user.value) return false
    
    const rolePermissions = {
      executive: ['view_all_metrics', 'view_compliance', 'view_fraud_detection', 'manage_policies'],
      agent: ['view_customer_data', 'manage_policies', 'view_commissions', 'create_quotes'],
      underwriter: ['view_risk_scores', 'approve_policies', 'view_claims', 'ai_recommendations'],
      customer: ['view_own_policies', 'file_claims', 'chat_support', 'view_recommendations']
    }
    
    return rolePermissions[user.value.role]?.includes(permission) || false
  }

  return {
    user,
    isAuthenticated,
    userRole,
    isExecutive,
    isAgent,
    isCustomer,
    isUnderwriter,
    login,
    logout,
    initAuth,
    hasPermission
  }
}