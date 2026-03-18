# Frontend/Backend Security Boundary Documentation

**Change:** add-nuxt-security-hardening  
**Date:** 2026-03-13  
**Status:** Complete

---

## Security Boundary Overview

This document defines the security responsibilities split between the **Nuxt frontend** (browser-facing) and **Axum backend** (API-facing).

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         BROWSER                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Nuxt Frontend (Security)                 │  │
│  │  - CSP Headers                                        │  │
│  │  - Security Headers (HSTS, X-Frame-Options, etc.)    │  │
│  │  - Permissions Policy                                 │  │
│  │  - CSRF Protection                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          │ HTTP/HTTPS                        │
│                          │                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Axum Backend (CORS/API)                  │  │
│  │  - CORS Configuration                                 │  │
│  │  - JWT Authentication                                 │  │
│  │  - API Rate Limiting                                   │  │
│  │  - Business Logic Security                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend Security (Nuxt + nuxt-security)

**Module:** `nuxt-security@^2.2.0`  
**Configuration:** `frontend/nuxt.config.ts:235-298`

### Implemented Protections

| Header | Policy | Purpose |
|--------|--------|---------|
| **CSP** | `default-src 'self'` | Base restriction |
| **script-src** | `'self' 'unsafe-inline' 'unsafe-eval' + analytics domains` | Allow scripts with third-party exceptions |
| **connect-src** | `'self' + API + analytics endpoints` | Control fetch/XHR destinations |
| **frame-src** | `'self' + reCAPTCHA domains` | Control iframe/embed sources |
| **Cross-Origin-Resource-Policy** | `cross-origin` | Resource sharing policy |
| **Cross-Origin-Opener-Policy** | `same-origin` | Window isolation |
| **Permissions-Policy** | Camera/Mic/Geo/Payment disabled | Feature policy restriction |

### Third-Party Allowlist

**Analytics & Tracking:**
- Google Analytics 4: `googletagmanager.com`, `google-analytics.com`
- Google Tag Manager: `googletagmanager.com`
- Meta Pixel: `connect.facebook.net`
- TikTok Pixel: `analytics.tiktok.com`
- LinkedIn Insight: `snap.licdn.com`
- Microsoft Clarity: `clarity.ms`

**Security & Utilities:**
- reCAPTCHA: `google.com/recaptcha/`, `gstatic.com/recaptcha/`
- Google Fonts: `fonts.googleapis.com`
- Alibaba Translation: `translation.aliyuncs.com`

---

## Backend Security (Axum)

**Configuration:** `backend/src/main.rs:317-318`

### Current CORS Policy

```rust
.layer(CorsLayer::very_permissive())
```

**Status:** Permissive CORS for development  
**Note:** Frontend security headers do not affect backend CORS - they are independent layers.

### Backend Responsibilities

| Concern | Implementation | Location |
|---------|----------------|----------|
| **CORS** | `CorsLayer::very_permissive()` | `main.rs:318` |
| **Auth** | JWT middleware with refresh tokens | `middleware/mod.rs` |
| **Rate Limiting** | Per-route rate limiting | `main.rs:229, 239, 315` |
| **Input Validation** | Request model validation | Handler files |
| **Password Hashing** | Argon2 with 64MB memory cost | `models/user.rs` |

---

## Coordination Points

### Frontend → Backend Communication

**API Calls:**
- Frontend uses `fetch`/`$fetch` to backend API
- CORS headers handled by Axum (independent of frontend CSP)
- JWT tokens passed in Authorization header

**Auth Flow:**
1. Frontend submits credentials to `/api/v1/auth/login`
2. Backend validates and returns JWT + refresh token
3. Frontend stores tokens (Pinia + persisted state)
4. Subsequent requests include `Authorization: Bearer <token>`
5. Backend middleware validates JWT

### Security Header Flow

```
Browser Request:
  → Nuxt serves HTML with security headers
  → Browser enforces CSP on page
  → Page scripts make API calls
  → Axum handles CORS separately
  → Response returns to page
```

---

## Future Hardening Opportunities

### Backend (Axum)

1. **Tighten CORS:** Replace `very_permissive()` with explicit origin allowlist:
   ```rust
   CorsLayer::new()
       .allow_origin(["http://localhost:3000".parse().unwrap()])
       .allow_methods([Method::GET, Method::POST, ...])
   ```

2. **Add Security Headers:** Backend can also set headers like:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `Strict-Transport-Security` (if HTTPS)

3. **Rate Limiting:** Expand beyond current per-route limits

### Frontend (Nuxt)

1. **CSP Report-Only:** Consider report-only mode before enforcement:
   ```typescript
   contentSecurityPolicy: {
     // ... existing config
     'report-uri': ['/api/csp-report']
   }
   ```

2. **Nonce-based CSP:** Replace `'unsafe-inline'` with nonces for scripts

3. **Subresource Integrity:** Add SRI hashes for third-party scripts

---

## Verification Checklist

- [x] `nuxt-security` module installed and configured
- [x] CSP allowlists cover all third-party integrations
- [x] Analytics scripts functional under CSP
- [x] reCAPTCHA functional under CSP
- [x] Dashboard auth flows functional
- [x] API communication preserved
- [ ] Backend CORS tightened (optional future work)
- [ ] CSP report-only mode tested (optional)

---

## Rollback Procedure

If security policy breaks functionality:

1. **Immediate:** Comment out `security:` block in `nuxt.config.ts`
2. **Rebuild:** `docker-compose up -d --build frontend`
3. **Verify:** Check http://localhost:3000 functionality
4. **Debug:** Check browser console for CSP violations
5. **Adjust:** Modify CSP allowlists as needed

---

## References

- [nuxt-security documentation](https://nuxt-security.vercel.app/)
- [CSP Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Axum CORS](https://docs.rs/tower-http/latest/tower_http/cors/index.html)
- Frontend config: `frontend/nuxt.config.ts:235-298`
- Backend CORS: `backend/src/main.rs:317-318`
