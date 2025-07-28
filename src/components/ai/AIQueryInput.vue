<template>
  <div class="ai-query-input">
    <div class="query-container">
      <div class="input-wrapper">
        <textarea
          v-model="queryText"
          @keydown="handleKeydown"
          @focus="showSuggestions = true"
          placeholder="Ask me anything about operations... (e.g., 'Show regions with slowest claim times this week')"
          class="query-textarea"
          rows="1"
          :disabled="loading"
        ></textarea>
        
        <button
          @click="submitQuery"
          :disabled="!queryText.trim() || loading"
          class="submit-btn"
        >
          <SpinnerIcon v-if="loading" class="animate-spin" />
          <SearchIcon v-else />
        </button>
      </div>
      
      <!-- Query Suggestions -->
      <div v-if="showSuggestions && suggestedQueries.length > 0" class="suggestions-dropdown">
        <div class="suggestions-header">
          <span>Suggested queries</span>
          <button @click="showSuggestions = false" class="close-suggestions">×</button>
        </div>
        <div class="suggestions-list">
          <button
            v-for="suggestion in suggestedQueries"
            :key="suggestion.id"
            @click="selectSuggestion(suggestion)"
            class="suggestion-item"
          >
            <div class="suggestion-text">{{ suggestion.query }}</div>
            <div class="suggestion-type">{{ suggestion.type }}</div>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Recent Queries -->
    <div v-if="recentQueries.length > 0" class="recent-queries">
      <div class="recent-header">Recent queries</div>
      <div class="recent-list">
        <button
          v-for="query in recentQueries.slice(0, 3)"
          :key="query.id"
          @click="selectQuery(query.text)"
          class="recent-item"
        >
          {{ query.text }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import SpinnerIcon from '@/components/icons/SpinnerIcon.vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['query'])

// State
const queryText = ref('')
const showSuggestions = ref(false)
const recentQueries = ref([])

// Suggested queries for COO operations
const suggestedQueries = ref([
  {
    id: 1,
    query: "Show regions with slowest claim times this week",
    type: "Performance Analysis"
  },
  {
    id: 2,
    query: "What's causing the increase in processing delays?",
    type: "Root Cause Analysis"
  },
  {
    id: 3,
    query: "Forecast claim volume for next month",
    type: "Predictive Analytics"
  },
  {
    id: 4,
    query: "Which teams need additional staffing?",
    type: "Resource Optimization"
  },
  {
    id: 5,
    query: "Show customer satisfaction trends by product line",
    type: "Customer Analytics"
  },
  {
    id: 6,
    query: "Identify cost reduction opportunities",
    type: "Cost Analysis"
  },
  {
    id: 7,
    query: "What are the top operational risks right now?",
    type: "Risk Assessment"
  },
  {
    id: 8,
    query: "Compare this quarter's efficiency vs last quarter",
    type: "Comparative Analysis"
  }
])

// Methods
const handleKeydown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    submitQuery()
  }
  
  if (event.key === 'Escape') {
    showSuggestions.value = false
  }
}

const submitQuery = () => {
  if (!queryText.value.trim() || props.loading) return
  
  const query = queryText.value.trim()
  
  // Add to recent queries
  addToRecentQueries(query)
  
  // Emit query event
  emit('query', query)
  
  // Clear input
  queryText.value = ''
  showSuggestions.value = false
}

const selectSuggestion = (suggestion) => {
  queryText.value = suggestion.query
  showSuggestions.value = false
  submitQuery()
}

const selectQuery = (query) => {
  queryText.value = query
  submitQuery()
}

const addToRecentQueries = (query) => {
  // Remove if already exists
  recentQueries.value = recentQueries.value.filter(q => q.text !== query)
  
  // Add to beginning
  recentQueries.value.unshift({
    id: Date.now(),
    text: query,
    timestamp: new Date()
  })
  
  // Keep only last 10
  recentQueries.value = recentQueries.value.slice(0, 10)
  
  // Save to localStorage
  localStorage.setItem('ai-recent-queries', JSON.stringify(recentQueries.value))
}

// Auto-resize textarea
watch(queryText, (newValue) => {
  const textarea = document.querySelector('.query-textarea')
  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }
})

// Load recent queries from localStorage
onMounted(() => {
  const saved = localStorage.getItem('ai-recent-queries')
  if (saved) {
    try {
      recentQueries.value = JSON.parse(saved)
    } catch (e) {
      console.warn('Failed to load recent queries:', e)
    }
  }
})

// Click outside to close suggestions
onMounted(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('.ai-query-input')) {
      showSuggestions.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  return () => {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<style scoped>
.ai-query-input {
  position: relative;
  width: 400px;
}

.query-container {
  position: relative;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: flex-end;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 50px 12px 16px;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.input-wrapper:focus-within {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.query-textarea {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 14px;
  line-height: 1.4;
  resize: none;
  min-height: 20px;
  max-height: 120px;
  overflow-y: auto;
}

.query-textarea::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.query-textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-btn {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 32px;
  height: 32px;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.suggestions-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 400px;
  overflow-y: auto;
}

.suggestions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.close-suggestions {
  background: none;
  border: none;
  color: #64748b;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-suggestions:hover {
  color: #374151;
}

.suggestions-list {
  padding: 8px 0;
}

.suggestion-item {
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.suggestion-item:hover {
  background: #f8fafc;
}

.suggestion-text {
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
}

.suggestion-type {
  font-size: 12px;
  color: #64748b;
  font-weight: 400;
}

.recent-queries {
  margin-top: 12px;
}

.recent-header {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.recent-item {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 8px 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.recent-item:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .ai-query-input {
    width: 100%;
  }
  
  .suggestions-dropdown {
    left: -16px;
    right: -16px;
  }
}
</style>