# Docker Setup for Full-Stack Dashboard

This project includes a Vue.js frontend, Node.js middleware server, and Python FastAPI backend, all running in a single Docker container.

## Docker Files

- `Dockerfile.all-in-one` - All-in-one container with all services
- `nginx-simple.conf` - Nginx configuration for serving the app
- `docker-compose.yml` - Docker Compose configuration

## Quick Start

### Using Docker Compose (Recommended)
```bash
# Build and run all services
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down

# Access at http://localhost
```

### Using Docker directly
```bash
# Build the image
docker build -f Dockerfile.all-in-one -t dashboard-app .

# Run the container
docker run -p 80:80 dashboard-app

# Access at http://localhost
```

### Local Development (Without Docker)
```bash
# Terminal 1 - Backend
cd backend
pip install -r requirements.txt
python main.py

# Terminal 2 - Node.js server
cd server
npm install
npm run dev

# Terminal 3 - Frontend
npm install
npm run dev
```

## API Endpoints

- Health Check: `GET http://localhost/health`
- Stats: `GET http://localhost/api/stats`
- Items: `GET/POST http://localhost/api/items`

## Environment Variables

- `VITE_API_URL` - Frontend API URL (default: http://localhost:3001)
- `FASTAPI_URL` - Node.js to FastAPI URL (default: http://localhost:8000)
- `PORT` - Node.js server port (default: 3001)