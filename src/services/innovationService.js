import { mockInnovationData } from '@/data/innovationMockData'

export class InnovationService {
  async getKeyKPIs(period) {
    await this.simulateDelay()
    return mockInnovationData.keyKPIs[period] || mockInnovationData.keyKPIs['30d']
  }

  async getPipelineMetrics(period) {
    await this.simulateDelay()
    return mockInnovationData.pipelineMetrics[period] || mockInnovationData.pipelineMetrics['30d']
  }

  async getRevenueMetrics(period) {
    await this.simulateDelay()
    return mockInnovationData.revenueMetrics[period] || mockInnovationData.revenueMetrics['30d']
  }

  async getCustomerMetrics(period) {
    await this.simulateDelay()
    return mockInnovationData.customerMetrics[period] || mockInnovationData.customerMetrics['30d']
  }

  async getPartnerMetrics(period) {
    await this.simulateDelay()
    return mockInnovationData.partnerMetrics[period] || mockInnovationData.partnerMetrics['30d']
  }

  async getOperationalMetrics(period) {
    await this.simulateDelay()
    return mockInnovationData.operationalMetrics[period] || mockInnovationData.operationalMetrics['30d']
  }

  async getStrategicMetrics(period) {
    await this.simulateDelay()
    return mockInnovationData.strategicMetrics[period] || mockInnovationData.strategicMetrics['30d']
  }

  async getCultureMetrics(period) {
    await this.simulateDelay()
    return mockInnovationData.cultureMetrics[period] || mockInnovationData.cultureMetrics['30d']
  }

  async getChartData(period) {
    await this.simulateDelay()
    return mockInnovationData.chartData[period] || mockInnovationData.chartData['30d']
  }

  // Utility methods
  async simulateDelay(min = 200, max = 800) {
    const delay = Math.random() * (max - min) + min
    return new Promise(resolve => setTimeout(resolve, delay))
  }

  // Real-world integration methods (for future implementation)
  async getDataFromAPI(endpoint, period) {
    // This would be implemented when integrating with actual SHI systems
    try {
      const response = await fetch(`/api/innovation/${endpoint}?period=${period}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint} data`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error)
      throw error
    }
  }

  // Data validation and transformation methods
  validateMetricData(data, requiredFields = ['label', 'value', 'trend']) {
    if (!Array.isArray(data)) return false
    return data.every(item => 
      requiredFields.every(field => item.hasOwnProperty(field))
    )
  }

  transformChartData(rawData, chartType) {
    switch (chartType) {
      case 'funnel':
        return {
          stages: rawData.stages || [],
          values: rawData.values || [],
          colors: rawData.colors || ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
        }
      case 'donut':
        return {
          labels: rawData.labels || [],
          values: rawData.values || [],
          colors: rawData.colors || ['#3b82f6', '#10b981', '#f59e0b']
        }
      case 'line':
        return {
          labels: rawData.labels || [],
          values: rawData.values || [],
          color: rawData.color || '#3b82f6'
        }
      case 'bar':
        return {
          labels: rawData.labels || [],
          values: rawData.values || [],
          colors: rawData.colors || ['#3b82f6', '#10b981']
        }
      default:
        return rawData
    }
  }
}

export const innovationService = new InnovationService()