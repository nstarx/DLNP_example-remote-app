# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 micro-frontend application built with Webpack 5 Module Federation. It serves as a remote application that exposes an analytics dashboard component to be consumed by other applications.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (port 3001)
npm run dev

# Build for production
npm run build
```

## Architecture

### Module Federation Configuration
- **Remote Name**: `analyticsDashboard`
- **Exposed Component**: `./App` → `src/App.vue`
- **Remote Entry**: `http://localhost:3001/remoteEntry.js`
- **Shared Dependencies**: Vue 3 (singleton)

### Project Structure
```
src/
├── App.vue                    # Main component exposed via Module Federation
├── bootstrap.js               # Vue app initialization
├── index.js                   # Entry point for Module Federation
├── components/
│   ├── AnalyticsChart.vue    # Dynamic analytics chart component
│   ├── MetricsCard.vue       # Metric display card
│   └── StaticAnalyticsChart.vue # Static chart variations
├── composables/
│   └── useAnalytics.js       # Analytics data composition function
└── utils/
    └── resizeObserverFix.js  # Browser compatibility utility
```

### Key Technical Details

1. **Vue 3 Composition API**: All components use `<script setup>` syntax
2. **Path Alias**: `@` is aliased to `src/` directory
3. **CORS**: Development server configured with permissive CORS headers for cross-origin access
4. **No TypeScript**: Project uses plain JavaScript
5. **No Test Framework**: Currently no testing infrastructure is set up

### Component Architecture

The application exposes a single root component (`App.vue`) that includes:
- Period selection (24h, 7d, 30d, 90d)
- Metrics cards displaying analytics data
- Static charts (line and bar) for visualization
- Loading states and error handling
- Responsive design

### Module Federation Usage

To consume this remote app in a host application:

1. Add to host's Module Federation configuration:
```javascript
remotes: {
  analyticsDashboard: 'analyticsDashboard@http://localhost:3001/remoteEntry.js'
}
```

2. Import and use the component:
```javascript
const AnalyticsApp = defineAsyncComponent(() => 
  import('analyticsDashboard/App')
)
```