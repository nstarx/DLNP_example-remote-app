import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'analyticsDashboard',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/exports/App.js',
        './Analytics': './src/exports/Analytics.js',
        './AnalyticsBridge': './src/exports/analytics-bridge.js',
        './components/MetricCard': './src/components/dashboard/MetricCard.vue',
        './components/LineChart': './src/components/charts/LineChart.vue',
        './components/BarChart': './src/components/charts/BarChart.vue',
        './composables/useAnalytics': './src/composables/useAnalytics.js',
        './services/analyticsService': './src/services/analyticsService.js'
      },
      shared: {
        vue: {
          singleton: true,
          requiredVersion: '^3.3.4'
        },
        '@module-federation/bridge-vue3': {
          singleton: true,
          requiredVersion: '^0.16.0'
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3001,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },
  build: {
    target: 'esnext',
    minify: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: 'es'
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 3001,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      '/remoteEntry.js': {
        target: 'http://0.0.0.0:3001',
        rewrite: () => '/assets/remoteEntry.js'
      }
    }
  }
})
