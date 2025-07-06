# Analytics Dashboard

A modern, modular analytics dashboard built with Vue 3 and Vite. This micro-frontend application provides reusable analytics components that can be integrated into other applications via Module Federation.

## Features

- **Modern Tech Stack**: Vue 3, Vite, Module Federation
- **Modular Architecture**: Clear separation of concerns with dedicated services, composables, and components
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Dark Mode Support**: Automatic theme switching based on system preferences
- **Mock Data**: Built-in mock data for demonstration and development
- **Performance Optimized**: Fast build times with Vite and optimized bundle sizes

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (cards, spinners)
│   ├── dashboard/      # Dashboard-specific components
│   └── charts/         # Chart visualization components
├── composables/        # Vue composition functions
├── services/           # Business logic and API services
├── data/              # Mock data and constants
├── styles/            # Global styles
├── App.vue            # Root component
└── main.js            # Application entry point
```

## Module Federation

This application exposes components via Module Federation for integration into host applications.

### Integration Example

```javascript
// Host application configuration
{
  remotes: {
    analytics: 'analyticsDashboard@http://localhost:3001/remoteEntry.js'
  }
}

// Using the component
import { defineAsyncComponent } from 'vue'
const AnalyticsApp = defineAsyncComponent(() => import('analytics/App'))
```

## Architecture Highlights

### Component Design
- **Container/Presentational Pattern**: Business logic separated from UI components
- **Props-based Communication**: Unidirectional data flow
- **Composition API**: Modern Vue 3 patterns for better code organization

### Data Management
- **Service Layer**: Centralized data fetching and transformation
- **Mock Data**: Separated into dedicated files for easy replacement
- **Error Handling**: Graceful error states and loading indicators

### Styling Strategy
- **Scoped Styles**: Component-level styling isolation
- **CSS Variables**: Consistent theming and design tokens
- **Responsive Design**: Mobile-first breakpoints

## Development

### Available Scripts

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Key Dependencies

- **Vue 3**: Progressive JavaScript framework
- **Vite**: Next-generation frontend tooling
- **@originjs/vite-plugin-federation**: Module Federation support for Vite

## Future Enhancements

This starter template is designed to be extended with:
- Real API integration
- State management (Pinia/Vuex)
- TypeScript support
- Unit and E2E testing
- CI/CD pipelines
- Advanced chart libraries
- Authentication and authorization
- Internationalization

## License

MIT