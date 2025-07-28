import { ref, reactive, computed } from 'vue'

// Simulated real-time data - In production, this would come from APIs
const mockOperationalData = {
  executiveSummary: {
    claimsProcessed: 2847,
    claimsChange: 12.3,
    avgProcessingTime: '4.2h',
    timeChange: -8.7,
    customerSat: 94.2,
    satChange: 2.1,
    costPerClaim: '487',
    costChange: -3.4
  },
  
  operationalStatus: {
    status: 'operational', // operational, warning, critical
    message: 'All systems operational'
  },
  
  kpis: [
    {
      id: 'claims-processing-time',
      title: 'Claims Processing Time',
      description: 'Average time from submission to resolution',
      category: 'processing',
      currentValue: 4.2,
      unit: 'hours',
      format: 'decimal',
      change: -8.7,
      changeDirection: 'positive', // positive means lower is better
      changePeriod: 'vs last week',
      target: 3.5,
      targetDirection: 'lower',
      industryBenchmark: 5.8,
      previousPeriod: 4.6,
      previousPeriodLabel: 'Last week',
      priority: 'high',
      hasAlert: false,
      dataQuality: 0.95,
      lastUpdated: new Date(Date.now() - 5 * 60000), // 5 minutes ago
      trendData: [4.8, 4.6, 4.5, 4.3, 4.2, 4.1, 4.2],
      regionalData: [
        { name: 'Northeast', value: 3.8, change: -12.1, isOutlier: false },
        { name: 'Southeast', value: 4.4, change: -6.3, isOutlier: false },
        { name: 'Midwest', value: 4.6, change: -4.2, isOutlier: false },
        { name: 'West', value: 3.9, change: -15.8, isOutlier: false }
      ],
      insights: [
        {
          id: 1,
          type: 'opportunity',
          text: 'Processing time improved 8.7% due to new automation workflows',
          confidence: 0.92
        },
        {
          id: 2,
          type: 'trend',
          text: 'West region showing exceptional improvement',
          confidence: 0.87
        }
      ]
    },
    
    {
      id: 'first-call-resolution',
      title: 'First Call Resolution',
      description: 'Percentage of issues resolved on first contact',
      category: 'customer',
      currentValue: 0.847,
      format: 'percentage',
      change: 3.2,
      changeDirection: 'positive',
      changePeriod: 'vs last month',
      target: 0.85,
      targetDirection: 'higher',
      industryBenchmark: 0.78,
      previousPeriod: 0.821,
      priority: 'high',
      hasAlert: false,
      dataQuality: 0.91,
      lastUpdated: new Date(Date.now() - 12 * 60000),
      trendData: [0.821, 0.825, 0.831, 0.838, 0.842, 0.845, 0.847],
      regionalData: [
        { name: 'Northeast', value: 0.865, change: 4.1, isOutlier: false },
        { name: 'Southeast', value: 0.823, change: 1.8, isOutlier: false },
        { name: 'Midwest', value: 0.851, change: 3.7, isOutlier: false },
        { name: 'West', value: 0.849, change: 2.9, isOutlier: false }
      ],
      insights: [
        {
          id: 1,
          type: 'opportunity',
          text: 'Close to target - focus on Southeast region for improvement',
          confidence: 0.89
        }
      ]
    },
    
    {
      id: 'claims-cost-per-case',
      title: 'Claims Cost per Case',
      description: 'Average total cost including processing and payouts',
      category: 'financial',
      currentValue: 487,
      unit: '',
      format: 'currency',
      change: -3.4,
      changeDirection: 'positive',
      changePeriod: 'vs last quarter',
      target: 450,
      targetDirection: 'lower',
      industryBenchmark: 523,
      previousPeriod: 504,
      priority: 'medium',
      hasAlert: false,
      dataQuality: 0.88,
      lastUpdated: new Date(Date.now() - 18 * 60000),
      trendData: [524, 515, 508, 496, 491, 485, 487],
      insights: [
        {
          id: 1,
          type: 'trend',
          text: 'Cost reduction trending positively but plateau observed',
          confidence: 0.84
        }
      ]
    },
    
    {
      id: 'underwriting-accuracy',
      title: 'Underwriting Accuracy',
      description: 'Percentage of policies priced correctly vs actual claims',
      category: 'risk',
      currentValue: 0.923,
      format: 'percentage',
      change: 1.8,
      changeDirection: 'positive',
      changePeriod: 'vs last month',
      target: 0.93,
      targetDirection: 'higher',
      industryBenchmark: 0.87,
      previousPeriod: 0.907,
      priority: 'high',
      hasAlert: false,
      dataQuality: 0.93,
      lastUpdated: new Date(Date.now() - 8 * 60000),
      trendData: [0.907, 0.912, 0.918, 0.921, 0.919, 0.922, 0.923],
      insights: [
        {
          id: 1,
          type: 'opportunity',
          text: 'On track to exceed target - new ML models showing impact',
          confidence: 0.91
        }
      ]
    },
    
    {
      id: 'customer-satisfaction',
      title: 'Customer Satisfaction',
      description: 'NPS score from post-interaction surveys',
      category: 'customer',
      currentValue: 94.2,
      format: 'decimal',
      change: 2.1,
      changeDirection: 'positive',
      changePeriod: 'vs last month',
      target: 95,
      targetDirection: 'higher',
      industryBenchmark: 87.3,
      previousPeriod: 92.3,
      priority: 'medium',
      hasAlert: false,
      dataQuality: 0.96,
      lastUpdated: new Date(Date.now() - 3 * 60000),
      trendData: [92.3, 92.8, 93.1, 93.6, 93.9, 94.1, 94.2],
      regionalData: [
        { name: 'Northeast', value: 95.1, change: 2.8, isOutlier: false },
        { name: 'Southeast', value: 93.2, change: 1.1, isOutlier: false },
        { name: 'Midwest', value: 94.7, change: 2.5, isOutlier: false },
        { name: 'West', value: 93.8, change: 2.2, isOutlier: false }
      ]
    },
    
    {
      id: 'operational-efficiency',
      title: 'Operational Efficiency',
      description: 'Claims processed per employee per day',
      category: 'performance',
      currentValue: 23.4,
      format: 'decimal',
      change: 7.3,
      changeDirection: 'positive',
      changePeriod: 'vs last month',
      target: 25,
      targetDirection: 'higher',
      industryBenchmark: 18.7,
      previousPeriod: 21.8,
      priority: 'medium',
      hasAlert: false,
      dataQuality: 0.89,
      lastUpdated: new Date(Date.now() - 15 * 60000),
      trendData: [21.8, 22.1, 22.4, 22.9, 23.2, 23.3, 23.4]
    }
  ],
  
  trends: {
    claimsEfficiency: {
      labels: ['6h ago', '5h ago', '4h ago', '3h ago', '2h ago', '1h ago', 'Now'],
      data: [87, 89, 91, 88, 92, 94, 93],
      target: 90,
      anomalies: [
        {
          index: 3,
          value: 88,
          severity: 'low',
          description: 'Temporary dip during system maintenance'
        }
      ]
    },
    customerExperience: {
      labels: ['6h ago', '5h ago', '4h ago', '3h ago', '2h ago', '1h ago', 'Now'],
      data: [92, 93, 91, 94, 95, 94, 96],
      target: 93,
      anomalies: []
    },
    operationalCost: {
      labels: ['6h ago', '5h ago', '4h ago', '3h ago', '2h ago', '1h ago', 'Now'],
      data: [485, 487, 483, 479, 481, 478, 475],
      target: 480,
      anomalies: [
        {
          index: 6,
          value: 475,
          severity: 'positive',
          description: 'Cost efficiency improvement detected'
        }
      ]
    }
  }
}

export function useOperationalDashboard() {
  // Reactive state
  const operationalKPIs = ref([...mockOperationalData.kpis])
  const executiveSummary = reactive({ ...mockOperationalData.executiveSummary })
  const operationalStatus = reactive({ ...mockOperationalData.operationalStatus })
  const claimsEfficiencyTrend = reactive({ ...mockOperationalData.trends.claimsEfficiency })
  const customerExperienceTrend = reactive({ ...mockOperationalData.trends.customerExperience })
  const operationalCostTrend = reactive({ ...mockOperationalData.trends.operationalCost })
  
  // Computed values
  const totalKPIs = computed(() => operationalKPIs.value.length)
  const alertKPIs = computed(() => operationalKPIs.value.filter(kpi => kpi.hasAlert).length)
  const avgDataQuality = computed(() => {
    const sum = operationalKPIs.value.reduce((acc, kpi) => acc + kpi.dataQuality, 0)
    return sum / operationalKPIs.value.length
  })
  
  // Methods
  const updateKPIs = async (region = 'all', timeframe = '24h') => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Filter data based on region and timeframe
    if (region !== 'all') {
      // Update KPIs based on regional data
      operationalKPIs.value.forEach(kpi => {
        if (kpi.regionalData) {
          const regionalKPI = kpi.regionalData.find(r => r.name.toLowerCase().includes(region.toLowerCase()))
          if (regionalKPI) {
            kpi.currentValue = regionalKPI.value
            kpi.change = regionalKPI.change
          }
        }
      })
    } else {
      // Reset to all regions data
      operationalKPIs.value = [...mockOperationalData.kpis]
    }
    
    // Update timestamps
    operationalKPIs.value.forEach(kpi => {
      kpi.lastUpdated = new Date()
    })
  }
  
  const refreshData = async () => {
    // Simulate fetching fresh data from APIs
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update executive summary with slight variations
    const variations = {
      claimsProcessed: Math.floor(Math.random() * 100) - 50,
      claimsChange: (Math.random() * 2 - 1).toFixed(1),
      avgProcessingTime: (4.2 + (Math.random() * 0.6 - 0.3)).toFixed(1) + 'h',
      timeChange: (Math.random() * 20 - 15).toFixed(1),
      customerSat: (94.2 + (Math.random() * 2 - 1)).toFixed(1),
      satChange: (Math.random() * 4 - 2).toFixed(1),
      costPerClaim: Math.floor(487 + (Math.random() * 50 - 25)),
      costChange: (Math.random() * 10 - 8).toFixed(1)
    }
    
    Object.assign(executiveSummary, {
      ...mockOperationalData.executiveSummary,
      ...variations
    })
    
    // Update operational status based on KPI performance
    const criticalIssues = operationalKPIs.value.filter(kpi => kpi.hasAlert && kpi.priority === 'high').length
    
    if (criticalIssues > 0) {
      Object.assign(operationalStatus, {
        status: 'critical',
        message: `${criticalIssues} critical issue${criticalIssues > 1 ? 's' : ''} detected`
      })
    } else if (Math.random() > 0.8) {
      Object.assign(operationalStatus, {
        status: 'warning',
        message: 'Minor performance degradation detected'
      })
    } else {
      Object.assign(operationalStatus, {
        status: 'operational',
        message: 'All systems operational'
      })
    }
    
    // Update trend data with new data points
    const updateTrendData = (trendObj) => {
      const newValue = trendObj.data[trendObj.data.length - 1] + (Math.random() * 6 - 3)
      trendObj.data.shift() // Remove first element
      trendObj.data.push(Math.round(newValue * 10) / 10) // Add new element
      
      // Update labels
      trendObj.labels.shift()
      trendObj.labels.push('Now')
      trendObj.labels = trendObj.labels.map((label, index) => {
        if (index === trendObj.labels.length - 1) return 'Now'
        return `${trendObj.labels.length - index - 1}h ago`
      })
    }
    
    updateTrendData(claimsEfficiencyTrend)
    updateTrendData(customerExperienceTrend)
    updateTrendData(operationalCostTrend)
    
    // Update individual KPI values with realistic variations
    operationalKPIs.value.forEach(kpi => {
      // Add small random variations to simulate real-time changes
      const baseValue = kpi.currentValue
      const variation = Math.random() * 0.1 - 0.05 // ±5% variation
      
      if (kpi.format === 'percentage') {
        kpi.currentValue = Math.max(0, Math.min(1, baseValue + variation * 0.1))
      } else if (kpi.format === 'currency') {
        kpi.currentValue = Math.max(0, baseValue + Math.floor(variation * 100))
      } else {
        kpi.currentValue = Math.max(0, baseValue + variation * baseValue)
      }
      
      // Update change percentage
      kpi.change += (Math.random() * 2 - 1)
      
      // Update trend data
      if (kpi.trendData) {
        kpi.trendData.shift()
        kpi.trendData.push(kpi.currentValue)
      }
      
      kpi.lastUpdated = new Date()
    })
  }
  
  const getKPIById = (id) => {
    return operationalKPIs.value.find(kpi => kpi.id === id)
  }
  
  const updateKPIAlert = (kpiId, hasAlert, alertMessage = '') => {
    const kpi = getKPIById(kpiId)
    if (kpi) {
      kpi.hasAlert = hasAlert
      kpi.alertMessage = alertMessage
      if (hasAlert) {
        kpi.alertDetails = {
          message: alertMessage,
          severity: 'high',
          timestamp: new Date(),
          actionRequired: true
        }
      }
    }
  }
  
  const calculateKPIHealth = () => {
    const onTargetKPIs = operationalKPIs.value.filter(kpi => {
      if (!kpi.target) return true
      
      if (kpi.targetDirection === 'higher') {
        return kpi.currentValue >= kpi.target
      } else {
        return kpi.currentValue <= kpi.target
      }
    }).length
    
    return {
      percentage: (onTargetKPIs / operationalKPIs.value.length) * 100,
      onTarget: onTargetKPIs,
      total: operationalKPIs.value.length
    }
  }
  
  return {
    // State
    operationalKPIs,
    executiveSummary,
    operationalStatus,
    claimsEfficiencyTrend,
    customerExperienceTrend,
    operationalCostTrend,
    
    // Computed
    totalKPIs,
    alertKPIs,
    avgDataQuality,
    
    // Methods
    updateKPIs,
    refreshData,
    getKPIById,
    updateKPIAlert,
    calculateKPIHealth
  }
}