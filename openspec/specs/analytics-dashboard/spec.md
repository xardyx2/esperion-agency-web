# analytics-dashboard Specification

## Purpose
TBD - created by archiving change add-enterprise-analytics-and-pixels. Update Purpose after archive.

## Requirements

### Requirement: Configurable Analytics Integrations
The system SHALL support configurable analytics integrations for GA4, GTM, Clarity, and approved marketing pixels with consent-aware exposure.

#### Scenario: Admin saves analytics identifiers
- **WHEN** an admin saves analytics or pixel identifiers in dashboard settings
- **THEN** the system SHALL persist those identifiers and use them in the frontend tracking configuration
- **AND** track which consent tier each tracker belongs to

#### Scenario: Public config reflects consent governance
- **WHEN** public analytics configuration is exposed to the frontend
- **THEN** it SHALL respect consent tier assignments and filter by user consent

### Requirement: Dashboard Displays Consent Governance Section
The analytics settings page SHALL include a consent governance section with tier controls.

#### Scenario: Admin views analytics settings
- **WHEN** an admin navigates to dashboard settings
- **THEN** the system SHALL display consent governance section with tier toggles

#### Scenario: Admin configures consent requirements
- **WHEN** an admin toggles "Require Consent" setting
- **THEN** the system SHALL enable/disable consent banner globally

#### Scenario: Admin configures tier defaults
- **WHEN** an admin enables/disables a consent tier
- **THEN** the system SHALL update which trackers are available for that tier

### Requirement: Tracker Rules Configuration
The dashboard SHALL allow configuration of which trackers belong to which consent tiers.

#### Scenario: Admin assigns tracker to tier
- **WHEN** an admin views analytics settings
- **THEN** the system SHALL display each configured tracker with its assigned tier

#### Scenario: Tier assignment validation
- **WHEN** backend analytics is viewed
- **THEN** it SHALL be marked as Essential and not modifiable

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

### Requirement: Analytics Configuration Reflects Tracker Governance
The analytics dashboard capability SHALL reflect the approved tracker inventory and governance model.

#### Scenario: Admin can review configured tracker set
- **WHEN** an admin reviews analytics configuration
- **THEN** the system SHALL expose the approved tracker set and its intended role in the project analytics stack

#### Scenario: Public tracking config stays aligned with approved trackers
- **WHEN** public analytics configuration is exposed to the frontend runtime
- **THEN** it SHALL only expose trackers and settings that are approved by the current analytics governance rules

