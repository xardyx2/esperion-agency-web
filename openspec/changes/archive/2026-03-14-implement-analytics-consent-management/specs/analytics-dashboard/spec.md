# analytics-dashboard Specification (Delta)

## Purpose
Extended analytics dashboard with consent governance controls.

## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Configurable Analytics Integrations
The system SHALL support configurable analytics integrations for GA4, GTM, Clarity, and approved marketing pixels with consent-aware exposure.

#### Scenario: Admin saves analytics identifiers
- **WHEN** an admin saves analytics or pixel identifiers in dashboard settings
- **THEN** the system SHALL persist those identifiers and use them in the frontend tracking configuration
- **AND** track which consent tier each tracker belongs to

#### Scenario: Public config reflects consent governance
- **WHEN** public analytics configuration is exposed to the frontend
- **THEN** it SHALL respect consent tier assignments and filter by user consent

## REMOVED Requirements

(None)
