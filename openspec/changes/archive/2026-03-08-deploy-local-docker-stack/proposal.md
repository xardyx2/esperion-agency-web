## Why

Local Docker development is supposed to be the fastest way to run Esperion end-to-end, but the current setup mixes stale documentation, inconsistent version claims, and partially aligned development defaults. We need a single verified local deployment path that always starts the correct three containers - Nuxt frontend, Rust/Axum backend, and SurrealDB - with working hot reload and configuration that matches the codebase.

## What Changes

- Define a single local Docker development workflow that starts exactly three services: `frontend`, `backend`, and `database`.
- Align Docker configuration with the runtime truth for this repo: Nuxt 3 frontend, Axum backend, and SurrealDB 1.5.x compatible with the Rust SDK in `backend/Cargo.toml`.
- Require verified hot reload behavior for frontend and backend development, including Docker Desktop-friendly file watching behavior where needed.
- Clarify host and container port mappings, service-to-service networking, and environment-variable responsibilities for both in-container and host-based workflows.
- Require the local database service to use persistent storage semantics when the stack is described as persistent, or explicitly document when a memory-only mode is intentional.
- Update local deployment docs and OpenSpec references so they describe the same development topology that developers actually run.

## Capabilities

### New Capabilities
- `local-docker-deployment`: Defines the expected local Docker development topology, service contracts, hot reload behavior, persistence expectations, and verification steps for the 3-container stack.

### Modified Capabilities
- None.

## Impact

- Affected files are expected in `docker-compose.yml`, `frontend/Dockerfile.dev`, `frontend/Dockerfile`, `backend/Dockerfile`, root and backend env templates, and Docker-related documentation.
- Verification will depend on the local Docker toolchain being able to build and run three services with reachable endpoints and hot reload.
- This change impacts frontend/backend developer workflow, local database behavior, and any documentation that currently claims outdated Nuxt or SurrealDB versions.
