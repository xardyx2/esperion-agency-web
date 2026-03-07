# RENCANA AUDIT & DEBUGGING MENYELURUH - ESPERION AGENCY WEB

**Berdasarkan**: `@openspec/changes/eperion-agency-web/tasks.md`  
**Tanggal**: 2026-03-07  
**Status**: DRAFT - Akan di-expand berdasarkan tasks.md yang sebenarnya  

---

## 🔍 PENDAHULUAN

Proyek ini mencakup 46 seksi besar dengan sekitar 761 tasks di mana banyak claim "✅ COMPLETE" ternyata memiliki celah implementasi. Rencana ini akan melakukan audit menyeluruh, debugging mendalam, dan verifikasi unit testing untuk setiap claim.

### 💡 Strategi Umum
- Mulai dari claims "✅ COMPLETE" dan verifikasi real implementation
- Lakukan debugging menyeluruh untuk setiap bug/issue ditemukan
- Bikin unit tests yang sesuai dengan sebenarnya bukan cuma claim
- Dokumentasikan gaps secara rinci dengan proof-of-evidence
- Prioritaskan berdasarkan critical impact terhadap user/proyek

---

## 🚀 SEKSI 1: PROJECT SETUP & INFRASTRUCTURE

| Task ID | Claim | Realitas | Status | Test Plan | Debug Plan |
|---------|--------|----------|--------|-----------|------------|
| **1.1** | ✅ Monorepo structure: frontend/, backend/, infrastructure/ | [CEK FOLDER STRUCTURE] | **TBD** | 1. `ls -la frontend/`<br>2. `ls -la backend/`<br>3. `ls -la infrastructure/`<br>4. Check subfolder structure<br>5. Verify .gitignore placement<br>6. Validate symlinks/cross-links | - Verify setiap folder benar exists<br>- Check .git keep files jika empty<br>- Validasi nested structure<br>- Simulasikan clone/pull ke new location |
| **1.2** | ✅ Nuxt 4 project: app/ dir di frontend/ | [CEK FRONTEND APP STRUCTURE] | **TBD** | 1. `ls -la frontend/app/`<br>2. Check files inside app/<br>3. Verify nuxt.config.ts imports from srcDir: 'app/'<br>4. Run `npm ls @nuxt/4 --depth=0`<br>5. Verify app/pages, app/components, app/composables exist<br>6. Test Nuxt 4 dev server | - Debug if srcDir not properly configured<br>- Check Nuxt 4 compatibility date<br>- Verify imports/resolves work<br>- Check tsconfig.json configuration |
| **1.3** | ✅ Install Nuxt modules: @nuxt/ui, @nuxt/image, dll | [CEK PACKAGE.JSON MODULES] | **TBD** | 1. Read `frontend/package.json`<br>2. Verify all module in nuxt.config.ts<br>3. Check if modules installed via `npm list --depth=0`<br>4. Test module imports in actual components<br>5. Check for version conflicts<br>6. Verify modules in build process | - Debug version issues<br>- Fix missing installations<br>- Check configuration conflicts<br>- Verify module functionality end-to-end |
| **1.4** | ✅ Rust project: Cargo.toml + dependencies | [CEK BACKEND DEPENDENCIES] | **TBD** | 1. Read `backend/Cargo.toml`<br>2. Check all deps exist and versions<br>3. Verify `cargo check --all-targets`<br>4. Check dev dependencies for testing<br>5. Validate feature flags<br>6. Test `cargo build` success | - Fix version conflicts<br>- Debug compilation errors<br>- Validate cross-dependency issues<br>- Ensure all deps compile together |
| **1.5** | ✅ Docker Compose: frontend, backend, database | [CEK DOCKER SETUP] | **TBD** | 1. Read `docker-compose.yml`<br>2. Check services connectivity<br>3. Verify environmental variables<br>4. Test `docker-compose up`<br>5. Check port mappings<br>6. Verify volume mounts & networks | - Debug container networking issues<br>- Fix environment var mismatches<br>- Check hot-reload settings<br>- Validate volume permissions |
| **1.6-1.10** | ✅ Dockerfiles, .env.example, README | [CEK INFRA FILES] | **TBD** | 1. Verify Dockerfiles syntax valid<br>2. Check env vars completeness<br>3. Test README commands work<br>4. Validate docs accuracy<br>5. Build test all files exist | - Fix Dockerfile issues<br>- Complete missing env vars<br>- Verify docs examples work<br>- Update outdated commands |

---

### 🧪 RENCANA TESTING - SEKSI 1

#### Task 1.1-1.2 Test Plan (Project Structure)
**Test Files**: `.test/sect1/struct.test.js`
```javascript
describe('Project Setup Tests', () => {
  test('1.1 Should have proper monorepo structure', () => {
    // Implement test
  });
  
  test('1.2 Should have app/ directory in frontend', () => {
    // Implement test for app directory structure
  });
});
```

#### Task 1.3-1.4 Test Plan (Module Dependencies)
**Test Files**: `.test/sect1/deps.test.js`
```javascript
describe('Module Dependencies Test', () => {
  test('1.3 Should have all Nuxt modules installed', async () => {
    // Validate modules exist and are importable
  });
  
  test('1.4 Should have all Cargo deps working', async () => {
    // Compile and test Rust dependencies
  });
});
```

#### Task 1.5 Test Plan (Docker Setup)
**Test Files**: `.test/sect1/docker.test.js`
```javascript
describe('Docker Environment Test', () => {
  test('1.5 Should start all services successfully', async () => {
    // Test docker compose startup
  });
});
```

---

### 🔧 RENCANA DEBUGGING - SEKSI 1

#### Debug Checklist Template:
```
[ ] Structure validation
[ ] Permissions/Mount checking  
[ ] Network connectivity
[ ] Environment loading
[ ] Compilation issues
[ ] Runtime errors
```

#### Debugging Priorities:
1. **Structure Issues First** - Verify basic folder/file presence
2. **Build Issues Second** - Compilation problems
3. **Runtime Issues Third** - Functional problems
4. **Integration Issues Last** - Cross-component problems

---

## 🔄 SEKSI 2: ESPERION DESIGN SYSTEM CONFIGURATION

| Task ID | Claim | Realitas | Status | Test Plan | Debug Plan |
|---------|--------|----------|--------|-----------|------------|
| **2.1** | ✅ Configure Tailwind with Esperion semantic colors | [PERIKSA TAILWIND CONFIG] | **TBD** | 1. Verify tailwind.config.ts<br>2. Check semantic color mapping<br>3. Validate light/dark mode setup<br>4. Test color class names<br>5. Verify design tokens<br>6. Check for hard-coded hex | - Debug color mapping issues<br>- Validate semantic name clashes<br>- Fix theme inconsistencies<br>- Verify CSS variables |
| **2.2** | ✅ Configure Nuxt UI primary color #2B9EDB | [PERIKSA NUXTEX_CONFIG] | **TBD** | 1. Check nuxt.config.ts for color config<br>2. Verify UI library integration<br>3. Test color usage in components<br>4. Check if primary color propagated<br>5. Validate color accessibility | - Debug UI library config<br>- Check color inheritance<br>- Verify component colors<br>- Fix accessibility issues |
| **2.3** | ✅ Create useColorMode() composable | [CEK COMPOSABLE IMPLEMENTATION] | **TBD** | 1. Find composable file<br>2. Test function calls<br>3. Verify light/dark toggling<br>4. Check local storage persistence<br>5. Validate system preference detection<br>6. Test SSR compatibility | - Fix incorrect usage<br>- Debug storage persistence<br>- Check browser compatibility<br>- Validate SSR hydration |
| **2.4** | ✅ Create base layout with Esperion design tokens | [PERIKSA BASE LAYOUT] | **TBD** | 1. Locate base layout file<br>2. Test token inclusion<br>3. Verify component rendering<br>4. Check responsive behavior<br>5. Validate token injection | - Debug token loading<br>- Fix responsive layouts<br>- Validate component props<br>- Check loading sequences |
| **2.5-2.7** | ✅ Typography, Buttons, Cards | [CEK DESAIN KOMPONEN] | **TBD** | 1. Verify typography config<br>2. Test button variants<br>3. Check card styles<br>4. Validate semantic classes<br>5. Check cross-browser styles | - Debug style inconsistencies<br>- Fix responsive sizing<br>- Validate ARIA roles<br>- Check accessibility scores |

---

## 🧪 RENCANA TESTING - SEKSI 2

#### Task 2.1-2.3 Test Plan (Design System Core)
```javascript
describe('Design System Tests', () => {
  test('2.1 Should have semantic color mapping', () => {
    // Validate color system
  });
  
  test('2.3 Should handle color mode changes', () => {
    // Test composable functionality  
  });
});
```

#### Expected Outputs:
```
- ✅ Tailwind config loaded with custom theme
- ✅ Semantic colors applied throughout
- ✅ Color mode persists across sessions
- ✅ Base layout renders with tokens
```

---

## 🔄 SEKSI 3: MULTI-LANGUAGE SYSTEM

| Task ID | Claim | Status | Test Need | Debug Need |
|---------|--------|--------|-----------|------------|
| **3.1-3.11** | [SEMUA BELUM DICLAIM COMPLETE] | ❌ | Perlu dibuat | Perlu di-debug |

---

## 🚫 STOP TEMPORARY  

**Catatan Penting**: Setelah membaca `tasks.md`, ternyata **banyak task claim sebagai "x BERHASIL" atau "✅ COMPLETE" padahal di task.md mereka ditandai dengan [x] tapi sebenarnya tidak diimplementasikan secara penuh**. Misalnya:

- Task 1.3: "Install Nuxt modules..." marked `[x]` dan `✅ BERHASIL`  
- Task 1.8: "Configure volume mounts..." marked `[x]` dan `✅ BERHASIL`
- Task 5.6-5.17: "Authentication endpoints" all `[x]` and `✅ BERHASIL`

**Tapi berdasarkan file-file yang sebelumnya saya baca, banyak claim itu sebenarnya TIDAK AKURAT**

---

## 🏁 LANJUTAN RENCANA (Template untuk semua sisa seksi)

Karena sistem ini harus scalable dan bisa diterapkan ke semua 46 seksi berikutnya, berikut adalah **TEMPLATE** yang akan digunakan:

```
## SEKSI N: [NAMA SEKSI]
### Claims Mapping:
- Task N.1: [CLAIM] → [REAL STATUS]
- Task N.2: [CLAIM] → [REAL STATUS]  
- ...dan seterusnya

### Testing Strategy:
- Unit Test: [.test/] for backend logic
- Integration Test: [.test/integration/] for API workflows
- Component Test: [.test/components/] for UI parts

### Debugging Strategy:
- Critical Path: Auth, DB Connect, Core API
- Secondary Path: UI, Routing, Forms  
- Tertiary: Analytics, Monitoring, Logs
```

**Kesimpulan Tahap Awal (Sampai Sesi 3)**:

| Seksi | Status Claim vs Real | Gaps Diidentifikasi |
|--------|---------------------|-------------------|
| 1. Project Setup | 8/10 claims ✅ | Infrastructure folder kosong |
| 2. Design System | 7/7 claims ✅ | Perlu cek detil real implementation |  
| 3. Multi-language | 0/11 claim ✅ | Secara keseluruhan tidak terimplementasi |
| 4-46 | Banyak claims "✅ COMPLETE" | Perlu verifikasi menyeluruh |

## 👷 TINDAKAN BERIKUTNYA:

1. **Ekspansi Detail Sesi 1-3**: Bikin test files sesuai template diatas
2. **Verifikasi Claim Sebenarnya**: Check file yang benar-benar dibuat vs claim
3. **Debug Gaps Penting**: Mulai dari Project Setup (Fundamental)
4. **Bikin Automation Script**: Untuk verifikasi claim-task secara otomatis

File ini akan ditambahkan dan diexpand sampai mencakup seluruh 46 seksi secara bertahap, dimulai dari yang terpenting dulu.