// Innovation Dashboard Mock Data for SHI International

// 1. Innovation Pipeline & Portfolio Metrics
export const pipelineMetrics = {
  '24h': [
    { label: 'New Ideas Submitted', value: 12, change: '+15%', trend: 'up', format: 'number' },
    { label: 'Ideas in Review', value: 45, change: '+8%', trend: 'up', format: 'number' },
    { label: 'Active Pilots', value: 18, change: '0%', trend: 'neutral', format: 'number' },
    { label: 'Idea → Pilot Rate', value: 32, change: '+5%', trend: 'up', format: 'percentage' }
  ],
  '7d': [
    { label: 'New Ideas Submitted', value: 89, change: '+22%', trend: 'up', format: 'number' },
    { label: 'Ideas in Review', value: 156, change: '+12%', trend: 'up', format: 'number' },
    { label: 'Active Pilots', value: 34, change: '+13%', trend: 'up', format: 'number' },
    { label: 'Idea → Pilot Rate', value: 28, change: '+3%', trend: 'up', format: 'percentage' }
  ],
  '30d': [
    { label: 'New Ideas Submitted', value: 342, change: '+18%', trend: 'up', format: 'number' },
    { label: 'Ideas in Review', value: 287, change: '+15%', trend: 'up', format: 'number' },
    { label: 'Active Pilots', value: 67, change: '+25%', trend: 'up', format: 'number' },
    { label: 'Idea → Pilot Rate', value: 31, change: '+7%', trend: 'up', format: 'percentage' }
  ],
  '90d': [
    { label: 'New Ideas Submitted', value: 1024, change: '+35%', trend: 'up', format: 'number' },
    { label: 'Ideas in Review', value: 456, change: '+28%', trend: 'up', format: 'number' },
    { label: 'Active Pilots', value: 125, change: '+42%', trend: 'up', format: 'number' },
    { label: 'Idea → Pilot Rate', value: 29, change: '+12%', trend: 'up', format: 'percentage' }
  ]
}

// 2. Revenue & EBITDA Impact Metrics
export const revenueMetrics = {
  '24h': [
    { label: 'Innovation Revenue', value: 2.8, change: '+12%', trend: 'up', format: 'currency', unit: 'M' },
    { label: 'EBITDA Contribution', value: 1.2, change: '+8%', trend: 'up', format: 'currency', unit: 'M' },
    { label: 'Recurring Revenue %', value: 34, change: '+2%', trend: 'up', format: 'percentage' },
    { label: 'Margin Improvement', value: 15, change: '+3%', trend: 'up', format: 'percentage' }
  ],
  '7d': [
    { label: 'Innovation Revenue', value: 19.4, change: '+18%', trend: 'up', format: 'currency', unit: 'M' },
    { label: 'EBITDA Contribution', value: 8.7, change: '+15%', trend: 'up', format: 'currency', unit: 'M' },
    { label: 'Recurring Revenue %', value: 36, change: '+4%', trend: 'up', format: 'percentage' },
    { label: 'Margin Improvement', value: 18, change: '+5%', trend: 'up', format: 'percentage' }
  ],
  '30d': [
    { label: 'Innovation Revenue', value: 87.2, change: '+25%', trend: 'up', format: 'currency', unit: 'M' },
    { label: 'EBITDA Contribution', value: 34.5, change: '+22%', trend: 'up', format: 'currency', unit: 'M' },
    { label: 'Recurring Revenue %', value: 38, change: '+6%', trend: 'up', format: 'percentage' },
    { label: 'Margin Improvement', value: 21, change: '+8%', trend: 'up', format: 'percentage' }
  ],
  '90d': [
    { label: 'Innovation Revenue', value: 267.8, change: '+32%', trend: 'up', format: 'currency', unit: 'M' },
    { label: 'EBITDA Contribution', value: 98.6, change: '+28%', trend: 'up', format: 'currency', unit: 'M' },
    { label: 'Recurring Revenue %', value: 42, change: '+12%', trend: 'up', format: 'percentage' },
    { label: 'Margin Improvement', value: 26, change: '+15%', trend: 'up', format: 'percentage' }
  ]
}

// 3. Customer Value & Differentiation Metrics
export const customerMetrics = {
  '24h': [
    { label: 'Software Attach Rate', value: 67, change: '+4%', trend: 'up', format: 'percentage' },
    { label: 'Avg Deal Size Uplift', value: 23, change: '+7%', trend: 'up', format: 'percentage' },
    { label: 'Customer Retention', value: 94, change: '+1%', trend: 'up', format: 'percentage' },
    { label: 'Innovation NPS', value: 72, change: '+3%', trend: 'up', format: 'number' }
  ],
  '7d': [
    { label: 'Software Attach Rate', value: 69, change: '+6%', trend: 'up', format: 'percentage' },
    { label: 'Avg Deal Size Uplift', value: 28, change: '+12%', trend: 'up', format: 'percentage' },
    { label: 'Customer Retention', value: 95, change: '+2%', trend: 'up', format: 'percentage' },
    { label: 'Innovation NPS', value: 74, change: '+5%', trend: 'up', format: 'number' }
  ],
  '30d': [
    { label: 'Software Attach Rate', value: 72, change: '+8%', trend: 'up', format: 'percentage' },
    { label: 'Avg Deal Size Uplift', value: 31, change: '+15%', trend: 'up', format: 'percentage' },
    { label: 'Customer Retention', value: 96, change: '+3%', trend: 'up', format: 'percentage' },
    { label: 'Innovation NPS', value: 78, change: '+8%', trend: 'up', format: 'number' }
  ],
  '90d': [
    { label: 'Software Attach Rate', value: 76, change: '+12%', trend: 'up', format: 'percentage' },
    { label: 'Avg Deal Size Uplift', value: 35, change: '+22%', trend: 'up', format: 'percentage' },
    { label: 'Customer Retention', value: 97, change: '+5%', trend: 'up', format: 'percentage' },
    { label: 'Innovation NPS', value: 82, change: '+15%', trend: 'up', format: 'number' }
  ]
}

// 4. Partner & Ecosystem Metrics
export const partnerMetrics = {
  '24h': [
    { label: 'New ISV/SaaS Partners', value: 3, change: '+50%', trend: 'up', format: 'number' },
    { label: 'Partner Revenue %', value: 42, change: '+3%', trend: 'up', format: 'percentage' },
    { label: 'Co-innovation Projects', value: 8, change: '+14%', trend: 'up', format: 'number' },
    { label: 'Marketplace Growth', value: 18, change: '+22%', trend: 'up', format: 'percentage' }
  ],
  '7d': [
    { label: 'New ISV/SaaS Partners', value: 12, change: '+33%', trend: 'up', format: 'number' },
    { label: 'Partner Revenue %', value: 44, change: '+5%', trend: 'up', format: 'percentage' },
    { label: 'Co-innovation Projects', value: 23, change: '+21%', trend: 'up', format: 'number' },
    { label: 'Marketplace Growth', value: 25, change: '+28%', trend: 'up', format: 'percentage' }
  ],
  '30d': [
    { label: 'New ISV/SaaS Partners', value: 47, change: '+42%', trend: 'up', format: 'number' },
    { label: 'Partner Revenue %', value: 46, change: '+8%', trend: 'up', format: 'percentage' },
    { label: 'Co-innovation Projects', value: 67, change: '+35%', trend: 'up', format: 'number' },
    { label: 'Marketplace Growth', value: 32, change: '+45%', trend: 'up', format: 'percentage' }
  ],
  '90d': [
    { label: 'New ISV/SaaS Partners', value: 142, change: '+58%', trend: 'up', format: 'number' },
    { label: 'Partner Revenue %', value: 49, change: '+15%', trend: 'up', format: 'percentage' },
    { label: 'Co-innovation Projects', value: 189, change: '+67%', trend: 'up', format: 'number' },
    { label: 'Marketplace Growth', value: 48, change: '+75%', trend: 'up', format: 'percentage' }
  ]
}

// 5. Operational & Execution Efficiency Metrics
export const operationalMetrics = {
  '24h': [
    { label: 'Innovation ROI', value: 3.2, change: '+8%', trend: 'up', format: 'ratio', unit: 'x' },
    { label: 'Sales Training Complete', value: 78, change: '+12%', trend: 'up', format: 'percentage' },
    { label: 'Internal AI Adoption', value: 56, change: '+15%', trend: 'up', format: 'percentage' },
    { label: 'Time to Pilot (days)', value: 45, change: '-8%', trend: 'up', format: 'number' }
  ],
  '7d': [
    { label: 'Innovation ROI', value: 3.4, change: '+12%', trend: 'up', format: 'ratio', unit: 'x' },
    { label: 'Sales Training Complete', value: 82, change: '+18%', trend: 'up', format: 'percentage' },
    { label: 'Internal AI Adoption', value: 61, change: '+22%', trend: 'up', format: 'percentage' },
    { label: 'Time to Pilot (days)', value: 42, change: '-12%', trend: 'up', format: 'number' }
  ],
  '30d': [
    { label: 'Innovation ROI', value: 3.7, change: '+18%', trend: 'up', format: 'ratio', unit: 'x' },
    { label: 'Sales Training Complete', value: 87, change: '+25%', trend: 'up', format: 'percentage' },
    { label: 'Internal AI Adoption', value: 68, change: '+35%', trend: 'up', format: 'percentage' },
    { label: 'Time to Pilot (days)', value: 38, change: '-18%', trend: 'up', format: 'number' }
  ],
  '90d': [
    { label: 'Innovation ROI', value: 4.1, change: '+28%', trend: 'up', format: 'ratio', unit: 'x' },
    { label: 'Sales Training Complete', value: 93, change: '+42%', trend: 'up', format: 'percentage' },
    { label: 'Internal AI Adoption', value: 76, change: '+58%', trend: 'up', format: 'percentage' },
    { label: 'Time to Pilot (days)', value: 32, change: '-28%', trend: 'up', format: 'number' }
  ]
}

// 6. Strategic Foresight & Differentiation Metrics
export const strategicMetrics = {
  '24h': [
    { label: 'Emerging Tech Readiness', value: 73, change: '+5%', trend: 'up', format: 'percentage' },
    { label: 'AI/Cloud Portfolio %', value: 58, change: '+8%', trend: 'up', format: 'percentage' },
    { label: 'Competitive Differentiation', value: 67, change: '+3%', trend: 'up', format: 'score' },
    { label: 'Market Share Growth', value: 12, change: '+15%', trend: 'up', format: 'percentage' }
  ],
  '7d': [
    { label: 'Emerging Tech Readiness', value: 75, change: '+7%', trend: 'up', format: 'percentage' },
    { label: 'AI/Cloud Portfolio %', value: 62, change: '+12%', trend: 'up', format: 'percentage' },
    { label: 'Competitive Differentiation', value: 71, change: '+6%', trend: 'up', format: 'score' },
    { label: 'Market Share Growth', value: 18, change: '+25%', trend: 'up', format: 'percentage' }
  ],
  '30d': [
    { label: 'Emerging Tech Readiness', value: 78, change: '+12%', trend: 'up', format: 'percentage' },
    { label: 'AI/Cloud Portfolio %', value: 67, change: '+18%', trend: 'up', format: 'percentage' },
    { label: 'Competitive Differentiation', value: 76, change: '+12%', trend: 'up', format: 'score' },
    { label: 'Market Share Growth', value: 24, change: '+35%', trend: 'up', format: 'percentage' }
  ],
  '90d': [
    { label: 'Emerging Tech Readiness', value: 82, change: '+22%', trend: 'up', format: 'percentage' },
    { label: 'AI/Cloud Portfolio %', value: 74, change: '+28%', trend: 'up', format: 'percentage' },
    { label: 'Competitive Differentiation', value: 83, change: '+22%', trend: 'up', format: 'score' },
    { label: 'Market Share Growth', value: 32, change: '+58%', trend: 'up', format: 'percentage' }
  ]
}

// 7. Culture & Talent Metrics
export const cultureMetrics = {
  '24h': [
    { label: 'Ideas per Employee', value: 2.3, change: '+12%', trend: 'up', format: 'decimal' },
    { label: 'Innovation Training %', value: 68, change: '+8%', trend: 'up', format: 'percentage' },
    { label: 'Hackathon Participation', value: 45, change: '+18%', trend: 'up', format: 'percentage' },
    { label: 'Innovation Talent Retention', value: 92, change: '+3%', trend: 'up', format: 'percentage' }
  ],
  '7d': [
    { label: 'Ideas per Employee', value: 2.7, change: '+18%', trend: 'up', format: 'decimal' },
    { label: 'Innovation Training %', value: 72, change: '+15%', trend: 'up', format: 'percentage' },
    { label: 'Hackathon Participation', value: 52, change: '+25%', trend: 'up', format: 'percentage' },
    { label: 'Innovation Talent Retention', value: 93, change: '+4%', trend: 'up', format: 'percentage' }
  ],
  '30d': [
    { label: 'Ideas per Employee', value: 3.1, change: '+28%', trend: 'up', format: 'decimal' },
    { label: 'Innovation Training %', value: 78, change: '+22%', trend: 'up', format: 'percentage' },
    { label: 'Hackathon Participation', value: 61, change: '+35%', trend: 'up', format: 'percentage' },
    { label: 'Innovation Talent Retention', value: 94, change: '+6%', trend: 'up', format: 'percentage' }
  ],
  '90d': [
    { label: 'Ideas per Employee', value: 3.8, change: '+42%', trend: 'up', format: 'decimal' },
    { label: 'Innovation Training %', value: 85, change: '+38%', trend: 'up', format: 'percentage' },
    { label: 'Hackathon Participation', value: 73, change: '+55%', trend: 'up', format: 'percentage' },
    { label: 'Innovation Talent Retention', value: 96, change: '+12%', trend: 'up', format: 'percentage' }
  ]
}

// Chart Data for Innovation Pipeline Funnel
export const pipelineFunnelData = {
  '24h': {
    labels: ['Ideas Submitted', 'Ideas Reviewed', 'Concepts Approved', 'Pilots Started', 'Scaled Deployments'],
    data: [120, 95, 67, 34, 18],
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
  },
  '7d': {
    labels: ['Ideas Submitted', 'Ideas Reviewed', 'Concepts Approved', 'Pilots Started', 'Scaled Deployments'],
    data: [342, 287, 198, 89, 45],
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
  },
  '30d': {
    labels: ['Ideas Submitted', 'Ideas Reviewed', 'Concepts Approved', 'Pilots Started', 'Scaled Deployments'],
    data: [1024, 856, 623, 287, 142],
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
  },
  '90d': {
    labels: ['Ideas Submitted', 'Ideas Reviewed', 'Concepts Approved', 'Pilots Started', 'Scaled Deployments'],
    data: [3200, 2687, 1943, 876, 423],
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
  }
}

// Portfolio Mix Data (Core, Adjacent, Transformational)
export const portfolioMixData = {
  '24h': {
    labels: ['Core Innovation', 'Adjacent Markets', 'Transformational'],
    data: [65, 25, 10],
    colors: ['#10B981', '#F59E0B', '#EF4444']
  },
  '7d': {
    labels: ['Core Innovation', 'Adjacent Markets', 'Transformational'],
    data: [62, 28, 10],
    colors: ['#10B981', '#F59E0B', '#EF4444']
  },
  '30d': {
    labels: ['Core Innovation', 'Adjacent Markets', 'Transformational'],
    data: [58, 30, 12],
    colors: ['#10B981', '#F59E0B', '#EF4444']
  },
  '90d': {
    labels: ['Core Innovation', 'Adjacent Markets', 'Transformational'],
    data: [55, 32, 13],
    colors: ['#10B981', '#F59E0B', '#EF4444']
  }
}

// Revenue Trend Data
export const revenueTrendData = {
  '24h': {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    innovation: [2.1, 2.3, 2.5, 2.7, 2.8, 2.8],
    traditional: [8.5, 8.6, 8.7, 8.8, 8.9, 9.0]
  },
  '7d': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    innovation: [15.2, 16.8, 17.9, 18.5, 19.1, 19.0, 19.4],
    traditional: [45.2, 46.1, 47.3, 48.1, 48.9, 47.8, 48.5]
  },
  '30d': {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    innovation: [67.2, 74.8, 81.3, 87.2],
    traditional: [187.5, 192.3, 198.1, 203.7]
  },
  '90d': {
    labels: ['Month 1', 'Month 2', 'Month 3'],
    innovation: [156.7, 212.3, 267.8],
    traditional: [567.2, 589.6, 612.4]
  }
}

// Competitive Benchmarking Data
export const competitiveBenchmarkData = {
  labels: ['CDW', 'Insight', 'SHI', 'Global SIs'],
  datasets: [
    {
      label: 'Attach Rate %',
      data: [58, 62, 76, 54],
      backgroundColor: '#3B82F6'
    },
    {
      label: 'Recurring Revenue %',
      data: [28, 31, 42, 25],
      backgroundColor: '#10B981'
    },
    {
      label: 'Innovation ROI',
      data: [2.8, 3.1, 4.1, 2.6],
      backgroundColor: '#F59E0B'
    }
  ]
}

// Innovation categories for the dashboard
export const innovationCategories = [
  {
    id: 'pipeline',
    name: 'Innovation Pipeline',
    description: 'Idea funnel health and conversion metrics',
    icon: '🚀',
    metrics: pipelineMetrics
  },
  {
    id: 'revenue',
    name: 'Revenue Impact',
    description: 'Innovation-attributed revenue and EBITDA',
    icon: '💰',
    metrics: revenueMetrics
  },
  {
    id: 'customer',
    name: 'Customer Value',
    description: 'Attach rates, deal sizes, and satisfaction',
    icon: '🤝',
    metrics: customerMetrics
  },
  {
    id: 'partner',
    name: 'Partner Ecosystem',
    description: 'ISV partnerships and co-innovation',
    icon: '🤝',
    metrics: partnerMetrics
  },
  {
    id: 'operational',
    name: 'Execution Efficiency',
    description: 'ROI, training, and time metrics',
    icon: '⚡',
    metrics: operationalMetrics
  },
  {
    id: 'strategic',
    name: 'Strategic Foresight',
    description: 'Emerging tech readiness and differentiation',
    icon: '🎯',
    metrics: strategicMetrics
  },
  {
    id: 'culture',
    name: 'Culture & Talent',
    description: 'Employee engagement and skill development',
    icon: '👥',
    metrics: cultureMetrics
  }
]

// All metrics combined for easy access
export const allInnovationMetrics = {
  pipeline: pipelineMetrics,
  revenue: revenueMetrics,
  customer: customerMetrics,
  partner: partnerMetrics,
  operational: operationalMetrics,
  strategic: strategicMetrics,
  culture: cultureMetrics
}

export const allChartData = {
  pipelineFunnel: pipelineFunnelData,
  portfolioMix: portfolioMixData,
  revenueTrend: revenueTrendData,
  competitive: competitiveBenchmarkData
}