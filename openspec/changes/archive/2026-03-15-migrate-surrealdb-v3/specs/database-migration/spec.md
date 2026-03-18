## ADDED Requirements

### Requirement: Database Export from v1.5
The system SHALL export all data from SurrealDB v1.5 before migration.

#### Scenario: Production database backup
- **WHEN** migration starts
- **THEN** system SHALL create full export: `surreal export production-v1.5.surql`
- **AND** export SHALL include all tables, records, and metadata
- **AND** export file SHALL be stored securely with timestamp

#### Scenario: Staging database backup
- **WHEN** testing migration on staging
- **THEN** system SHALL export staging data
- **AND** export SHALL be used for migration testing

### Requirement: Migration Tool Execution
The system SHALL use SurrealDB's official migration tool to convert data format.

#### Scenario: Run surreal fix command
- **WHEN** executing migration
- **THEN** system SHALL run `surreal fix rocksdb:/data/esperion.db`
- **AND** tool SHALL convert from v1.5 format to v2 format
- **AND** process SHALL complete without errors

#### Scenario: Export with v3 format
- **WHEN** v2 conversion completes
- **THEN** system SHALL export with `--v3` flag
- **AND** output SHALL be v3-compatible format

### Requirement: Database Import to v3
The system SHALL import converted data into fresh v3.0.4 instance.

#### Scenario: Import v3 format data
- **WHEN** v3 container is ready
- **THEN** system SHALL run `surreal import production-v3.surql`
- **AND** all records SHALL be restored
- **AND** indexes SHALL be recreated

#### Scenario: Data integrity verification
- **WHEN** import completes
- **THEN** row counts SHALL match source database
- **AND** sample queries SHALL return correct data
- **AND** all tables SHALL be accessible

### Requirement: Rollback Capability
The system SHALL support rollback to v1.5 if migration fails.

#### Scenario: Rollback trigger
- **WHEN** migration fails or data corruption detected
- **THEN** system SHALL be able to restore v1.5 from backup
- **AND** rollback SHALL complete within 30 minutes

#### Scenario: Rollback verification
- **WHEN** rollback completes
- **THEN** application SHALL function with v1.5 database
- **AND** no data loss SHALL occur

## MODIFIED Requirements

None - migration is a new capability.

## REMOVED Requirements

None.
