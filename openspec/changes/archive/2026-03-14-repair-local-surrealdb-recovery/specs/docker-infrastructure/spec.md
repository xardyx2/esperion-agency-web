## ADDED Requirements

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
