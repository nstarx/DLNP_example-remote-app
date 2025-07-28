# Multi-stage build for optimal production image
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

RUN apk add --no-cache curl

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy necessary source files for serving
COPY --from=builder /app/public ./public
COPY --from=builder /app/vite.config.js ./vite.config.js

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Set proper permissions
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3001

LABEL maintainer="ai-team@vertafore.com"
LABEL description="AI-Native Insurance Dashboard - Vue.js Micro-frontend"
LABEL version="2.0.0"

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://0.0.0.0:3001/ || exit 1

# Use production serve command
CMD ["npm", "run", "serve"]
