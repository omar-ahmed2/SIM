# SIM.AI — Implementation Roles & Development Guidelines

> **Purpose:** Central architectural and engineering standard for the **SIM.AI Incubator Monitor** codebase. This document serves as the mandatory reference for project organization, styling, accessibility, component design, and development conventions agreed upon for ongoing and future iterations.

---

## 1. Project Overview & Primary Direction

- **Project Core:** AI-assisted neonatal incubator monitoring platform (NICU & medical care).
- **Primary Design State:** **Empty States First.** All features (Dashboard, Monitoring, Children Records, Alerts, Rooms & Beds, Medications, Reports, Settings) are developed prioritizing the initial setup and clean first-time user experience without fabricated data or unnecessary mock stores.
- **Tech Stack:**
  - **Framework:** React 19 + TypeScript
  - **Bundler:** Vite
  - **Styling Engine:** Tailwind CSS v4 (`@tailwindcss/vite`)
  - **Icons:** Google Material Symbols Outlined

---

## 2. Folder Structure & Senior Architecture Standard

The project follows a clean, direct, and modular `pages` & `components` structure:

```
src/
├── assets/                          # Static assets and images
├── components/                      # All UI components
│   ├── ui/                          # Reusable atomic design system primitives
│   │   ├── Button.tsx               # Polymorphic button (variants, sizes, loading states)
│   │   ├── Badge.tsx                # Status pills with optional pulsing clinical dots
│   │   ├── Icon.tsx                 # Material Symbols Outlined wrapper with aria-hidden
│   │   └── ...                      # Inputs, Modals, Cards, Skeletons
│   │
│   ├── landing/                     # Modular sections for the Public Landing Page
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── TelemetryHUD.tsx
│   │   ├── ClinicalImpactSection.tsx
│   │   ├── QuadTelemetryBento.tsx
│   │   ├── OnboardingStepsSection.tsx
│   │   ├── CaregiverTestimonialSection.tsx
│   │   ├── PrivacySafeguardsSection.tsx
│   │   ├── FaqSection.tsx
│   │   ├── CtaBannerSection.tsx
│   │   ├── VideoModal.tsx
│   │   └── Footer.tsx
│   │
│   ├── dashboard/                   # Dashboard sections & empty state widgets
│   ├── monitoring/                  # Live camera feeds & empty camera state
│   ├── children/                    # Newborn directory, empty list & registration forms
│   ├── alerts/                      # Clinical alerts triage & nominal state
│   ├── rooms/                       # Rooms, beds & incubator assignment components
│   ├── medications/                 # Prescription schedule & administration hub
│   └── reports/                     # Report preview & export configuration
│
├── pages/                           # Full-page compositions and route views
│   ├── LandingPage.tsx
│   ├── DashboardPage.tsx
│   ├── LiveMonitoringPage.tsx
│   ├── ChildrenPage.tsx
│   ├── AlertsPage.tsx
│   ├── RoomsBedsPage.tsx
│   ├── MedicationsPage.tsx
│   ├── ReportsPage.tsx
│   └── SettingsPage.tsx
│
├── types/                           # Shared TypeScript interfaces & types
├── index.css                        # Tailwind v4 @theme and global resets
├── App.tsx                          # Root application component
└── main.tsx                         # Entrypoint
```

### Architecture Invariants:
1. **Pages stay lean:** Page files in `src/pages/` orchestrate sections and state, while UI presentation lives in dedicated sub-folders under `src/components/<feature>/`.
2. **Atomic UI in `src/components/ui/`:** Reusable components (`Button`, `Badge`, `Icon`, `Input`) must reside in `src/components/ui/` and must not have business logic tied to any specific screen.
3. **No Over-Engineering:** Do not create separate mock `data/` abstractions when building empty states; keep components direct, clean, and self-contained.

---

## 2.1 Component & Page Implementation Rules

### A. Page Responsibilities

- Every file inside `src/pages/` must represent a complete route-level screen.
- Pages are responsible for composing feature components, defining the page-level layout, and coordinating page-specific state and interactions.
- Pages must remain composition-focused. They must not become monolithic files containing the entire UI, all form fields, every table row, every modal, and all feature logic.
- A page should import and compose components from its corresponding feature directory under `src/components/<feature>/`.
- Pages may contain simple, page-specific JSX, conditional rendering, and lightweight state when extracting them would add unnecessary complexity.
- Move substantial or independently meaningful UI sections into dedicated components.
- Do not create additional page files for individual sections, cards, dialogs, tabs, or other elements that are part of the same route.
- Keep route configuration in `App.tsx` or the existing routing layer rather than embedding route definitions inside page components.

### B. Feature Component Responsibilities

- All feature-specific UI must live under its corresponding directory in `src/components/`.
- Examples:
  - `components/dashboard/`: dashboard sections, overview cards, and dashboard-specific empty states.
  - `components/monitoring/`: camera feeds, monitoring panels, telemetry displays, and camera connection states.
  - `components/children/`: newborn profiles, registration forms, clinical information sections, and children tables.
  - `components/alerts/`: alert lists, alert details, filtering controls, and triage interfaces.
  - `components/rooms/`: room management, bed assignments, and incubator-related UI.
  - `components/medications/`: medication forms, schedules, and administration interfaces.
  - `components/reports/`: report configuration, previews, and export controls.
  - `components/landing/`: public landing page sections.
- Keep feature components independent of unrelated pages.
- Feature components may contain feature-specific presentation and interaction logic, but must not become responsible for unrelated features.
- Keep reusable subcomponents inside their owning feature directory when they are specific to that feature.
- Promote a component to `components/ui/` or another shared location only when its responsibility is genuinely reusable and independent of a particular feature.

### C. Shared UI Components

- `src/components/ui/` is reserved for generic, reusable interface primitives and design-system components.
- Examples include `Button`, `Input`, `Select`, `Badge`, `Modal`, `Tooltip`, `Skeleton`, and `Icon`.
- Shared UI components must not import pages, feature-specific components, or feature-specific services.
- Generic components must not contain clinical business rules, newborn-specific assumptions, medication workflows, or dashboard-specific behavior.
- Configure visual variants, sizes, disabled states, and other supported behavior through explicit props.
- Keep shared UI components consistent with the existing design tokens and Tailwind CSS v4 conventions.
- Do not duplicate a shared component inside a feature just to customize its appearance. Extend it through props or create a feature-specific wrapper when appropriate.
- Do not promote every small JSX fragment into the global UI library.

### D. Component Extraction Rules

Before extracting JSX into a new component, determine whether it has a meaningful independent responsibility.

Extract a component when one or more of the following apply:

1. It represents a substantial, identifiable section of the interface.
2. It is reused in multiple locations.
3. It has its own meaningful interaction or state management.
4. It has sufficiently complex rendering logic that extracting it improves readability.
5. It can be tested or maintained independently.
6. It belongs to a clearly identifiable feature domain.

Keep JSX inline when it is small, straightforward, used once, and does not obscure the page's structure.

Do not create components solely to reduce line count or to wrap a single trivial element.

### E. State, Hooks, and Business Logic

- Keep temporary UI state close to the component that owns the interaction.
- Keep page-level state in the page when it coordinates multiple components on that page.
- Extract reusable or complex stateful behavior into custom hooks when doing so improves clarity or reuse.
- Do not create custom hooks for trivial logic that is clearer inline.
- Keep API communication in dedicated service modules when the feature requires it.
- Keep business rules separate from presentation when they are complex, reusable, or independently testable.
- Do not introduce additional state-management libraries without a demonstrated need.
- Avoid unnecessary prop drilling, duplicated state, and synchronization effects that can be replaced with derived values.

### F. Feature-Specific File Organization

The existing `src/components/<feature>/` architecture must remain the default.

For complex features, nested directories and additional modules may be introduced when justified.

Example:

`src/components/children/`
- `ChildrenTable.tsx`
- `ChildrenFilters.tsx`
- `NewbornForm.tsx`
- `NewbornProfileHeader.tsx`
- `NewbornClinicalDetails.tsx`
- `hooks/`
- `services/`
- `types/`

Do not create all these files or directories in advance. Introduce only the modules required by the actual implementation.

Shared TypeScript types may remain in `src/types/`. Feature-specific types may be colocated with their feature when they are not shared across the application.

### G. Page Composition Example

A page should communicate the overall structure of the screen clearly.

Preferred:

```tsx
import DashboardOverview from "../components/dashboard/DashboardOverview";
import DashboardEmptyState from "../components/dashboard/DashboardEmptyState";

export default function DashboardPage() {
  const hasConfiguredFacility = false;

  return (
    <main className="min-w-0">
      <header>
        <h1>Dashboard</h1>
      </header>

      {hasConfiguredFacility ? (
        <DashboardOverview />
      ) : (
        <DashboardEmptyState />
      )}
    </main>
  );
}
```

This snippet illustrates component composition only. Do not hardcode configuration flags or introduce fake application state in production. Connect the page to the actual configuration or data source when implementing the real feature.

Avoid placing the complete dashboard interface, every dashboard card, all charts, and all interaction handlers in `DashboardPage.tsx`.

### H. Component Size and Complexity

- Keep individual component files focused and target 250 lines or fewer, consistent with the existing project guidelines.
- The 250-line target is a maintainability guideline, not a reason to split cohesive code artificially.
- If a file exceeds this target, inspect its responsibilities and extract meaningful sections, hooks, or utilities where appropriate.
- A file below 250 lines can still require refactoring if it contains unrelated responsibilities or excessive complexity.
- Never split a component into multiple files if doing so makes dependencies, state ownership, or the overall implementation harder to understand.

### I. Empty States and Real Data

- Follow the project's Empty States First principle.
- Pages and feature components must not fabricate production data to make the interface appear populated.
- Keep empty states in the appropriate feature directory.
- Empty states must use the same page shell and design system as their populated counterparts.
- Keep empty-state UI separate from populated-state UI when the two represent meaningfully different interface structures.
- Do not create mock data stores, fake API services, or sample clinical records unless explicitly requested for a documented development or testing purpose.
- Use actual application state to determine whether to render loading, empty, populated, or error states.
- Never display fabricated physiological readings, clinical alerts, newborn records, medication administrations, or monitoring telemetry as real information.

### J. Mandatory Implementation Checklist

Before completing any page or feature, verify:

1. The page composes feature components rather than containing an oversized monolithic implementation.
2. Every extracted component has a clear responsibility.
3. Feature-specific components remain in their correct feature directory.
4. Generic UI components remain independent of feature-specific business logic.
5. State and API communication are owned by the appropriate layer.
6. No unnecessary files, wrappers, abstractions, or dependencies were introduced.
7. Empty, loading, error, and populated states are handled where applicable.
8. Existing design tokens, accessibility rules, TypeScript strictness, and project conventions are preserved.
9. The implementation passes the available linting, type-checking, and relevant tests.

The goal is not to maximize the number of components. The goal is to maintain a clear separation between route-level composition, feature-specific UI, shared design-system primitives, and application logic.


## 3. Styling & Design System Rules (Tailwind CSS v4)

All styling must adhere to the design tokens defined in `DESIGN.md` and configured in `src/index.css`:

### 3.1 Color Palette Tokens

| Semantic Token | Hex Code | Intended Usage |
|---|---|---|
| `--color-surface` | `#F9F9FF` | Main non-glare clinical background |
| `--color-surface-container-lowest` | `#FFFFFF` | Cards, forms, modal surfaces |
| `--color-surface-container` | `#E8EEFF` | Secondary modules, active states |
| `--color-on-surface` | `#001B3D` | Primary text and headings |
| `--color-on-surface-variant` | `#424653` | Secondary text, captions, metadata |
| `--color-primary` | `#0047A6` | Primary clinical blue (main actions) |
| `--color-primary-container` | `#245FC7` | Prominent buttons, navigation indicators |
| `--color-secondary` | `#6352A2` | AI Lavender (predictive telemetry, insights) |
| `--color-secondary-container` | `#BAA7FE` | AI accent backgrounds |
| `--color-tertiary` | `#00564A` | Care Teal (stable physiological states, baselines) |
| `--color-tertiary-fixed` | `#91F4DE` | Safe baseline badges |
| `--color-warning` | `#E8AE42` | Attention required, sensor drifting |
| `--color-error` | `#BA1A1A` | Critical acute alert, physiological emergencies |
| `--color-outline-variant` | `#C3C6D5` | Structural borders, subtle dividers |

### 3.2 Typography Standards
- **Titles & Headings:** `font-display` (`Plus Jakarta Sans`) with weights `600`, `700`, `800`.
- **Body & Clinical Tables:** `font-sans` (`Inter`) with weights `400`, `500`, `600`.
- **Tabular Figures (`tabular-nums`):** Mandatory for all numeric telemetry readings (Heart Rate, SpO2, Temperature, Respiratory Rate) to ensure digits do not jump or cause layout shifting when fluctuating.

### 3.3 Radii & Touch Targets
- **Controls (Buttons, Inputs):** `12px` to `14px` (`rounded-xl`).
- **Cards & Data Modules:** `16px` to `20px` (`rounded-2xl` to `rounded-3xl`).
- **Pills & Badges:** Full capsule radius (`rounded-full` / `9999px`).
- **Touch Target Size:** Interactive targets must have a minimum clickable area of `44px` (ideal `48px–56px` for clinical glove usage).

### 3.4 Legacy CSS Cleanup
- The default `App.css` is completely cleared and deprecated.
- All styles are authored using utility classes and the Tailwind v4 `@theme` block in `src/index.css`.

---

## 4. Accessibility (WCAG 2.2 AA) Rules

1. **Color Contrast:** Foreground text combinations must maintain a minimum contrast ratio of `4.5:1` for regular text and `3:1` for large text.
2. **Never Color Alone:** Never communicate clinical alert status through color alone; always pair colors with explicit text labels and recognizable icons.
3. **Keyboard Accessibility & Focus:**
   - All interactive elements must be focusable via `Tab`.
   - Clear, visible focus indicators: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`.
4. **ARIA Standards:**
   - Modals and drawers must include `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and support dismissal via the `Escape` key.
   - Accordions and dropdowns must explicitly set `aria-expanded` and `aria-controls`.
   - Decorative icons must include `aria-hidden="true"`.
5. **Reduced Motion:** Interactive transitions and pulse animations must respect accessibility preferences.

---

## 5. SEO & Semantic HTML Rules

1. **Heading Hierarchy:**
   - Exactly **one `<h1>`** per page (located in the hero/primary header).
   - Strict hierarchical order: `<h1>` $\rightarrow$ `<h2>` $\rightarrow$ `<h3>` $\rightarrow$ `<h4>`.
2. **Semantic Elements:**
   - Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>` rather than generic `<div>` wrappers.
3. **Meaningful Media Attributes:**
   - All images must contain descriptive, accessible `alt` text.
   - Clinical diagrams and waveforms must provide fallback descriptions or labels.

---

## 6. Empty State Design Guidelines

When developing each upcoming feature/screen:
1. **Consistent Shell:** The empty state must share the exact same outer layout, navigation, and header as the populated system.
2. **No Fictional Metrics:** Do not render fake zero metrics or empty charts that mimic activity.
3. **Clear Next Action:** Always provide a clear explanation of why data is absent, a supportive clinical icon, and **one prominent primary action** (e.g., `Register Newborn`, `Add Room`, `Connect Camera`).
4. **Setup Guidance:** Include step-by-step onboarding checklists for first-time facility configurations.

---

## 7. Code Quality & Senior Practices

- **TypeScript Strictness:** Full type definitions; strictly avoid `any`.
- **Event Cleanup:** Always clean up event listeners (`window.addEventListener`) inside `useEffect` return functions.
- **Micro-interactions:** Keep transitions smooth and fast (`duration-200` to `duration-300`).
- **Modularity:** Individual component files should stay focused ($\le 250$ lines). If a component grows too large, extract its sub-modules logically.
