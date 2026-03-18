## 1. Backend User Management API

- [x] 1.1 Implement admin-only `/api/v1/users` list, create, get-by-id, update, and delete endpoints.
- [x] 1.2 Define and implement the MVP create/update contract for users (minimum fields, initial password handling, fixed role assignment).
- [x] 1.3 Implement last-admin protection and explicit delete semantics for user deletion/demotion flows.
- [x] 1.4 Implement admin-only `/api/v1/roles` list endpoint for the fixed MVP role catalog (`admin`, `editor`, `viewer`).
- [x] 1.5 Implement admin-only `/api/v1/activity-logs` listing/filtering for admin review.
- [x] 1.6 Add audit/activity-log writes for user create, update, delete, and role-assignment actions.
- [x] 1.7 Add OpenAPI coverage for the user-management endpoints.

## 2. Dashboard User Administration

- [x] 2.1 Replace stubbed data in `frontend/app/pages/dashboard/users.vue` with real API-backed loading, create, edit, and delete flows.
- [x] 2.2 Add the minimum page-level wiring needed for `dashboard/users` (loading, error, success feedback, admin-only behavior) without refactoring the dashboard shell.
- [x] 2.3 Implement fixed-role assignment UI that reflects the MVP backend contract and keeps `/roles` list-only.

## 3. Verification

- [x] 3.1 Add or update tests for admin vs non-admin access to user-management and activity-log endpoints.
- [x] 3.2 Add or update tests for user CRUD behavior and fixed-role assignment.
- [x] 3.3 Add or update tests for last-admin protection.
- [x] 3.4 Add or update tests for activity-log filtering in MVP scope.
- [x] 3.5 Run relevant frontend/backend verification for user-management flows.
