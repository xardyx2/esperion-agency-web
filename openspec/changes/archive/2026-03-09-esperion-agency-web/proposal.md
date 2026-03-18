## Why

`esperion-agency-web` drifted into an omnibus backlog that mixed finished public remediation, proposal-only phase-two ideas, and partially implemented dashboard/admin work. The repository still has eight active delta specs for the core agency website and CMS baseline, but the old proposal now overstates completion and bundles several separate domains that should move into dedicated changes.

This proposal narrows the change back to the spec-backed baseline so the remaining work can be tracked honestly and archived cleanly.

## What Changes

- Keep `esperion-agency-web` focused on the eight active capabilities already defined in this change:
  - `public-website`
  - `user-authentication`
  - `article-management`
  - `client-showcase`
  - `contact-form`
  - `docker-infrastructure`
  - `portfolio-works`
  - `service-catalog`
- Reopen checked tasks whose code is still stubbed or only partially wired.
- Move out-of-scope backlog into dedicated changes for user management, analytics/pixels, backup/restore, and monitoring/alerting.

### Scope
- Public website rendering, navigation, and multilingual foundations.
- Authentication/session basics.
- Core article, works, services, client, and contact capabilities already covered by current specs.
- Docker/runtime foundations needed by those capabilities.
- Finishing the retained dashboard/admin surfaces that are still stubbed.

### Not Included
- Enterprise analytics and pixel/journey tracking.
- Backup and restore operations.
- Monitoring and alerting operations.
- Broad admin settings platform work.
- Nuxt Studio, PWA, media-library formalization, and other non-spec domains that require separate changes.

## Capabilities

### Active Capabilities
- `public-website`
- `user-authentication`
- `article-management`
- `client-showcase`
- `contact-form`
- `docker-infrastructure`
- `portfolio-works`
- `service-catalog`

### Split-Out Changes
- `add-user-management-backend-and-roles`
- `add-enterprise-analytics-and-pixels`
- `add-backup-and-restore`
- `add-monitoring-and-alerting`

## Impact

- Affected code: retained frontend/public pages, retained CMS/dashboard pages, backend auth/content/contact services, Docker/runtime setup.
- Tracking impact: this change now becomes an honest finish-and-archive path for the spec-backed baseline instead of a catch-all backlog.
