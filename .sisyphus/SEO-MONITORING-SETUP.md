# SEO Monitoring & Rank Tracking Setup

## 1. Google Search Console Setup

### 1.1 Verify Website Ownership

**Method 1: HTML File Verification (Recommended)**
1. Login ke [Google Search Console](https://search.google.com/search-console)
2. Click "Add Property" → "Domain"
3. Enter: `esperion.id`
4. Download verification file (e.g., `google123abc.html`)
5. Place file in: `frontend/public/google123abc.html`
6. Click "Verify"

**Method 2: Meta Tag Verification**
```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE">
```
Add to `frontend/app/layouts/default.vue` in `<head>`

### 1.2 Submit Sitemap
```
Sitemap URL: https://esperion.id/sitemap.xml
```

**Steps:**
1. Go to GSC → Sitemaps
2. Enter: `sitemap.xml`
3. Click "Submit"

### 1.3 Configure International Targeting
1. Go to GSC → Legacy Tools → International Targeting
2. Select "Indonesia" as target country
3. Enable "Target users in"

---

## 2. Rank Tracking Tools

### 2.1 Ubersuggest (Free Tier)
**URL:** https://neilpatel.com/ubersuggest/

**Setup:**
1. Create account
2. Add project: `esperion.id`
3. Add target keywords:
   - digital agency jakarta
   - jasa digital marketing
   - jasa seo jakarta
   - social media marketing jakarta
   - website development jakarta
4. Enable weekly email reports

### 2.2 Google Analytics 4
**Tracking ID:** `G-XXXXXXXXXX` (to be configured)

**Setup:**
1. Create GA4 property
2. Add tracking code to `nuxt.config.ts`:
```typescript
export default defineNuxtConfig({
  modules: [
    ['@nuxtjs/google-analytics', {
      id: 'G-XXXXXXXXXX'
    }]
  ]
})
```

### 2.3 Rank Tracker Spreadsheet

Create Google Sheets dengan columns:
| Keyword | Current Rank | Previous Rank | Change | Search Volume | URL |
|---------|--------------|---------------|--------|---------------|-----|
| digital agency jakarta | - | - | - | 1,200 | / |
| jasa digital marketing | - | - | - | 3,600 | /services |
| ... | ... | ... | ... | ... | ... |

**Update:** Weekly (every Monday)

---

## 3. Uptime Monitoring

### 3.1 Uptime Kuma Setup

**Docker Compose:**
```yaml
version: '3.8'

services:
  uptime-kuma:
    image: louislam/uptime-kuma:1
    container_name: uptime-kuma
    volumes:
      - ./uptime-kuma-data:/app/data
    ports:
      - "3001:3001"
    restart: always
```

**Access:** http://your-vps-ip:3001

**Monitors to Add:**
- https://esperion.id (Homepage)
- https://esperion.id/api/health (Backend API)
- https://esperion.id/articles (Articles page)
- https://esperion.id/contact-us (Contact form)

**Alert Channels:**
- Email: admin@esperion.id
- Discord webhook (optional)
- Telegram bot (optional)

---

## 4. Error Tracking (Sentry)

### 4.1 Sentry Setup

**Sign up:** https://sentry.io (Free tier: 5,000 events/month)

**Frontend Integration:**
```bash
npm install @sentry/vue @sentry/browser
```

**Configuration:**
```typescript
// frontend/plugins/sentry.client.ts
import * as Sentry from '@sentry/vue'

export default defineNuxtPlugin((nuxtApp) => {
  Sentry.init({
    app: nuxtApp.vueApp,
    dsn: 'YOUR_SENTRY_DSN',
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
  })
})
```

**Backend Integration:**
```rust
// backend/src/main.rs
use sentry;

fn main() {
    let _guard = sentry::init((
        "YOUR_SENTRY_DSN",
        sentry::ClientOptions {
            release: sentry::release_name!(),
            ..Default::default()
        }
    ));
    
    // ... rest of main
}
```

---

## 5. Performance Monitoring

### 5.1 Lighthouse CI

**Configuration:**
```json
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/our-services',
        'http://localhost:3000/articles',
      ],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', {minScore: 0.9}],
        'categories:accessibility': ['error', {minScore: 0.95}],
        'categories:seo': ['error', {minScore: 0.95}],
        'categories:best-practices': ['error', {minScore: 0.9}]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
}
```

**Run:**
```bash
npm install -D @lhci/cli
npx lhci autorun
```

### 5.2 Web Vitals Tracking

**Install:**
```bash
npm install web-vitals
```

**Plugin:**
```typescript
// frontend/plugins/web-vitals.client.ts
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals'

export default defineNuxtPlugin(() => {
  onCLS(console.log)
  onFID(console.log)
  onFCP(console.log)
  onLCP(console.log)
  onTTFB(console.log)
})
```

---

## 6. Weekly SEO Report Template

### 6.1 Report Structure

**File:** `.sisyphus/weekly-seo-reports/YYYY-MM-DD.md`

**Template:**
```markdown
# SEO Weekly Report - [DATE]

## Executive Summary
- Total Organic Traffic: [X] visitors (+/- X%)
- Average Position: [X.X] (+/- X.X)
- Top Ranking Keywords: [X]
- New Backlinks: [X]

## Keyword Rankings

### Tier 1 Keywords
| Keyword | Position | Change | Volume |
|---------|----------|--------|--------|
| digital agency jakarta | [X] | [↑↓→] | 1,200 |
| jasa digital marketing | [X] | [↑↓→] | 3,600 |

### Tier 2 Keywords
| Keyword | Position | Change | Volume |
|---------|----------|--------|--------|
| jasa seo jakarta | [X] | [↑↓→] | 720 |

## Content Performance
- Most Visited Article: [Title] - [X] views
- Highest Engagement: [Title] - [X] avg time
- New Articles Published: [X]

## Technical Health
- Core Web Vitals: [Pass/Fail]
- Mobile Usability: [X] issues
- Index Coverage: [X] pages indexed
- Crawl Errors: [X]

## Competitor Analysis
- Top Competitor: [Name]
- Their New Keywords: [X]
- Our Advantage: [Description]

## Action Items for Next Week
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## Notes
[Additional observations]
```

---

## 7. Alert Thresholds

### 7.1 Critical Alerts (Immediate Action)
- Website down > 5 minutes
- 404 errors > 10% of traffic
- Core Web Vitals fail
- Ranking drop > 10 positions for Tier 1 keywords

### 7.2 Warning Alerts (Monitor Closely)
- Ranking drop > 5 positions
- Traffic drop > 20% week-over-week
- Page load time > 3 seconds
- Mobile usability issues

### 7.3 Info Alerts (Weekly Review)
- New backlinks acquired
- New keywords ranking
- Competitor ranking changes
- Content opportunities

---

## 8. Monitoring Dashboard

### 8.1 Grafana Setup (Optional)

**Docker Compose:**
```yaml
services:
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3002:3000"
    volumes:
      - ./grafana-data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

**Dashboards:**
- SEO Performance Overview
- Keyword Rankings Trend
- Traffic Sources
- Competitor Comparison
- Content Performance

---

## 9. Automation Checklist

### Daily (Automated)
- [ ] Uptime check (Uptime Kuma)
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring

### Weekly (Manual Review)
- [ ] Update rank tracking spreadsheet
- [ ] Generate SEO report
- [ ] Review GSC performance
- [ ] Check competitor rankings
- [ ] Analyze top content

### Monthly (Strategic Review)
- [ ] Full SEO audit
- [ ] Content strategy update
- [ ] Technical SEO review
- [ ] Competitor analysis deep dive
- [ ] ROI calculation

---

## 10. Quick Commands

```bash
# Check website status
curl -I https://esperion.id

# Run Lighthouse audit
npx lighthouse https://esperion.id --output=json --output-path=report.json

# Check Core Web Vitals
npx web-vitals https://esperion.id

# Sitemap validation
curl https://esperion.id/sitemap.xml | xmllint --noout -

# robots.txt check
curl https://esperion.id/robots.txt
```

---

## Next Steps

1. [ ] Setup Google Search Console (Day 1)
2. [ ] Configure Sentry (Day 1)
3. [ ] Deploy Uptime Kuma (Day 2)
4. [ ] Create rank tracking spreadsheet (Day 2)
5. [ ] Setup weekly report automation (Day 3)
6. [ ] Configure alert channels (Day 3)
7. [ ] First weekly report (End of Week 1)

---

**Last Updated:** March 7, 2026  
**Next Review:** March 14, 2026
