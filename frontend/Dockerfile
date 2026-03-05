# Frontend Dockerfile - Nuxt 4 Application
# Multi-stage build for production optimization

# Development stage
FROM node:20-alpine AS development

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]

# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build for production
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Set environment
ENV NODE_ENV=production

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy built application
COPY --from=build /app/.output /app/.output

# Expose port
EXPOSE 3000

# Start production server
CMD ["node", ".output/server/index.mjs"]