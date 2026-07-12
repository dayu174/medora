# Task 3 Brief: Render the Stretchable Anchored Delete Action

Read this first. It is the complete requirement for this task.

## Ownership

You own only `pages/home/index.uvue`. Do not edit tests or documentation. You are not alone in this codebase: preserve all unrelated edits and never revert other work.

## Goal

Complete the visual layer of the approved Home recent-card swipe delete. The card itself must be able to move out through the physical left side of the iPhone screen while the red delete action stays anchored to the right. Past the 55% armed threshold, the right action stretches leftward and its label grows slightly, communicating that release deletes immediately.

## Required template changes

Replace the existing Home delete action markup with:

```html
<view v-if="recentTranslate(index) < -4 && sharedCard == null"
  :class="deleteActionClass(index)"
  :style="deleteActionStyle(index)"
  @tap="deleteRecentRecord(index)">
  <text :class="deleteActionLabelClass(index)">删除</text>
</view>
```

Keep `home-swipe-card` as the direct parent and preserve `overflow: visible` so it does not clip the moving card at a component boundary.

## Required UTS helpers

Add these methods in `pages/home/index.uvue`:

```ts
deleteActionStyle(index: number) {
  const distance = Math.abs(this.recentTranslate(index))
  const stretch = distance > 80 ? Math.min(140, (distance - 80) * 0.48) : 0
  const width = 80 + stretch
  return 'width:' + width + 'px;'
},
deleteActionClass(index: number) {
  const state = this.recentSwipeStates[index]
  let value = state != null && state.armed ? 'home-delete-btn home-delete-btn-armed' : 'home-delete-btn'
  if (state != null && !state.animating) value += ' home-delete-btn-dragging'
  return value
},
deleteActionLabelClass(index: number) {
  const state = this.recentSwipeStates[index]
  return state != null && state.armed ? 'home-delete-label home-delete-label-armed' : 'home-delete-label'
}
```

Extend `recentCardStyle(index, record)` so it returns transform, opacity, and z-index. The moving/deleting card must use `z-index:2`, inactive cards `z-index:1`, and a `deleting` card must return `opacity:0` so the 220ms state-machine exit is a slide/fade rather than an abrupt removal. Keep any genuine tap press feedback; the direct drag has already cleared it in Task 2.

## Required CSS

Use only class selectors and supported Uvue values:

```css
.home-delete-btn { position: absolute; top: 0; right: 0; height: 100%; border-top-right-radius: 16px; border-bottom-right-radius: 16px; background-color: #ba1a1a; display: flex; flex-direction: row; align-items: center; justify-content: center; transition-property: width, background-color; transition-duration: 180ms; transition-timing-function: cubic-bezier(0.22, 1.12, 0.36, 1); }
.home-delete-btn-dragging { transition-duration: 0ms; }
.home-delete-btn-armed { background-color: #9f1414; }
.home-delete-label { color: #ffffff; font-size: 13px; line-height: 20px; font-weight: 700; transform: scale(1); transition-property: transform; transition-duration: 160ms; transition-timing-function: cubic-bezier(0.22, 1.12, 0.36, 1); }
.home-delete-label-armed { transform: scale(1.08); }
.recent-card-transition { transition-property: transform, opacity; transition-duration: 220ms; transition-timing-function: cubic-bezier(0.22, 1.12, 0.36, 1); }
```

## Constraints

- No `filter`, `backdrop-filter`, `display:block`, element selectors, unsupported CSS, or third-party gesture libraries.
- Do not force 120Hz. Keep direct drag on transform and release animation on compositor-friendly transform/opacity; ProMotion devices can use native 120Hz with automatic fallback.
- The delete action's right edge stays anchored; it widens toward the left once the card has passed 80px.
- Keep existing shared-card overlay behavior intact.
- Do not commit: the parent working tree contains unrelated uncommitted changes.

## Test procedure

Run both commands after implementation:

```powershell
node tests/check-home-empty-and-delete.cjs
node tests/check-uvue-css.cjs
```

Both must pass. Write a detailed report to `C:\Users\LENOVO\Documents\Medora\docs\superpowers\plans\2026-07-12-home-swipe-delete-task-3-report.md`, then return only `DONE`/`BLOCKED`, changed files, test outcomes, and concerns.
