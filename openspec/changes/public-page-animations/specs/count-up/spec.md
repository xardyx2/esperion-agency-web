## ADDED Requirements

### Requirement: Count Up Number Animation
Selected statistics numbers SHALL animate from 0 to target value when scrolled into view. Not all numbers are animated - only key metrics that benefit from visual emphasis.

#### Scenario: Homepage hero statistics animate
- **GIVEN** the homepage hero section displays key metrics
- **WHEN** the statistics section scrolls into view (20% threshold)
- **THEN** the following numbers animate from 0 to target:
  - **150+** - Projects Completed
  - **50+** - Happy Clients
  - **10+** - Years Experience
  - **25** - Team Members
- **AND** each animation takes 2000ms (2 seconds)
- **AND** the easing is ease-out (fast start, slow end)

#### Scenario: Services page metrics animate
- **GIVEN** the services page displays performance metrics
- **WHEN** the metrics section enters viewport
- **THEN** the following numbers animate:
  - **98%** - Client Satisfaction Rate
  - **85%** - Average ROI
  - **3x** - Faster Delivery
- **AND** animations use same timing as homepage stats

#### Scenario: Numbers that remain static
- **GIVEN** certain numbers are displayed on the site
- **WHEN** they appear on screen
- **THEN** these numbers display immediately without animation:
  - Pricing amounts (e.g., $5,000, $7,500) - fixed values
  - Calendar years (e.g., 2024) - static dates
  - Dates and timestamps
  - Percentages under 10% (too small for impact)
  - Any number in forms or inputs

#### Scenario: Suffix remains static
- **GIVEN** a statistic displays "150+ Projects Completed"
- **WHEN** the count animation runs
- **THEN** only the number "150" animates
- **AND** the "+" suffix and text "Projects Completed" remain static

#### Scenario: Multiple statistics with stagger
- **GIVEN** there are multiple statistics in a section
- **WHEN** they enter viewport
- **THEN** each animates independently with 200ms stagger delay
- **AND** the first stat starts immediately
- **AND** the second stat delays 200ms
- **AND** the third stat delays 400ms
- **AND** the fourth stat delays 600ms
- **AND** all complete within 2-3 seconds total

#### Scenario: Reduced motion
- **GIVEN** reduced motion is preferred
- **WHEN** statistics enter viewport
- **THEN** numbers display immediately at target value
- **AND** no counting animation plays
