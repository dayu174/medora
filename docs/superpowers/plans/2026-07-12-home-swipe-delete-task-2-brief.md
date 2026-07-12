# Task 2 Brief: Implement Stable Swipe State and Armed Deletion

Read this first. It is the complete requirement for this task.

## Ownership

You own only `pages/home/index.uvue`. Do not edit tests or documentation. You are not alone in this codebase: preserve all unrelated edits and never revert other work.

## Goal

Implement the UTS state and touch behavior needed for the Home recent-record cards to follow an iPhone Notification Center-style swipe: the card must track left past the old 80px action boundary, arm at 55% width, and on armed release finish sliding left before deleting via a stable record ID.

## Exact requirements

1. Replace the `HomeSwipeState` interface with fields `translateX`, `animating`, `startX`, `lastX`, `lastTime`, `armed: boolean`, and `deleting: boolean`.
2. Add `deletingRecentId: ''` in `data()`.
3. `syncRecentSwipeStates()` must initialize `armed: false` and `deleting: false`.
4. In `recentTouchStart`, ignore input when `deletingRecentId !== ''`. Close every other open card, set its transition to settle, and clear its `armed` state. Keep the current card ready for direct drag.
5. In `recentTouchMove`, define `const deleteThreshold = 361 * 0.55`. Calculate `rawDistance = Math.max(0, state.startX - currentX)`, use `distance = rawDistance > 420 ? 420 + (rawDistance - 420) * 0.18 : rawDistance`, set `state.translateX = -distance`, and `state.armed = distance >= deleteThreshold`. Do not clamp the left drag to 80px.
6. In `recentTouchEnd`, an armed release calls `finishSwipeDelete(index)` and returns. A non-armed release settles to `-80` when already more than 42px left, otherwise `0`; it then clears armed state. Do not use velocity alone to delete.
7. Add `finishSwipeDelete(index: number)`: protect against missing records/double deletion, retain the `record.id` in `deletingRecentId`, mark its state `deleting`, set `translateX = -440`, and call `deleteRecentRecordById` after 220ms using `setTimeout`.
8. Add `deleteRecentRecordById(id: string)`: find the record by stable ID, clear `deletingRecentId`, remove it from Home, delete its linked Library entity using the existing `deleteLibraryEntity(diseaseId)`, write `homeRecentRecordsJson`, sync swipe states, and `uni.showToast({ title: '已删除', icon: 'success' })`.
9. Make `deleteRecentRecord(index)` delegate to `deleteRecentRecordById(record.id as string)` so a tap on the exposed action has one cleanup path.
10. `resetRecentSwipeStates()` must clear both `armed` and `deleting`, preserving current shared-card behavior.

## Compatibility and motion constraints

- uni-app x / Uvue / UTS on iPhone 16 Pro.
- During direct drag update translation only; do not introduce browser libraries, unsupported CSS, filters, or page navigation.
- The threshold is exactly 55 percent of 361px (198.55px); a quick flick below it only exposes the delete action.
- Do not change any template or CSS in this task; Task 3 owns rendering/action styling.

## Test procedure

1. Run `node tests/check-home-empty-and-delete.cjs` before production edits; it must fail for the new missing requirements.
2. Implement only the described UTS behavior.
3. Run `node tests/check-home-empty-and-delete.cjs`; it must pass.
4. Run `node tests/check-uvue-css.cjs`; it must pass.
5. Do not commit: the parent working tree contains unrelated uncommitted changes.

## Completion Report

Write a detailed report to `C:\Users\LENOVO\Documents\Medora\docs\superpowers\plans\2026-07-12-home-swipe-delete-task-2-report.md`. Return only: `DONE`/`NEEDS_CONTEXT`/`BLOCKED`, changed file paths, each test command with its outcome, and concerns.
