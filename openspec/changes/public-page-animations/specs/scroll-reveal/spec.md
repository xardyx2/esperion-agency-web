## ADDED Requirements

### Requirement: Scroll Fade-in Animation
Elements SHALL fade in and slide up when they enter the viewport during scroll.

#### Scenario: Element enters viewport
- **GIVEN** a user is scrolling down the page
- **WHEN** an element crosses 20% into the viewport
- **THEN** the element animates from opacity 0 to 1
- **AND** the element translates from 30px below to 0
- **AND** the animation completes in 500ms

#### Scenario: Animation triggers once
- **GIVEN** an element has already animated into view
- **WHEN** the user scrolls away and back
- **THEN** the animation does NOT replay

#### Scenario: Reduced motion preference
- **GIVEN** the user has enabled reduced motion
- **WHEN** an element enters the viewport
- **THEN** it appears instantly without animation
