
<template>
  <BaseCard class="data-table">
    <div class="table-header">
      <h3>{{ title }}</h3>
      <div class="table-actions">
        <button @click="exportData" class="export-btn">
          <span class="icon">↓</span> Export
        </button>
      </div>
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in data" :key="index">
            <td v-for="column in columns" :key="column.key">
              {{ row[column.key] }}
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
  columns: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
  }
})

function exportData() {
  const csvContent = "data:text/csv;charset=utf-8,"
    + props.columns.map(col => col.label).join(",") + "\n"
    + props.data.map(row =>
      props.columns.map(col => row[col.key]).join(",")
    ).join("\n")

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `${props.title.toLowerCase().replace(' ', '_')}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
.data-table {
  width: 100%;
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.table-actions {
  display: flex;
  gap: 8px;
}

.export-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.export-btn:hover {
  background: #2563eb;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}

tr:hover td {
  background: #f3f4f6;
}

@media (prefers-color-scheme: dark) {
  .data-table {
    background: #1f2937;
  }

  .table-header h3 {
    color: #f9fafb;
  }

  th, td {
    color: #d1d5db;
  }

  th {
    background: #374151;
    color: #f9fafb;
  }

  tr:hover td {
    background: #4b5563;
  }
}
</style>
