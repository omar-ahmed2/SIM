# Incubator Monitor — Project Reference Documentation

> **Purpose:** Central reference for the product idea, UI/UX direction, primary pages, workflows, empty/populated states, and design principles agreed so far.
>
> **Product name:** Incubator Monitor  
> **Primary context:** Neonatal Intensive Care Units (NICU) and medical incubator monitoring  
> **Status:** UI/UX design planning. This document describes the intended product direction, not a completed or clinically validated system.

## 1. Product Overview

**Incubator Monitor** is an AI-assisted neonatal incubator monitoring platform primarily intended for medical units caring for newborns, especially neonatal intensive care units (NICUs).

The product experience brings together:
- Monitoring views for connected cameras.
- Newborn records and relevant medical information.
- Rooms, beds, and incubator assignments.
- Alerts and review workflows.
- Medication schedules and administration records.
- Individual and facility-level reports.
- Facility, account, camera, and access settings.

The system should help authorized healthcare staff navigate information quickly and maintain a clear view of monitoring activity. AI-generated observations must be distinguished from documented clinical facts and must not be presented as confirmed diagnoses.

### Primary audience
Potential users include doctors, nurses, facility or unit administrators, and other authorized clinical staff. Exact role permissions and operational policies still need to be specified with the project team and clinical stakeholders.

### Future expansion
The platform may later support general nurseries or childcare facilities. However, **the primary focus is neonatal medical care and incubator monitoring**. A future childcare mode should use workflows and fields appropriate to that setting rather than mixing general childcare and NICU-specific clinical workflows.

## 2. Product Vision and Design Principles

### Vision
Create a modern, calm, human-centered neonatal monitoring experience that combines the warmth of compassionate care with the clarity and precision needed in a clinical environment.

### Core principles
1. **Human-centered:** Use reassuring visual language and selective, appropriate imagery of newborns and neonatal care.
2. **Clinically clear:** Make information hierarchy, labels, timestamps, and statuses easy to understand.
3. **Simple to navigate:** Avoid unnecessary pages, controls, nested cards, and complicated workflows.
4. **Consistent:** Use the same design system, navigation patterns, spacing, and component behavior throughout.
5. **Implementation-friendly:** Design screens using reusable components and predictable layouts.
6. **Accessible:** Do not rely on color alone to convey meaning; support readable contrast, keyboard focus, labels, and clear feedback.
7. **Performance-conscious:** Avoid oversized decorative assets, excessive animation, and unnecessarily complex UI effects.
8. **Privacy-aware:** Newborn, guardian, medical, and camera information should only be available to authorized users.
9. **AI-transparent:** Distinguish AI-generated observations from staff-entered notes, recorded events, and confirmed clinical information.

## 3. Brand and Visual Identity

### Product name
**Incubator Monitor**

### Suggested tagline
**Smarter Monitoring. Healthier Tomorrows.**

### Design direction
The agreed direction is **Calm Medical SaaS + Humanized Healthcare**.

The design should feel calm, reassuring, compassionate, professional, clinically organized, modern, and premium without being visually noisy. It should be technology-enabled without looking overly futuristic, and easy to scan during busy clinical work.

### Color palette

| Token | Hex | Intended use |
|---|---|---|
| Primary clinical blue | `#245FC7` | Primary actions, active navigation, key interactive elements |
| Light medical background | `#F3F7FC` | Main application background |
| White surface | `#FFFFFF` | Cards, forms, panels |
| AI lavender | `#8B79CC` | AI-related accents and highlights |
| Care teal | `#43A995` | Stable or successful states where appropriate |
| Attention amber | `#E8AE42` | Attention-required states |
| Critical red | `#D94B59` | Critical alerts and high-risk states |
| Main text | `#17345D` | Headings and primary text |
| Secondary text | `#65758B` | Supporting text and metadata |
| Border | `#DFE7F1` | Dividers, outlines, card borders |

**Color semantics**
- Blue: primary interaction and navigation.
- Lavender: AI-related UI accent.
- Teal: stable/successful state where appropriate.
- Amber: attention required.
- Red: critical alert or clearly identified high-risk action.

Do not communicate severity through color alone. Pair colors with text labels and recognizable icons.

### Typography and components
- Preferred typeface: Inter or Plus Jakarta Sans.
- Use a clear hierarchy for titles, headings, body text, labels, helper text, and tables.
- Use a spacing scale based primarily on 8px increments.
- Suggested control radius: 12–16px.
- Suggested card radius: 16–20px.
- Use subtle shadows and restrained borders.
- Use gradients sparingly, mainly for the landing-page hero, selected brand moments, and limited AI highlights.
- Keep most clinical cards and forms on solid, high-contrast surfaces.
- Use one consistent outline icon family.

### Photography
Use relevant neonatal photography selectively on the landing page, authentication supporting visuals, and appropriate newborn-profile areas when permitted and useful. Avoid decorative photos in dense tables or places where they distract from clinical information. Newborn and guardian photographs should not be mandatory by default.

## 4. Information Architecture — Nine Primary Page Groups

The product is organized around nine primary page groups. Each group may contain multiple subpages, forms, detail views, and states.

### 4.1 Landing Page
A public-facing marketing page introducing Incubator Monitor.

Core sections:
- Top navigation with logo and product name on the left.
- Landing-page section links in the center.
- Sign In and Get Started on the right.
- Hero section with a concise headline, supporting text, primary CTA, secondary demo CTA, and appropriate neonatal imagery.
- Product preview.
- Core feature overview.
- How it works.
- Privacy, security, and responsible AI messaging.
- FAQ.
- Final CTA and footer.

Keep the page concise, accessible, and responsive. The public site must be separate from authenticated medical records.

### 4.2 Authentication & Onboarding
Required screens: Sign In, Create Account, Forgot Password, Initial Onboarding, and Facility Setup.

**Sign In**
- Email.
- Password.
- Optional Remember Me.
- Forgot Password.
- Sign In.
- Continue with Google.
- Link to Create Account.

**Create Account**
- Full name.
- Email address.
- Password.
- Confirm password only if needed.
- Professional role, e.g. Doctor, Nurse, or Administrator.
- Hospital/facility name, with a clear option to select an existing facility or register one if supported.
- Terms and privacy consent.

Keep registration short. Ask only for essential account and facility information. Do not request newborn medical information during account creation.

**Initial onboarding**
- Add the first room.
- Configure bed/incubator capacity.
- Connect cameras now or skip for later.
- Register the first newborn or finish setup later.

Do not force every configuration step to be completed before the user can access the application.

### 4.3 Dashboard / Overview
The dashboard is the main overview screen after sign-in. It should summarize important information without duplicating every other page.

Suggested sections:
- Welcome header and facility/unit name.
- Current date/time where useful.
- System connectivity summary.
- Summary cards for registered newborns, occupied incubators/capacity, active alerts, and upcoming medication doses.
- Readable time-series chart for alert or recorded-event activity.
- Compact distribution chart for monitoring statuses.
- Recent alerts list.
- Small live-camera preview.
- Quick actions: register newborn, add room/incubator, connect camera, view reports.

Keep the dashboard to a limited number of meaningful sections and avoid excessive decorative cards.

**Empty dashboard**
- No fabricated metrics or medical activity.
- Welcome message.
- Explanation that the facility is not yet configured.
- Short setup checklist: Add Room, Register Newborn, Connect Camera.
- Empty chart states with a short explanation.
- No active-alert banner unless an actual alert exists.

**Populated dashboard**
- Illustrative sample data for design demonstration only.
- Clear labels, timestamps, chart legends, statuses, and navigation to relevant records.
- Sample mockup data must never be mistaken for real patient data.

### 4.4 Live Monitoring
Purpose: display connected camera feeds and their monitoring context.

**Empty state**
- No connected cameras.
- Clear explanation.
- Connect Camera CTA.
- Optional setup guidance.

**Populated state**
- Responsive camera grid and grid-density controls where useful.
- Room and incubator labels.
- Linked newborn identity where authorized.
- Live, offline, or connecting status.
- AI-processing availability.
- Filters by room, camera status, and monitoring state.
- Search.
- Focused single-camera view.
- Compact camera details panel.
- Navigation to the associated newborn profile.

Clearly distinguish:
1. Camera connection status.
2. Video-stream status.
3. AI-processing status.
4. Clinical alert status.

A disconnected camera is not automatically a medical emergency. A connected camera does not prove that AI processing is working. Use demonstration imagery only when clearly labeled as sample content; never present a static image as a genuine live feed.

### 4.5 Children / Newborn Records
This group contains the newborn list, registration workflow, and individual newborn profile.

**Empty list**
- No patient cards or fabricated newborn records.
- Clear explanation.
- Register Newborn CTA.

**Populated list**
- Search by newborn ID or authorized name.
- Filters by room, incubator, and relevant status.
- Readable table or responsive cards.
- Clear links to individual profiles.

**Newborn registration form**

Organize fields into short, logical sections.

Basic information:
- Medical record ID or system-generated identifier.
- Newborn name or approved identifier.
- Date and time of birth.
- Sex, if clinically required.
- Gestational age at birth.
- Birth weight and units.
- Relevant admission information.

Clinical information:
- Documented conditions.
- Allergies.
- Relevant clinical notes.
- Responsible clinical professional where appropriate.

Placement:
- Unit.
- Room.
- Incubator or bed.

Parent/guardian information:
- Parent or guardian name.
- Relationship to newborn.
- Contact information.
- Additional authorized contact if appropriate.

Medication schedules should be managed in the medication workflow and linked to the newborn record rather than duplicated as an unstructured form field.

Forms need explicit labels, visible required-field indicators, helpful validation, and clear Save and Cancel actions. Photographs should be optional unless a later requirement establishes otherwise.

**Newborn profile**

Use a clear profile header and internal tabs:
- Overview.
- Medical History.
- Medications.
- Parents & Contacts.
- Reports.
- Timeline.

The profile may contain newborn identity and age, birth information and gestational age, current placement, documented conditions and allergies, relevant weight measurements with dates, medication records, guardian contacts, and historical events and reports.

Keep the page organized and avoid showing every field at once. Provide empty states for profile sections without records. Clearly separate clinical facts, staff notes, and AI-generated observations.

### 4.6 Alerts + Rooms & Beds

#### Alerts Center
Create an empty alerts page, populated alerts table, alert detail drawer/page, and reviewed/resolved state.

Empty state:
- No fabricated alerts.
- Short explanation that alerts appear when events are received.

Populated state:
- Severity.
- Event type.
- Timestamp.
- Newborn or incubator.
- Room.
- Review status.
- Acknowledging or assigned staff member where applicable.

Include search and practical filters. Alert details may include an event clip when available, contextual information, an AI-generated explanation, and a review timeline.

Possible actions, subject to role permissions: Acknowledge, Review, Escalate, and Mark as False Positive.

AI-generated output must not be presented as an automatically confirmed medical diagnosis.

#### Rooms & Beds
Create an empty room list, Add Room form, Add Incubator/Bed form, populated room overview, and room details with incubators and assignments.

Empty state:
- No configured rooms.
- Add Room CTA.
- Optional setup guidance.

Populated state:
- Room name or identifier.
- Capacity.
- Occupied and available beds.
- Linked incubators.
- Camera connection indicators.
- Assigned newborns, when present and authorized.

Keep room management straightforward. Do not design an unnecessarily complex hospital floor-plan editor.

### 4.7 Reports
Create an empty reports page, populated reports page, report configuration form, and report preview.

Report types:
- Individual newborn report.
- Incubator/bed report.
- Room report.
- Facility-level summary report.

The report form should support report type, date range, newborn or location where relevant, and applicable event categories.

Empty state:
- Explain that reports become available after records or events are collected.
- Do not fabricate report history.

Populated state:
- Summary statistics.
- Labeled trend charts.
- Recorded-event timeline.
- Medication administration records where appropriate.
- Report generation date and selected period.
- Print/export actions.

Reports should be readable on screen and in print/PDF form. Clearly identify the source and period of information, and distinguish AI-generated observations from confirmed clinical conclusions.

### 4.8 Medications
Create an empty medication schedule, Add Medication form, populated schedule, and medication history.

Empty state:
- No medication schedules.
- Clear next step to create a medication record or open a newborn profile.

Populated state:
- Linked newborn identifier.
- Medication name.
- Prescribed dose and units.
- Scheduled time.
- Administration status.
- Authorized staff member and timestamp when recorded.

The form should capture medication details documented in the approved prescription, frequency, schedule, relevant instructions, and linked newborn.

Show allergy information and relevant warnings when available. Include a confirmation step before recording a dose as administered.

Distinguish scheduled, administered, delayed, missed, and cancelled states. This is a medication-recording interface, not an autonomous prescribing tool. Do not invent recommended neonatal doses or treatment decisions.

### 4.9 Settings & Administration
Use a clean settings layout with simple internal navigation or tabs.

Include:
- Facility information.
- User profile.
- Team and roles.
- Permissions.
- Shortcuts to rooms/incubator configuration.
- Camera management.
- Notifications.
- Language and theme.
- Privacy and security.
- Audit history where appropriate.

Create initial and populated settings examples.

Camera management should include a blank Add Camera form, configured-camera list, clear connection status, and safe handling of stream credentials. Never expose camera passwords or secrets in visible UI or logs. Keep settings grouped logically rather than creating too many top-level navigation items.

## 5. Empty States, Populated States, and Forms

This is a core product-design requirement.

### Empty / First-Time State
Show how the page looks when a newly registered facility has no relevant data, such as no newborns, cameras, alerts, medication schedules, reports, rooms, or incubators.

An empty state should include:
- The same page shell and navigation as the populated page.
- A concise explanation.
- A relevant simple illustration or icon.
- One clear primary action.
- Optional secondary guidance.

Do not fill empty screens with fake metrics, fictional records, or decorative tables.

### Populated State
Show the same page with illustrative sample data, realistic hierarchy, readable tables, charts, filters, statuses, and useful actions. Clearly label sample data as illustrative in design documentation.

### Creation and editing workflows
For important workflows, design:
1. Empty list page.
2. Blank creation form.
3. Validation/error state where useful.
4. Completed form or saved-record state.
5. Resulting populated list or detail view.

Empty and populated versions should use the same components, tokens, and layout. Only the data and relevant actions should change.

## 6. Global Navigation

**Public website**
- Logo and product name on the left.
- Landing-page section links in the center.
- Sign In and Get Started on the right.
- Responsive mobile menu.

**Authenticated application**

Primary navigation:
1. Dashboard.
2. Live Monitoring.
3. Children.
4. Alerts.
5. Rooms & Beds.
6. Medications.
7. Reports.
8. Settings.

Use a compact persistent sidebar on desktop, a clean top utility bar, and simplified mobile bottom navigation. The top bar may contain contextual search, notifications, theme/language controls, and the user profile menu.

Do not create a separate application shell for every page.

## 7. Reusable Design System

Create reusable designs for:
- Primary, secondary, and destructive buttons.
- Text and password inputs.
- Selects and search fields.
- Date/time controls.
- Labels and helper text.
- Validation and error messages.
- Status badges.
- Summary cards.
- Empty-state panels.
- Tables and responsive data lists.
- Tabs and filters.
- Modals and drawers.
- Toast notifications.
- Confirmation dialogs.
- Loading skeletons.
- Chart containers.
- Pagination where needed.
- Breadcrumbs where useful.
- File-upload controls.
- Camera tiles.
- Newborn identity headers.
- Alert summaries.

Provide examples of default, hover, focus, disabled, loading, success, warning, and error states where applicable. Avoid inventing unique styling for every screen. Components should be reusable in a React/TypeScript implementation.

## 8. Accessibility

Design with WCAG 2.2 AA principles in mind:
- Sufficient contrast for text and controls.
- No color-only status communication.
- Visible keyboard focus.
- Descriptive labels for all inputs.
- Validation messages associated with relevant fields.
- Clear button labels, avoiding icon-only controls where possible.
- Adequate interactive target sizes.
- Readable table and chart text.
- Chart legends and textual summaries.
- Respect for reduced-motion preferences.
- Logical heading hierarchy.
- Understandable loading, empty, and error states.

## 9. Responsive Design

Design concepts for:
- Desktop: approximately 1440px.
- Tablet: approximately 768px.
- Mobile: approximately 390px.

Desktop: compact sidebar, top utility bar, balanced content grid.

Mobile: simplified navigation, readable cards or carefully handled data tables, logically stacked dashboard modules, forms without horizontal scrolling, and usable camera-viewing controls.

Do not simply shrink the desktop design.

## 10. SEO, Performance, and Implementation Principles

This document defines UI/UX requirements, not a complete technical architecture.

### SEO
- Use a clear semantic heading hierarchy on the public landing page.
- Design meaningful page titles and concise section content.
- Keep the public website distinct from authenticated medical records.
- Do not assume protected clinical pages should be publicly indexed.

### Performance
- Avoid oversized decorative imagery.
- Use a limited, consistent asset set.
- Reserve image dimensions to reduce layout shifts.
- Keep animation subtle and optional.
- Avoid excessive overlays and complex visual effects.

### Implementation readiness
- Use a consistent grid and spacing system.
- Keep forms predictable.
- Reuse components.
- Use one consistent icon family.
- Prefer standard accessible UI patterns.
- Keep charts simple and readable.
- Make the design practical to implement with React, TypeScript, Tailwind CSS, and standard UI components.

## 11. Privacy, Security, and Clinical Responsibility

Because the platform concerns newborns and medical information:
- Only authorized users should see newborn, guardian, medical, and camera information.
- Newborn and guardian photographs should not be mandatory by default.
- Use illustrative data in mockups.
- Distinguish AI observations from staff notes and documented clinical facts.
- Do not present AI predictions as confirmed diagnoses.
- Do not imply that video alone can reliably detect every medical emergency.
- Medication workflows must reflect approved prescriptions rather than generate autonomous dosing decisions.
- Camera credentials must never be exposed in the interface.
- Role-based access, consent, auditability, and data-retention requirements must be clarified before production use.

The UI design does not itself establish clinical validity, regulatory compliance, or operational readiness.

## 12. Suggested Design Deliverable Structure

Organize the design project into clearly named groups:
1. Landing Page.
2. Authentication & Onboarding.
3. Dashboard — Empty and Populated.
4. Live Monitoring — Empty and Populated.
5. Children — Empty, Registration Form, Populated List, and Newborn Profile.
6. Alerts — Empty, Populated, and Detail.
7. Rooms & Beds — Empty, Creation Forms, and Populated Overview.
8. Reports — Empty, Configuration, and Preview.
9. Medications — Empty, Creation Form, and Populated Schedule.
10. Settings — Initial and Populated.
11. Shared Components and Design Tokens.
12. Responsive and Dark-Mode Examples.

The nine primary page groups are the core of the system. Additional frames represent essential subpages, workflows, and states.

Do not return only a landing page or a single dashboard. Cover the full platform and its important empty/populated states.

## 13. Decisions and Open Questions

### Decisions agreed so far
- Product working name: Incubator Monitor.
- Primary focus: neonatal medical incubators and NICU workflows.
- Potential future expansion: general nurseries/childcare, with a distinct workflow where needed.
- Design direction: Calm Medical SaaS + Humanized Healthcare.
- Main palette: clinical blue, light medical background, white, AI lavender, care teal, attention amber, and critical red.
- Main navigation includes Dashboard, Live Monitoring, Children, Alerts, Rooms & Beds, Medications, Reports, and Settings.
- Public landing page is the first entry point.
- Registration should be simple and request only essential account/facility information.
- Every primary page needs empty and populated design states.
- Important creation flows need blank forms and resulting populated views.
- Design should support SEO for public pages, accessibility, performance, and straightforward frontend implementation.
- Current task scope is UI/UX design and documentation, not backend implementation.

### Open questions to resolve before production implementation
- Exact user roles and permissions.
- Which camera hardware and stream protocols will be supported.
- Which events the AI can detect and how detections will be validated.
- Which clinical measurements and medical fields are required.
- Which integrations or clinical data sources will be used.
- Facility onboarding and invitation policies.
- Data retention, consent, audit, and regulatory requirements.
- Whether the future general-childcare mode will be part of the same product or a separate configuration.

Do not silently assume these details are finalized.

## 14. Recommended Design Order

1. Establish shared design tokens and the application shell.
2. Design the landing page and authentication screens.
3. Design the dashboard in empty and populated states.
4. Design Children, the registration form, and newborn profile.
5. Design Live Monitoring and Alerts.
6. Design Rooms & Beds.
7. Design Reports and Medications.
8. Design Settings and camera management.
9. Review mobile layouts, accessibility, loading/error states, and visual consistency.

The dashboard, Children list, and newborn profile are useful early validation screens because they test whether the visual identity remains practical with dense clinical information.

---

**End of reference document.**
