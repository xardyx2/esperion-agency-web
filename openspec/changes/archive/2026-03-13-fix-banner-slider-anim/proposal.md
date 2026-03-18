# Fix Banner Slider Animation

## Summary
Menambahkan animasi slide horizontal (geser) pada banner di home page. Saat ini banner berpindah secara instant/fade tanpa animasi geser.

## Problem Statement
Banner slider di section pertama home page (dengan tulisan "Trusted by Growing Businesses") saat ini:
- ❌ Berpindah slide secara instant/fade tanpa animasi geser
- ✅ Auto-rotate 5 detik sudah berfungsi
- ✅ Pause on hover sudah berfungsi  
- ✅ Gambar berbeda per slide sudah ada

User menginginkan animasi geser horizontal yang smooth saat pergantian slide.

## Scope

### In Scope
- Modifikasi CSS animation pada banner slider
- Animasi slide masuk dari kanan, keluar ke kiri
- Duration 500ms dengan smooth easing
- Maintain semua fitur existing (auto-rotate, pause, touch, keyboard, navigation)

### Out of Scope
- Perubahan struktur data slides
- Modifikasi logika auto-rotate
- Penambahan library carousel eksternal
- Perubahan layout atau design banner

## Success Criteria
- [ ] Slide bergeser horizontal (bukan fade)
- [ ] Animasi smooth 500ms
- [ ] Arah animasi sesuai navigation (next: kanan→kiri, prev: kiri→kanan)
- [ ] Zero regression pada semua interaksi
- [ ] Zero visual glitch

## Technical Approach
Mengubah CSS transition dari opacity-based ke **transform-based**:
```css
.banner-enter-active, .banner-leave-active {
  transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
.banner-enter-from { transform: translateX(100%); }
.banner-enter-to { transform: translateX(0); }
.banner-leave-from { transform: translateX(0); }
.banner-leave-to { transform: translateX(-100%); }
```

## Impact
- **Files Changed**: `frontend/app/pages/index.vue` (CSS only)
- **Breaking Changes**: None
- **Migration Needed**: No
- **Risk Level**: Low (CSS changes only)
