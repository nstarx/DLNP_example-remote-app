import { createApp } from 'vue'
import App from './App.vue'
import './styles/global.css'

// This is for standalone mode when the app runs by itself
if (!window.__FEDERATION__) {
  const app = createApp(App)
  app.mount('#app')
}