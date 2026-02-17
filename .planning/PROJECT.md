# Portfolio Website

## What This Is

A personal portfolio website for Kay Wallaschek — Engineering Manager & Software Architect Lead at Money Forward, based in Tokyo. Static site hosted on GitHub Pages at kl-w.de. Currently has a multi-theme system (minimalist, neo-tokyo, classic) that adds unnecessary complexity.

## Core Value

A clean, fast portfolio that presents professional experience clearly with zero unnecessary overhead.

## Requirements

### Validated

- ✓ About Me section with professional bio — existing
- ✓ Resume section with timeline, experience, education — existing
- ✓ Portfolio section with filterable project grid — existing
- ✓ Sidebar with contact info, social links, avatar — existing
- ✓ Tab-based page navigation (About/Resume/Portfolio) — existing
- ✓ Responsive mobile-first design — existing
- ✓ GitHub Pages deployment with custom domain (kl-w.de) — existing

### Active

- [ ] Remove theme switcher UI from navigation
- [ ] Remove theme-switching JavaScript logic
- [ ] Delete alternative theme CSS files (style-surprise.css, style-playful.css, style.css)
- [ ] Delete alternative HTML files (index-minimalist.html, index-playful.html, index-surprise.html)
- [ ] Consolidate index.html to use minimalist theme directly (inline or single stylesheet)
- [ ] Clean up unused Google Font references (only keep Inter)
- [ ] Remove theme-related localStorage logic

### Out of Scope

- New design or visual changes — keeping minimalist design as-is
- Content changes — bio, resume, portfolio items stay unchanged
- Backend or build tooling — remains a static site
- New features — this is a cleanup/simplification milestone

## Context

The portfolio went through a design exploration phase where three themes were created (Neo-Tokyo Terminal, Minimalist Clean Architect, Classic Professional). A theme switcher was added to the navigation. The minimalist theme was set as default. Now the goal is to simplify by committing to the minimalist design and removing all theme infrastructure.

Key files:
- `index.html` — main entry point, currently has theme switcher in nav
- `assets/js/script.js` — 316 lines, contains theme switching logic alongside navigation/filtering
- `assets/css/style-minimalist.css` — 18KB, the design to keep
- `assets/css/style-surprise.css`, `style-playful.css`, `style.css` — to be deleted

## Constraints

- **Tech stack**: Static HTML/CSS/JS only — no build tools, no frameworks
- **Hosting**: GitHub Pages — must remain deployable with zero build step
- **Compatibility**: Must work in modern browsers (ES6+)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Keep minimalist theme | User preference — clean, professional, typography-focused | — Pending |
| Delete all alternative themes | Clean break, reduce maintenance surface | — Pending |
| No new features | This is purely a simplification effort | — Pending |

---
*Last updated: 2026-02-17 after initialization*
