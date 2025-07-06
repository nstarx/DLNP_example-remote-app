<template>
  <div class="host-app">
    <h1>Host Application</h1>
    
    <div class="integration-examples">
      <h2>Integration Examples</h2>
      
      <section class="example">
        <h3>1. Basic Integration</h3>
        <button @click="showBasic = !showBasic">
          {{ showBasic ? 'Hide' : 'Show' }} Basic Dashboard
        </button>
        <div v-if="showBasic" class="remote-container">
          <RemoteAnalytics />
        </div>
      </section>
      
      <section class="example">
        <h3>2. With Configuration</h3>
        <button @click="showConfigured = !showConfigured">
          {{ showConfigured ? 'Hide' : 'Show' }} Configured Dashboard
        </button>
        <div v-if="showConfigured" class="remote-container">
          <AnalyticsWithConfig />
        </div>
      </section>
      
      <section class="example">
        <h3>3. Multiple Instances</h3>
        <button @click="showMultiple = !showMultiple">
          {{ showMultiple ? 'Hide' : 'Show' }} Multiple Dashboards
        </button>
        <div v-if="showMultiple" class="multiple-container">
          <div class="remote-container half">
            <RemoteAnalytics />
          </div>
          <div class="remote-container half">
            <AnalyticsWithConfig />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent, provide } from 'vue'

const RemoteAnalytics = defineAsyncComponent(() => 
  import('analyticsDashboard/App')
)

const AnalyticsWithConfig = defineAsyncComponent(() => 
  import('analyticsDashboard/Analytics')
)

const showBasic = ref(false)
const showConfigured = ref(false)
const showMultiple = ref(false)

provide('hostContext', {
  appName: 'Host Application',
  version: '1.0.0',
  theme: 'light'
})

provide('analyticsConfig', {
  defaultPeriod: '30d',
  refreshInterval: 30000
})
</script>

<style>
.host-app {
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.integration-examples {
  margin-top: 40px;
}

.example {
  margin-bottom: 40px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.example h3 {
  margin-top: 0;
}

button {
  padding: 10px 20px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
}

button:hover {
  background: #4338ca;
}

.remote-container {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  background: white;
  min-height: 600px;
}

.multiple-container {
  display: flex;
  gap: 20px;
}

.half {
  flex: 1;
  min-height: 400px;
}

@media (max-width: 1024px) {
  .multiple-container {
    flex-direction: column;
  }
}
</style>