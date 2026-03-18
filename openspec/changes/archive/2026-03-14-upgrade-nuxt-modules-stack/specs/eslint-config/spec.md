## ADDED Requirements

None - this capability modifies existing requirements.

## MODIFIED Requirements

### Requirement: ESLint Flat Configuration
The ESLint configuration SHALL use the flat config format (eslint.config.ts) instead of legacy .eslintrc format.

#### Scenario: Flat config file exists
- **WHEN** the project loads
- **THEN** an eslint.config.ts file SHALL exist in frontend directory
- **AND** it SHALL export a configuration array using defineConfig

#### Scenario: No legacy ESLint files
- **WHEN** the project loads
- **THEN** no .eslintrc, .eslintrc.cjs, or .eslintrc.json files SHALL exist
- **AND** no legacy ESLint configuration SHALL be present

#### Scenario: Existing rules preserved
- **WHEN** ESLint runs with new flat config
- **THEN** all existing rules from .eslintrc SHALL be preserved
- **AND** Vue, TypeScript, and Nuxt specific rules SHALL be configured

#### Scenario: Zero ESLint errors
- **WHEN** running "bun run lint"
- **THEN** zero ESLint errors SHALL be reported
- **AND** any auto-fixable issues SHALL be automatically fixed

#### Scenario: CI/CD passes lint check
- **WHEN** CI/CD pipeline runs
- **THEN** the lint step SHALL pass with new flat config
- **AND** no configuration errors SHALL occur

## REMOVED Requirements

### Requirement: Legacy .eslintrc configuration
**Reason**: @nuxt/eslint v1 requires flat config format only
**Migration**: Contents migrated to eslint.config.ts, .eslintrc file deleted
