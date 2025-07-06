<template>
  <div class="bridge-provider">
    <slot />
  </div>
</template>

<script setup>
import { provide, inject, onMounted } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  }
})

const hostContext = inject('hostContext', null)

provide('bridgeConfig', {
  ...props.config,
  hostContext,
  remoteName: 'analyticsDashboard'
})

onMounted(() => {
  if (hostContext) {
    console.log('Analytics Dashboard: Connected to host context', hostContext)
  }
})
</script>

<style scoped>
.bridge-provider {
  width: 100%;
  height: 100%;
}
</style>