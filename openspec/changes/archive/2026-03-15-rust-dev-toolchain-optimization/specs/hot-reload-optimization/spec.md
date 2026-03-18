# Spec: Hot Reload Optimization

## ADDED Requirements

### Requirement: cargo-watch remains functional in development containers
The system SHALL preserve hot reload functionality using cargo-watch in development Docker containers with Alpine compatibility.

#### Scenario: cargo-watch monitors source files with polling
- **WHEN** the development container starts (Alpine-based)
- **THEN** cargo-watch monitors all `.rs` files in the `src/` directory
- **AND** cargo-watch uses `--poll` flag for reliable file detection in Docker volumes
- **AND** cargo-watch triggers recompilation on file changes

#### Scenario: Automatic restart on code changes
- **WHEN** a developer edits a Rust source file
- **THEN** cargo-watch detects the change within 2 seconds
- **AND** the application recompiles and restarts automatically

### Requirement: Hot reload works with mold linker
The system SHALL ensure cargo-watch-triggered rebuilds use mold linker.

#### Scenario: Hot reload uses optimized linker
- **WHEN** cargo-watch triggers a rebuild after file changes
- **THEN** the rebuild uses mold linker (not default ld)
- **AND** the linking phase completes in under 3 seconds

#### Scenario: No linker conflicts during hot reload
- **WHEN** multiple hot reload cycles occur
- **THEN** each rebuild uses the same linker configuration
- **AND** no linker-related errors occur

### Requirement: Hot reload works with cargo-chef cached dependencies
The system SHALL ensure cargo-watch works with pre-cooked dependencies from cargo-chef.

#### Scenario: Dependencies available in development container
- **WHEN** the development container starts with cargo-chef cached dependencies
- **THEN** all dependencies are pre-compiled and available
- **AND** cargo-watch only rebuilds application code

#### Scenario: Volume mounts don't invalidate dependency cache
- **WHEN** source code is mounted via Docker volumes
- **THEN** pre-cooked dependencies remain available
- **AND** cargo-watch rebuilds use cached dependencies

### Requirement: Developer experience is maintained or improved
The system SHALL provide clear feedback during hot reload cycles.

#### Scenario: Compilation feedback visible
- **WHEN** cargo-watch triggers a rebuild
- **THEN** compilation output is visible in container logs
- **AND** errors are displayed with file and line information

#### Scenario: Successful reload notification
- **WHEN** hot reload completes successfully
- **THEN** a success message is logged
- **AND** the application is ready to accept requests within 5 seconds

### Requirement: Three-stage workflow is documented
The system SHALL provide clear documentation for developers on which tool to use when.

#### Scenario: Local development without Docker
- **WHEN** a developer works directly on host machine
- **THEN** documentation explains how to install mold locally
- **AND** documentation shows how to use cargo-watch with mold

#### Scenario: Docker fresh build
- **WHEN** a developer needs a clean build
- **THEN** documentation explains the cargo-chef workflow
- **AND** documentation shows how to invalidate cache if needed

#### Scenario: Docker development with hot reload
- **WHEN** a developer uses docker-compose for development
- **THEN** documentation explains the three-tool integration
- **AND** troubleshooting guide addresses common issues
