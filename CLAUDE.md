# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (Vue.js)
- `npm install` - Install frontend dependencies
- `npm run dev` - Start Vite dev server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Node.js Server
- `cd server && npm install` - Install server dependencies
- `cd server && npm run dev` - Start Node.js server (port 3001)
- `cd server && npm start` - Start server in production mode

### Python Backend
- `cd backend && pip install -r requirements.txt` - Install Python dependencies
- `cd backend && python main.py` - Start FastAPI server (port 8000)

### Docker Deployment
- `docker-compose up --build` - Start all services in one container
- `docker-compose up -d` - Run in background
- `docker-compose down` - Stop all services
- `docker-compose logs` - View logs

## Architecture

This is a full-stack application with three layers: Vue.js frontend → Node.js middleware → Python FastAPI backend.

### Stack Overview
- **Frontend**: Vue 3 + PrimeVue + TailwindCSS v4 (Vite)
- **Middleware**: Node.js Express server acting as API gateway
- **Backend**: Python FastAPI for data processing and storage

### Component Library Integration
- PrimeVue components are auto-imported via `unplugin-vue-components` and `@primevue/auto-import-resolver` configured in vite.config.js:11-15
- Theme configuration uses PrimeUI's Aura theme with dark mode support via `.p-dark` selector (main.js:10-17)
- TailwindCSS v4 is integrated through `@tailwindcss/vite` plugin

### State Management & Theming
- Theme state management is handled through the `useLayout` composable (src/composables/useLayout.js)
- Supports dynamic primary color and surface palette switching at runtime
- Dark mode toggle functionality with persistent state
- Color palettes are fully customizable with Tailwind color values

### Component Structure
- Dashboard components are organized in `src/components/dashboard/`
- Layout components (AppTopbar, AppFooter) handle the application shell
- All components use Vue 3's `<script setup>` syntax
- Styling combines TailwindCSS utilities with PrimeVue's theming system

### API Integration
- Frontend communicates with Node.js server via API service layer (src/services/api.js)
- Node.js server (server/index.js) acts as middleware, proxying requests to FastAPI
- FastAPI backend (backend/main.py) handles data operations with Pydantic models
- CORS is configured at both Node.js and FastAPI layers for secure communication

### Key Files and Locations
- **API Service**: `src/services/api.js` - Frontend API client
- **Node.js Server**: `server/index.js` - Express middleware server
- **FastAPI Backend**: `backend/main.py` - Python backend with REST endpoints
- **Docker Setup**: `docker-compose.yml` - All-in-one container configuration
- **Dockerfile**: `Dockerfile.all-in-one` - Container with all services
- **Documentation**: `docs/` folder with architecture, API, and deployment guides

### Environment Variables
- Frontend: `VITE_API_URL` (default: http://localhost:3001)
- Node.js: `PORT=3001`, `FASTAPI_URL=http://localhost:8000`
- See `server/.env.example` for Node.js configuration

### Key Integration Points
- PrimeVue theme updates via `@primeuix/themes` functions (updatePrimaryPalette, updateSurfacePalette)
- TailwindCSS classes work with PrimeVue components through `tailwindcss-primeui` package
- Chart.js for data visualization in dashboard widgets
- Axios for HTTP communication between services
- Express middleware includes rate limiting, CORS, and security headers

## API Endpoints

### Available Endpoints (via Node.js server on port 3001)
- `GET /health` - Health check
- `GET /api/stats` - Dashboard statistics
- `GET /api/items` - List all items
- `GET /api/items/:id` - Get specific item
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `GET /api/sales-trend` - Sales trend data for charts
- `GET /api/recent-activity` - Recent activity logs

### FastAPI Documentation
- When running locally, visit http://localhost:8000/docs for interactive API documentation

## Testing the Full Stack

1. Start all services: `docker-compose up --build`
2. Frontend will be at http://localhost:5173
3. Test API health: `curl http://localhost:3001/health`
4. Dashboard widgets will automatically fetch data from the API