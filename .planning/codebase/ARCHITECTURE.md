# Architecture

**Analysis Date:** 2026-02-17

## Pattern Overview

**Overall:** Single Page Application (SPA) with theme switching system

**Key Characteristics:**
- Static site hosted on GitHub Pages (no backend)
- Client-side routing via JavaScript with tab-based navigation
- Multi-theme support with localStorage persistence
- Responsive design targeting mobile-first approach
- Declarative HTML with data attributes for JavaScript targeting

## Layers

**Presentation (View):**
- Purpose: Render portfolio content across three semantic sections (About, Resume, Portfolio)
- Location: `index.html` (main entry point)
- Contains: HTML semantic markup with data attributes for script targeting
- Depends on: CSS stylesheets, JavaScript behaviors, external icons (Ionicons)
- Used by: Users viewing the portfolio

**Styling (Themes):**
- Purpose: Provide visual presentation with switchable theme variations
- Location: `assets/css/` (4 CSS files for different themes)
- Contains:
  - `style-minimalist.css` (18KB) - Clean Architect theme with Inter font
  - `style-surprise.css` (32KB) - Neo-Tokyo Terminal theme with Share Tech Mono font
  - `style.css` (35KB) - Classic Professional theme with Poppins font
  - `style-playful.css` (22KB) - Creative Coder theme (alternative, not deployed)
- Depends on: External Google Fonts
- Used by: Browser rendering engine

**Behavior (Interactivity):**
- Purpose: Manage user interactions, page navigation, theme switching, filtering, form validation
- Location: `assets/js/script.js` (316 lines)
- Contains: Vanilla JavaScript with event-driven architecture
- Depends on: DOM API, localStorage API, external Ionicons library
- Used by: Browser JavaScript engine

**Assets (Resources):**
- Purpose: Store images, icons, and static resources
- Location: `assets/images/` (11 image files)
- Contains: Portfolio project images, avatar, icons (SVG), favicon
- Depends on: None
- Used by: HTML content for portfolio display

## Data Flow

**Theme Loading Flow:**

1. Page loads with cached theme preference from localStorage (default: 'minimalist')
2. `applyTheme()` function executes:
   - Dynamically replaces CSS stylesheet href
   - Updates Google Font link for typography
   - Marks selected theme as active in dropdown
   - Stores selection in localStorage
3. User clicks theme switcher button in navigation
4. Dropdown displays three theme options with previews
5. User selects theme → transition effect applied → theme switched → dropdown closes
6. New theme persists across browser sessions via localStorage

**Page Navigation Flow:**

1. User clicks navbar link (About/Resume/Portfolio)
2. JavaScript retrieves data-page attribute value
3. Finds matching article section via data-page selector
4. Removes 'active' class from current page and nav link
5. Adds 'active' class to target page and nav link
6. Window scrolls to top (`window.scrollTo(0, 0)`)
7. CSS display changes via active selector: `.article.active { display: block; }`

**Portfolio Filtering Flow:**

1. User clicks category filter button or select dropdown
2. JavaScript extracts selected category text
3. Iterates all portfolio items via `data-filter-item` selector
4. Compares `data-category` attribute against selected value
5. Toggles 'active' class to show/hide matching items
6. Dropdown auto-closes on desktop, remains open on mobile

**State Management:**

localStorage stores only one value:
- `portfolio-theme`: Current active theme name ('neo-tokyo', 'minimalist', 'original')

Session-only state via JavaScript variables:
- `currentTheme`: In-memory theme name
- `lastClickedBtn`: Tracks active filter button
- Modal overlay state for portfolio modals

## Key Abstractions

**Data Attributes Pattern:**

All JavaScript selectors use data attributes instead of classes. This separates concerns:
- Classes: Styling and visual state (active, show, etc.)
- Data attributes: JavaScript behavior targets

Examples:
- `data-sidebar`: Sidebar container
- `data-nav-link`: Navigation buttons (tracks which page each controls)
- `data-page`: Content sections (about, resume, portfolio)
- `data-filter-item`: Portfolio items (targets what content to filter)
- `data-category`: Portfolio item category (networks, tools, web development)
- `data-theme`: Theme option selection

**Theme Configuration Object:**

```javascript
const themes = {
  'neo-tokyo': { cssFile, name, fontLink },
  'minimalist': { cssFile, name, fontLink },
  'original': { cssFile, name, fontLink }
};
```

Centralizes all theme metadata. Adding a new theme requires only adding an entry to this object.

**Component Lifecycle Pattern:**

Each interactive feature follows: Query → Listen → Toggle State
- Query: `document.querySelector()` or `document.querySelectorAll()`
- Listen: `addEventListener('click', callback)`
- Toggle: `classList.toggle()` or `classList.add/remove()`

## Entry Points

**`index.html`:**
- Location: `/index.html` (root, served by GitHub Pages)
- Triggers: Browser navigation to domain URL
- Responsibilities:
  - Render initial HTML structure
  - Load CSS stylesheet
  - Load Google Fonts
  - Attach script.js for interactivity
  - Define all content sections (about, resume, portfolio)
  - Load Ionicons library for SVG icons

**`assets/js/script.js`:**
- Location: `/assets/js/script.js`
- Triggers: DOMContentLoaded (implicit, runs when page loads)
- Responsibilities:
  - Initialize all event listeners
  - Apply cached theme on page load
  - Manage page navigation, portfolio filtering, theme switching
  - Handle form validation (if form exists)
  - Setup modal interactions

**Theme Application:**
- Triggered: On page load, before user sees content
- Process:
  1. Check localStorage for saved theme
  2. Load CSS file associated with theme
  3. Load corresponding Google Font
  4. Update visual indicators in dropdown

## Error Handling

**Strategy:** Graceful degradation with sensible defaults

**Patterns:**

Theme Loading:
- If localStorage returns null → defaults to 'minimalist'
- If theme object is missing → `if (!theme) return;` skips application
- If CSS link not found → continues without error (theme may already be loaded)

Navigation:
- If data-page attribute missing → no matching content appears
- If data-nav-link missing → click does nothing (safe)

Filtering:
- If data-category attribute missing → item never matches filter (hidden)
- If data-filter-item missing → item not included in filter loop

## Cross-Cutting Concerns

**Styling:** CSS Variables used throughout for theme-aware values
- Color palette switches via CSS variable redefinition in each theme
- Transitions and animations defined once, reused across themes
- Responsive breakpoints consistent across all theme files

**Responsive Design:**
- Mobile-first CSS approach
- Sidebar collapses/expands via JavaScript toggle
- Portfolio grid adjusts column count via media queries
- Navigation adapts with mobile select dropdown

**Typography:**
- Each theme loads different Google Font family
- Font weights and sizes consistent across themes via custom properties
- Fallback fonts defined in CSS variable values

**Validation:**
- Form validation uses native HTML5 `checkValidity()`
- Submit button disabled by default, enabled only when form is valid
- Validation triggered on every input change

---

*Architecture analysis: 2026-02-17*
