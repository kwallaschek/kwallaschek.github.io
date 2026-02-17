# Coding Conventions

**Analysis Date:** 2026-02-17

## Naming Patterns

**HTML Elements (Data Attributes):**
- Kebab-case for data attributes: `[data-sidebar]`, `[data-portfolio-item]`, `[data-modal-container]`, `[data-sidebar-btn]`, `[data-modal-close-btn]`, `[data-overlay]`, `[data-form]`, `[data-form-input]`, `[data-form-btn]`, `[data-nav-link]`, `[data-page]`
- Pattern: `data-[feature-name]` for structural elements
- Examples from `index.html` and `assets/js/script.js`:
  - Navigation: `[data-sidebar]`, `[data-sidebar-btn]`, `[data-nav-link]`, `[data-page]`
  - Portfolio: `[data-portfolio-item]`, `[data-modal-container]`, `[data-modal-close-btn]`, `[data-overlay]`, `[data-modal-img]`, `[data-modal-title]`, `[data-modal-text]`
  - Forms: `[data-form]`, `[data-form-input]`, `[data-form-btn]`
  - Filtering: `[data-select]`, `[data-select-item]`, `[data-select-value]`, `[data-filter-btn]`, `[data-filter-item]`

**CSS Classes:**
- Kebab-case for all CSS classes
- Pattern: Descriptive lowercase with hyphens: `.sidebar`, `.sidebar-info`, `.sidebar-btn`, `.modal-container`, `.active`, `.show`
- Modifier classes: `.active` (state), `.show` (visibility)
- Utility-style naming: `.contacts-list`, `.contact-item`, `.contact-info`, `.filter-items`
- Examples from stylesheets:
  - Structural: `.sidebar`, `.sidebar-info`, `.sidebar-info_more` (note: underscore variant also used)
  - State: `.active` (applied to toggled elements)
  - Component: `.avatar-box`, `.info-content`, `.title-stack`, `.icon-box`

**JavaScript Variables:**
- camelCase for all variable names
- Descriptive, readable names: `elementToggleFunc`, `portfolioItem`, `modalContainer`, `sidebarBtn`, `formInputs`, `navigationLinks`
- Function names: camelCase with verb prefix when appropriate
  - Declarative naming: `toggleDropdown()`, `closeDropdownOnOutsideClick()`, `addTransitionEffect()`, `showThemePrompt()`, `hideThemePrompt()`, `startThemePromptTimer()`, `applyTheme()`
- Boolean variables: Implicit in conditional context (no `is-` prefix used, but context makes intent clear)
- Example from `assets/js/script.js`:
  ```javascript
  const sidebar = document.querySelector("[data-sidebar]");
  const sidebarBtn = document.querySelector("[data-sidebar-btn]");
  const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }
  ```

**CSS Custom Properties (Variables):**
- Double-dash prefix with kebab-case segments: `--primary-black`, `--primary-white`, `--gray-100`, `--ff-primary`, `--fs-xs`, `--space-1`, `--transition-fast`
- Semantic naming: `--terminal-green`, `--neon-cyan`, `--electric-pink`, `--text-primary`, `--text-secondary`, `--bg-terminal`
- Pattern: `--[category]-[descriptor]` (color, typography, spacing, transition, shadow)
- Examples from `assets/css/style-minimalist.css`:
  ```css
  --primary-black: #000000;
  --ff-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --fs-xs: 0.75rem;
  --space-1: 0.5rem;
  --transition-fast: 0.15s ease;
  ```

**File Names:**
- Lowercase with hyphens for multi-word names
- Theme-specific stylesheets: `style-minimalist.css`, `style-playful.css`, `style-surprise.css`
- HTML variants: `index-minimalist.html`, `index-playful.html`, `index-surprise.html`
- JavaScript: `script.js` (single main file)
- Assets: lowercase with descriptive names: `my-avatar_3.png`, `icon-design.svg`, `icon-dev.svg`, `icon-photo.svg`

## Code Style

**Formatting:**
- No enforced linter or formatter detected
- Manual formatting conventions observed:
  - 2-space indentation used throughout HTML, CSS, and JavaScript
  - Line breaks between logical sections with comments
  - Spacing around operators and function parameters

**Comments:**
- Block comments for major sections: `/* --- SECTION NAME --- */`
- Example from CSS files:
  ```css
  /*-----------------------------------*\
    #CUSTOM PROPERTY
  \*-----------------------------------*/
  ```
- Inline comments for clarification: `// theme prompt variables`, `// apply theme on page load`
- HTML comments for structure: `<!-- #MAIN -->`, `<!-- #SIDEBAR -->`, `<!-- portfolio variables -->`
- No JSDoc/TSDoc style documentation observed

**Line Length:**
- No strict line length limit enforced
- Typical lines stay under 100 characters in JavaScript
- CSS declarations span appropriate lengths without arbitrary wrapping

## Import Organization

**HTML Resource Loading Order:**
1. Meta tags (charset, viewport, description)
2. Favicon
3. Stylesheet link (CSS)
4. Font preconnect and import
5. Script tags at end of body (if present)

**JavaScript Module Structure:**
- Single file approach: `assets/js/script.js` (315 lines total)
- No module system or imports detected
- Global scope pollution minimized through variable grouping by feature
- Grouped by functionality:
  ```javascript
  // Sidebar functionality section
  // Portfolio modal section
  // Custom select/filter section
  // Contact form section
  // Page navigation section
  // Theme switcher section
  ```

**CSS Import:**
- Single stylesheet per theme variant
- Theme fonts imported via Google Fonts link tag
- No CSS @import rules for organizing styles

## Error Handling

**Strategy:** Defensive null-checking with guard clauses

**Patterns:**
- Null validation before DOM operations:
  ```javascript
  // From applyTheme() function
  const cssLink = document.querySelector('link[rel="stylesheet"]');
  if (cssLink) {
    cssLink.href = theme.cssFile;
  }
  ```
- Existence checking before DOM manipulation:
  ```javascript
  // From theme switcher
  if (themeSwitcher) {
    themeSwitcher.addEventListener('click', toggleDropdown);
  }

  if (themePrompt) {
    themePrompt.classList.add('show');
  }
  ```
- Optional chaining via existence checks:
  ```javascript
  // From closeDropdownOnOutsideClick()
  if (!themeSwitcher.contains(event.target) && !themeDropdown.contains(event.target)) {
    // proceed
  }
  ```

**Form Validation:**
- Native HTML5 validation: `form.checkValidity()`
- Conditional button state management:
  ```javascript
  if (form.checkValidity()) {
    formBtn.removeAttribute("disabled");
  } else {
    formBtn.setAttribute("disabled", "");
  }
  ```

**Error Recovery:**
- Graceful degradation for missing elements (no error thrown if selector fails)
- Timeout clearing to prevent memory leaks:
  ```javascript
  if (promptTimeout) {
    clearTimeout(promptTimeout);
  }
  ```

## Logging

**Framework:** No formal logging framework

**Patterns:**
- Console methods not used in production code
- Data persistence via localStorage:
  ```javascript
  localStorage.setItem('portfolio-theme', themeName);
  currentTheme = localStorage.getItem('portfolio-theme') || 'minimalist';
  ```

## Comments

**When to Comment:**
- Section boundaries with special formatting: `/*---\n  #SECTION_NAME\n\*---*/`
- Feature explanations in JavaScript
- Non-obvious logic or business decisions
- Theme/design documentation at file top

**JSDoc/TSDoc:**
- Not used in this codebase
- HTML comments used for structural navigation

## Function Design

**Size:** Functions are generally small and focused
- Average function: 5-20 lines
- Examples from `script.js`:
  - `elementToggleFunc()`: 1 line (toggle class)
  - `filterFunc()`: 10 lines (filter logic)
  - `toggleDropdown()`: 15 lines (UI state)
  - `applyTheme()`: 20 lines (multi-step theme application)

**Parameters:** Keep minimal, usually 1-3 parameters
- Event handler patterns: Accept event object
- DOM operations: Accept element reference
- Configuration: Accept theme name string
- Example: `applyTheme(themeName)` - single string parameter for clarity

**Return Values:**
- Functions modify DOM state through side effects (classList.toggle, setAttribute)
- No return values expected by callers
- Theme application uses void function pattern:
  ```javascript
  function applyTheme(themeName) {
    // modifies DOM directly
    // updates localStorage
    // no return statement
  }
  ```

## Module Design

**Exports:** Not applicable (no module system)

**Barrel Files:** Not used

**Code Organization Pattern:**
- Script file organized by feature/responsibility sections
- Grouped related functionality with shared variables
- Section structure:
  1. Utility functions first (`elementToggleFunc`)
  2. Feature-specific variable declarations
  3. Feature-specific event listeners and handlers
  4. Initialization code at bottom

**State Management:**
- Global variables grouped by feature scope
- localStorage for persistent theme state
- CSS classes for UI state representation
- No centralized state object or pattern

## CSS Architecture

**Design Pattern:** Multiple theme variants with shared HTML structure

**CSS Organization (across all theme files):**
1. Copyright/title comment
2. Custom properties (CSS variables) section
3. Reset and base styles
4. Component/layout styles
5. Utility styles
6. Media queries (responsive design)

**Naming Convention in CSS Selectors:**
- Class-based styling (no element selectors for component styling)
- Attribute selectors for data-driven styling: `[data-page].active`
- Pseudo-classes for state: `:hover`, `:disabled`
- No deep nesting; prefer flat class hierarchy

**Example CSS class hierarchy:**
```css
.sidebar { }
.sidebar-info { }
.sidebar-info_more { } /* Note: underscore variation for nested concept */
.avatar-box { }
.info-content { }
.title-stack { }
```

## Responsive Design

**Breakpoints:** Media query approach observed in stylesheets
- Mobile-first methodology implied by responsive CSS structure
- Specific breakpoints vary by theme variant

**Pattern Example from style-minimalist.css:**
```css
@media (max-width: 768px) {
  /* Mobile adjustments */
}

@media (min-width: 769px) {
  /* Desktop layout */
}
```

## JavaScript Patterns

**Event Delegation:**
- Direct element selection and event listener attachment
- Pattern: Query element → Add listener → Define handler inline
- Example:
  ```javascript
  sidebarBtn.addEventListener("click", function () {
    elementToggleFunc(sidebar);
  });
  ```

**Closures:**
- Function declarations used for encapsulation
- Theme configuration object with closure access:
  ```javascript
  const themes = { /* object */ };
  function applyTheme(themeName) {
    const theme = themes[themeName];
    // closure over themes object
  }
  ```

**Array Iteration:**
- for loop for querySelectorAll collections (older style):
  ```javascript
  for (let i = 0; i < filterItems.length; i++) {
    // operate on filterItems[i]
  }
  ```
- forEach for modern iteration (theme options):
  ```javascript
  themeOptions.forEach(option => {
    option.classList.remove('active');
  });
  ```

**DOM Manipulation Patterns:**
- classList methods: `.toggle()`, `.add()`, `.remove()`
- Attribute methods: `setAttribute()`, `removeAttribute()`
- Property access: `.innerText`, `.href`, `.classList`
- Query methods: `.querySelector()`, `.querySelectorAll()`

---

*Convention analysis: 2026-02-17*
