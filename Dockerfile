# Unified Docker image serving all branch apps via nginx
# All pre-built branch outputs are in dist-all/<branch-name>/
# nginx routes /<branch-name>/ to the corresponding app

FROM nginx:1.25-alpine

# Copy all branch builds (pre-built on host)
COPY dist-all/ /usr/share/nginx/html/

# Copy landing page
COPY dist-all/index.html /usr/share/nginx/html/index.html

# Copy nginx config
COPY nginx.docker.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
