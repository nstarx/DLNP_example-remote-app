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

      <section class="jokes-section">
        <h2 class="section-title">Need a Laugh? 😄</h2>
        <div class="jokes-grid">
          <button 
            v-for="(button, index) in jokeButtons" 
            :key="index"
            @click="showJoke(index)"
            class="joke-button"
            :class="{ 'active': activeJoke === index }"
          >
            {{ button.label }}
          </button>
        </div>
        <div v-if="currentJoke" class="joke-display">
          <p class="joke-text">{{ currentJoke }}</p>
          <button @click="clearJoke" class="clear-joke-btn">Clear Joke</button>
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

const jokeButtons = ref([
  { label: '🎭 Comedy Central', jokes: [
    "Why don't scientists trust atoms? Because they make up everything!",
    "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    "Why don't eggs tell jokes? They'd crack each other up!",
    "I'm reading a book about anti-gravity. It's impossible to put down!"
  ]},
  { label: '🤖 Tech Humor', jokes: [
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
    "Why did the developer go broke? Because he used up all his cache!",
    "There are only 10 types of people in the world: those who understand binary and those who don't."
  ]},
  { label: '🍕 Food Funnies', jokes: [
    "Why did the cookie go to the doctor? Because it felt crumbly!",
    "What do you call a sleeping bull? A bulldozer!",
    "Why don't eggs tell jokes? They'd crack each other up!",
    "What do you call a bear with no teeth? A gummy bear!"
  ]},
  { label: '🌟 Random Riddles', jokes: [
    "What's orange and sounds like a parrot? A carrot!",
    "Why don't skeletons fight each other? They don't have the guts!",
    "What do you call a fish wearing a crown? A king fish!",
    "Why did the math book look so sad? Because it had too many problems!"
  ]}
])

const showJoke = (buttonIndex) => {
  const jokes = jokeButtons.value[buttonIndex].jokes
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)]
  currentJoke.value = randomJoke
  activeJoke.value = buttonIndex
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
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 20px 0;
  text-align: center;
}

.jokes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.joke-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 16px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.joke-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.joke-button.active {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  transform: translateY(-1px);
}

.joke-display {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  margin-top: 20px;
  animation: fadeIn 0.5s ease-in-out;
}

.joke-text {
  font-size: 18px;
  color: #2d3748;
  margin: 0 0 16px 0;
  line-height: 1.6;
  font-style: italic;
}

.clear-joke-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.clear-joke-btn:hover {
  background: #c53030;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
    border-color: #374151;
  }
  
  .section-title {
    color: #f9fafb;
  }
  
  .joke-display {
    background: #111827;
    border-color: #374151;
  }
  
  .joke-text {
    color: #e5e7eb;
  }
}
</style>