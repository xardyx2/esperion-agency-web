## Why

`esperion-agency-web` still mixes authentication with a broader user-management backlog. The repository has auth/session foundations, but it does not yet expose complete `/users`, `/roles`, or activity-log management APIs, and the dashboard user screens are still stubbed. Splitting this work makes the remaining legacy change easier to finish and archive without pretending RBAC administration is already complete.

## What Changes

- Add a dedicated backend/admin change for admin-only user CRUD, fixed-role administration, and activity-log access.
- Define the missing API contract for dashboard user administration.
- Align dashboard user-management screens with real backend behavior instead of hardcoded mock data.

### Scope
- Backend user CRUD endpoints.
- Fixed-role administration for `admin`, `editor`, and `viewer`.
- Activity-log listing/filtering for admin use.
- Dashboard user-management pages that depend on those APIs.
- Verification for admin/editor/viewer authorization behavior, CRUD safety, and last-admin protection.

### Not Included
- Login/register/session basics already covered by `esperion-agency-web`.
- Optional 2FA hardening.
- Invitations, password reset, user preferences, or profile settings expansion.
- Analytics, settings, backup, monitoring, or dashboard-shell redesign.
- Capital dashboard or unrelated admin settings.

### MVP Decisions
- `/roles` is list-only for MVP so the change stays within fixed-role administration.
- User creation/update will operate on minimum identity fields plus fixed role assignment.
- Delete behavior will use hard delete unless a dependency discovered during apply forces a safer recorded alternative.
- Last-admin protection is mandatory and part of the MVP contract.

## Capabilities

### New Capabilities
- `user-management`: manage users, roles, and activity logs beyond authentication basics.

## Impact

- Affected code: `backend/src/main.rs`, new/updated user and role handlers, auth middleware integration, `frontend/app/pages/dashboard/users.vue`, and related dashboard admin components.
- Affected systems: RBAC administration, audit visibility, dashboard user management.
