## MODIFIED Requirements

### Requirement: Hero Banner Display
All public pages SHALL display a hero banner with clear, visible title text.

#### Scenario: Articles page banner
- **WHEN** the user views the articles page
- **THEN** a hero banner displays with title "Articles"
- **AND** subtitle "Insight, pembelajaran, dan pembaruan dari tim Esperion" is visible
- **AND** the banner has a background image

#### Scenario: Works page banner
- **WHEN** the user views the works page
- **THEN** a hero banner displays with title "Our Works"
- **AND** subtitle describing the portfolio is visible
- **AND** the banner has a background image

#### Scenario: Services page banner
- **WHEN** the user views the services page
- **THEN** a hero banner displays with title "Our Services"
- **AND** subtitle describing services is visible
- **AND** the banner has a background image

#### Scenario: About page banner
- **WHEN** the user views the about page
- **THEN** a hero banner displays with title "About Us"
- **AND** subtitle describing the agency is visible
- **AND** the banner has a background image

#### Scenario: Banner text visibility
- **GIVEN** a hero banner is displayed
- **WHEN** the page renders
- **THEN** the title text is clearly readable with proper contrast
- **AND** text has shadow or overlay for visibility against background
