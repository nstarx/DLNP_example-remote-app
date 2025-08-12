import { ref, computed } from 'vue'
import { portfolioCompanies, fundMetrics, riskFactors } from '@/data/vcMockData'

export function usePortfolio() {
  const companies = ref([...portfolioCompanies])
  const metrics = ref({ ...fundMetrics })
  const risks = ref([...riskFactors])
  const loading = ref(false)
  const error = ref(null)

  // Computed portfolio analytics
  const portfolioHealth = computed(() => {
    const total = companies.value.length
    const healthy = companies.value.filter(c => c.healthStatus === 'healthy').length
    const warning = companies.value.filter(c => c.healthStatus === 'warning').length
    const critical = companies.value.filter(c => c.healthStatus === 'critical').length
    
    return {
      total,
      healthy: { count: healthy, percentage: (healthy / total * 100).toFixed(1) },
      warning: { count: warning, percentage: (warning / total * 100).toFixed(1) },
      critical: { count: critical, percentage: (critical / total * 100).toFixed(1) }
    }
  })

  const topPerformers = computed(() => {
    return companies.value
      .filter(c => c.healthStatus === 'healthy')
      .sort((a, b) => b.financials.arrGrowth - a.financials.arrGrowth)
      .slice(0, 3)
  })

  const atRiskCompanies = computed(() => {
    return companies.value.filter(c => 
      c.healthStatus === 'critical' || 
      c.financials.cashRunway < 12 ||
      c.risks.managementTurnover
    )
  })

  const sectorPerformance = computed(() => {
    const sectors = {}
    companies.value.forEach(company => {
      if (!sectors[company.sector]) {
        sectors[company.sector] = {
          name: company.sector,
          companies: [],
          totalInvestment: 0,
          averageGrowth: 0,
          healthScore: 0
        }
      }
      sectors[company.sector].companies.push(company)
      sectors[company.sector].totalInvestment += company.lastValuation * (company.ownershipPercent / 100)
    })

    return Object.values(sectors).map(sector => {
      const avgGrowth = sector.companies.reduce((sum, c) => sum + c.financials.arrGrowth, 0) / sector.companies.length
      const healthyCount = sector.companies.filter(c => c.healthStatus === 'healthy').length
      const healthScore = (healthyCount / sector.companies.length) * 100

      return {
        ...sector,
        averageGrowth: avgGrowth.toFixed(1),
        healthScore: healthScore.toFixed(1),
        companiesCount: sector.companies.length
      }
    }).sort((a, b) => b.averageGrowth - a.averageGrowth)
  })

  const keyMetrics = computed(() => [
    {
      label: 'Portfolio Companies',
      value: companies.value.length.toString(),
      change: 0,
      trend: 'neutral',
      description: 'Active investments'
    },
    {
      label: 'Total Portfolio Value',
      value: `$${(metrics.value.portfolioValue / 1000000).toFixed(0)}M`,
      change: 12.5,
      trend: 'up',
      description: 'Current portfolio valuation'
    },
    {
      label: 'Unrealized Multiple',
      value: `${metrics.value.unrealizedMultiple.toFixed(2)}x`,
      change: 8.3,
      trend: 'up',
      description: 'Unrealized return multiple'
    },
    {
      label: 'Fund IRR',
      value: `${metrics.value.irr.toFixed(1)}%`,
      change: 2.1,
      trend: 'up',
      description: 'Internal rate of return'
    },
    {
      label: 'Healthy Companies',
      value: `${portfolioHealth.value.healthy.percentage}%`,
      change: portfolioHealth.value.healthy.count - portfolioHealth.value.warning.count - portfolioHealth.value.critical.count,
      trend: portfolioHealth.value.healthy.count > (portfolioHealth.value.warning.count + portfolioHealth.value.critical.count) ? 'up' : 'down',
      description: 'Companies with healthy metrics'
    },
    {
      label: 'Avg Cash Runway',
      value: `${Math.round(companies.value.reduce((sum, c) => sum + c.financials.cashRunway, 0) / companies.value.length)} mo`,
      change: -1.5,
      trend: 'down',
      description: 'Average months of runway'
    }
  ])

  // Portfolio actions
  async function refreshPortfolioData() {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // In a real app, this would fetch from an API
      companies.value = [...portfolioCompanies]
      metrics.value = { ...fundMetrics }
      risks.value = [...riskFactors]
    } catch (err) {
      error.value = err.message || 'Failed to refresh portfolio data'
    } finally {
      loading.value = false
    }
  }

  function getCompanyById(id) {
    return companies.value.find(c => c.id === id)
  }

  function filterCompaniesByHealth(status) {
    return companies.value.filter(c => c.healthStatus === status)
  }

  function filterCompaniesBySector(sector) {
    return companies.value.filter(c => c.sector === sector)
  }

  function getCompanyMetrics(companyId) {
    const company = getCompanyById(companyId)
    if (!company) return null

    return {
      financial: [
        { label: 'ARR', value: `$${(company.financials.arr / 1000000).toFixed(1)}M`, change: company.financials.arrGrowth, trend: 'up' },
        { label: 'Gross Margin', value: `${company.financials.grossMargin}%`, change: 2.1, trend: 'up' },
        { label: 'Burn Rate', value: `$${(company.financials.burnRate / 1000).toFixed(0)}K`, change: -5.2, trend: 'down' },
        { label: 'Cash Runway', value: `${company.financials.cashRunway} mo`, change: -2.0, trend: 'down' }
      ],
      operational: [
        { label: 'Customers', value: company.operations.customers.toString(), change: company.operations.customerGrowth, trend: 'up' },
        { label: 'Churn Rate', value: `${company.operations.churnRate}%`, change: -0.3, trend: 'down' },
        { label: 'NPS', value: company.operations.nps.toString(), change: 3.2, trend: 'up' },
        { label: 'LTV/CAC', value: `${company.operations.ltvCacRatio.toFixed(1)}x`, change: 1.8, trend: 'up' }
      ]
    }
  }

  return {
    // State
    companies,
    metrics,
    risks,
    loading,
    error,
    
    // Computed
    portfolioHealth,
    topPerformers,
    atRiskCompanies,
    sectorPerformance,
    keyMetrics,
    
    // Actions
    refreshPortfolioData,
    getCompanyById,
    filterCompaniesByHealth,
    filterCompaniesBySector,
    getCompanyMetrics
  }
}