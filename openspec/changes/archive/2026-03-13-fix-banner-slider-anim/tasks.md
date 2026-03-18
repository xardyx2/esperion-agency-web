# Tasks: Fix Banner Slider Animation

## Implementation Tasks

### Task 1: Fix Banner Slider CSS Animation
- [x] **Fix Banner Slider CSS Animation**
  - **Type**: Implementation
  - **Estimate**: 15 minutes
  - **Category**: visual-engineering
  - **Skills**: []
  
  **Description**:
  Modifikasi CSS animation pada banner slider dari opacity-based ke transform-based.
  
  **Acceptance Criteria**:
  - [ ] Slide menggunakan `transform: translateX()` untuk animasi
  - [ ] Slide baru masuk dari kanan (`translateX(100%) → translateX(0)`)
  - [ ] Slide lama keluar ke kiri (`translateX(0) → translateX(-100%)`)
  - [ ] Duration 500ms dengan material easing
  - [ ] Tidak ada visual glitch atau flicker
  
  **Implementation Steps**:
  1. Buka file `frontend/app/pages/index.vue`
  2. Navigate ke bagian `<style scoped>` (baris 935-962)
  3. Ganti CSS `.banner-enter-*` dan `.banner-leave-*` classes dengan transform-based animation
  4. Add `will-change: transform` untuk performance optimization
  5. Pastikan z-index layering benar
  
  **Required Code**:
  ```css
  /* Banner Slider Styles - Transform-based slide animation */
  .banner-enter-active,
  .banner-leave-active {
    transition: transform var(--es-transition-duration) var(--es-easing-material);
    will-change: transform;
  }
  
  .banner-enter-from {
    transform: translateX(100%);
  }
  .banner-enter-to {
    transform: translateX(0);
  }
  
  .banner-leave-from {
    transform: translateX(0);
  }
  .banner-leave-to {
    transform: translateX(-100%);
  }
  
  .banner-slide {
    position: absolute;
    inset: 0;
  }
  ```
  
  **Files**:
  - `frontend/app/pages/index.vue` (baris 935-962)
  
  **Must NOT Do**:
  - Jangan ubah struktur slides data
  - Jangan ubah logika JavaScript auto-rotate
  - Jangan ubah event handlers
  - Jangan tambah library eksternal
  
  **Verification**:
  - [ ] Type check pass: `npm run type-check`
  - [ ] No console errors
  - [ ] Animation smooth (60fps)
  - [ ] Auto-rotate masih berfungsi (5 detik)
  - [ ] Pause on hover masih berfungsi
  - [ ] Manual navigation masih berfungsi (dots/arrows)
  - [ ] Touch swipe masih berfungsi
  - [ ] Keyboard navigation masih berfungsi

---

### Task 2: Visual QA Testing
- [x] **Visual QA Testing**
  - **Type**: Verification
  - **Estimate**: 10 minutes
  - **Subagent**: playwright (skill)
  
  **Description**:
  Capture screenshots dan verify animasi banner dalam berbagai scenarios.
  
  **Test Scenarios**:
  1. Auto-rotate animation (slide 1 → 2 → 3)
  2. Manual navigation with dots
  3. Manual navigation with arrows (next/prev)
  4. Pause on hover
  5. Touch swipe (mobile viewport)
  6. Keyboard navigation (arrow keys)
  
  **Output**:
  - Screenshots: `.sisyphus/evidence/banner-animation/`
  - Test report: PASS/FAIL per scenario
  - Console log (no errors)

---

### Task 3: Code Review
- [x] **Code Review**
  - **Type**: Verification
  - **Estimate**: 5 minutes
  
  **Description**:
  Review changes untuk memastikan tidak ada regression dan follow best practices.
  
  **Checklist**:
  - [ ] Hanya CSS yang diubah (tidak ada JS logic changes)
  - [ ] Struktur data slides tidak berubah
  - [ ] Event handlers tidak berubah
  - [ ] No hardcoded values (gunakan CSS variables)
  - [ ] Follow existing code style
  - [ ] No linting errors
  - [ ] Type check pass
  
  **Output**:
  - Review checklist
  - Sign-off atau issue list

---

### Task 4: Commit & Document
- [x] **Commit & Document**
  - **Type**: Documentation
  - **Estimate**: 5 minutes
  
  **Description**:
  Commit changes dan update notepad dengan learnings.
  
  **Git Commit**:
  ```
  fix(ui): add slide animation to home banner
  
  - Change banner transition from opacity to transform
  - Slide animation: enter from right, exit to left
  - Duration: 500ms with material easing
  - Preserve all existing features (auto-rotate, pause, etc.)
  
  Files: frontend/app/pages/index.vue
  ```
  
  **Notepad Update**:
  Append ke `.sisyphus/notepads/fix-banner-slider-anim/learnings.md`:
  - CSS transform-based animation pattern
  - Vue TransitionGroup best practices
  - Performance optimization tips

---

## Summary

- **Total Tasks**: 4
- **Implementation**: 1
- **Verification**: 2
- **Documentation**: 1
- **Estimated Total**: 35 minutes
- **Parallelizable**: Task 2 & 3 can run in parallel after Task 1
