# Module Federation for Analytics Dashboard

This application is built using Module Federation, providing seamless integration capabilities for micro-frontend architectures.

## Overview

The Analytics Dashboard exposes multiple modules that can be consumed by any host application:
- Complete dashboard components
- Individual UI components
- Composables and services
- Utilities and helpers

## Exposed Modules

### Complete Applications
- `./App` - Basic dashboard with default configuration
- `./Analytics` - Enhanced dashboard with async loading and error handling

### Components
- `./components/MetricCard` - Individual metric display component
- `./components/LineChart` - Line chart visualization component
- `./components/BarChart` - Bar chart visualization component

### Business Logic
- `./composables/useAnalytics` - Analytics data management hook
- `./services/analyticsService` - Data fetching and transformation service

## Architecture

### Remote Configuration (This App)

```javascript
// vite.config.js
federation({
  name: 'analyticsDashboard',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/exports/App.js',
    './Analytics': './src/exports/Analytics.js',
    './components/MetricCard': './src/components/dashboard/MetricCard.vue',
    './components/LineChart': './src/components/charts/LineChart.vue',
    './components/BarChart': './src/components/charts/BarChart.vue',
    './composables/useAnalytics': './src/composables/useAnalytics.js',
    './services/analyticsService': './src/services/analyticsService.js'
  },
  shared: {
    vue: { singleton: true }
  }
})
```

## Integration Guide

### Basic Setup

1. **Install Dependencies**
```bash
npm install @originjs/vite-plugin-federation
```

2. **Configure Host Application**
```javascript
// vite.config.js
import federation from '@originjs/vite-plugin-federation'

export default {
  plugins: [
    federation({
      name: 'hostApp',
      remotes: {
        analyticsDashboard: 'http://localhost:3001/assets/remoteEntry.js'
      },
      shared: {
        vue: { singleton: true }
      }
    })
  ]
}
```

### Usage Examples

#### 1. Complete Dashboard
```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const AnalyticsDashboard = defineAsyncComponent(() => 
  import('analyticsDashboard/App')
)
</script>

<template>
  <AnalyticsDashboard />
</template>
```

#### 2. Individual Components
```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const MetricCard = defineAsyncComponent(() => 
  import('analyticsDashboard/components/MetricCard')
)

const metric = {
  label: 'Revenue',
  value: '$125,432',
  change: 12.5,
  trend: 'up'
}
</script>

<template>
  <MetricCard :metric="metric" />
</template>
```

#### 3. Using Composables
```vue
<script setup>
import { onMounted } from 'vue'
import useAnalyticsModule from 'analyticsDashboard/composables/useAnalytics'

const { useAnalytics } = await useAnalyticsModule
const { metrics, loading, fetchAnalytics } = useAnalytics()

onMounted(() => {
  fetchAnalytics('7d')
})
</script>
```

#### 4. Using Services
```javascript
import analyticsServiceModule from 'analyticsDashboard/services/analyticsService'

const { analyticsService } = await analyticsServiceModule
const data = await analyticsService.getMetrics('30d')
```

## Advanced Features

### Configuration Injection

Components accept configuration through Vue's provide/inject:

```javascript
// In host app
provide('analyticsConfig', {
  defaultPeriod: '30d',
  refreshInterval: 30000
})
```

### Error Handling

The Analytics export includes built-in error handling:
- Loading states
- Error boundaries
- Timeout configuration
- Fallback UI

### Dynamic Imports

All components support dynamic importing for optimal performance:
```javascript
const Chart = defineAsyncComponent({
  loader: () => import('analyticsDashboard/components/LineChart'),
  delay: 200,
  timeout: 3000
})
```

## Development Workflow

### Running the Remote
```bash
npm install
npm run dev
# Dashboard at http://localhost:3001
# Remote entry at http://localhost:3001/assets/remoteEntry.js
```

### Building for Production
```bash
npm run build
npm run preview
```

### Testing Integration
1. Start the remote app
2. Create a host app with the configuration above
3. Import and use the exposed modules

## Production Deployment

### Build Output
```
dist/
├── assets/
│   ├── remoteEntry.js          # Module Federation entry
│   ├── __federation_*.js       # Exposed modules
│   └── *.js                    # Shared chunks
└── index.html
```

### Deployment Steps
1. Build the application
2. Deploy to CDN or static hosting
3. Ensure CORS headers are configured
4. Update host apps with production URL

### CDN Configuration
```javascript
// Production host config
remotes: {
  analyticsDashboard: 'https://cdn.example.com/analytics/assets/remoteEntry.js'
}
```

## Best Practices

### 1. Version Management
- Use semantic versioning for releases
- Document breaking changes
- Maintain backward compatibility

### 2. Performance
- Lazy load components when possible
- Use appropriate chunk splitting
- Implement proper caching strategies

### 3. Error Handling
- Always provide fallback components
- Implement retry mechanisms
- Log errors for monitoring

### 4. Security
- Validate remote URLs
- Implement CSP headers
- Use HTTPS in production

### 5. Testing
- Test components in isolation
- Test integration scenarios
- Monitor production performance

## Troubleshooting

### Common Issues

1. **Module Not Found**
   - Check remote URL is accessible
   - Verify module is exposed in config
   - Ensure shared dependencies match

2. **Vue Version Conflicts**
   - Use singleton configuration
   - Align Vue versions across apps
   - Check peer dependencies

3. **CORS Errors**
   - Configure server headers
   - Use proxy in development
   - Check production CORS policy

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check vite and plugin versions
   - Verify export paths exist

### Debug Tips
- Check browser network tab for remote loading
- Use Vue DevTools to inspect components
- Enable source maps in development
- Check console for federation warnings