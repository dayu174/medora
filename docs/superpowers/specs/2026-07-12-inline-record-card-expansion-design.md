# Inline Record Card Expansion Design

## Goal

Make the Home `开始记录` card feel as though it expands into the existing `新建记录` composer, rather than being replaced by a new panel.

## Scope

Only the opening transition in `pages/home/index.uvue` changes. The existing final composer UI and all input behavior remain unchanged:

- input layout, dimensions, color, border radius, spacing, and copy;
- `新建记录` title and close-button position;
- textarea placeholder, focus behavior, model binding, character count, and archive action;
- card color and final expanded dimensions;
- the logic that closes the composer after archiving.

No template structure changes are required. The existing root record card already contains both the compact summary and the composer content; this work coordinates their existing class transitions.

## Motion Design

### Opening sequence

1. The record card begins widening from its compact width while its height grows toward the existing composer height.
2. The compact plus icon and `开始记录` copy remain visible during the first part of that growth, then move slightly upward and fade as their reserved height shrinks.
3. The existing composer content begins growing from inside the same card before the compact summary has fully disappeared. Its title, textarea, counter, and archive action retain their present final layout and only become visible through the existing content region.
4. The calculator begins its existing collapse slightly after the record card has started expanding, preserving the visual focus on the origin card.

The card container clips only transient overlapping content during the expansion; it has no visual impact in either resting state.

### Timing

- Record-card width/height: 380ms, `cubic-bezier(0.22, 1.08, 0.36, 1)`.
- Compact summary: 240ms fade and upward motion, beginning 30ms after the card starts.
- Composer content height: 320ms, beginning immediately; opacity begins at 90ms so content does not pop in before the card has opened.
- Calculator collapse: 280ms with a 40ms delay.

No JavaScript frame loop is introduced. Motion uses only CSS transitions on `width`, `height`, `opacity`, and `transform`; the interactive input is never transformed.

## Performance and iPhone 16 Pro

iPhone 16 Pro can display ProMotion content at up to 120Hz, but the app cannot force a permanent 120fps rate: iOS, the uni-app runtime, battery saver, thermal state, and compositor scheduling decide the effective rate. Restricting visual motion to compositor-friendly `transform` and `opacity` provides the correct path for 120Hz when available and a smooth native 60Hz fallback otherwise.

## Compatibility

- Keep Uvue CSS class-only selectors and supported display values.
- Do not use web-only filter effects, keyframe animation loops, requestAnimationFrame, or unsupported CSS functions.
- Preserve existing Home card and shared-card interactions.

## Verification

Automated checks retain Uvue CSS compatibility and Home behavior. Manual iPhone validation confirms that the expanded composer has no changed UI, the calculator collapses after expansion begins, and the transition reads as a single card expanding.
