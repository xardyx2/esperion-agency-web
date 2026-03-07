# Development stage with cargo-watch for hot reload
FROM rust:1.80-alpine AS development

RUN apk add --no-cache \
    musl-dev \
    openssl-dev \
    pkgconfig \
    python3

WORKDIR /app

# Install cargo-watch
RUN cargo install cargo-watch

# Copy manifest first for better caching
COPY Cargo.toml Cargo.lock ./

# Create a dummy main.rs to enable caching of dependencies
RUN mkdir src && echo "fn main() { println!(\"Dummy build for caching\"); }" > src/main.rs

# Install dependencies
RUN cargo build --release || true

# Now copy the actual source code
COPY . .

# Remove the dummy files if they exist and copy actual src
RUN rm -rf src && mkdir src
COPY src ./src

# Build and cache the application
RUN cargo build --release

# Expose port for development
EXPOSE 8080

# Use cargo watch for development with hot reload
CMD ["cargo", "watch", "-s", "cargo run"]

# Build stage
FROM rust:1.80-alpine AS build

RUN apk add --no-cache \
    musl-dev \
    openssl-dev \
    pkgconfig

WORKDIR /app

# Copy manifests
COPY Cargo.toml Cargo.lock ./

# Copy source code
COPY . .

# Build for release
RUN cargo build --release

# Production stage
FROM debian:bookworm-slim AS production

RUN apt-get update && apt-get install -y ca-certificates libssl-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built binary from build stage
COPY --from=build /app/target/release/esperion-backend /app/esperion-backend

# Set production environment variables
ENV RUST_LOG=info
ENV HOST=0.0.0.0
ENV PORT=8080

EXPOSE 8080

# Run in production mode
CMD ["/app/esperion-backend"]

# Legacy stage for backward compatibility
FROM production AS latest
