# Library Swipe Delete Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add immediate left-swipe deletion to library cards and make home recent-record deletion remove the linked knowledge card while retaining at most ten recent records.

**Architecture:** `homeRecentRecords` remains a short history list; `customKnowledgeCards` stores user-created library entities; `deletedBuiltinKnowledgeCardIds` is a tombstone list for bundled cards. Both pages use independent swipe state but share the same `diseaseId` identity when home deletes a linked library entity.

**Tech Stack:** uni-app x, Vue Uvue templates, UTS, `uni` local storage, Node static regression checks.

## Global Constraints

- Target iPhone via HBuilderX and keep Uvue CSS limited to supported class selectors.
- Delete actions never show a confirmation dialog.
- Library deletion does not remove the home history entry.
- Home deletion removes the matching library entity.
- Home history contains at most 10 entries.

---

### Task 1: Add regression coverage for the data contract

**Files:**
- Modify: `tests/check-home-empty-and-delete.cjs`
- Modify: `tests/check-library-lifecycle.cjs`

**Interfaces:**
- Consumes: `deleteRecentRecord(index: number)` in `pages/home/index.uvue`.
- Produces: regression requirements for `deletedBuiltinKnowledgeCardIds`, `deleteLibraryCard(index: number)`, and a 10-record limit.

- [ ] **Step 1: Write the failing tests**

Add these required identifiers to the home check:

```js
"deleteLibraryEntity",
"customKnowledgeCards",
"deletedBuiltinKnowledgeCardIds",
"slice(0, 10)"
```

Add these required identifiers to the library lifecycle check:

```js
"librarySwipeStates",
"libraryTouchStart",
"libraryTouchMove",
"libraryTouchEnd",
"deleteLibraryCard",
"deletedBuiltinKnowledgeCardIds"
```

- [ ] **Step 2: Run the targeted checks and verify they fail**

Run: `node tests/check-home-empty-and-delete.cjs; node tests/check-library-lifecycle.cjs`

Expected: failure reporting the missing deletion or cap identifiers.

- [ ] **Step 3: Keep the tests focused on observable source contracts**

Do not assert visual colors or unrelated implementation details. The checks only establish that each user-visible deletion path and storage key exists.

- [ ] **Step 4: Re-run the targeted checks**

Run: `node tests/check-home-empty-and-delete.cjs; node tests/check-library-lifecycle.cjs`

Expected: still failing until Tasks 2 and 3 are complete.

### Task 2: Make home deletion remove its linked knowledge entity and cap history

**Files:**
- Modify: `pages/home/index.uvue`
- Modify: `pages/record/index.uvue`

**Interfaces:**
- Produces: `deleteLibraryEntity(diseaseId: string)` in the home page.
- Consumes: `customKnowledgeCards`, `deletedBuiltinKnowledgeCardIds`, and `homeRecentRecords` storage keys.

- [ ] **Step 1: Write the minimal home helper**

Add a helper before `deleteRecentRecord`:

```ts
deleteLibraryEntity(diseaseId: string) {
  if (diseaseId === '') return
  if (diseaseId.indexOf('custom_') === 0) {
    const stored = uni.getStorageSync('customKnowledgeCards') as any[]
    const cards = stored != null && Array.isArray(stored) ? stored : []
    for (let index = cards.length - 1; index >= 0; index--) {
      if (cards[index].diseaseId === diseaseId) cards.splice(index, 1)
    }
    uni.setStorageSync('customKnowledgeCards', cards)
    return
  }
  const storedIds = uni.getStorageSync('deletedBuiltinKnowledgeCardIds') as string[]
  const deletedIds = storedIds != null && Array.isArray(storedIds) ? storedIds : [] as string[]
  if (deletedIds.indexOf(diseaseId) < 0) deletedIds.push(diseaseId)
  uni.setStorageSync('deletedBuiltinKnowledgeCardIds', deletedIds)
}
```

- [ ] **Step 2: Call the helper from the existing home delete path**

Replace the start of `deleteRecentRecord` with:

```ts
if (index < 0 || index >= this.recentRecords.length) return
const record = this.recentRecords[index]
const diseaseId = record != null && record.diseaseId != null ? record.diseaseId as string : ''
this.recentRecords.splice(index, 1)
this.deleteLibraryEntity(diseaseId)
uni.setStorageSync('homeRecentRecords', this.recentRecords)
```

Keep swipe-state resynchronization and the existing success toast.

- [ ] **Step 3: Cap records while loading home history**

After normalizing stored records, retain only the first ten entries:

```ts
if (normalized.length > 10) normalized.splice(10, normalized.length - 10)
this.recentRecords = normalized
uni.setStorageSync('homeRecentRecords', normalized)
```

- [ ] **Step 4: Cap records at both archive write sites**

Immediately after each `recentRecords.unshift(...)` / `recentList.unshift(...)` in `pages/record/index.uvue`, add:

```ts
if (recentRecords.length > 10) recentRecords.splice(10, recentRecords.length - 10)
```

Use `recentList` in the organizer completion path.

- [ ] **Step 5: Run home tests**

Run: `node tests/check-home-empty-and-delete.cjs; node tests/check-record-page.cjs`

Expected: both checks pass.

### Task 3: Add library swipe state, persistent built-in deletion, and immediate deletion

**Files:**
- Modify: `pages/library/index.uvue`
- Modify: `tests/check-library-lifecycle.cjs`

**Interfaces:**
- Produces: `libraryTouchStart`, `libraryTouchMove`, `libraryTouchEnd`, `deleteLibraryCard`.
- Consumes: `cards`, `customKnowledgeCards`, `deletedBuiltinKnowledgeCardIds`.

- [ ] **Step 1: Add swipe state to page data**

Add the same state shape used by home:

```ts
librarySwipeStates: [] as any[]
```

Add `syncLibrarySwipeStates()` to create one `{ translateX: 0, animating: false, startX: 0, lastX: 0, lastTime: 0 }` item per displayed card. Call it after `this.cards = normalized`.

- [ ] **Step 2: Filter deleted bundled cards on load**

Read tombstones before rendering:

```ts
const storedIds = uni.getStorageSync('deletedBuiltinKnowledgeCardIds') as string[]
const deletedIds = storedIds != null && Array.isArray(storedIds) ? storedIds : [] as string[]
```

Before normalizing each raw card, skip it when its `diseaseId` exists in `deletedIds`. Continue to include custom cards unless they were removed from `customKnowledgeCards`.

- [ ] **Step 3: Wrap each library card with the swipe surface**

Inside the existing `v-for`, place the card content over a red action:

```html
<view class="library-swipe-card">
  <view class="library-delete-btn" @tap="deleteLibraryCard(index)"><text class="library-delete-label">删除</text></view>
  <view :class="libraryCardClass(index)" :style="'transform: translateX(' + libraryTranslate(index) + 'px);'" @touchstart="libraryTouchStart($event, index)" @touchmove="libraryTouchMove($event, index)" @touchend="libraryTouchEnd($event, index)" @touchcancel="libraryTouchEnd($event, index)">
    <!-- existing quick-note or article-card markup -->
  </view>
</view>
```

Preserve the existing inner `@tap` targets for detail opening and quick-note editing.

- [ ] **Step 4: Implement swipe mechanics**

Mirror home behavior: close other cards on touch start; rubber-band past 80px; open at `-80` when left velocity exceeds `0.5` or offset is less than `-42`; otherwise return to zero. `libraryCardClass(index)` includes a transform transition only while snapping.

- [ ] **Step 5: Implement library-only deletion**

Implement:

```ts
deleteLibraryCard(index: number) {
  if (index < 0 || index >= this.cards.length) return
  const card = this.cards[index]
  const id = card != null && card.diseaseId != null ? card.diseaseId as string : ''
  if (id.indexOf('custom_') === 0) {
    const stored = uni.getStorageSync('customKnowledgeCards') as any[]
    const cards = stored != null && Array.isArray(stored) ? stored : []
    for (let itemIndex = cards.length - 1; itemIndex >= 0; itemIndex--) if (cards[itemIndex].diseaseId === id) cards.splice(itemIndex, 1)
    uni.setStorageSync('customKnowledgeCards', cards)
  } else if (id !== '') {
    const storedIds = uni.getStorageSync('deletedBuiltinKnowledgeCardIds') as string[]
    const deletedIds = storedIds != null && Array.isArray(storedIds) ? storedIds : [] as string[]
    if (deletedIds.indexOf(id) < 0) deletedIds.push(id)
    uni.setStorageSync('deletedBuiltinKnowledgeCardIds', deletedIds)
  }
  this.cards.splice(index, 1)
  this.syncLibrarySwipeStates()
  uni.showToast({ title: '已删除', icon: 'success' })
}
```

Do not write `homeRecentRecords` in this function.

- [ ] **Step 6: Add Uvue CSS classes**

Add class-only rules matching home dimensions:

```css
.library-swipe-card { position: relative; width: 100%; margin-bottom: 16px; border-radius: 16px; overflow: hidden; }
.library-delete-btn { position: absolute; top: 0; right: 0; width: 80px; height: 100%; background-color: #ba1a1a; display: flex; flex-direction: row; align-items: center; justify-content: center; }
.library-delete-label { color: #ffffff; font-size: 13px; line-height: 20px; font-weight: 700; }
.library-card-surface { position: relative; z-index: 1; }
.library-card-transition { transition-property: transform; transition-duration: 260ms; transition-timing-function: ease-out; }
```

- [ ] **Step 7: Run library tests**

Run: `node tests/check-library-lifecycle.cjs; node tests/check-library-render-model.cjs; node tests/check-uvue-css.cjs`

Expected: all checks pass.

### Task 4: Run complete verification

**Files:**
- Modify: no additional files

- [ ] **Step 1: Run every static check**

Run:

```powershell
Get-ChildItem -LiteralPath 'tests' -Filter '*.cjs' | ForEach-Object { node $_.FullName; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE } }
```

Expected: every check exits with code 0.

- [ ] **Step 2: Run whitespace validation**

Run: `git diff --check`

Expected: exit code 0.

- [ ] **Step 3: Verify on iPhone through HBuilderX**

Stop and run the app again on the connected iPhone. Verify: one card opens at a time, each delete is immediate, home deletion removes the library card, library deletion preserves recent history, and the eleventh recent entry removes only the oldest home history item.
