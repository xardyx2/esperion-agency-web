## ADDED Requirements

### Requirement: Analytics Configuration Reflects Tracker Governance
The analytics dashboard capability SHALL reflect the approved tracker inventory and governance model.

#### Scenario: Admin can review configured tracker set
- **WHEN** an admin reviews analytics configuration
- **THEN** the system SHALL expose the approved tracker set and its intended role in the project analytics stack

#### Scenario: Public tracking config stays aligned with approved trackers
- **WHEN** public analytics configuration is exposed to the frontend runtime
- **THEN** it SHALL only expose trackers and settings that are approved by the current analytics governance rules
