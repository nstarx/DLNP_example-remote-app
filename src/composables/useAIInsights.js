import { ref, reactive, computed } from 'vue'

// Mock AI-generated insights data
const mockAIData = {
  alerts: [
    {
      id: 'alert-001',
      title: 'Claims Processing Bottleneck Detected',
      description: 'AI detected a 15% slowdown in claims processing in the Southeast region over the past 2 hours.',
      type: 'performance',
      severity: 'high',
      confidence: 0.87,
      detectedAt: new Date(Date.now() - 2 * 3600000), // 2 hours ago
      impact: 'Medium',
      affectedSystems: ['Guidewire ClaimCenter', 'Document Processing'],
      estimatedResolution: '2-4 hours',
      explanation: 'Machine learning models detected an unusual pattern in processing times. Analysis indicates this is likely due to a combination of increased document complexity and a temporary reduction in automated processing efficiency.',
      historicalContext: 'Similar patterns occurred 3 times in the past 6 months, typically resolving within 4 hours through staff reallocation and system optimization.',
      suggestedActions: [
        'Increase staffing in Southeast processing center',
        'Review document processing queues for stuck items',
        'Enable backup processing servers',
        'Escalate complex cases to senior adjusters'
      ],
      relatedMetrics: [
        { name: 'Avg Processing Time', value: '5.2h', change: '+15%', trend: 'negative' },
        { name: 'Queue Length', value: '147', change: '+23%', trend: 'negative' },
        { name: 'Auto-approval Rate', value: '67%', change: '-8%', trend: 'negative' }
      ],
      actionable: true,
      actionLabel: 'Auto-scale Resources',
      automationType: 'resource_scaling',
      automationTitle: 'Auto-scale Southeast Processing',
      automationDescription: 'Automatically allocate additional processing resources to Southeast region',
      suggestedActions: ['Enable auto-scaling', 'Reallocate staff', 'Activate backup systems'],
      dismissed: false,
      actionInProgress: false
    },
    
    {
      id: 'alert-002',
      title: 'Customer Satisfaction Anomaly',
      description: 'Unusual dip in customer satisfaction scores detected in auto claims processing.',
      type: 'anomaly',
      severity: 'medium',
      confidence: 0.92,
      detectedAt: new Date(Date.now() - 45 * 60000), // 45 minutes ago
      impact: 'High',
      affectedSystems: ['Customer Portal', 'Survey System'],
      estimatedResolution: '1-2 hours',
      explanation: 'AI analysis reveals correlation between recent system updates and decreased customer satisfaction. Specifically, new UI changes may be causing confusion.',
      actionable: true,
      actionLabel: 'Investigate UI Issues',
      dismissed: false
    },
    
    {
      id: 'alert-003',
      title: 'Cost Optimization Opportunity Identified',
      description: 'AI identified potential $50K monthly savings through vendor contract optimization.',
      type: 'cost',
      severity: 'low',
      confidence: 0.94,
      detectedAt: new Date(Date.now() - 6 * 3600000), // 6 hours ago
      impact: 'Low',
      affectedSystems: ['Vendor Management'],
      estimatedResolution: '2-3 weeks',
      actionable: true,
      actionLabel: 'Review Contracts',
      dismissed: false
    }
  ],
  
  recommendations: [
    {
      id: 'rec-001',
      title: 'Implement Predictive Claim Fraud Detection',
      description: 'Deploy ML models to identify potentially fraudulent claims before manual review, reducing processing time by 30%.',
      category: 'automation',
      priority: 'high',
      confidence: 0.91,
      estimatedSavings: 125000,
      timeToImplement: '6-8 weeks',
      roiTimeline: '3 months',
      difficultyLevel: 'medium',
      generatedAt: new Date(Date.now() - 24 * 3600000), // 24 hours ago
      keySteps: [
        'Analyze historical fraud patterns from past 2 years',
        'Train ML models on fraud indicators',
        'Integrate with existing claims processing workflow',
        'Implement human oversight and feedback loops',
        'Monitor and refine model accuracy'
      ],
      detailedAnalysis: 'Analysis of claims data reveals distinct patterns in fraudulent claims that can be detected early. Current manual fraud detection catches only 67% of cases after full investigation. ML approach can flag 89% of potential fraud cases immediately.',
      dataPoints: [
        { metric: 'Current Fraud Detection Rate', value: '67%', change: 'baseline', trend: 'neutral' },
        { metric: 'Projected Detection Rate', value: '89%', change: '+33%', trend: 'positive' },
        { metric: 'Processing Time Reduction', value: '30%', change: '+30%', trend: 'positive' },
        { metric: 'False Positive Rate', value: '8%', change: 'acceptable', trend: 'neutral' }
      ],
      riskAssessment: {
        level: 'medium',
        description: 'Implementation requires careful testing to avoid false positives that could delay legitimate claims.',
        mitigationSteps: [
          'Implement gradual rollout starting with low-risk claim types',
          'Maintain human oversight for all flagged cases',
          'Establish clear escalation procedures',
          'Regular model retraining and accuracy monitoring'
        ]
      },
      successMetrics: [
        { name: 'Fraud Detection Rate', target: '85%+', timeframe: '6 months' },
        { name: 'Processing Time Reduction', target: '25%+', timeframe: '3 months' },
        { name: 'False Positive Rate', target: '<10%', timeframe: 'ongoing' },
        { name: 'Cost Savings', target: '$100K+/month', timeframe: '6 months' }
      ],
      implemented: false,
      implementing: false,
      dismissed: false
    },
    
    {
      id: 'rec-002',
      title: 'Optimize Customer Service Staffing Patterns',
      description: 'Use predictive analytics to adjust staffing levels based on call volume predictions, improving response times by 25%.',
      category: 'efficiency',
      priority: 'high',
      confidence: 0.88,
      estimatedSavings: 85000,
      timeToImplement: '3-4 weeks',
      roiTimeline: '2 months',
      difficultyLevel: 'easy',
      generatedAt: new Date(Date.now() - 18 * 3600000),
      keySteps: [
        'Analyze historical call patterns and seasonal trends',
        'Develop predictive models for call volume forecasting',
        'Create dynamic staffing schedules',
        'Implement automated schedule adjustments',
        'Train management on new scheduling system'
      ],
      detailedAnalysis: 'Current staffing follows fixed schedules that don\'t align with actual demand patterns. Peak times are understaffed while off-peak periods are overstaffed by 23% on average.',
      implemented: false,
      dismissed: false
    },
    
    {
      id: 'rec-003',
      title: 'Consolidate Third-Party Vendor Contracts',
      description: 'Consolidate 12 separate vendor contracts into 3 strategic partnerships, reducing costs by 18% while improving service quality.',
      category: 'cost',
      priority: 'medium',
      confidence: 0.85,
      estimatedSavings: 240000,
      timeToImplement: '12-16 weeks',
      roiTimeline: '6 months',
      difficultyLevel: 'hard',
      generatedAt: new Date(Date.now() - 72 * 3600000),
      keySteps: [
        'Audit current vendor performance and costs',
        'Identify consolidation opportunities',
        'Negotiate new master service agreements',
        'Plan migration timeline',
        'Execute transition with minimal service disruption'
      ],
      implemented: false,
      dismissed: false
    },
    
    {
      id: 'rec-004',
      title: 'Implement Automated Claims Triage System',
      description: 'Deploy AI-powered triage to automatically categorize and route claims, reducing manual sorting time by 60%.',
      category: 'automation',
      priority: 'medium',
      confidence: 0.93,
      estimatedSavings: 95000,
      timeToImplement: '8-10 weeks',
      roiTimeline: '4 months',
      difficultyLevel: 'medium',
      generatedAt: new Date(Date.now() - 96 * 3600000),
      keySteps: [
        'Map current claims routing workflow',
        'Train AI models on historical claim categories',
        'Develop automated routing rules',
        'Integrate with existing claims management system',
        'Test and validate routing accuracy'
      ],
      implemented: false,
      dismissed: false
    }
  ],
  
  rootCauseAnalysis: {
    id: 'rca-001',
    title: 'Southeast Region Performance Decline',
    summary: 'Deep analysis of 15% performance decline in Southeast region over past week',
    confidence: 0.89,
    primaryCause: 'Staff shortage due to seasonal flu outbreak',
    contributingFactors: [
      'New employee onboarding delays (23% of normal capacity)',
      'Increased claim complexity in auto insurance (hurricane season)',
      'System performance degradation during peak hours'
    ],
    timeline: [
      {
        time: '7 days ago',
        event: 'First signs of processing slowdown detected',
        impact: 'minimal'
      },
      {
        time: '5 days ago',
        event: 'Staff shortage becomes apparent (15% absence rate)',
        impact: 'moderate'
      },
      {
        time: '3 days ago',
        event: 'Claim complexity spike begins (hurricane season)',
        impact: 'significant'
      },
      {
        time: '1 day ago',
        event: 'System performance issues compound problems',
        impact: 'critical'
      }
    ],
    dataEvidence: {
      staffingLevel: '85% of normal capacity',
      claimComplexity: '+32% vs normal',
      systemPerformance: '12% slower response times',
      customerImpact: '8% increase in complaints'
    },
    recommendedActions: [
      'Immediate: Deploy temporary staff from other regions',
      'Short-term: Expedite new hire training programs',
      'Medium-term: Implement cross-training initiatives',
      'Long-term: Develop seasonal staffing strategy'
    ],
    preventionMeasures: [
      'Establish minimum staffing thresholds with auto-alerts',
      'Create seasonal surge capacity plans',
      'Implement predictive health monitoring for staff',
      'Develop automated workload balancing across regions'
    ]
  },
  
  forecasts: {
    claims: {
      title: 'Claims Volume Forecast',
      timeframe: '30 days',
      confidence: 0.86,
      currentValue: 2847,
      forecastValue: 3124,
      change: 9.7,
      trend: 'increasing',
      factors: [
        'Seasonal increase (winter weather claims)',
        'Marketing campaign driving new policies',
        'Economic indicators suggesting higher activity'
      ],
      data: [
        { date: '2024-01-15', value: 2847, type: 'actual' },
        { date: '2024-01-16', value: 2891, type: 'forecast', confidence: 0.91 },
        { date: '2024-01-17', value: 2923, type: 'forecast', confidence: 0.89 },
        { date: '2024-01-18', value: 2956, type: 'forecast', confidence: 0.87 },
        { date: '2024-01-19', value: 2994, type: 'forecast', confidence: 0.85 },
        { date: '2024-01-20', value: 3021, type: 'forecast', confidence: 0.83 },
        { date: '2024-01-21', value: 3048, type: 'forecast', confidence: 0.81 },
        { date: '2024-01-22', value: 3078, type: 'forecast', confidence: 0.79 },
        { date: '2024-01-23', value: 3101, type: 'forecast', confidence: 0.77 },
        { date: '2024-01-24', value: 3124, type: 'forecast', confidence: 0.75 }
      ],
      recommendation: 'Prepare for 10% increase in claims volume. Consider scaling processing capacity.'
    },
    
    delays: {
      title: 'Processing Delay Prediction',
      timeframe: '14 days',
      confidence: 0.82,
      currentValue: 4.2,
      forecastValue: 4.8,
      change: 14.3,
      trend: 'increasing',
      factors: [
        'Projected increase in claims volume',
        'Holiday schedule reducing staff availability',
        'Complex claims requiring manual review'
      ],
      data: [
        { date: '2024-01-15', value: 4.2, type: 'actual' },
        { date: '2024-01-16', value: 4.3, type: 'forecast' },
        { date: '2024-01-17', value: 4.4, type: 'forecast' },
        { date: '2024-01-18', value: 4.5, type: 'forecast' },
        { date: '2024-01-19', value: 4.6, type: 'forecast' },
        { date: '2024-01-20', value: 4.7, type: 'forecast' },
        { date: '2024-01-21', value: 4.8, type: 'forecast' }
      ],
      recommendation: 'Proactively increase staffing or enable overtime to prevent delays.'
    },
    
    resources: {
      title: 'Resource Requirements',
      timeframe: '30 days',
      confidence: 0.89,
      currentValue: 127,
      forecastValue: 142,
      change: 11.8,
      trend: 'increasing',
      factors: [
        'Claims volume increase requiring more adjusters',
        'Seasonal complexity requiring senior staff',
        'System maintenance requiring IT resources'
      ],
      data: [
        { date: '2024-01-15', value: 127, type: 'actual', category: 'total' },
        { date: '2024-01-20', value: 132, type: 'forecast', category: 'total' },
        { date: '2024-01-25', value: 137, type: 'forecast', category: 'total' },
        { date: '2024-01-30', value: 142, type: 'forecast', category: 'total' }
      ],
      breakdown: {
        adjusters: { current: 89, forecast: 98, change: 10.1 },
        customerService: { current: 23, forecast: 26, change: 13.0 },
        management: { current: 15, forecast: 18, change: 20.0 }
      },
      recommendation: 'Begin recruitment process for 15 additional staff members across all departments.'
    }
  },
  
  criticalAlerts: [
    {
      id: 'critical-001',
      title: 'System Performance Degradation',
      message: 'Claims processing system response time increased by 45% in last hour',
      severity: 'critical',
      timestamp: new Date(Date.now() - 15 * 60000),
      source: 'Infrastructure Monitoring',
      actionable: true,
      automationType: 'system_scaling',
      automationTitle: 'Auto-scale Processing Infrastructure',
      automationDescription: 'Automatically scale processing servers to handle increased load',
      suggestedActions: ['Scale processing servers', 'Enable load balancing', 'Restart slow services']
    },
    
    {
      id: 'critical-002',
      title: 'Regulatory Compliance Risk',
      message: '12 claims approaching SLA deadline without resolution',
      severity: 'high',
      timestamp: new Date(Date.now() - 32 * 60000),
      source: 'Compliance Monitoring',
      actionable: true,
      automationType: 'priority_escalation',
      automationTitle: 'Auto-escalate Priority Claims',
      automationDescription: 'Automatically escalate approaching deadline claims to senior staff',
      suggestedActions: ['Escalate to senior adjusters', 'Extend work hours', 'Expedite processing']
    }
  ]
}

export function useAIInsights() {
  // Reactive state
  const aiAlerts = ref([...mockAIData.alerts])
  const aiRecommendations = ref([...mockAIData.recommendations])
  const rootCauseAnalysis = reactive({ ...mockAIData.rootCauseAnalysis })
  const claimsForecast = reactive({ ...mockAIData.forecasts.claims })
  const delayForecast = reactive({ ...mockAIData.forecasts.delays })
  const resourceForecast = reactive({ ...mockAIData.forecasts.resources })
  const criticalAlerts = ref([...mockAIData.criticalAlerts])
  const detectedAnomalies = reactive({
    efficiency: [],
    experience: [],
    cost: []
  })
  
  // Computed values
  const totalAlerts = computed(() => aiAlerts.value.filter(alert => !alert.dismissed).length)
  const criticalAlertCount = computed(() => aiAlerts.value.filter(alert => alert.severity === 'critical' && !alert.dismissed).length)
  const activeRecommendations = computed(() => aiRecommendations.value.filter(rec => !rec.dismissed && !rec.implemented).length)
  const totalPotentialSavings = computed(() => {
    return aiRecommendations.value
      .filter(rec => !rec.dismissed && !rec.implemented)
      .reduce((sum, rec) => sum + (rec.estimatedSavings || 0), 0)
  })
  
  // Methods
  const processAIQuery = async (query) => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock AI responses based on query content
    const responses = {
      'regions.*slow.*claim': {
        type: 'analysis',
        title: 'Regional Claims Processing Analysis',
        summary: 'Southeast region showing 23% slower processing times due to staff shortage and increased claim complexity.',
        insights: [
          'Southeast region: 5.7h avg processing time (vs 4.2h company avg)',
          'Root cause: 15% staff shortage + 32% increase in complex claims',
          'Recommendation: Deploy 3 temporary adjusters from Northeast region'
        ],
        data: {
          regions: [
            { name: 'Southeast', avgTime: 5.7, status: 'attention' },
            { name: 'Northeast', avgTime: 3.8, status: 'excellent' },
            { name: 'Midwest', avgTime: 4.1, status: 'good' },
            { name: 'West', avgTime: 4.3, status: 'good' }
          ]
        },
        confidence: 0.91
      },
      
      'forecast.*claim.*volume': {
        type: 'forecast',
        title: 'Claims Volume Forecast',
        summary: 'Predicting 12% increase in claims volume over next 30 days due to seasonal factors.',
        insights: [
          'Winter weather claims expected to increase by 18%',
          'New marketing campaign may drive 8% more policies',
          'Economic indicators suggest 5% baseline growth'
        ],
        data: claimsForecast,
        confidence: 0.86
      },
      
      'cost.*reduction.*opportunities': {
        type: 'cost_analysis',
        title: 'Cost Reduction Opportunities',
        summary: 'Identified $470K annual savings potential across 4 key areas.',
        insights: [
          'Vendor consolidation: $240K potential savings',
          'Process automation: $125K potential savings',
          'Staffing optimization: $85K potential savings',
          'Technology optimization: $20K potential savings'
        ],
        data: {
          opportunities: aiRecommendations.value.filter(rec => rec.category === 'cost')
        },
        confidence: 0.88
      },
      
      'customer.*satisfaction.*trends': {
        type: 'trend_analysis',
        title: 'Customer Satisfaction Trends',
        summary: 'Customer satisfaction improving steadily with 94.2% current score, trending toward 95% target.',
        insights: [
          'NPS score increased 2.1% month-over-month',
          'First-call resolution rate at 84.7% (target: 85%)',
          'Average response time decreased by 12%',
          'Top satisfaction driver: Claims processing speed'
        ],
        data: {
          currentScore: 94.2,
          target: 95.0,
          trend: 'positive',
          regional: [
            { region: 'Northeast', score: 95.1 },
            { region: 'Southeast', score: 93.2 },
            { region: 'Midwest', score: 94.7 },
            { region: 'West', score: 93.8 }
          ]
        },
        confidence: 0.93
      }
    }
    
    // Find matching response based on query content
    const matchedKey = Object.keys(responses).find(pattern => {
      const regex = new RegExp(pattern, 'i')
      return regex.test(query)
    })
    
    if (matchedKey) {
      return responses[matchedKey]
    }
    
    // Default response for unrecognized queries
    return {
      type: 'general',
      title: 'AI Analysis Result',
      summary: `I analyzed your query: "${query}". Here's what I found based on current operational data.`,
      insights: [
        'Current operational efficiency: 93% (above target)',
        'Claims processing trending positively with 4.2h average',
        'Customer satisfaction at 94.2% (near target of 95%)',
        'Cost per claim decreased 3.4% vs last quarter'
      ],
      confidence: 0.75,
      suggestion: 'For more specific insights, try queries like "show regions with slowest claim times" or "forecast processing delays"'
    }
  }
  
  const dismissAlert = (alertId) => {
    const alert = aiAlerts.value.find(a => a.id === alertId)
    if (alert) {
      alert.dismissed = true
      alert.dismissedAt = new Date()
    }
  }
  
  const executeRecommendation = async (recommendation, action = 'implement') => {
    const rec = aiRecommendations.value.find(r => r.id === recommendation.id)
    if (!rec) return
    
    if (action === 'implement') {
      rec.implementing = true
      
      // Simulate implementation time
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      rec.implementing = false
      rec.implemented = true
      rec.implementedAt = new Date()
      
      // Create success alert
      aiAlerts.value.unshift({
        id: `impl-${rec.id}`,
        title: 'Recommendation Implemented Successfully',
        description: `"${rec.title}" has been implemented and is now active.`,
        type: 'success',
        severity: 'low',
        confidence: 1.0,
        detectedAt: new Date(),
        actionable: false,
        dismissed: false
      })
    }
  }
  
  const refreshForecast = async () => {
    // Simulate AI recalculation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update forecasts with slight variations
    const updateForecast = (forecast) => {
      const variation = (Math.random() * 0.1 - 0.05) // ±5% variation
      forecast.forecastValue = Math.round(forecast.forecastValue * (1 + variation))
      forecast.change = ((forecast.forecastValue - forecast.currentValue) / forecast.currentValue * 100)
      
      // Update confidence (slightly decrease to simulate uncertainty over time)
      forecast.confidence = Math.max(0.7, forecast.confidence - 0.02)
      
      // Update data points
      if (forecast.data) {
        forecast.data.forEach(point => {
          if (point.type === 'forecast') {
            point.value = Math.round(point.value * (1 + variation * 0.5))
          }
        })
      }
    }
    
    updateForecast(claimsForecast)
    updateForecast(delayForecast)
    updateForecast(resourceForecast)
  }
  
  const detectAnomalies = async () => {
    // Simulate AI anomaly detection
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    // Generate mock anomalies
    const generateAnomaly = () => ({
      id: `anomaly-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(Date.now() - Math.random() * 3600000), // Within last hour
      severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      description: [
        'Unusual spike detected in processing time',
        'Unexpected pattern in customer satisfaction scores',
        'Cost variance beyond normal range identified',
        'Processing efficiency deviation from baseline'
      ][Math.floor(Math.random() * 4)],
      confidence: 0.7 + Math.random() * 0.25, // 70-95% confidence
      metric: Math.random() * 100,
      baseline: Math.random() * 100
    })
    
    // Clear previous anomalies and add new ones
    detectedAnomalies.efficiency = Math.random() > 0.7 ? [generateAnomaly()] : []
    detectedAnomalies.experience = Math.random() > 0.8 ? [generateAnomaly()] : []
    detectedAnomalies.cost = Math.random() > 0.6 ? [generateAnomaly()] : []
    
    // Add anomaly alert if high severity detected
    const highSeverityAnomalies = Object.values(detectedAnomalies)
      .flat()
      .filter(anomaly => anomaly.severity === 'high')
    
    if (highSeverityAnomalies.length > 0) {
      const anomaly = highSeverityAnomalies[0]
      aiAlerts.value.unshift({
        id: `anomaly-alert-${Date.now()}`,
        title: 'High-Severity Anomaly Detected',
        description: anomaly.description,
        type: 'anomaly',
        severity: 'high',
        confidence: anomaly.confidence,
        detectedAt: anomaly.timestamp,
        actionable: true,
        actionLabel: 'Investigate Anomaly',
        dismissed: false
      })
    }
  }
  
  const generateInsight = (type, data) => {
    const insights = {
      performance: [
        'Claims processing efficiency improved by 8% this week',
        'Southeast region showing significant improvement in response times',
        'Automated workflows handling 67% of routine claims'
      ],
      cost: [
        'Vendor consolidation opportunity identified: potential $50K savings',
        'Processing costs down 3.2% due to automation improvements',
        'Overtime costs trending 15% below budget'
      ],
      customer: [
        'Customer satisfaction scores trending above industry benchmark',
        'First-call resolution rate improved to 84.7%',
        'Average response time decreased by 12% month-over-month'
      ]
    }
    
    return insights[type] || ['No specific insights available for this metric']
  }
  
  const updateRootCauseAnalysis = (issue) => {
    // Update root cause analysis with new findings
    Object.assign(rootCauseAnalysis, {
      ...rootCauseAnalysis,
      lastUpdated: new Date(),
      newFindings: issue
    })
  }
  
  return {
    // State
    aiAlerts,
    aiRecommendations,
    rootCauseAnalysis,
    claimsForecast,
    delayForecast,
    resourceForecast,
    detectedAnomalies,
    criticalAlerts,
    
    // Computed
    totalAlerts,
    criticalAlertCount,
    activeRecommendations,
    totalPotentialSavings,
    
    // Methods
    processAIQuery,
    dismissAlert,
    executeRecommendation,
    refreshForecast,
    detectAnomalies,
    generateInsight,
    updateRootCauseAnalysis
  }
}