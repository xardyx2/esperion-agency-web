# Backend Dockerfile - Rust + Axum API
# Multi-stage build for production optimization

# Development stage
FROM rust:1.75 AS development

WORKDIR /app

# Install cargo-watch for hot reload
RUN cargo install cargo-watch

# Copy source code
COPY . .

# Expose port
EXPOSE 8080

# Start development with hot reload
CMD ["cargo", "watch", "-x", "run"]

# Build stage
FROM rust:1.75 AS build

WORKDIR /app

# Copy source code
COPY . .

# Build for production (optimized)
RUN cargo build --release

# Production stage
FROM debian:bookworm-slim AS production

WORKDIR /app

# Install ca-certificates for HTTPS
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy built binary
COPY --from=build /app/target/release/esperion-backend /app/esperion-backend

# Expose port
EXPOSE 8080

# Start the application
CMD ["./esperion-backend"]