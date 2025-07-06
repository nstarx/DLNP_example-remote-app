<template>
  <div id="host-app">
    <header>
      <h1>Host Application</h1>
      <p>Loading Analytics Dashboard from Remote Module</p>
    </header>
    
    <main>
      <div v-if="loading" class="loading">
        Loading remote module...
      </div>
      
      <div v-else-if="error" class="error">
        Error loading remote module: {{ error }}
      </div>
      
      <div v-else>
        <TestRemote />
        <hr style="margin: 20px 0;">
        <Suspense>
          <template #default>
            <AnalyticsApp />
          </template>
          <template #fallback>
            <div class="loading">Loading analytics component...</div>
          </template>
        </Suspense>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createRemoteComponent } from '@module-federation/bridge-vue3';
import TestRemote from './components/TestRemote.vue';

const loading = ref(true);
const error = ref(null);

// Create the remote component with error handling
const AnalyticsApp = createRemoteComponent({
  loader: async () => {
    try {
      console.log('Loading remote AnalyticsBridge...');
      const module = await import('analyticsDashboard/AnalyticsBridge');
      console.log('Remote module loaded:', module);
      return module;
    } catch (err) {
      console.error('Failed to load AnalyticsBridge:', err);
      error.value = err.message;
      throw err;
    }
  },
  fallback: () => 'Loading analytics dashboard...'
});

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 100);
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #f5f5f5;
}

#host-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

header h1 {
  margin-bottom: 10px;
  font-size: 2rem;
}

header p {
  opacity: 0.9;
  font-size: 1.1rem;
}

main {
  flex: 1;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.loading {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #666;
}

.error {
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 20px;
  border-radius: 4px;
  margin: 20px 0;
}
</style>