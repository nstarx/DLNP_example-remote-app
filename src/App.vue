<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="header-left">
        <h1 class="dashboard-title">Analytics Dashboard</h1>
      </div>
      <div class="header-right">
        <PeriodSelector v-model="selectedPeriod" />
        <DocumentationButton @click="showDocs = true" />
      </div>
    </header>

    <LoadingSpinner v-if="loading" />
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else class="dashboard-content">
      <section class="metrics-section">
        <div class="metrics-grid">
          <MetricCard
            v-for="metric in metrics"
            :key="metric.label"
            :metric="metric"
          />
        </div>
      </section>

      <section v-if="chartData" class="charts-section">
        <div class="charts-grid">
          <LineChart
            title="Page Views Trend"
            :data="chartData.pageViews"
            :labels="chartData.labels"
          />
          <BarChart
            title="Traffic Sources"
            :data="barChartData.values"
            :labels="barChartData.labels"
          />
        </div>
      </section>

      <section class="jokes-section">
        <h2 class="section-title">Need a Laugh? 😄</h2>
        <div class="jokes-grid">
          <button
            v-for="(buttonText, index) in jokeButtons"
            :key="index"
            @click="showJoke(index)"
            class="joke-button"
            :class="{ 'active': activeJoke === index }"
          >
            {{ buttonText }}
          </button>
        </div>
        <div v-if="currentJoke" class="joke-display">
          <div class="joke-content">
            <p class="joke-text">{{ currentJoke }}</p>
            <button @click="clearJoke" class="close-joke">×</button>
          </div>
        </div>
      </section>
    </div>

    <DocumentationModal v-model="showDocs" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, inject } from 'vue'
import { useAnalytics } from '@/composables/useAnalytics'
import { barChartData } from '@/data/mockData'
import PeriodSelector from '@/components/dashboard/PeriodSelector.vue'
import MetricCard from '@/components/dashboard/MetricCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import DocumentationButton from '@/components/common/DocumentationButton.vue'
import DocumentationModal from '@/components/common/DocumentationModal.vue'

const analyticsConfig = inject('analyticsConfig', {})
const selectedPeriod = ref(analyticsConfig.defaultPeriod || '7d')
const showDocs = ref(false)
const { metrics, chartData, loading, error, fetchAnalytics } = useAnalytics()

// Joke functionality
const currentJoke = ref('')
const activeJoke = ref(null)

const jokeButtons = [
  '🎭 Tell me a joke!',
  '🤪 Make me laugh!',
  '😂 Surprise me!',
  '🎪 Random fun!'
]

const jokes = [
  [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why did the scarecrow win an award? He was outstanding in his field!",
    "Why don't eggs tell jokes? They'd crack each other up!",
    "What do you call a fake noodle? An impasta!"
  ],
  [
    "Why did the math book look so sad? Because it had too many problems!",
    "What do you call a sleeping bull? A bulldozer!",
    "Why don't skeletons fight each other? They don't have the guts!",
    "What did the ocean say to the beach? Nothing, it just waved!"
  ],
  [
    "Why did the coffee file a police report? It got mugged!",
    "What do you call a bear with no teeth? A gummy bear!",
    "Why don't programmers like nature? It has too many bugs!",
    "What's the best thing about Switzerland? I don't know, but the flag is a big plus!"
  ],
  [
    "Why did the bicycle fall over? Because it was two tired!",
    "What do you call a dinosaur that crashes his car? Tyrannosaurus Wrecks!",
    "Why don't some couples go to the gym? Because some relationships don't work out!",
    "What did one wall say to the other wall? I'll meet you at the corner!"
  ]
]

const showJoke = (buttonIndex) => {
  const randomJoke = jokes[buttonIndex][Math.floor(Math.random() * jokes[buttonIndex].length)]
  currentJoke.value = randomJoke
  activeJoke.value = buttonIndex
  
  // Auto-hide joke after 10 seconds
  setTimeout(() => {
    if (activeJoke.value === buttonIndex) {
      clearJoke()
    }
  }, 10000)
}

const clearJoke = () => {
  currentJoke.value = ''
  activeJoke.value = null
}

watch(selectedPeriod, (newPeriod) => {
  fetchAnalytics(newPeriod)
})

onMounted(() => {
  fetchAnalytics(selectedPeriod.value)
  
  if (analyticsConfig.refreshInterval) {
    setInterval(() => {
      fetchAnalytics(selectedPeriod.value)
    }, analyticsConfig.refreshInterval)
  }
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f9fafb;
  padding: 24px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 24px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dashboard-title {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.error-message {
  background: #fee;
  color: #c00;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
}

.metrics-section {
  width: 100%;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.charts-section {
  width: 100%;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.jokes-section {
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
  text-align: center;
}

.jokes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.joke-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.joke-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.joke-button.active {
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%);
  animation: pulse 0.6s ease-in-out;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.joke-display {
  margin-top: 16px;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.joke-content {
  background: linear-gradient(135deg, #fff5f5 0%, #fef7ff 100%);
  border: 2px solid #fbb6ce;
  border-radius: 12px;
  padding: 20px;
  position: relative;
  box-shadow: 0 4px 12px rgba(251, 182, 206, 0.2);
}

.joke-text {
  font-size: 16px;
  line-height: 1.6;
  color: #4a1d29;
  margin: 0;
  padding-right: 30px;
  font-weight: 500;
}

.close-joke {
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  border: none;
  font-size: 20px;
  color: #9ca3af;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-joke:hover {
  background: rgba(156, 163, 175, 0.1);
  color: #6b7280;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .header-left,
  .header-right {
    width: 100%;
  }
  
  .header-right {
    flex-wrap: wrap;
  }
  
  .dashboard-title {
    font-size: 24px;
  }
  
  .metrics-grid,
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .jokes-section {
    padding: 16px;
  }
  
  .jokes-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
  
  .joke-button {
    padding: 10px 12px;
    font-size: 13px;
  }
}

@media (prefers-color-scheme: dark) {
  .dashboard {
    background: #111827;
  }
  
  .dashboard-title {
    color: #f9fafb;
  }
  
  .error-message {
    background: #7f1d1d;
    color: #fecaca;
  }
  
  .jokes-section {
    background: #1f2937;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
  
  .section-title {
    color: #f9fafb;
  }
  
  .joke-content {
    background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
    border-color: #6b7280;
  }
  
  .joke-text {
    color: #f3f4f6;
  }
}
</style>