## 1. Inventory the current analytics stack

- [x] 1.1 Audit frontend analytics loading in runtime config, `frontend/app/plugins/analytics.client.ts`, and related public-page code.
- [x] 1.2 Audit dashboard analytics settings and backend analytics endpoints to map the full tracker/control flow.

## 2. Classify trackers and privacy posture

- [x] 2.1 Classify each current integration as operational analytics, marketing pixel, session insight, or other measurement type.
- [x] 2.2 Record privacy risk, consent expectation, and overlap risk for each current tracker.

## 3. Evaluate privacy-friendly analytics options

- [x] 3.1 Compare privacy-friendly analytics candidates against the current stack using explicit adoption criteria.
- [x] 3.2 Decide whether a new analytics module should be rejected, deferred, or proposed for implementation in a follow-up change.

## 4. Align governance with product controls

- [x] 4.1 Define how approved tracker governance should appear in dashboard-managed analytics settings and public config.
- [x] 4.2 Document which trackers are allowed by default and which require stronger consent or environment-based gating.
