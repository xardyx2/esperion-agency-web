## ADDED Requirements

### Requirement: SurrealDB v3.0.4 Support
The system SHALL run SurrealDB version 3.0.4 with full compatibility for v3 features and syntax.

#### Scenario: Database starts with v3.0.4
- **WHEN** the database container starts
- **THEN** it SHALL use image `surrealdb/surrealdb:v3.0.4`
- **AND** the version endpoint SHALL return "3.0.4"

#### Scenario: Connection uses rocksdb backend
- **WHEN** the backend connects to database
- **THEN** it SHALL use `rocksdb:/data/esperion.db` connection string
- **AND** NOT use deprecated `file:/data/esperion.db`

#### Scenario: Database migration completed
- **WHEN** the migration from v1.5 to v3.0 is performed
- **THEN** data SHALL be exported from v1.5
- **AND** migration tool `surreal fix` SHALL convert to v2 format
- **AND** export with `--v3` flag SHALL create v3-compatible dump
- **AND** import SHALL restore all data to v3.0.4
- **AND** row counts SHALL match between source and target

#### Scenario: UPSERT statement works
- **WHEN** a query uses `UPSERT` to create or update a record
- **THEN** it SHALL create the record if not exists
- **AND** update if already exists
- **AND** not use deprecated `UPDATE` for create behavior

#### Scenario: Function uses new naming convention
- **WHEN** a query uses string functions
- **THEN** it SHALL use `string::ends_with()` (snake_case)
- **AND** NOT use `string::endsWith()` (camelCase)

#### Scenario: GraphQL endpoint accessible
- **WHEN** accessing `/api/v1/graphql`
- **THEN** the GraphQL endpoint SHALL be available
- **AND** queries SHALL execute successfully

#### Scenario: HNSW vector index available
- **WHEN** creating a vector index
- **THEN** `HNSW` index type SHALL be available
- **AND** `MTREE` SHALL be removed/unavailable

## MODIFIED Requirements

### Files to Modify for Migration

#### SQL Schema Files
- `backend/src/db/migrations/001_initial_schema.sql` - Update if function names need changes
- `backend/src/db/migrations/002_add_user_sessions.sql` - Update if function names need changes
- `backend/src/db/schema.rs` - Update INIT_SCHEMA_SQL constant

#### Rust Source Files
- `backend/src/db/mod.rs` - Update connection string from `file://` to `rocksdb://`
- `backend/Cargo.toml` - Update surrealdb crate version

#### Docker Configuration
- `docker-compose.yml` - Update image tag and command

## REMOVED Requirements

- Support for `file://` storage backend (use `rocksdb://` instead)
- `MTREE` vector index type (use `HNSW` instead)
- SurrealDB v1.5.6 image support
