## ADDED Requirements

### Requirement: Infinite Looping Works Carousel
The home page works section SHALL display an infinite looping carousel showing 3 works at a time with 5 total works.

#### Scenario: Display 3 works at a time
- **WHEN** the user views the home page works section
- **THEN** exactly 3 work cards are displayed simultaneously

#### Scenario: Navigate with arrows
- **WHEN** the user clicks the next arrow
- **THEN** the carousel slides to show the next 3 works (with wrap-around)

#### Scenario: Infinite looping
- **WHEN** the user is at the last set of works and clicks next
- **THEN** the carousel loops back to show the first 3 works

#### Scenario: Total works count
- **GIVEN** there are 5 featured works available
- **WHEN** the carousel displays
- **THEN** all 5 works are included in the rotation
