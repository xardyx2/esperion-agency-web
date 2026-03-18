# Plan: Fix Banner Slider Animation

## TL;DR

> **Quick Summary**: Memperbaiki animasi banner slider di home page dari fade (instant) menjadi slide horizontal dengan efek geser yang smooth. Slider sudah memiliki auto-rotate 5 detik dan pause on hover.
>
> **Deliverables**:
> - Animasi slide horizontal (translateX) saat pergantian slide
> - Slide aktif masuk dari kanan, slide lama keluar ke kiri
> - Semua fitur existing tetap berfungsi (auto-rotate, pause on hover, touch swipe, keyboard nav)
>
> **Estimated Effort**: Quick (1 task)
> **Parallel Execution**: NO - single task
> **Critical Path**: Task 1 → Verification

---

## Context

### Original Request
Banner slider di home section pertama (dengan tulisan "Trusted by Growing Businesses") saat ini berpindah secara instant/fade tanpa animasi geser. User menginginkan:
1. Animasi geser (slide) saat pergantian slide
2. Auto-slide setiap 5 detik (sudah ada)
3. Pause saat hover (sudah ada)
4. Gambar tiap slide berbeda (sudah ada)

### Current Implementation Analysis
**File**: `frontend/app/pages/index.vue` (baris 1-106)

**Problem Identified**:
1. Menggunakan `<TransitionGroup name="banner">` dengan `v-show` - `v-show` tidak trigger enter/leave transitions dengan baik karena elemen tidak di-add/remove dari DOM
2. CSS hanya menggunakan opacity transition (fade), bukan transform (slide)
3. Semua slides ditumpuk dengan `absolute inset-0` tapi tidak ada transform untuk pergeseran

**Current CSS (baris 943-957)**:
```css
.banner-enter-active,
.banner-leave-active {
  transition: opacity var(--es-transition-duration) ease-in-out; /* Fade only */
}
.banner-enter-from,
.banner-leave-to {
  opacity: 0;
}
```

**What Works (Don't Touch)**:
- Auto-rotate 5 detik: ✅ (baris 735-743)
- Pause on hover: ✅ (baris 751-759)
- Touch swipe: ✅ (baris 772-800)
- Keyboard navigation: ✅ (baris 837-843)
- Dot navigation: ✅ (baris 54-63)
- Arrow navigation: ✅ (baris 66-105)
- Different images per slide: ✅ (banner-1.jpg to banner-5.jpg)

---

## Work Objectives

### Core Objective
Mengubah animasi banner dari fade menjadi slide horizontal dengan efek geser smooth menggunakan CSS transform.

### Concrete Deliverables
- Modifikasi CSS transition dari opacity-based ke transform-based
- Slide baru masuk dari kanan (translateX: 100% → 0)
- Slide lama keluar ke kiri (translateX: 0 → -100%)
- Timing dan easing yang smooth (500ms dengan ease-in-out)

### Definition of Done
- [ ] Animasi slide horizontal berfungsi saat auto-rotate
- [ ] Animasi slide horizontal berfungsi saat manual navigation (dots/arrows)
- [ ] Tidak ada visual glitch atau flicker
- [ ] Semua fitur existing tetap berfungsi

### Must Have
- Transform-based slide animation (translateX)
- Smooth 500ms transition
- Support untuk direction (next = slide left, prev = slide right)

### Must NOT Have (Guardrails)
- Jangan ubah logika auto-rotate (sudah berfungsi)
- Jangan ubah logika pause on hover (sudah berfungsi)
- Jangan ubah logika touch/keyboard navigation (sudah berfungsi)
- Jangan tambah library carousel eksternal (tetap custom implementation)
- Jangan ubah struktur data slides (sudah optimal)

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision
- **Infrastructure exists**: YES (Playwright E2E tersedia)
- **Automated tests**: NO (tambahan manual verification via Playwright)
- **Framework**: Playwright untuk visual verification

### QA Policy
Setiap task MUST include agent-executed QA scenarios.
Evidence saved ke `.sisyphus/evidence/`.

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Single Task - Foundation Fix):
└── Task 1: Fix Banner Slider Animation

Wave FINAL (Verification):
├── Task F1: Visual QA - Playwright screenshot comparison
├── Task F2: Functionality QA - Verify all interactions
└── Task F3: Code review - Verify no regression
```

### Dependency Matrix
- **Task 1**: —
- **F1-F3**: Depends on Task 1

---

## TODOs

- [ ] 1. Fix Banner Slider Animation

  **What to do**:
  - Buka file `frontend/app/pages/index.vue`
  - Modifikasi bagian `<style scoped>` untuk animasi banner (baris 935-962)
  - Ganti CSS transition dari opacity-based ke transform-based
  - Tambahkan direction-aware animation (slide left untuk next, slide right untuk prev)
  - Pastikan z-index layering benar untuk overlap transitions

  **Implementation Details**:

  **Step 1: Update CSS Variables** (baris 937-941)
  ```css
  :root {
    --es-transition-duration: 500ms;
    --es-easing-material: cubic-bezier(0.4, 0, 0.2, 1);
  }
  ```

  **Step 2: Replace Banner CSS** (ganti baris 943-962)
  ```css
  /* Banner Slider Styles - Transform-based slide animation */
  .banner-enter-active,
  .banner-leave-active {
    transition: transform var(--es-transition-duration) var(--es-easing-material);
    will-change: transform;
  }

  /* Next slide: enter from right */
  .banner-enter-from {
    transform: translateX(100%);
  }
  .banner-enter-to {
    transform: translateX(0);
  }

  /* Current slide: leave to left */
  .banner-leave-from {
    transform: translateX(0);
  }
  .banner-leave-to {
    transform: translateX(-100%);
  }

  .banner-slide {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  /* Active slide z-index */
  .banner-slide.active {
    z-index: 2;
  }
  ```

  **Step 3: Update Template** (baris 12-16)
  Tambahkan class conditional untuk active slide:
  ```vue
  <div
    v-for="(slide, index) in bannerSlides"
    :key="slide.id"
    v-show="currentSlide === index"
    class="banner-slide"
    :class="{ 'active': currentSlide === index }"
  >
  ```

  **Alternative: Mode-based approach** (jika TransitionGroup tidak berfungsi optimal):
  ```vue
  <TransitionGroup name="banner" mode="out-in">
  ```

  **Must NOT do**:
  - Jangan ubah struktur slides data
  - Jangan ubah logika JavaScript auto-rotate
  - Jangan ubah event handlers (mouseenter, mouseleave, touch, keyboard)
  - Jangan tambah library eksternal

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Task ini berkaitan dengan CSS animation, transforms, dan visual effects yang membutuhkan pemahaman CSS yang baik
  - **Skills**: []
    - Task ini tidak memerlukan skill khusus, cukup CSS/Vue knowledge

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: Verification tasks F1-F3
  - **Blocked By**: None

  **References**:
  - File target: `frontend/app/pages/index.vue`
    - Baris 1-106: Template section banner
    - Baris 935-962: CSS styles untuk banner
    - Baris 731-769: JavaScript logic untuk slides

  **Acceptance Criteria**:
  - [ ] Banner slides menggunakan transform: translateX() bukan opacity
  - [ ] Slide baru masuk dari kanan (translateX: 100% → 0)
  - [ ] Slide lama keluar ke kiri (translateX: 0 → -100%)
  - [ ] Transitions smooth dengan 500ms duration
  - [ ] Auto-rotate tetap berfungsi setiap 5 detik
  - [ ] Pause on hover tetap berfungsi
  - [ ] Manual navigation (dots/arrows) tetap berfungsi
  - [ ] Touch swipe tetap berfungsi
  - [ ] Keyboard navigation tetap berfungsi

  **QA Scenarios**:

  ```
  Scenario: Auto-rotate slide animation
    Tool: Playwright (screenshot comparison)
    Preconditions: Browser open at http://localhost:3000, banner visible
    Steps:
      1. Navigate to home page
      2. Wait for first slide (slide 1 with title)
      3. Wait 5 seconds for auto-rotate
      4. Capture screenshot during transition
      5. Verify transform: translateX animation visible (not instant)
      6. Wait for transition complete
      7. Verify slide 2 is now visible
    Expected Result: Slide bergeser dari kanan ke kiri dengan animasi smooth
    Failure Indicators: Slide berubah instant tanpa animasi atau tidak berubah
    Evidence: .sisyphus/evidence/task-1-auto-rotate.png

  Scenario: Manual navigation with arrow buttons
    Tool: Playwright
    Preconditions: Browser open at home page, banner visible
    Steps:
      1. Navigate to home page
      2. Click right arrow (next slide)
      3. Capture screenshot during transition
      4. Verify slide animation direction (kanan ke kiri)
      5. Click left arrow (previous slide)
      6. Capture screenshot
      7. Verify slide animation direction (kiri ke kanan)
    Expected Result: Animasi slide berbeda arah untuk next vs prev
    Failure Indicators: Animasi arah sama atau tidak ada animasi
    Evidence: .sisyphus/evidence/task-1-manual-nav.png

  Scenario: Pause on hover
    Tool: Playwright
    Preconditions: Browser open at home page, banner auto-rotating
    Steps:
      1. Navigate to home page
      2. Wait 2 seconds (mid-rotation cycle)
      3. Hover mouse over banner area
      4. Wait 10 seconds
      5. Verify slide tidak berubah (paused)
      6. Move mouse away from banner
      7. Wait 5 seconds
      8. Verify slide berubah (resumed)
    Expected Result: Auto-rotate pauses saat hover, resumes saat mouse leave
    Failure Indicators: Slide tetap berubah saat hover atau tidak resume
    Evidence: .sisyphus/evidence/task-1-hover-pause.png

  Scenario: Touch swipe on mobile viewport
    Tool: Playwright (mobile emulation)
    Preconditions: Browser open at home page, mobile viewport (375x667)
    Steps:
      1. Set viewport to mobile size
      2. Navigate to home page
      3. Swipe left on banner area
      4. Verify next slide animates in
      5. Swipe right on banner area
      6. Verify previous slide animates in
    Expected Result: Touch swipe trigger slide change dengan animasi
    Failure Indicators: Swipe tidak berfungsi atau tanpa animasi
    Evidence: .sisyphus/evidence/task-1-touch-swipe.png
  ```

  **Evidence to Capture**:
  - [ ] Screenshots dari tiap transition state (start, mid, end)
  - [ ] Video recording dari auto-rotate sequence
  - [ ] Console logs untuk memastikan tidak ada error

  **Commit**: YES
  - Message: `fix(ui): add slide animation to home banner`
  - Files: `frontend/app/pages/index.vue`
  - Pre-commit: `npm run type-check` (di Docker)

---

## Final Verification Wave

- [ ] F1. **Visual QA - Playwright Screenshot Comparison**
  Jalankan Playwright untuk capture screenshots dari banner dalam berbagai state:
  - Slide 1 visible
  - Transition dari slide 1 ke 2 (mid-animation)
  - Slide 2 visible
  - Transition dari slide 2 ke 3 (mid-animation)
  
  Verifikasi bahwa semua screenshots menunjukkan transform-based animation (bukan opacity).
  Output: `.sisyphus/evidence/final-visual-qa/`

- [ ] F2. **Functionality QA - All Interactions**
  Test semua interaction scenarios:
  - Auto-rotate 5 detik
  - Pause on hover
  - Manual navigation (dots dan arrows)
  - Touch swipe (mobile viewport)
  - Keyboard navigation (arrow keys)
  
  Semua harus berfungsi dengan animasi slide.
  Output: Test report dengan PASS/FAIL per scenario

- [ ] F3. **Code Review - No Regression**
  Review changes untuk memastikan:
  - Tidak ada perubahan pada logic JavaScript (hanya CSS)
  - Tidak ada perubahan pada data structure
  - Tidak ada perubahan pada event handlers
  - Hanya CSS transforms yang ditambahkan
  
  Output: Review checklist dengan sign-off

---

## Commit Strategy

- **1**: `fix(ui): add slide animation to home banner`
  - File: `frontend/app/pages/index.vue`
  - Changes: CSS banner transitions (opacity → transform)

---

## Success Criteria

### Verification Commands
```bash
# Run type check
cd frontend && npm run type-check

# Run dev server and manual verification
docker-compose up -d frontend
# Open http://localhost:3000 and verify banner animation
```

### Final Checklist
- [ ] Banner menggunakan transform: translateX untuk animasi slide
- [ ] Animasi smooth dengan 500ms duration
- [ ] Auto-rotate 5 detik berfungsi
- [ ] Pause on hover berfungsi
- [ ] Manual navigation berfungsi
- [ ] Touch swipe berfungsi
- [ ] Keyboard navigation berfungsi
- [ ] Tidak ada visual glitch
- [ ] Type check pass
- [ ] No console errors

---

## Technical Notes

### Why `v-show` + TransitionGroup Issue
`v-show` hanya toggle visibility (display: none/block) dan tidak trigger Vue's enter/leave transitions karena elemen tidak di-add/remove dari DOM. Namun, dengan CSS transform dan proper positioning, kita masih bisa mencapai efek slide.

### Alternative Solutions Considered
1. **Switch to `v-if`**: Would trigger enter/leave tapi ada overhead DOM manipulation
2. **Use Swiper/Splide library**: Terlalu heavy untuk simple use case ini
3. **CSS-only marquee**: Tidak support untuk interactive navigation

### Chosen Approach
Keep existing structure, modify CSS to use transform-based animations dengan absolute positioning. Ini paling minimal dan tidak mengubah behavior existing.
