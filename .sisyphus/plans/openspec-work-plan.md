# OpenSpec Understanding & Work Plan

## OpenSpec Framework - Summary

**Project:** Esperion Agency Web  
**Change ID:** `esperion-agency-web`  
**Schema:** spec-driven  
**Created:** 2026-03-05

### OpenSpec Structure (Already Understood)

```
openspec/changes/esperion-agency-web/
├── .openspec.yaml          # Spec configuration
├── proposal.md             # Business justification (Why, What, Impact)
├── design.md               # Technical architecture (Decisions, Risks)
├── specs/                  # Feature specifications
│   ├── user-authentication/spec.md
│   ├── public-website/spec.md
│   ├── article-management/spec.md
│   ├── contact-form/spec.md
│   ├── client-showcase/spec.md
│   ├── service-catalog/spec.md
│   ├── portfolio-works/spec.md
│   └── docker-infrastructure/spec.md
└── tasks.md                # Implementation checklist
```

### Key OpenSpec Principles

1. **Spec-Driven Development**: Semua features didefinisikan dalam specs/ dengan requirements dan scenarios
2. **Proposal → Design → Specs → Tasks**: Alur kerja standar
3. **Traceability**: Setiap task di tasks.md harus bisa ditrace ke spec tertentu
4. **Testing Requirements**: Setiap spec mensyaratkan unit test

---

## Current Status Analysis

### What's CLAIMED as Complete (from tasks.md)
- **~530 tasks** marked as [x] (complete)
- Sections 1-2, 5-12, 17-46 mostly marked complete

### What's ACTUALLY Complete (from verification)
- **~277 tasks** truly complete (52%)
- Critical gaps found in auth, testing, stores

### What's NOT Complete (from tasks.md)
- Section 3: Multi-language (11 tasks) - ALL NOT STARTED
- Section 4.2-4.19: Database tables (18 tasks)
- Section 13-16: Email, Analytics, Backup, Monitoring (deferred to Phase 2)
- Tasks 1.11-1.12, 2.8-2.10

---

## AUDIT FINDINGS - Critical Issues

### 🔴 P0 - Security Vulnerabilities
1. **Auth Logout (5.8)** - Only TODO stub, token not invalidated
2. **Token Refresh (5.9)** - Returns mock data, not real implementation
3. **reCAPTCHA (12.3)** - Disabled, TODO comment only
4. **Pinia Stores (18.3, 18.4)** - NOT FOUND - frontend auth broken

### 🟡 P1 - High Priority Missing
5. **Email Notifications (12.8, 13.x)** - Not implemented
6. **Multi-language (3.x)** - Not started
7. **Database Migration (4.2)** - Not implemented
8. **Playwright E2E (43.13-43.14)** - Not found
9. **k6 Load Testing (43.16)** - Not found
10. **1panel Docs (44.5)** - Missing

### 🟢 P2 - Medium Priority
11. **cargo-watch (1.7)** - Not in Dockerfile
12. **WebP Conversion (8.8)** - Mentioned but not implemented

---

## RECOMMENDED WORK PLAN

### Phase 1: Security & Core Fixes (Week 1)

#### Task 1.1: Implement Pinia Stores (CRITICAL)
**Files to Create:**
- `frontend/app/stores/auth.ts` - JWT + user state
- `frontend/app/stores/user.ts` - User profile state
- `frontend/app/stores/ui.ts` - Theme, sidebar

**Requirements from spec:**
```typescript
// stores/auth.ts - JWT + user info
interface AuthState {
  token: string | null
  refreshToken: string | null
  user: User | null
  isAuthenticated: boolean
}
```

**Testing:** Unit test untuk setiap store action

---

#### Task 1.2: Fix Auth Logout (CRITICAL)
**File:** `backend/src/handlers/auth.rs`

**Current (STUB):**
```rust
pub async fn logout() -> ApiResponse<serde_json::Value> {
    // TODO: Invalidate token in production
    Ok(Json(serde_json::json!({ "message": "Logout successful" })))
}
```

**Required Implementation:**
- Add token blacklist table in SurrealDB
- Invalidate refresh token
- Clear tokens from client storage

**Spec Reference:** `user-authentication/spec.md` - Section "Token revocation on logout"

---

#### Task 1.3: Fix Token Refresh (CRITICAL)
**File:** `backend/src/handlers/auth.rs`

**Current (MOCK):**
```rust
pub async fn refresh_token() -> ApiResponse<AuthResponse> {
    // TODO: Implement proper token refresh logic
    let response = AuthResponse {
        user: UserResponse { id: "user_1".to_string(), ... }, // MOCK
        token: "mock_jwt_token".to_string(), // MOCK
        refresh_token: "mock_refresh_token".to_string(), // MOCK
    };
```

**Required Implementation:**
- Verify refresh token
- Generate new access token (15 min expiry)
- Rotate refresh token (30 day expiry)
- Invalidate old refresh token

**Spec Reference:** `user-authentication/spec.md` - Section "Refresh token rotation"

---

### Phase 2: Multi-Language System (Week 2)

#### Task 2.1: i18n Configuration
**File:** `frontend/nuxt.config.ts`

**Requirements from spec:**
- URL prefix: `/id/`, `/en/`
- Auto-detect locale from IP/browser
- Fallback to English

**Files to Create:**
- `frontend/i18n/id.json` - Indonesian translations
- `frontend/i18n/en.json` - English translations
- `frontend/app/middleware/locale.ts` - Locale detection

**Spec Reference:** `design.md` - Section 3: Multi-language Architecture

---

#### Task 2.2: Language Switcher Component
**File:** `frontend/app/components/LanguageSwitcher.vue`

**Requirements:**
- Display current language flag
- Dropdown untuk pilih bahasa
- URL mapping dengan slug_id/slug_en

**Spec Reference:** `article-management/spec.md` - Section "Language Switcher with URL Mapping"

---

#### Task 2.3: Translation API Integration
**File:** `backend/src/handlers/articles.rs`

**Requirements:**
- Endpoint: POST `/api/v1/articles/:id/translate`
- Integrate Alibaba AI API
- Store translation in database

**Spec Reference:** `article-management/spec.md` - Section "API Endpoints for Translation"

---

### Phase 3: Testing Infrastructure (Week 3)

#### Task 3.1: Setup Playwright E2E
**Files to Create:**
- `frontend/playwright.config.ts`
- `frontend/e2e/auth.spec.ts`
- `frontend/e2e/contact.spec.ts`
- `frontend/e2e/articles.spec.ts`

**Requirements:**
- Test critical user flows
- Cross-browser testing
- Screenshot on failure

**Spec Reference:** `proposal.md` - Testing Requirements

---

#### Task 3.2: Setup k6 Load Testing
**Files to Create:**
- `tests/load/auth-load.js`
- `tests/load/api-load.js`
- `tests/load/contact-form-load.js`

**Requirements:**
- Load test untuk auth endpoints
- Load test untuk contact form
- Load test untuk article APIs

**Spec Reference:** `tasks.md` - Section 43.16

---

#### Task 3.3: Fix Existing Unit Tests
**Files to Fix:**
- `frontend/tests/composables/useAccessibility.test.ts` - Fix imports
- `frontend/tests/components/SeoScoreDisplay.test.ts` - Fix imports
- `backend/tests/seo_score_test.rs` - Fix undefined functions

---

### Phase 4: Missing Features (Week 4)

#### Task 4.1: Email System (Section 13)
**Files to Create:**
- `backend/src/services/email.rs`
- Support: SMTP, SendGrid, Mailgun, SES, Postmark, SMTP2GO

**Spec Reference:** `design.md` - Section 13: Email System

---

#### Task 4.2: reCAPTCHA Implementation
**File:** `backend/src/handlers/contact.rs`

**Requirements:**
- Verify reCAPTCHA token dengan Google API
- Return error jika score < 0.5

**Spec Reference:** `contact-form/spec.md` - Section "reCAPTCHA v3 Integration"

---

#### Task 4.3: Database Migration System
**Files to Create:**
- `backend/src/db/migrations/mod.rs`
- Migration tracking table
- Up/down migration support

**Spec Reference:** `design.md` - Section 8: Database Schema Migration

---

## AGENT DEPLOYMENT STRATEGY

### Parallel Execution Plan

**Week 1 - Security (4 agents parallel):**
1. **Agent 1**: Implement Pinia stores
2. **Agent 2**: Fix auth logout
3. **Agent 3**: Fix token refresh
4. **Agent 4**: Enable reCAPTCHA

**Week 2 - Multi-language (3 agents parallel):**
1. **Agent 1**: i18n configuration & translations
2. **Agent 2**: Language switcher & middleware
3. **Agent 3**: Translation API integration

**Week 3 - Testing (3 agents parallel):**
1. **Agent 1**: Playwright E2E setup
2. **Agent 2**: k6 load testing
3. **Agent 3**: Fix existing unit tests

**Week 4 - Features (3 agents parallel):**
1. **Agent 1**: Email system
2. **Agent 2**: reCAPTCHA
3. **Agent 3**: Database migrations

---

## SUCCESS CRITERIA

### Phase 1 Complete When:
- [ ] Pinia stores implemented and tested
- [ ] Auth logout properly invalidates tokens
- [ ] Token refresh returns real tokens (not mock)
- [ ] All auth unit tests pass

### Phase 2 Complete When:
- [ ] i18n configured with /id/ and /en/ URLs
- [ ] Language switcher working
- [ ] Translation API integrated
- [ ] Article translations stored in DB

### Phase 3 Complete When:
- [ ] Playwright E2E tests running
- [ ] k6 load tests configured
- [ ] All existing tests fixed and passing
- [ ] CI/CD pipeline updated

### Phase 4 Complete When:
- [ ] Email notifications working
- [ ] reCAPTCHA verified
- [ ] Database migrations working

---

## MONITORING & REPORTING

### Daily Reports:
1. Task completion status
2. Test results (pass/fail counts)
3. New issues discovered
4. Code commits

### Weekly Sync:
1. Demo working features
2. Review test coverage
3. Adjust priorities if needed

---

## NEXT STEPS

**Awaiting your decision:**

1. **Start Phase 1 (Security Fixes)?** - Most critical
2. **Start Phase 2 (Multi-language)?** - Required for launch
3. **Start Phase 3 (Testing)?** - Important for quality
4. **Start Phase 4 (Features)?** - Nice to have

**Or:**
- Audit section lain yang belum?
- Update tasks.md dengan status yang benar?
- Sync dengan Cline memory?

**Recommendation:** Start dengan Phase 1 (Security) karena ada critical vulnerabilities.

---

*Plan created with understanding of OpenSpec framework*  
*Ready to deploy agents for parallel execution*
