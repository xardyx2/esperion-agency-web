# Runtime stage only - using pre-built binary
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates libssl-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy pre-built binary from local build
COPY target/release/esperion-backend /app/esperion-backend

# Set environment variables
ENV RUST_LOG=info
ENV HOST=0.0.0.0
ENV PORT=8080

EXPOSE 8080

CMD ["/app/esperion-backend"]
