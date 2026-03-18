## ADDED Requirements

### Requirement: Explicit Local Recovery Modes
The system SHALL provide an explicit local SurrealDB recovery workflow for the root Docker Compose stack that supports both preserve-data migration and fresh-reset recovery.

#### Scenario: Developer chooses preserve-data recovery
- **WHEN** a developer needs to recover a legacy local `surreal-data` volume
- **THEN** the workflow SHALL provide a preserve-data path
- **AND** it SHALL describe that the path uses staged migration rather than direct v3 startup

#### Scenario: Developer chooses fresh-reset recovery
- **WHEN** a developer confirms that old local database contents can be discarded
- **THEN** the workflow SHALL provide a reset path that recreates the database volume for v3 startup
- **AND** it SHALL state clearly that previous local data will not be preserved by that path

### Requirement: Backup-First Recovery Safety
The preserve-data recovery workflow SHALL protect the original local data before any destructive or format-changing step is attempted.

#### Scenario: Source data is backed up before migration
- **WHEN** preserve-data recovery begins
- **THEN** the workflow SHALL create a timestamped backup outside the active local database volume
- **AND** the backup SHALL be kept available until recovery succeeds or is abandoned

#### Scenario: Migration failure does not destroy the only source copy
- **WHEN** any preserve-data migration step fails
- **THEN** the original backup SHALL remain restorable
- **AND** the workflow SHALL NOT overwrite the only recoverable copy of the legacy local data

### Requirement: Official Sequential Upgrade Path
The preserve-data recovery workflow SHALL use the supported SurrealDB 1.x -> 2.x -> 3.x path instead of treating direct 1.x -> 3.x startup as valid.

#### Scenario: Legacy 1.x data is repaired for 2.x first
- **WHEN** legacy version 1 storage is encountered
- **THEN** the workflow SHALL run a SurrealDB 2.x repair step before any 3.x import step
- **AND** it SHALL NOT declare direct mounting of 1.x storage into 3.x as a supported recovery path

#### Scenario: 2.x data is exported for v3 import
- **WHEN** the 2.x repair step succeeds
- **THEN** the workflow SHALL produce a v3-compatible export artifact for import into a clean 3.x target
- **AND** the clean 3.x target SHALL be populated through import rather than by booting the old storage in place

### Requirement: Post-Recovery Stack Verification
Recovery SHALL only be considered complete once the root local Docker stack is verified again end-to-end.

#### Scenario: Database, backend, and frontend are rechecked
- **WHEN** local recovery finishes
- **THEN** the database service SHALL start successfully in the root Compose stack
- **AND** the backend health endpoint SHALL respond successfully
- **AND** the frontend SHALL return an HTTP response on its documented host port

### Requirement: Cold-Build-Aware Verification
Recovery verification SHALL distinguish between a failed backend startup and a backend that is still rebuilding after database recovery.

#### Scenario: Backend is still compiling after database recovery
- **WHEN** the database service is healthy but the backend is still in a cold-build phase
- **THEN** the verification flow SHALL continue using a documented timeout and retry budget before declaring failure
- **AND** it SHALL surface that backend readiness is still pending instead of misclassifying the recovery as a database failure

#### Scenario: Backend never becomes ready inside the verification budget
- **WHEN** the backend health endpoint does not respond within the documented readiness budget
- **THEN** the verification result SHALL report the backend as the blocking stage
- **AND** it SHALL keep the successful database recovery result distinct from the downstream application-readiness failure
