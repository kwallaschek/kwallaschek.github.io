# Testing Patterns

**Analysis Date:** 2026-02-17

## Test Framework

**Status:** Not detected

**Framework:**
- No test runner configured (Jest, Vitest, Mocha, etc.)
- No test configuration files found (`jest.config.js`, `vitest.config.ts`, etc.)
- No test dependencies in project

**Assertion Library:**
- Not applicable - no testing framework present

**Run Commands:**
```bash
# No testing commands configured
# Manual testing required for current setup
```

## Test File Organization

**Location:**
- No test files present in codebase
- No separate `/tests/` or `/__tests__/` directory
- No `.test.js` or `.spec.js` files detected

**Naming Convention:**
- Not applicable (no test files)

**Structure:**
```
kwallaschek.github.io/
├── assets/
│   ├── css/           # Theme stylesheets (no CSS tests)
│   ├── images/        # Static assets
│   └── js/
│       └── script.js  # Main functionality (untested)
├── index.html         # Primary markup
├── index-*.html       # Theme variants
└── .planning/
    └── codebase/      # This analysis directory
```

## Test Structure

**Current Coverage:**
No automated tests present in codebase.

**Manual Testing Requirements:**

The portfolio website has the following functional areas that would benefit from test coverage:

1. **Theme Switching Functionality** (`assets/js/script.js` lines 148-316)
   - Theme loading from localStorage
   - CSS stylesheet swapping
   - Font loading for different themes
   - Dropdown toggle behavior
   - Theme persistence across page reloads

2. **Navigation System** (`assets/js/script.js` lines 124-144)
   - Page navigation via data-nav-link clicks
   - Active state management
   - Page visibility toggle

3. **Portfolio Modal** (`assets/js/script.js` lines 19-39)
   - Modal open/close functionality
   - Modal content population
   - Overlay interaction

4. **Contact Form Validation** (`assets/js/script.js` lines 103-120)
   - HTML5 form validation
   - Button state management (disabled when invalid)
   - Form submission handling

5. **Portfolio Filtering** (`assets/js/script.js` lines 43-99)
   - Filter dropdown functionality
   - Item filtering by category
   - Active filter button state

6. **Sidebar Toggle** (`assets/js/script.js` lines 10-15)
   - Mobile sidebar collapse/expand
   - Active state styling

## Mocking

**Framework:** Not applicable

**Approach if Testing Framework Added:**

For DOM testing with Jest/Vitest, mocking patterns would be:

```javascript
// Mock localStorage for theme persistence tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock document methods for DOM queries
document.querySelector = jest.fn();
document.querySelectorAll = jest.fn();

// Mock classList operations
Element.prototype.classList = {
  toggle: jest.fn(),
  add: jest.fn(),
  remove: jest.fn(),
  contains: jest.fn()
};
```

**What to Mock:**
- `localStorage` - For theme persistence state
- `document.querySelector/querySelectorAll` - For DOM element selection
- `window.setTimeout/clearTimeout` - For theme prompt timer
- Event handlers - For click, input, and keyboard events
- CSS stylesheet href changes - For theme application verification

**What NOT to Mock:**
- classList manipulation (test real DOM interactions)
- Event propagation and target detection
- Form validation logic
- Style transitions and animations (can test end state)

## Fixtures and Factories

**Status:** Not applicable (no testing framework)

**Test Data Approach if Testing Framework Added:**

```javascript
// Theme fixture
const themeFixture = {
  'neo-tokyo': {
    cssFile: './assets/css/style-surprise.css',
    name: 'Neo-Tokyo',
    fontLink: 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap'
  },
  'minimalist': {
    cssFile: './assets/css/style-minimalist.css',
    name: 'Clean Architect',
    fontLink: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
  }
};

// DOM element factory
function createPortfolioItemElement(category, imageSrc) {
  const item = document.createElement('article');
  item.setAttribute('data-portfolio-item', '');
  item.setAttribute('data-category', category);

  const img = document.createElement('img');
  img.setAttribute('data-modal-img', '');
  img.src = imageSrc;
  item.appendChild(img);

  return item;
}

// Form element factory
function createFormElement() {
  const form = document.createElement('form');
  form.setAttribute('data-form', '');

  const input = document.createElement('input');
  input.setAttribute('data-form-input', '');
  input.required = true;

  const button = document.createElement('button');
  button.setAttribute('data-form-btn', '');
  button.disabled = true;

  form.appendChild(input);
  form.appendChild(button);

  return { form, input, button };
}
```

**Location if Testing Framework Added:**
- `tests/fixtures/themes.json` - Theme configuration fixtures
- `tests/factories/` - DOM element factories
- `tests/setup.js` - Global test setup and mocks

## Coverage

**Current Status:** Not enforced

**Requirements if Testing Framework Added:**
- Target: Minimum 70% overall coverage
- Critical path: 85%+ coverage for theme switching and navigation
- Forms: 90%+ coverage for validation logic
- Portfolio filtering: 80%+ coverage for filter logic

**View Coverage if Testing Framework Added:**
```bash
# With Jest
npm test -- --coverage

# With Vitest
npm run test:coverage

# View HTML report
open coverage/index.html
```

## Test Types

**Unit Tests (Recommended Implementation):**
- Scope: Individual functions and feature blocks
- Approach: Test theme application, filter logic, form validation independently
- Examples:
  ```javascript
  // Theme application test
  describe('Theme System', () => {
    test('applyTheme updates CSS link href', () => {
      applyTheme('minimalist');
      const cssLink = document.querySelector('link[rel="stylesheet"]');
      expect(cssLink.href).toContain('style-minimalist.css');
    });

    test('applyTheme persists to localStorage', () => {
      applyTheme('neo-tokyo');
      expect(localStorage.getItem('portfolio-theme')).toBe('neo-tokyo');
    });
  });

  // Filter logic test
  describe('Portfolio Filter', () => {
    test('filterFunc shows all items when selected is "all"', () => {
      const items = createFilterItems(3);
      filterFunc('all');
      items.forEach(item => {
        expect(item.classList.contains('active')).toBe(true);
      });
    });
  });
  ```

**Integration Tests (Recommended Implementation):**
- Scope: Feature interactions (theme switcher dropdown with theme application)
- Approach: Test complete user workflows
- Examples:
  ```javascript
  // Theme switcher integration test
  describe('Theme Switcher Integration', () => {
    test('clicking theme option applies theme and closes dropdown', () => {
      const dropdown = document.getElementById('themeDropdown');
      const option = document.querySelector('[data-theme="minimalist"]');

      option.click();

      expect(dropdown.classList.contains('show')).toBe(false);
      expect(localStorage.getItem('portfolio-theme')).toBe('minimalist');
    });
  });

  // Form submission integration test
  describe('Contact Form Workflow', () => {
    test('invalid form disables submit, valid form enables submit', () => {
      const { form, input, button } = createFormElement();

      input.value = '';
      input.dispatchEvent(new Event('input'));
      expect(button.disabled).toBe(true);

      input.value = 'test@example.com';
      input.dispatchEvent(new Event('input'));
      expect(button.disabled).toBe(false);
    });
  });
  ```

**E2E Tests (Not Current Priority):**
- Framework: Playwright or Cypress
- Scope: Complete user journeys from page load to interaction
- Status: Not configured; would be valuable for cross-browser theme testing

## Common Patterns

**Async Testing (If Implemented):**
```javascript
// Theme loading simulation (CSS file HTTP fetch)
test('theme switching with async CSS loading', async () => {
  // Simulate CSS loading delay
  jest.useFakeTimers();

  applyTheme('neo-tokyo');

  jest.advanceTimersByTime(150); // addTransitionEffect delay

  expect(localStorage.getItem('portfolio-theme')).toBe('neo-tokyo');

  jest.useRealTimers();
});

// Timeout handling for theme prompt
test('theme prompt appears after 5 seconds', async () => {
  jest.useFakeTimers();
  startThemePromptTimer();

  expect(themePrompt.classList.contains('show')).toBe(false);

  jest.advanceTimersByTime(5000);

  expect(themePrompt.classList.contains('show')).toBe(true);

  jest.useRealTimers();
});
```

**Error/Edge Case Testing (If Implemented):**
```javascript
// Theme application with missing element
test('applyTheme handles missing CSS link gracefully', () => {
  document.querySelector = jest.fn(() => null);

  expect(() => applyTheme('minimalist')).not.toThrow();
});

// Filter with no matching items
test('filterFunc handles case when no items match category', () => {
  const items = createFilterItems(3, 'project');

  expect(() => filterFunc('nonexistent')).not.toThrow();

  items.forEach(item => {
    expect(item.classList.contains('active')).toBe(false);
  });
});

// Form validation with empty required fields
test('form validation fails when required fields empty', () => {
  const form = document.querySelector('[data-form]');

  // Ensure all inputs are empty
  form.querySelectorAll('[data-form-input]').forEach(input => {
    input.value = '';
  });

  expect(form.checkValidity()).toBe(false);
});

// Outside click closes dropdown
test('dropdown closes when clicking outside', () => {
  const dropdown = document.getElementById('themeDropdown');
  dropdown.classList.add('show');

  document.dispatchEvent(new MouseEvent('click', {
    target: document.body
  }));

  expect(dropdown.classList.contains('show')).toBe(false);
});
```

## Recommended Testing Implementation

### Phase 1: Setup (Optional, if testing needed)
```bash
# Install dependencies
npm install --save-dev jest @testing-library/dom

# Create test configuration
# jest.config.js or package.json test section
```

### Phase 2: Unit Tests
- Theme system (localStorage, CSS switching, font loading)
- Filter logic (category matching, all filter)
- Form validation (checkValidity integration)

### Phase 3: Integration Tests
- Complete theme switching workflow
- Navigation and page switching
- Portfolio modal open/close with content

### Phase 4: E2E Tests (Lower Priority)
- Cross-browser theme persistence
- Mobile sidebar interaction
- Complete user journey from page load

## Notes

**Testing Complexity Assessment:**
- **Low Complexity**: Data attribute selection, classList operations, localStorage interaction
- **Medium Complexity**: DOM event handling, form validation, filter logic
- **High Complexity**: Theme switching with CSS reload, setTimeout/clearTimeout management, animation timing

**Browser Compatibility Concerns:**
- Modern API usage: `classList`, `querySelector`, `querySelectorAll` all well-supported
- localStorage supported in all modern browsers
- No polyfills needed for core functionality

**Accessibility Considerations for Testing:**
- Ensure keyboard navigation tested (Escape key closes dropdown)
- Test data attributes are proper semantic selectors
- Form validation accessible without JavaScript (HTML5 validation fallback)

---

*Testing analysis: 2026-02-17*
