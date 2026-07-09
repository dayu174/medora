# Medora Rebuild Design

## Goal

Rebuild the deleted Medora app as a uni-app x project that can be opened in HBuilderX and run on iPhone 16 Pro.

## Source Material

- Stitch archive: `C:/Users/LENOVO/Downloads/stitch_mednote_clinical_archive.zip`
- Brand system: Yi Xiao Ji / Medora clinical style
- Brand name in app: `Medora`
- Target device: iPhone 16 Pro

## Product Scope

The app includes these screens from the Stitch archive:

- Home dashboard with quick actions and recent records
- Knowledge library
- Knowledge detail for heart failure
- Record discovery / clinical note capture
- Medical calculator with BMI
- Profile
- Settings
- Account security
- Notifications
- Profile edit

## Architecture

The project is a uni-app x application with `main.uts`, `App.uvue`, `pages.json`, `.uvue` pages, reusable `.uvue` components, and `.uts` data/logic files. Shared UI styles live in `App.uvue` because uni-app x applies global app styles there.

Pages use this structure:

- `app-page`: fixed iPhone 16 Pro canvas with safe top spacing
- `phone-frame`: vertical flex shell
- `scroll-view.page-scroll`: native scrolling content area
- `BottomTabs`: placed outside the scroll area on tabbed pages

## Uni-App X Constraints

- Use class selectors only in `.uvue` styles.
- Do not use tag selectors such as `button` or `text`.
- Do not use unsupported display values such as `block`, `inline-block`, or `grid`.
- Do not use viewport units such as `100vh`.
- Avoid `position: fixed`; bottom navigation is part of the flex shell.
- Every `display:flex` rule must include `flex-direction`.
- Use `scroll-view` for scrollable page content.

## Testing

Local tests verify:

- App data exposes Medora tabs, records, knowledge, settings, and calculator content.
- BMI calculation handles valid and invalid input.
- `.uvue` CSS avoids known uni-app x unsupported selectors and values.
- All flex rules declare direction.
- Every page uses a scroll layout, and bottom tabs remain outside the scroll area.
