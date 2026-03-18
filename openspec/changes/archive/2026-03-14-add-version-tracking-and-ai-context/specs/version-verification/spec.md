## ADDED Requirements

### Requirement: Version Check Scripts
The system SHALL provide package.json scripts for quick version verification.

#### Scenario: Check all versions script exists
- **WHEN** running `bun run versions:check`
- **THEN** it SHALL display all dependency versions
- **AND** it SHALL use `bun pm ls` command
- **AND** it SHALL return 0 exit code on success

#### Scenario: Frontend version script exists
- **WHEN** running `bun run versions:frontend`
- **THEN** it SHALL display frontend dependency versions
- **AND** it SHALL show key packages (nuxt, @nuxt/*)
- **AND** it SHALL use `cat package.json | grep` or similar

#### Scenario: Backend version script exists
- **WHEN** running `bun run versions:backend`
- **THEN** it SHALL display backend crate versions
- **AND** it SHALL run `cargo tree -p` for key crates
- **AND** it SHALL show surrealdb, axum, jsonwebtoken versions

#### Scenario: Scripts are accurate
- **WHEN** comparing script output to package.json
- **THEN** displayed versions SHALL match actual installed versions
- **AND** scripts SHALL not show outdated information

## MODIFIED Requirements

None - this is a new capability.

## REMOVED Requirements

None - this is a new capability.
