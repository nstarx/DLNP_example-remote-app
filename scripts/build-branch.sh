#!/bin/bash
# Build a single branch with a unique basepath
# Usage: ./build-branch.sh <branch-name> <repo-dir> <output-base-dir>
set -euo pipefail

BRANCH="$1"
REPO_DIR="$2"
DIST_ALL_DIR="$3"
LOG_DIR="${4:-/tmp/metal-logs}"

# Sanitize branch name for filesystem/docker use
SANITIZED=$(echo "$BRANCH" | tr '/' '-' | tr -cd 'a-zA-Z0-9._-' | tr '[:upper:]' '[:lower:]')
BASE_PATH="/${SANITIZED}/"
WORKTREE_DIR="/tmp/metal-wt-${SANITIZED}"
OUTPUT_DIR="${DIST_ALL_DIR}/${SANITIZED}"
LOG_FILE="${LOG_DIR}/${SANITIZED}.log"

mkdir -p "$LOG_DIR" "$OUTPUT_DIR"

{
echo "=========================================="
echo "[BUILD] Branch: $BRANCH"
echo "[BUILD] Sanitized: $SANITIZED"
echo "[BUILD] Base path: $BASE_PATH"
echo "[BUILD] Worktree: $WORKTREE_DIR"
echo "[BUILD] Output: $OUTPUT_DIR"
echo "[BUILD] Started: $(date)"
echo "=========================================="

# Cleanup any stale worktree
git -C "$REPO_DIR" worktree remove "$WORKTREE_DIR" --force 2>/dev/null || true
rm -rf "$WORKTREE_DIR"

# Create worktree
if ! git -C "$REPO_DIR" worktree add "$WORKTREE_DIR" "origin/$BRANCH" --detach 2>&1; then
    echo "[BUILD] ERROR: Failed to create worktree for $BRANCH"
    echo "<html><body><h1>$BRANCH</h1><p>Failed to checkout branch</p></body></html>" > "$OUTPUT_DIR/index.html"
    exit 0
fi

cd "$WORKTREE_DIR"

# Install dependencies
echo "[BUILD] Installing dependencies..."
if ! npm install --legacy-peer-deps 2>&1; then
    echo "[BUILD] Retrying npm install without --legacy-peer-deps..."
    npm install 2>&1 || true
fi

# Install vue-router (required by @module-federation/bridge-vue3 but often missing)
npm install vue-router --legacy-peer-deps 2>&1 || npm install vue-router 2>&1 || true

# Detect build tool and inject basepath
if [ -f vite.config.js ]; then
    echo "[BUILD] Detected: Vite (JS config)"
    if grep -q "defineConfig" vite.config.js; then
        sed -i '' "s|defineConfig({|defineConfig({ base: '${BASE_PATH}',|" vite.config.js
    else
        # Fallback: prepend base config
        echo "// Auto-injected basepath" > /tmp/vite-base-${SANITIZED}.js
        sed -i '' "1s|^|// base: '${BASE_PATH}' injected\n|" vite.config.js
    fi
elif [ -f vite.config.ts ]; then
    echo "[BUILD] Detected: Vite (TS config)"
    sed -i '' "s|defineConfig({|defineConfig({ base: '${BASE_PATH}',|" vite.config.ts
elif [ -f webpack.config.js ]; then
    echo "[BUILD] Detected: Webpack"
    if grep -q "output:" webpack.config.js; then
        sed -i '' "s|output: {|output: { publicPath: '${BASE_PATH}',|" webpack.config.js
    fi
else
    echo "[BUILD] WARNING: No recognized build config found"
fi

# Build
echo "[BUILD] Building..."
npm run build 2>&1 || npx vite build 2>&1 || true

# Copy build output
if [ -d dist ] && [ "$(ls -A dist 2>/dev/null)" ]; then
    cp -r dist/* "$OUTPUT_DIR/"
    echo "[BUILD] SUCCESS: Copied dist/ to $OUTPUT_DIR"
elif [ -d build ] && [ "$(ls -A build 2>/dev/null)" ]; then
    cp -r build/* "$OUTPUT_DIR/"
    echo "[BUILD] SUCCESS: Copied build/ to $OUTPUT_DIR"
else
    echo "[BUILD] WARNING: No build output for $BRANCH"
    cat > "$OUTPUT_DIR/index.html" << HTMLEOF
<!DOCTYPE html>
<html><head><title>$BRANCH</title></head>
<body style="font-family:sans-serif;padding:2rem">
<h1>$BRANCH</h1>
<p>Build output not available. Check build logs.</p>
</body></html>
HTMLEOF
fi

# Cleanup worktree
cd /
git -C "$REPO_DIR" worktree remove "$WORKTREE_DIR" --force 2>/dev/null || true

echo "[BUILD] Completed: $BRANCH at $(date)"
} 2>&1 | tee "$LOG_FILE"
