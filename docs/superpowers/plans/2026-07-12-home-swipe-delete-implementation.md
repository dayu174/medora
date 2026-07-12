# Home Swipe Delete Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Home recent-record deletion feel like iPhone Notification Center: the entire card tracks left across the screen edge, the right-side delete surface stretches once armed, and releasing past 55 percent deletes immediately.

**Architecture:** Keep all gesture state in `pages/home/index.uvue` because Home owns both the cards and the linked-library cleanup. A per-card `HomeSwipeState` records only compositing-friendly translation, armed and deletion state; the right action's width is derived from that translation rather than resizing the card. Stable record IDs, instead of transient list indexes, drive deferred removal so an animation cannot remove the wrong record.

**Tech Stack:** uni-app x, Uvue/UTS, native iOS touch events, Uvue CSS, Node.js source-contract tests.

## Global Constraints

- Support HBuilderX uni-app x running on iPhone 16 Pro; do not depend on a browser-only swipe library.
- Use Uvue class-only selectors and supported CSS values; `tests/check-uvue-css.cjs` must remain green.
- During an active drag update only `transform`; use `opacity` only for the 220ms deletion completion.
- Do not force a refresh rate. Keep changes compositor-friendly so ProMotion devices may use 120Hz and other iPhones use their native rate.
- The armed deletion threshold is exactly 55 percent of the Home card's 361px design width: 198.55px.
- A normal release below the threshold settles to an 80px exposed delete action. A release while armed deletes without a confirmation dialog and shows `已删除`.
- Deleting a Home recent record also deletes the library item with the same `diseaseId`; normal card tap/long press resets every open swipe action first.

---

### Task 1: Lock the notification-style gesture contract in tests

**Files:**
- Modify: `tests/check-home-empty-and-delete.cjs`
- Test: `tests/check-home-empty-and-delete.cjs`

**Interfaces:**
- Consumes: Home swipe source in `pages/home/index.uvue`.
- Produces: Contract checks for `armed`, stable-ID deletion, 55% threshold, dynamic delete-action style, and unclipped card motion.

- [x] **Step 1: Add failing source-contract assertions**

  Append the following assertions after the existing delete-action checks:

  ```js
  const notificationSwipeRequirements = [
    "armed: boolean",
    "deleting: boolean",
    "const deleteThreshold = 361 * 0.55",
    "deleteActionStyle",
    "finishSwipeDelete",
    "deleteRecentRecordById",
    "home-delete-btn-armed",
    "deletingRecentId"
  ];
  for (const item of notificationSwipeRequirements) {
    if (!home.includes(item)) errors.push(`notification swipe delete missing: ${item}`);
  }

  if (!/state\.armed\s*=\s*distance\s*>=\s*deleteThreshold/.test(home)) {
    errors.push("swipe deletion must arm at 55 percent of the card width");
  }
  if (!/setTimeout\(\(\)\s*=>\s*\{\s*this\.deleteRecentRecordById/.test(home)) {
    errors.push("armed release must finish its slide before stable-ID removal");
  }
  if (!/\.home-delete-btn-armed\s*\{[^}]*background-color:\s*#9f1414/i.test(home)) {
    errors.push("armed delete action must receive a stronger red state");
  }
  ```

- [x] **Step 2: Run the focused test to verify it fails**

  Run:

  ```powershell
  node tests/check-home-empty-and-delete.cjs
  ```

  Expected: exit code `1`, reporting missing notification swipe delete requirements.

- [x] **Step 3: Keep the test focused**

  Do not add screenshot or device assertions to this Node test. It is a regression guard for source-level behavior; the visual drag quality is verified manually on iPhone after compilation.

- [x] **Step 4: Preserve the test contract without committing unrelated dirty-worktree changes**

  ```powershell
  git add tests/check-home-empty-and-delete.cjs
  git commit -m "test: cover notification style swipe delete"
  ```

### Task 2: Implement stable swipe state and threshold behavior

**Files:**
- Modify: `pages/home/index.uvue:94, 360-432`
- Test: `tests/check-home-empty-and-delete.cjs`

**Interfaces:**
- Consumes: `recentRecords`, `recentSwipeStates`, `deleteLibraryEntity(diseaseId: string)`.
- Produces: `recentTouchStart(event, index)`, `recentTouchMove(event, index)`, `recentTouchEnd(event, index)`, `finishSwipeDelete(index)`, and `deleteRecentRecordById(id: string)`.

- [x] **Step 1: Extend the per-card state and Home state**

  Replace the swipe interface with:

  ```ts
  interface HomeSwipeState {
    translateX: number,
    animating: boolean,
    startX: number,
    lastX: number,
    lastTime: number,
    armed: boolean,
    deleting: boolean
  }
  ```

  Add `deletingRecentId: ''` to `data()`, and initialize `armed: false, deleting: false` in `syncRecentSwipeStates()`.

- [x] **Step 2: Make drag translation track the card rather than the list container**

  In `recentTouchMove`, use a fixed design threshold and a limited elastic tail:

  ```ts
  const deleteThreshold = 361 * 0.55
  const rawDistance = Math.max(0, state.startX - currentX)
  const distance = rawDistance > 420 ? 420 + (rawDistance - 420) * 0.18 : rawDistance
  state.animating = false
  state.translateX = -distance
  state.armed = distance >= deleteThreshold
  ```

  Keep a small rightward resistance only when `rawDistance` is zero; do not clamp leftward movement to the former 80px action width.

- [x] **Step 3: Settle normally or delete from an armed release**

  Replace the former velocity-based deletion condition in `recentTouchEnd` with:

  ```ts
  state.animating = true
  if (state.armed) {
    this.finishSwipeDelete(index)
    return
  }
  state.translateX = state.translateX < -42 ? -80 : 0
  state.armed = false
  ```

  This intentionally requires crossing the 55% threshold to delete; a quick flick alone only exposes the delete action.

- [x] **Step 4: Finish deletion by record ID after the exit animation**

  Add these methods:

  ```ts
  finishSwipeDelete(index: number) {
    const record = this.recentRecords[index]
    if (record == null || this.deletingRecentId !== '') return
    const state = this.recentSwipeStates[index]
    this.deletingRecentId = record.id as string
    if (state != null) {
      state.animating = true
      state.deleting = true
      state.translateX = -440
    }
    setTimeout(() => { this.deleteRecentRecordById(this.deletingRecentId) }, 220)
  },
  deleteRecentRecordById(id: string) {
    if (id === '') return
    let index = -1
    for (let itemIndex = 0; itemIndex < this.recentRecords.length; itemIndex++) {
      if (this.recentRecords[itemIndex].id === id) index = itemIndex
    }
    this.deletingRecentId = ''
    if (index < 0) return
    const record = this.recentRecords[index]
    const diseaseId = record.diseaseId != null ? record.diseaseId as string : ''
    this.recentRecords.splice(index, 1)
    this.deleteLibraryEntity(diseaseId)
    this.writeStorageList('homeRecentRecordsJson', 'homeRecentRecords', this.recentRecords)
    this.syncRecentSwipeStates()
    uni.showToast({ title: '已删除', icon: 'success' })
  }
  ```

  Make `deleteRecentRecord(index)` obtain the record ID and call `deleteRecentRecordById(record.id as string)` so tapping the exposed action uses the same cleanup path.

- [x] **Step 5: Reset state before presses and shared-card opening**

  In `recentTouchStart`, return if `deletingRecentId !== ''`; close every other card by setting its translation to zero, clearing `armed`, and enabling the settle transition. In `resetRecentSwipeStates`, clear both `armed` and `deleting`. Preserve the existing rule that a moved card cannot open the shared-card panel.

- [x] **Step 6: Run the focused state and Uvue checks; Home contract remains intentionally pending Task 3 visual hooks**

  Run:

  ```powershell
  node tests/check-home-empty-and-delete.cjs
  ```

  Expected: `home empty state and delete checks ok`.

- [x] **Step 7: Preserve behavior without committing unrelated dirty-worktree changes**

  ```powershell
  git add pages/home/index.uvue tests/check-home-empty-and-delete.cjs
  git commit -m "feat: add armed home card swipe deletion"
  ```

### Task 3: Render the anchored, stretchable delete surface without clipping

**Files:**
- Modify: `pages/home/index.uvue:51-53, 500-504`
- Test: `tests/check-home-empty-and-delete.cjs`, `tests/check-uvue-css.cjs`

**Interfaces:**
- Consumes: `recentTranslate(index)`, `recentSwipeStates[index].armed`, and `recentSwipeStates[index].deleting`.
- Produces: `deleteActionStyle(index)`, `deleteActionClass(index)`, and action markup whose size is derived from the active card translation.

- [ ] **Step 1: Bind the right delete action to dynamic style and armed class**

  Change the action markup to:

  ```html
  <view v-if="recentTranslate(index) < -4 && sharedCard == null"
    :class="deleteActionClass(index)"
    :style="deleteActionStyle(index)"
    @tap="deleteRecentRecord(index)">
    <text :class="deleteActionLabelClass(index)">删除</text>
  </view>
  ```

- [ ] **Step 2: Derive stretch from drag distance while keeping its right edge fixed**

  Add:

  ```ts
  deleteActionStyle(index: number) {
    const distance = Math.abs(this.recentTranslate(index))
    const stretch = distance > 80 ? Math.min(140, (distance - 80) * 0.48) : 0
    const width = 80 + stretch
    return 'width:' + width + 'px;'
  },
  deleteActionClass(index: number) {
    const state = this.recentSwipeStates[index]
    return state != null && state.armed ? 'home-delete-btn home-delete-btn-armed' : 'home-delete-btn'
  },
  deleteActionLabelClass(index: number) {
    const state = this.recentSwipeStates[index]
    return state != null && state.armed ? 'home-delete-label home-delete-label-armed' : 'home-delete-label'
  }
  ```

- [ ] **Step 3: Use only Uvue-compatible CSS for the action morph**

  Keep `.home-swipe-card { overflow: visible; }`, then replace the delete styles with:

  ```css
  .home-delete-btn { position: absolute; top: 0; right: 0; height: 100%; border-top-right-radius: 16px; border-bottom-right-radius: 16px; background-color: #ba1a1a; display: flex; flex-direction: row; align-items: center; justify-content: center; transition-property: width, background-color; transition-duration: 180ms; transition-timing-function: cubic-bezier(0.22, 1.12, 0.36, 1); }
  .home-delete-btn-armed { background-color: #9f1414; }
  .home-delete-label { color: #ffffff; font-size: 13px; line-height: 20px; font-weight: 700; transform: scale(1); transition-property: transform; transition-duration: 160ms; transition-timing-function: cubic-bezier(0.22, 1.12, 0.36, 1); }
  .home-delete-label-armed { transform: scale(1.08); }
  .recent-card-transition { transition-property: transform, opacity; transition-duration: 220ms; transition-timing-function: cubic-bezier(0.22, 1.12, 0.36, 1); }
  ```

  Do not add `filter`, `backdrop-filter`, `display:block`, element selectors, or layout transitions.

- [ ] **Step 4: Give the moving card a deterministic layer order**

  Extend `recentCardStyle` to append `z-index: 2` for an active moved/deleting state and `z-index: 1` otherwise. This keeps the full card visually above its sibling delete surfaces until it crosses the physical left edge.

- [ ] **Step 5: Run the Uvue compatibility and Home checks**

  Run:

  ```powershell
  node tests/check-home-empty-and-delete.cjs
  node tests/check-uvue-css.cjs
  ```

  Expected:

  ```text
  home empty state and delete checks ok
  uvue css checks ok
  ```

- [ ] **Step 6: Commit the rendering layer**

  ```powershell
  git add pages/home/index.uvue tests/check-home-empty-and-delete.cjs
  git commit -m "style: polish home swipe delete action"
  ```

### Task 4: Verify source, compatibility, and device behavior

**Files:**
- Modify: `pages/home/index.uvue` only if verification exposes a source-contract or Uvue compatibility issue.
- Test: `tests/check-home-empty-and-delete.cjs`, `tests/check-uvue-css.cjs`, all existing `tests/check-*.cjs`

**Interfaces:**
- Consumes: completed Tasks 1-3.
- Produces: evidence that the new gesture does not regress storage linkage, shared-card opening, or supported Uvue CSS.

- [ ] **Step 1: Run all source checks**

  Run:

  ```powershell
  Get-ChildItem tests -Filter 'check-*.cjs' | ForEach-Object { node $_.FullName; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE } }
  git diff --check
  ```

  Expected: every check prints its success line and `git diff --check` produces no output.

- [ ] **Step 2: Build and manually verify on iPhone in HBuilderX**

  Verify one Home card in each state:

  ```text
  1. Drag left 40px then release: 80px red action remains exposed.
  2. Tap the exposed action: card is removed and “已删除” appears.
  3. Drag left past roughly 200px then release: action darkens/stretches, card exits left, then is removed with one toast.
  4. Tap or long press another card while an action is exposed: action closes before press/expand behavior.
  5. Confirm the Home deletion also removes the same-ID entry from Library.
  ```

- [ ] **Step 3: Commit any verification-only correction**

  ```powershell
  git add pages/home/index.uvue tests/check-home-empty-and-delete.cjs
  git commit -m "fix: stabilize home swipe delete"
  ```
