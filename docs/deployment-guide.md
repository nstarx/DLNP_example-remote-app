# Deployment Guide

## Deployment Overview

This guide covers various deployment strategies for the dashboard application.

```mermaid
graph TD
    A[Deployment Options] --> B[Docker Compose]
    A --> C[Kubernetes]
    A --> D[Traditional VPS]
    A --> E[Cloud Platforms]
    
    B --> F[Single Host]
    C --> G[Scalable Cluster]
    D --> H[Manual Setup]
    E --> I[AWS/GCP/Azure]
```

## Prerequisites

- Docker and Docker Compose (for containerized deployment)
- Node.js 20+ and Python 3.11+ (for manual deployment)
- Domain name and SSL certificates (for production)

## Development Deployment

### Using Docker Compose

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant DC as Docker Compose
    participant F as Frontend Container
    participant N as Node.js Container
    participant P as Python Container
    
    Dev->>DC: docker-compose up
    DC->>F: Start Vue.js
    DC->>N: Start Express
    DC->>P: Start FastAPI
    F-->>Dev: http://localhost:5173
    N-->>Dev: http://localhost:3001
    P-->>Dev: http://localhost:8000
```

```bash
# Clone repository
git clone <repository-url>
cd vite-tailwindv4

# Start all services
docker-compose up --build

# Stop services
docker-compose down
```

### Manual Development Setup

```bash
# Terminal 1: Python Backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py

# Terminal 2: Node.js Server
cd server
npm install
npm run dev

# Terminal 3: Vue.js Frontend
npm install
npm run dev
```

## Production Deployment

### 1. Docker Compose Production

```mermaid
graph TD
    subgraph "Production Stack"
        A[Nginx Reverse Proxy]
        B[Vue.js Static Files]
        C[Node.js Server]
        D[FastAPI Backend]
        E[PostgreSQL Database]
        F[Redis Cache]
    end
    
    A --> B
    A --> C
    C --> D
    D --> E
    D --> F
```

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
      - ./dist:/usr/share/nginx/html
    depends_on:
      - nodejs
    networks:
      - dashboard-network

  nodejs:
    build:
      context: ./server
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - PORT=3001
      - FASTAPI_URL=http://fastapi:8000
    networks:
      - dashboard-network

  fastapi:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/dashboard
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    networks:
      - dashboard-network

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=dashboard
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - dashboard-network

  redis:
    image: redis:7-alpine
    networks:
      - dashboard-network

volumes:
  postgres_data:

networks:
  dashboard-network:
    driver: bridge
```

### 2. Kubernetes Deployment

```mermaid
graph TD
    subgraph "Kubernetes Cluster"
        A[Ingress Controller]
        B[Frontend Service]
        C[API Service]
        D[Backend Service]
        E[Database StatefulSet]
        F[Redis Deployment]
        
        A --> B
        A --> C
        C --> D
        D --> E
        D --> F
    end
```

Example Kubernetes manifests structure:
```
k8s/
├── namespace.yaml
├── frontend/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── configmap.yaml
├── api/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── configmap.yaml
├── backend/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── secret.yaml
├── database/
│   ├── statefulset.yaml
│   ├── service.yaml
│   └── pvc.yaml
└── ingress.yaml
```

### 3. Cloud Platform Deployment

#### AWS Architecture

```mermaid
graph TD
    subgraph "AWS Infrastructure"
        A[Route 53]
        B[CloudFront CDN]
        C[S3 Static Files]
        D[ALB]
        E[ECS Fargate]
        F[RDS PostgreSQL]
        G[ElastiCache Redis]
    end
    
    A --> B
    B --> C
    A --> D
    D --> E
    E --> F
    E --> G
```

#### Google Cloud Platform

```mermaid
graph TD
    subgraph "GCP Infrastructure"
        A[Cloud DNS]
        B[Cloud CDN]
        C[Cloud Storage]
        D[Load Balancer]
        E[Cloud Run]
        F[Cloud SQL]
        G[Memorystore]
    end
    
    A --> B
    B --> C
    A --> D
    D --> E
    E --> F
    E --> G
```

## Environment Configuration

### Production Environment Variables

```bash
# Node.js Server (.env.production)
NODE_ENV=production
PORT=3001
FASTAPI_URL=http://backend:8000
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# FastAPI Backend
DATABASE_URL=postgresql://user:password@db:5432/dashboard
REDIS_URL=redis://redis:6379
SECRET_KEY=your-secret-key
ENVIRONMENT=production

# Vue.js Frontend
VITE_API_URL=https://api.yourdomain.com
VITE_APP_TITLE=Dashboard
```

## SSL/TLS Configuration

### Using Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Nginx SSL Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://nodejs:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Database Migration

### From Development to Production

```mermaid
sequenceDiagram
    participant Dev as Development
    participant Backup as Backup Process
    participant Prod as Production
    
    Dev->>Backup: Export data
    Backup->>Backup: Validate backup
    Backup->>Prod: Import data
    Prod->>Prod: Run migrations
    Prod->>Prod: Verify data
```

```bash
# Export from development
python manage.py export_data > backup.json

# Import to production
python manage.py import_data < backup.json

# Run migrations
alembic upgrade head
```

## Monitoring and Logging

### Monitoring Stack

```mermaid
graph TD
    A[Application] --> B[Prometheus]
    A --> C[Loki]
    B --> D[Grafana]
    C --> D
    D --> E[Alerts]
    
    F[Health Checks] --> G[Uptime Kuma]
```

### Recommended Monitoring Tools

1. **Application Monitoring**
   - Prometheus + Grafana
   - DataDog
   - New Relic

2. **Log Management**
   - ELK Stack (Elasticsearch, Logstash, Kibana)
   - Loki + Grafana
   - CloudWatch (AWS)

3. **Error Tracking**
   - Sentry
   - Rollbar
   - Bugsnag

## Backup Strategy

```mermaid
graph LR
    A[Daily Backups] --> B[Database Dumps]
    A --> C[File Backups]
    B --> D[S3/Cloud Storage]
    C --> D
    D --> E[7-day Retention]
    D --> F[Monthly Archives]
```

### Backup Script Example

```bash
#!/bin/bash
# backup.sh

# Variables
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
S3_BUCKET="s3://your-backup-bucket"

# Database backup
pg_dump $DATABASE_URL > $BACKUP_DIR/db_$DATE.sql

# Compress
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $BACKUP_DIR/db_$DATE.sql

# Upload to S3
aws s3 cp $BACKUP_DIR/backup_$DATE.tar.gz $S3_BUCKET/

# Clean old local backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

## Performance Optimization

### Frontend Optimization

```bash
# Build for production
npm run build

# Analyze bundle size
npm run build -- --report
```

### Caching Strategy

```mermaid
graph TD
    A[Client Request] --> B{Cache Check}
    B -->|Hit| C[Return Cached]
    B -->|Miss| D[Fetch from API]
    D --> E[Update Cache]
    E --> F[Return Response]
    
    G[Cache Layers]
    G --> H[Browser Cache]
    G --> I[CDN Cache]
    G --> J[Redis Cache]
    G --> K[Database Cache]
```

## Scaling Strategies

### Horizontal Scaling

```mermaid
graph LR
    A[Load Balancer] --> B[Node.js Instance 1]
    A --> C[Node.js Instance 2]
    A --> D[Node.js Instance N]
    
    B --> E[FastAPI Instance 1]
    C --> F[FastAPI Instance 2]
    D --> G[FastAPI Instance N]
    
    E --> H[(Database)]
    F --> H
    G --> H
```

### Auto-scaling Configuration

```yaml
# Kubernetes HPA example
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Security Checklist

- [ ] SSL/TLS certificates configured
- [ ] Environment variables secured
- [ ] Database credentials encrypted
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Security headers added
- [ ] Regular security updates
- [ ] Backup encryption enabled
- [ ] Access logs monitored
- [ ] Intrusion detection system

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check service is running
   - Verify port configuration
   - Check firewall rules

2. **CORS Errors**
   - Verify CORS configuration
   - Check allowed origins
   - Ensure credentials are handled

3. **Performance Issues**
   - Monitor resource usage
   - Check database queries
   - Review caching strategy

### Debug Commands

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f nodejs

# Enter container
docker exec -it <container_id> /bin/sh

# Test connectivity
curl http://localhost:3001/health

# Database connection
psql $DATABASE_URL -c "SELECT 1"
```