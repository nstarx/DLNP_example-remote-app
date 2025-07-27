
<template>
  <BaseCard>
    <div class="table-container">
      <h3 class="table-title">Mock Data Table</h3>
      <table class="mock-table">
        <thead>
          <tr>
            <th>Label</th>
            <th>Value</th>
            <th>Change</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(metric, index) in mockMetrics['24h']" :key="index">
            <td>{{ metric.label }}</td>
            <td>{{ metric.value }}</td>
            <td>{{ metric.change }}%</td>
            <td>{{ metric.trend }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </BaseCard>
</template>

<script setup>
import { ref } from 'vue'
import BaseCard from './common/BaseCard.vue'
import { mockMetrics } from '@/data/mockData.js'

const mockMetricsRef = ref(mockMetrics)
</script>

<style scoped>
.table-container {
  width: 100%;
  overflow-x: auto;
}

.table-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #111827;
}

.mock-table {
  width: 100%;
  border-collapse: collapse;
}

.mock-table th,
.mock-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.mock-table th {
  background-color: #f3f4f6;
  color: #4b5563;
}

.mock-table tr:nth-child(even) {
  background-color: #f9fafb;
}

@media (prefers-color-scheme: dark) {
  .table-title {
    color: #f9fafb;
  }

  .mock-table th {
    background-color: #374151;
    color: #d1d5db;
  }

  .mock-table tr:nth-child(even) {
    background-color: #1f2937;
  }
}
</style>
