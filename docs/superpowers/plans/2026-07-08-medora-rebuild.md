# Medora Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the deleted Medora app from the Stitch archive as a uni-app x project for HBuilderX and iPhone 16 Pro.

**Architecture:** Create a compact uni-app x app with global design tokens in `App.uvue`, data and medical logic in `common/*.uts`, reusable components in `components/*/*.uvue`, and one `.uvue` page per Stitch screen. Pages use native `scroll-view` and a flex bottom navigation shell to avoid iOS layout drift.

**Tech Stack:** uni-app x, UTS, UVue, Node-based static verification scripts.

## Global Constraints

- Brand name: `Medora`.
- Target device: iPhone 16 Pro.
- File format: uni-app x compatible `.uvue` and `.uts`.
- CSS must use class selectors only.
- CSS display values are limited to `flex` and `none`.
- Do not use `100vh`, `env()`, `calc()`, `position: fixed`, or tag selectors.
- Page content scrolls through `scroll-view.page-scroll`.
- Bottom tabs sit outside the scroll area.

---

### Task 1: Verification Harness

**Files:**
- Create: `tests/run-tests.mjs`
- Create: `tests/check-uvue-css.cjs`
- Create: `tests/check-flex-direction.cjs`
- Create: `tests/check-scroll-layout.cjs`

**Interfaces:**
- Consumes: project files after later tasks create them.
- Produces: commands that fail before implementation and pass after implementation.

- [ ] **Step 1: Write static and data tests.**
- [ ] **Step 2: Run each test and confirm it fails because files are missing.**
- [ ] **Step 3: Implement project files in later tasks.**
- [ ] **Step 4: Run all tests and confirm they pass.**

### Task 2: Project Skeleton

**Files:**
- Create: `main.uts`
- Create: `main.js`
- Create: `App.uvue`
- Create: `manifest.json`
- Create: `pages.json`

**Interfaces:**
- Produces: HBuilderX-recognized uni-app x entry points and page registration.

- [ ] **Step 1: Create uni-app x entry files.**
- [ ] **Step 2: Add global iPhone shell and reusable classes in `App.uvue`.**
- [ ] **Step 3: Register all pages in `pages.json`.**

### Task 3: Data and Medical Logic

**Files:**
- Create: `common/medora-data.uts`
- Create: `common/medical.uts`

**Interfaces:**
- Produces: `tabs`, `records`, `knowledgeCards`, `settingsSections`, `accountItems`, `notifications`, `calculators`, `heartFailure`, `calculateBmi`, and `getBmiStatus`.

- [ ] **Step 1: Encode Stitch copy and app data as UTS exports.**
- [ ] **Step 2: Implement BMI calculation and status mapping.**
- [ ] **Step 3: Run data tests.**

### Task 4: Reusable Components

**Files:**
- Create: `components/AppHeader/AppHeader.uvue`
- Create: `components/BottomTabs/BottomTabs.uvue`
- Create: `components/SettingRow/SettingRow.uvue`
- Create: `components/ToggleSwitch/ToggleSwitch.uvue`
- Create: `components/SectionBlock/SectionBlock.uvue`

**Interfaces:**
- Consumes: global classes from `App.uvue`.
- Produces: shared header, bottom navigation, settings row, switch, and section block components.

- [ ] **Step 1: Build components with class-only CSS.**
- [ ] **Step 2: Keep navigation paths aligned with `pages.json`.**
- [ ] **Step 3: Run CSS and flex checks.**

### Task 5: Pages

**Files:**
- Create: `pages/home/index.uvue`
- Create: `pages/library/index.uvue`
- Create: `pages/knowledge-detail/index.uvue`
- Create: `pages/record/index.uvue`
- Create: `pages/calculator/index.uvue`
- Create: `pages/profile/index.uvue`
- Create: `pages/settings/index.uvue`
- Create: `pages/account-security/index.uvue`
- Create: `pages/notifications/index.uvue`
- Create: `pages/profile-edit/index.uvue`

**Interfaces:**
- Consumes: components and common data exports.
- Produces: screen-level UI matching the Stitch archive.

- [ ] **Step 1: Build pages using the shared shell and `scroll-view.page-scroll`.**
- [ ] **Step 2: Place `BottomTabs` outside scroll areas on tabbed pages.**
- [ ] **Step 3: Run scroll layout checks.**

### Task 6: Final Verification

**Files:**
- Modify only if tests expose incompatibilities.

- [ ] **Step 1: Run `node tests\check-uvue-css.cjs`.**
- [ ] **Step 2: Run `node tests\check-flex-direction.cjs`.**
- [ ] **Step 3: Run `node tests\check-scroll-layout.cjs`.**
- [ ] **Step 4: Run `node tests\run-tests.mjs`.**
- [ ] **Step 5: Report HBuilderX/iPhone limitations and next manual run step.**
