<template>
  <div class="cio-dashboard">
    <!-- Infrastructure & IT Health -->
    <DashboardSection 
      title="Infrastructure & IT Health"
      subtitle="Core IT systems performance and cybersecurity posture"
      :columns="4"
    >
      <ExecutiveMetricCard
        v-for="metric in infrastructureMetrics"
        :key="metric.label"
        :metric="metric"
      />
    </DashboardSection>

    <!-- Digital Operations -->
    <DashboardSection 
      title="Digital Operations"
      subtitle="Digital transformation progress and automation adoption"
      :columns="4"
    >
      <ExecutiveMetricCard
        v-for="metric in digitalMetrics"
        :key="metric.label"
        :metric="metric"
      />
    </DashboardSection>

    <!-- Data & Analytics -->
    <DashboardSection 
      title="Data & Analytics"
      subtitle="Data quality, predictive analytics, and business intelligence"
      :columns="3"
    >
      <ExecutiveMetricCard
        v-for="metric in dataMetrics"
        :key="metric.label"
        :metric="metric"
      />
    </DashboardSection>

    <!-- Operational IT KPIs -->
    <DashboardSection 
      title="Operational IT KPIs"
      subtitle="IT service delivery and organizational metrics"
      :columns="4"
    >
      <ExecutiveMetricCard
        v-for="metric in operationalITMetrics"
        :key="metric.label"
        :metric="metric"
      />
    </DashboardSection>

    <!-- Innovation & Transformation -->
    <DashboardSection 
      title="Innovation & Transformation"
      subtitle="Emerging technology pilots and strategic IT investments"
      :columns="3"
    >
      <ExecutiveMetricCard
        v-for="metric in innovationMetrics"
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

// Infrastructure & IT Health
const infrastructureMetrics = ref([
  {
    label: 'TMS System Uptime',
    value: 99.7,
    format: 'percentage',
    trend: 'up',
    change: 0.2,
    period: 'vs last month',
    status: 'Good',
    subtitle: 'Transportation Management System'
  },
  {
    label: 'WMS System Uptime',
    value: 99.4,
    format: 'percentage',
    trend: 'up',
    change: 0.1,
    period: 'vs last month',
    status: 'Good',
    subtitle: 'Warehouse Management System'
  },
  {
    label: 'Customer Portal Uptime',
    value: 99.9,
    format: 'percentage',
    trend: 'neutral',
    change: 0.0,
    period: 'consistent',
    status: 'Good'
  },
  {
    label: 'Cybersecurity Score',
    value: 94.2,
    format: 'percentage',
    trend: 'up',
    change: 2.1,
    period: 'security posture',
    status: 'Good'
  },
  {
    label: 'Security Incidents',
    value: 2,
    format: 'number',
    trend: 'down',
    change: 50.0,
    period: 'this quarter',
    status: 'Good',
    subtitle: 'No critical incidents'
  },
  {
    label: 'Patch Compliance',
    value: 96.8,
    format: 'percentage',
    trend: 'up',
    change: 1.4,
    period: 'critical patches',
    status: 'Good'
  },
  {
    label: 'Cloud Migration',
    value: 67.3,
    format: 'percentage',
    trend: 'up',
    change: 8.2,
    period: 'workloads migrated',
    status: 'On Track'
  },
  {
    label: 'Cloud Cost Optimization',
    value: 847000,
    format: 'currency',
    trend: 'down',
    change: 12.4,
    period: 'monthly savings',
    status: 'Good',
    subtitle: 'vs on-premise costs'
  }
])

// Digital Operations
const digitalMetrics = ref([
  {
    label: 'Digital Booking Rate',
    value: 72.8,
    format: 'percentage',
    trend: 'up',
    change: 15.3,
    period: 'vs last year',
    status: 'Good',
    size: 'large'
  },
  {
    label: 'API Integration Adoption',
    value: 58.4,
    format: 'percentage',
    trend: 'up',
    change: 23.7,
    period: 'customer connections',
    status: 'On Track'
  },
  {
    label: 'RPA Deployments',
    value: 14,
    format: 'number',
    trend: 'up',
    change: 55.6,
    period: 'active bots',
    status: 'Good',
    subtitle: 'Claims, invoicing, document processing'
  },
  {
    label: 'Tracking System Accuracy',
    value: 98.6,
    format: 'percentage',
    trend: 'up',
    change: 1.2,
    period: 'real-time visibility',
    status: 'Good'
  },
  {
    label: 'Mobile App Usage',
    value: 89.2,
    format: 'percentage',
    trend: 'up',
    change: 7.8,
    period: 'driver adoption',
    status: 'Good'
  },
  {
    label: 'E-Document Processing',
    value: 94.1,
    format: 'percentage',
    trend: 'up',
    change: 18.4,
    period: 'paperless workflow',
    status: 'Good'
  },
  {
    label: 'Automated Claims Processing',
    value: 67.3,
    format: 'percentage',
    trend: 'up',
    change: 28.7,
    period: 'straight-through processing',
    status: 'On Track'
  },
  {
    label: 'Route Optimization AI',
    value: 8.7,
    format: 'percentage',
    trend: 'up',
    change: 12.1,
    period: 'fuel savings',
    status: 'Good'
  }
])

// Data & Analytics
const dataMetrics = ref([
  {
    label: 'GPS Data Accuracy',
    value: 99.3,
    format: 'percentage',
    trend: 'up',
    change: 0.4,
    period: 'location precision',
    status: 'Good'
  },
  {
    label: 'Scan Compliance Rate',
    value: 96.7,
    format: 'percentage',
    trend: 'up',
    change: 2.1,
    period: 'shipment tracking',
    status: 'Good'
  },
  {
    label: 'Predictive ETA Accuracy',
    value: 94.2,
    format: 'percentage',
    trend: 'up',
    change: 3.8,
    period: 'delivery predictions',
    status: 'Good',
    subtitle: 'Machine learning model'
  },
  {
    label: 'Analytics Platform Usage',
    value: 847,
    format: 'number',
    trend: 'up',
    change: 24.3,
    period: 'active users',
    status: 'Good'
  },
  {
    label: 'ML Models in Production',
    value: 12,
    format: 'number',
    trend: 'up',
    change: 71.4,
    period: 'deployed models',
    status: 'Good',
    subtitle: 'Pricing, routing, demand forecasting'
  },
  {
    label: 'Data Quality Score',
    value: 92.4,
    format: 'percentage',
    trend: 'up',
    change: 2.8,
    period: 'overall quality',
    status: 'Good'
  }
])

// Operational IT KPIs
const operationalITMetrics = ref([
  {
    label: 'Average Resolution Time (MTTR)',
    value: 2.4,
    format: 'decimal',
    unit: 'hours',
    trend: 'down',
    change: 18.2,
    period: 'faster resolution',
    status: 'Good'
  },
  {
    label: 'First Call Resolution',
    value: 78.3,
    format: 'percentage',
    trend: 'up',
    change: 5.7,
    period: 'help desk efficiency',
    status: 'Good'
  },
  {
    label: 'Driver App Adoption',
    value: 94.7,
    format: 'percentage',
    trend: 'up',
    change: 3.2,
    period: 'active users',
    status: 'Good'
  },
  {
    label: 'IT Cost per User',
    value: 3240,
    format: 'currency',
    trend: 'down',
    change: 8.1,
    period: 'annual cost',
    status: 'Good'
  },
  {
    label: 'IT Spend % of Revenue',
    value: 2.8,
    format: 'percentage',
    trend: 'down',
    change: 0.3,
    period: 'cost optimization',
    status: 'Good'
  },
  {
    label: 'IT Team Retention',
    value: 91.4,
    format: 'percentage',
    trend: 'up',
    change: 4.2,
    period: 'vs industry avg',
    status: 'Good'
  },
  {
    label: 'Skills Gap Score',
    value: 23.1,
    format: 'percentage',
    trend: 'down',
    change: 7.3,
    period: 'critical skills',
    status: 'Warning',
    subtitle: 'Cloud, AI/ML, cybersecurity'
  },
  {
    label: 'System Availability',
    value: 99.2,
    format: 'percentage',
    trend: 'up',
    change: 0.1,
    period: 'overall uptime',
    status: 'Good'
  }
])

// Innovation & Transformation
const innovationMetrics = ref([
  {
    label: 'Autonomous Truck Pilots',
    value: 3,
    format: 'number',
    trend: 'up',
    change: 50.0,
    period: 'active pilots',
    status: 'On Track',
    subtitle: 'Highway corridors testing'
  },
  {
    label: 'Electric Vehicle Integration',
    value: 15,
    format: 'number',
    trend: 'up',
    change: 87.5,
    period: 'vehicles deployed',
    status: 'On Track'
  },
  {
    label: 'IoT Sensor Deployment',
    value: 2847,
    format: 'number',
    trend: 'up',
    change: 34.2,
    period: 'active sensors',
    status: 'Good',
    subtitle: 'Temperature, location, condition monitoring'
  },
  {
    label: 'Digital Transformation ROI',
    value: 18.4,
    format: 'percentage',
    trend: 'up',
    change: 3.7,
    period: 'annualized return',
    status: 'Good'
  },
  {
    label: 'Innovation Pipeline Value',
    value: 12.7,
    format: 'currency',
    unit: 'M',
    trend: 'up',
    change: 28.3,
    period: 'potential impact',
    status: 'Good',
    subtitle: 'Next 24 months'
  },
  {
    label: 'Tech Partnership Score',
    value: 8.4,
    format: 'decimal',
    trend: 'up',
    change: 12.0,
    period: 'strategic partnerships',
    status: 'Good',
    subtitle: 'Startups, universities, vendors'
  }
])

onMounted(() => {
  // Simulate real-time data updates
  console.log('CIO Dashboard mounted - ready for SAIA technology review')
})
</script>

<style scoped>
.cio-dashboard {
  padding: 0;
}

/* Technology-focused styling */
:deep(.section-title) {
  color: #1e40af;
  border-bottom: 2px solid #3b82f6;
  padding-bottom: 8px;
}

:deep(.status-good) {
  background: #dbeafe;
  color: #1e40af;
}

:deep(.status-warning) {
  background: #fed7aa;
  color: #ea580c;
}

:deep(.status-critical) {
  background: #fecaca;
  color: #dc2626;
}

@media (prefers-color-scheme: dark) {
  :deep(.section-title) {
    color: #60a5fa;
    border-bottom-color: #3b82f6;
  }
  
  :deep(.status-good) {
    background: #1e40af;
    color: #dbeafe;
  }
  
  :deep(.status-warning) {
    background: #ea580c;
    color: #fed7aa;
  }
  
  :deep(.status-critical) {
    background: #dc2626;
    color: #fecaca;
  }
}
</style>