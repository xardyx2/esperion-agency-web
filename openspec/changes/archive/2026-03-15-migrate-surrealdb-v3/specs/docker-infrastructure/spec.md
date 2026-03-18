## ADDED Requirements

### Requirement: Docker Image Update
The Docker Compose configuration SHALL use SurrealDB v3.0.4 image.

#### Scenario: Image tag update
- **WHEN** docker-compose.yml is reviewed
- **THEN** database service SHALL use `surrealdb/surrealdb:v3.0.4`
- **AND** NOT use `surrealdb/surrealdb:v1.5.6`

#### Scenario: Container startup
- **WHEN** `docker-compose up -d database` executes
- **THEN** v3.0.4 container SHALL start successfully
- **AND** logs SHALL show SurrealDB v3.0.4 version

### Requirement: Storage Backend Command
The Docker command SHALL specify rocksdb backend.

#### Scenario: Command configuration
- **WHEN** container starts
- **THEN** command SHALL be: `start --user root --pass root rocksdb:/data/esperion.db`
- **AND** NOT use `file:/data/esperion.db`

#### Scenario: Volume persistence
- **WHEN** container restarts
- **THEN** data SHALL persist in Docker volume
- **AND** volume name SHALL remain `surreal-data`

### Requirement: Environment Variable Compatibility
The Docker environment SHALL be compatible with v3 authentication.

#### Scenario: Authentication configuration
- **WHEN** container starts with environment variables
- **THEN** `SURREAL_USER` and `SURREAL_PASS` SHALL be recognized
- **AND** database SHALL require authentication (v3 default)

### Requirement: Legacy SurrealDB Volume Recovery Tooling
The Docker infrastructure SHALL provide a local recovery entry point for incompatible SurrealDB volumes used by the root Compose stack.

#### Scenario: Recovery entry point creates a safe backup
- **WHEN** local database recovery is invoked for a legacy volume
- **THEN** the tooling SHALL create a timestamped backup outside the active volume before destructive work begins
- **AND** the backup location SHALL be communicated to the operator

#### Scenario: Recovery entry point prepares a clean v3 target
- **WHEN** migration or reset requires a new v3-compatible data store
- **THEN** the tooling SHALL create or recreate a clean target volume before the root v3 database service is started
- **AND** it SHALL avoid mutating the only source copy in place

### Requirement: Recovery Verification Signals
The Docker recovery flow SHALL expose clear success and failure signals for the local database service after recovery.

#### Scenario: Recovery succeeds
- **WHEN** recovery completes successfully
- **THEN** the root Compose database service SHALL start without the legacy storage version mismatch error
- **AND** the recovery guidance SHALL direct the operator to verify the backend and frontend services next

#### Scenario: Recovery fails
- **WHEN** recovery does not complete successfully
- **THEN** the operator SHALL be able to identify the failing stage from logs or status output
- **AND** the original backup SHALL remain available for retry or rollback

### Requirement: Local Stack Healthcheck Orchestration
The local Docker stack SHALL expose readiness-aware health signals so startup sequencing and recovery verification do not rely on raw container start order.

#### Scenario: Database readiness gates downstream startup
- **WHEN** the local stack is started after recovery or reset
- **THEN** the database service SHALL expose a readiness-oriented health signal before downstream verification treats it as usable
- **AND** backend startup orchestration SHALL depend on database readiness rather than container start alone

#### Scenario: Backend readiness accounts for cold-build delay
- **WHEN** the backend service needs an extended cold-build period before it can serve `/health`
- **THEN** the local stack SHALL use a healthcheck configuration or equivalent readiness budget that tolerates the documented startup delay
- **AND** verification SHALL not treat the backend container as ready until `/health` responds successfully

## MODIFIED Requirements

### Requirement: Local Docker Deployment with Recovery Path
Local startup and troubleshooting requirements need to include a supported recovery path when legacy SurrealDB data prevents the database container from starting.

#### Scenario: Developer encounters Expected:3, Actual:1 error
- **WHEN** the database container exits with storage version mismatch
- **THEN** local documentation SHALL explain the error meaning
- **AND** it SHALL provide clear migrate vs reset decision guidance
- **AND** it SHALL explain data retention implications for each choice

#### Scenario: Post-recovery verification
- **WHEN** recovery completes (preserve-data or reset)
- **THEN** documentation SHALL specify verification commands for database, backend, and frontend
- **AND** expected success signals SHALL be documented for each service

## REMOVED Requirements

None.
