# Task 1 Brief: Lock the Notification-Style Gesture Contract

Read this first. It is the complete requirement for this task.

## Ownership

You own only `tests/check-home-empty-and-delete.cjs`. Do not edit production files. You are not alone in this codebase: preserve all existing work and never revert unrelated changes.

## Goal

Add a source-contract test that will fail until Home implements an iPhone Notification Center-style left swipe delete gesture.

## Required assertions

Append checks after existing delete-action checks for these literal source requirements:

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

## Constraints

- Use Node source-contract testing only. Do not add device or screenshot testing.
- Run `node tests/check-home-empty-and-delete.cjs` after editing. It must fail because the production behavior does not exist yet, not because of a syntax error.
- Do not commit: the parent working tree already contains unrelated uncommitted work.

## Completion Report

Return only: `DONE`, the exact file changed, the test command and expected failing output summary, and any concern.
