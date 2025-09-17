import { 
  innovationMetrics, 
  innovationChartData, 
  portfolioMixData,
  strategicMetricsData 
} from '@/data/mockData'

export class InnovationService {
  async getMetrics(period) {
    await this.simulateDelay()
    return innovationMetrics[period] || []
  }

  async getChartData(period) {
    await this.simulateDelay()
    return innovationChartData[period] || { 
      labels: [], 
      innovationRevenue: [], 
      ideaFunnel: [], 
      partnershipGrowth: [],
      attachRates: []
    }
  }

  async getPortfolioMix(period) {
    await this.simulateDelay()
    return portfolioMixData[period] || { core: 0, adjacent: 0, transformational: 0 }
  }

  async getStrategicMetrics() {
    await this.simulateDelay()
    return strategicMetricsData
  }

  async simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 500))
  }
}

export const innovationService = new InnovationService()