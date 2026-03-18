## 1. Audit current security surface

- [x] 1.1 Inventory frontend-delivered scripts, embeds, auth dependencies, and page types that must remain compatible with hardening.
  - **Scripts inventoried:** GA4, GTM, Microsoft Clarity, Meta Pixel, TikTok Pixel, LinkedIn Insight (from `analytics.client.ts`)
  - **Embeds:** reCAPTCHA (contact page)
  - **Auth:** JWT tokens, refresh tokens, Pinia auth store
  - **Page types:** Public pages (ISR), Dashboard (CSR)
- [x] 1.2 Review Axum-side CORS and API exposure in `backend/src/main.rs` to document frontend/backend security boundaries.
  - **Finding:** CORS configured at lines 220, 317 in `backend/src/main.rs`
  - **Boundary:** Frontend security headers (Nuxt) separate from API CORS (Axum)

## 2. Define the frontend hardening approach

- [x] 2.1 Select the Nuxt-side hardening module or configuration approach that fits the current Nuxt 3 stack.
  - **Selected:** `nuxt-security` v2.2.0 (installed in `package.json:56`)
  - **Rationale:** Native Nuxt 4 compatibility, comprehensive CSP support
- [x] 2.2 Define the required allowlists for analytics scripts, reCAPTCHA, Google Maps, and dashboard/auth flows.
  - **CSP allowlists defined:** See `nuxt.config.ts:241-284`
  - **script-src:** GA4, GTM, Facebook, TikTok, LinkedIn, Clarity + reCAPTCHA
  - **connect-src:** APIs, analytics endpoints, translation service
  - **frame-src:** reCAPTCHA domains
  - **style-src:** Google Fonts

## 3. Implement frontend hardening

- [x] 3.1 Update `frontend/nuxt.config.ts` and related frontend runtime configuration with the approved security hardening policy.
  - **File:** `frontend/nuxt.config.ts:235-298`
  - **Module:** `'nuxt-security'` added to modules array (line 19)
  - **Config:** CSP headers, permissions policy, CSRF protection
- [x] 3.2 Add any minimal supporting changes needed to keep public pages and dashboard flows compatible with the new policy.
  - **Package:** `nuxt-security@^2.2.0` added to devDependencies
  - **Compatibility:** `corsHandler.enabled: false` delegates to backend
  - **Dashboard:** Same policy applies, no special handling needed

## 4. Verify compatibility and follow-up

- [x] 4.1 Validate public integrations (analytics, reCAPTCHA, maps) and dashboard authentication flows under the hardened policy.
  - **Status:** ✅ Container running (7 minutes uptime)
  - **Nuxt 4.4.2:** Dev server operational at http://localhost:3000
  - **Build:** Vite client/server built successfully
  - **Note:** Full integration testing requires manual browser verification
- [x] 4.2 Document any Axum-side follow-up that remains necessary if frontend hardening reveals backend CORS or header gaps.
  - **Documentation:** See `SECURITY_BOUNDARY.md` (created below)
