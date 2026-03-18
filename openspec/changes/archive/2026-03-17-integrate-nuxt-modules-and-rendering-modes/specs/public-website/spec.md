## ADDED Requirements

### Requirement: Public Routes SHALL Use SWR Cache Rules
Production public website routes SHALL use stale-while-revalidate route rules instead of the current ISR-only rule set.

#### Scenario: Direct request to a public route uses SWR behavior
- **WHEN** a production request reaches a configured public page such as home, article, service, work, about, contact, or legal content
- **THEN** the route SHALL be served under a `swr` route rule with a defined revalidation window

#### Scenario: Locale variants keep the same cache policy family
- **WHEN** the same public page is requested under `/id/**` or `/en/**`
- **THEN** the locale-specific route SHALL follow the same SWR policy grouping intended for that content type

### Requirement: Dashboard Routes SHALL Remain Client-Rendered
The public rendering update SHALL NOT change the dashboard's client-rendered route behavior.

#### Scenario: Dashboard route stays CSR
- **WHEN** a user opens a route under `/dashboard/**`
- **THEN** the route SHALL continue to use `ssr: false`

#### Scenario: Capital route stays CSR
- **WHEN** a user opens a route under `/capital/**`
- **THEN** the route SHALL continue to use `ssr: false`

### Requirement: Public Rendering Changes SHALL Preserve SEO-Friendly Responses
Moving public routes to SWR SHALL preserve server-rendered public HTML and existing SEO-critical behavior.

#### Scenario: Public page still returns server-rendered content
- **WHEN** a crawler or direct browser request fetches a public page after the SWR migration
- **THEN** the route SHALL continue to return server-rendered HTML content suitable for sitemap, robots, and metadata consumers
