## ADDED Requirements

### Requirement: Administrative User CRUD
The system SHALL provide authenticated administrative endpoints to list, create, update, and delete dashboard users.

#### Scenario: Admin lists users
- **WHEN** an authenticated admin requests the user list
- **THEN** the system SHALL return paginated user records with role metadata

#### Scenario: Non-admin requests user list
- **WHEN** a non-admin requests the user list endpoint
- **THEN** the system SHALL deny access

#### Scenario: Admin creates a user
- **WHEN** an authenticated admin creates a user with the minimum required fields
- **THEN** the system SHALL create the user with a valid fixed role and initial password according to the MVP contract

#### Scenario: Admin updates a user
- **WHEN** an authenticated admin updates a user's editable fields or fixed role
- **THEN** the system SHALL persist the changes and return the updated user record

#### Scenario: Admin deletes a user
- **WHEN** an authenticated admin deletes a user
- **THEN** the system SHALL apply the defined MVP delete behavior and record the action in the audit log

### Requirement: MVP User Contract
The system SHALL use a narrow MVP contract for user-management create and update operations.

#### Scenario: Admin submits create-user payload
- **WHEN** an admin submits a create-user request
- **THEN** the payload SHALL be limited to the required identity fields, initial password input, and one fixed role from `admin`, `editor`, or `viewer`

#### Scenario: Admin submits update-user payload
- **WHEN** an admin submits an update-user request
- **THEN** the payload SHALL update only the fields declared editable by the MVP contract and SHALL NOT imply invitation, password-reset, or preferences workflows

### Requirement: Role And Permission Management
The system SHALL expose the fixed MVP role catalog for administrative use without introducing arbitrary runtime role creation.

#### Scenario: Admin requests role catalog
- **WHEN** an authenticated admin requests the role catalog
- **THEN** the system SHALL return the supported fixed roles and their intended permission model for the MVP

#### Scenario: Non-admin requests role catalog
- **WHEN** a non-admin requests the role catalog endpoint
- **THEN** the system SHALL deny access

### Requirement: Last-Admin Protection
The system SHALL prevent destructive user-management actions that would remove the last remaining administrative account.

#### Scenario: Admin attempts to delete the last admin
- **WHEN** an admin attempts to delete the final remaining admin account
- **THEN** the system SHALL reject the action explicitly

#### Scenario: Admin attempts to demote the last admin
- **WHEN** an admin attempts to change the final remaining admin account to a non-admin role
- **THEN** the system SHALL reject the action explicitly

### Requirement: Activity Log Visibility
The system SHALL provide an admin-facing activity-log listing with filtering by user or role.

#### Scenario: Admin filters activity logs
- **WHEN** an admin filters logs by user or role
- **THEN** the system SHALL return matching audit entries

#### Scenario: User-management action is audited
- **WHEN** an admin creates, updates, deletes, or changes a user's role
- **THEN** the system SHALL record an activity-log entry for that action

### Requirement: Dashboard User Management Uses Real Backend Data
The dashboard user-management UI SHALL reflect real backend user and role state rather than hardcoded placeholder data.

#### Scenario: Admin opens the users dashboard
- **WHEN** the users dashboard loads
- **THEN** the page SHALL fetch and render real user data from the user-management API

#### Scenario: Dashboard uses MVP role assignment
- **WHEN** an admin edits a user's role from the dashboard
- **THEN** the UI SHALL use the fixed MVP role catalog and submit the change through the user-management API
