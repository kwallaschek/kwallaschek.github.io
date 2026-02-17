# Roadmap: Portfolio Website

## Overview

Two-phase cleanup: strip all theme infrastructure from the portfolio, then verify the result. The site already has the right design (minimalist); this milestone removes everything that was added for theme switching and leaves a clean, single-theme static site.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Simplify** - Remove all theme infrastructure from the codebase (completed 2026-02-17)
- [ ] **Phase 2: Verify** - Confirm the site works correctly after simplification

## Phase Details

### Phase 1: Simplify
**Goal**: The codebase has no theme infrastructure — no switcher UI, no switching logic, no alternative theme files, one stylesheet
**Depends on**: Nothing (first phase)
**Requirements**: THRM-01, THRM-02, THRM-03, THRM-04, FLCL-01, FLCL-02, FLCL-03
**Success Criteria** (what must be TRUE):
  1. The navigation bar contains no theme switcher element
  2. script.js contains no theme-switching functions or localStorage theme logic
  3. Only Inter is loaded from Google Fonts (Share Tech Mono, Poppins, JetBrains Mono are gone)
  4. index.html links to style-minimalist.css as its sole stylesheet
  5. The repository contains no alternative CSS or HTML theme files
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md — Strip theme switcher UI, font refs, and switching logic from index.html and script.js
- [ ] 01-02-PLAN.md — Delete alternative theme CSS and HTML files

### Phase 2: Verify
**Goal**: The portfolio is fully functional with the minimalist theme and no regressions from the cleanup
**Depends on**: Phase 1
**Requirements**: VERF-01, VERF-02, VERF-03, VERF-04
**Success Criteria** (what must be TRUE):
  1. The site loads and displays with the minimalist theme (no broken styles, no console errors)
  2. Tab navigation between About, Resume, and Portfolio works correctly
  3. Portfolio project filtering works correctly (clicking filter buttons shows/hides items)
  4. The site is usable and correctly laid out on a mobile viewport
**Plans**: 1 plan

Plans:
- [ ] 02-01-PLAN.md — Automated and visual verification of site functionality (navigation, filtering, mobile layout)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Simplify | 0/2 | Complete    | 2026-02-17 |
| 2. Verify | 0/1 | Not started | - |

### Phase 3: Also remove the portfolio tab with all relevant code and assets

**Goal**: The site has only About and Resume tabs — no portfolio navigation, content, filtering JS, portfolio CSS, modal overlay, or project images remain
**Depends on:** Phase 2
**Requirements**: PTAB-01, PTAB-02, PTAB-03, PTAB-04, PTAB-05
**Success Criteria** (what must be TRUE):
  1. The navbar contains only About and Resume buttons — no Portfolio tab
  2. No portfolio article, filter UI, or modal overlay exists in index.html
  3. script.js contains only sidebar toggle and page navigation — no filter, modal, or dead form code
  4. style-minimalist.css has no .filter-*, .project-*, or .theme-switcher-* rules
  5. Portfolio project images (6 files) are deleted from assets/images/
**Plans:** 1 plan

Plans:
- [ ] 03-01-PLAN.md — Strip portfolio tab, HTML, JS, CSS, and delete project images
