import { ref, computed } from 'vue'
import { investmentThesis, marketIntelligence, portfolioCompanies, fundMetrics } from '@/data/vcMockData'

export function useThesis() {
  const thesis = ref({ ...investmentThesis })
  const marketData = ref({ ...marketIntelligence })
  const loading = ref(false)
  const error = ref(null)

  // Thesis validation metrics
  const thesisValidation = computed(() => {
    const marketGrowth = thesis.value.assumptions.marketSize
    const actualGrowth = ((marketGrowth.projected2025 - marketGrowth.current) / marketGrowth.current) * 100
    const expectedGrowth = marketGrowth.cagr * 4 // 4 years projection
    
    return {
      marketSizeValidation: {
        expected: expectedGrowth,
        actual: actualGrowth,
        variance: actualGrowth - expectedGrowth,
        status: Math.abs(actualGrowth - expectedGrowth) < 5 ? 'on_track' : 'deviation'
      },
      adoptionValidation: {
        expected: thesis.value.assumptions.adoptionRate.projected2025,
        current: thesis.value.assumptions.adoptionRate.current,
        progress: ((thesis.value.assumptions.adoptionRate.current - 45) / (75 - 45)) * 100,
        status: thesis.value.assumptions.adoptionRate.current > 50 ? 'on_track' : 'behind'
      },
      exitEnvironment: {
        avgMultiple: thesis.value.validation.exitMultiples.current,
        trend: thesis.value.validation.exitMultiples.trend,
        ipoSuccessRate: thesis.value.validation.ipoActivity.successRate,
        status: thesis.value.validation.exitMultiples.current > 7.5 ? 'favorable' : 'challenging'
      }
    }
  })

  // Portfolio alignment with thesis
  const portfolioAlignment = computed(() => {
    const totalInvestment = thesis.value.portfolioExposure.totalInvestment
    const alignedSectors = ['Enterprise SaaS', 'FinTech', 'AI/ML Platform']
    
    let alignedInvestment = 0
    Object.entries(thesis.value.portfolioExposure.sectors).forEach(([sector, data]) => {
      if (alignedSectors.includes(sector)) {
        alignedInvestment += data.investment
      }
    })
    
    const alignmentPercentage = (alignedInvestment / totalInvestment) * 100
    
    return {
      totalInvestment,
      alignedInvestment,
      alignmentPercentage: alignmentPercentage.toFixed(1),
      status: alignmentPercentage > 70 ? 'well_aligned' : 'needs_focus',
      recommendation: alignmentPercentage > 70 ? 
        'Portfolio well-aligned with thesis' : 
        'Consider increasing allocation to thesis-aligned sectors'
    }
  })

  // Competitive landscape analysis
  const competitiveLandscape = computed(() => {
    return Object.entries(marketData.value.sectors).map(([sector, data]) => {
      const portfolioCompany = portfolioCompanies.find(c => c.sector === sector)
      const portfolioExposure = thesis.value.portfolioExposure.sectors[sector]
      
      return {
        sector,
        marketSize: data.marketSize,
        growth: data.growth,
        competitorFunding: data.competitorFunding,
        avgExitMultiple: data.exitMultiples.reduce((a, b) => a + b, 0) / data.exitMultiples.length,
        trend: data.trendDirection,
        portfolioInvestment: portfolioExposure ? portfolioExposure.investment : 0,
        portfolioCompanies: portfolioExposure ? portfolioExposure.companies : 0,
        competitivePosition: portfolioCompany ? 
          (portfolioCompany.strategic.marketShare > 5 ? 'strong' : 'emerging') : 
          'no_exposure'
      }
    }).sort((a, b) => b.growth - a.growth)
  })

  // Market trend analysis
  const trendAnalysis = computed(() => {
    return Object.entries(marketData.value.trends).map(([trend, data]) => {
      const progress = ((data.current - 0) / (data.target - 0)) * 100
      const monthsRemaining = parseInt(data.timeline.split(' ')[0])
      const monthlyProgressNeeded = (data.target - data.current) / monthsRemaining
      
      return {
        name: trend,
        current: data.current,
        target: data.target,
        timeline: data.timeline,
        progress: progress.toFixed(1),
        monthlyProgressNeeded: monthlyProgressNeeded.toFixed(1),
        onTrack: progress > 50,
        impact: trend === 'aiAdoption' || trend === 'cloudMigration' ? 'high' : 'medium'
      }
    })
  })

  // Key thesis metrics for dashboard
  const thesisMetrics = computed(() => [
    {
      label: 'Thesis Alignment',
      value: `${portfolioAlignment.value.alignmentPercentage}%`,
      change: 5.2,
      trend: 'up',
      description: 'Portfolio aligned with investment thesis'
    },
    {
      label: 'Market Size (TAM)',
      value: `$${(thesis.value.assumptions.marketSize.current / 1000000000).toFixed(0)}B`,
      change: thesis.value.assumptions.marketSize.cagr,
      trend: 'up',
      description: 'Total addressable market'
    },
    {
      label: 'Market Growth',
      value: `${thesis.value.assumptions.marketSize.cagr}%`,
      change: 1.2,
      trend: 'up',
      description: 'CAGR of target market'
    },
    {
      label: 'Adoption Rate',
      value: `${thesis.value.assumptions.adoptionRate.current}%`,
      change: 8.5,
      trend: 'up',
      description: 'Current enterprise adoption'
    },
    {
      label: 'Avg Exit Multiple',
      value: `${thesis.value.validation.exitMultiples.current.toFixed(1)}x`,
      change: 0.3,
      trend: 'up',
      description: 'Average exit multiple'
    },
    {
      label: 'IPO Success Rate',
      value: `${thesis.value.validation.ipoActivity.successRate}%`,
      change: -5.0,
      trend: 'down',
      description: 'Successful public offerings'
    }
  ])

  // Scenario modeling
  function runScenarioAnalysis(variables) {
    const baseCase = {
      marketGrowth: thesis.value.assumptions.marketSize.cagr,
      adoptionRate: thesis.value.assumptions.adoptionRate.projected2025,
      exitMultiple: thesis.value.validation.exitMultiples.current
    }

    const scenarios = ['bearish', 'base', 'bullish'].map(scenario => {
      let factor = 1
      switch(scenario) {
        case 'bearish': factor = 0.75; break
        case 'base': factor = 1; break
        case 'bullish': factor = 1.25; break
      }

      const projectedPortfolioValue = fundMetrics.portfolioValue * 
        (baseCase.exitMultiple * factor) * 
        (1 + (baseCase.marketGrowth * factor / 100))

      const projectedMultiple = projectedPortfolioValue / fundMetrics.totalInvested

      return {
        scenario,
        factor,
        marketGrowth: (baseCase.marketGrowth * factor).toFixed(1),
        adoptionRate: Math.min(100, baseCase.adoptionRate * factor).toFixed(0),
        exitMultiple: (baseCase.exitMultiple * factor).toFixed(1),
        projectedPortfolioValue,
        projectedMultiple: projectedMultiple.toFixed(2),
        probability: scenario === 'base' ? 50 : (scenario === 'bullish' ? 30 : 20)
      }
    })

    return scenarios
  }

  // Actions
  async function refreshThesisData() {
    loading.value = true
    error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600))
      
      // In real app, fetch updated market data
      thesis.value = { ...investmentThesis }
      marketData.value = { ...marketIntelligence }
    } catch (err) {
      error.value = err.message || 'Failed to refresh thesis data'
    } finally {
      loading.value = false
    }
  }

  function updateThesisAssumption(key, value) {
    if (thesis.value.assumptions[key]) {
      thesis.value.assumptions[key] = { ...thesis.value.assumptions[key], ...value }
    }
  }

  return {
    // State
    thesis,
    marketData,
    loading,
    error,
    
    // Computed
    thesisValidation,
    portfolioAlignment,
    competitiveLandscape,
    trendAnalysis,
    thesisMetrics,
    
    // Actions
    refreshThesisData,
    updateThesisAssumption,
    runScenarioAnalysis
  }
}