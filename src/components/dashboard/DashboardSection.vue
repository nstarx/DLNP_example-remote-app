<template>
  <section class="dashboard-section">
    <div class="section-header">
      <h2 class="section-title">{{ title }}</h2>
      <div v-if="$slots.actions" class="section-actions">
        <slot name="actions"></slot>
      </div>
    </div>
    
    <div v-if="subtitle" class="section-subtitle">
      {{ subtitle }}
    </div>
    
    <div class="section-content" :class="layoutClass">
      <slot></slot>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  layout: {
    type: String,
    default: 'grid', // 'grid', 'flex', 'list'
    validator: (value) => ['grid', 'flex', 'list'].includes(value)
  },
  columns: {
    type: Number,
    default: 4
  }
})

const layoutClass = computed(() => ({
  'layout-grid': props.layout === 'grid',
  'layout-flex': props.layout === 'flex',
  'layout-list': props.layout === 'list',
  [`grid-cols-${props.columns}`]: props.layout === 'grid'
}))
</script>

<style scoped>
.dashboard-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 20px;
  line-height: 1.5;
}

.section-content {
  width: 100%;
}

.layout-grid {
  display: grid;
  gap: 16px;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

.grid-cols-5 {
  grid-template-columns: repeat(5, 1fr);
}

.layout-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.layout-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 1200px) {
  .grid-cols-4,
  .grid-cols-5 {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .grid-cols-3,
  .grid-cols-4,
  .grid-cols-5 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4,
  .grid-cols-5 {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
}

@media (prefers-color-scheme: dark) {
  .section-title {
    color: #f9fafb;
  }
  
  .section-subtitle {
    color: #9ca3af;
  }
}
</style>