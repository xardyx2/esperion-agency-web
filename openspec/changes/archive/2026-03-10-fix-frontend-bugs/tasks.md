# fix-frontend-bugs Tasks

## 1. Remove Scroll Blocker (CRITICAL)

- [x] 1.1 Open `frontend/app/assets/css/main.css` and locate line 109-112
- [x] 1.2 Remove `overflow: hidden;` from html element (delete line 111)
- [x] 1.3 Keep `position: relative;` if needed for other styles
- [x] 1.4 Save file and verify no TypeScript/lint errors
- [x] 1.5 **Verification**: Test scroll on homepage, about, articles, and dashboard pages

## 2. Remove Gradient Sweep Animation

- [x] 2.1 In `frontend/app/assets/css/css/main.css`, locate gradient sweep block (lines 108-144)
- [x] 2.2 Remove entire block including:
  - `html::before` pseudo-element definition
  - `html.theme-transitioning::before` animation trigger
  - `@keyframes gradientSweep` animation definition
- [x] 2.3 Save file and verify no CSS syntax errors
- [x] 2.4 **Verification**: Open DevTools, toggle theme - no gradient overlay should appear

## 3. Add 100ms CSS Transitions (Best Practice)

- [x] 3.1 In `frontend/app/assets/css/main.css`, add at end of file or theme section:
```css
@media (prefers-reduced-motion: no-preference) {
  html {
    transition: background-color 100ms ease, color 100ms ease;
  }
  
  body, body * {
    transition-property: background-color, border-color, color, fill, stroke;
    transition-duration: 100ms;
    transition-timing-function: ease;
  }
  
  /* Exclude media elements for performance */
  img, video, canvas, svg, iframe {
    transition: none;
  }
}
```
- [x] 3.2 Ensure CSS is properly formatted and saved
- [x] 3.3 **Verification**: Toggle theme - colors should fade smoothly in ~100ms

## 4. Simplify Theme Toggle Logic (Optional Cleanup)

- [x] 4.1 Open `frontend/app/components/Navigation/MainNav.vue`
- [x] 4.2 Locate `toggleTheme` function (lines 116-126)
- [x] 4.3 Simplify to:
```typescript
const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};
```
- [x] 4.4 Remove `document.documentElement.classList.add('theme-transitioning')` lines
- [x] 4.5 Remove `setTimeout` cleanup logic
- [x] 4.6 **Verification**: Toggle still works, no console errors

## 5. Dashboard Layout Theme Toggle (Consistency Check)

- [x] 5.1 Open `frontend/app/layouts/dashboard.vue`
- [x] 5.2 Check `toggleTheme` function (line 124-126)
- [x] 5.3 Update to use same pattern as MainNav:
```typescript
const colorMode = useColorMode();
const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};
```
- [x] 5.4 **Verification**: Dashboard theme toggle works same as public pages

## 6. Testing & Verification

- [x] 6.1 Restart frontend container: `docker-compose restart frontend`
- [x] 6.2 Clear browser cache: `Ctrl+Shift+R`
- [x] 6.3 **Scroll Test**: Scroll through all pages (public + dashboard)
- [x] 6.4 **Theme Toggle Test**: Click theme toggle 20+ times on different pages
- [x] 6.5 **Transition Speed Test**: Measure with DevTools - should be ~100ms
- [x] 6.6 **Console Check**: No colorMode or CSS errors
- [x] 6.7 **Mobile Test**: Test on Chrome DevTools mobile view or real device
- [x] 6.8 **Lighthouse Check**: Run Lighthouse, verify performance score maintained

## 7. Documentation Updates (Optional)

- [x] 7.1 Update `openspec/changes/fix-frontend-bugs/proposal.md` if scope changed
- [x] 7.2 Add note about removed gradient sweep animation
- [x] 7.3 Document 100ms transition choice rationale

## 8. Critical Fixes (Post-Implementation)

- [x] 8.1 Verify theme toggle button in navbar is working (check @click handler)
- [x] 8.2 Verify @nuxtjs/color-mode module is loaded in nuxt.config.ts
- [x] 8.3 Test theme toggle in browser - should switch between light/dark
- [x] 8.4 Check console for any colorMode-related errors

---

## Acceptance Criteria

- ✅ **Scroll works** on all pages (public homepage, articles, about, dashboard)
- ✅ **Theme toggle responds** on every click (20+ clicks test passed)
- ✅ **Transition completes** in ~100ms (measured with DevTools timeline)
- ✅ **Zero console errors** related to colorMode or CSS
- ✅ **No visual artifacts** or jank during theme switch
- ✅ **Mobile responsive** - works on iOS Safari and Android Chrome
- ✅ **Lighthouse score** maintained or improved
- ✅ **Footer theme toggle** - properly wired with useColorMode in SiteFooter.vue

## Files to Modify

1. `frontend/app/assets/css/main.css` - Primary changes
2. `frontend/app/components/Navigation/MainNav.vue` - Toggle logic cleanup
3. `frontend/app/layouts/dashboard.vue` - Consistency update

## External Dependencies

- None - purely frontend CSS and component changes

## Estimated Time

- **Implementation**: 30-45 minutes
- **Testing**: 15-20 minutes
- **Total**: ~1 hour
