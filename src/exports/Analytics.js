import { defineAsyncComponent } from 'vue'

const Analytics = defineAsyncComponent({
  loader: () => import('../App.vue'),
  loadingComponent: {
    template: '<div style="text-align: center; padding: 40px;">Loading Analytics Dashboard...</div>'
  },
  errorComponent: {
    template: '<div style="color: red; text-align: center; padding: 40px;">Error loading Analytics Dashboard</div>'
  },
  delay: 200,
  timeout: 10000
})

export default Analytics