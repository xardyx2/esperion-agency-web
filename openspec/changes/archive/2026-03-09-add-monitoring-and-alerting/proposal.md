## Why

Monitoring and alerting remain unimplemented ops backlog in the legacy change. The repo has placeholder monitoring files, but no cleanly defined capability tying uptime/error/performance signals to alert delivery. Splitting this out keeps `esperion-agency-web` focused while making observability work auditable on its own.

## What Changes

- Define uptime, error, and performance monitoring as a separate operational capability.
- Add alert routing and dashboard/settings controls for supported channels.
- Remove monitoring debt from the legacy omnibus change.

### Scope
- Uptime monitoring, error tracking, and performance monitoring.
- Multi-channel alert routing.
- Monitoring/alert settings in admin surfaces.

### Not Included
- Backup scheduling.
- Analytics and pixel tracking.
- Public website content features.

## Capabilities

### New Capabilities
- `monitoring-alerting`: uptime/error/performance monitoring and alert delivery.

## Impact

- Affected code: infrastructure monitoring configs, alerting services, dashboard settings, and observability-related docs.
- Affected systems: uptime visibility, error reporting, incident notification.
