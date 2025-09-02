<template>
  <div class="executive-dashboard">
    <!-- Financial & Growth Metrics -->
    <DashboardSection 
      title="Financial & Growth Metrics"
      subtitle="High-level financial performance and growth indicators"
      :columns="4"
    >
      <ExecutiveMetricCard
        v-for="metric in financialMetrics"
        :key="metric.label"
        :metric="metric"
      />
    </DashboardSection>

    <!-- Customer & Market Insights -->
    <DashboardSection 
      title="Customer & Market Insights"
      subtitle="Customer retention, satisfaction, and market positioning"
      :columns="3"
    >
      <ExecutiveMetricCard
        v-for="metric in customerMetrics"
        :key="metric.label"
        :metric="metric"
      />
    </DashboardSection>

    <!-- Operational Highlights -->
    <DashboardSection 
      title="Operational Highlights"
      subtitle="Service quality, efficiency, and reliability metrics"
      :columns="4"
    >
      <ExecutiveMetricCard
        v-for="metric in operationalMetrics"
        :key="metric.label"
        :metric="metric"
      />
    </DashboardSection>

    <!-- Strategic Investments -->
    <DashboardSection 
      title="Strategic Investments"
      subtitle="Technology initiatives and sustainability progress"
      :columns="3"
    >
      <ExecutiveMetricCard
        v-for="metric in strategicMetrics"
        :key="metric.label"
        :metric="metric"
      />
    </DashboardSection>

    <!-- Risk & Compliance -->
    <DashboardSection 
      title="Risk & Compliance"
      subtitle="Safety, regulatory compliance, and operational risks"
      :columns="3"
    >
      <ExecutiveMetricCard
        v-for="metric in riskMetrics"
        :key="metric.label"
        :metric="metric"
      />
    </DashboardSection>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DashboardSection from '../dashboard/DashboardSection.vue'
import ExecutiveMetricCard from '../dashboard/ExecutiveMetricCard.vue'

// Financial & Growth Metrics
const financialMetrics = ref([
  {
    label: 'YTD Revenue',
    value: 2850000000,
    format: 'currency',
    trend: 'up',
    change: 8.2,
    period: 'YoY',
    status: 'Good',
    size: 'large'
  },
  {
    label: 'EBITDA Margin',
    value: 18.7,
    format: 'percentage',
    trend: 'up',
    change: 1.4,
    period: 'vs Q3',
    status: 'Good'
  },
  {
    label: 'Cost per Shipment',
    value: 847.50,
    format: 'currency',
    trend: 'down',
    change: 3.2,
    period: 'vs last quarter',
    status: 'Good'
  },
  {
    label: 'Revenue per Customer',
    value: 12450,
    format: 'currency',
    trend: 'up',
    change: 5.7,
    period: 'YoY',
    status: 'Good'
  },
  {
    label: 'Market Share',
    value: 12.3,
    format: 'percentage',
    trend: 'up',
    change: 0.8,
    period: 'vs competitors',
    status: 'Good',
    subtitle: 'vs Old Dominion (15.2%), XPO (11.8%)'
  },
  {
    label: 'Regional Growth',
    value: 15.2,
    format: 'percentage',
    trend: 'up',
    change: 2.1,
    period: 'Southeast',
    status: 'Good'
  }
])

// Customer & Market Insights
const customerMetrics = ref([
  {
    label: 'Top 10 Customer Revenue',
    value: 34.2,
    format: 'percentage',
    trend: 'neutral',
    change: 0.3,
    period: 'of total revenue',
    status: 'Good',
    subtitle: 'Healthy diversification'
  },
  {
    label: 'Customer Retention Rate',
    value: 94.8,
    format: 'percentage',
    trend: 'up',
    change: 1.2,
    period: 'vs last year',
    status: 'Good'
  },
  {
    label: 'Net Promoter Score',
    value: 67,
    format: 'number',
    trend: 'up',
    change: 4.0,
    period: 'vs Q3',
    status: 'Good',
    subtitle: 'Industry average: 52'
  },
  {
    label: 'New Enterprise Contracts',
    value: 23,
    format: 'number',
    trend: 'up',
    change: 15.0,
    period: 'this quarter',
    status: 'Good'
  },
  {
    label: 'Contract Rate Premium',
    value: 8.3,
    format: 'percentage',
    trend: 'up',
    change: 0.7,
    period: 'vs spot rates',
    status: 'Good'
  },
  {
    label: 'Customer Churn Rate',
    value: 2.1,
    format: 'percentage',
    trend: 'down',
    change: 0.4,
    period: 'quarterly',
    status: 'Good'
  }
])

// Operational Highlights
const operationalMetrics = ref([
  {
    label: 'On-Time Pickup Rate',
    value: 96.2,
    format: 'percentage',
    trend: 'up',
    change: 0.8,
    period: 'vs Q3',
    status: 'Good'
  },
  {
    label: 'On-Time Delivery Rate',
    value: 94.7,
    format: 'percentage',
    trend: 'up',
    change: 1.1,
    period: 'vs Q3',
    status: 'Good'
  },
  {
    label: 'Average Transit Time',
    value: 2.3,
    format: 'decimal',
    unit: 'days',
    trend: 'down',
    change: 5.2,
    period: 'improvement',
    status: 'Good'
  },
  {
    label: 'Claims Ratio',
    value: 0.47,
    format: 'percentage',
    trend: 'down',
    change: 0.12,
    period: 'vs last quarter',
    status: 'Good'
  },
  {
    label: 'Tractor Utilization',
    value: 87.4,
    format: 'percentage',
    trend: 'up',
    change: 2.1,
    period: 'vs Q3',
    status: 'Good'
  },
  {
    label: 'Terminal Efficiency',
    value: 92.1,
    format: 'percentage',
    trend: 'up',
    change: 1.8,
    period: 'dock productivity',
    status: 'Good'
  }
])

// Strategic Investments
const strategicMetrics = ref([
  {
    label: 'Digital Bookings',
    value: 68.3,
    format: 'percentage',
    trend: 'up',
    change: 12.4,
    period: 'vs last year',
    status: 'Good',
    subtitle: 'Self-service portal adoption'
  },
  {
    label: 'Sustainability Score',
    value: 73.5,
    format: 'number',
    trend: 'up',
    change: 8.2,
    period: 'ESG rating',
    status: 'Good'
  },
  {
    label: 'CO₂ per Shipment',
    value: 2.84,
    format: 'decimal',
    unit: 'kg',
    trend: 'down',
    change: 6.7,
    period: 'reduction',
    status: 'Good'
  },
  {
    label: 'Electric Fleet %',
    value: 3.2,
    format: 'percentage',
    trend: 'up',
    change: 85.0,
    period: 'expansion',
    status: 'On Track'
  },
  {
    label: 'AI/ML Deployments',
    value: 7,
    format: 'number',
    trend: 'up',
    change: 40.0,
    period: 'active models',
    status: 'On Track',
    subtitle: 'Route optimization, predictive maintenance'
  }
])

// Risk & Compliance
const riskMetrics = ref([
  {
    label: 'Safety Score',
    value: 98.1,
    format: 'percentage',
    trend: 'up',
    change: 0.3,
    period: 'DOT rating',
    status: 'Good'
  },
  {
    label: 'Incident Rate',
    value: 0.23,
    format: 'decimal',
    unit: 'per 100K miles',
    trend: 'down',
    change: 15.0,
    period: 'improvement',
    status: 'Good'
  },
  {
    label: 'Compliance Score',
    value: 97.8,
    format: 'percentage',
    trend: 'neutral',
    change: 0.1,
    period: 'FMCSA',
    status: 'Good'
  },
  {
    label: 'Driver Retention',
    value: 89.2,
    format: 'percentage',
    trend: 'up',
    change: 3.4,
    period: 'vs industry avg',
    status: 'Good'
  },
  {
    label: 'Regulatory Risk',
    value: 'Low',
    format: 'text',
    status: 'Good',
    subtitle: 'EPA, FMCSA compliance on track'
  }
])

onMounted(() => {
  // Simulate real-time data updates
  // In production, this would fetch from APIs
  console.log('Executive Dashboard mounted - ready for SAIA CIO presentation')
})
</script>

<style scoped>
.executive-dashboard {
  padding: 0;
}

/* Custom styling for executive dashboard */
:deep(.metric-card) {
  min-height: 140px;
}

:deep(.section-title) {
  color: #1f2937;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
}

@media (prefers-color-scheme: dark) {
  :deep(.section-title) {
    color: #f9fafb;
    border-bottom-color: #374151;
  }
}
</style>