# Home Swipe Delete Design

## Goal

Replace the current clipped swipe action on Home recent-record cards with an iPhone notification-style delete gesture. The card must move beyond the physical left edge of the iPhone screen while the red delete action remains anchored on the right.

## Interaction

1. A horizontal left drag moves the whole card with the finger. The list item does not clip the card at its own boundary.
2. Before the destructive threshold, the red action has a fixed 80px width and rounded right corners. Releasing the card returns it to the resting state with the action exposed.
3. At 55 percent of the card width, the action enters an armed state. Additional drag distance stretches the red action toward the left and slightly enlarges its label.
4. Releasing while armed deletes immediately. The card completes its travel left, fades out, is removed from Home and the linked library entry is deleted, then the app shows the existing "已删除" toast.
5. A normal tap or long press clears every open swipe offset before press feedback or shared-card expansion begins.

## Motion

- Drag: direct transform response; no layout resizing for the card itself.
- Settle and arm transitions: transform and opacity only, with a restrained spring-like cubic-bezier curve.
- Delete completion: 220ms slide/fade to the left followed by list removal.
- The implementation targets the iPhone ProMotion compositor path. It does not attempt to force a refresh rate; compatible devices may render at 120Hz and others fall back to their native refresh rate.

## State

Each swipe state records translation, touch start, latest touch position, timing, and an `armed` boolean. The active card is the only card allowed to retain a non-zero translation.

## Compatibility

Use Uvue class selectors and `transform` / `opacity` transitions. Avoid unsupported web-only filters, element selectors, and layout animation dependencies.

## Verification

Automated checks cover the armed state, 55 percent threshold, unclipped swipe surface, immediate delete path, and rounded delete action. Manual iPhone verification covers drag feel and high-refresh rendering.
