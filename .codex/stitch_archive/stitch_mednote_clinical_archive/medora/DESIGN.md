---
name: Medora
colors:
  surface: '#faf9f6'
  surface-dim: '#dadad7'
  surface-bright: '#faf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f0'
  surface-container: '#eeeeea'
  surface-container-high: '#e8e8e5'
  surface-container-highest: '#e2e3df'
  on-surface: '#1a1c1a'
  on-surface-variant: '#434842'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f1f1ed'
  outline: '#737971'
  outline-variant: '#c3c8bf'
  surface-tint: '#4a654d'
  primary: '#47614a'
  on-primary: '#ffffff'
  primary-container: '#5f7a61'
  on-primary-container: '#efffec'
  inverse-primary: '#b1ceb1'
  secondary: '#59605c'
  on-secondary: '#ffffff'
  secondary-container: '#dde4df'
  on-secondary-container: '#5f6662'
  tertiary: '#505e54'
  on-tertiary: '#ffffff'
  tertiary-container: '#68776c'
  on-tertiary-container: '#eefff0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cceacc'
  primary-fixed-dim: '#b1ceb1'
  on-primary-fixed: '#07200e'
  on-primary-fixed-variant: '#334d36'
  secondary-fixed: '#dde4df'
  secondary-fixed-dim: '#c1c8c3'
  on-secondary-fixed: '#161d1a'
  on-secondary-fixed-variant: '#414845'
  tertiary-fixed: '#d6e7d9'
  tertiary-fixed-dim: '#bacbbd'
  on-tertiary-fixed: '#111e16'
  on-tertiary-fixed-variant: '#3c4a40'
  background: '#faf9f6'
  on-background: '#1a1c1a'
  surface-variant: '#e2e3df'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system for Medora is built on the pillars of tranquility, precision, and clarity. Targeted at healthcare professionals and wellness-conscious individuals, the brand evokes an emotional response of "calm competence"—a digital sanctuary that reduces cognitive load in high-stress medical or health-tracking environments.

The visual style is a blend of **Minimalism** and **Soft Modernism**. It prioritizes heavy whitespace and a restricted palette to ensure information density never feels overwhelming. Subtle depth is used to guide the eye without the clutter of traditional skeumorphism, resulting in an interface that feels lightweight, organic, and trustworthy.

## Colors

The color strategy for the design system centers on a sophisticated "Sage Green" ecosystem. 

- **Primary (#5F7A61):** A muted, earthy green used for key actions, active states, and brand recognition. It provides high legibility while remaining soothing to the eyes.
- **Secondary (#DCE3DE):** A soft, desaturated mint used for large surface areas, background containers, and subtle accents.
- **Tertiary (#A4B4A7):** Used for decorative elements, secondary icons, and low-priority borders.
- **Neutral (#1A1C1A):** A "Deep Charcoal" rather than pure black, ensuring high-contrast text remains soft and readable.

The default mode is **Light**, utilizing off-white backgrounds (#FBFBFB) to maintain a sterile yet warm "paper-like" feel.

## Typography

This design system utilizes a tiered typographic approach to balance modern aesthetics with technical precision.

- **Manrope** is used for headlines to provide a warm, geometric, and modern character. It feels professional yet approachable.
- **Inter** serves as the workhorse for body copy, chosen for its exceptional legibility in data-dense layouts and systematic reliability.
- **Geist** is reserved for labels, metadata, and numerical data, lending a technical, "developer-clean" precision to clinical figures or timestamps.

For mobile, headlines scale down to ensure content remains the hero. All body text maintains a minimum of 14px to ensure accessibility across diverse age groups.

## Layout & Spacing

The design system employs a **Fluid Grid** with a strict 8px base unit. This ensures a consistent vertical rhythm and predictable spacing between elements.

- **Desktop:** A 12-column grid with 24px gutters. The layout is centered with a max-width of 1200px to prevent line lengths from becoming unreadable on wide monitors.
- **Tablet:** An 8-column grid with 16px margins.
- **Mobile:** A 4-column grid with 16px margins. 

Spacing should always be a multiple of the 8px unit (8, 16, 24, 32, 48, 64). For internal card padding, use 24px to provide "breathing room," aligning with the minimalist philosophy.

## Elevation & Depth

To maintain a clean, minimalist aesthetic, the design system avoids heavy shadows. Instead, it utilizes **Tonal Layers** and **Low-Contrast Outlines**.

Depth is communicated through:
1.  **Surface Tiers:** The base background is #FBFBFB. Cards and primary containers use #FFFFFF. Hover states or secondary sections use the Secondary Color (#DCE3DE) at low opacities.
2.  **Soft Strokes:** Instead of drop shadows, use 1px borders in #E5E9E6 (a slightly darker version of the background) to define boundaries.
3.  **Elevation Shadows:** For high-priority floating elements (like Modals), use a single "Ambient Shadow": `0px 4px 20px rgba(95, 122, 97, 0.08)`. This shadow is tinted with the primary sage green to keep the depth feeling organic.

## Shapes

The shape language of the design system is **Rounded**, reflecting the "Soft Modernism" style. 

- Standard components (Buttons, Inputs) use a **0.5rem (8px)** corner radius.
- Larger containers (Cards, Modals) use **1rem (16px)**.
- For purely decorative or selection elements (Chips, Tags), a fully circular/pill shape is preferred to differentiate them from functional inputs.

The consistent use of 8px and 16px radii ensures the interface feels friendly and safe, avoiding the aggressive feel of sharp corners while maintaining more structure than hyper-rounded "bubble" designs.

## Components

- **Buttons:** Primary buttons use the Sage Green background with white text. Secondary buttons use a transparent background with a Sage Green border. All buttons have a height of 44px for a comfortable touch target.
- **Input Fields:** Use a subtle #F5F7F5 background with a bottom border or full 1px stroke. The focus state should transition the border to the Primary Sage Green.
- **Cards:** White backgrounds with a 1px border (#E5E9E6). No shadows unless the card is interactive/draggable.
- **Chips:** Used for medical tags or status indicators. Use a light tint of the primary color (10% opacity) with the primary color for the text.
- **Lists:** Clean, borderless rows separated by 8px of vertical space. Use a 1px horizontal divider only when the list is extremely dense.
- **Data Visuals:** Charts and progress bars should use a palette of Sage Green, Muted Teal, and Soft Grey to keep health data looking calm rather than alarming.