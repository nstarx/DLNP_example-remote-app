#!/bin/bash

set -e

echo "Dashboard Deployment to Kind on nuc13.local"
echo "==========================================="

# Configuration
REMOTE_HOST="nuc13.local"
IMAGE_NAME="dashboard-app"
IMAGE_TAG="latest"
KIND_CLUSTER_NAME="kind"
ACR_REGISTRY="nstarx.azurecr.io"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build the Docker image locally
print_status "Building Docker image..."
docker build -f Dockerfile.all-in-one -t ${IMAGE_NAME}:${IMAGE_TAG} .

# Tag for ACR
print_status "Tagging image for Azure Container Registry..."
docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${ACR_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}

# Push to ACR
print_status "Pushing image to Azure Container Registry..."
docker push ${ACR_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}

# Check SSH connectivity to remote host
print_status "Checking SSH connectivity to ${REMOTE_HOST}..."
if ! ssh -o ConnectTimeout=5 ${REMOTE_HOST} "echo 'SSH connection successful'" > /dev/null 2>&1; then
    print_error "Cannot connect to ${REMOTE_HOST} via SSH. Please check your SSH configuration."
    exit 1
fi

# Create deployment script to run on remote host
cat > /tmp/deploy-on-kind.sh << 'EOF'
#!/bin/bash

set -e

IMAGE_NAME="dashboard-app"
IMAGE_TAG="latest"
KIND_CLUSTER_NAME="kind"
ACR_REGISTRY="nstarx.azurecr.io"

echo "Deploying to Kind cluster..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "kubectl not found on remote host"
    exit 1
fi

# Check if kind cluster exists
if ! kind get clusters | grep -q "^${KIND_CLUSTER_NAME}$"; then
    echo "Kind cluster '${KIND_CLUSTER_NAME}' not found"
    exit 1
fi

# Set kubectl context to kind cluster
kubectl config use-context kind-${KIND_CLUSTER_NAME}

# Apply Kubernetes manifests using kustomize
echo "Applying Kubernetes manifests..."
cd /tmp/k8s
kubectl apply -k overlays/kind/

# Wait for deployment to be ready
echo "Waiting for deployment to be ready..."
kubectl -n claude-test rollout status deployment/dashboard --timeout=300s

# Get service information
echo ""
echo "Deployment successful!"
echo ""
kubectl -n claude-test get pods
echo ""
kubectl -n claude-test get svc
echo ""
echo "Access the dashboard at: http://$(hostname -I | awk '{print $1}'):30080"
echo ""
EOF

# Copy deployment script to remote host
print_status "Copying deployment script to ${REMOTE_HOST}..."
scp /tmp/deploy-on-kind.sh ${REMOTE_HOST}:/tmp/
ssh ${REMOTE_HOST} "chmod +x /tmp/deploy-on-kind.sh"

# Copy k8s manifests to remote host
print_status "Copying Kubernetes manifests to ${REMOTE_HOST}..."
ssh ${REMOTE_HOST} "rm -rf /tmp/k8s && mkdir -p /tmp/k8s"
scp -r k8s/* ${REMOTE_HOST}:/tmp/k8s/

# Execute deployment on remote host
print_status "Executing deployment on ${REMOTE_HOST}..."
ssh ${REMOTE_HOST} "/tmp/deploy-on-kind.sh"

# Cleanup
rm -f /tmp/deploy-on-kind.sh

print_status "Deployment complete!"
echo ""
echo "To access the dashboard from your local machine:"
echo "1. Add '${REMOTE_HOST}' to your /etc/hosts file if not already present"
echo "2. Access http://${REMOTE_HOST}:30080 in your browser"
echo ""
echo "To check the deployment status:"
echo "ssh ${REMOTE_HOST} 'kubectl -n claude-test get pods'"
