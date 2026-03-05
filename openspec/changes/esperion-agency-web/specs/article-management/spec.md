## ADDED Requirements

### Requirement: Article List View
The system SHALL display a list of all articles in the dashboard for management purposes.

#### Scenario: View all articles
- **WHEN** admin navigates to Articles > All Articles
- **THEN** a table listing all articles SHALL be displayed
- **AND** each row SHALL show: title, category, author, status, created date, and actions

#### Scenario: Pagination
- **WHEN** there are more than 10 articles
- **THEN** pagination controls SHALL be displayed
- **AND** user SHALL be able to navigate between pages

#### Scenario: Search articles
- **WHEN** user types in the search box
- **THEN** the article list SHALL filter by title match in real-time

#### Scenario: Filter by category
- **WHEN** user selects a category from the filter dropdown
- **THEN** the article list SHALL show only articles in that category

#### Scenario: Empty state
- **WHEN** there are no articles
- **THEN** a message "No articles yet. Create your first article!" SHALL be displayed
- **AND** a "Create Article" button SHALL be shown

### Requirement: Create New Article
The system SHALL allow authorized users to create new articles.

#### Scenario: Access new article page
- **WHEN** admin navigates to Articles > New Article
- **THEN** the article editor page SHALL be displayed
- **AND** the form SHALL include: title, slug, category, excerpt, content, and image fields

#### Scenario: Auto-generate slug
- **WHEN** user enters a title
- **THEN** the slug SHALL be auto-generated from the title
- **AND** user SHALL be able to manually edit the slug

#### Scenario: Rich text editing
- **WHEN** user clicks in the content field
- **THEN** the Nuxt UI rich text editor SHALL be displayed
- **AND** user SHALL be able to format text, add headings, lists, links, and images

#### Scenario: Category selection
- **WHEN** user clicks the category dropdown
- **THEN** a list of existing categories SHALL be displayed
- **AND** user SHALL be able to create a new category

#### Scenario: Image upload
- **WHEN** user uploads an image
- **THEN** the image SHALL be stored in local storage
- **AND** a preview SHALL be displayed
- **AND** the image path SHALL be saved with the article

#### Scenario: Save draft
- **WHEN** user clicks "Save Draft"
- **THEN** the article SHALL be saved with published=false
- **AND** user SHALL be redirected to article list

#### Scenario: Publish article
- **WHEN** user clicks "Publish"
- **THEN** the article SHALL be saved with published=true
- **AND** published_at timestamp SHALL be set
- **AND** user SHALL be redirected to article list

#### Scenario: Form validation
- **WHEN** user submits without required fields (title, content)
- **THEN** validation errors SHALL be displayed
- **AND** the form SHALL NOT submit

### Requirement: Edit Article
The system SHALL allow authorized users to edit existing articles.

#### Scenario: Access edit page
- **WHEN** user clicks "Edit" on an article in the list
- **THEN** the article editor SHALL load with existing content
- **AND** all fields SHALL be pre-populated

#### Scenario: Update article
- **WHEN** user modifies content and clicks "Save"
- **THEN** the article SHALL be updated
- **AND** updated_at timestamp SHALL be updated
- **AND** a success message SHALL be displayed

#### Scenario: Publish draft
- **WHEN** user edits a draft and clicks "Publish"
- **THEN** the article SHALL be published
- **AND** published_at timestamp SHALL be set to current time

#### Scenario: Unpublish article
- **WHEN** user clicks "Unpublish" on a published article
- **THEN** the published flag SHALL be set to false
- **AND** the article SHALL no longer appear on the public website

### Requirement: Delete Article
The system SHALL allow authorized users to delete articles.

#### Scenario: Delete confirmation
- **WHEN** user clicks "Delete" on an article
- **THEN** a confirmation dialog SHALL appear
- **AND** the message SHALL include the article title

#### Scenario: Confirm delete
- **WHEN** user confirms deletion
- **THEN** the article SHALL be permanently deleted from the database
- **AND** the associated image SHALL remain in storage (orphaned)
- **AND** user SHALL be redirected to article list
- **AND** a success message SHALL be displayed

#### Scenario: Cancel delete
- **WHEN** user cancels the deletion
- **THEN** the article SHALL NOT be deleted
- **AND** user SHALL remain on the current page

### Requirement: Article Schema Validation
The system SHALL enforce strict schema validation for articles.

#### Scenario: Title validation
- **WHEN** article is saved
- **THEN** title SHALL be required, max 200 characters

#### Scenario: Slug validation
- **WHEN** article is saved
- **THEN** slug SHALL be required, unique, URL-safe format
- **AND** SHALL be auto-generated if not provided

#### Scenario: Content validation
- **WHEN** article is saved
- **THEN** content SHALL be required, minimum 1 character

#### Scenario: Category validation
- **WHEN** article is saved
- **THEN** category SHALL be required
- **AND** SHALL be one of the predefined categories or a new valid category name

#### Scenario: Excerpt validation
- **WHEN** article is saved
- **THEN** excerpt SHALL be optional, max 500 characters
- **AND** if not provided, auto-generate from first 150 characters of content

### Requirement: Article Preview
The system SHALL allow users to preview articles before publishing.

#### Scenario: Open preview
- **WHEN** user clicks "Preview" button
- **THEN** a new tab SHALL open with the article rendered as it would appear on the public website
- **AND** the preview SHALL use ISR rendering simulation

#### Scenario: Preview draft
- **WHEN** user previews a draft article
- **THEN** the article SHALL be visible even though it's not published
- **AND** a "Preview Mode" banner SHALL be displayed at the top

### Requirement: Article List Public View
The system SHALL display published articles on the public Articles page.

#### Scenario: View published articles
- **WHEN** visitor navigates to /articles
- **THEN** only published articles SHALL be displayed
- **AND** articles SHALL be sorted by published_at descending

#### Scenario: Filter by category (public)
- **WHEN** visitor clicks a category filter
- **THEN** only articles in that category SHALL be displayed
- **AND** the URL SHALL update with the category filter

#### Scenario: Search articles (public)
- **WHEN** visitor uses the search box
- **THEN** articles matching the search term in title or content SHALL be displayed

#### Scenario: Pagination (public)
- **WHEN** there are more than 9 published articles
- **THEN** pagination SHALL be displayed (3 columns x 3 rows per page)

#### Scenario: Article detail view
- **WHEN** visitor clicks on an article
- **THEN** the full article SHALL be displayed with title, content, author, and published date
- **AND** related articles SHALL be shown at the bottom

### Requirement: Image Management
The system SHALL handle article images with local storage.

#### Scenario: Upload image
- **WHEN** user selects an image file
- **THEN** the image SHALL be uploaded to local storage
- **AND** the file path SHALL be stored in the article record

#### Scenario: Image validation
- **WHEN** user uploads a file
- **THEN** only image files (jpg, jpeg, png, webp) SHALL be accepted
- **AND** maximum file size SHALL be 5MB

#### Scenario: Replace image
- **WHEN** user uploads a new image for an existing article
- **THEN** the old image SHALL remain in storage (manual cleanup required)
- **AND** the new image path SHALL replace the old one in the article record

#### Scenario: Delete article with image
- **WHEN** an article is deleted
- **THEN** the image SHALL NOT be automatically deleted
- **AND** orphaned images SHALL be handled by a separate cleanup process