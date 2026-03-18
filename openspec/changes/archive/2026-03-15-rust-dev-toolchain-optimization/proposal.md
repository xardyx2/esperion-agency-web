# Proposal: Rust Development Toolchain Optimization

## Why

Rust cold builds currently take ~28 minutes due to sequential linking and lack of dependency caching. Developer productivity suffers from slow rebuild cycles during active development. We need to implement a toolchain that combines cargo-watch for hot reload, cargo-chef for Docker layer caching, and mold linker for parallel linking to achieve 10x faster rebuilds without breaking existing workflows.

## What Changes

- **Integrate lld linker**: Replace default ld linker with lld (2x faster linking, compatible with Alpine)
- **Implement cargo-chef**: Add Docker layer caching for Rust dependencies to enable 95% faster rebuilds
- **Configure cargo-watch integration**: Ensure hot reload compatibility with cargo-chef and lld
- **Update backend/Dockerfile**: Multi-stage build with chef-planner, chef-builder, and runtime stages (Alpine-based)
- **Add lld installation**: Install lld in development and CI Docker images (Alpine package)
- **Fix health check issues**: Resolve container unhealthy status while maintaining functionality
- **Address dead code warnings**: Cleanup 88 compiler warnings (32 duplicates) for cleaner build output
- **Document toolchain workflow**: Clear guide for developers on how the three tools work together

## Capabilities

### New Capabilities
- `lld-linker-integration`: Install and configure lld as the linker for Rust builds (Alpine-compatible)
- `cargo-chef-caching`: Implement Docker layer caching for Rust dependencies
- `hot-reload-optimization`: Maintain cargo-watch hot reload with optimized build pipeline
- `health-check-fix`: Resolve container health check false positives
- `build-warning-cleanup`: Address dead code warnings for cleaner build output

### Modified Capabilities
- None (this is a build optimization with no API or requirement changes)

## Impact

- **backend/Dockerfile**: Complete rewrite with multi-stage cargo-chef + lld (Alpine-based)
- **Cargo.toml**: Add lld linker configuration for development profile; cleanup dead code dependencies
- **docker-compose.yml**: Update build context, volume mounts for chef caching, and fix health checks
- **Backend source files**: Cleanup dead code causing 88 warnings (middleware, db, services modules)
- **CI/CD**: Faster builds due to dependency layer caching
- **Developer experience**: 2x faster linking, 95% faster rebuilds on code-only changes, cleaner build output
