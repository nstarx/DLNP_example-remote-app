import { ref, reactive, computed, onMounted } from 'vue'

/**
 * AI-Powered Insights Composable for COO Dashboard
 * Provides intelligent recommendations, anomaly detection, and predictive insights
 */
export function useAIInsights() {
  // Core reactive state
  const currentInsight = ref(null)
  const insightHistory = ref([])
  const anomalies = ref([])
  const predictions = ref([])
  const confidence = ref(0.95)
  
  // Insight categories and priorities
  const insightCategories = {
    OPERATIONAL: 'operational',
    FINANCIAL: 'financial', 
    CUSTOMER: 'customer',
    PREDICTIVE: 'predictive',
    ANOMALY: 'anomaly'
  }
  
  const priorities = {
    CRITICAL: 'critical',
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
  }
  
  // AI Insight Templates
  const insightTemplates = [
    {
      id: 'claims_efficiency_improvement',
      category: insightCategories.OPERATIONAL,
      priority: priorities.HIGH,
      template: 'Claims processing efficiency has improved {percentage}% this week. Your automation initiatives are delivering strong ROI of {roi}%.',
      action: 'view_automation_report',
      actionText: 'View Report',
      conditions: (data) => data.efficiencyChange > 0.05,
      confidence: 0.92
    },
    {
      id: 'cost_optimization_opportunity',
      category: insightCategories.FINANCIAL,
      priority: priorities.HIGH,
      template: 'AI analysis suggests {savings}% cost reduction opportunity in {area}. Projected annual savings: ${amount}K.',
      action: 'create_optimization_plan',
      actionText: 'Create Plan',
      conditions: (data) => data.costOptimizationPotential > 0.1,
      confidence: 0.88
    },
    {
      id: 'customer_satisfaction_trend',
      category: insightCategories.CUSTOMER,
      priority: priorities.MEDIUM,
      template: 'Customer satisfaction trending {direction} by {change}%. {insight}',
      action: 'view_csat_details',
      actionText: 'View Details',
      conditions: (data) => Math.abs(data.csatChange) > 0.02,
      confidence: 0.91
    },
    {
      id: 'volume_surge_prediction',
      category: insightCategories.PREDICTIVE,
      priority: priorities.CRITICAL,
      template: 'AI predicts {percentage}% claims volume increase in next {days} days. Recommend {action}.',
      action: 'prepare_surge_response',
      actionText: 'Prepare Response',
      conditions: (data) => data.predictedVolumeIncrease > 0.15,
      confidence: 0.89
    },
    {
      id: 'processing_anomaly',
      category: insightCategories.ANOMALY,
      priority: priorities.CRITICAL,
      template: 'Processing anomaly detected in {region}. Average cycle time increased by {increase}%. Root cause: {cause}.',
      action: 'investigate_anomaly',
      actionText: 'Investigate',
      conditions: (data) => data.hasProcessingAnomaly,
      confidence: 0.95
    },
    {
      id: 'automation_success',
      category: insightCategories.OPERATIONAL,
      priority: priorities.MEDIUM,
      template: 'New workflow automation reduced manual work by {hours} hours this week. ROI: {roi}%.',
      action: 'scale_automation',
      actionText: 'Scale Up',
      conditions: (data) => data.automationImpact > 0.1,
      confidence: 0.87
    },
    {
      id: 'staffing_optimization',
      category: insightCategories.OPERATIONAL,
      priority: priorities.HIGH,
      template: 'AI suggests {adjustment} staffing in {department} by {amount} FTE for optimal efficiency.',
      action: 'review_staffing',
      actionText: 'Review Plan',
      conditions: (data) => data.staffingOptimizationPotential > 0.05,
      confidence: 0.84
    }
  ]
  
  // Mock operational data for AI analysis
  const operationalData = reactive({
    efficiencyChange: 0.12,
    costOptimizationPotential: 0.15,
    csatChange: 0.08,
    predictedVolumeIncrease: 0.23,
    hasProcessingAnomaly: true,
    automationImpact: 0.18,
    staffingOptimizationPotential: 0.12,
    
    // Detailed metrics
    regions: ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'],
    departments: ['Claims Processing', 'Customer Service', 'Underwriting', 'IT Operations'],
    currentROI: 340,
    projectedSavings: 245,
    anomalyRegion: 'Southeast',
    cycleTimeIncrease: 0.25,
    hoursReduced: 120
  })
  
  // AI-driven insight generation
  const generateInsight = () => {
    const eligibleInsights = insightTemplates.filter(template => 
      template.conditions(operationalData)
    )
    
    if (eligibleInsights.length === 0) {
      return generateFallbackInsight()
    }
    
    // Sort by priority and confidence
    eligibleInsights.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return b.confidence - a.confidence
    })
    
    const selectedTemplate = eligibleInsights[0]
    return createInsightFromTemplate(selectedTemplate)
  }
  
  const createInsightFromTemplate = (template) => {
    let text = template.template
    
    // Replace placeholders with actual data
    const replacements = {
      '{percentage}': Math.round(operationalData.efficiencyChange * 100),
      '{roi}': operationalData.currentROI,
      '{savings}': Math.round(operationalData.costOptimizationPotential * 100),
      '{area}': operationalData.departments[Math.floor(Math.random() * operationalData.departments.length)],
      '{amount}': operationalData.projectedSavings,
      '{direction}': operationalData.csatChange > 0 ? 'upward' : 'downward',
      '{change}': Math.round(Math.abs(operationalData.csatChange) * 100),
      '{insight}': operationalData.csatChange > 0 ? 'Digital initiatives showing strong impact.' : 'Requires immediate attention.',
      '{days}': '7',
      '{action}': 'preemptive staffing increase',
      '{region}': operationalData.anomalyRegion,
      '{increase}': Math.round(operationalData.cycleTimeIncrease * 100),
      '{cause}': 'staffing constraints and system bottlenecks',
      '{hours}': operationalData.hoursReduced,
      '{adjustment}': operationalData.staffingOptimizationPotential > 0 ? 'increase' : 'optimize',
      '{department}': operationalData.departments[1], // Customer Service
      '{amount}': Math.round(operationalData.staffingOptimizationPotential * 100)
    }
    
    Object.entries(replacements).forEach(([placeholder, value]) => {
      text = text.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value)
    })
    
    return {
      id: template.id + '_' + Date.now(),
      text,
      category: template.category,
      priority: template.priority,
      action: template.action,
      actionText: template.actionText,
      confidence: template.confidence,
      timestamp: new Date(),
      explanation: generateExplanation(template)
    }
  }
  
  const generateFallbackInsight = () => {
    const fallbackInsights = [
      {
        text: "Operations running smoothly. All key metrics within target ranges.",
        category: insightCategories.OPERATIONAL,
        priority: priorities.LOW,
        confidence: 0.80
      },
      {
        text: "Continue monitoring for optimization opportunities. System performing well.",
        category: insightCategories.OPERATIONAL,
        priority: priorities.LOW,
        confidence: 0.75
      }
    ]
    
    const selected = fallbackInsights[Math.floor(Math.random() * fallbackInsights.length)]
    return {
      ...selected,
      id: 'fallback_' + Date.now(),
      timestamp: new Date(),
      explanation: "Based on overall system health monitoring"
    }
  }
  
  const generateExplanation = (template) => {
    const explanations = {
      'claims_efficiency_improvement': 'Analysis of processing times, automation rates, and throughput metrics over the past 7 days.',
      'cost_optimization_opportunity': 'Machine learning analysis of spending patterns, resource utilization, and benchmark comparisons.',
      'customer_satisfaction_trend': 'Sentiment analysis of customer feedback, support tickets, and survey responses.',
      'volume_surge_prediction': 'Time series analysis combining historical data, seasonal patterns, and external factors.',
      'processing_anomaly': 'Statistical anomaly detection using control charts and variance analysis.',
      'automation_success': 'ROI calculation based on time savings, error reduction, and resource reallocation.',
      'staffing_optimization': 'Workload analysis, capacity planning, and efficiency modeling.'
    }
    
    return explanations[template.id] || 'AI analysis of operational data and performance metrics.'
  }
  
  // Root cause analysis
  const performRootCauseAnalysis = (issue) => {
    const rootCauseMap = {
      'processing_delays': {
        primary: 'Staffing constraints in Southeast region',
        contributing: ['System performance degradation', 'Increased claim complexity', 'Training gaps'],
        recommendation: 'Implement temporary staffing increase and system optimization',
        confidence: 0.91
      },
      'cost_increase': {
        primary: 'Manual processing overhead',
        contributing: ['Legacy system inefficiencies', 'Duplicate work processes', 'Vendor cost inflation'],
        recommendation: 'Accelerate automation initiatives and vendor renegotiation',
        confidence: 0.87
      },
      'satisfaction_decline': {
        primary: 'Response time degradation',
        contributing: ['Channel preference changes', 'Complex policy questions', 'Agent training needs'],
        recommendation: 'Enhance self-service options and agent coaching',
        confidence: 0.89
      }
    }
    
    return rootCauseMap[issue] || {
      primary: 'Multiple contributing factors identified',
      contributing: ['Requires deeper analysis'],
      recommendation: 'Schedule detailed investigation',
      confidence: 0.70
    }
  }
  
  // Anomaly detection
  const detectAnomalies = () => {
    const mockAnomalies = [
      {
        id: 'processing_time_spike',
        type: 'Performance',
        severity: 'High',
        description: 'Claims processing time 40% above normal in Southeast region',
        detected: new Date(Date.now() - 1800000), // 30 minutes ago
        confidence: 0.94,
        impact: 'Customer satisfaction risk',
        rootCause: performRootCauseAnalysis('processing_delays')
      },
      {
        id: 'cost_variance',
        type: 'Financial',
        severity: 'Medium',
        description: 'Operating costs trending 8% above quarterly budget',
        detected: new Date(Date.now() - 7200000), // 2 hours ago
        confidence: 0.89,
        impact: 'Budget variance alert',
        rootCause: performRootCauseAnalysis('cost_increase')
      }
    ]
    
    anomalies.value = mockAnomalies
    return mockAnomalies
  }
  
  // Predictive analytics
  const generatePredictions = () => {
    const mockPredictions = [
      {
        id: 'claims_volume_forecast',
        type: 'Volume Prediction',
        timeframe: '7 days',
        prediction: '+23% increase',
        confidence: 0.89,
        factors: ['Seasonal patterns', 'Regional weather alerts', 'Historical trends'],
        recommendation: 'Increase staffing by 12 FTE in high-impact regions'
      },
      {
        id: 'resource_needs',
        type: 'Resource Planning',
        timeframe: '30 days',
        prediction: '+15% processing workload',
        confidence: 0.85,
        factors: ['Policy renewals cycle', 'Market growth', 'Automation deployment'],
        recommendation: 'Schedule additional training and system capacity review'
      }
    ]
    
    predictions.value = mockPredictions
    return mockPredictions
  }
  
  // Process natural language queries
  const processQuery = (query) => {
    const queryLower = query.toLowerCase()
    const queryResponses = {
      'slow claim': {
        response: 'Southeast region showing 25% slower processing due to staffing constraints. Root cause analysis suggests immediate staffing increase needed.',
        confidence: 0.94,
        action: 'investigate_anomaly',
        actionText: 'View Details'
      },
      'customer satisfaction': {
        response: 'CSAT trending upward (+8% vs last month). Digital channels at 4.1/5.0, phone support leading at 4.5/5.0.',
        confidence: 0.91,
        action: 'view_csat_details',
        actionText: 'Deep Dive'
      },
      'cost': {
        response: 'Operating costs down 8% this quarter. Automation ROI at 340%. Identified additional 15% savings opportunity.',
        confidence: 0.87,
        action: 'view_cost_analysis',
        actionText: 'Analyze'
      },
      'forecast': {
        response: 'AI predicts 23% claims volume increase over next 7 days. Weather patterns and seasonal data indicate sustained surge.',
        confidence: 0.89,
        action: 'prepare_surge_response',
        actionText: 'Prepare'
      },
      'automation': {
        response: 'Automation initiatives reduced manual work by 120 hours this week. Claims routing optimization ready for deployment.',
        confidence: 0.92,
        action: 'scale_automation',
        actionText: 'Deploy'
      }
    }
    
    // Find best match
    let bestMatch = null
    let bestScore = 0
    
    Object.entries(queryResponses).forEach(([key, value]) => {
      if (queryLower.includes(key)) {
        const score = key.length / queryLower.length
        if (score > bestScore) {
          bestScore = score
          bestMatch = value
        }
      }
    })
    
    return bestMatch || {
      response: 'I analyzed your request. Based on current operational data, I recommend focusing on the top priorities highlighted in the dashboard.',
      confidence: 0.75,
      action: null,
      actionText: null
    }
  }
  
  // Lifecycle management
  const rotateInsight = () => {
    const newInsight = generateInsight()
    
    // Add current insight to history
    if (currentInsight.value) {
      insightHistory.value.unshift({
        ...currentInsight.value,
        dismissedAt: new Date()
      })
      
      // Keep only last 10 insights in history
      if (insightHistory.value.length > 10) {
        insightHistory.value = insightHistory.value.slice(0, 10)
      }
    }
    
    currentInsight.value = newInsight
    confidence.value = newInsight.confidence
  }
  
  // Computed properties
  const hasHighPriorityAlerts = computed(() => 
    anomalies.value.some(a => a.severity === 'High')
  )
  
  const insightSummary = computed(() => ({
    total: insightHistory.value.length + (currentInsight.value ? 1 : 0),
    critical: insightHistory.value.filter(i => i.priority === priorities.CRITICAL).length,
    avgConfidence: insightHistory.value.reduce((acc, i) => acc + i.confidence, 0) / Math.max(insightHistory.value.length, 1)
  }))
  
  // Public API
  return {
    // State
    currentInsight,
    insightHistory,
    anomalies,
    predictions,
    confidence,
    
    // Computed
    hasHighPriorityAlerts,
    insightSummary,
    
    // Methods
    generateInsight,
    rotateInsight,
    detectAnomalies,
    generatePredictions,
    performRootCauseAnalysis,
    processQuery,
    
    // Constants
    insightCategories,
    priorities
  }
}