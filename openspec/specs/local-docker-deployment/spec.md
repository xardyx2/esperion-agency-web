## ADDED Requirements

### Requirement: Frontend Dependency Inputs Match The Verified Runtime
The local Docker workflow SHALL use frontend dependency inputs that match the verified Nuxt 4.x dependency baseline in the repository.

#### Scenario: Docker frontend uses aligned manifests
- **WHEN** the frontend service is built or started for local Docker development
- **THEN** the dependency manifests used by the container SHALL match the verified Nuxt 4.x dependency baseline in the repository

#### Scenario: Documentation reflects the same frontend baseline
- **WHEN** a developer follows local Docker or frontend setup documentation
- **THEN** the documented frontend framework line SHALL match the verified Nuxt 4.x baseline used by the containerized workflow

## ADDED Requirements

### Requirement: Frontend Dev Container SHALL Synchronize Runtime Dependencies Before Nuxt Startup
The local Docker frontend workflow SHALL ensure that the runtime dependency tree inside the frontend container matches the current frontend dependency manifests before `nuxt dev` loads Nuxt modules.

#### Scenario: Newly added Nuxt module is available at runtime
- **WHEN** a developer adds a new frontend dependency or Nuxt module and starts or recreates the frontend development container
- **THEN** the frontend container SHALL synchronize runtime dependencies from the current manifests before Nuxt starts
- **AND** the Nuxt dev server SHALL NOT fail with a missing-module startup error caused by stale container `node_modules`

#### Scenario: Runtime dependency sync is visible in logs
- **WHEN** the frontend development container boots
- **THEN** the startup flow SHALL emit a clear dependency-sync step before launching the Nuxt dev server

### Requirement: Frontend Dev Container Recovery SHALL Be Documented
The local Docker workflow SHALL define a documented recovery path for dependency-volume drift in the frontend container.

#### Scenario: Developer encounters stale dependency volume
- **WHEN** the frontend container runtime no longer matches the repository dependency manifests
- **THEN** the repository SHALL document the supported recovery steps needed to refresh the frontend runtime dependencies or recreate the affected container state
