## ADDED Requirements

### Requirement: SurrealDB v3.0.4 Runtime
The system SHALL run SurrealDB version 3.0.4 with full compatibility for v3 features and syntax.

#### Scenario: Database container starts with v3.0.4
- **WHEN** the database container starts
- **THEN** it SHALL use image `surrealdb/surrealdb:v3.0.4`
- **AND** the version endpoint SHALL return version "3.0.4"

#### Scenario: RocksDB backend storage
- **WHEN** the backend connects to database
- **THEN** it SHALL use `rocksdb:/data/esperion.db` connection string
- **AND** NOT use deprecated `file:/data/esperion.db`

#### Scenario: Rust SDK compatibility
- **WHEN** the Rust backend compiles
- **THEN** it SHALL use surrealdb crate version 3.0.4
- **AND** all database operations SHALL execute successfully

### Requirement: Database Connection String Update
The system SHALL update all database connection configurations to use rocksdb:// protocol.

#### Scenario: Docker Compose configuration
- **WHEN** docker-compose.yml is updated
- **THEN** the database service command SHALL use `rocksdb:/data/esperion.db`
- **AND** NOT use `file:/data/esperion.db`

#### Scenario: Rust backend connection
- **WHEN** backend establishes database connection
- **THEN** it SHALL connect to `rocksdb:/data/esperion.db`
- **AND** connection SHALL succeed without errors

### Requirement: HNSW Vector Index Support
The system SHALL support HNSW vector indexes (replacing deprecated MTREE).

#### Scenario: Creating HNSW index
- **WHEN** creating a vector index
- **THEN** `HNSW` index type SHALL be available
- **AND** `MTREE` SHALL be unavailable

## MODIFIED Requirements

### Requirement: Migration from v1.5
Migration from SurrealDB v1.5 to v3.0.4 SHALL use a staged, recoverable workflow that preserves the original data before any destructive step and imports into a clean v3 target.

#### Scenario: Legacy v1.5 data is not treated as directly bootable under v3
- **WHEN** v1.5.6 data exists in the configured storage path
- **THEN** the system SHALL treat direct v3 startup against that storage as unsupported
- **AND** it SHALL require staged recovery before the v3 runtime is considered healthy

#### Scenario: Staged migration follows the supported upgrade path
- **WHEN** migrating from v1.5.6 to v3.0.4
- **THEN** the workflow SHALL convert 1.x data to a 2.x-compatible state before generating a v3-compatible export
- **AND** the v3 runtime SHALL import that export into a clean 3.x data store
- **AND** direct in-place 1.x -> 3.x mounting SHALL NOT be treated as a supported migration path

#### Scenario: Source backup exists before destructive work
- **WHEN** migration is executed
- **THEN** a restorable backup of the source data SHALL exist before any destructive step begins
- **AND** migration failure SHALL leave that source backup available for retry or rollback

#### Scenario: Schema migration remains complete
- **WHEN** database schemas are migrated through the staged workflow
- **THEN** all table definitions SHALL be represented in the v3 target state
- **AND** required schema changes for v3 compatibility SHALL be applied before the migration is declared complete

#### Scenario: Data migration remains complete
- **WHEN** data is migrated through the staged workflow
- **THEN** all records SHALL be preserved in the v3 target or the workflow SHALL fail with the source backup still available
- **AND** relationships SHALL remain intact

#### Scenario: Query migration remains required
- **WHEN** existing queries are run on v3
- **THEN** they SHALL be updated to v3 syntax
- **AND** deprecated functions SHALL be replaced
- **AND** queries SHALL execute without errors

## REMOVED Requirements

None - no capabilities removed, only storage backend changed.
