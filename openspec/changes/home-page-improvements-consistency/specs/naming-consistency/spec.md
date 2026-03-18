## MODIFIED Requirements

### Requirement: Consistent Page Naming
All pages SHALL have consistent naming across navigation, page titles, and URLs.

#### Scenario: Works page naming consistency
- **GIVEN** the works page
- **WHEN** viewing navigation, page title, and URL
- **THEN** all use "Our Works" (not "Our Portfolio")
- **AND** URL is /our-works

#### Scenario: Services page naming consistency
- **GIVEN** the services page
- **WHEN** viewing navigation, page title, and URL
- **THEN** all use "Our Services"
- **AND** URL is /our-services

#### Scenario: Articles page naming consistency
- **GIVEN** the articles page
- **WHEN** viewing navigation, page title, and URL
- **THEN** all use "Articles"
- **AND** URL is /articles

#### Scenario: About page naming consistency
- **GIVEN** the about page
- **WHEN** viewing navigation, page title, and URL
- **THEN** all use "About Us" or "About"
- **AND** URL is /about

#### Scenario: Contact page naming consistency
- **GIVEN** the contact page
- **WHEN** viewing navigation, page title, and URL
- **THEN** all use "Contact Us"
- **AND** URL is /contact-us
