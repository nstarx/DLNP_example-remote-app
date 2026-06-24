# Unified Multi-Branch Deployment

## Overview

All 95 git branches are built with unique basepaths and packaged into a **single Docker image**. Nginx reverse-proxies each branch's app at its own URL path.

**Image**: `nstarx.azurecr.io/metal_all:latest`
**Size**: ~35MB (nginx:1.25-alpine + all 95 static apps)

## Architecture

```
                    ┌─────────────────────────────────┐
                    │   nstarx.azurecr.io/metal_all    │
                    │                                   │
   GET /            │   → Landing page (app index)     │
   GET /main/       │   → main branch app              │
   GET /test/       │   → test branch app              │
   GET /hp1-.../    │   → hp1 branch app               │
   GET /dash-.../   │   → dashboard branch app         │
   GET /<branch>/   │   → any branch app               │
                    │                                   │
                    │   nginx:1.25-alpine               │
                    │   - CORS enabled (Module Fed)     │
                    │   - Gzip compression              │
                    │   - SPA fallback per branch       │
                    │   - Health check at /health       │
                    └─────────────────────────────────┘
```

## How It Works

1. Each branch is checked out via `git worktree`
2. Vite `base` config is injected as `/<sanitized-branch-name>/` (e.g., `base: '/main/'`)
3. `npm install` + `npm run build` produces static assets in `dist/`
4. All built assets are collected into `dist-all/<branch-name>/`
5. A single nginx Docker image serves everything

### Basepath Mapping

Branch names are sanitized for URLs:
- `feature/enhanced-data-science-dashboard` → `/feature-enhanced-data-science-dashboard/`
- `dash-20250707-12-50-00-1751881846` → `/dash-20250707-12-50-00-1751881846/`
- Slashes → dashes, special chars removed, lowercased

### Nginx Routing

```nginx
# Dynamic SPA routing - matches any /<branch>/ path
location ~ ^/([^/]+)/(.*)$ {
    try_files $uri $uri/ /$1/index.html;
}
```

Each branch's app was built with the correct `base` path, so all asset references (JS, CSS, images) resolve correctly.

## Running

```bash
# Run locally
docker run -p 8080:80 nstarx.azurecr.io/metal_all:latest

# Access
open http://localhost:8080/          # Landing page with all apps
open http://localhost:8080/main/     # Main branch
open http://localhost:8080/test/     # Test branch
```

## Build Results

| Status | Count | Details |
|--------|-------|---------|
| Success | 94 | Built with assets |
| Failed | 1 | `dash-20250728-18-20-56-1753716057-1753717520` (syntax error in source) |
| **Total** | **95** | |

### Successfully Built Apps (94)

| Branch | Basepath | Type |
|--------|----------|------|
| main | /main/ | main |
| add-mock-table | /add-mock-table/ | feature |
| claude-example-app-1754297954 | /claude-example-app-1754297954/ | feature |
| claude-example-app-1754298047 | /claude-example-app-1754298047/ | feature |
| claude-example-app-1754298119 | /claude-example-app-1754298119/ | feature |
| claude-example-app-1754298457 | /claude-example-app-1754298457/ | feature |
| claude-example-app-1754298713 | /claude-example-app-1754298713/ | feature |
| dash-1751815466 | /dash-1751815466/ | dashboard |
| dash-1751879368 | /dash-1751879368/ | dashboard |
| dash-1753797110 | /dash-1753797110/ | dashboard |
| dash-1754022545 | /dash-1754022545/ | dashboard |
| dash-1754573174 | /dash-1754573174/ | dashboard |
| dash-20250707-* (12 branches) | /dash-20250707-*/ | dashboard |
| dash-20250711-* | /dash-20250711-*/ | dashboard |
| dash-20250723-* | /dash-20250723-*/ | dashboard |
| dash-20250724-* | /dash-20250724-*/ | dashboard |
| dash-20250725-* (3 branches) | /dash-20250725-*/ | dashboard |
| dash-20250728-* (4 branches) | /dash-20250728-*/ | dashboard |
| dash-20250801-* | /dash-20250801-*/ | dashboard |
| dash-20250805-* | /dash-20250805-*/ | dashboard |
| dashboard-* (18 branches) | /dashboard-*/ | dashboard |
| dashh-1751818827 | /dashh-1751818827/ | dashboard |
| feature/enhanced-data-science-dashboard | /feature-enhanced-data-science-dashboard/ | feature |
| fifa-1752327052 | /fifa-1752327052/ | feature |
| hp1 through hp8 (9 branches) | /hp1-*/ through /hp8-*/ | feature |
| remote-app (16 branches) | /remote-app-*/ | remote-app |
| string-* (8 branches) | /string-*/ | feature |
| test | /test/ | feature |
| ttt-1752816624 | /ttt-1752816624/ | feature |

### Failed Build

| Branch | Reason |
|--------|--------|
| dash-20250728-18-20-56-1753716057-1753717520 | Babel parse error in `src/components/ai/AIQueryResultsModal.vue:81` - syntax error in source code |

## Project Files

| File | Purpose |
|------|---------|
| `Dockerfile` | Packages all built apps into nginx image |
| `nginx.docker.conf` | Nginx config with dynamic SPA routing + CORS |
| `.dockerignore` | Excludes node_modules, .git, etc. from Docker context |
| `scripts/build-branch.sh` | Builds a single branch (worktree + basepath injection + build) |
| `scripts/generate-landing-page.sh` | Generates index.html listing all apps with search |
| `scripts/docker-build-push.sh` | Orchestrates Docker build + push to ACR |
| `dist-all/` | All built branch outputs (gitignored) |
| `dist-all/index.html` | Landing page with searchable app index |

## Rebuilding

```bash
# Rebuild a single branch
bash scripts/build-branch.sh "branch-name" "$(pwd)" "$(pwd)/dist-all" "/tmp/metal-logs"

# Rebuild all branches (14 parallel workers)
cat /tmp/metal-all-branches.txt | xargs -P14 -I{} bash scripts/build-branch.sh "{}" "$(pwd)" "$(pwd)/dist-all" "/tmp/metal-logs"

# Regenerate landing page
bash scripts/generate-landing-page.sh dist-all

# Build and push Docker image
bash scripts/docker-build-push.sh latest
```

## Module Federation Integration

Each branch app exposes its components for Module Federation. From a host application:

```javascript
// Point to the specific branch version
remotes: {
  analyticsDashboard: 'analyticsDashboard@http://<host>/<branch-name>/assets/remoteEntry.js'
}
```

## Key Technical Details

- **CORS**: Fully enabled for cross-origin Module Federation access
- **Gzip**: All text-based assets compressed
- **Caching**: Static assets get `Cache-Control: public, immutable` with 1-year expiry
- **Health Check**: `GET /health` returns 200 OK
- **Platform**: Built for `linux/amd64`
- **Base image**: `nginx:1.25-alpine` (minimal footprint)
- **vue-router**: Auto-installed as dependency (required by `@module-federation/bridge-vue3`)
