## ADDED Requirements

### Requirement: Centralized Version Documentation
The system SHALL maintain ESPERION_VERSIONS.md as the single source of truth for all dependency versions.

#### Scenario: Version file exists
- **WHEN** checking project documentation
- **THEN** ESPERION_VERSIONS.md SHALL exist at project root
- **AND** it SHALL be in markdown format

#### Scenario: Frontend versions documented
- **WHEN** reading ESPERION_VERSIONS.md
- **THEN** it SHALL contain a table of frontend dependencies
- **AND** versions SHALL match frontend/package.json

#### Scenario: Backend versions documented
- **WHEN** reading ESPERION_VERSIONS.md
- **THEN** it SHALL contain a table of backend crates
- **AND** versions SHALL match backend/Cargo.toml

#### Scenario: Docker versions documented
- **WHEN** reading ESPERION_VERSIONS.md
- **THEN** it SHALL contain Docker image versions
- **AND** versions SHALL match docker-compose.yml

#### Scenario: Documentation is current
- **WHEN** checking ESPERION_VERSIONS.md
- **THEN** it SHALL include a "Last Updated" timestamp
- **AND** the timestamp SHALL be recent (within current sprint)
- **AND** it SHALL include the author who updated it

## MODIFIED Requirements

None - this is a new capability.

## REMOVED Requirements

None - this is a new capability.
