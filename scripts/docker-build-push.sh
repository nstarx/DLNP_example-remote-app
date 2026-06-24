#!/bin/bash
# Build unified Docker image with all branch apps and push to ACR
set -euo pipefail

REPO_DIR="/Users/adrian/work/DLNP_example-remote-app"
IMAGE_NAME="nstarx.azurecr.io/metal_all"
IMAGE_TAG="${1:-latest}"
FULL_IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"

echo "============================================"
echo "Building unified Docker image"
echo "Image: ${FULL_IMAGE}"
echo "Time: $(date)"
echo "============================================"

cd "$REPO_DIR"

# Generate landing page
echo "[DOCKER] Generating landing page..."
bash scripts/generate-landing-page.sh "$REPO_DIR/dist-all"

# Count built apps
APP_COUNT=$(find dist-all -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')
echo "[DOCKER] Found ${APP_COUNT} built apps"

# Build Docker image
echo "[DOCKER] Building image..."
docker build \
    --platform linux/amd64 \
    -t "$FULL_IMAGE" \
    -t "${IMAGE_NAME}:$(date +%Y%m%d-%H%M%S)" \
    -f Dockerfile \
    .

echo "[DOCKER] Image built successfully"
docker images "$IMAGE_NAME"

# Push to ACR
echo "[DOCKER] Pushing to ACR..."
docker push "$FULL_IMAGE"
docker push "${IMAGE_NAME}:$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true

echo "============================================"
echo "[DOCKER] DONE"
echo "Image: ${FULL_IMAGE}"
echo "Apps: ${APP_COUNT}"
echo "Time: $(date)"
echo "============================================"
