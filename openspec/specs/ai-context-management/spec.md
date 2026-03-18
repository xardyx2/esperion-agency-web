# AI Context Management Specification

## Purpose

This specification defines the AI context management capability for the Esperion agency web platform, ensuring consistent AI interactions, version awareness, and clear guidelines for AI-assisted development.

## ADDED Requirements

### ADDED Requirement: .ai-context.md File Existence
The system SHALL have a `.ai-context.md` file at the project root.

#### Scenario: File exists at project root
- **WHEN** the repository is cloned
- **THEN** `.ai-context.md` SHALL exist at the project root
- **AND** the file SHALL be committed to version control
- **AND** the file SHALL be in markdown format

### ADDED Requirement: AI Interaction Guidelines
The `.ai-context.md` file SHALL document clear AI interaction guidelines.

#### Scenario: AI guidelines are clear
- **WHEN** a developer reads `.ai-context.md`
- **THEN** they SHALL find explicit guidelines for AI interactions
- **AND** the guidelines SHALL specify expected AI behavior
- **AND** the guidelines SHALL include project-specific conventions
- **AND** the guidelines SHALL be understandable without external references

### ADDED Requirement: Version Check Commands
The `.ai-context.md` file SHALL include version check commands.

#### Scenario: Version commands are documented
- **WHEN** `.ai-context.md` is reviewed
- **THEN** it SHALL contain commands to check project versions
- **AND** the commands SHALL cover frontend dependencies
- **AND** the commands SHALL cover backend dependencies
- **AND** the commands SHALL cover infrastructure versions
- **AND** each command SHALL be executable and verified

### ADDED Requirement: Training Data Limitations Warning
The `.ai-context.md` file SHALL warn about AI training data limitations.

#### Scenario: Training data warning is present
- **WHEN** `.ai-context.md` is read
- **THEN** a warning about AI training data cutoff SHALL be present
- **AND** the warning SHALL explain that AI may not know recent changes
- **AND** the warning SHALL advise verifying AI suggestions against current codebase
- **AND** the warning SHALL be prominently placed (near the top of the file)

### ADDED Requirement: File Locations for Version Info
The `.ai-context.md` file SHALL list file locations where version information is stored.

#### Scenario: File locations are listed
- **WHEN** `.ai-context.md` is examined
- **THEN** it SHALL list paths to version tracking files
- **AND** the locations SHALL include `ESPERION_VERSIONS.md`
- **AND** the locations SHALL include `frontend/package.json`
- **AND** the locations SHALL include `backend/Cargo.toml`
- **AND** the locations SHALL include `docker-compose.yml`
- **AND** each location SHALL be described with its purpose
