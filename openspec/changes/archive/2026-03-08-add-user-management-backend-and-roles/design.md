## Context

The repository already has working authentication, JWT/session handling, a `users` table, and an `activity_logs` table, but it does not yet have dedicated administrative user-management endpoints or a real dashboard users page. This change adds only the missing MVP user-management slice without expanding into general RBAC redesign.

## MVP Boundary

- Admin-only user CRUD
- Fixed role catalog only: `admin`, `editor`, `viewer`
- Admin-only activity-log listing/filtering
- One API-backed `dashboard/users` page

Out of scope:

- arbitrary runtime role creation
- invitation flows
- password reset flows
- 2FA
- preferences/settings expansion
- dashboard-shell redesign

## Backend Approach

- Reuse the existing JWT/session/auth foundation in `backend/src/middleware/mod.rs`
- Reuse `users` and `activity_logs` from `backend/src/db/schema.rs`
- Add a dedicated `backend/src/handlers/user_management.rs` module for:
  - `/api/v1/users`
  - `/api/v1/users/:id`
  - `/api/v1/roles`
  - `/api/v1/activity-logs`
- Keep authorization narrow: only these endpoints enforce admin-only checks for this change
- Keep `/roles` list-only for MVP
- Use hard delete for user deletion in MVP
- Enforce last-admin protection on delete and role demotion
- Write audit log entries for create, update, delete, and role changes

## Frontend Approach

- Replace the stub in `frontend/app/pages/dashboard/users.vue`
- Reuse the API composable pattern from `frontend/app/composables/useApi.ts`
- Reuse the loading/error page behavior pattern from `frontend/app/pages/dashboard/sessions.vue`
- Keep UI scope minimal: list, create, edit, delete, fixed-role assignment
- Avoid extracting or redesigning generic dashboard form infrastructure in this change

## Verification Strategy

- Backend tests cover:
  - admin vs non-admin access
  - CRUD behavior
  - fixed-role assignment
  - last-admin protection
  - activity-log filtering
- Frontend verification covers:
  - admin page rendering with real API-backed flow
  - non-admin access denial state
  - type-check success for the users page and API contract
