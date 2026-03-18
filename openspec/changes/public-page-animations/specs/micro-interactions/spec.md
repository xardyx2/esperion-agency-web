## ADDED Requirements

### Requirement: Button and Icon Interactions
Buttons and icons SHALL provide visual feedback on interaction.

#### Scenario: Button hover
- **GIVEN** a user hovers over a button
- **WHEN** the mouse enters
- **THEN** the button scales to 1.02 (2% larger)
- **AND** the transition completes in 150ms

#### Scenario: Button active
- **GIVEN** a user clicks a button
- **WHEN** the mouse is pressed
- **THEN** the button scales to 0.98 (2% smaller)
- **AND** the shadow reduces
- **AND** the transition completes in 100ms

#### Scenario: Icon hover rotation
- **GIVEN** an icon is in a link or button
- **WHEN** the parent is hovered
- **THEN** the icon rotates 15 degrees
- **AND** the transition completes in 200ms

#### Scenario: Link underline
- **GIVEN** a text link is displayed
- **WHEN** the link is hovered
- **THEN** an underline slides in from left to right
- **AND** the animation completes in 200ms
