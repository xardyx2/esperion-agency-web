# Design: Rust Development Toolchain Optimization

## Context

### Current State
Rust backend builds take **27m 59s** for cold builds (confirmed from logs) due to:
- **Sequential linking**: Default GNU ld linker processes object files one-by-one (single-threaded)
- **No dependency caching**: Every `docker-compose up --build` recompiles all dependencies from scratch
- **Compiler warnings**: 88 warnings (32 duplicates) about dead code clutter build output
- **Health check issues**: Containers marked "unhealthy" despite application running correctly
- **Developer friction**: 30-second iteration cycles kill productivity during active development

### Existing Infrastructure
- **Base Image**: `rustlang/rust:nightly-alpine` (Alpine Linux based, not Debian)
- **Development**: `cargo-watch` monitors file changes and triggers recompilation with `--poll` flag
- **Docker**: Multi-stage build in `backend/Dockerfile` with development, build, and production stages
- **Hot reload**: Working via `cargo-watch` with volume mounts for live code sync

### Target State
Implement a three-stage optimization pipeline that works together without conflicts:
1. **mold**: 10x faster linking via parallel I/O and lock-free data structures
2. **cargo-chef**: Separate dependency compilation from app code using Docker layer caching
3. **cargo-watch**: Maintain hot reload functionality in development containers

## Goals / Non-Goals

**Goals:**
- Reduce cold build time from 28 minutes to under 10 minutes (target: ~8 min with cargo-chef caching)
- Reduce incremental build time from 30 seconds to under 5 seconds (target: ~3 sec with mold)
- Maintain hot reload functionality for developer experience
- Ensure CI/CD builds benefit from dependency layer caching
- **Fix health check false positives**: Container should report healthy when app is running
- **Cleanup dead code warnings**: Reduce 88 warnings to under 20 (address or suppress intentional dead code)
- Document clear workflow for developers

**Non-Goals:**
- Replace `cargo-watch` (it stays for development)
- Modify application code behavior or API responses
- Change database schema or SurrealDB configuration
- Optimize frontend build process (separate concern)
- Production deployment changes (this is dev optimization)
- **Comprehensive dead code removal** (only suppress or address obvious cases)

## Decisions

### 1. Use mold linker instead of lld or default ld
**Rationale:**
- mold is 10x faster than GNU ld and 2x faster than LLVM lld
- Uses parallel I/O and lock-free data structures
- Used in production by Qdrant (29K GitHub stars)
- Supports all major platforms (Linux, macOS, Windows via WSL2)

**Alternative considered:** lld (LLVM linker)
- Rejected: lld is fast but mold is demonstrably faster in benchmarks
- lld is good default for most projects, but mold is optimized specifically for linking speed

### 2. Alpine-based approach for mold installation
**Rationale:**
- Current Dockerfile uses `rustlang/rust:nightly-alpine` (Alpine Linux musl-based)
- mold is not available in Alpine package manager (apk) by default
- Must download and install mold precompiled binary manually
- Alpine images are smaller but require different approach than Debian-based

**Implementation:**
```dockerfile
# Download mold precompiled binary for Alpine/musl
RUN wget -O- https://github.com/rui314/mold/releases/download/v2.4.0/mold-2.4.0-x86_64-linux.tar.gz | tar -xz -C /usr/local --strip-components=1
# Create symlink for clang compatibility
RUN ln -sf /usr/local/bin/mold /usr/local/bin/ld.mold
```

**Alternative considered:** Switch to Debian-based image
- Rejected: Current setup optimized for Alpine; switching base image is higher risk
- Alpine provides smaller image size and is already working

### 3. Use cargo-chef with multi-stage Docker builds
**Rationale:**
- Separates "cook dependencies" stage from "build app" stage
- Dependencies are cached in Docker layer and only rebuild when Cargo.toml/Cargo.lock changes
- Code-only changes skip dependency rebuild (95% faster)
- Used in production by many Rust projects

**Architecture:**
```
Stage 1: chef-planner
  - Generate recipe.json from Cargo.toml/Cargo.lock
  
Stage 2: chef-builder
  - Install mold
  - COPY recipe.json
  - RUN cargo chef cook (cached layer)
  - COPY source code
  - RUN cargo build (only rebuilds app code)
  
Stage 3: runtime
  - Install cargo-watch for development
  - Use compiled binary from builder
  - CMD cargo watch -x run
```

**Alternative considered:** sccache
- Rejected: sccache caches compiler outputs but doesn't separate dependency layers
- sccache is better for CI where multiple builds share cache, less effective for local Docker

### 3. Three-stage workflow for different scenarios

**Stage 1: Local Development (without Docker)**
- Developer has mold installed locally
- cargo-watch monitors files and recompiles with mold
- Fastest iteration for pure code changes

**Stage 2: Docker Fresh Build (CI or new developer)**
- cargo-chef caches dependencies in Docker layer
- mold links the final binary
- ~8 min cold build vs 28 min original

**Stage 3: Docker Development (hot reload)**
- Use pre-built image with dependencies cached
- cargo-watch inside container monitors volume-mounted code
- mold handles linking in container
- ~3 sec rebuild on code changes

### 5. Health check fix approach
**Current Issue:**
- Container marked "unhealthy" despite application running correctly
- Health check likely failing due to wget not available in Alpine image
- Port 8080 is listening but health probe cannot verify

**Solution:**
- Update docker-compose.yml health check to use proper command
- Alternative: Add wget/curl to Alpine image or use TCP socket check
- Keep application functionality unchanged

### 6. Dead code warning cleanup approach
**Current State:**
- 88 warnings total, 32 duplicates
- Categories: unused functions, structs, methods, enum variants
- Files affected: middleware/mod.rs, db/mod.rs, db/schema.rs, services/email.rs, services/image_processor.rs, errors.rs

**Strategy:**
- **Suppress**: Add `#[allow(dead_code)]` to intentionally unused but reserved code
- **Address**: Remove truly unused code (e.g., unused error variants)
- **Document**: Comment why certain code is kept despite being unused
- Target: Reduce to under 20 warnings (focus on non-duplicate, meaningful warnings)

## Implementation Architecture

### File Structure Changes
```
backend/
├── Dockerfile              # Updated: multi-stage with chef + mold
├── Cargo.toml              # Unchanged
├── .cargo/
│   └── config.toml         # NEW: mold linker configuration
└── src/
    └── ...                 # Unchanged

docker-compose.yml          # Updated: build target and volumes
docker-compose.override.yml # NEW: dev-specific overrides (optional)
```

### Dockerfile Multi-Stage

**Stage 1: Planner**
```dockerfile
FROM lukemathwalker/cargo-chef:latest-rust-1 AS chef
WORKDIR /app

FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json
```

**Stage 2: Builder with Mold**
```dockerfile
FROM chef AS builder

# Install mold (fast linker)
RUN apt-get update && apt-get install -y mold clang && rm -rf /var/lib/apt/lists/*

# Configure cargo to use mold
ENV CARGO_TARGET_X86_64_UNKNOWN_LINUX_GNU_LINKER=clang
ENV RUSTFLAGS="-C link-arg=-fuse-ld=mold"

# Cook dependencies (cached layer)
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json

# Build application
COPY . .
RUN cargo build --release --bin esperion-backend
```

**Stage 3: Development Runtime**
```dockerfile
FROM rust:1-slim AS development

# Install mold and cargo-watch
RUN apt-get update && apt-get install -y mold clang && rm -rf /var/lib/apt/lists/*
RUN cargo install cargo-watch

# Configure mold
ENV CARGO_TARGET_X86_64_UNKNOWN_LINUX_GNU_LINKER=clang
ENV RUSTFLAGS="-C link-arg=-fuse-ld=mold"

WORKDIR /app
COPY --from=builder /app/target/release/esperion-backend /usr/local/bin/
COPY . .

EXPOSE 8080
CMD ["cargo", "watch", "-x", "run"]
```

### Cargo Configuration (.cargo/config.toml)
```toml
[target.x86_64-unknown-linux-gnu]
linker = "clang"
rustflags = ["-C", "link-arg=-fuse-ld=mold"]

[profile.dev]
# Keep debug info for development
debug = true
# Don't optimize for faster compile times
opt-level = 0
```

### docker-compose.yml Updates
```yaml
services:
  backend:
    build:
      context: ./backend
      target: development  # Use dev stage for hot reload
    volumes:
      - ./backend:/app
      - cargo-cache:/usr/local/cargo/registry
      - target-cache:/app/target
    environment:
      - CARGO_TARGET_X86_64_UNKNOWN_LINUX_GNU_LINKER=clang
      - RUSTFLAGS=-C link-arg=-fuse-ld=mold
    # ... rest unchanged

volumes:
  cargo-cache:
  target-cache:
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| mold installation fails in Alpine environment | Use precompiled binary from GitHub releases; test mold availability after install |
| cargo-chef doesn't support all Cargo features | Test with project's workspace configuration; use `--workspace` flag if needed |
| Docker layer cache invalidation too aggressive | Use BuildKit mount caching in addition to layer caching |
| Developer confusion about which tool does what | Document clear workflow: local dev vs Docker fresh build vs Docker hot reload |
| Increased Dockerfile complexity | Add comments explaining each stage; maintain original Dockerfile as backup |
| mold not available on Windows native | Document WSL2 requirement for Windows developers |
| Dead code cleanup may break future features | Only suppress warnings with `#[allow(dead_code)]`, don't delete potentially useful code |
| Health check fix may not work in all environments | Test health check with both wget and TCP socket fallback |

## Migration Plan

### Phase 1: Preparation (No downtime)
1. Create backup of current `backend/Dockerfile`
2. Create `.cargo/config.toml` with mold configuration
3. Update `docker-compose.yml` with build target and cache volumes
4. Test locally: `docker-compose build --no-cache backend`

### Phase 2: Implementation
1. Replace `backend/Dockerfile` with multi-stage version (Alpine + mold + cargo-chef)
2. Add mold installation using precompiled binary approach
3. Configure cargo-chef stages
4. Fix docker-compose.yml health check configuration
5. Address dead code warnings (add `#[allow(dead_code)]` or remove unused code)
6. Verify build succeeds: `docker-compose up --build`

### Phase 3: Validation
1. Measure cold build time (target: <10 min)
2. Test hot reload: edit file, verify rebuild time (target: <5 sec)
3. Test dependency caching: change code only, verify no dependency rebuild
4. Test dependency change: update Cargo.toml, verify dependency rebuild
5. Verify health check reports "healthy" status
6. Verify warning count reduced from 88 to under 20

### Phase 4: Documentation
1. Update README with new build workflow
2. Document tool interactions for developers
3. Add troubleshooting section for common issues

### Rollback Strategy
- Restore original `backend/Dockerfile` from backup
- Remove `.cargo/config.toml`
- Revert `docker-compose.yml` changes
- No data migration required (build optimization only)

## Open Questions

1. **BuildKit required?** cargo-chef works best with BuildKit enabled. Need to verify if our Docker Compose setup has BuildKit by default or needs `DOCKER_BUILDKIT=1`.

2. **Workspace support?** If the backend becomes a Cargo workspace, does cargo-chef handle it correctly? Current project is single-crate, but should document workspace configuration if needed.

3. **CI integration?** GitHub Actions and other CI systems may need specific cache configuration. Should document CI caching strategy separately.

4. **Binary size impact?** mold may produce slightly different binary sizes. Need to verify release binary size is acceptable.

## Success Metrics

| Metric | Before | Target | How to Measure |
|--------|--------|--------|----------------|
| Cold build time | 27m 59s | <10 min | `time docker-compose build --no-cache backend` |
| Incremental build | ~30 sec | <5 sec | Edit file, measure recompile time |
| Dependency rebuild | Every time | Only on Cargo.toml change | Update source file, verify no dep rebuild |
| Hot reload functional | ✅ | ✅ | Edit handler, verify auto-restart |
| Container health | Unhealthy | Healthy | `docker ps` shows (healthy) |
| Compiler warnings | 88 (32 dup) | <20 | `cargo build` output warning count |
| Linking time | ~60s | <15s | Build log timestamps |
