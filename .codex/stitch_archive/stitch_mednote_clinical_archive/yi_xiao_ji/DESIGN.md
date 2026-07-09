---
name: Yi Xiao Ji
colors:
  surface: '#faf9f9'
  surface-dim: '#dadada'
  surface-bright: '#faf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f3'
  surface-container: '#eeeeed'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e3e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#414847'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f0'
  outline: '#717977'
  outline-variant: '#c1c8c6'
  surface-tint: '#416561'
  primary: '#3b5e5b'
  on-primary: '#ffffff'
  primary-container: '#537773'
  on-primary-container: '#d7fef9'
  inverse-primary: '#a8cec9'
  secondary: '#53615f'
  on-secondary: '#ffffff'
  secondary-container: '#d7e6e3'
  on-secondary-container: '#596765'
  tertiary: '#754f41'
  on-tertiary: '#ffffff'
  tertiary-container: '#906758'
  on-tertiary-container: '#fff4f0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c4eae5'
  primary-fixed-dim: '#a8cec9'
  on-primary-fixed: '#00201e'
  on-primary-fixed-variant: '#294d49'
  secondary-fixed: '#d7e6e3'
  secondary-fixed-dim: '#bbc9c7'
  on-secondary-fixed: '#111e1d'
  on-secondary-fixed-variant: '#3c4948'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#eebbaa'
  on-tertiary-fixed: '#2f1409'
  on-tertiary-fixed-variant: '#613e31'
  background: '#faf9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e3e2e2'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
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
  label-caps:
    fontFamily: JetBrains Mono
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
  unit: 4px
  container-margin: 24px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 48px
---

## Brand & Style
The design system for this application is built upon the "Niche High-End" aesthetic, specifically tailored for medical interns who require mental clarity and professional focus. The visual direction is **Minimalist-Clinical**, merging the sterile precision of medical environments with the warmth of high-end editorial design. 

The system aims to evoke a sense of "calm authority"—reducing the cognitive load of dense medical information through expansive whitespace, a muted organic palette, and a focus on essentialism. By avoiding the cluttered, overly bright tropes of traditional productivity apps, it establishes a sophisticated sanctuary for study and clinical reference.

## Colors
The palette is rooted in nature and professional stability, now updated with a deeper, more saturated tonal range for improved visual weight.

- **Primary (Steel Teal):** A refined, desaturated teal used for key actions and branding. It maintains an organic feel while providing a more authoritative presence than a standard sage.
- **Secondary (Mineral Grey):** A cool, slate-inflected grey used for information architecture, secondary navigation, and iconography. It provides a balanced, intellectual contrast.
- **Tertiary (Dusty Cedar):** Used sparingly for highlighting, "saved" states, or anatomical diagrams to add a warm, grounded human touch.
- **Neutral (Cool Ash & Slate):** The background uses a soft `#F7F8F8` to reduce eye strain, while text scales through shades of mineral grey to maintain high legibility without the harshness of pure black.

## Typography
Typography is the cornerstone of the knowledge base. This design system utilizes **Manrope** for its modern, balanced proportions in headings and **Inter** for its systematic, utilitarian legibility in body text. 

For technical metadata (e.g., ICD-10 codes, dosages, or timestamps), **JetBrains Mono** is used to provide a "recorded" or "archival" feel, clearly distinguishing data from narrative content. Line heights are intentionally generous (1.5x - 1.6x) to ensure medical terminology remains readable during quick scans in high-pressure environments.

## Layout & Spacing
The layout follows a **Fixed-Fluid hybrid grid**. On desktop and tablet, content is centered within a maximum width of 1024px to prevent excessively long line lengths for study text. 

A strict 4px baseline grid ensures vertical rhythm. We prioritize "breathability"—margins are wider than average (24px on mobile) to create a premium, editorial feel. Knowledge cards should utilize a consistent stack of 16px for internal padding and 24px for external separation.

## Elevation & Depth
This design system avoids heavy drop shadows in favor of **Tonal Layering** and **Subtle Outlines**. 

Depth is achieved through:
- **Level 0 (Surface):** The base neutral background (`#F7F8F8`).
- **Level 1 (Cards):** Surfaces with a very soft, 1px border in a light mineral grey and a diffused 4px blur shadow.
- **Level 2 (Floating/Modals):** Elements that require immediate focus use a more pronounced 12px blur shadow with a slight teal-tinted hue to maintain color harmony.

## Shapes
The shape language is "Softly Architectural." We use **Rounded (0.5rem)** corners as the default to ensure the UI feels approachable yet structured. 

- **Primary Buttons & Inputs:** 8px (0.5rem) radius.
- **Knowledge Cards:** 16px (1rem) radius to create a distinct container for information snippets.
- **Tags/Chips:** Fully pill-shaped to contrast against the more rectangular card structures.

## Components
- **Knowledge Cards:** The central component. Use a soft neutral background, 16px corner radius, and a subtle 1px border. The header of the card should use `headline-md` in the primary steel teal color.
- **Study Buttons:** Primary buttons are filled with the Steel Teal color. Secondary buttons use the "Ghost" style—transparent background with a 1px border in Mineral Grey.
- **Mnemonic Chips:** Small, pill-shaped indicators using the Dusty Cedar color at 10% opacity for the background and 100% for the text to highlight key medical memory aids.
- **Interactive Lists:** Used for differential diagnoses. Each item should have a 12px vertical padding and a hairline separator (0.5px) to maintain a clean, high-end look.
- **Input Fields:** Minimalist design with only a bottom border that transitions to the primary teal color on focus, paired with `label-caps` for the field title.
- **Progress Indicators:** Use thin, 2px horizontal bars in Steel Teal for study completion tracking, avoiding bulky circular rings to keep the interface light.