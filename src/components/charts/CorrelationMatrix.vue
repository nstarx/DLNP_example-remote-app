



<template>
  <BaseCard class="correlation-matrix">
    <h3>{{ title }}</h3>
    <div class="matrix-container">
      <table>
        <thead>
          <tr>
            <th></th>
            <th v-for="metric in metrics" :key="metric">
              {{ metric }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in correlationData" :key="rowIndex">
            <th>{{ metrics[rowIndex] }}</th>
            <td v-for="(cell, colIndex) in row" :key="colIndex">
              <div class="correlation-cell" :style="getCellStyle(cell)">
                {{ cell.toFixed(2) }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  metrics: {
    type: Array,
    required: true
  },
  correlationData: {
    type: Array,
    required: true
  }
})

function getCellStyle(value) {
  const absValue = Math.abs(value)
  const intensity = Math.min(100, absValue * 100)

  let color
  if (value > 0) {
    color = `rgba(34, 197, 94, ${intensity / 100})`
  } else if (value < 0) {
    color = `rgba(239, 68, 68, ${intensity / 100})`
  } else {
    color = '#f3f4f6'
  }

  return {
    backgroundColor: color,
    color: absValue > 0.6 ? 'white' : '#1f2937'
  }
}
</script>

<style scoped>
.correlation-matrix {
  width: 100%;
  overflow: hidden;
}

.correlation-matrix h3 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
}

.matrix-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 400px;
}

th, td {
  padding: 8px;
  text-align: center;
  border: 1px solid #e5e7eb;
}

th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.correlation-cell {
  width: 60px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
}

@media (prefers-color-scheme: dark) {
  .correlation-matrix {
    background: #1f2937;
  }

  .correlation-matrix h3 {
    color: #f9fafb;
  }

  th, td {
    color: #d1d5db;
  }

  th {
    background: #374151;
    color: #f9fafb;
  }
}
</style>



