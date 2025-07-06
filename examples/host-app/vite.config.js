import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'hostApp',
      remotes: {
        analyticsDashboard: 'http://localhost:3001/assets/remoteEntry.js'
      },
      shared: {
        vue: {
          singleton: true,
          requiredVersion: '^3.3.4'
        }
      }
    })
  ],
  server: {
    port: 3000
  }
})