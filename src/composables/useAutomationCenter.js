import { ref, computed } from 'vue'

export function useAutomationCenter() {
  // Reactive state
  const loading = ref(false)
  const error = ref('')
  const lastRefresh = ref(new Date())

  // Mock data - in a real app this would come from APIs
  const kpis = ref([
    {
      id: 'issues-resolved',
      label: 'Issues Auto-Resolved',
      value: '247',
      description: 'This week',
      icon: '✅',
      status: 'success',
      trend: {
        direction: 'up',
        value: '+23%'
      },
      details: [
        { label: 'Yesterday', value: '42' },
        { label: 'Avg/day', value: '35' }
      ]
    },
    {
      id: 'downtime-avoided',
      label: 'Downtime Avoided',
      value: '18.5h',
      description: 'Estimated time saved',
      icon: '⏱️',
      status: 'success',
      trend: {
        direction: 'up',
        value: '+2.3h'
      },
      details: [
        { label: 'Critical', value: '4.2h' },
        { label: 'Major', value: '14.3h' }
      ]
    },
    {
      id: 'recurring-issues',
      label: 'Recurring Issues',
      value: '12',
      description: 'Devices requiring attention',
      icon: '🔄',
      status: 'warning',
      trend: {
        direction: 'down',
        value: '-3'
      },
      details: [
        { label: 'High priority', value: '4' },
        { label: 'Medium priority', value: '8' }
      ]
    },
    {
      id: 'success-rate',
      label: 'Success Rate',
      value: '94.2%',
      description: 'Last 30 days',
      icon: '📊',
      status: 'success',
      trend: {
        direction: 'up',
        value: '+1.2%'
      },
      details: [
        { label: 'Target', value: '95%' },
        { label: 'Last week', value: '93%' }
      ]
    }
  ])

  const activeAutomations = ref([
    {
      id: 'auto-001',
      name: 'Windows Update Deployment',
      description: 'Installing critical security patches across fleet',
      status: 'running',
      targetDevices: ['WS-001', 'WS-002', 'WS-015', 'WS-032', 'WS-078'],
      eta: '25 minutes',
      progress: 68,
      startTime: new Date(Date.now() - 15 * 60000)
    },
    {
      id: 'auto-002',
      name: 'Disk Cleanup Automation',
      description: 'Clearing temporary files and cache on workstations',
      status: 'scheduled',
      targetDevices: ['WS-003', 'WS-008', 'WS-021'],
      eta: '2:30 PM',
      scheduledTime: new Date(Date.now() + 60 * 60000)
    },
    {
      id: 'auto-003',
      name: 'Printer Driver Update',
      description: 'Updating HP Universal Print drivers',
      status: 'failed',
      targetDevices: ['WS-005', 'WS-012'],
      eta: 'Failed',
      errorMessage: 'Network timeout during download',
      lastAttempt: new Date(Date.now() - 30 * 60000)
    },
    {
      id: 'auto-004',
      name: 'Antivirus Definition Update',
      description: 'Deploying latest virus definitions',
      status: 'scheduled',
      targetDevices: ['ALL'],
      eta: '11:00 PM',
      scheduledTime: new Date(Date.now() + 8 * 60 * 60000)
    },
    {
      id: 'auto-005',
      name: 'Network Connectivity Fix',
      description: 'Resolving DNS resolution issues',
      status: 'paused',
      targetDevices: ['WS-009', 'WS-017'],
      eta: 'Paused',
      pausedTime: new Date(Date.now() - 5 * 60000),
      progress: 30
    }
  ])

  const recentActivities = ref([
    {
      id: 'activity-001',
      deviceName: 'WS-045',
      action: 'Browser Cache Cleared',
      timestamp: new Date(Date.now() - 10 * 60000),
      result: 'success',
      triggeredBy: 'system',
      details: 'Resolved slow browser performance issue. Cleared 2.3GB of cached data.',
      duration: '45 seconds',
      automationId: 'auto-cache-001'
    },
    {
      id: 'activity-002',
      deviceName: 'WS-032',
      action: 'Service Restart',
      timestamp: new Date(Date.now() - 25 * 60000),
      result: 'success',
      triggeredBy: 'admin',
      details: 'Restarted Windows Audio service to resolve audio issues.',
      duration: '12 seconds',
      affectedUsers: '1'
    },
    {
      id: 'activity-003',
      deviceName: 'WS-018',
      action: 'Driver Installation',
      timestamp: new Date(Date.now() - 45 * 60000),
      result: 'failure',
      triggeredBy: 'scheduled',
      details: 'Failed to install graphics driver. Error: Device not compatible.',
      duration: '2 minutes 15 seconds'
    },
    {
      id: 'activity-004',
      deviceName: 'WS-067',
      action: 'Registry Cleanup',
      timestamp: new Date(Date.now() - 1 * 60 * 60000),
      result: 'success',
      triggeredBy: 'system',
      details: 'Cleaned 47 invalid registry entries. System performance improved.',
      duration: '1 minute 32 seconds'
    },
    {
      id: 'activity-005',
      deviceName: 'WS-023',
      action: 'Security Patch Installation',
      timestamp: new Date(Date.now() - 2 * 60 * 60000),
      result: 'warning',
      triggeredBy: 'admin',
      details: 'Patch installed successfully but requires reboot. Scheduled for tonight.',
      duration: '8 minutes 21 seconds',
      affectedUsers: '1'
    },
    {
      id: 'activity-006',
      deviceName: 'WS-055',
      action: 'Network Configuration Update',
      timestamp: new Date(Date.now() - 3 * 60 * 60000),
      result: 'success',
      triggeredBy: 'system',
      details: 'Updated DNS settings to resolve connectivity issues.',
      duration: '30 seconds'
    },
    {
      id: 'activity-007',
      deviceName: 'WS-041',
      action: 'Malware Scan',
      timestamp: new Date(Date.now() - 4 * 60 * 60000),
      result: 'success',
      triggeredBy: 'scheduled',
      details: 'Full system scan completed. No threats detected.',
      duration: '45 minutes 12 seconds'
    },
    {
      id: 'activity-008',
      deviceName: 'WS-012',
      action: 'Software Update',
      timestamp: new Date(Date.now() - 6 * 60 * 60000),
      result: 'failure',
      triggeredBy: 'system',
      details: 'Failed to update Adobe Reader. Download interrupted.',
      duration: '3 minutes 45 seconds'
    }
  ])

  const aiInsights = ref([
    {
      id: 'insight-001',
      type: 'optimization',
      priority: 'high',
      title: 'Frequent Audio Driver Crashes Detected',
      description: 'Analysis shows 50+ audio driver crashes this week across 15 devices. Recommend deploying updated Realtek driver package.',
      metrics: [
        { label: 'Affected devices', value: '15', trend: 'negative' },
        { label: 'Crash frequency', value: '3.4/day', trend: 'negative' },
        { label: 'Est. time saved', value: '2.5h/week', trend: 'positive' }
      ],
      details: [
        'Primary affected models: Dell OptiPlex 7090, HP EliteDesk 800',
        'Most crashes occur during video conferencing applications',
        'Updated driver version 10.0.19041.3636 available',
        'Estimated deployment time: 15 minutes per device'
      ],
      confidence: 87,
      canApprove: true,
      canSchedule: true,
      approveText: 'Deploy Driver Update',
      isNew: true
    },
    {
      id: 'insight-002',
      type: 'maintenance',
      priority: 'medium',
      title: 'Battery Degradation Alert',
      description: 'Battery health monitoring indicates 8% of laptop fleet has degraded batteries (< 80% capacity). Consider replacement notifications.',
      metrics: [
        { label: 'Affected laptops', value: '23', trend: 'negative' },
        { label: 'Avg. capacity', value: '67%', trend: 'negative' },
        { label: 'Replacement cost', value: '$2,760', trend: 'neutral' }
      ],
      details: [
        'Laptops with > 500 charge cycles showing rapid degradation',
        'Users reporting frequent low battery warnings',
        'Proactive replacement can prevent productivity loss'
      ],
      confidence: 92,
      canApprove: true,
      canSchedule: false,
      approveText: 'Send Replacement Alerts',
      isNew: false
    },
    {
      id: 'insight-003',
      type: 'security',
      priority: 'high',
      title: 'Outdated Browser Versions Detected',
      description: 'Security scan reveals 12 workstations running outdated Chrome versions with known vulnerabilities. Immediate update recommended.',
      metrics: [
        { label: 'Vulnerable devices', value: '12', trend: 'negative' },
        { label: 'Days behind', value: '23', trend: 'negative' },
        { label: 'CVE score', value: '7.8 High', trend: 'negative' }
      ],
      details: [
        'Running Chrome version 115.0.5790.102 (current: 119.0.6045.105)',
        'Known vulnerabilities: CVE-2023-5472, CVE-2023-5473',
        'Auto-update disabled on affected machines',
        'Update can be deployed silently without user disruption'
      ],
      confidence: 95,
      canApprove: true,
      canSchedule: true,
      approveText: 'Deploy Browser Updates',
      isNew: true
    }
  ])

  const policies = ref({
    // General automation
    autoApproveSafe: true,
    autoRemediateKnown: true,
    proactiveMaintenance: false,
    
    // Security & compliance
    requireSecurityApproval: true,
    autoSecurityUpdates: false,
    complianceMonitoring: true,
    
    // Scheduling
    respectMaintenanceWindows: true,
    businessHoursProtection: true,
    batchExecution: true,
    maintenanceWindows: {
      weekdays: '10:00 PM - 6:00 AM',
      weekends: 'Any time'
    },
    
    // Notifications
    realTimeNotifications: true,
    weeklyReports: true,
    weeklyReportDay: 'friday',
    failureEscalation: true,
    escalationThreshold: 3,
    notificationChannels: {
      email: true,
      teams: true,
      slack: false
    }
  })

  const systemHealth = computed(() => {
    const failedAutomations = activeAutomations.value.filter(a => a.status === 'failed').length
    const totalAutomations = activeAutomations.value.length
    
    if (failedAutomations === 0) {
      return { status: 'operational', label: 'Operational' }
    } else if (failedAutomations / totalAutomations < 0.2) {
      return { status: 'warning', label: 'Minor Issues' }
    } else {
      return { status: 'critical', label: 'Critical Issues' }
    }
  })

  // Methods
  const refreshData = async () => {
    loading.value = true
    error.value = ''
    
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, you would fetch data from APIs here
      // const [kpiData, automationData, activityData, insightData] = await Promise.all([
      //   fetch('/api/kpis').then(r => r.json()),
      //   fetch('/api/automations').then(r => r.json()),
      //   fetch('/api/activities').then(r => r.json()),
      //   fetch('/api/insights').then(r => r.json())
      // ])
      
      lastRefresh.value = new Date()
    } catch (err) {
      error.value = 'Failed to refresh data. Please try again.'
      console.error('Data refresh error:', err)
    } finally {
      loading.value = false
    }
  }

  const handleAutomationAction = async ({ type, automation }) => {
    try {
      switch (type) {
        case 'pause':
          automation.status = 'paused'
          automation.pausedTime = new Date()
          break
        case 'resume':
          automation.status = 'running'
          automation.pausedTime = null
          break
        case 'run-now':
          automation.status = 'running'
          automation.startTime = new Date()
          automation.progress = 0
          break
        case 'retry':
          automation.status = 'running'
          automation.startTime = new Date()
          automation.progress = 0
          automation.errorMessage = null
          break
        case 'cancel':
          const index = activeAutomations.value.findIndex(a => a.id === automation.id)
          if (index > -1) {
            activeAutomations.value.splice(index, 1)
          }
          break
        case 'details':
          // This would open a details modal
          console.log('Show details for:', automation.name)
          break
        case 'edit':
          // This would open an edit modal
          console.log('Edit automation:', automation.name)
          break
        case 'refresh':
          await refreshData()
          break
      }
    } catch (err) {
      error.value = `Failed to ${type} automation: ${err.message}`
    }
  }

  const handleActivityFilter = (filters) => {
    // In a real app, this would filter activities based on the provided filters
    console.log('Apply activity filters:', filters)
  }

  const handleInsightApproval = async (insight) => {
    try {
      // Mark insight as approved and create automation
      const newAutomation = {
        id: `auto-${Date.now()}`,
        name: insight.title,
        description: insight.description,
        status: 'scheduled',
        targetDevices: ['Multiple'],
        eta: '15 minutes',
        scheduledTime: new Date(Date.now() + 5 * 60000)
      }
      
      activeAutomations.value.unshift(newAutomation)
      
      // Remove insight from list
      const index = aiInsights.value.findIndex(i => i.id === insight.id)
      if (index > -1) {
        aiInsights.value.splice(index, 1)
      }
    } catch (err) {
      error.value = `Failed to approve insight: ${err.message}`
    }
  }

  const handlePolicyUpdate = async (updatedPolicies) => {
    try {
      // In a real app, this would save policies to the backend
      policies.value = { ...updatedPolicies }
      
      // Add activity log entry
      recentActivities.value.unshift({
        id: `activity-${Date.now()}`,
        deviceName: 'Command Center',
        action: 'Policy Configuration Updated',
        timestamp: new Date(),
        result: 'success',
        triggeredBy: 'admin',
        details: 'Automation policies have been updated successfully.'
      })
    } catch (err) {
      error.value = `Failed to update policies: ${err.message}`
    }
  }

  return {
    // State
    kpis,
    activeAutomations,
    recentActivities,
    aiInsights,
    policies,
    systemHealth,
    loading,
    error,
    lastRefresh,
    
    // Methods
    refreshData,
    handleAutomationAction,
    handleActivityFilter,
    handleInsightApproval,
    handlePolicyUpdate
  }
}