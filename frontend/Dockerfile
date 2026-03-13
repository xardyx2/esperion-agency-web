# Frontend Dockerfile - Nuxt 4 application with Bun
# Multi-stage build for production optimization

# Stage 1: Dependencies with Bun
FROM oven/bun:1-alpine AS deps
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Stage 2: Development
FROM oven/bun:1-alpine AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run postinstall || true
EXPOSE 3000
CMD ["bun", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

# Stage 3: Build
FROM oven/bun:1-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Stage 4: Production (using Node.js for runtime stability)
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]

# Legacy stage for backward compatibility
FROM production AS latest
