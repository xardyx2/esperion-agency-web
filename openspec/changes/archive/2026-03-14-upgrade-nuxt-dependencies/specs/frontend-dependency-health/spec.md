## ADDED Requirements

### Requirement: Frontend Dependency Baseline Consistency
The frontend dependency baseline SHALL resolve to Nuxt 4.x across package declarations, lockfiles, and installed modules.

#### Scenario: Declared and locked framework versions agree
- **WHEN** frontend dependency manifests are reviewed
- **THEN** `package.json` and `bun.lock` SHALL target Nuxt 4.x
- **AND** the declared version policy SHALL match the runtime line used by the project

#### Scenario: Installed packages do not report invalid top-level drift
- **WHEN** the frontend dependency tree is validated
- **THEN** top-level framework and Nuxt-module packages SHALL NOT be reported as invalid because of manifest versus lockfile mismatch

### Requirement: Nuxt 4 Compatibility Verification
Frontend dependencies SHALL be compatible with Nuxt 4.x runtime.

#### Scenario: Safe updates remain on Nuxt 4 compatibility line
- **WHEN** a Nuxt-related dependency is updated as part of maintenance
- **THEN** the selected version SHALL remain compatible with Nuxt 4.x

#### Scenario: Major-version drift is controlled
- **WHEN** an available dependency version would force a different major compatibility line
- **THEN** that version SHALL NOT be adopted unless explicitly planned

### Requirement: Dependency Health Verification Is Repeatable
The repository SHALL define a repeatable verification flow for frontend dependency health after manifest or lockfile changes.

#### Scenario: Verification checks are documented
- **WHEN** dependency maintenance is completed
- **THEN** the repository SHALL document the commands or checks used to validate install state, typing, and build behavior

#### Scenario: Verification catches dependency regressions
- **WHEN** a dependency change introduces install or compatibility problems
- **THEN** the verification flow SHALL surface the failure before the change is considered complete
