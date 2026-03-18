## ADDED Requirements

### Requirement: Frontend Dependency Inputs Match The Verified Runtime
The local Docker workflow SHALL use frontend dependency inputs that match the verified Nuxt 4.x dependency baseline in the repository.

#### Scenario: Docker frontend uses aligned manifests
- **WHEN** the frontend service is built or started for local Docker development
- **THEN** the dependency manifests used by the container SHALL match the verified Nuxt 4.x dependency baseline in the repository

#### Scenario: Documentation reflects the same frontend baseline
- **WHEN** a developer follows local Docker or frontend setup documentation
- **THEN** the documented frontend framework line SHALL match the verified Nuxt 4.x baseline used by the containerized workflow
