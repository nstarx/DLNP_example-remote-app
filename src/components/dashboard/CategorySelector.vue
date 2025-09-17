<template>
  <div class="category-selector">
    <div class="category-tabs">
      <button
        :class="['category-tab', { active: selectedCategory === 'all' }]"
        @click="$emit('update:modelValue', 'all')"
      >
        <span class="tab-icon">📊</span>
        <span class="tab-text">Executive Summary</span>
      </button>
      
      <button
        v-for="category in categories"
        :key="category.id"
        :class="['category-tab', { active: selectedCategory === category.id }]"
        @click="$emit('update:modelValue', category.id)"
        :title="category.description"
      >
        <span class="tab-icon">{{ category.icon }}</span>
        <span class="tab-text">{{ category.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  selectedCategory: {
    type: String,
    default: 'all'
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.category-selector {
  width: 100%;
  margin-bottom: 24px;
}

.category-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #64748b;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.category-tab:hover {
  background: rgba(255, 255, 255, 0.7);
  color: #475569;
  transform: translateY(-1px);
}

.category-tab.active {
  background: #ffffff;
  color: #1e293b;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

.tab-icon {
  font-size: 16px;
  line-height: 1;
}

.tab-text {
  line-height: 1;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .category-tabs {
    gap: 4px;
    padding: 2px;
  }
  
  .category-tab {
    padding: 10px 12px;
    font-size: 13px;
    gap: 6px;
  }
  
  .tab-icon {
    font-size: 14px;
  }
  
  .tab-text {
    display: none;
  }
  
  .category-tab.active .tab-text {
    display: inline;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .category-tabs {
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .category-tab {
    color: #94a3b8;
  }
  
  .category-tab:hover {
    background: rgba(30, 41, 59, 0.7);
    color: #cbd5e1;
  }
  
  .category-tab.active {
    background: #1e293b;
    color: #f1f5f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
}

/* Scrollbar styling for horizontal scroll */
.category-tabs::-webkit-scrollbar {
  height: 4px;
}

.category-tabs::-webkit-scrollbar-track {
  background: transparent;
}

.category-tabs::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 2px;
}

.category-tabs::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}
</style>