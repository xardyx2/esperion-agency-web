## Context

### Current State

**Article Detail Page** (`frontend/app/pages/articles/[slug].vue`):
- Uses `findPublicArticleBySlug()` from `public-content.ts`
- Throws `createError({ statusCode: 404 })` when article not found
- Slug parsing handles both string and array types from route params
- Has 404 error handling but issue suspected in navigation

**Service Detail Page** (`frontend/app/pages/our-services/[slug].vue`):
- Uses `findPublicServiceBySlug()` from `public-content.ts`
- Throws `createError({ statusCode: 404 })` when service not found
- Similar slug parsing logic to articles
- Navigation from `our-services.vue` uses `localePath()` correctly

**Language Switcher** (`frontend/app/components/ui/LanguageSwitcher.vue`):
- Switches locale using `setLocale()`
- When on article detail, calls `articlesApi.getByAnySlug()` to find mapped slug
- Falls back to `findPublicArticleBySlug()` if API call fails
- Uses `navigateTo()` to redirect to new locale path
- Issue: Causes scroll jump and blocks scrolling

### Root Cause Hypotheses

#### 1. Article Detail Not Loading

**Hypothesis A: Slug Mismatch in Navigation**
- Link in `articles.vue` uses `articlePath()` which appends `/articles/${slug}`
- `findPublicArticleBySlug()` matches `slug_id` OR `slug_en`
- If users click from ID page to EN page, slug might not match

**Hypothesis B: Route Params Parsing**
- `route.params.slug` can be `string | string[] | undefined`
- Current parsing: `Array.isArray(raw) ? raw[0] ?? '' : typeof raw === 'string' ? raw : ''`
- Edge case: Double-encoded slug or special characters

**Hypothesis C: Data Node Cache**
- `publicArticles` is static array imported at module level
- No reactivity or fetching from backend
- Could be undefined if module evaluation fails

#### 2. Service Detail Not Loading

**Hypothesis A: Service Not in publicServices Array**
- Services data static in `public-content.ts`
- If service slug not in list, `findPublicServiceBySlug()` returns `undefined`
- No error boundary or fallback

**Hypothesis B: Link URL Mismatch**
- Link uses `localePath('/our-services/${service.slug}')`
- If service.slug differs from actual data, 404 occurs

#### 3. Language Switch Scroll Jump

**Hypothesis A: Nuxt i18n Scroll Behavior**
- `@nuxtjs/i18n` module has default scroll behavior
- When locale changes, page might scroll to top
- No custom `scrollBehavior` configured in nuxt.config.ts

**Hypothesis B: NavigateTo Triggers Full Reload**
- `await navigateTo()` might cause complete page reload
- Memory scroll position lost
- Scroll position not restored after navigation

**Hypothesis C: Scroll Lock via CSS**
- Language switcher dropdown might apply `overflow: hidden`
- Body lock applied but not removed after navigation

### File Paths to Investigate

| File | Purpose | Lines to Check |
|------|---------|----------------|
| `frontend/app/pages/articles/[slug].vue` | Article detail page | 124-180 (script) |
| `frontend/app/pages/our-services/[slug].vue` | Service detail page | 157-200 (script) |
| `frontend/app/data/public-content.ts` | Static data | 566-576 (find functions) |
| `frontend/app/components/ui/LanguageSwitcher.vue` | Language switch | 52-81 (switchToLanguage) |
| `frontend/nuxt.config.ts` | Scroll behavior config | 201-218 (i18n config) |
| `frontend/app/app.vue` | Root layout | Complete file |

---

## Goals / Non-Goals

### Goals

1. **Article Detail Loading**: "Baca Selengkapnya" click → article page displays correctly
2. **Service Detail Loading**: "Pelajari Detailnya" click → service page displays correctly
3. **Scroll Preservation**: Language switch maintains scroll position or smooth transition
4. **Error Handling**: 404 pages render cleanly for non-existent slugs

### Non-Goals

- Not changing data structure in `public-content.ts`
- Not modifying routing pattern (`[slug].vue`)
- Not adding new features to detail pages
- Not replacing `@nuxtjs/i18n` module

---

## Decisions

### Decision 1: Debug Strategy - Add Diagnostic Logging

**Chosen:** Add console.log statements to slug parsing and data lookup

**Rationale:**
- Quick way to identify if issue is data loading or routing
- No build-time changes required
- Can be removed after debugging

**Implementation:**
```typescript
// articles/[slug].vue
const slugParam = computed(() => {
  const raw = route.params.slug;
  console.log('[Article Detail] Raw slug from route:', raw);
  
  if (Array.isArray(raw)) {
    console.log('[Article Detail] Slug is array, taking first element');
    return raw[0] ?? '';
  }

  const result = typeof raw === 'string' ? raw : '';
  console.log('[Article Detail] Final slug:', result);
  return result;
});

const article = computed(() => {
  const record = findPublicArticleBySlug(slugParam.value);
  console.log('[Article Detail] Found article:', record);
  
  if (!record) {
    console.error('[Article Detail] No article found for slug:', slugParam.value);
    throw createError({ statusCode: 404, statusMessage: 'Article not found' });
  }
  return record;
});
```

---

### Decision 2: Fix Navigation Links - Validate Slug in Link

**Chosen:** Update `articles.vue` and `our-services.vue` to use slug directly from data

**Rationale:**
- Current code: `:to="articlePath(article)"` → generates path
- Can verify slug matches data before navigation
- No backend call needed for static content

**Implementation:**
```vue
<!-- articles.vue - Already correct with articlePath() -->
<!-- Verify articlePath generates correct URL for both languages -->
const articlePath = (article: (typeof publicArticles)[number]) => {
  const slug = locale.value === 'en' ? (article.slug_en || article.slug_id) : article.slug_id;
  return localePath(`/articles/${slug}`);
};
```

**Action:** Add logging to verify `articlePath()` returns correct URL

---

### Decision 3: Scroll Behavior - Configure nuxt.config.ts

**Chosen:** Add custom `scrollBehavior` function to preserve scroll on navigation

**Rationale:**
- Default i18n scroll might reset to top on locale change
- Custom behavior can save/restore scroll position
- Vue Router supports `scrollBehavior(to, from, savedPosition)`

**Implementation:**
```typescript
// nuxt.config.ts - Add to i18n config
i18n: {
  // ... existing config ...
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'i18n_redirected',
    redirectOn: 'root',
    fallbackLocale: 'id',
    alwaysRedirect: true
  },
  // NEW: Scroll behavior on locale change
  scrollBehavior: {
    type: 'hash', // or 'position'
    compare: (a: Location, b: Location) => {
      // Custom comparison to preserve scroll
      return a.path === b.path && a.hash === b.hash;
    }
  }
}
```

**Alternative:** Use `scrollBehavior` hook in `app.vue` or `pages/_page.vue`

---

### Decision 4: Error Handling - Consistent 404 Handling

**Chosen:** Keep `createError({ statusCode: 404 })` but verify error page exists

**Rationale:**
- Nuxt 3 handles errors automatically with `error.vue`
- Must verify error page renders for both articles and services
- Ensure error message is user-friendly

**Implementation:**
```vue
<!-- frontend/app/pages/error.vue (if exists) -->
<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-6xl font-bold">404</h1>
      <p class="text-xl mt-4">Halaman tidak ditemukan</p>
      <NuxtLink :to="localePath('/')" class="mt-4 inline-block">
        Kembali ke Beranda
      </NuxtLink>
    </div>
  </div>
</template>
```

---

### Decision 5: Language Switch - Scroll Position Management

**Chosen:** Save scroll position before navigation, restore after

**Rationale:**
- `navigateTo()` might cause full page reload
- Scroll position in `sessionStorage` or `localStorage` can persist
- User experience: no jump, smooth transition

**Implementation:**
```typescript
// LanguageSwitcher.vue - Modify switchToLanguage
async function switchToLanguage(code: 'id' | 'en') {
  if (code === locale.value) return

  // Save current scroll position
  const currentScroll = window.scrollY || 0;
  sessionStorage.setItem('lastScrollPosition', JSON.stringify({
    path: route.fullPath,
    scroll: currentScroll,
    timestamp: Date.now()
  }));

  // ... existing slug lookup logic ...

  await setLocale(code);
  await navigateTo(`/${code}/articles/${mappedSlug}`);

  // Restore scroll after navigation (in onMounted)
  // handled by scrollBehavior or separate hook
}
```

**Add to detail pages:**
```typescript
// articles/[slug].vue and our-services/[slug].vue
onMounted(() => {
  const saved = sessionStorage.getItem('lastScrollPosition');
  if (saved) {
    const { path, scroll } = JSON.parse(saved);
    if (path === route.fullPath) {
      window.scrollTo(0, scroll);
      sessionStorage.removeItem('lastScrollPosition');
    }
  }
});
```

---

## Scroll Behavior Configuration

### Current nuxt.config.ts Analysis

**i18n Section (lines 201-218):**
```typescript
i18n: {
  strategy: 'prefix',
  locales: [
    { code: 'id', iso: 'id-ID', name: 'Bahasa Indonesia', file: 'id.json' },
    { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' }
  ],
  defaultLocale: 'id',
  lazy: true,
  langDir: 'locales',
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'i18n_redirected',
    redirectOn: 'root',
    fallbackLocale: 'id',
    alwaysRedirect: true
  }
}
```

**Issue:** No `scrollBehavior` property configured. i18n module uses default behavior.

### Proposed Configuration

```typescript
i18n: {
  // ... existing config ...
  
  // Scroll behavior - NEW
  scrollBehaviorType: 'preserve', // or 'hash' or 'position'
  
  detectBrowserLanguage: {
    // ... existing config ...
  }
}
```

**Alternative: Custom scrollBehavior in plugin**

Create `frontend/app/plugins/scroll.behavior.ts`:
```typescript
export default defineNuxtPlugin(() => {
  const router = useRouter();
  
  router.options.scrollBehavior = async (to, from, savedPosition) => {
    // If user navigated using back/forward
    if (savedPosition) {
      return savedPosition;
    }
    
    // If navigating to same route with different query/hash
    if (to.path === from.path) {
      return { top: 0, left: 0 }; // Reset scroll
    }
    
    // For locale changes, try to preserve scroll
    const lastScroll = sessionStorage.getItem('nuxt-last-scroll');
    if (lastScroll) {
      const { scroll } = JSON.parse(lastScroll);
      return { x: 0, y: scroll };
    }
    
    // Default: scroll to top
    return { x: 0, y: 0 };
  };
  
  // Save scroll before navigation
  router.beforeEach((to) => {
    const scroll = window.scrollY || 0;
    sessionStorage.setItem('nuxt-last-scroll', JSON.stringify({ scroll }));
  });
});
```

---

## Open Questions

### 1. Are article links in articles.vue using correct slug format?

**Question:** When user clicks "Baca Selengkapnya", does the generated URL match `publicArticles.slug_id` exactly?

**Verification:**
- Check produced HTML: `href="/articles/digital-marketing-trends-2024"`
- Check data: `slug_id: 'digital-marketing-trends-2024'`
- Check English: `slug_en: 'digital-marketing-trends-2024'`

**Test Plan:**
1. Open `/id/articles`
2. Click "Baca Selengkapnya" on first article
3. Check browser console for slug log
4. Verify article displays

---

### 2. Is the issue specific to translated articles?

**Question:** Do articles work in Indonesian but fail in English?

**Hypothesis:** 
- Indonesian: `slug_id` matches → works
- English: `slug_en` might be different or missing → 404

**Check public-content.ts:**
```typescript
// Article 1 has both:
slug_id: 'digital-marketing-trends-2024',
slug_en: 'digital-marketing-trends-2024',  // Same - good

// What if some articles don't have slug_en?
// findPublicArticleBySlug checks: slug_id === slug || slug_en === slug
// This should still work if slug_en is undefined (loose equality)
```

---

### 3. Is navigateTo causing full page refresh?

**Question:** Does `await navigateTo()` in LanguageSwitcher cause complete reload?

**Check:**
- `navigateTo` from `#app` is client-side navigation
- Should NOT cause full reload
- Scroll jump likely from i18n behavior, not reload

**Evidence to gathering:**
- If scroll is preserved after navigation → i18n scroll issue
- If scroll is lost → navigateTo behavior or page structure issue

---

## Migration Plan

### Phase 1: Investigation (30 minutes)

1. **Add logging to articles/[slug].vue**
   - Log raw route params
   - Log parsed slug
   - Log article lookup result

2. **Add logging to our-services/[slug].vue**
   - Same diagnostic pattern

3. **Test article navigation**
   - Open `/id/articles`
   - Click link, check logs
   - Verify article displays

4. **Test service navigation**
   - Open `/id/our-services`
   - Click link, check logs
   - Verify service displays

---

### Phase 2: Fix Scroll Behavior (45 minutes)

1. **Add scroll preservation to detail pages**
   - Save scroll before navigation (plugin or composable)
   - Restore scroll in onMounted
   - Clear saved scroll after restoration

2. **Config nuxt.config.ts scrollBehavior**
   - Add scrollBehaviorType or custom plugin
   - Test with language switch

3. **Test language switch**
   - Switch ID → EN on article detail
   - Check scroll position preserved
   - No jump or lock

---

### Phase 3: Error Handling (15 minutes)

1. **Verify error.vue page exists**
   - Check `frontend/app/pages/error.vue`
   - Ensure 404 renders correctly

2. **Test 404 scenarios**
   - `/articles/nonexistent-slug`
   - `/our-services/nonexistent-slug`
   - Should show 404 page, not blank

---

### Phase 4: Testing (30 minutes)

1. **Unit: Parameter parsing**
   - Test string slug
   - Test array slug
   - Test undefined slug

2. **Integration: Navigation flow**
   - Articles page → Article detail (ID)
   - Articles page → Article detail (EN)
   - Services page → Service detail (ID)
   - Services page → Service detail (EN)

3. **E2E: Language switch**
   - Switch on detail pages
   - Verify scroll preserved
   - Verify content updates
   - Verify no scroll lock

---

## File Changes Summary

| File | Changes | Purpose |
|------|---------|---------|
| `frontend/app/pages/articles/[slug].vue` | Add log statements + scroll restore | Debug + fix |
| `frontend/app/pages/our-services/[slug].vue` | Add log statements + scroll restore | Debug + fix |
| `frontend/app/plugins/scroll.behavior.ts` | New file - scroll preservation | Fix scroll |
| `frontend/app/components/ui/LanguageSwitcher.vue` | Add scroll save before navigation | Fix scroll |
| `frontend/nuxt.config.ts` | Review i18n scrollBehavior | Verify config |
