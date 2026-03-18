# Database Migration

## Summary

Capability for migrating database across versions with zero data loss and full reversibility.

## Requirements

### ADDED

- **REQ-DM-001**: Migration SHALL complete with zero data loss
- **REQ-DM-002**: All tables SHALL be migrated
- **REQ-DM-003**: All records SHALL be preserved
- **REQ-DM-004**: Indexes SHALL be rebuilt
- **REQ-DM-005**: Migration SHALL be reversible

## Scenarios

#### Export from v1.5 succeeds

Given database at version 1.5
When export command is executed
Then export file is generated without errors

#### Surreal fix converts data for 2.x

Given export file from v1.5
When surreal fix command is run with target version 2.x
Then data is converted to compatible format for version 2.x

#### Export with --v3 flag generates valid file

Given database at any supported version
When export command is executed with --v3 flag
Then output file conforms to version 3 schema format

#### Import to v3.0.4 succeeds

Given export file in version 3 format
When import command targets version 3.0.4
Then all data is imported without errors

#### All data present after migration

Given source database with known record counts
When migration completes
Then destination database contains identical record counts for all tables

#### Rollback to v1.5 possible

Given migrated database at version 2.x or 3.x
When rollback procedure is initiated
Then database returns to functional state at version 1.5 with all original data
