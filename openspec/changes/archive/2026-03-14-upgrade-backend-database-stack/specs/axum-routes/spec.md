## ADDED Requirements

None - this capability modifies existing requirements.

## MODIFIED Requirements

### Requirement: Axum Route Syntax
All Axum routes SHALL use the new 0.8 syntax with curly brace parameter notation instead of colon prefix.

#### Scenario: Route with single parameter
- **WHEN** defining a route with ID parameter
- **THEN** it SHALL use `/users/{id}` syntax
- **AND** NOT use `/users/:id` syntax
- **AND** the handler SHALL receive the parameter correctly

#### Scenario: Route with wildcard
- **WHEN** defining a catch-all route
- **THEN** it SHALL use `/files/{*path}` syntax
- **AND** NOT use `/files/*path` syntax
- **AND** the path SHALL capture all segments

#### Scenario: Route compilation succeeds
- **WHEN** compiling the backend
- **THEN** all route definitions SHALL compile without errors
- **AND** no deprecation warnings SHALL appear

#### Scenario: API endpoint responds correctly
- **WHEN** sending request to `/api/v1/users/{id}`
- **THEN** the user handler SHALL receive the ID parameter
- **AND** return the correct user data

#### Scenario: All 13 handlers accessible
- **WHEN** testing all API endpoints
- **THEN** all 13 handlers (auth, articles, works, etc.) SHALL be accessible
- **AND** each SHALL return correct responses

## REMOVED Requirements

### Requirement: Colon-prefixed route parameters
**Reason**: Axum 0.8 removed support for `:param` syntax
**Migration**: Replace all `:param` with `{param}` in route definitions

### Requirement: Asterisk wildcard patterns
**Reason**: Axum 0.8 changed wildcard syntax
**Migration**: Replace `*path` with `{*path}` in route definitions
