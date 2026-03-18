# Multi-Agent Implementation Plan: All 3 Changes

**Created:** 2026-03-09  
**Executor:** Sisyphus (via `/start-work`)  
**Estimated Duration:** 5.5 hours  
**Parallel Speedup:** ~60% faster than sequential

---

## 📊 CHANGES OVERVIEW

### Change 1: fix-frontend-bugs (EXISTING)
- **Status:** Ready for implementation
- **Artifacts:** ✅ proposal, ✅ design, ✅ tasks (33 tasks)
- **Focus:** Theme transition fix (100ms) + Scroll fix

### Change 2: enhance-homepage-slider (NEW)
- **Status:** Artifacts ready
- **Artifacts:** ✅ proposal, ✅ design, ✅ tasks
- **Focus:** 5 slides, pause-on-hover, arrows, keyboard

### Change 3: improve-language-mixing (NEW)
- **Status:** Artifacts ready
- **Artifacts:** ✅ proposal, ✅ design, ✅ tasks
- **Focus:** Monelo pattern (mixed EN-ID)

---

## 🎯 PHASE 1: ARTIFACT CREATION (COMPLETED ✅)

**Duration:** 30 minutes  
**Agents:** 2 parallel writing agents

### Agent A: enhance-homepage-slider Docs
- ✅ Created design.md (119 lines)
- ✅ Created tasks.md (estimated 20 tasks)

### Agent B: improve-language-mixing Docs
- ✅ Created design.md (estimated 100 lines)
- ✅ Created tasks.md (estimated 25 tasks)

---

## 🚀 PHASE 2: PARALLEL IMPLEMENTATION

**Duration:** 4-5 hours  
**Agents:** 3 parallel implementation agents

### Agent 1: fix-frontend-bugs (quick category)
```yaml
Priority: HIGH (critical fixes)
Tasks: 33 tasks
Files:
  - frontend/app/assets/css/main.css (scroll + transition)
  - frontend/app/components/Navigation/MainNav.vue (toggle)
  - frontend/app/layouts/dashboard.vue (toggle consistency)

Estimated: 1.5-2 hours
Dependencies: None
```

### Agent 2: enhance-homepage-slider (visual-engineering category)
```yaml
Priority: MEDIUM (enhancement)
Tasks: ~20 tasks
Files:
  - frontend/app/pages/index.vue (slides, pause, arrows, keyboard)
  - public/images/banner-4.jpg (placeholder)
  - public/images/banner-5.jpg (placeholder)

Estimated: 2-3 hours
Dependencies: None
```

### Agent 3: improve-language-mixing (writing + unspecified-high)
```yaml
Priority: MEDIUM (content/branding)
Tasks: ~25 tasks
Files:
  - frontend/app/pages/index.vue (headlines)
  - frontend/app/locales/id.json (mixed pattern)
  - frontend/app/locales/en.json (full English)

Estimated: 3-4 hours
Dependencies: None
```

---

## ✅ PHASE 3: INTEGRATION & VERIFICATION

**Duration:** 1 hour  
**Agent:** 1 oracle agent

### Final Verification Agent
```yaml
Tasks:
  1. Test all 3 changes work together
  2. Check for CSS conflicts
  3. Verify no JavaScript errors
  4. Run Vitest unit tests
  5. Run Playwright E2E tests
  6. Check responsive behavior
  7. Verify i18n works (both languages)
  8. Test cross-browser (Chrome, Firefox, Safari)
```

---

## 📋 DETAILED TASK BREAKDOWN

### fix-frontend-bugs (33 tasks)

**Already completed (from earlier session):**
- [x] Remove overflow: hidden (scroll fix)
- [x] Remove gradient sweep animation
- [x] Add 100ms CSS transitions
- [x] Simplify MainNav toggle logic
- [x] Fix dashboard layout toggle

**Remaining:** Verify all changes + test

---

### enhance-homepage-slider (~20 tasks)

**Group 1: Content (3 tasks)**
- [ ] Add slide 4 (services focus)
- [ ] Add slide 5 (trust/social proof)
- [ ] Verify all 5 slides unique IDs

**Group 2: Pause Feature (4 tasks)**
- [ ] Add @mouseenter/@mouseleave handlers
- [ ] Implement pauseCarousel function
- [ ] Implement resumeCarousel function
- [ ] Test pause functionality

**Group 3: Arrow Navigation (6 tasks)**
- [ ] Create left arrow button (SVG)
- [ ] Create right arrow button (SVG)
- [ ] Add prevSlide function
- [ ] Add nextSlide function
- [ ] Add resetInterval function
- [ ] Test arrow navigation

**Group 4: Keyboard (3 tasks)**
- [ ] Add keyboard event listener
- [ ] Add cleanup on unmount
- [ ] Test keyboard navigation

**Group 5: Testing (4 tasks)**
- [ ] Test all 5 slides cycle
- [ ] Test responsive behavior
- [ ] Test looping (5→1, 1→5)
- [ ] Verify no console errors

---

### improve-language-mixing (~25 tasks)

**Group 1: Banner Headlines (7 tasks)**
- [ ] Update slide 1 headline to English
- [ ] Add Indonesian subtitle for slide 1
- [ ] Update slide 2 headline + subtitle
- [ ] Update slide 3 headline + subtitle
- [ ] Update slide 4 headline + subtitle
- [ ] Update slide 5 headline + subtitle
- [ ] Verify consistency

**Group 2: Section Headlines (5 tasks)**
- [ ] Change "Tentang Esperion" → "About Esperion"
- [ ] Change "Layanan Kami" → "Our Services"
- [ ] Change "Portofolio Pilihan" → "Featured Works"
- [ ] Change "Artikel Terbaru" → "Latest Articles"
- [ ] Change CTA headline → "Ready to Grow Digitally?"

**Group 3: i18n Indonesian (5 tasks)**
- [ ] Update id.json banner translations
- [ ] Update id.json section translations
- [ ] Verify service names in English
- [ ] Verify CTAs in Indonesian
- [ ] Test Indonesian version

**Group 4: i18n English (4 tasks)**
- [ ] Update en.json (full English)
- [ ] Sync with id.json
- [ ] Verify no Indonesian in en.json
- [ ] Test English version

**Group 5: Testing (4 tasks)**
- [ ] Test language toggle ID↔EN
- [ ] Verify headlines English in both
- [ ] Verify subtitles ID in Indonesian version
- [ ] Cross-browser testing

---

## ⏱️ TIMELINE (Gantt-style)

```
Hour 0:00  ████████████████████████ PHASE 1 COMPLETE ✅
           (Artifacts created)

Hour 0:30  ┌─► Agent 1: fix-frontend-bugs (2h)
           ├─► Agent 2: enhance-slider (3h)
           └─► Agent 3: language-mixing (4h)

Hour 2:30  ✓ Agent 1 COMPLETE
           ├─► Agent 2: continuing (1.5h left)
           └─► Agent 3: continuing (2.5h left)

Hour 3:30  ✓ Agent 2 COMPLETE
           └─► Agent 3: continuing (1.5h left)

Hour 5:00  ✓ Agent 3 COMPLETE
           └─► Final verification (1h)

Hour 6:00  🎉 ALL COMPLETE!
```

---

## 🤖 AGENT ALLOCATION

### Wave 1 (0:30 - 2:30)
```
Agent 1: quick
  └─ Fix scroll + theme transition

Agent 2: visual-engineering
  └─ Enhance homepage slider

Agent 3: writing + unspecified-high
  └─ Language mixing improvements
```

### Wave 2 (2:30 - 5:00)
```
Agent 3: continues language mixing
  └─ Finishes remaining i18n tasks
```

### Wave 3 (5:00 - 6:00)
```
Agent 4: oracle
  └─ Integration testing + verification
```

---

## 🎯 SUCCESS METRICS

### fix-frontend-bugs
- ✅ Scroll works on all pages
- ✅ Theme toggle responds every click
- ✅ Transition completes in ~100ms
- ✅ Zero console errors

### enhance-homepage-slider
- ✅ 5 slides total with diverse content
- ✅ Auto-rotate every 5 seconds
- ✅ Pause on hover functional
- ✅ Arrow navigation works
- ✅ Keyboard navigation (← →) works
- ✅ Responsive (arrows hidden < 768px)

### improve-language-mixing
- ✅ All headlines in English
- ✅ All subtitles in Indonesian
- ✅ Service names in English
- ✅ CTAs in Indonesian
- ✅ i18n synchronized
- ✅ Language toggle works

---

## ⚠️ RISK MITIGATION

### Risk 1: Agent conflicts on same files
**Mitigation:** Each agent works on different files
- Agent 1: CSS + MainNav
- Agent 2: index.vue (slider only)
- Agent 3: index.vue (headlines) + i18n

### Risk 2: Merge conflicts
**Mitigation:** Agent 1 finishes first, commits. Agents 2 & 3 work on separate sections.

### Risk 3: i18n sync issues
**Mitigation:** Agent 3 updates both files together, tests immediately.

### Risk 4: Scope creep
**Mitigation:** Strict task boundaries, pause if new requirements emerge.

---

## 📝 EXECUTION INSTRUCTIONS

**To start this plan:**

```bash
/start-work multi-agent-all-changes
```

**This will:**
1. Register all 3 changes
2. Deploy 3 parallel agents
3. Track progress in real-time
4. Enable automatic continuation
5. Notify on completion

---

## 🔗 CHANGE LINKS

- **fix-frontend-bugs:** `openspec/changes/fix-frontend-bugs/`
- **enhance-homepage-slider:** `openspec/changes/enhance-homepage-slider/`
- **improve-language-mixing:** `openspec/changes/improve-language-mixing/`

---

## ✅ CHECKLIST FOR START-WORK

Before executing `/start-work`:

- [ ] All artifacts created (✅ Done)
- [ ] Plan reviewed and approved
- [ ] No blocking questions
- [ ] Ready for parallel execution

**READY TO DEPLOY!** 🚀
