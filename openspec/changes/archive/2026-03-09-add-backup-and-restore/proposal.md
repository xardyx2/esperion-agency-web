## Why

Backup/restore tasks, schema notes, and settings are mixed into the legacy omnibus change, but the repository does not yet provide a complete backup workflow. This should be split into an operational change with its own requirements, verification, and restore safeguards.

## What Changes

- Define backup creation, retention, encryption, and restore behavior as a dedicated capability.
- Add the dashboard/admin surface needed to manage backup policy and restore operations.
- Remove backup backlog from `esperion-agency-web` so the retained change tracks only spec-backed product scope.

### Scope
- Database and file backup workflows.
- Scheduled backups and retention rules.
- Optional backup encryption.
- Restore flows and dashboard controls.

### Not Included
- Monitoring/alerting integrations.
- General settings unrelated to backup policy.
- Public website or CMS content features.

## Capabilities

### New Capabilities
- `backup-restore`: operational backup creation, retention, and restore management.

## Impact

- Affected code: backup services, scheduling, dashboard settings surfaces, documentation for restore procedures, and any backup-oriented storage history.
- Affected systems: operational recovery, data safety, admin settings.
