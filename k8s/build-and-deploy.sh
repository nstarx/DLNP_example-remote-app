#!/bin/bash

# Build and deploy script for Kubernetes

set -e

echo "Building Docker images..."

# Build frontend image (using k8s specific Dockerfile)
echo "Building frontend..."
docker build -f Dockerfile.frontend.k8s -t dashboard-frontend:latest .

# Build Node.js server image
echo "Building Node.js server..."
docker build -f Dockerfile.nodejs -t dashboard-nodejs:latest .

# Build Python backend image
echo "Building Python backend..."
docker build -f Dockerfile.backend -t dashboard-backend:latest .

echo "All images built successfully!"

# If using kind, load images
if command -v kind &> /dev/null; then
    echo "Loading images into kind cluster..."
    kind load docker-image dashboard-frontend:latest
    kind load docker-image dashboard-nodejs:latest
    kind load docker-image dashboard-backend:latest
fi

echo "Applying Kubernetes manifests..."

# Apply ConfigMap first
kubectl apply -f k8s/configmap.yaml

# Apply Deployment
kubectl apply -f k8s/deployment.yaml

# Apply Service
kubectl apply -f k8s/service.yaml

echo "Deployment complete!"
echo ""
echo "Check deployment status:"
echo "  kubectl get pods -l app=dashboard"
echo "  kubectl get svc dashboard-service"
echo ""
echo "Access the application:"
echo "  kubectl port-forward svc/dashboard-service 8080:80"
echo "  Open http://localhost:8080"