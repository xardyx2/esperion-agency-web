## ADDED Requirements

### Requirement: Navigation menu structure
The system SHALL provide a hierarchical navigation menu in the sidebar matching the dashboard page structure.

#### Scenario: Main navigation items
- **WHEN** user views sidebar navigation
- **THEN** menu items include: Dashboard, Content (Articles, Works, Services), Users, Media, Analytics, Settings

#### Scenario: Submenu expansion
- **WHEN** user clicks on Content menu item
- **THEN** submenu expands showing Articles, Works, and Services links

### Requirement: Navigation icons
The system SHALL display appropriate icons for each navigation item using Lucide icons.

#### Scenario: Icons displayed
- **WHEN** sidebar navigation renders
- **THEN** each menu item displays its corresponding icon (e.g., Home icon for Dashboard, FileText for Articles)

### Requirement: Navigation tooltips
The system SHALL display tooltips for collapsed sidebar navigation items.

#### Scenario: Tooltip on hover
- **WHEN** sidebar is collapsed and user hovers over menu item
- **THEN** tooltip appears showing the full menu item name
