## ADDED Requirements

### Requirement: AI Interaction Guidelines
The system SHALL provide .ai-context.md with guidelines for AI assistants to prevent version hallucination.

#### Scenario: AI context file exists
- **WHEN** an AI assistant starts working on the project
- **THEN** .ai-context.md SHALL exist at project root
- **AND** it SHALL be in markdown format

#### Scenario: Guidelines are documented
- **WHEN** reading .ai-context.md
- **THEN** it SHALL contain explicit instructions to check files
- **AND** it SHALL warn about training data limitations

#### Scenario: Version check commands provided
- **WHEN** reading .ai-context.md
- **THEN** it SHALL list commands to check current versions
- **AND** commands SHALL include bun pm ls, cargo tree
- **AND** it SHALL specify which files to read

#### Scenario: File locations documented
- **WHEN** reading .ai-context.md
- **THEN** it SHALL list locations of version info:
  - frontend/package.json
  - backend/Cargo.toml
  - docker-compose.yml
  - ESPERION_VERSIONS.md

#### Scenario: Best practices included
- **WHEN** reading .ai-context.md
- **THEN** it SHALL include "Always check files first" principle
- **AND** it SHALL include verification steps

## MODIFIED Requirements

None - this is a new capability.

## REMOVED Requirements

None - this is a new capability.
