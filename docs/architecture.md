# Dashboard Application Architecture

## Overview

This document describes the architecture of the full-stack dashboard application built with Vue.js, Node.js, and Python FastAPI.

## System Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Vue.js Application<br/>Port: 5173]
        B[PrimeVue Components]
        C[TailwindCSS v4]
        D[API Service Layer]
    end
    
    subgraph "Middleware Layer"
        E[Node.js Express Server<br/>Port: 3001]
        F[Rate Limiter]
        G[CORS Handler]
        H[Error Handler]
    end
    
    subgraph "Backend Layer"
        I[Python FastAPI<br/>Port: 8000]
        J[Pydantic Models]
        K[In-Memory Storage]
    end
    
    A --> B
    A --> C
    A --> D
    D -->|HTTP Requests| E
    E --> F
    E --> G
    E --> H
    E -->|Proxy Requests| I
    I --> J
    I --> K
    
    style A fill:#42b883
    style E fill:#68a063
    style I fill:#3776ab
```

## Request Flow

```mermaid
sequenceDiagram
    participant User
    participant Vue as Vue.js App
    participant API as API Service
    participant Node as Node.js Server
    participant FastAPI as FastAPI Backend
    
    User->>Vue: Interacts with UI
    Vue->>API: Call API method
    API->>Node: HTTP Request
    Node->>Node: Apply middleware<br/>(CORS, Rate Limit)
    Node->>FastAPI: Proxy request
    FastAPI->>FastAPI: Process request
    FastAPI-->>Node: Response
    Node-->>API: Formatted response
    API-->>Vue: Update state
    Vue-->>User: Update UI
```

## Component Architecture

```mermaid
graph TD
    subgraph "Vue Application Structure"
        A[App.vue]
        B[AppTopbar.vue]
        C[AppFooter.vue]
        D[Dashboard Components]
        
        A --> B
        A --> C
        A --> D
        
        D --> E[StatsWidget.vue]
        D --> F[SalesTrendWidget.vue]
        D --> G[RecentActivityWidget.vue]
        D --> H[ProductOverviewWidget.vue]
        
        I[useLayout Composable]
        J[API Service]
        
        B --> I
        E --> J
        F --> J
        G --> J
        H --> J
    end
    
    style A fill:#42b883
    style I fill:#ff7f50
    style J fill:#4169e1
```

## Data Flow Architecture

```mermaid
graph LR
    subgraph "Frontend State Management"
        A[Component State]
        B[useLayout Composable]
        C[Theme State]
        D[API Responses]
    end
    
    subgraph "API Layer"
        E[api.js Service]
        F[HTTP Client]
    end
    
    subgraph "Backend Data"
        G[FastAPI Endpoints]
        H[In-Memory DB]
        I[Pydantic Models]
    end
    
    A --> E
    B --> C
    E --> F
    F --> G
    G --> H
    G --> I
    D --> A
    F --> D
```

## API Endpoints Structure

```mermaid
graph TD
    subgraph "Node.js API Routes"
        A[/health]
        B[/api/stats]
        C[/api/items]
        D[/api/items/:id]
        E[/api/sales-trend]
        F[/api/recent-activity]
    end
    
    subgraph "FastAPI Routes"
        G[GET /api/stats]
        H[GET /api/items]
        I[POST /api/items]
        J[GET /api/items/{id}]
        K[PUT /api/items/{id}]
        L[DELETE /api/items/{id}]
    end
    
    B -.->|Proxy| G
    C -.->|Proxy| H
    C -.->|Proxy| I
    D -.->|Proxy| J
    D -.->|Proxy| K
    D -.->|Proxy| L
    
    style A fill:#90ee90
    style E fill:#87ceeb
    style F fill:#87ceeb
```

## Deployment Architecture

```mermaid
graph TD
    subgraph "Docker Compose Stack"
        A[docker-compose.yml]
        
        subgraph "Frontend Container"
            B[Vue.js Dev Server<br/>Port: 5173]
            C[Volume: ./src]
        end
        
        subgraph "Node.js Container"
            D[Express Server<br/>Port: 3001]
            E[ENV: FASTAPI_URL]
        end
        
        subgraph "Python Container"
            F[FastAPI Server<br/>Port: 8000]
            G[Volume: ./backend]
        end
        
        H[Docker Network<br/>dashboard-network]
    end
    
    A --> B
    A --> D
    A --> F
    B -.-> H
    D -.-> H
    F -.-> H
    
    B -->|depends_on| D
    D -->|depends_on| F
```

## Security Architecture

```mermaid
graph TD
    subgraph "Security Layers"
        A[Client Request]
        B[CORS Validation]
        C[Rate Limiting]
        D[Helmet Security Headers]
        E[Input Validation]
        F[Error Sanitization]
    end
    
    A --> B
    B -->|Valid Origin| C
    C -->|Under Limit| D
    D --> E
    E -->|Valid Data| F
    
    B -->|Invalid| G[403 Forbidden]
    C -->|Over Limit| H[429 Too Many Requests]
    E -->|Invalid| I[400 Bad Request]
```

## Technology Stack Details

### Frontend Layer
- **Vue.js 3**: Reactive UI framework with Composition API
- **PrimeVue 4**: Comprehensive UI component library
- **TailwindCSS v4**: Utility-first CSS framework
- **Chart.js**: Data visualization library
- **Vite**: Build tool and dev server

### Middleware Layer
- **Express.js**: Web application framework
- **Axios**: HTTP client for backend communication
- **Helmet**: Security headers middleware
- **CORS**: Cross-origin resource sharing
- **Express Rate Limit**: Rate limiting middleware
- **Morgan**: HTTP request logger

### Backend Layer
- **FastAPI**: Modern Python web framework
- **Pydantic**: Data validation using Python type annotations
- **Uvicorn**: ASGI server implementation
- **Python 3.11**: Programming language

## Key Design Patterns

### 1. **API Gateway Pattern**
The Node.js server acts as an API gateway, providing:
- Single entry point for frontend
- Request routing and aggregation
- Cross-cutting concerns (auth, logging, rate limiting)

### 2. **Composition Pattern**
Vue.js components use the Composition API for:
- Reusable logic extraction
- Better TypeScript support
- Cleaner component organization

### 3. **Repository Pattern**
FastAPI uses in-memory storage abstraction:
- Separation of data access logic
- Easy to swap with real database
- Consistent data operations

### 4. **DTO Pattern**
Pydantic models serve as Data Transfer Objects:
- Type validation
- Serialization/deserialization
- API documentation generation

## Performance Considerations

```mermaid
graph LR
    subgraph "Optimization Strategies"
        A[Frontend]
        B[Middleware]
        C[Backend]
    end
    
    A --> D[Component Lazy Loading]
    A --> E[API Response Caching]
    A --> F[Debounced Requests]
    
    B --> G[Response Compression]
    B --> H[Connection Pooling]
    B --> I[Request Batching]
    
    C --> J[Async Request Handling]
    C --> K[Query Optimization]
    C --> L[Response Pagination]
```

## Development Workflow

```mermaid
graph TD
    A[Local Development] --> B{Choose Method}
    B -->|Docker| C[docker-compose up]
    B -->|Manual| D[Start Services Individually]
    
    C --> E[All Services Running]
    D --> F[Start FastAPI]
    D --> G[Start Node.js]
    D --> H[Start Vue.js]
    
    F --> E
    G --> E
    H --> E
    
    E --> I[Development Ready]
    I --> J[Hot Reload Enabled]
    J --> K[Make Changes]
    K --> J
```

## Future Enhancements

1. **Authentication & Authorization**
   - JWT token implementation
   - Role-based access control
   - Session management

2. **Database Integration**
   - PostgreSQL for production
   - Redis for caching
   - Database migrations

3. **Monitoring & Logging**
   - OpenTelemetry integration
   - Centralized logging
   - Performance metrics

4. **Scalability**
   - Kubernetes deployment
   - Load balancing
   - Microservices architecture

5. **Testing**
   - Unit tests for all layers
   - Integration tests
   - E2E tests with Cypress