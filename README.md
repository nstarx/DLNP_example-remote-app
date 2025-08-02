#  PrimeVue + TailwindCSS v4 Example

## Overview

This example demonstrates how to integrate PrimeVue with TailwindCSS v4, showcasing a modern and responsive dashboard interface. The project features a dark/light theme toggle, responsive layout, and various PrimeVue components styled with TailwindCSS.

## Features

- Dark/Light theme support
- Fully responsive design
- PrimeVue components with TailwindCSS styling
- Chart.js integration
- Powered by Vite for fast development
- Real-time search functionality
- Customizable UI components

## Tech Stack

- [Vue.js](https://vuejs.org/) - The Progressive JavaScript Framework
- [PrimeVue](https://primevue.org/) - The Ultimate Vue UI Component Library
- [TailwindCSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Chart.js](https://www.chartjs.org/) - Simple yet flexible JavaScript charting

## Getting Started

### Option 1: Using Docker (Recommended)

```bash
# Clone and navigate to the project
git clone https://github.com/primefaces/primevue-examples.git
cd primevue-examples/vite-tailwindv4

# Run with Docker Compose
docker-compose up --build

# Access the application at http://localhost
```

### Option 2: Local Development

```bash
# Clone and navigate to the project
git clone https://github.com/primefaces/primevue-examples.git
cd primevue-examples/vite-tailwindv4

# Install frontend dependencies
npm install

# Terminal 1: Start Python backend
cd backend
pip install -r requirements.txt
python main.py

# Terminal 2: Start Node.js server
cd server
npm install
npm run dev

# Terminal 3: Start Vue.js frontend
npm run dev

# Frontend: http://localhost:5173
# API Gateway: http://localhost:3001
# Backend API: http://localhost:8000
```

## Project Structure

```
vite-tailwindv4/
├── src/
│   ├── components/         # Vue components
│   ├── composables/        # Vue composables
│   ├── assets/            # Static assets
│   └── App.vue            # Root component
├── public/                # Public static assets
├── index.html            # Entry HTML file
└── vite.config.js        # Vite configuration
```

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/primefaces/primevue-examples/issues).

