## ADDED Requirements

### Requirement: Metric card component
The system SHALL provide reusable metric cards for displaying KPIs on dashboard home.

#### Scenario: Metric card displays data
- **WHEN** dashboard home page loads
- **THEN** metric cards display: Total Articles, Total Works, Total Services, Total Users with current counts

#### Scenario: Metric card shows trend
- **WHEN** metric displays value
- **THEN** card also shows percentage trend (up/down) compared to previous period

#### Scenario: Metric card links to detail
- **WHEN** user clicks metric card
- **THEN** user navigates to corresponding detail page

### Requirement: Metric grid layout
The system SHALL display metric cards in responsive grid layout.

#### Scenario: Desktop grid
- **WHEN** user views dashboard on desktop
- **THEN** metric cards display in 4-column grid

#### Scenario: Tablet grid
- **WHEN** user views dashboard on tablet
- **THEN** metric cards display in 2-column grid

#### Scenario: Mobile grid
- **WHEN** user views dashboard on mobile
- **THEN** metric cards stack in single column
