## ADDED Requirements

### Requirement: Three-Service Local Docker Stack
The system SHALL provide a local Docker development workflow that starts exactly three application services for Esperion: frontend, backend, and database.

#### Scenario: Expected services are defined
- **WHEN** the local Docker stack configuration is reviewed
- **THEN** it SHALL define exactly these service roles: Nuxt frontend, Rust/Axum backend, and SurrealDB database

#### Scenario: Expected services are started
- **WHEN** a developer runs the documented local Docker startup command
- **THEN** exactly the expected three services SHALL start successfully for the application stack

### Requirement: Runtime Versions Match Repository Truth
The local Docker workflow SHALL use service images and commands compatible with the versions actually installed in this repository.

#### Scenario: Frontend runtime matches installed Nuxt version
- **WHEN** the frontend service configuration is validated against `frontend/package.json`
- **THEN** the documented local stack SHALL target Nuxt 3-compatible development behavior

#### Scenario: Database runtime matches backend SDK compatibility
- **WHEN** the database service configuration is validated against `backend/Cargo.toml`
- **THEN** the documented local stack SHALL target a SurrealDB runtime compatible with the pinned Rust SDK

### Requirement: Container Networking And Host Access Are Explicit
The local Docker workflow SHALL distinguish container-to-container networking from host-accessible endpoints.

#### Scenario: Internal service communication uses service names
- **WHEN** the frontend or backend service connects to another containerized service
- **THEN** it SHALL use the Docker service name and container port rather than localhost

#### Scenario: Host endpoints are documented separately
- **WHEN** a developer follows the local Docker documentation
- **THEN** the host port for each exposed service SHALL be documented separately from the internal container port

### Requirement: Frontend Hot Reload Works In Container
The frontend container SHALL support live development updates from host file changes.

#### Scenario: Source file change updates frontend
- **WHEN** a developer changes a frontend source file on the host
- **THEN** the change SHALL be visible inside the container and trigger Nuxt development reload behavior

#### Scenario: Frontend dev server binds for container access
- **WHEN** the frontend container starts in development mode
- **THEN** the dev server SHALL bind to an address reachable from outside the container

### Requirement: Backend Hot Reload Works In Container
The backend container SHALL support automatic rebuild and restart when Rust source files change.

#### Scenario: Rust source change triggers rebuild
- **WHEN** a developer changes a backend Rust source file on the host
- **THEN** the backend container SHALL detect the change and start an automatic rebuild/restart cycle

#### Scenario: Rebuild errors remain observable
- **WHEN** the backend rebuild fails
- **THEN** the failure SHALL be visible in container logs so the developer can diagnose it

### Requirement: Database Mode Matches Documented Persistence Behavior
The database container SHALL run in a mode that matches the persistence claims made by the local Docker workflow.

#### Scenario: Persistent mode uses mounted storage
- **WHEN** the local Docker workflow claims database persistence across restarts
- **THEN** the database command SHALL use a persistent storage engine backed by the mounted volume

#### Scenario: Ephemeral mode is documented honestly
- **WHEN** the database container intentionally uses an in-memory mode
- **THEN** the local Docker documentation SHALL explicitly state that data will be lost on restart

### Requirement: Verification Steps Prove The Stack Is Correct
The local Docker workflow SHALL include verification steps that prove the correct stack is running.

#### Scenario: Service reachability is verified
- **WHEN** the local stack is started
- **THEN** the documented verification flow SHALL check that the frontend, backend, and database endpoints are reachable on their expected host ports

#### Scenario: Hot reload is verified
- **WHEN** the local stack is validated
- **THEN** the documented verification flow SHALL include at least one frontend hot reload check and one backend hot reload check

### Requirement: Local Docker Documentation Matches The Verified Workflow
The repository documentation for local Docker development SHALL describe the same workflow that the compose and Docker files implement.

#### Scenario: Documentation matches compose behavior
- **WHEN** a developer reads the Docker setup documentation
- **THEN** the described service count, versions, ports, and startup commands SHALL match the verified local stack

#### Scenario: Environment variable responsibilities are clear
- **WHEN** a developer configures the local Docker stack
- **THEN** the documentation SHALL explain which values are used for host-based commands and which values are used for in-container service communication
