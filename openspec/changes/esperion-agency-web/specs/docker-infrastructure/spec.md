## ADDED Requirements

### Requirement: Docker Compose Configuration
The system SHALL provide a Docker Compose configuration for the entire application stack.

#### Scenario: Service definition
- **WHEN** docker-compose.yml is loaded
- **THEN** three services SHALL be defined:
  - frontend (Nuxt 4 application)
  - backend (Rust + Axum API)
  - database (SurrealDB 3)

#### Scenario: Frontend service configuration
- **WHEN** the frontend service starts
- **THEN** it SHALL use Node.js 20 Alpine image
- **AND** port 3000 SHALL be exposed and mapped to host
- **AND** the app directory SHALL be mounted as volume
- **AND** node_modules SHALL be in a separate volume to prevent host conflicts

#### Scenario: Backend service configuration
- **WHEN** the backend service starts
- **THEN** it SHALL use Rust 1.75 image
- **AND** port 8080 SHALL be exposed and mapped to host
- **AND** the src directory SHALL be mounted as volume
- **AND** cargo target directory SHALL be in a separate volume

#### Scenario: Database service configuration
- **WHEN** the database service starts
- **THEN** it SHALL use surrealdb/surrealdb:latest image
- **AND** port 8000 SHALL be exposed and mapped to host
- **AND** data SHALL persist in a named volume
- **AND** root credentials SHALL be set via environment variables

#### Scenario: Network configuration
- **WHEN** services start
- **THEN** all services SHALL be on the same Docker network
- **AND** services SHALL communicate via service names
- **AND** external access SHALL only be through exposed ports

### Requirement: Hot Reload - Frontend
The frontend development environment SHALL support hot module replacement (HMR).

#### Scenario: File change detection
- **WHEN** a Vue component file is modified on the host
- **THEN** the change SHALL be detected inside the container
- **AND** Nuxt HMR SHALL update the browser without full reload

#### Scenario: Style change detection
- **WHEN** a CSS/Tailwind file is modified on the host
- **THEN** the change SHALL be detected inside the container
- **AND** styles SHALL update instantly in the browser

#### Scenario: New file detection
- **WHEN** a new page or component is added on the host
- **THEN** the change SHALL be detected inside the container
- **AND** Nuxt SHALL recognize the new file

#### Scenario: Volume mount configuration
- **WHEN** the container starts
- **THEN** the volume mount SHALL use proper options for the host OS
- **AND** on Windows, Docker Desktop integration SHALL be enabled

### Requirement: Hot Reload - Backend
The backend development environment SHALL support automatic recompilation and restart.

#### Scenario: Code change detection
- **WHEN** a Rust source file is modified on the host
- **THEN** cargo-watch SHALL detect the change
- **AND** the project SHALL recompile automatically

#### Scenario: Automatic restart
- **WHEN** recompilation succeeds
- **THEN** the Axum server SHALL restart automatically
- **AND** the new code SHALL be active without manual intervention

#### Scenario: Compile error handling
- **WHEN** a compilation error occurs
- **THEN** the error SHALL be displayed in the container logs
- **AND** the previous working version SHALL continue running

#### Scenario: cargo-watch configuration
- **WHEN** the backend service starts
- **THEN** cargo-watch SHALL be installed or available
- **AND** the command SHALL be: cargo watch -x run

### Requirement: Database Persistence
The SurrealDB data SHALL persist across container restarts.

#### Scenario: Data persistence
- **WHEN** the database container is stopped and restarted
- **THEN** all data SHALL remain intact
- **AND** tables and records SHALL be available after restart

#### Scenario: Named volume usage
- **WHEN** docker-compose.yml defines the database service
- **THEN** a named volume SHALL be used for /data
- **AND** the volume SHALL persist after container removal

#### Scenario: Database initialization
- **WHEN** the database starts for the first time
- **THEN** root credentials SHALL be set from environment variables
- **AND** the database SHALL be ready for connections

#### Scenario: Backup and restore
- **WHEN** a backup is needed
- **THEN** the SurrealDB export command SHALL be available
- **AND** backups SHALL be stored outside the container

### Requirement: Environment Variables
The system SHALL use environment variables for configuration.

#### Scenario: Frontend environment
- **WHEN** the frontend service starts
- **THEN** the following environment variables SHALL be configurable:
  - NUXT_PUBLIC_API_BASE (backend URL)
  - NUXT_RECAPTCHA_SITE_KEY
  - NODE_ENV

#### Scenario: Backend environment
- **WHEN** the backend service starts
- **THEN** the following environment variables SHALL be configurable:
  - DATABASE_URL (SurrealDB connection)
  - JWT_SECRET
  - JWT_EXPIRATION
  - RECAPTCHA_SECRET_KEY
  - RUST_LOG (logging level)

#### Scenario: Database environment
- **WHEN** the database service starts
- **THEN** the following environment variables SHALL be set:
  - SURREAL_USER (root username)
  - SURREAL_PASS (root password)

#### Scenario: .env file support
- **WHEN** a .env file exists in the project root
- **THEN** docker-compose SHALL load variables from it
- **AND** a .env.example file SHALL provide template values

### Requirement: Development vs Production
The system SHALL support both development and production configurations.

#### Scenario: Development mode
- **WHEN** docker-compose.dev.yml is used
- **THEN** hot reload SHALL be enabled
- **AND** debug logging SHALL be active
- **AND** source maps SHALL be generated

#### Scenario: Production mode
- **WHEN** docker-compose.prod.yml is used
- **THEN** optimized builds SHALL be used
- **AND** debug logging SHALL be disabled
- **AND** health checks SHALL be configured

#### Scenario: Build arguments
- **WHEN** building for production
- **THEN** build arguments SHALL be available for:
  - API endpoint configuration
  - Feature flags
  - Version information

### Requirement: Docker Health Checks
The system SHALL include health checks for all services.

#### Scenario: Frontend health check
- **WHEN** the frontend service is running
- **THEN** a health check SHALL verify the server responds on port 3000
- **AND** the check SHALL hit a known endpoint (e.g., /api/health)

#### Scenario: Backend health check
- **WHEN** the backend service is running
- **THEN** a health check SHALL verify the API responds on port 8080
- **AND** the check SHALL hit /health endpoint

#### Scenario: Database health check
- **WHEN** the database service is running
- **THEN** a health check SHALL verify SurrealDB is accepting connections
- **AND** the check SHALL use surrealdb-cli or HTTP endpoint

#### Scenario: Dependency health
- **WHEN** a service depends on another service
- **THEN** the dependent service SHALL wait for the dependency to be healthy
- **AND** retries SHALL be configured for connection failures

### Requirement: Docker Security
The system SHALL implement security best practices for Docker.

#### Scenario: Non-root user
- **WHEN** containers run
- **THEN** processes SHALL run as non-root user where possible
- **AND** file permissions SHALL be set appropriately

#### Scenario: Secret management
- **WHEN** sensitive data is configured
- **THEN** secrets SHALL NOT be hardcoded in Dockerfile
- **AND** Docker secrets or environment variables SHALL be used

#### Scenario: Image scanning
- **WHEN** base images are selected
- **THEN** official images SHALL be preferred
- **AND** Alpine-based images SHALL be used where possible

#### Scenario: Network isolation
- **WHEN** services communicate
- **THEN** internal services SHALL NOT be exposed externally
- **AND** only necessary ports SHALL be published

### Requirement: Dockerfile - Frontend
The frontend SHALL have a proper Dockerfile for development and production.

#### Scenario: Multi-stage build
- **WHEN** building for production
- **THEN** a multi-stage Dockerfile SHALL be used
- **AND** the final image SHALL only contain production dependencies

#### Scenario: Development Dockerfile
- **WHEN** running in development mode
- **THEN** the Dockerfile SHALL include development tools
- **AND** source code SHALL be mounted as volume

#### Scenario: Layer caching
- **WHEN** the image is built
- **THEN** package.json and lock files SHALL be copied first
- **AND** npm install SHALL be cached when dependencies don't change

### Requirement: Dockerfile - Backend
The backend SHALL have a proper Dockerfile for development and production.

#### Scenario: Multi-stage build
- **WHEN** building for production
- **THEN** a multi-stage Dockerfile SHALL be used
- **AND** the final image SHALL only contain the compiled binary

#### Scenario: Development Dockerfile
- **WHEN** running in development mode
- **THEN** the Dockerfile SHALL include cargo and Rust toolchain
- **AND** cargo-watch SHALL be installed

#### Scenario: Build optimization
- **WHEN** the image is built
- **THEN** build artifacts SHALL be cached between builds
- **AND** incremental compilation SHALL be enabled for development

### Requirement: Getting Started
The system SHALL provide clear documentation for Docker usage.

#### Scenario: Quick start
- **WHEN** a developer clones the repository
- **THEN** running `docker-compose up` SHALL start all services
- **AND** the application SHALL be accessible at localhost:3000

#### Scenario: First-time setup
- **WHEN** running for the first time
- **THEN** database schema SHALL be initialized automatically
- **AND** default admin user SHALL be created

#### Scenario: Troubleshooting guide
- **WHEN** issues occur
- **THEN** documentation SHALL provide common solutions
- **AND** logs SHALL be accessible via `docker-compose logs`