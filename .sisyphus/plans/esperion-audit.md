# Esperion Agency Web - Comprehensive Implementation Audit Plan

## TL;DR

> **Quick Summary**: Systematic audit to verify all "COMPLETE" claims in tasks.md against actual codebase implementation, identify critical discrepancies, and create comprehensive test/debug plans.
> 
> **Deliverables**: 
> - Discrepancy report with 21 verification tasks across 4 waves
> - Evidence-backed findings for each "COMPLETE" claim
> - Master test strategy (Pinia, i18n, E2E, Backend Integration)
> - Master bug fix strategy (logout, refresh token, delete article)
> - Final comprehensive audit report with prioritized recommendations
> 
> **Estimated Effort**: Large (21 tasks, 4 execution waves)
> **Parallel Execution**: YES - 4 waves with 5-8 tasks each
> **Critical Path**: Task 1 → Task 6 → Task 10 → Task 19 → Task 21

---

## Context

### Original Request
User requested comprehensive audit to verify whether Esperion Agency Web project is on track by cross-checking task list claims against actual implementation, identifying bugs, and creating test plans.

### Interview Summary
**Key Discussions**:
- **Baseline**: User confirmed to use existing task list (tasks.md) as audit baseline
- **Testing Strategy**: User wants test plans ONLY (no implementation) - planning phase
- **Granularity**: Single comprehensive plan covering all audit, crosscheck, testing, and debugging

**Research Findings**:
- **Backend**: 25 .rs files exist, but critical bugs found (logout stub, refresh mock, delete bug)
- **Frontend**: 34 .vue files, but 0 Pinia stores despite claims, i18n not installed
- **Testing**: Only 3 test files (~3% coverage), no Playwright/E2E despite "COMPLETE" claim
- **Infrastructure**: infrastructure/ directory completely empty

### Metis Review
**Identified Gaps** (addressed):
- **Scope clarity**: Locked to audit/verification only, no implementation
- **QA criteria**: All acceptance criteria are executable commands (zero human intervention)
- **Guardrails**: Explicit "MUST NOT" list to prevent scope creep into implementation
- **Edge cases**: Broken test identified (useAccessibility.test.ts imports non-existent file)

---

## Work Objectives

### Core Objective
Verify every "COMPLETE" claim in tasks.md against actual codebase implementation and produce actionable audit report with test plans and bug fix strategies.

### Concrete Deliverables
- `.sisyphus/audit-reports/discrepancy-report.md` - Wave 1-2 findings
- `.sisyphus/audit-reports/test-strategy.md` - Wave 3 test plans
- `.sisyphus/audit-reports/bug-fix-strategy.md` - Wave 3 debug plans
- `.sisyphus/audit-reports/final-audit-report.md` - Wave 4 synthesis

### Definition of Done
- [ ] All 21 tasks completed with passing QA criteria
- [ ] Discrepancy report includes file paths + line numbers for each finding
- [ ] Test plans include executable test cases (Vitest, Playwright, cargo test)
- [ ] Bug fix plans include specific implementation steps
- [ ] Final report includes prioritized action items with severity classification

### Must Have
- Evidence-backed findings (screenshots, file contents, command outputs)
- Executable acceptance criteria (curl, bun test, playwright, cargo test)
- Severity classification (Critical, High, Medium, Low) per discrepancy
- Zero human intervention required for verification

### Must NOT Have (Guardrails)
- **NO implementation code** - This is audit-only, no fixes
- **NO vague claims** - Every finding must have file:line evidence
- **NO manual testing criteria** - All QA must be agent-executable
- **NO scope creep** - Stick to verification, don't add new features

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (vitest, cargo test)
- **Automated tests**: Tests-after (audit first, then test plans)
- **Framework**: Vitest (frontend), cargo test (backend), Playwright (planned)
- **If TDD**: N/A - This is audit phase, not implementation

### QA Policy
Every task MUST include agent-executed QA scenarios:
- **File existence**: `ls`, `find`, `grep` commands with count assertions
- **Code verification**: `grep -r` patterns, line count checks
- **Test execution**: `bun test`, `cargo test` with pass/fail assertions
- **API verification**: `curl` commands with status/response assertions
- **Evidence**: Saved to `.sisyphus/evidence/task-{N}-{scenario}.{ext}`

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — Foundation verification, 5 tasks):
├── Task 1: Parse task list [quick]
├── Task 2: Verify infrastructure [quick]
├── Task 3: Verify frontend modules [quick]
├── Task 4: Verify backend endpoints [deep]
└── Task 5: Verify testing infrastructure [deep]

Wave 2 (After Wave 1 — Cross-reference claims, 6 tasks):
├── Task 6: Infrastructure gaps [deep]
├── Task 7: Frontend gaps (stores, i18n) [deep]
├── Task 8: Backend gaps (stubs, middleware) [deep]
├── Task 9: Testing gaps [deep]
├── Task 15: Identify backend bugs [ultrabrain]
└── Task 22: Verify PWA implementation [quick]

Wave 3 (After Wave 2 — Create plans, 8 tasks):
├── Task 10: Compile discrepancy report [ultrabrain]
├── Task 11: Pinia store test plan [deep]
├── Task 12: i18n test plan [deep]
├── Task 13: E2E/Playwright test plan [deep]
├── Task 14: Backend integration test plan [deep]
├── Task 16: Logout debug plan [deep]
├── Task 17: Refresh token debug plan [deep]
└── Task 18: Delete article debug plan [deep]

Wave 4 (After Wave 3 — Synthesis, 3 tasks):
├── Task 19: Master test strategy [ultrabrain]
├── Task 20: Master bug fix strategy [ultrabrain]
└── Task 21: Final audit report [writing]

Critical Path: Task 1 → Task 6 → Task 10 → Task 19 → Task 21
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 8 (Wave 3)
```

### Dependency Matrix

| Task | Depends On | Blocks |
|------|------------|--------|
| 1-5 | — | 6-10, 15, 22 |
| 6 | 1, 2 | 10 |
| 7 | 1, 3 | 10, 11, 12 |
| 8 | 1, 4 | 10, 14, 15 |
| 9 | 1, 5 | 10, 13 |
| 10 | 6-9 | 11-14, 19-21 |
| 11-14 | 10 | 19 |
| 15 | 8 | 16-18 |
| 16-18 | 15 | 20 |
| 19 | 11-14 | 21 |
| 20 | 16-18 | 21 |
| 21 | 10, 19, 20 | — |
| 22 | — | 10 |

### Agent Dispatch Summary

- **Wave 1**: 5 tasks — T1-T3 → `quick`, T4-T5 → `deep`
- **Wave 2**: 6 tasks — T6-T9, T22 → `deep`, T15 → `ultrabrain`
- **Wave 3**: 8 tasks — T10 → `ultrabrain`, T11-T14 → `deep` (+ skills), T16-T18 → `deep`
- **Wave 4**: 3 tasks — T19-T20 → `ultrabrain`, T21 → `writing`

---

## TODOs

- [ ] 1. **Parse Task List and Identify Complete Claims**

  **What to do**:
  - Read openspec/changes/esperion-agency-web/tasks.md
  - Extract all tasks marked with [x] or ✅
  - Count total "COMPLETE" claims per section
  - Create structured inventory: section → task → claim status

  **Must NOT do**:
  - Verify actual implementation (that's Tasks 2-5)
  - Modify task list file

  **Recommended Agent Profile**:
  - **Category**: `quick` - Simple text parsing
  - **Skills**: [`openspec-explore`]
    - `openspec-explore`: Understand OpenSpec task list format and structure
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not needed for text parsing
    - `playwright`: No browser interaction needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2-5)
  - **Blocks**: Tasks 6-10, 15, 22
  - **Blocked By**: None

  **References**:
  - `openspec/changes/esperion-agency-web/tasks.md` - Source task list to parse

  **Acceptance Criteria**:
  - [ ] Inventory file created: `.sisyphus/audit-reports/task-inventory.md`
  - [ ] Total count documented (expected: ~400+ "COMPLETE" claims)
  - [ ] Per-section breakdown included

  **QA Scenarios**:
  ```
  Scenario: Count complete claims
    Tool: Bash
    Preconditions: tasks.md exists
    Steps:
      1. Run: grep -c "\[x\]" openspec/changes/esperion-agency-web/tasks.md
      2. Run: grep -c "✅" openspec/changes/esperion-agency-web/tasks.md
      3. Sum both counts
    Expected Result: Count > 300 (majority of 760 tasks claimed complete)
    Evidence: .sisyphus/evidence/task-1-count.txt
  ```

  **Commit**: YES (groups with 2-5)
  - Message: `docs(audit): create task inventory`
  - Files: `.sisyphus/audit-reports/task-inventory.md`

---

---

- [ ] 6. **Cross-Reference Infrastructure Claims vs Reality**

  **What to do**:
  - Compare Section 1 claims against Task 2 findings
  - Document specific gaps: empty infrastructure/, missing deployment configs
  - Classify severity (Critical/High/Medium/Low)
  - Include file paths and evidence for each gap

  **Must NOT do**:
  - Create missing infrastructure files
  - Suggest solutions (just document gaps)

  **Recommended Agent Profile**:
  - **Category**: `deep` - Systematic gap analysis
  - **Skills**: [`openspec-explore`]
    - `openspec-explore`: Understand infrastructure requirements
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not modifying repository structure

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (depends on Tasks 1-2)
  - **Blocks**: Task 10
  - **Blocked By**: Task 1, Task 2

  **References**:
  - Task 1 output: `.sisyphus/audit-reports/task-inventory.md`
  - Task 2 output: Infrastructure verification findings
  - Section 1 claims from tasks.md

  **Acceptance Criteria**:
  - [ ] Gap report lists all missing infrastructure files
  - [ ] Each gap includes severity classification
  - [ ] Evidence references specific file paths

  **QA Scenarios**:
  ```
  Scenario: Verify infrastructure gap report
    Tool: Bash
    Preconditions: Task 6 output exists
    Steps:
      1. Run: grep -c "CRITICAL\|HIGH\|MEDIUM" .sisyphus/audit-reports/task-6-infrastructure-gaps.md
      2. Run: grep -c "file:" .sisyphus/audit-reports/task-6-infrastructure-gaps.md
    Expected Result: >0 severity classifications, >0 file references
    Evidence: .sisyphus/evidence/task-6-gap-count.txt
  ```

  **Commit**: YES (groups with 7-9, 15, 22)
  - Message: `docs(audit): infrastructure gap analysis`

---

- [ ] 7. **Cross-Reference Frontend Claims vs Reality**

  **What to do**:
  - Compare Sections 2-3, 18-28, 31-35, 37-42 against Task 3 findings
  - Focus on CRITICAL gaps: Pinia stores (0 files), i18n (not installed)
  - Document missing components, composables, design tokens
  - Classify severity per gap

  **Must NOT do**:
  - Create missing stores or install i18n
  - Write implementation code

  **Recommended Agent Profile**:
  - **Category**: `deep` - Frontend architecture verification
  - **Skills**: [`frontend-ui-ux`, `openspec-explore`]
    - `frontend-ui-ux`: Evaluate design system and component structure
    - `openspec-explore`: Verify architectural patterns
  - **Skills Evaluated but Omitted**:
    - `playwright`: Not executing UI tests yet

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (depends on Tasks 1, 3)
  - **Blocks**: Task 10, Task 11, Task 12
  - **Blocked By**: Task 1, Task 3

  **References**:
  - Task 1 output: task inventory
  - Task 3 output: frontend verification findings
  - `frontend/app/stores/` - Expected empty
  - `frontend/nuxt.config.ts` - Missing i18n module

  **Acceptance Criteria**:
  - [ ] Pinia stores gap documented as CRITICAL
  - [ ] i18n gap documented as CRITICAL
  - [ ] Component gaps documented with expected vs actual counts

  **QA Scenarios**:
  ```
  Scenario: Verify stores gap
    Tool: Bash
    Preconditions: Task 7 output exists
    Steps:
      1. Run: grep -i "stores.*empty\|Pinia.*missing" .sisyphus/audit-reports/task-7-frontend-gaps.md
    Expected Result: Match found (stores documented as missing)
    Evidence: .sisyphus/evidence/task-7-stores-gap.txt

  Scenario: Verify i18n gap
    Tool: Bash
    Preconditions: Task 7 output exists
    Steps:
      1. Run: grep -i "i18n.*not.*installed\|@nuxtjs/i18n.*missing" .sisyphus/audit-reports/task-7-frontend-gaps.md
    Expected Result: Match found (i18n documented as missing)
    Evidence: .sisyphus/evidence/task-7-i18n-gap.txt
  ```

  **Commit**: YES (groups with 6, 8-9, 15, 22)
  - Message: `docs(audit): frontend gap analysis`

---

- [ ] 8. **Cross-Reference Backend Claims vs Reality**

  **What to do**:
  - Compare Sections 5-12, 15-17 against Task 4 findings
  - Identify stub implementations (logout, refresh token)
  - Document missing middleware (auth not applied to routes)
  - Find bugs (delete article response handling)

  **Must NOT do**:
  - Fix stub implementations
  - Add missing middleware

  **Recommended Agent Profile**:
  - **Category**: `deep` - Backend code analysis
  - **Skills**: [`openspec-explore`]
    - `openspec-explore`: Understand backend implementation patterns
  - **Skills Evaluated but Omitted**:
    - No additional skills needed (backend-focused)

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (depends on Tasks 1, 4)
  - **Blocks**: Task 10, Task 14, Task 15
  - **Blocked By**: Task 1, Task 4

  **References**:
  - Task 4 output: backend verification findings
  - `backend/src/handlers/auth.rs` - Check logout, refresh
  - `backend/src/middleware/mod.rs` - JWT middleware (not applied)
  - `backend/src/handlers/articles.rs` - Delete endpoint bug

  **Acceptance Criteria**:
  - [ ] Logout stub documented with file:line reference
  - [ ] Refresh token mock documented
  - [ ] Delete article bug documented
  - [ ] Missing middleware documented

  **QA Scenarios**:
  ```
  Scenario: Verify logout stub
    Tool: Bash
    Preconditions: Task 8 output exists
    Steps:
      1. Run: grep -A3 "logout" .sisyphus/audit-reports/task-8-backend-gaps.md | grep -i "stub\|TODO\|incomplete"
    Expected Result: Match found documenting logout as stub
    Evidence: .sisyphus/evidence/task-8-logout-stub.txt

  Scenario: Verify delete bug
    Tool: Bash
    Preconditions: Task 8 output exists
    Steps:
      1. Run: grep -i "delete.*article.*bug\|wrong.*response" .sisyphus/audit-reports/task-8-backend-gaps.md
    Expected Result: Match found documenting delete article bug
    Evidence: .sisyphus/evidence/task-8-delete-bug.txt
  ```

  **Commit**: YES (groups with 6-7, 9, 15, 22)
  - Message: `docs(audit): backend gap analysis`

---

- [ ] 9. **Cross-Reference Testing Claims vs Reality**

  **What to do**:
  - Compare Section 43 claims against Task 5 findings
  - Document missing: Playwright, k6, visual regression, E2E tests
  - Calculate actual test coverage percentage
  - Identify broken tests (useAccessibility.test.ts)

  **Must NOT do**:
  - Write missing tests
  - Install testing frameworks

  **Recommended Agent Profile**:
  - **Category**: `deep` - Testing strategy assessment
  - **Skills**: [`openspec-explore`]
    - `openspec-explore`: Understand comprehensive testing requirements
  - **Skills Evaluated but Omitted**:
    - No additional skills (testing assessment only)

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (depends on Tasks 1, 5)
  - **Blocks**: Task 10, Task 13
  - **Blocked By**: Task 1, Task 5

  **References**:
  - Task 5 output: testing verification findings
  - `frontend/tests/` - Test files (2 exist, 1 broken)
  - `backend/tests/` - Test files (1 exists)
  - Section 43 claims from tasks.md

  **Acceptance Criteria**:
  - [ ] Missing frameworks documented (Playwright, k6, visual regression)
  - [ ] Coverage estimate documented (~3%)
  - [ ] Broken test documented (useAccessibility.test.ts)

  **QA Scenarios**:
  ```
  Scenario: Verify Playwright missing
    Tool: Bash
    Preconditions: Task 9 output exists
    Steps:
      1. Run: grep -i "Playwright.*not.*found\|E2E.*missing" .sisyphus/audit-reports/task-9-testing-gaps.md
    Expected Result: Match found
    Evidence: .sisyphus/evidence/task-9-playwright-missing.txt

  Scenario: Verify broken test
    Tool: Bash
    Preconditions: Task 9 output exists
    Steps:
      1. Run: grep -i "useAccessibility.*broken\|import.*missing" .sisyphus/audit-reports/task-9-testing-gaps.md
    Expected Result: Match found documenting broken test
    Evidence: .sisyphus/evidence/task-9-broken-test.txt
  ```

  **Commit**: YES (groups with 6-8, 15, 22)
  - Message: `docs(audit): testing gap analysis`

---

- [ ] 10. **Compile Comprehensive Discrepancy Report**

  **What to do**:
  - Synthesize findings from Tasks 6-9 into master discrepancy report
  - Categorize by severity: Critical (stores, i18n, testing), High (backend bugs), Medium (infrastructure), Low (minor gaps)
  - Include specific evidence: file paths, line numbers, command outputs
  - Create executive summary with top 5 critical issues

  **Must NOT do**:
  - Propose solutions (just document findings)
  - Prioritize beyond severity classification

  **Recommended Agent Profile**:
  - **Category**: `ultrabrain` - Strategic synthesis
  - **Skills**: [`openspec-explore`]
    - `openspec-explore`: Holistic project understanding
  - **Skills Evaluated but Omitted**:
    - No additional skills (analysis and synthesis focus)

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (depends on Tasks 6-9)
  - **Blocks**: Tasks 11-14, 19-21
  - **Blocked By**: Task 6, Task 7, Task 8, Task 9

  **References**:
  - Task 6 output: infrastructure gaps
  - Task 7 output: frontend gaps
  - Task 8 output: backend gaps
  - Task 9 output: testing gaps

  **Acceptance Criteria**:
  - [ ] Report includes >20 specific discrepancies with evidence
  - [ ] Each discrepancy has severity classification
  - [ ] Executive summary lists top 5 critical issues
  - [ ] File references include line numbers where applicable

  **QA Scenarios**:
  ```
  Scenario: Verify discrepancy count
    Tool: Bash
    Preconditions: Task 10 output exists
    Steps:
      1. Run: grep -c "### Discrepancy\|## Critical\|## High" .sisyphus/audit-reports/discrepancy-report.md
    Expected Result: >20 discrepancies documented
    Evidence: .sisyphus/evidence/task-10-discrepancy-count.txt

  Scenario: Verify executive summary
    Tool: Bash
    Preconditions: Task 10 output exists
    Steps:
      1. Run: grep -A10 "Executive Summary" .sisyphus/audit-reports/discrepancy-report.md | grep -c "Critical"
    Expected Result: >0 critical issues in summary
    Evidence: .sisyphus/evidence/task-10-exec-summary.txt
  ```

  **Commit**: YES (standalone)
  - Message: `docs(audit): comprehensive discrepancy report`

---

  **What to do**:
  - Check Section 1.1 (monorepo structure), 1.5-1.12 (Docker files)
  - Verify infrastructure/ directory has files
  - Verify docker-compose.yml, Dockerfiles exist and are complete
  - Document gaps between claims and reality

  **Must NOT do**:
  - Fix missing files
  - Create infrastructure configs

  **Recommended Agent Profile**:
  - **Category**: `quick` - File system verification
  - **Skills**: [`git-master`]
    - `git-master`: Understand expected repository structure patterns
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not relevant for infrastructure

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3-5)
  - **Blocks**: Task 6, Task 10
  - **Blocked By**: None

  **References**:
  - `docker-compose.yml` - Verify exists and matches claims
  - `frontend/Dockerfile` - Verify multi-stage build
  - `backend/Dockerfile` - Verify cargo-watch setup
  - `infrastructure/` - Check if directory has files

  **Acceptance Criteria**:
  - [ ] infrastructure/ directory status documented
  - [ ] Docker files completeness verified
  - [ ] Gap report created with specific missing files

  **QA Scenarios**:
  ```
  Scenario: Check infrastructure directory
    Tool: Bash
    Preconditions: Project root accessible
    Steps:
      1. Run: ls -la infrastructure/ 2>&1
      2. Count files (exclude . and ..)
    Expected Result: If empty → "CRITICAL GAP: infrastructure/ empty"
    Evidence: .sisyphus/evidence/task-2-infra-check.txt

  Scenario: Verify Docker files
    Tool: Bash
    Preconditions: Dockerfiles exist
    Steps:
      1. Run: wc -l frontend/Dockerfile backend/Dockerfile docker-compose.yml
      2. Run: grep -c "FROM" frontend/Dockerfile
    Expected Result: frontend/Dockerfile >20 lines, backend >15 lines
    Evidence: .sisyphus/evidence/task-2-docker-lines.txt
  ```

  **Commit**: YES (groups with 1, 3-5)
  - Message: `docs(audit): verify infrastructure claims`

---

- [ ] 3. **Verify Frontend Framework and Module Claims**

  **What to do**:
  - Verify Section 1.2-1.3 (Nuxt 4, modules), 18.1-18.10 (frontend core)
  - Check nuxt.config.ts has all claimed modules
  - Verify app/ directory structure exists
  - Check Pinia is configured AND stores exist

  **Must NOT do**:
  - Install missing modules
  - Create stores

  **Recommended Agent Profile**:
  - **Category**: `quick` - Configuration verification
  - **Skills**: [`openspec-explore`]
    - `openspec-explore`: Understand Nuxt 4 project conventions
  - **Skills Evaluated but Omitted**:
    - `playwright`: No browser testing needed yet

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-2, 4-5)
  - **Blocks**: Task 7, Task 10
  - **Blocked By**: None

  **References**:
  - `frontend/nuxt.config.ts` - Module configuration
  - `frontend/package.json` - Installed dependencies
  - `frontend/app/` - Directory structure
  - `frontend/app/stores/` - Pinia stores (expected empty based on preliminary scan)

  **Acceptance Criteria**:
  - [ ] Module installation status documented
  - [ ] app/ directory structure verified
  - [ ] Pinia stores status documented (EXPECTED: empty)

  **QA Scenarios**:
  ```
  Scenario: Check nuxt.config.ts modules
    Tool: Bash
    Preconditions: nuxt.config.ts exists
    Steps:
      1. Run: grep "@nuxtjs/i18n" frontend/nuxt.config.ts
      2. Run: grep "@pinia/nuxt" frontend/nuxt.config.ts
    Expected Result: @nuxtjs/i18n → NOT FOUND (gap), @pinia/nuxt → FOUND
    Evidence: .sisyphus/evidence/task-3-modules.txt

  Scenario: Check Pinia stores
    Tool: Bash
    Preconditions: stores directory exists
    Steps:
      1. Run: ls -la frontend/app/stores/ 2>&1
      2. Count .ts files
    Expected Result: 0 files (CRITICAL GAP: stores claimed complete but empty)
    Evidence: .sisyphus/evidence/task-3-stores-empty.txt
  ```

  **Commit**: YES (groups with 1-2, 4-5)
  - Message: `docs(audit): verify frontend claims`

---

- [ ] 4. **Verify Backend API Endpoint Claims**

  **What to do**:
  - Verify Sections 5-12 (Auth, Articles, Media, Works, Services, Clients, Contact)
  - Check backend/src/handlers/ has all claimed handler files
  - Verify each handler has actual implementation (not stubs)
  - Check routes are registered in main.rs

  **Must NOT do**:
  - Fix stub implementations
  - Add missing middleware

  **Recommended Agent Profile**:
  - **Category**: `deep` - Requires Rust/Axum understanding
  - **Skills**: [`openspec-explore`]
    - `openspec-explore`: Understand backend architecture patterns
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Backend-focused task

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-3, 5)
  - **Blocks**: Task 8, Task 10, Task 15
  - **Blocked By**: None

  **References**:
  - `backend/src/main.rs` - Route registration
  - `backend/src/handlers/` - Handler implementations
  - `backend/Cargo.toml` - Dependencies

  **Acceptance Criteria**:
  - [ ] Handler file existence documented per module
  - [ ] Stub implementations identified (logout, refresh token)
  - [ ] Route registration verified

  **QA Scenarios**:
  ```
  Scenario: Count handler functions
    Tool: Bash
    Preconditions: backend/src/handlers/ exists
    Steps:
      1. Run: grep -r "pub async fn" backend/src/handlers/ | wc -l
    Expected Result: Count >30 (all CRUD operations)
    Evidence: .sisyphus/evidence/task-4-handler-count.txt

  Scenario: Check for TODO stubs
    Tool: Bash
    Preconditions: Handler files exist
    Steps:
      1. Run: grep -r "TODO" backend/src/handlers/ | grep -v ".md"
    Expected Result: >0 TODOs found (expected: logout, refresh token)
    Evidence: .sisyphus/evidence/task-4-todo-stubs.txt
  ```

  **Commit**: YES (groups with 1-3, 5)
  - Message: `docs(audit): verify backend endpoints`

---

- [ ] 5. **Verify Testing Infrastructure Claims**

  **What to do**:
  - Verify Section 43 (Testing & QA) claims
  - Check for Vitest, Playwright, k6, visual regression configs
  - Count actual test files
  - Estimate test coverage

  **Must NOT do**:
  - Write new tests
  - Install testing frameworks

  **Recommended Agent Profile**:
  - **Category**: `deep` - Testing strategy assessment
  - **Skills**: [`openspec-explore`]
    - `openspec-explore`: Understand testing best practices and frameworks
  - **Skills Evaluated but Omitted**:
    - `playwright`: Assessment only, not E2E execution yet

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-4)
  - **Blocks**: Task 9, Task 10
  - **Blocked By**: None

  **References**:
  - `frontend/vitest.config.ts` - Vitest configuration
  - `frontend/tests/` - Frontend test files
  - `backend/tests/` - Backend test files
  - `package.json` - Test scripts

  **Acceptance Criteria**:
  - [ ] Test framework status documented (Vitest: YES, Playwright: NO, k6: NO)
  - [ ] Test file count documented
  - [ ] Coverage estimate documented (expected: ~3%)

  **QA Scenarios**:
  ```
  Scenario: Check Playwright config
    Tool: Bash
    Preconditions: Project root accessible
    Steps:
      1. Run: find . -name "playwright.config*" -o -name "*playwright*" 2>/dev/null | wc -l
    Expected Result: 0 files (CRITICAL GAP: Playwright claimed complete but missing)
    Evidence: .sisyphus/evidence/task-5-playwright-missing.txt

  Scenario: Count test files
    Tool: Bash
    Preconditions: tests directories exist
    Steps:
      1. Run: find frontend/tests backend/tests -name "*.test.*" -o -name "*.spec.*" 2>/dev/null | wc -l
    Expected Result: <10 files (expected: ~3 files)
    Evidence: .sisyphus/evidence/task-5-test-count.txt
  ```

  **Commit**: YES (groups with 1-4)
  - Message: `docs(audit): verify testing claims`

---

## Final Verification Wave

- [ ] F1. **Plan Compliance Audit** — `oracle`
- [ ] F2. **Code Quality Review** — `unspecified-high`
- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` if UI)
- [ ] F4. **Scope Fidelity Check** — `deep`

---

## Commit Strategy

- **Audit findings**: `docs(audit): add discrepancy report` — audit-reports/, npm test
- **Test plans**: `test(plan): add master test strategy` — audit-reports/
- **Bug fix plans**: `fix(plan): add debug strategies` — audit-reports/
- **Final report**: `docs(audit): final comprehensive report` — audit-reports/

---

## Success Criteria

### Verification Commands
```bash
# Verify all audit reports exist
ls -la .sisyphus/audit-reports/ | wc -l  # Expected: >4 files

# Verify discrepancy report has evidence
grep -c "file:" .sisyphus/audit-reports/discrepancy-report.md  # Expected: >20

# Verify test plans are comprehensive
grep -c "test case:" .sisyphus/audit-reports/test-strategy.md  # Expected: >50

# Verify bug fixes have implementation steps
grep -c "Step:" .sisyphus/audit-reports/bug-fix-strategy.md  # Expected: >15
```

### Final Checklist
- [ ] All 21 tasks completed with passing QA
- [ ] Discrepancy report has file:line evidence for each finding
- [ ] Test plans include executable test cases
- [ ] Bug fix plans include specific implementation steps
- [ ] Final report has prioritized action items
- [ ] All evidence saved to .sisyphus/evidence/
- [ ] Zero human intervention required for verification
