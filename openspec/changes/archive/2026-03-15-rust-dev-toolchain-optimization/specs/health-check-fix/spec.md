# Spec: Health Check Fix

## ADDED Requirements

### Requirement: Container health check accurately reflects application status
The system SHALL fix the health check configuration so containers report "healthy" when the application is running correctly.

#### Scenario: Health check uses available tools
- **WHEN** the health check command executes
- **THEN** it uses a tool available in the Alpine image (wget, curl, or nc)
- **AND** the tool is installed in the Docker image if not present by default

#### Scenario: Health check validates backend API
- **WHEN** the backend container is running and accepting connections
- **THEN** `docker ps` shows status as "(healthy)"
- **AND** the health check probes the `/health` endpoint on port 8080

#### Scenario: Health check tolerates startup time
- **WHEN** the container starts
- **THEN** health check allows 60 seconds for the application to initialize
- **AND** status shows "(health: starting)" during this period

### Requirement: Health check does not cause unnecessary container restarts
The system SHALL ensure the health check does not trigger false positive failures.

#### Scenario: Health check interval appropriate
- **WHEN** the application is running normally
- **THEN** health check runs every 30 seconds
- **AND** timeout is set to 10 seconds per check
- **AND** 3 consecutive failures mark container as unhealthy

#### Scenario: Database dependency does not affect health
- **WHEN** the backend is running but database is temporarily unavailable
- **THEN** backend health check should still pass (if application handles it gracefully)
- **AND** application implements proper error handling for DB disconnections

### Requirement: Health check works in all environments
The system SHALL ensure health check functions in both development and production configurations.

#### Scenario: Development environment health
- **WHEN** running `docker-compose up` for development
- **THEN** backend container shows healthy status
- **AND** health check uses the same method as production

#### Scenario: Production environment health
- **WHEN** running production Docker Compose configuration
- **THEN** health check continues to function correctly
- **AND** no additional configuration changes needed
