# Tasks: Rust Development Toolchain Optimization

## 1. Preparation & Backup

- [x] 1.1 Create backup of current `backend/Dockerfile` as `backend/Dockerfile.backup`
- [x] 1.2 Verify current build time baseline: `time docker-compose build --no-cache backend`
- [x] 1.3 Document current linking time by examining build logs
- [x] 1.4 Create `.cargo/` directory in backend if not exists

## 2. LLD Linker Integration

- [x] 2.1 Create `backend/.cargo/config.toml` with lld linker configuration
- [x] 2.2 Add lld installation to builder stage in new Dockerfile
- [x] 2.3 Add lld installation to development stage in new Dockerfile
- [x] 2.4 Configure environment variables for lld in docker-compose.yml
- [x] 2.5 Test lld linking: `docker-compose build backend` and verify lld is used in logs
- [x] 2.6 Measure linking time improvement (target: <15s for cold build, <3s for incremental)

## 3. Cargo Chef Caching Implementation

- [x] 3.1 Create multi-stage Dockerfile with planner stage using `cargo chef prepare`
- [x] 3.2 Add builder stage with `cargo chef cook` for dependency caching
- [x] 3.3 Configure builder stage to use mold linker with cargo-chef
- [x] 3.4 Add runtime stage with cargo-watch for development
- [x] 3.5 Update docker-compose.yml with build target specification
- [x] 3.6 Add Docker volumes for cargo-cache and target-cache
- [x] 3.7 Test cold build time with cargo-chef (target: <12 minutes)
- [x] 3.8 Test incremental build: modify source file, verify dependencies are not rebuilt

## 4. Hot Reload Integration

- [x] 4.1 Verify cargo-watch is installed in development stage
- [x] 4.2 Configure cargo-watch with mold linker in development stage
- [x] 4.3 Test hot reload: edit `src/main.rs` and verify automatic recompilation
- [x] 4.4 Measure hot reload time (target: <5 seconds from save to restart)
- [x] 4.5 Verify pre-cooked dependencies are available in development container
- [x] 4.6 Test multiple hot reload cycles to ensure no linker conflicts

## 5. Health Check Fix

- [x] 5.1 Analyze current health check configuration in docker-compose.yml
- [x] 5.2 Fix health check command (add wget/curl to Alpine image or use TCP socket check)
- [x] 5.3 Update health check interval and timeout if needed
- [x] 5.4 Test health check: `docker ps` should show (healthy) status
- [x] 5.5 Verify health check works after container restart

## 6. Dead Code Warning Cleanup

- [x] 6.1 Review all 88 warnings from latest build log
- [x] 6.2 Add `#[allow(dead_code)]` to intentionally unused but reserved code (middleware, db functions)
- [x] 6.3 Address unused code (email provider field, image processor methods, error variants)
- [x] 6.4 Document why certain code is kept despite being unused
- [x] 6.5 Verify warning count reduced from 88 to under 20
- [x] 6.6 Ensure no breaking changes to API or functionality

## 7. Docker Compose Updates

- [x] 7.1 Update `docker-compose.yml` backend service build section
- [x] 7.2 Add cache volumes to backend service volumes
- [x] 7.3 Add environment variables for linker configuration
- [x] 7.4 Verify docker-compose up --build works end-to-end
- [x] 7.5 Test volume mounts don't invalidate dependency cache

## 8. Validation & Testing

- [x] 8.1 Run full cold build test: `docker-compose build --no-cache backend`
- [x] 8.2 Verify all dependencies link successfully with mold
- [x] 8.3 Test dependency caching: change only source code, verify no dependency rebuild
- [x] 8.4 Test dependency rebuild: update Cargo.toml, verify dependencies rebuild
- [x] 8.5 Verify hot reload works after multiple code changes
- [x] 8.6 Confirm binary runs correctly and connects to SurrealDB
- [x] 8.7 Verify container health check reports (healthy)
- [x] 8.8 Confirm warning count under 20

## 9. Documentation

- [x] 9.1 Create `backend/DOCKER_BUILD_OPTIMIZATION.md` with setup instructions
- [x] 9.2 Document three-stage workflow (local dev, Docker fresh build, Docker hot reload)
- [x] 9.3 Add troubleshooting section for common issues
- [x] 9.4 Update root README.md with build optimization notes
- [x] 9.5 Document health check fix approach
- [x] 9.6 Document dead code cleanup decisions

## 10. Cleanup & Finalization

- [x] 10.1 Remove `backend/Dockerfile.backup` after successful validation
- [x] 10.2 Mark all tasks complete in this file
- [x] 10.3 Run final full stack test: `docker-compose up --build -d`
- [x] 10.4 Verify frontend, backend, and database all start successfully
- [x] 10.5 Verify all containers show (healthy) status
- [x] 10.6 Archive the change using openspec
