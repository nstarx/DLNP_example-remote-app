# Kubernetes Deployment for Dashboard Application

This directory contains Kubernetes manifests for deploying the dashboard application to a Kubernetes cluster, with specific support for Kind (Kubernetes in Docker).

## Directory Structure

```
k8s/
├── base/                    # Base Kubernetes manifests
│   ├── namespace.yaml      # Dashboard namespace
│   ├── deployment.yaml     # Main deployment
│   ├── service.yaml        # ClusterIP service
│   ├── ingress.yaml        # Ingress configuration
│   └── kustomization.yaml  # Kustomize base configuration
└── overlays/               # Environment-specific overlays
    └── kind/               # Kind-specific configuration
        ├── kustomization.yaml     # Kind overlay
        ├── deployment-patch.yaml  # Deployment modifications
        └── service-patch.yaml     # NodePort service patch
```

## Prerequisites

- Docker installed and running
- Access to `nuc13.local` machine via SSH
- Kind cluster running on `nuc13.local`
- kubectl configured on `nuc13.local`
- Local Docker registry running on port 5001 (script will start if needed)

## Deployment Process

### Automated Deployment to Kind on nuc13.local

Use the provided deployment script from the project root:

```bash
./deploy-to-kind.sh
```

This script will:
1. Build the Docker image locally
2. Tag and push to local registry (localhost:5001)
3. Copy manifests to nuc13.local
4. Load the image into Kind cluster
5. Apply Kubernetes manifests
6. Wait for deployment to be ready

### Manual Deployment Steps

If you prefer to deploy manually:

```bash
# 1. Build the image
docker build -f Dockerfile.all-in-one -t dashboard-app:latest .

# 2. Tag for local registry
docker tag dashboard-app:latest localhost:5001/dashboard-app:latest

# 3. Push to local registry
docker push localhost:5001/dashboard-app:latest

# 4. On nuc13.local, load image into Kind
kind load docker-image localhost:5001/dashboard-app:latest --name kind

# 5. Apply manifests
kubectl apply -k k8s/overlays/kind/

# 6. Check deployment status
kubectl -n dashboard get pods
kubectl -n dashboard get svc
```

## Accessing the Application

After deployment, the dashboard will be available at:
- **NodePort**: http://nuc13.local:30080
- **Ingress**: http://dashboard.local (requires ingress controller)

## Configuration Details

### Base Configuration
- **Namespace**: `dashboard`
- **Replicas**: 1
- **Service Type**: ClusterIP
- **Container Port**: 80
- **Resource Limits**: 512Mi memory, 500m CPU

### Kind Overlay Modifications
- **Service Type**: Changed to NodePort
- **NodePort**: 30080
- **Image Pull Policy**: Always
- **Image Registry**: localhost:5001

## Health Checks

The deployment includes:
- **Liveness Probe**: HTTP GET /health (30s initial delay, 10s period)
- **Readiness Probe**: HTTP GET /health (10s initial delay, 5s period)

## Troubleshooting

### Check Pod Status
```bash
kubectl -n dashboard get pods
kubectl -n dashboard describe pod dashboard-xxxxx
```

### View Logs
```bash
kubectl -n dashboard logs deployment/dashboard
```

### Check Service
```bash
kubectl -n dashboard get svc
kubectl -n dashboard describe svc dashboard
```

### Test Connectivity
```bash
# From nuc13.local
curl http://localhost:30080/health

# From your local machine
curl http://nuc13.local:30080/health
```

### Common Issues

1. **Image Pull Errors**: Ensure local registry is running and accessible
2. **Pod CrashLoopBackOff**: Check logs for startup errors
3. **Service Not Accessible**: Verify NodePort is not blocked by firewall
4. **SSH Connection Failed**: Check SSH keys and connectivity to nuc13.local

## Updating the Application

To update the deployed application:

```bash
# Rebuild and redeploy
./deploy-to-kind.sh

# Or trigger a rollout restart
kubectl -n dashboard rollout restart deployment/dashboard
```

## Cleanup

To remove the deployment:

```bash
kubectl delete -k k8s/overlays/kind/
```