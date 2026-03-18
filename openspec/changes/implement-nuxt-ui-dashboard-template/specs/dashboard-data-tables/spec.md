## ADDED Requirements

### Requirement: Data table component
The system SHALL provide a sortable, filterable data table for listing content items (articles, works, services).

#### Scenario: Table displays data
- **WHEN** user visits articles/works/services list page
- **THEN** table displays items with columns: Title, Status, Author, Created Date, Actions

#### Scenario: Table sorting
- **WHEN** user clicks column header
- **THEN** table sorts by that column (ascending/descending toggle)

#### Scenario: Table pagination
- **WHEN** table has more than 10 items
- **THEN** pagination controls appear at bottom of table

### Requirement: Table row actions
The system SHALL provide action buttons for each table row.

#### Scenario: Edit action
- **WHEN** user clicks Edit button on table row
- **THEN** user navigates to edit page for that item

#### Scenario: Delete action
- **WHEN** user clicks Delete button on table row
- **THEN** confirmation dialog appears before deletion

### Requirement: Table filtering
The system SHALL provide search and filter capabilities for data tables.

#### Scenario: Search by text
- **WHEN** user types in search box
- **THEN** table filters to show only items matching search term

#### Scenario: Filter by status
- **WHEN** user selects status filter (Published/Draft/Archived)
- **THEN** table shows only items with selected status
