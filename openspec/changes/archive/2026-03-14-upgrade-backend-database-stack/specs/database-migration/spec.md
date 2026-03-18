## ADDED Requirements

### Requirement: Database Migration from v1.5 to v3.0
The system SHALL support automated migration from SurrealDB 1.5.0 to 3.0.4 with zero data loss and rollback capability.

#### Scenario: Export from v1.5 succeeds
- **WHEN** running `surreal export backup.json` on v1.5
- **THEN** a valid JSON export file SHALL be created
- **AND** it SHALL contain all tables and records
- **AND** no errors SHALL occur

#### Scenario: Migration fix for v2.x
- **WHEN** running `surreal fix rocksdb:/data/esperion.db`
- **THEN** the data SHALL be converted for 2.x compatibility
- **AND** all records SHALL remain intact

#### Scenario: Export with v3 compatibility
- **WHEN** running `surreal export --v3 backup-v3.json`
- **THEN** a v3-compatible export SHALL be generated
- **AND** it SHALL include all data with new syntax

#### Scenario: Import to v3.0.4 succeeds
- **WHEN** importing `backup-v3.json` into v3.0.4
- **THEN** all tables SHALL be recreated
- **AND** all records SHALL be present
- **AND** indexes SHALL be rebuilt

#### Scenario: Data integrity after migration
- **WHEN** verifying migrated data
- **THEN** row counts SHALL match original
- **AND** sample records SHALL be identical
- **AND** relationships SHALL be preserved

#### Scenario: Rollback to v1.5 possible
- **WHEN** migration fails
- **THEN** the system SHALL be able to restore v1.5 backup
- **AND** original data SHALL be intact
- **AND** service SHALL resume on v1.5

## MODIFIED Requirements

None - this is a new capability.

## REMOVED Requirements

None - this is a new capability.
