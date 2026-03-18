## ADDED Requirements

### Requirement: Configurable Analytics Integrations
The system SHALL support configurable analytics integrations for GA4, GTM, Clarity, and approved marketing pixels.

#### Scenario: Admin saves analytics identifiers
- **WHEN** an admin saves analytics or pixel identifiers in dashboard settings
- **THEN** the system SHALL persist those identifiers and use them in the frontend tracking configuration

### Requirement: Journey Tracking And Funnel Reporting
The system SHALL support journey tracking and user-defined funnel reporting for public conversion analysis.

#### Scenario: Admin defines a funnel
- **WHEN** an admin defines a funnel sequence
- **THEN** the system SHALL record funnel progress events and expose reportable results

### Requirement: Analytics Dashboard Uses Real Data
The dashboard analytics views SHALL render real reporting data instead of placeholder charts or mock values.

#### Scenario: Admin opens analytics dashboard
- **WHEN** the analytics dashboard loads
- **THEN** it SHALL fetch and render real analytics metrics from backend reporting endpoints
