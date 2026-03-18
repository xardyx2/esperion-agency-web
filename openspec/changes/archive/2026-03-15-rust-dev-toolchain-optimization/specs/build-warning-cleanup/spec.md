# Spec: Build Warning Cleanup

## ADDED Requirements

### Requirement: Reduce compiler warning count
The system SHALL reduce the number of compiler warnings from 88 to under 20.

#### Scenario: Build produces fewer warnings
- **WHEN** running `cargo build` or `docker-compose build backend`
- **THEN** warning count is under 20 (previously 88, with 32 duplicates)
- **AND** remaining warnings are meaningful and actionable

#### Scenario: Dead code warnings addressed
- **WHEN** the build completes
- **THEN** warnings about unused code in middleware/mod.rs are resolved
- **AND** warnings about unused code in db/mod.rs and db/schema.rs are resolved
- **AND** warnings about unused code in services/ are resolved

### Requirement: Intentionally unused code is marked appropriately
The system SHALL preserve code that is intentionally kept for future use while suppressing warnings.

#### Scenario: Future-reserved code preserved
- **WHEN** code is intentionally unused but kept for future features
- **THEN** `#[allow(dead_code)]` attribute is added
- **AND** a comment explains why the code is preserved

#### Scenario: Schema and migration code
- **WHEN** examining db/schema.rs and migration functions
- **THEN** unused schema constants may be marked with `#[allow(unused)]`
- **AND** init functions kept for future use are properly annotated

### Requirement: Truly unused code is removed
The system SHALL remove code that has no purpose and is not planned for future use.

#### Scenario: Unused error variants removed
- **WHEN** error variants in errors.rs are never constructed
- **THEN** remove `RecaptchaFailed` and `RecaptchaTokenMissing` if truly unused
- **OR** mark them with appropriate attributes if reserved for future

#### Scenario: Unused struct fields addressed
- **WHEN` struct fields like `EmailConfig.provider` are never read
- **THEN** either remove the field or mark with `#[allow(unused)]`
- **AND** ensure this doesn't break serialization or other functionality

#### Scenario: Unused methods cleaned up
- **WHEN` methods like `ImageProcessor.resize_image` are never called
- **THEN** remove them or mark as intentionally reserved
- **AND** ensure related tests are updated

### Requirement: Build remains functional after cleanup
The system SHALL ensure the application builds and runs correctly after warning cleanup.

#### Scenario: Application builds successfully
- **WHEN** running `cargo build --release`
- **THEN** build completes without errors
- **AND** all tests pass

#### Scenario: Application functionality unchanged
- **WHEN** the application runs
- **THEN** all API endpoints function as before
- **AND** no behavioral changes are introduced

#### Scenario: Hot reload continues to work
- **WHEN** developing with cargo-watch
- **THEN** hot reload functions normally
- **AND** warning cleanup does not affect development workflow
