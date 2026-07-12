# Inline Record Card Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing Home `开始记录` card expand continuously into the unchanged `新建记录` composer.

**Architecture:** Keep the current template and `inlineComposerOpen` input state exactly as they are. Add a focused Node source-contract check, then coordinate only the existing Home CSS class transitions for the root card, compact summary, inline content, and calculator; no additional runtime state or animation loop is needed.

**Tech Stack:** uni-app x, Uvue/UTS, iPhone native compositor, Uvue CSS, Node.js source-contract checks.

## Global Constraints

- Modify only the opening transition in `pages/home/index.uvue`; do not change its template structure, final composer UI, copy, color, radius, spacing, textarea behavior, focus behavior, archive action, or close behavior.
- Keep `新建记录`, its close button, placeholder, character counter, and `智能归档` control exactly where and how they currently work.
- Use only class selectors and Uvue-supported CSS values.
- Do not use JavaScript animation loops, `requestAnimationFrame`, web-only filters, or third-party libraries.
- Use compositor-friendly `transform` and `opacity` for content motion. Card width/height changes are limited to the existing root card transition.
- Target iPhone 16 Pro ProMotion rendering without forcing frame rate; native runtime chooses up to 120Hz or falls back to its system rate.
- Preserve the existing shared-card and swipe-delete code paths.
- The root card, summary, inline content, and calculator must follow one 380ms opening timeline: root begins first, summary fades after 30ms, content opacity begins at 90ms, calculator begins collapse at 40ms.

---

### Task 1: Add a regression contract for the existing composer UI and motion timeline

**Files:**
- Create: `tests/check-inline-record-card-motion.cjs`
- Test: `tests/check-inline-record-card-motion.cjs`

**Interfaces:**
- Consumes: `pages/home/index.uvue` source.
- Produces: a Node check ensuring the existing composer markup and actions remain intact while required motion classes and timing rules exist.

- [ ] **Step 1: Write the failing source-contract test**

  Create `tests/check-inline-record-card-motion.cjs` with this code:

  ```js
  const fs = require("fs");

  const home = fs.readFileSync("pages/home/index.uvue", "utf8");
  const errors = [];
  const requiredMarkup = [
    "新建记录",
    "记录此刻想记住的医学知识...",
    "inline-record-close",
    "inline-record-count",
    "inlineArchiveClass()",
    "onInlineSmartArchive",
    "closeInlineComposer"
  ];
  const requiredMotion = [
    "transition-property: width, height, border-radius, opacity, padding-left, padding-right",
    "transition-duration: 380ms",
    "transition-delay: 30ms",
    "transition-delay: 90ms",
    "transition-delay: 40ms",
    "overflow: hidden"
  ];

  for (const item of requiredMarkup) {
    if (!home.includes(item)) errors.push(`composer UI contract missing: ${item}`);
  }
  for (const item of requiredMotion) {
    if (!home.includes(item)) errors.push(`composer motion contract missing: ${item}`);
  }

  if (!/\.inline-record-content-active\s*\{[^}]*height:\s*152px;[^}]*opacity:\s*1;[^}]*transform:\s*translateY\(0\)/.test(home)) {
    errors.push("composer final layout must remain the current visible state");
  }
  if (!/\.quick-calc-collapsing\s*\{[^}]*transition-delay:\s*40ms/.test(home)) {
    errors.push("calculator collapse must begin after record card expansion starts");
  }
  if (!/\.quick-record-summary-hidden\s*\{[^}]*transition-delay:\s*30ms/.test(home)) {
    errors.push("compact card summary must fade after root expansion begins");
  }

  if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
  console.log("inline record card motion checks ok");
  ```

- [ ] **Step 2: Run the new test to verify it fails**

  Run:

  ```powershell
  node tests/check-inline-record-card-motion.cjs
  ```

  Expected: exit code `1`, reporting missing `380ms` and staged-delay motion requirements while the existing UI contract remains present.

- [ ] **Step 3: Keep the test isolated from unrelated Home features**

  Do not assert swipe-delete, shared-card, storage, or AI behavior in this file. Its only responsibility is preserving the inline composer UI while guarding the transition choreography.

- [ ] **Step 4: Commit the test only when the worktree is clean**

  ```powershell
  git add tests/check-inline-record-card-motion.cjs
  git commit -m "test: cover inline record card expansion motion"
  ```

### Task 2: Coordinate the existing card, summary, composer, and calculator transitions

**Files:**
- Modify: `pages/home/index.uvue:517-526`
- Test: `tests/check-inline-record-card-motion.cjs`, `tests/check-uvue-css.cjs`

**Interfaces:**
- Consumes: the existing `inlineComposerOpen`, `recordComposerClass()`, `recordSummaryClass()`, `inlineContentClass()`, and `calculatorClass()` behavior.
- Produces: a continuous visual expansion without changing template structure or final composer layout.

- [ ] **Step 1: Preserve all non-motion source before editing**

  Confirm that the following template lines remain byte-for-byte functionally equivalent:

  ```html
  <view :class="recordComposerClass()" ...>
  <view :class="recordSummaryClass()">...</view>
  <view :class="inlineContentClass()" @tap.stop="">...</view>
  ```

  Do not change the textarea, title, close control, count, archive control, or their event bindings.

- [ ] **Step 2: Update only the existing CSS timing rules**

  Replace the existing composer-related rules with the following declarations, preserving all unrelated declarations in those classes:

  ```css
  .quick-btn { width: 172px; height: 128px; box-sizing: border-box; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; overflow: hidden; transition-property: width, height, border-radius, opacity, padding-left, padding-right; transition-duration: 380ms; transition-timing-function: cubic-bezier(0.22, 1.08, 0.36, 1); }
  .quick-calc-collapsing { width: 0; padding-left: 0; padding-right: 0; border-width: 0; opacity: 0; transition-delay: 40ms; }
  .quick-record-summary { height: 76px; overflow: hidden; display: flex; flex-direction: column; opacity: 1; transform: translateY(0); transition-property: height, opacity, transform; transition-duration: 240ms; transition-timing-function: cubic-bezier(0.22, 1.08, 0.36, 1); }
  .quick-record-summary-hidden { height: 0; opacity: 0; transform: translateY(-8px); transition-delay: 30ms; }
  .inline-record-content { width: 100%; height: 0; overflow: hidden; display: flex; flex-direction: column; opacity: 0; transform: translateY(10px); transition-property: height, opacity, transform; transition-duration: 320ms; transition-delay: 90ms; transition-timing-function: cubic-bezier(0.22, 1.08, 0.36, 1); }
  .inline-record-content-active { height: 152px; opacity: 1; transform: translateY(0); }
  ```

  Keep `.inline-record-card { width: 100%; height: 184px; }` unchanged because it is the approved final expanded layout.

- [ ] **Step 3: Run the focused motion and Uvue compatibility tests**

  Run:

  ```powershell
  node tests/check-inline-record-card-motion.cjs
  node tests/check-uvue-css.cjs
  ```

  Expected:

  ```text
  inline record card motion checks ok
  uvue css checks ok
  ```

- [ ] **Step 4: Verify the opening still preserves input behavior**

  Inspect `openInlineComposer`, `closeInlineComposer`, `onInlineSmartArchive`, `inlineRecordContent`, and `isInlineArchiving`. Do not alter them. The only acceptable code diff in `pages/home/index.uvue` is in the relevant style block.

- [ ] **Step 5: Commit the animation only when the worktree is clean**

  ```powershell
  git add pages/home/index.uvue tests/check-inline-record-card-motion.cjs
  git commit -m "style: smooth inline record card expansion"
  ```

### Task 3: Run all checks and validate on iPhone

**Files:**
- Modify: `pages/home/index.uvue` only if a check identifies a motion or Uvue compatibility defect.
- Test: all `tests/check-*.cjs`

**Interfaces:**
- Consumes: completed Tasks 1-2.
- Produces: verification evidence for source compatibility and iPhone-specific behavior.

- [ ] **Step 1: Run the complete source check suite**

  Run:

  ```powershell
  Get-ChildItem tests -Filter 'check-*.cjs' | ForEach-Object { node $_.FullName; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE } }
  git diff --check
  ```

  Expected: every check prints a success line and `git diff --check` produces no error output.

- [ ] **Step 2: Verify the opening animation on iPhone 16 Pro through HBuilderX**

  Confirm:

  ```text
  1. Tap 开始记录: the original card widens and grows before its summary leaves.
  2. The calculator starts moving only after the card has begun expansion.
  3. 新建记录 content appears from within the growing green card; no second panel pops in.
  4. Title, close button, placeholder, count, and 智能归档 end in exactly their current positions.
  5. Text entry, close, and 智能归档 behave exactly as before.
  6. With ProMotion available, motion is smooth; iOS may fall back to 60Hz under system constraints.
  ```

- [ ] **Step 3: Commit only verified project-local changes when safe**

  ```powershell
  git add pages/home/index.uvue tests/check-inline-record-card-motion.cjs
  git commit -m "test: verify inline composer expansion"
  ```
