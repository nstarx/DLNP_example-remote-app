<template>
  <section class="category-section">
    <h2 class="category-title">{{ title }}</h2>
    <div class="metrics-grid">
      <MetricCard
        v-for="metric in metrics"
        :key="metric.label"
        :metric="metric"
        :show-category="false"
      />
    </div>
  </section>
</template>

<script setup>
import MetricCard from '@/components/dashboard/MetricCard.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  metrics: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.category-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
}

.category-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f3f4f6;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

@media (prefers-color-scheme: dark) {
  .category-section {
    background: #1f2937;
  }
  
  .category-title {
    color: #f9fafb;
    border-bottom-color: #374151;
  }
}
</style>