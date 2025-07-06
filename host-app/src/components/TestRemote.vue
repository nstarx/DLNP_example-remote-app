<template>
  <div>
    <h2>Test Remote Component</h2>
    <div v-if="error" style="color: red;">
      Error: {{ error }}
    </div>
    <div v-else>
      <component :is="RemoteComponent" v-if="RemoteComponent" />
      <div v-else>Loading remote component...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const RemoteComponent = ref(null);
const error = ref(null);

onMounted(async () => {
  try {
    console.log('Starting to load remote module...');
    
    // Try to load the remote module
    const module = await import('analyticsDashboard/AnalyticsBridge');
    console.log('Remote module loaded:', module);
    
    RemoteComponent.value = module.default;
  } catch (err) {
    console.error('Failed to load remote component:', err);
    error.value = err.message;
  }
});
</script>