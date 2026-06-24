#!/bin/bash
# Generates an index.html landing page listing all built branch apps
set -euo pipefail

DIST_ALL_DIR="${1:-/Users/adrian/work/DLNP_example-remote-app/dist-all}"
OUTPUT="${DIST_ALL_DIR}/index.html"

# Count apps
APP_COUNT=$(find "$DIST_ALL_DIR" -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')

cat > "$OUTPUT" << 'HEADER'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Metal Apps - Branch Index</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; }
    .header { background: linear-gradient(135deg, #1e293b, #334155); padding: 2rem; border-bottom: 1px solid #475569; }
    .header h1 { font-size: 2rem; font-weight: 700; color: #f8fafc; }
    .header p { color: #94a3b8; margin-top: 0.5rem; }
    .stats { display: flex; gap: 2rem; margin-top: 1rem; }
    .stat { background: #1e293b; padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid #334155; }
    .stat-value { font-size: 1.5rem; font-weight: 700; color: #38bdf8; }
    .stat-label { font-size: 0.75rem; color: #64748b; text-transform: uppercase; }
    .search { padding: 1rem 2rem; background: #1e293b; border-bottom: 1px solid #334155; }
    .search input { width: 100%; padding: 0.75rem 1rem; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #e2e8f0; font-size: 1rem; outline: none; }
    .search input:focus { border-color: #38bdf8; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; padding: 2rem; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 1.25rem; transition: all 0.2s; cursor: pointer; text-decoration: none; display: block; }
    .card:hover { border-color: #38bdf8; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(56, 189, 248, 0.15); }
    .card-title { font-weight: 600; color: #f8fafc; font-size: 0.95rem; word-break: break-all; }
    .card-path { color: #64748b; font-size: 0.8rem; margin-top: 0.25rem; font-family: monospace; }
    .card-badge { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 600; margin-top: 0.5rem; }
    .badge-main { background: #065f46; color: #6ee7b7; }
    .badge-dash { background: #1e3a5f; color: #7dd3fc; }
    .badge-remote { background: #4c1d95; color: #c4b5fd; }
    .badge-other { background: #78350f; color: #fbbf24; }
    .hidden { display: none; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Metal Apps - Branch Index</h1>
    <p>All branch deployments served from a single container</p>
    <div class="stats">
HEADER

echo "      <div class=\"stat\"><div class=\"stat-value\">${APP_COUNT}</div><div class=\"stat-label\">Total Apps</div></div>" >> "$OUTPUT"
echo "      <div class=\"stat\"><div class=\"stat-value\">$(date '+%Y-%m-%d %H:%M')</div><div class=\"stat-label\">Built At</div></div>" >> "$OUTPUT"

cat >> "$OUTPUT" << 'MIDDLE'
    </div>
  </div>
  <div class="search">
    <input type="text" id="searchBox" placeholder="Search branches..." oninput="filterCards()">
  </div>
  <div class="grid" id="appGrid">
MIDDLE

# Generate a card for each app directory
for dir in $(find "$DIST_ALL_DIR" -mindepth 1 -maxdepth 1 -type d | sort); do
    name=$(basename "$dir")

    # Determine badge type
    if [ "$name" = "main" ]; then
        badge_class="badge-main"
        badge_text="main"
    elif echo "$name" | grep -q "^dash"; then
        badge_class="badge-dash"
        badge_text="dashboard"
    elif echo "$name" | grep -q "^remote-app"; then
        badge_class="badge-remote"
        badge_text="remote-app"
    else
        badge_class="badge-other"
        badge_text="feature"
    fi

    cat >> "$OUTPUT" << CARD
    <a href="/${name}/" class="card" data-name="${name}">
      <div class="card-title">${name}</div>
      <div class="card-path">/${name}/</div>
      <span class="card-badge ${badge_class}">${badge_text}</span>
    </a>
CARD
done

cat >> "$OUTPUT" << 'FOOTER'
  </div>
  <script>
    function filterCards() {
      const query = document.getElementById('searchBox').value.toLowerCase();
      document.querySelectorAll('.card').forEach(card => {
        const name = card.dataset.name.toLowerCase();
        card.classList.toggle('hidden', !name.includes(query));
      });
    }
  </script>
</body>
</html>
FOOTER

echo "Generated landing page at $OUTPUT with $APP_COUNT apps"
