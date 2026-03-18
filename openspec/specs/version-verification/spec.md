# Version Verification Capability

## Context

The project requires reliable version verification scripts to display frontend and backend dependency versions. This capability ensures developers can quickly audit dependency states, verify upgrade outcomes, and maintain version documentation accuracy. Scripts must be executable via bun/npm and use appropriate package manager commands for each stack.

## Requirements

### Requirement: Version Check Scripts Exist
The repository SHALL provide version check scripts accessible via package manager commands.

#### Scenario: Script versions:check exists in package.json
- **WHEN** developers need to verify all dependency versions
- **THEN** a `versions:check` script SHALL be defined in `package.json`
- **AND** the script SHALL be executable via `bun run versions:check` or `npm run versions:check`

#### Scenario: Script shows all dependency versions
- **WHEN** the `versions:check` script is executed
- **THEN** it SHALL display frontend dependency versions from `package.json` / lockfile
- **AND** it SHALL display backend dependency versions from `Cargo.toml` / `Cargo.lock`
- **AND** the output SHALL be formatted for readability

### Requirement: Frontend Version Verification
Scripts SHALL exist to display frontend dependency versions only.

#### Scenario: Script versions:frontend shows frontend only
- **WHEN** developers need to verify frontend versions only
- **THEN** a `versions:frontend` script SHALL be defined in `package.json`
- **AND** the script SHALL display Nuxt framework version
- **AND** the script SHALL display all major dependencies (@nuxt/* modules, Vue, TypeScript, etc.)
- **AND** the script SHALL use `bun pm ls` or `npm list` command

#### Scenario: Frontend script returns accurate versions
- **WHEN** the `versions:frontend` script executes
- **THEN** displayed versions SHALL match actual installed versions from lockfile
- **AND** the output SHALL NOT contain unresolved or missing dependencies

### Requirement: Backend Version Verification
Scripts SHALL exist to display backend dependency versions only.

#### Scenario: Script versions:backend shows backend only
- **WHEN** developers need to verify backend versions only
- **THEN** a `versions:backend` script SHALL be defined in `package.json`
- **AND** the script SHALL execute `cargo tree` to display Rust dependency tree
- **AND** the output SHALL show major crates (axum, surrealdb, tokio, etc.) with versions

#### Scenario: Backend script returns accurate versions
- **WHEN** the `versions:backend` script executes
- **THEN** displayed versions SHALL match actual resolved versions from `Cargo.lock`
- **AND** the output SHALL NOT contain unresolved or conflicting dependencies

### Requirement: Package Manager Integration
Scripts SHALL use appropriate package manager commands for each technology stack.

#### Scenario: Scripts use bun pm ls or cargo tree
- **WHEN** frontend versions are checked
- **THEN** the script SHALL use `bun pm ls` for bun or `npm list --depth=0` for npm
- **WHEN** backend versions are checked
- **THEN** the script SHALL use `cargo tree --depth=1` to show top-level dependencies

#### Scenario: Scripts are runnable via bun/npm
- **WHEN** a developer runs `bun run versions:*` or `npm run versions:*`
- **THEN** all version scripts SHALL execute without errors
- **AND** the scripts SHALL work in both bun and npm environments

## Verification

### Verification Criteria
1. `package.json` contains `versions:check`, `versions:frontend`, and `versions:backend` scripts
2. Running `bun run versions:check` displays both frontend and backend versions
3. Running `bun run versions:frontend` displays only frontend dependencies
4. Running `bun run versions:backend` displays only backend dependencies via `cargo tree`
5. All scripts return exit code 0 on success
6. Output shows actual installed versions, not just declared versions

### Verification Commands
```bash
# Verify scripts exist in package.json
cat package.json | grep -A 20 '"scripts"'

# Test frontend version check
bun run versions:frontend

# Test backend version check
bun run versions:backend

# Test combined version check
bun run versions:check
```
