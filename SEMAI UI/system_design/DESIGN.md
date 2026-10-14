---
name: Serene Neonatal Intelligence
colors:
  surface: '#f9f9ff'
  surface-dim: '#c9dbff'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e8eeff'
  surface-container-high: '#dfe8ff'
  surface-container-highest: '#d6e3ff'
  on-surface: '#001b3d'
  on-surface-variant: '#424653'
  inverse-surface: '#123059'
  inverse-on-surface: '#ecf0ff'
  outline: '#737784'
  outline-variant: '#c3c6d5'
  surface-tint: '#1b59c1'
  primary: '#0047a6'
  on-primary: '#ffffff'
  primary-container: '#245fc7'
  on-primary-container: '#d8e1ff'
  inverse-primary: '#b0c6ff'
  secondary: '#6352a2'
  on-secondary: '#ffffff'
  secondary-container: '#baa7fe'
  on-secondary-container: '#4a3886'
  tertiary: '#00564a'
  on-tertiary: '#ffffff'
  tertiary-container: '#007161'
  on-tertiary-container: '#90f3dd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#b0c6ff'
  on-primary-fixed: '#001945'
  on-primary-fixed-variant: '#00429b'
  secondary-fixed: '#e7deff'
  secondary-fixed-dim: '#ccbdff'
  on-secondary-fixed: '#1f045b'
  on-secondary-fixed-variant: '#4b3988'
  tertiary-fixed: '#91f4de'
  tertiary-fixed-dim: '#75d8c2'
  on-tertiary-fixed: '#00201a'
  on-tertiary-fixed-variant: '#005144'
  background: '#f9f9ff'
  on-background: '#001b3d'
  surface-variant: '#d6e3ff'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 3.5rem
    fontWeight: '700'
    lineHeight: 4.25rem
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.015em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: 2.75rem
    letterSpacing: -0.015em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
  vital-metric-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.75rem
    fontWeight: '700'
    lineHeight: 3rem
    letterSpacing: -0.02em
  vital-metric-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
  label-lg:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '700'
    lineHeight: 0.875rem
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xxs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

The design system embodies a calm, precise, and deeply humanized clinical environment. Designed for neonatal intensive care units (NICUs), pediatricians, and clinical specialists, the interface balances life-critical vigilance with emotional reassurance. The visual ethos combines high-reliability medical ergonomics with gentle, compassionate SaaS aesthetics, removing clinical coldness without compromising urgency, diagnostic fidelity, or data density.

### Key Personality Drivers
- **Clinical Composure:** Avoids aggressive, panic-inducing UI states. Alerts are prioritized, legible, and visually balanced to reduce alarm fatigue.
- **Humanized Precision:** Softened geometry paired with high-contrast, structured clinical metrics keeps the focus on patient comfort and neonatal care.
- **Assistive Intelligence:** AI interventions and vitals forecasts appear through distinct lavender-tinted surfaces that feel consultative rather than invasive.

### Visual Style
- **Calm Medical Modernism:** A hybrid of structured clinical dashboards and high-touch consumer health software. Clean surfaces, airy margins, disciplined contrast ratios, and deliberate soft-radii panels convey safety, hygiene, and technological reliability.

## Colors

The palette establishes an orderly clinical hierarchy calibrated for long shifts, low ambient light environments, and rapid glanceability under stress. All foreground text combinations adhere rigorously to WCAG 2.2 AA (minimum 4.5:1 for body copy and 3:1 for large display elements).

### Palette Architecture
- **Primary Clinical Blue (`#245FC7`):** Represents institutional authority, diagnostic actions, primary calls to action, and active state indicators.
- **AI Lavender (`#8B79CC`):** Reserved for predictive analytics, machine learning telemetry, pattern-matching highlights, and proactive neonatal trend insights.
- **Care Teal (`#43A995`):** Denotes stable physiological baselines, successful calibrations, non-threatening states, and nursing care logs.
- **Attention Amber (`#E8AE42`):** Communicates drifting vitals, pending threshold validations, sensor adjustments, and early-stage alerts.
- **Critical Alert Red (`#D94B59`):** Strictly isolated for acute physiological crises, incubator malfunction warnings, desaturation incidents, and critical emergencies.
- **Base Surfaces & Backgrounds:** The base canvas uses `#F3F7FC` to alleviate ocular strain from sterile white light. Elevating surfaces transition to `#FFFFFF`.
- **Typographic Neutral Hierarchy:** Deep clinical slate (`#17345D`) serves as high-contrast body and heading text, supported by steel secondary text (`#65758B`). Structural boundary dividers utilize `#DFE7F1`.

## Typography

Typography pairs `Plus Jakarta Sans` for titles, module headings, and quantitative vital metrics with `Inter` for clinical logs, diagnostic feeds, labels, and tabular data.

### Typographic Rules
- **Numerical Integrity:** For all neonatal metric displays (heart rate, SpO2, core temperature, ambient incubator humidity), numeric tabular lining figures (`tnum`) must be enforced to ensure vitals columns do not jump when fluctuating.
- **Hierarchy:** `Plus Jakarta Sans` provides a welcoming, humane presence in bedside headers and care-team overviews. `Inter` provides high micro-legibility at 11px to 14px sizes across dense sensor charts.
- **Cap-Height Calibration:** All metric labels use `label-caps` in uppercase with subtle letter-spacing, immediately anchoring the numerical readings underneath them.

## Layout & Spacing

The layout model utilizes a fluid 12-column responsive layout built on an 8px base rhythm (with 4px half-steps for micro-alignments).

### Form Factors & Adaptation
- **Desktop & Bedside Consoles (1280px+):** 12 columns with `1.5rem` gutters and `2rem` outer margins. Prioritizes side-by-side incubator live streams, real-time waveform telemetry, and assistive recommendation feeds.
- **Tablet & Mobile Carts (768px – 1279px):** 8 columns with `1.25rem` gutters and `1.5rem` outer margins. Critical vitals pin to a unified top split card, while detailed AI logs collapse below into segmented tabs.
- **Handheld Companion (<768px):** 4 columns with `1rem` gutters and `1rem` outer margins. Single-column card stacking prioritizing patient identification, active status badges, and emergency intervention triggers.

### Spacing Principles
- Density is balanced to prevent cognitive fatigue. Complex vitals cards group related readings with `space-xs` and `space-sm`, while distinct neonatal pods or monitoring zones maintain `space-lg` to `space-xl` separation.

## Elevation & Depth

Visual hierarchy uses tonal surface layering combined with soft, diffuse, clinical-tinted ambient shadows. Avoid heavy dropshadows or stark skeuomorphic bevels that add visual noise.

### Layering System
- **Level 0 (Canvas):** Medical tint `#F3F7FC`. Serves as the continuous, non-glare foundation.
- **Level 1 (Structural Cards & Modules):** Pure surface `#FFFFFF` bordered by a 1px solid `#DFE7F1` outline, supported by ambient shadow `0 2px 8px -2px rgba(23, 52, 93, 0.04), 0 1px 3px 0 rgba(23, 52, 93, 0.02)`.
- **Level 2 (Hover States, Floating Toolbars, Active Monitor Drawers):** Pure surface `#FFFFFF` with ambient shadow `0 10px 24px -4px rgba(23, 52, 93, 0.06), 0 4px 8px -2px rgba(23, 52, 93, 0.03)`.
- **Level 3 (Diagnostic Dialogs & Alert Flyouts):** Pure surface `#FFFFFF` flanked by a 1px perimeter border and shadow `0 20px 32px -8px rgba(23, 52, 93, 0.12), 0 8px 16px -4px rgba(23, 52, 93, 0.04)`.

### Semantic Depth Treatments
- **AI Assistive Containers:** Subtly infused with an ultra-light tint of AI lavender (`rgba(139, 121, 204, 0.05)`) bordered by `rgba(139, 121, 204, 0.25)`.
- **Critical Alert Overlays:** Crisp 2px perimeter border in `#D94B59` with ambient glow `0 0 16px -2px rgba(217, 75, 89, 0.15)`.

## Shapes

The interface adopts a softened, human-centered geometric language. Corner radii mitigate sterile hospital severity, creating a warm, reassuring environment for clinicians and visiting parents.

### Curvature Standard
- **Cards and Data Tiles:** Scaled between `16px` (`1rem`) and `20px` (`1.25rem`), balancing modern soft geometry with layout structure.
- **Interactive Controls (Buttons, Inputs, Selectors):** Fixed between `12px` (`0.75rem`) and `14px` (`0.875rem`) to ensure comfortable, finger-friendly targets on medical touchscreens.
- **Badges, Tags, and Vitals Status Pills:** Fully rounded capsule/pill shapes (`9999px`) to immediately communicate categorized status without conflicting with rectangular card structures.

## Components

### Buttons
- **Primary Clinical Action:** Background `#245FC7`, text `#FFFFFF`, border-radius `12px`, padding `10px 20px`. Hover state darkens slightly to `#1C4CA3`. Focus state renders a 3px outer ring in `rgba(36, 95, 199, 0.25)`.
- **Secondary Action:** Background `#FFFFFF`, text `#17345D`, border `1px solid #DFE7F1`, radius `12px`. Hover state changes background to `#F3F7FC`.
- **AI Recommendation Action:** Background `rgba(139, 121, 204, 0.12)`, text `#5F4CA8`, border `1px solid rgba(139, 121, 204, 0.25)`. Hover background shifts to `rgba(139, 121, 204, 0.2)`.

### Chips & Vital Status Badges
- **Height & Layout:** 24px–28px height, 10px–14px horizontal padding, full pill radius (`9999px`).
- **Stable / Normal:** Background `rgba(67, 169, 149, 0.12)`, text `#2B7869`, optional leading status dot `#43A995`.
- **Observational / Amber:** Background `rgba(232, 174, 66, 0.14)`, text `#8F6317`, leading status dot `#E8AE42`.
- **Acute / Critical:** Background `rgba(217, 75, 89, 0.12)`, text `#B32635`, leading status dot `#D94B59`.

### Cards & Incubator Pods
- Background `#FFFFFF`, radius `16px` to `20px`, border `1px solid #DFE7F1`.
- Interior layout separates patient identity (top), core vitals grid (middle), and AI trend summaries (bottom) using soft horizontal dividing rules (`#DFE7F1`).

### Form Inputs & Adjusters
- Height `44px` (touch-optimized), background `#FFFFFF`, border `1px solid #DFE7F1`, text `#17345D`, placeholder `#65758B`, radius `12px`.
- Active focus state uses border `#245FC7` with a 3px ring in `rgba(36, 95, 199, 0.15)`.

### Vital Waveform & Gauge Panels
- Background `#FFFFFF`, bordered by `#DFE7F1`.
- Metrics display numbers using `vital-metric-lg` paired with a top-aligned `label-caps` metric tag. Sparklines and ECG/plethysmograph line graphs use 2px stroke weight with smoothed anti-aliased curves.

### AI Insight Cards
- Dedicated surface using `#FFFFFF` with an ambient left-accent stroke (3px) in AI Lavender (`#8B79CC`).
- Subtle background gradient overlay spanning from `rgba(139, 121, 204, 0.04)` to transparent.