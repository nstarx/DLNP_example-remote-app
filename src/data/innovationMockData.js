// Mock data for SHI International Innovation Dashboard
export const mockInnovationData = {
  // Key Performance Indicators (Top-level KPIs)
  keyKPIs: {
    '7d': [
      {
        label: 'Total Innovation ROI',
        value: '324%',
        trend: { direction: 'up', percentage: 12 },
        icon: '💰',
        color: 'emerald'
      },
      {
        label: 'Active Innovation Initiatives',
        value: '47',
        trend: { direction: 'up', percentage: 8 },
        icon: '🚀',
        color: 'blue'
      },
      {
        label: 'Innovation Revenue Attribution',
        value: '$8.2M',
        trend: { direction: 'up', percentage: 15 },
        icon: '📈',
        color: 'purple'
      },
      {
        label: 'Time to Market Average',
        value: '3.2mo',
        trend: { direction: 'down', percentage: 18 },
        icon: '⚡',
        color: 'orange'
      }
    ],
    '30d': [
      {
        label: 'Total Innovation ROI',
        value: '342%',
        trend: { direction: 'up', percentage: 15 },
        icon: '💰',
        color: 'emerald'
      },
      {
        label: 'Active Innovation Initiatives',
        value: '52',
        trend: { direction: 'up', percentage: 12 },
        icon: '🚀',
        color: 'blue'
      },
      {
        label: 'Innovation Revenue Attribution',
        value: '$12.7M',
        trend: { direction: 'up', percentage: 22 },
        icon: '📈',
        color: 'purple'
      },
      {
        label: 'Time to Market Average',
        value: '2.8mo',
        trend: { direction: 'down', percentage: 24 },
        icon: '⚡',
        color: 'orange'
      }
    ],
    '90d': [
      {
        label: 'Total Innovation ROI',
        value: '387%',
        trend: { direction: 'up', percentage: 28 },
        icon: '💰',
        color: 'emerald'
      },
      {
        label: 'Active Innovation Initiatives',
        value: '61',
        trend: { direction: 'up', percentage: 18 },
        icon: '🚀',
        color: 'blue'
      },
      {
        label: 'Innovation Revenue Attribution',
        value: '$24.3M',
        trend: { direction: 'up', percentage: 35 },
        icon: '📈',
        color: 'purple'
      },
      {
        label: 'Time to Market Average',
        value: '2.4mo',
        trend: { direction: 'down', percentage: 32 },
        icon: '⚡',
        color: 'orange'
      }
    ]
  },

  // Innovation Pipeline & Portfolio Metrics
  pipelineMetrics: {
    '30d': [
      {
        label: 'New Ideas Sourced',
        value: '143',
        trend: { direction: 'up', percentage: 18 },
        description: 'Internal + Partner + Customer driven',
        category: 'funnel'
      },
      {
        label: 'Ideas → Pilots Conversion',
        value: '24%',
        trend: { direction: 'up', percentage: 6 },
        description: 'Conversion rate to pilot stage',
        category: 'funnel'
      },
      {
        label: 'Pilots → Scale Conversion',
        value: '67%',
        trend: { direction: 'up', percentage: 12 },
        description: 'Pilot to deployment success rate',
        category: 'funnel'
      },
      {
        label: 'Average Time to Pilot',
        value: '45 days',
        trend: { direction: 'down', percentage: 8 },
        description: 'From concept to customer pilot',
        category: 'timing'
      },
      {
        label: 'Average Time to Scale',
        value: '4.2 months',
        trend: { direction: 'down', percentage: 15 },
        description: 'From pilot to commercial deployment',
        category: 'timing'
      },
      {
        label: 'Core Innovation %',
        value: '45%',
        trend: { direction: 'stable', percentage: 0 },
        description: 'Incremental innovation initiatives',
        category: 'portfolio'
      },
      {
        label: 'Adjacent Innovation %',
        value: '38%',
        trend: { direction: 'up', percentage: 5 },
        description: 'Expansion into new areas',
        category: 'portfolio'
      },
      {
        label: 'Transformational %',
        value: '17%',
        trend: { direction: 'up', percentage: 3 },
        description: 'New business models',
        category: 'portfolio'
      }
    ]
  },

  // Revenue & EBITDA Impact
  revenueMetrics: {
    '30d': [
      {
        label: 'Innovation-Attributed Revenue',
        value: '$12.7M',
        trend: { direction: 'up', percentage: 22 },
        description: 'Revenue from new products/solutions (12-24mo)',
        target: '$15M'
      },
      {
        label: 'Incremental EBITDA',
        value: '$3.8M',
        trend: { direction: 'up', percentage: 28 },
        description: 'Gross margin improvements from bundling',
        target: '$5M'
      },
      {
        label: 'Recurring Revenue %',
        value: '34%',
        trend: { direction: 'up', percentage: 9 },
        description: 'Subscription/software vs one-time hardware',
        target: '40%'
      },
      {
        label: 'Cost-to-Sell Improvement',
        value: '18%',
        trend: { direction: 'up', percentage: 5 },
        description: 'Due to automation and SaaS add-ons',
        target: '25%'
      },
      {
        label: 'Average Deal Size Uplift',
        value: '47%',
        trend: { direction: 'up', percentage: 8 },
        description: 'With innovation-driven bundles',
        target: '50%'
      }
    ]
  },

  // Customer Value & Differentiation
  customerMetrics: {
    '30d': [
      {
        label: 'Software/Services Attach Rate',
        value: '76%',
        trend: { direction: 'up', percentage: 12 },
        description: 'Software/services sold with hardware',
        target: '80%'
      },
      {
        label: 'Cross-Sell Success Rate',
        value: '42%',
        trend: { direction: 'up', percentage: 7 },
        description: 'Cross-sell/upsell effectiveness',
        target: '50%'
      },
      {
        label: 'Customer Retention Rate',
        value: '89%',
        trend: { direction: 'up', percentage: 3 },
        description: 'Renewal rates for software/managed services',
        target: '92%'
      },
      {
        label: 'Innovation NPS Score',
        value: '72',
        trend: { direction: 'up', percentage: 8 },
        description: 'NPS for innovative offerings',
        comparison: 'vs Legacy: 54'
      },
      {
        label: 'Co-innovation Engagements',
        value: '23',
        trend: { direction: 'up', percentage: 15 },
        description: 'Customer co-innovation labs/POCs',
        target: '30'
      },
      {
        label: 'Customer Expansion Rate',
        value: '127%',
        trend: { direction: 'up', percentage: 5 },
        description: 'Account expansion through innovation',
        target: '130%'
      }
    ]
  },

  // Partner & Ecosystem Leverage
  partnerMetrics: {
    '30d': [
      {
        label: 'New Partner Onboarding',
        value: '8',
        trend: { direction: 'up', percentage: 14 },
        description: 'New ISV/SaaS/AI partnerships this month',
        category: 'ecosystem'
      },
      {
        label: 'Partner Revenue Influence',
        value: '31%',
        trend: { direction: 'up', percentage: 6 },
        description: 'Sales influenced by partner solutions',
        category: 'revenue'
      },
      {
        label: 'Marketplace Growth',
        value: '89%',
        trend: { direction: 'up', percentage: 23 },
        description: 'Adoption via channels/marketplaces YoY',
        category: 'channels'
      },
      {
        label: 'Joint GTM Programs',
        value: '15',
        trend: { direction: 'up', percentage: 25 },
        description: 'Active go-to-market collaborations',
        category: 'collaboration'
      }
    ]
  },

  // Operational & Execution Efficiency
  operationalMetrics: {
    '30d': [
      {
        label: 'Innovation ROI per $ Invested',
        value: '3.42x',
        trend: { direction: 'up', percentage: 15 },
        description: 'EBITDA uplift to R&D/innovation spend ratio',
        key: 'innovation_roi'
      },
      {
        label: 'Sales Training Completion',
        value: '87%',
        trend: { direction: 'up', percentage: 12 },
        description: 'Innovation-focused trainings completed',
        target: '95%'
      },
      {
        label: 'Solution Playbooks Created',
        value: '24',
        trend: { direction: 'up', percentage: 20 },
        description: 'New solution playbooks this quarter',
        target: '30'
      },
      {
        label: 'Internal AI Adoption',
        value: '68%',
        trend: { direction: 'up', percentage: 28 },
        description: 'AI/automation in pre-sales, config, logistics',
        target: '80%'
      },
      {
        label: 'Process Automation Rate',
        value: '54%',
        trend: { direction: 'up', percentage: 18 },
        description: 'Automated processes in customer support',
        target: '70%'
      }
    ]
  },

  // Strategic Foresight & Differentiation
  strategicMetrics: {
    '30d': [
      {
        label: 'Emerging Tech Alignment',
        value: '73%',
        trend: { direction: 'up', percentage: 8 },
        description: 'Portfolio aligned with AI, multi-cloud, edge, cybersec',
        target: '80%'
      },
      {
        label: 'Competitive Pricing Advantage',
        value: '12%',
        trend: { direction: 'up', percentage: 3 },
        description: 'Price advantage vs CDW, Insight on bundled solutions',
        benchmark: 'vs Competition'
      },
      {
        label: 'Market Share Growth',
        value: '2.3%',
        trend: { direction: 'up', percentage: 18 },
        description: 'Growth in healthcare, finance, media verticals',
        target: '3%'
      },
      {
        label: 'Innovation Patent Portfolio',
        value: '17',
        trend: { direction: 'up', percentage: 21 },
        description: 'Active patents and IP applications',
        target: '25'
      },
      {
        label: 'Sustainability Innovation Score',
        value: '68',
        trend: { direction: 'up', percentage: 15 },
        description: 'Green tech and sustainable solution initiatives',
        target: '75'
      }
    ]
  },

  // Culture & Talent for Innovation
  cultureMetrics: {
    '30d': [
      {
        label: 'Ideas per Employee',
        value: '2.4',
        trend: { direction: 'up', percentage: 12 },
        description: 'Average ideas submitted per employee annually',
        target: '3.0'
      },
      {
        label: 'Innovation Lab Participation',
        value: '34%',
        trend: { direction: 'up', percentage: 18 },
        description: 'Employee participation in hackathons/labs',
        target: '50%'
      },
      {
        label: 'AI/Cloud Skills Readiness',
        value: '71%',
        trend: { direction: 'up', percentage: 22 },
        description: 'Sales/engineering trained on AI-native, cloud solutions',
        target: '85%'
      },
      {
        label: 'Innovation Team Retention',
        value: '94%',
        trend: { direction: 'up', percentage: 2 },
        description: 'Retention rate in innovation-critical teams',
        target: '95%'
      },
      {
        label: 'Internal Innovation Awards',
        value: '28',
        trend: { direction: 'up', percentage: 16 },
        description: 'Recognition awards for innovative contributions',
        target: '35'
      }
    ]
  },

  // Chart Data for Visualizations
  chartData: {
    '30d': {
      // Innovation Funnel
      funnel: {
        stages: ['Ideas', 'Concepts', 'Pilots', 'Deployments'],
        values: [143, 86, 34, 23],
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
      },

      // Portfolio Mix
      portfolioMix: {
        labels: ['Core (45%)', 'Adjacent (38%)', 'Transformational (17%)'],
        values: [45, 38, 17],
        colors: ['#3b82f6', '#10b981', '#f59e0b']
      },

      // Revenue Chart (Innovation-Attributed Revenue Trend)
      revenueChart: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        values: [8.2, 9.1, 10.3, 11.2, 11.8, 12.7],
        color: '#10b981'
      },

      // Recurring vs One-time Revenue
      recurringRevenue: {
        labels: ['Recurring', 'One-time'],
        values: [34, 66],
        colors: ['#10b981', '#94a3b8']
      },

      // Attach Rate Trend
      attachRate: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        values: [68, 71, 73, 75, 74, 76],
        color: '#3b82f6'
      },

      // NPS Comparison
      npsComparison: {
        labels: ['Innovation Offerings', 'Legacy Offerings'],
        values: [72, 54],
        colors: ['#10b981', '#94a3b8']
      },

      // ROI Trend
      roiTrend: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        values: [2.8, 3.1, 3.3, 3.42],
        color: '#f59e0b'
      },

      // Employee Engagement
      engagement: {
        labels: ['Ideas Submitted', 'Lab Participation', 'Training Completion'],
        values: [87, 34, 87],
        colors: ['#3b82f6', '#10b981', '#f59e0b']
      }
    }
  }
}

// Helper function to generate time-series data
export function generateTimeSeriesData(baseValue, months = 6, volatility = 0.1) {
  const data = []
  let current = baseValue
  
  for (let i = 0; i < months; i++) {
    const change = (Math.random() - 0.5) * volatility * current
    current += change
    data.push(Math.round(current * 100) / 100)
  }
  
  return data
}

// Helper function to calculate period-over-period changes
export function calculateTrend(current, previous) {
  if (!previous || previous === 0) return { direction: 'stable', percentage: 0 }
  
  const change = ((current - previous) / previous) * 100
  const direction = change > 2 ? 'up' : change < -2 ? 'down' : 'stable'
  
  return {
    direction,
    percentage: Math.round(Math.abs(change))
  }
}