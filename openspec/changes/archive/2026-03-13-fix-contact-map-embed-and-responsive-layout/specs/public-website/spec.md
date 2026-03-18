## MODIFIED Requirements

### Requirement: Contact Page Map Display

The public website contact page SHALL display an interactive Google Maps embed showing the agency location.

#### Scenario: User views contact page map
- **WHEN** user navigates to /contact-us page
- **THEN** an interactive Google Maps iframe displays the agency location with zoom and pan controls enabled

#### Scenario: User interacts with embedded map
- **WHEN** user clicks, drags, or scrolls on the map
- **THEN** map responds with appropriate zoom, pan, or rotation actions

### Requirement: Content Container Responsive Width

Public website pages SHALL utilize available desktop viewport width without unnecessary max-width constraints.

#### Scenario: Desktop view on large screens
- **WHEN** page is viewed on desktop with viewport width >= 1280px
- **THEN** content containers expand to utilize available width without artificial max-width limits

#### Scenario: Mobile view preservation
- **WHEN** page is viewed on mobile with viewport width < 768px
- **THEN** responsive behavior remains unchanged with appropriate mobile spacing

### Requirement: Banner Text Readability

Hero/banner sections SHALL maintain text readability across all background images and lighting conditions.

#### Scenario: Light background image
- **WHEN** banner has light-colored background image
- **THEN** text remains readable with text-shadow and gradient overlay providing sufficient contrast

#### Scenario: Dark background image
- **WHEN** banner has dark-colored background image
- **THEN** text remains readable with appropriate contrast enhancements applied

#### Scenario: Dark mode viewing
- **WHEN** user views page in dark mode
- **THEN** banner text maintains readability with gradient and shadow adjustments
