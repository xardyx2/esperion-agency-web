# analytics-consent-management Specification

## Purpose
Provide comprehensive consent management for analytics and marketing trackers, ensuring GDPR and Indonesian PDP compliance while maintaining business-critical analytics functionality.

## ADDED Requirements

### Requirement: Consent Banner Displays on First Visit
The system SHALL display a cookie consent banner to first-time visitors with clear options to accept all, accept essential only, or customize preferences.

#### Scenario: New visitor arrives
- **WHEN** a user visits the site for the first time (no consent stored)
- **THEN** the system SHALL display the consent banner overlay

#### Scenario: Banner displays tiers clearly
- **WHEN** the consent banner is displayed
- **THEN** it SHALL show four distinct tiers: Essential (always on), Analytics (default on), Functional (default off), Marketing (default off)

### Requirement: Consent Preferences Stored Locally
The system SHALL store user consent preferences in browser localStorage with versioning and expiration.

#### Scenario: User saves consent preferences
- **WHEN** a user saves their consent preferences
- **THEN** the system SHALL persist them to localStorage with version, timestamp, and tier selections

#### Scenario: Consent expires after 6 months
- **WHEN** a user returns after 6+ months
- **THEN** the system SHALL treat it as a new visit and show the banner again

#### Scenario: Consent version mismatch
- **WHEN** the stored consent version differs from current version
- **THEN** the system SHALL request new consent (banner reappears)

### Requirement: Consent Passed to Backend API
The system SHALL encode consent preferences and transmit them to backend API via request header.

#### Scenario: Fetching analytics config
- **WHEN** the frontend fetches analytics public config
- **THEN** it SHALL include consent preferences in X-Consent-Preferences header (Base64-encoded JSON)

### Requirement: Essential Analytics Always Function
The system SHALL ensure first-party backend analytics function regardless of consent choices.

#### Scenario: User rejects all optional tracking
- **WHEN** a user opts out of all optional tiers
- **THEN** the system SHALL still track events via backend analytics endpoint

#### Scenario: No consent stored
- **WHEN** no consent preferences exist
- **THEN** the system SHALL only load essential trackers (backend analytics)

### Requirement: Users Can Modify Consent Later
The system SHALL provide a mechanism for users to modify their consent preferences after initial choice.

#### Scenario: User accesses privacy settings
- **WHEN** a user clicks "Manage Cookie Preferences" link in footer or privacy policy
- **THEN** the system SHALL display the consent banner again with current preferences pre-selected

## MODIFIED Requirements

(None - this is a new capability)

## REMOVED Requirements

(None - this is a new capability)
