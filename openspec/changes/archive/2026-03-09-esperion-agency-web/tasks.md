## 1. Scope Alignment

- [x] 1.1 Freeze `esperion-agency-web` scope to the eight active delta specs.
- [x] 1.2 Split user management, analytics/pixels, backup/restore, and monitoring/alerting backlog into dedicated follow-up changes.

## 2. Multilingual And Backend Foundation Gaps

- [x] 2.1 Finish Alibaba AI-backed article translation flow so retained translation endpoints and article workflow are fully wired.
- [x] 2.2 Implement the dashboard translation-management surface needed by the retained article translation workflow.
- [x] 2.3 Verify and finish database connection pooling usage/documentation for the retained backend foundation.
- [x] 2.4 Re-verify checked multilingual/editorial items that were only partially completed (`3.1`, `3.9`, `3.11`) and align their code with the current specs.

## 3. Authentication Frontend Completion

- [x] 3.1 Replace simulated login/register flows in `frontend/app/pages/login.vue` and `frontend/app/pages/register.vue` with real auth-store/API integration.
- [x] 3.2 Implement real frontend validation, token persistence behavior, logout entry points, and protected-route behavior for the retained authentication UX.
- [x] 3.3 Re-run auth frontend tests and update any checked auth-frontend tasks that were previously overclaimed.

## 4. Retained Dashboard Surfaces

- [x] 4.1 Replace stubbed article dashboard list/editor behavior with real API-backed retained article-management flows.
- [x] 4.2 Replace stubbed works dashboard behavior with real API-backed retained portfolio-management flows.
- [x] 4.3 Replace stubbed services dashboard behavior with real API-backed retained service-catalog flows.
- [x] 4.4 Replace stubbed clients dashboard behavior with real API-backed retained client-showcase flows.
- [x] 4.5 Replace stubbed contact submissions dashboard behavior with real API-backed retained contact-management flows.

## 5. Dashboard Shell And Runtime Drift

- [x] 5.1 Align dashboard route rules/runtime behavior with the active `/dashboard/**` page tree.
- [x] 5.2 Replace placeholder dashboard overview widgets/charts with retained-scope-safe behavior or narrow them so they stop overclaiming analytics support.
- [x] 5.3 Re-verify the checked rate-limiting implementation and either complete it or correct the task state to match reality.

## 6. Verification And Archive Readiness

- [x] 6.1 Fix retained Playwright/test harness blockers needed for truthful end-to-end verification.
- [x] 6.2 Run retained-scope frontend/backend verification and ensure checked tasks match real implementation status.
- [x] 6.3 Confirm `esperion-agency-web` artifacts, specs, and task states are aligned for archive review.
