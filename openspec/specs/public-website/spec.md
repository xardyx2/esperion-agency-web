## ADDED Requirements

### Requirement: Public Website Behavior Survives Module Cleanup
Frontend module cleanup SHALL preserve the current behavior of public website routes.

#### Scenario: Public pages continue to render
- **WHEN** verified unused Nuxt modules are removed from the frontend stack
- **THEN** public routes SHALL continue to render the same content and navigation behavior expected before the cleanup

#### Scenario: Existing public SEO output remains intact
- **WHEN** verified unused Nuxt modules are removed
- **THEN** the public website SHALL continue to expose existing sitemap, robots, and structured-data behavior that is already in active use
