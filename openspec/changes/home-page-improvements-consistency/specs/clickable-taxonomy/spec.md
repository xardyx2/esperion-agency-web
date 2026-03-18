## ADDED Requirements

### Requirement: Clickable Tags
Tags displayed on articles, services, and works SHALL be clickable and navigate to filtered views.

#### Scenario: Click article tag
- **WHEN** the user clicks a tag on an article detail page
- **THEN** the user is navigated to the articles list page filtered by that tag

#### Scenario: Click service category
- **WHEN** the user clicks a category on a service detail page
- **THEN** the user is navigated to the services list page filtered by that category

#### Scenario: Click work tag
- **WHEN** the user clicks a tag on a work detail page
- **THEN** the user is navigated to the works list page filtered by that tag

#### Scenario: Filtered list display
- **GIVEN** the user has clicked a tag/category
- **WHEN** the list page loads
- **THEN** only items matching the selected tag/category are displayed
- **AND** the filter is shown in the URL as a query parameter
