## Why

The frontend dependency graph is currently inconsistent: `package.json` points some packages at newer ranges while `package-lock.json` and installed modules still resolve to the Nuxt 3.20.2 line. This creates avoidable risk for local installs, CI reproducibility, and future module decisions because the declared target and the actual runtime baseline do not match.

## What Changes

### Goals
- Align frontend dependency declarations, lockfile reality, and documented runtime around the current Nuxt 3 baseline.
- Upgrade only packages that are demonstrably compatible with the existing Nuxt 3.20.2 stack.
- Remove ambiguity around which versions are authoritative for local development and Docker builds.
- Record the supported dependency policy for future Nuxt module work.

### Non-Goals
- No Nuxt 4 migration.
- No broad UI refactors or feature work.
- No addition of new frontend modules beyond what is needed to stabilize the current stack.

### Planned Changes
- Normalize `package.json`, `package-lock.json`, and installed versions so they all describe the same Nuxt 3 target.
- Apply low-risk, Nuxt-3-compatible dependency updates where they reduce drift or known tooling mismatch.
- Update project documentation that currently implies a different Nuxt version baseline.
- Add verification steps so dependency health can be checked consistently before future upgrades.

## Capabilities

### New Capabilities
- `frontend-dependency-health`: Defines how the frontend dependency baseline is declared, validated, and kept consistent across package manifests, lockfiles, and documented runtime expectations.

### Modified Capabilities
- `local-docker-deployment`: Clarify that local frontend dependency installation and Docker-based execution must resolve the same supported Nuxt line.

## Impact

- Affected code: `frontend/package.json`, `frontend/package-lock.json`, frontend tooling config, and project documentation that references the frontend framework baseline.
- Affected systems: local installs, Docker builds, CI reproducibility, and future Nuxt module evaluations.
- Dependencies: Nuxt core and selected Nuxt 3-compatible module/tooling packages.
