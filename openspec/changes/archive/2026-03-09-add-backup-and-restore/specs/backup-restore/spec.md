## ADDED Requirements

### Requirement: Scheduled Backup Management
The system SHALL support scheduled backup execution with retention policy controls.

#### Scenario: Admin configures backup schedule
- **WHEN** an admin configures a backup schedule and retention policy
- **THEN** the system SHALL apply that schedule and retain backups according to the configured policy

### Requirement: Selective Restore Safety
The system SHALL support selective restore operations with explicit confirmation and scope visibility.

#### Scenario: Admin restores selected scope
- **WHEN** an admin chooses a restore scope
- **THEN** the system SHALL present the affected scope clearly before executing the restore

### Requirement: Backup Dashboard Uses Real History
The backup dashboard SHALL display real backup history and restore state instead of placeholder settings.

#### Scenario: Admin opens backup settings
- **WHEN** the backup dashboard loads
- **THEN** it SHALL render real backup history, schedule, and restore controls
