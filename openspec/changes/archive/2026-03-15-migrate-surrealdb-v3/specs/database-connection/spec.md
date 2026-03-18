## ADDED Requirements

### Requirement: Rust SDK Connection Update
The Rust backend SHALL use updated connection string format for SurrealDB v3.

#### Scenario: Connection string format
- **WHEN** backend establishes database connection
- **THEN** it SHALL use `rocksdb:/data/esperion.db` format
- **AND** connection SHALL use SurrealDB v3 Rust SDK

## MODIFIED Requirements

### Requirement: Database Connection Configuration
The system SHALL update database connection from file:// to rocksdb:// protocol.

#### Scenario: Environment variables
- **WHEN** backend reads database configuration
- **THEN** connection string SHALL use `rocksdb://` protocol
- **AND** NOT use deprecated `file://` protocol

#### Scenario: Docker network connectivity
- **WHEN** backend connects to database container
- **THEN** connection SHALL succeed via Docker network
- **AND** hostname `database` SHALL resolve correctly

## REMOVED Requirements

None - file:// protocol deprecated but not removed from code (just not used).
