## ADDED Requirements

### Requirement: Database migration from v1.5 to v3.0.4
The system SHALL migrate SurrealDB from version 1.5.0 to 3.0.4 using the official export/fix/import path with zero data loss.

#### Scenario: Successful migration
- **WHEN** the migration script is executed with a valid v1.5 database backup
- **THEN** the system exports data from v1.5, runs surreal fix for v2 compatibility, exports with --v3 flag, and imports into v3.0.4
- **AND** all 13 API handlers continue to function correctly

#### Scenario: Migration rollback
- **WHEN** the migration fails at any step
- **THEN** the system SHALL restore from the pre-migration backup within 30 minutes
- **AND** the database SHALL return to v1.5.6 operational state

### Requirement: SQL syntax compatibility updates
The system SHALL update all SQL queries to use SurrealDB v3 syntax conventions.

#### Scenario: UPSERT replaces UPDATE
- **WHEN** a query attempts to create or update a record
- **THEN** the system SHALL use UPSERT instead of UPDATE for create-or-update behavior

#### Scenario: Storage backend migration
- **WHEN** the database initializes
- **THEN** the system SHALL use rocksdb:// storage instead of deprecated file://

#### Scenario: Access scope definition
- **WHEN** authentication scopes are defined
- **THEN** the system SHALL use DEFINE ACCESS TYPE RECORD instead of DEFINE SCOPE

#### Scenario: Function naming convention
- **WHEN** any SurrealDB function is invoked
- **THEN** the system SHALL use snake_case naming (e.g., string::ends_with instead of string::endsWith)

### Requirement: Local development recovery tooling
The system SHALL provide recovery scripts for local development environments with legacy surreal-data volumes.

#### Scenario: Preserve-data recovery
- **WHEN** a developer has a legacy v1-era surreal-data volume
- **THEN** the system SHALL provide a script that backs up, migrates through v2, and imports to v3 while preserving data
- **AND** the process SHALL complete within 45 minutes

#### Scenario: Reset recovery
- **WHEN** a developer does not need to preserve local data
- **THEN** the system SHALL provide a script that backs up and resets the volume to a clean v3 state
- **AND** the process SHALL complete within 5 minutes

### Requirement: Health-aware orchestration
The system SHALL provide health checks that distinguish between database recovery and backend cold-build delays.

#### Scenario: Database health check
- **WHEN** the SurrealDB container starts
- **THEN** it SHALL report healthy only when v3 is fully operational and accepting connections

#### Scenario: Backend health check
- **WHEN** the backend container starts
- **THEN** it SHALL account for cold-compile time (up to 30 minutes) before marking unhealthy
- **AND** it SHALL report readiness only when the API is serving requests

## MODIFIED Requirements

None - this is a new capability.

## REMOVED Requirements

None - no capabilities are being removed, only upgraded.
