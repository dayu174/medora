# Library Swipe Delete Design

## Goal

Add an iPhone-native left-swipe delete interaction to Medora's home recent-record cards and library cards. Deletion must be immediate and require no confirmation dialog.

## Interaction

- A card reveals an 80px red delete action when swiped left past the existing drag threshold.
- Only one card can remain open at a time. Starting a swipe on another card closes the previous action.
- Tapping the delete action removes the card immediately, collapses its row, and shows the existing lightweight success toast.
- Tapping an unswiped card continues to open its detail or editing surface.

## Data Rules

### Home Recent Records

- `homeRecentRecords` stores at most 10 entries.
- New records are inserted at the front. Entries beyond index 9 are removed from recent history only.
- Removing a recent record manually also removes the library card with the same `diseaseId`.
- The home page therefore deletes both `homeRecentRecords` and the matching library entity.

### Library Cards

- Deleting a user-created card removes it from `customKnowledgeCards` only. It does not alter home recent history.
- Deleting an inbuilt learning card stores its ID in `deletedBuiltinKnowledgeCardIds`. The library filters those IDs on every load, so deletion survives relaunches without mutating bundled data.
- A library deletion does not remove an entry from `homeRecentRecords`.

## Implementation Boundaries

- `pages/home/index.uvue`: retain the existing swipe mechanics; extend `deleteRecentRecord` to remove the matching custom card or persist an inbuilt-card tombstone, and cap recent history at 10 when it is loaded or created.
- `pages/library/index.uvue`: add library-local swipe state and handlers based on the home pattern, filter deleted inbuilt IDs during card loading, and delete only the library entity.
- `pages/record/index.uvue`: cap inserted recent history at 10 for quick notes and completed organizer records.

## Verification

- Static regression checks assert the home/library swipe handlers, 10-entry cap, shared-ID removal from home deletion, and persistent inbuilt-card tombstones.
- Existing Uvue CSS and template integrity checks remain green.
