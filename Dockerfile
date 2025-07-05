FROM node:18-alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3001

LABEL maintainer="adrian@nstarxinc.com"
LABEL description="Example Module Federation Remote App - Vue.js"
LABEL version="1.0.0"

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/ || exit 1

CMD ["npm", "run", "dev"]
