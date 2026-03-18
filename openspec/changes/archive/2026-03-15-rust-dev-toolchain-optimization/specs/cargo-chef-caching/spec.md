# Spec: Cargo Chef Caching

## ADDED Requirements

### Requirement: Cargo chef is integrated into Docker build pipeline
The system SHALL use lukemathwalker/cargo-chef image for multi-stage Docker builds with Alpine Linux base.

#### Scenario: Chef planner stage exists
- **WHEN** the Dockerfile defines the build process
- **THEN** a "planner" stage uses `cargo chef prepare` to generate `recipe.json`
- **AND** the recipe.json captures all dependencies from Cargo.toml and Cargo.lock

#### Scenario: Chef builder stage exists with Alpine compatibility
- **WHEN** the Dockerfile defines the build process
- **THEN** a "builder" stage uses `cargo chef cook` to compile dependencies
- **AND** this stage uses Alpine-compatible Rust image
- **AND** this stage occurs before copying application source code

### Requirement: Docker layer caching separates dependencies from application code
The system SHALL cache dependency compilation in a separate Docker layer from application code.

#### Scenario: Dependency layer caching
- **WHEN** building the Docker image
- **THEN** the `cargo chef cook` layer is cached when Cargo.toml/Cargo.lock are unchanged
- **AND** changing application source code does not invalidate the dependency cache

#### Scenario: Dependency rebuild only on manifest changes
- **WHEN** application source code is modified without changing Cargo.toml
- **THEN** Docker build skips dependency compilation
- **AND** only application code is recompiled

### Requirement: Cold build time is reduced by at least 60%
The system SHALL achieve measurable reduction in cold build time through dependency caching.

#### Scenario: First build with chef
- **WHEN** performing a cold build with cargo-chef
- **THEN** the total build time is under 12 minutes
- **AND** this is at least 60% faster than the original 27m 59s build

#### Scenario: Subsequent builds with cached dependencies
- **WHEN** rebuilding after code-only changes
- **THEN** the build time is under 5 minutes
- **AND** dependency compilation is skipped

### Requirement: Recipe generation captures all workspace dependencies
The system SHALL correctly handle all dependency types in the recipe generation.

#### Scenario: All crates in recipe
- **WHEN** `cargo chef prepare` runs
- **THEN** recipe.json includes all dependencies from Cargo.toml
- **AND** recipe.json includes all transitive dependencies

#### Scenario: Feature flags preserved
- **WHEN** dependencies have feature flags enabled
- **THEN** recipe.json preserves all feature flags
- **AND** cooked dependencies match the original Cargo.toml configuration
