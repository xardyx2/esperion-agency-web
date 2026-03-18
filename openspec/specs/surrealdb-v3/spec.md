# SurrealDB v3 Specification

## Purpose

This specification defines the SurrealDB v3 capabilities for the Esperion agency web platform, including database version upgrade, v3 syntax compliance, GraphQL support, and vector indexing.

## ADDED Requirements

### ADDED Requirement: SurrealDB v3.0.4 Runtime
The system SHALL run SurrealDB version 3.0.4.

#### Scenario: Database starts with v3.0.4 image
- **WHEN** the database service starts
- **THEN** it SHALL use the surrealdb/surrealdb:3.0.4 Docker image
- **AND** the version SHALL be verified as 3.0.4 on startup
- **AND** all v3 features SHALL be available

#### Scenario: Version verification
- **WHEN** the database is running
- **THEN** running `INFO FOR ROOT` SHALL show version 3.0.4
- **AND** the version SHALL be logged on startup

### ADDED Requirement: RocksDB Storage Engine
The database connection SHALL use rocksdb:// storage engine.

#### Scenario: RocksDB connection string
- **WHEN** the database is configured
- **THEN** the connection string SHALL use rocksdb:// protocol
- **AND** NOT use file:// protocol
- **AND** data SHALL be stored in /data directory

#### Scenario: RocksDB data persistence
- **WHEN** the container restarts
- **THEN** data SHALL persist in the rocksdb storage
- **AND** no data loss SHALL occur

#### Scenario: RocksDB volume mount
- **WHEN** docker-compose.yml defines the database service
- **THEN** a named volume SHALL be mounted to /data
- **AND** the volume SHALL use rocksdb:// path

### ADDED Requirement: v3 SQL Syntax Compliance
All SQL queries SHALL use SurrealDB v3 syntax without deprecated features.

#### Scenario: Query uses UPSERT instead of UPDATE for create-or-update
- **WHEN** creating or updating a record
- **THEN** the UPSERT statement SHALL be used
- **AND** NOT use UPDATE with IF NOT EXISTS pattern
- **AND** the syntax SHALL be: `UPSERT INTO table:id CONTENT { ... }`

#### Scenario: Function uses new naming string::ends_with
- **WHEN** using string functions
- **THEN** function names SHALL use snake_case (v3 style)
- **AND** string::ends_with SHALL be used (not endsWith)
- **AND** string::starts_with SHALL be used (not startsWith)
- **AND** string::contains SHALL be used (not includes)

#### Scenario: No deprecated features
- **WHEN** queries are executed
- **THEN** no deprecated v1/v2 syntax SHALL be used
- **AND** all functions SHALL use v3 naming conventions
- **AND** queries SHALL pass v3 validation

### ADDED Requirement: GraphQL Query Support
The database SHALL support GraphQL queries (stable in v3).

#### Scenario: GraphQL endpoint accessible
- **WHEN** the database is running
- **THEN** the GraphQL endpoint SHALL be accessible at /graphql
- **AND** GraphQL queries SHALL be executable
- **AND** schema introspection SHALL work

#### Scenario: GraphQL query execution
- **WHEN** a GraphQL query is sent
- **THEN** the database SHALL return valid GraphQL response
- **AND** queries SHALL support filtering and pagination
- **AND** mutations SHALL be supported

#### Scenario: GraphQL schema mapping
- **WHEN** tables are defined
- **THEN** they SHALL be automatically mapped to GraphQL types
- **AND** relationships SHALL be exposed in GraphQL schema

### ADDED Requirement: HNSW Vector Indexes
HNSW (Hierarchical Navigable Small World) vector indexes SHALL be available.

#### Scenario: Vector index creation
- **WHEN** a vector field is defined
- **THEN** an HNSW index SHALL be creatable on the field
- **AND** the syntax SHALL be: `DEFINE INDEX idx ON TABLE FIELDS field HNSW DIMENSION n`
- **AND** vector similarity searches SHALL be supported

#### Scenario: Vector similarity search
- **WHEN** querying with vector data
- **THEN** nearest neighbor search SHALL be available
- **AND** results SHALL be ordered by similarity score
- **AND** performance SHALL be optimized for high-dimensional vectors

#### Scenario: Vector index configuration
- **WHEN** creating an HNSW index
- **THEN** parameters SHALL be configurable:
  - DIMENSION (vector size)
  - EF_CONSTRUCTION (indexing speed vs accuracy)
  - EF (query speed vs accuracy)
  - M (max connections per layer)

### ADDED Requirement: Migration from v1.5
Migration from SurrealDB v1.5 to v3.0.4 SHALL complete without errors.

#### Scenario: Migration from v1.5 completes without errors
- **WHEN** migrating from v1.5.6 to v3.0.4
- **THEN** the migration SHALL complete successfully
- **AND** all data SHALL be preserved
- **AND** all schemas SHALL be migrated
- **AND** no manual intervention SHALL be required

#### Scenario: Schema migration
- **WHEN** database schemas are migrated
- **THEN** all table definitions SHALL be converted to v3 syntax
- **AND** all field definitions SHALL be updated
- **AND** all indexes SHALL be recreated with v3 syntax

#### Scenario: Data migration
- **WHEN** data is migrated
- **THEN** all records SHALL be preserved
- **AND** data types SHALL be converted if needed
- **AND** relationships SHALL remain intact

#### Scenario: Query migration
- **WHEN** existing queries are run on v3
- **THEN** they SHALL be updated to v3 syntax
- **AND** deprecated functions SHALL be replaced
- **AND** queries SHALL execute without errors
