## ADDED Requirements

### Requirement: Local Recovery Guidance For Legacy Database Volumes
The local Docker deployment documentation SHALL describe how to recover when an old SurrealDB volume prevents the database container from starting.

#### Scenario: Developer encounters storage version mismatch
- **WHEN** the database logs show a legacy storage version mismatch during local startup
- **THEN** the documentation SHALL point to both the preserve-data migration path and the fresh-reset path
- **AND** it SHALL explain the data preservation trade-off for each option

#### Scenario: Developer completes a recovery path
- **WHEN** a developer finishes either local recovery path
- **THEN** the documentation SHALL list the verification commands or checks for database, backend, and frontend startup
- **AND** it SHALL state the expected success signals for the restored 3-container workflow

### Requirement: Local Readiness Expectations After Recovery
The local Docker deployment documentation SHALL explain what healthy recovery looks like when backend startup is delayed by a long cold build.

#### Scenario: Backend is rebuilding after recovery
- **WHEN** the database is healthy but the backend is still compiling after the stack is restarted
- **THEN** the documentation SHALL explain that a long cold-build window can be expected on the first run after recovery
- **AND** it SHALL tell the operator which logs and health endpoints distinguish an in-progress build from a failed service

#### Scenario: Resource constraints slow local backend readiness
- **WHEN** local verification is running on a machine close to the backend container memory limit
- **THEN** the documentation SHALL call out the observed cold-build and memory-pressure behavior as a local development constraint
- **AND** it SHALL direct the operator to the recovery verification flow rather than implying the database migration failed

## MODIFIED Requirements

None - this is documentation-only capability.

## REMOVED Requirements

None.
