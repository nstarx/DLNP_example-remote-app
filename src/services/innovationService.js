import { 
  allInnovationMetrics, 
  allChartData, 
  innovationCategories,
  pipelineFunnelData,
  portfolioMixData,
  revenueTrendData,
  competitiveBenchmarkData 
} from '@/data/innovationData'

export class InnovationService {
  async getMetricsByCategory(category, period) {
    await this.simulateDelay()
    return allInnovationMetrics[category]?.[period] || []
  }

  async getAllMetrics(period) {
    await this.simulateDelay()
    const metrics = []
    
    // Get top 2 metrics from each category for overview
    for (const category of innovationCategories) {
      const categoryMetrics = category.metrics[period] || []
      metrics.push(...categoryMetrics.slice(0, 2))
    }
    
    return metrics
  }

  async getChartData(chartType, period) {
    await this.simulateDelay()
    
    switch (chartType) {
      case 'pipelineFunnel':
        return pipelineFunnelData[period] || { labels: [], data: [], colors: [] }
      case 'portfolioMix':
        return portfolioMixData[period] || { labels: [], data: [], colors: [] }
      case 'revenueTrend':
        return revenueTrendData[period] || { labels: [], innovation: [], traditional: [] }
      case 'competitive':
        return competitiveBenchmarkData
      default:
        return null
    }
  }

  async getCategories() {
    await this.simulateDelay()
    return innovationCategories
  }

  async getCategoryMetrics(categoryId, period) {
    await this.simulateDelay()
    const category = innovationCategories.find(cat => cat.id === categoryId)
    return category?.metrics[period] || []
  }

  async getExecutiveSummary(period) {
    await this.simulateDelay()
    
    // Key executive metrics across all categories
    const executiveMetrics = [
      // Revenue Impact
      { label: 'Innovation Revenue', value: this.getValueByPeriod(period, [2.8, 19.4, 87.2, 267.8]), change: '+32%', trend: 'up', format: 'currency', unit: 'M', category: 'Revenue' },
      { label: 'Innovation ROI', value: this.getValueByPeriod(period, [3.2, 3.4, 3.7, 4.1]), change: '+28%', trend: 'up', format: 'ratio', unit: 'x', category: 'Operational' },
      // Pipeline Health
      { label: 'Active Pilots', value: this.getValueByPeriod(period, [18, 34, 67, 125]), change: '+42%', trend: 'up', format: 'number', category: 'Pipeline' },
      { label: 'Idea → Pilot Rate', value: this.getValueByPeriod(period, [32, 28, 31, 29]), change: '+12%', trend: 'up', format: 'percentage', category: 'Pipeline' },
      // Customer Impact
      { label: 'Software Attach Rate', value: this.getValueByPeriod(period, [67, 69, 72, 76]), change: '+12%', trend: 'up', format: 'percentage', category: 'Customer' },
      { label: 'Customer Retention', value: this.getValueByPeriod(period, [94, 95, 96, 97]), change: '+5%', trend: 'up', format: 'percentage', category: 'Customer' },
      // Strategic Positioning  
      { label: 'Market Share Growth', value: this.getValueByPeriod(period, [12, 18, 24, 32]), change: '+58%', trend: 'up', format: 'percentage', category: 'Strategic' },
      { label: 'Emerging Tech Readiness', value: this.getValueByPeriod(period, [73, 75, 78, 82]), change: '+22%', trend: 'up', format: 'percentage', category: 'Strategic' }
    ]
    
    return executiveMetrics
  }

  getValueByPeriod(period, values) {
    const periodIndex = { '24h': 0, '7d': 1, '30d': 2, '90d': 3 }
    return values[periodIndex[period]] || values[0]
  }

  async simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 300))
  }
}

export const innovationService = new InnovationService()