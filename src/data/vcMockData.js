// VC-specific mock data for portfolio monitoring and investment thesis validation

export const portfolioCompanies = [
  {
    id: 'co-1',
    name: 'DataFlow Analytics',
    sector: 'Enterprise SaaS',
    stage: 'Series B',
    investmentDate: '2022-03-15',
    lastValuation: 45000000,
    ownershipPercent: 12.5,
    geography: 'US',
    logo: '📊',
    healthStatus: 'healthy', // healthy, warning, critical
    
    // Financial metrics
    financials: {
      arr: 8500000,
      arrGrowth: 145, // %
      grossMargin: 82,
      burnRate: 450000, // monthly
      cashRunway: 18, // months
      revenue: 8500000,
      revenueGrowth: 145
    },
    
    // Operational metrics
    operations: {
      customers: 245,
      customerGrowth: 38,
      churnRate: 2.1,
      nps: 67,
      cac: 8500,
      ltv: 125000,
      ltvCacRatio: 14.7
    },
    
    // Strategic indicators
    strategic: {
      patentsField: 3,
      partnerships: 8,
      regulatoryApprovals: 2,
      marketShare: 4.2
    },
    
    // Risk indicators
    risks: {
      managementTurnover: false,
      missedTargets: 1,
      downRound: false,
      competitorThreat: 'low'
    },
    
    funding: [
      { round: 'Seed', amount: 2500000, date: '2021-01-15', leadInvestor: 'Accel Partners' },
      { round: 'Series A', amount: 12000000, date: '2021-09-22', leadInvestor: 'Sequoia Capital' },
      { round: 'Series B', amount: 35000000, date: '2022-03-15', leadInvestor: 'Andreessen Horowitz' }
    ]
  },
  {
    id: 'co-2',
    name: 'HealthTech Solutions',
    sector: 'HealthTech',
    stage: 'Series A',
    investmentDate: '2023-01-10',
    lastValuation: 25000000,
    ownershipPercent: 15.8,
    geography: 'EU',
    logo: '🏥',
    healthStatus: 'warning',
    
    financials: {
      arr: 3200000,
      arrGrowth: 89,
      grossMargin: 68,
      burnRate: 280000,
      cashRunway: 14,
      revenue: 3200000,
      revenueGrowth: 89
    },
    
    operations: {
      customers: 145,
      customerGrowth: 52,
      churnRate: 4.2,
      nps: 58,
      cac: 12000,
      ltv: 85000,
      ltvCacRatio: 7.1
    },
    
    strategic: {
      patentsField: 12,
      partnerships: 15,
      regulatoryApprovals: 8,
      marketShare: 2.8
    },
    
    risks: {
      managementTurnover: true,
      missedTargets: 2,
      downRound: false,
      competitorThreat: 'medium'
    },
    
    funding: [
      { round: 'Seed', amount: 1800000, date: '2022-03-01', leadInvestor: 'First Round Capital' },
      { round: 'Series A', amount: 15000000, date: '2023-01-10', leadInvestor: 'GV (Google Ventures)' }
    ]
  },
  {
    id: 'co-3',
    name: 'FinanceAI',
    sector: 'FinTech',
    stage: 'Series C',
    investmentDate: '2021-06-08',
    lastValuation: 180000000,
    ownershipPercent: 8.3,
    geography: 'US',
    logo: '💰',
    healthStatus: 'healthy',
    
    financials: {
      arr: 28000000,
      arrGrowth: 78,
      grossMargin: 75,
      burnRate: 1200000,
      cashRunway: 24,
      revenue: 28000000,
      revenueGrowth: 78
    },
    
    operations: {
      customers: 850,
      customerGrowth: 42,
      churnRate: 1.8,
      nps: 72,
      cac: 15000,
      ltv: 280000,
      ltvCacRatio: 18.7
    },
    
    strategic: {
      patentsField: 8,
      partnerships: 25,
      regulatoryApprovals: 12,
      marketShare: 6.8
    },
    
    risks: {
      managementTurnover: false,
      missedTargets: 0,
      downRound: false,
      competitorThreat: 'low'
    },
    
    funding: [
      { round: 'Seed', amount: 3200000, date: '2020-02-14', leadInvestor: 'Y Combinator' },
      { round: 'Series A', amount: 18000000, date: '2020-11-03', leadInvestor: 'Benchmark Capital' },
      { round: 'Series B', amount: 45000000, date: '2021-06-08', leadInvestor: 'Tiger Global' },
      { round: 'Series C', amount: 85000000, date: '2022-09-22', leadInvestor: 'Coatue Management' }
    ]
  },
  {
    id: 'co-4',
    name: 'GreenEnergy Tech',
    sector: 'CleanTech',
    stage: 'Series A',
    investmentDate: '2023-05-18',
    lastValuation: 32000000,
    ownershipPercent: 18.2,
    geography: 'EU',
    logo: '🌱',
    healthStatus: 'critical',
    
    financials: {
      arr: 1800000,
      arrGrowth: 156,
      grossMargin: 45,
      burnRate: 320000,
      cashRunway: 8,
      revenue: 1800000,
      revenueGrowth: 156
    },
    
    operations: {
      customers: 68,
      customerGrowth: 89,
      churnRate: 8.5,
      nps: 45,
      cac: 25000,
      ltv: 180000,
      ltvCacRatio: 7.2
    },
    
    strategic: {
      patentsField: 18,
      partnerships: 12,
      regulatoryApprovals: 15,
      marketShare: 1.2
    },
    
    risks: {
      managementTurnover: true,
      missedTargets: 3,
      downRound: false,
      competitorThreat: 'high'
    },
    
    funding: [
      { round: 'Seed', amount: 4500000, date: '2022-08-15', leadInvestor: 'Climate Capital' },
      { round: 'Series A', amount: 22000000, date: '2023-05-18', leadInvestor: 'Energy Impact Partners' }
    ]
  },
  {
    id: 'co-5',
    name: 'RoboLogistics',
    sector: 'Logistics Tech',
    stage: 'Series B',
    investmentDate: '2022-11-30',
    lastValuation: 95000000,
    ownershipPercent: 11.5,
    geography: 'Asia',
    logo: '🤖',
    healthStatus: 'healthy',
    
    financials: {
      arr: 15000000,
      arrGrowth: 198,
      grossMargin: 72,
      burnRate: 680000,
      cashRunway: 22,
      revenue: 15000000,
      revenueGrowth: 198
    },
    
    operations: {
      customers: 320,
      customerGrowth: 65,
      churnRate: 3.2,
      nps: 61,
      cac: 18000,
      ltv: 195000,
      ltvCacRatio: 10.8
    },
    
    strategic: {
      patentsField: 15,
      partnerships: 18,
      regulatoryApprovals: 6,
      marketShare: 3.5
    },
    
    risks: {
      managementTurnover: false,
      missedTargets: 1,
      downRound: false,
      competitorThreat: 'medium'
    },
    
    funding: [
      { round: 'Seed', amount: 2800000, date: '2021-04-12', leadInvestor: 'SoftBank Ventures Asia' },
      { round: 'Series A', amount: 16000000, date: '2021-12-08', leadInvestor: 'Lightspeed Venture Partners' },
      { round: 'Series B', amount: 42000000, date: '2022-11-30', leadInvestor: 'Insight Partners' }
    ]
  }
]

// Investment thesis data and validation metrics
export const investmentThesis = {
  name: 'Digital Transformation in B2B SaaS',
  description: 'Enterprise software transformation driven by cloud adoption and AI integration',
  
  // Core thesis assumptions
  assumptions: {
    marketSize: {
      current: 280000000000, // $280B
      projected2025: 450000000000, // $450B
      cagr: 12.8
    },
    adoptionRate: {
      current: 45, // 45% of enterprises
      projected2025: 75, // 75% of enterprises
      accelerationFactor: 1.8
    },
    averageTicketSize: {
      current: 125000,
      projected2025: 185000,
      growth: 48
    }
  },
  
  // Market validation data
  validation: {
    exitMultiples: {
      current: 8.5,
      historical: [6.2, 7.1, 8.5, 9.2, 8.8],
      trend: 'stable'
    },
    competitorFunding: {
      q1: 2400000000,
      q2: 2800000000,
      q3: 3100000000,
      q4: 2900000000,
      growth: 18.2
    },
    ipoActivity: {
      count: 12,
      avgValuation: 1800000000,
      successRate: 75
    }
  },
  
  // Portfolio exposure by thesis
  portfolioExposure: {
    totalInvestment: 156000000,
    companiesCount: 8,
    sectors: {
      'Enterprise SaaS': { investment: 65000000, companies: 3 },
      'FinTech': { investment: 48000000, companies: 2 },
      'HealthTech': { investment: 28000000, companies: 2 },
      'AI/ML Platform': { investment: 15000000, companies: 1 }
    },
    geography: {
      'US': { investment: 98000000, companies: 5 },
      'EU': { investment: 38000000, companies: 2 },
      'Asia': { investment: 20000000, companies: 1 }
    }
  }
}

// Fund-level metrics
export const fundMetrics = {
  totalAUM: 500000000, // $500M fund
  totalInvested: 320000000,
  totalCommitted: 450000000,
  dryPowder: 180000000,
  portfolioValue: 580000000,
  unrealizedMultiple: 1.81,
  realizedMultiple: 2.34,
  totalMultiple: 1.94,
  irr: 24.5,
  vintageYear: 2021,
  
  // Portfolio breakdown
  stageAllocation: {
    'Seed': { amount: 45000000, percentage: 14.1 },
    'Series A': { amount: 128000000, percentage: 40.0 },
    'Series B': { amount: 98000000, percentage: 30.6 },
    'Series C+': { amount: 49000000, percentage: 15.3 }
  },
  
  sectorAllocation: {
    'Enterprise SaaS': { amount: 125000000, percentage: 39.1 },
    'FinTech': { amount: 85000000, percentage: 26.6 },
    'HealthTech': { amount: 55000000, percentage: 17.2 },
    'CleanTech': { amount: 35000000, percentage: 10.9 },
    'Other': { amount: 20000000, percentage: 6.3 }
  },
  
  geographyAllocation: {
    'North America': { amount: 210000000, percentage: 65.6 },
    'Europe': { amount: 75000000, percentage: 23.4 },
    'Asia Pacific': { amount: 35000000, percentage: 10.9 }
  }
}

// Market intelligence and competitive data
export const marketIntelligence = {
  sectors: {
    'Enterprise SaaS': {
      marketSize: 145000000000,
      growth: 12.5,
      competitorFunding: 8500000000,
      exitMultiples: [8.2, 9.1, 7.8, 10.2, 8.9],
      trendDirection: 'up'
    },
    'FinTech': {
      marketSize: 95000000000,
      growth: 15.8,
      competitorFunding: 6200000000,
      exitMultiples: [6.5, 7.2, 8.8, 7.9, 9.2],
      trendDirection: 'up'
    },
    'HealthTech': {
      marketSize: 68000000000,
      growth: 18.2,
      competitorFunding: 4800000000,
      exitMultiples: [9.5, 8.2, 11.1, 7.8, 9.8],
      trendDirection: 'up'
    },
    'CleanTech': {
      marketSize: 42000000000,
      growth: 22.5,
      competitorFunding: 3200000000,
      exitMultiples: [5.2, 6.8, 4.9, 7.2, 6.1],
      trendDirection: 'volatile'
    }
  },
  
  // Macro trends
  trends: {
    aiAdoption: { current: 34, target: 78, timeline: '24 months' },
    cloudMigration: { current: 68, target: 89, timeline: '18 months' },
    remoteWork: { current: 42, target: 65, timeline: '12 months' },
    dataPrivacy: { current: 52, target: 85, timeline: '36 months' }
  }
}

// Risk factors and alerts
export const riskFactors = [
  {
    id: 'risk-1',
    type: 'market',
    severity: 'high',
    title: 'Interest Rate Impact',
    description: 'Rising interest rates affecting growth company valuations',
    affectedCompanies: ['co-2', 'co-4'],
    mitigation: 'Focus on profitability metrics and cash flow positive companies'
  },
  {
    id: 'risk-2',
    type: 'company',
    severity: 'medium',
    title: 'Management Transition',
    description: 'Key management changes at HealthTech Solutions',
    affectedCompanies: ['co-2'],
    mitigation: 'Increased board involvement and executive search support'
  },
  {
    id: 'risk-3',
    type: 'competitive',
    severity: 'medium',
    title: 'Big Tech Competition',
    description: 'Google and Microsoft launching competing products',
    affectedCompanies: ['co-1', 'co-3'],
    mitigation: 'Focus on specialized use cases and customer switching costs'
  }
]