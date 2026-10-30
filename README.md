# Apaar Student Verification Hub

Build a polished, production-quality FRONTEND prototype for an AICTE APAAR-based Student Data Management & Verification System. Product name: "APAAR Setu" with subtitle "AICTE Student Data Intelligence Platform". This is a frontend-first demo; use realistic seeded mock data and local client state, do not claim real APAAR validation, government integration, authentication, or backend persistence. Clearly label demo/simulated actions where appropriate.

VISUAL DIRECTION:
- Premium Indian public-sector digital platform, modern SaaS admin dashboard, clean and trustworthy.
- Light warm-neutral background, deep navy/indigo sidebar, crisp white cards, restrained teal/emerald accent, subtle borders/shadows, excellent typography (Inter), generous whitespace, refined data visualizations.
- Responsive desktop-first layout, polished mobile collapse. Avoid generic template look, gradients everywhere, oversized hero blocks, clutter.
- Use lucide icons, shadcn/ui, Recharts. High attention to spacing, hierarchy, hover/focus states, accessibility.

APP SHELL:
- Fixed dark navy left sidebar with APAAR Setu mark, navigation: Overview, Institutions, Student Registry, Data Upload, Verification, Anomaly Centre, Analytics & Reports, API & Integrations, Audit Logs, Settings. Active nav treatment. Bottom signed-in user card "AICTE Admin" / "Central Monitoring".
- Top header with breadcrumb/page title, academic year selector (2025–26), global search, notification bell with badge, help, avatar.
- Main dashboard default page.

OVERVIEW DASHBOARD:
- Welcome header "Good afternoon, Admin" and context "National student identity • AICTE-approved institutions".
- Compact status strip "SYSTEM STATUS Operational" "Last sync 2 min ago" and "AY 2025–26".
- KPI cards: Total Institutions 8,462 (+4.8%), Student Records 2.84M (+12.6%), APAAR Verified 2.61M (91.9%), Validation Issues 12,408 (needs attention). Include trend indicators and small sparklines if polished.
- Main chart: monthly student enrolment submissions Jan–Jun, compare submitted vs verified, with clean tooltip/legend. Another compact donut/stacked visualization for verification status (Verified, Pending, Flagged).
- "Data quality & compliance" progress bars for APAAR linked, institution submissions, intake compliance.
- "Recent activity" timeline with plausible activities (bulk upload, verification, institution onboarding, flagged duplicate).
- "Priority actions" cards for 247 intake breaches, 1,382 missing APAAR IDs, 86 cross-institution matches.
- "Top institutions by enrolment" compact table with institution, state, approved intake, enrolled, utilization, status.
- Use mock values consistently.

FUNCTIONAL NAVIGATION / PAGES:
1. Institutions: searchable/filterable table with institution name, AICTE ID, state, programs, approved intake, enrolled, submission status, last sync. Detail drawer/modal with intake and programme breakdown.
2. Student Registry: searchable student table with masked APAAR ID by default, student ID, name, institution, programme, category, verification status. Filters and view details modal; reveal APAAR only via explicit toggle and demo warning.
3. Data Upload: attractive stepper workflow (Select institution/file → Map fields → Validate → Review & submit). Drag-drop CSV/XLSX area, downloadable sample template button, field mapping preview and simulated validation summary. Allow selecting a sample file/demo dataset and run validation; show duplicate APAAR, missing/invalid APAAR, intake excess, inconsistent data findings. Do not actually upload sensitive data.
4. Verification: verification workbench with search by student ID / APAAR ID, consent/status panel, record provenance, institution, programme, enrollment year, verification timestamp; simulated verification result and clear demo label.
5. Anomaly Centre: issue queue with severity tabs (All, Critical, High, Medium), duplicate across institutions, intake breach, invalid APAAR, missing fields. Show explainable reason, impacted records, institution and recommended action. Buttons can update local state / mark reviewed.
6. Analytics & Reports: filters academic year/state/programme; charts for enrolment trends, category distribution, intake utilization by state; report cards and export CSV button using generated mock data.
7. API & Integrations: integration cards for AICTE Portal, Institution ERP/SIS, APAAR/Academic Bank of Credits (label proposed/sandbox), DigiLocker (proposed), API key panel with masked demo key, webhook event log, docs snippets. Clearly mark integrations as "Concept / Sandbox" not live.
8. Audit Logs: table of actor, action, entity, timestamp, IP (fictional), outcome; filters.
9. Settings: role-based access overview (AICTE Admin, Institution Admin, Verifier, Auditor), consent/privacy controls, session/security settings, retention policy descriptions.

INTERACTIONS:
- All sidebar links switch page views without full reload.
- Search, filters, academic year selector, tabs, dropdowns, modals/drawers, upload stepper, anomaly mark reviewed, CSV export, report filters, notification panel should work with local mock state.
- Use toasts for actions. Avoid dead buttons.
- Create reusable components and typed mock data.
- Add empty/loading states where useful.
- Data privacy: mask APAAR IDs by default, least-privilege UI, consent indicators, audit trail emphasis.
- The app must look complete and coherent on first load. Implement all pages, not just dashboard.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://apaar-student-verification-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3c245265-660a-4cbd-b815-8074199e7d5f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
