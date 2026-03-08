## ADDED Requirements

### Requirement: Canonical Public Route Ownership
The system SHALL define one authoritative public page tree and SHALL not allow duplicate route definitions to remain as competing sources for the same public routes.

#### Scenario: Duplicate page tree exists
- **WHEN** the frontend contains multiple page trees that can define the same public routes
- **THEN** one tree SHALL be declared authoritative and the other SHALL be removed from route ownership or otherwise prevented from drifting the public route contract

### Requirement: Slug-Resolved Article Detail
The system SHALL render article detail content according to the requested article slug rather than a static default article.

#### Scenario: User opens different article slugs
- **WHEN** a user opens two different article detail URLs with different slugs
- **THEN** each page SHALL resolve and render the article represented by its own slug

#### Scenario: Requested article slug does not resolve
- **WHEN** a requested article slug does not match an available article
- **THEN** the system SHALL return the defined not-found behavior for public article detail pages

### Requirement: Slug-Resolved Service Detail
The system SHALL render service detail content according to the requested service slug rather than a static default service.

#### Scenario: User opens different service slugs
- **WHEN** a user opens two different service detail URLs with different slugs
- **THEN** each page SHALL resolve and render the service represented by its own slug

#### Scenario: Requested service slug does not resolve
- **WHEN** a requested service slug does not match an available service
- **THEN** the system SHALL return the defined not-found behavior for public service detail pages

### Requirement: Featured Work Slug Integrity
The system SHALL use one consistent slug contract for featured works on the homepage, works listing pages, and work detail pages.

#### Scenario: User clicks a featured work from the homepage
- **WHEN** a user clicks a featured work card on the homepage
- **THEN** the generated work detail URL SHALL use the same slug identity as the corresponding work in the works listing flow

### Requirement: Locale-Aware Public Navigation
The system SHALL generate public internal links in a way that is consistent with the configured i18n prefix strategy.

#### Scenario: User navigates between public pages
- **WHEN** a user clicks a public navigation, footer, listing, or detail link
- **THEN** the destination path SHALL follow the configured locale-aware public routing strategy

#### Scenario: Route rules are reviewed against navigable paths
- **WHEN** maintainers compare public route rules with actual generated links
- **THEN** the public routes covered by ISR and sitemap configuration SHALL match the navigable locale-aware paths
