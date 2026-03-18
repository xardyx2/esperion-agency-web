## ADDED Requirements

### Requirement: The Frontend SHALL Expose a Scalar API Reference UI
The Nuxt application SHALL expose a Scalar-based API reference route backed by the backend OpenAPI document.

#### Scenario: API reference loads from backend OpenAPI source
- **WHEN** a developer opens the configured API reference route
- **THEN** the page SHALL load a Scalar interface sourced from the backend OpenAPI JSON endpoint

#### Scenario: API reference route is discoverable
- **WHEN** the project documents or navigates to the API reference entrypoint
- **THEN** the route SHALL resolve inside the Nuxt application without requiring a separate docs server

### Requirement: API Reference Failures SHALL Be Recoverable
The API reference experience SHALL fail gracefully when the upstream OpenAPI document is unavailable.

#### Scenario: OpenAPI source is unavailable
- **WHEN** the backend OpenAPI document cannot be fetched
- **THEN** the API reference route SHALL render a clear error or unavailable state instead of a blank or broken page

#### Scenario: API reference remains read-only
- **WHEN** a user browses the Scalar interface
- **THEN** the route SHALL present documentation behavior without mutating backend data by default
