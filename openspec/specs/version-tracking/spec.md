# Version Tracking Specification

## Purpose

This specification defines the version tracking capability for the Esperion Digital Agency web platform, establishing a centralized source of truth for all dependency versions across frontend, backend, and infrastructure components.

## Requirements

### Requirement: ESPERION_VERSIONS.md File Existence
The system SHALL have an ESPERION_VERSIONS.md file at the project root.

#### Scenario: File exists at project root
- **WHEN** the repository is cloned
- **THEN** ESPERION_VERSIONS.md SHALL exist at the repository root
- **AND** the file SHALL be tracked in version control

#### Scenario: File is markdown format
- **WHEN** the file is opened
- **THEN** it SHALL use Markdown syntax
- **AND** it SHALL render correctly in GitHub/GitLab viewers

#### Scenario: File is discoverable
- **WHEN** a developer seeks version information
- **THEN** the file SHALL be referenced in README.md
- **AND** the file SHALL have a clear, descriptive title

### Requirement: Frontend Dependency Versions
The ESPERION_VERSIONS.md file SHALL contain all frontend dependency versions.

#### Scenario: Frontend versions accurate
- **WHEN** frontend versions are reviewed
- **THEN** they SHALL match the versions in frontend/package.json
- **AND** the versions SHALL be organized by category (framework, UI, testing, etc.)

#### Scenario: Core framework versions tracked
- **WHEN** frontend versions are documented
- **THEN** the following SHALL be included:
  - nuxt (framework version)
  - vue (core library)
  - vue-router (routing)
  - typescript (language)
  - pinia and @pinia/nuxt (state management)

#### Scenario: Nuxt module versions tracked
- **WHEN** Nuxt modules are documented
- **THEN** the following SHALL be included:
  - @nuxt/ui (UI framework)
  - @nuxt/fonts (font optimization)
  - @nuxt/image (image optimization)
  - @nuxtjs/i18n (internationalization)
  - @nuxtjs/color-mode (theming)
  - @nuxtjs/robots (SEO)
  - @nuxtjs/sitemap (SEO)
  - @vueuse/nuxt (utilities)
  - @nuxt/eslint (linting)
  - nuxt-security (security)
  - nuxt-schema-org (SEO)

#### Scenario: Development dependency versions tracked
- **WHEN** dev dependencies are documented
- **THEN** the following SHALL be included:
  - eslint (linting)
  - prettier (formatting)
  - @playwright/test (E2E testing)
  - vitest (unit testing)
  - @vitejs/plugin-vue (build)
  - @vue/test-utils (testing)

#### Scenario: Frontend versions presented in table format
- **WHEN** frontend versions are displayed
- **THEN** they SHALL use a Markdown table with columns:
  - Package name
  - Version
  - Category

### Requirement: Backend Dependency Versions
The ESPERION_VERSIONS.md file SHALL contain all backend crate versions.

#### Scenario: Backend versions accurate
- **WHEN** backend versions are reviewed
- **THEN** they SHALL match the versions in backend/Cargo.toml
- **AND** the versions SHALL be organized by category

#### Scenario: Core framework versions tracked
- **WHEN** backend versions are documented
- **THEN** the following SHALL be included:
  - Rust Edition (language version)
  - axum (web framework)
  - tokio (async runtime)
  - tower-http (middleware)

#### Scenario: Database versions tracked
- **WHEN** database dependencies are documented
- **THEN** the following SHALL be included:
  - surrealdb (database client)
  - Related utilities (sha2, lazy_static if applicable)

#### Scenario: Authentication versions tracked
- **WHEN** authentication dependencies are documented
- **THEN** the following SHALL be included:
  - jsonwebtoken (JWT handling)
  - argon2 (password hashing)

#### Scenario: API documentation versions tracked
- **WHEN** API documentation dependencies are documented
- **THEN** the following SHALL be included:
  - utoipa (OpenAPI specification)
  - utoipa-scalar (API docs UI)

#### Scenario: Service integration versions tracked
- **WHEN** service integration dependencies are documented
- **THEN** the following SHALL be included:
  - reqwest (HTTP client)
  - lettre (email service)
  - image and webp (image processing)

#### Scenario: Utility versions tracked
- **WHEN** utility dependencies are documented
- **THEN** the following SHALL be included:
  - serde and serde_json (serialization)
  - chrono (date/time)
  - uuid (UUID generation)
  - clap (CLI)
  - tracing and tracing-subscriber (logging)
  - async-trait (async traits)
  - governor (rate limiting)
  - dotenvy (environment variables)
  - thiserror and anyhow (error handling)
  - base64 and urlencoding (encoding)

#### Scenario: Backend versions presented in table format
- **WHEN** backend versions are displayed
- **THEN** they SHALL use a Markdown table with columns:
  - Package name
  - Version
  - Category

### Requirement: Docker Image Versions
The ESPERION_VERSIONS.md file SHALL include Docker image versions.

#### Scenario: Docker versions accurate
- **WHEN** Docker versions are reviewed
- **THEN** they SHALL match the versions in docker-compose.yml
- **AND** they SHALL match any Dockerfile FROM statements

#### Scenario: Database Docker image version tracked
- **WHEN** infrastructure versions are documented
- **THEN** the SurrealDB Docker image version SHALL be included
- **AND** the image name SHALL be fully qualified (e.g., surrealdb/surrealdb:v1.5.6)

#### Scenario: Runtime requirements documented
- **WHEN** infrastructure versions are documented
- **THEN** the following SHALL be included:
  - Node.js minimum version
  - Rust minimum version
  - Docker Compose version requirement

#### Scenario: Infrastructure versions presented in table format
- **WHEN** infrastructure versions are displayed
- **THEN** they SHALL use a Markdown table with columns:
  - Component
  - Version
  - Notes

### Requirement: Last Updated Timestamp
The ESPERION_VERSIONS.md file SHALL have a last updated timestamp.

#### Scenario: Timestamp is recent
- **WHEN** versions are updated in package.json or Cargo.toml
- **THEN** the timestamp SHALL be updated within the same commit
- **AND** the timestamp SHALL reflect the date of the last version change

#### Scenario: Timestamp is visible
- **WHEN** the file is opened
- **THEN** the timestamp SHALL be prominently displayed near the top
- **AND** the format SHALL be ISO 8601 (YYYY-MM-DD)

#### Scenario: Timestamp accuracy verifiable
- **WHEN** timestamp accuracy is questioned
- **THEN** git blame SHALL confirm the timestamp was updated with version changes
- **AND** the timestamp SHALL match the most recent version-affecting commit

### Requirement: Version History Tracking
The ESPERION_VERSIONS.md file SHALL maintain a version history.

#### Scenario: Version history table exists
- **WHEN** the file is reviewed
- **THEN** a version history section SHALL be present
- **AND** it SHALL use a Markdown table format

#### Scenario: History entries include key versions
- **WHEN** history entries are recorded
- **THEN** they SHALL include:
  - Date of update
  - Frontend baseline version
  - Backend baseline version
  - Notable changes or notes

#### Scenario: Current baseline documented
- **WHEN** the current state is reviewed
- **THEN** the most recent history entry SHALL reflect current versions
- **AND** it SHALL be marked as current baseline

### Requirement: Update Instructions
The ESPERION_VERSIONS.md file SHALL provide update instructions.

#### Scenario: Frontend update instructions documented
- **WHEN** a developer needs to update frontend dependencies
- **THEN** the file SHALL provide commands for:
  - Checking outdated packages
  - Updating specific packages
  - Running tests after updates
  - Updating the version file itself

#### Scenario: Backend update instructions documented
- **WHEN** a developer needs to update backend dependencies
- **THEN** the file SHALL provide commands for:
  - Checking outdated packages (cargo outdated)
  - Updating packages (cargo update)
  - Running tests after updates
  - Updating the version file itself

#### Scenario: Version pinning strategy documented
- **WHEN** version pinning approach is reviewed
- **THEN** the strategy SHALL explain:
  - Which dependencies use exact versions (=x.y.z)
  - Which use caret versions (^x.y.z)
  - Which use major versions only (x)
  - The rationale for each approach

### Requirement: Quick Reference Commands
The ESPERION_VERSIONS.md file SHALL provide quick version check commands.

#### Scenario: Frontend check commands documented
- **WHEN** a developer needs to verify frontend versions
- **THEN** the file SHALL provide the command:
  - `cd frontend && npm list --depth=0`

#### Scenario: Backend check commands documented
- **WHEN** a developer needs to verify backend versions
- **THEN** the file SHALL provide the command:
  - `cd backend && cargo tree --depth=1`

#### Scenario: Runtime version commands documented
- **WHEN** runtime versions need verification
- **THEN** the file SHALL provide commands for:
  - Node.js version check
  - Rust version check
  - SurrealDB version check (Docker)

### Requirement: Important Notes Section
The ESPERION_VERSIONS.md file SHALL include important notes and warnings.

#### Scenario: Pre-update warnings documented
- **WHEN** update notes are reviewed
- **THEN** warnings SHALL include:
  - Review changelogs for breaking changes
  - Run full test suite after updates
  - Test in development environment first

#### Scenario: Critical dependencies identified
- **WHEN** critical dependencies are listed
- **THEN** they SHALL be explicitly called out
- **AND** the reason for exact pinning SHALL be explained

#### Scenario: Quality thresholds documented
- **WHEN** quality requirements are stated
- **THEN** test coverage thresholds SHALL be specified
- **AND** the requirement SHALL be enforced after updates
