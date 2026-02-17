# Codebase Concerns

**Analysis Date:** 2026-02-17

## Tech Debt

**Multiple HTML File Versions Without Version Control**
- Issue: Three alternative theme variations (`index-minimalist.html`, `index-playful.html`, `index-surprise.html`) are untracked local files. The main `index.html` contains inline theme switching logic, creating maintenance overhead. Changes to structure must be manually propagated across all versions.
- Files: `index.html`, `index-minimalist.html`, `index-playful.html`, `index-surprise.html`
- Impact: High maintenance burden; structure inconsistencies across versions; difficulty updating contact info, resume, or portfolio items across all variations
- Fix approach: Consolidate theme system into single HTML file with CSS-only theming (avoid duplicate HTML). Move all theme CSS to external stylesheets already in use. Archive unused HTML files or use template language for version generation.

**Hardcoded Theme Configuration in JavaScript**
- Issue: Theme paths, names, and font links are hardcoded in `script.js` (lines 156-172). Adding new themes requires both CSS file creation and JavaScript modification.
- Files: `assets/js/script.js` (lines 156-172)
- Impact: Inflexible theme system; error-prone when adding new themes; CSS assets not automatically discovered
- Fix approach: Move theme configuration to JSON file (`themes.json`) or data attributes in HTML. Auto-discover CSS files in themes directory. Use CSS variables for theme switching instead of replacing entire stylesheet.

**Unused Modal and Portfolio Functionality**
- Issue: Modal system exists in HTML (`data-modal-container`, `data-modal-img`, etc.) but is never triggered. Portfolio items link directly to external GitHub URLs instead of opening modal previews.
- Files: `index.html` (lines 733-758), `assets/js/script.js` (lines 20-34, 31-34)
- Impact: Dead code increasing bundle size; confusing UI patterns; false affordance (portfolio items appear clickable but behave differently)
- Fix approach: Either implement modal functionality with actual portfolio project details or remove modal HTML/JS entirely. Make portfolio item behavior consistent across all themes.

**Unused Custom Select and Filter System**
- Issue: Custom select dropdown and portfolio filtering logic exist (`filterFunc`, `selectItems`) but portfolio section doesn't display filtered/categorized content in practice. Categories exist but are not properly utilized.
- Files: `assets/js/script.js` (lines 43-99), `index.html` (lines 545-600)
- Impact: Technical debt from incomplete feature; unused JavaScript code adds cognitive load; maintenance burden if expanding portfolio
- Fix approach: Complete the filtering implementation by properly implementing category-based portfolio display, or simplify portfolio section to direct GitHub links without filtering UI.

**Inconsistent CSS File Sizes and Duplication**
- Issue: CSS files range from 967 lines (minimalist) to 2136 lines (original). All include complete styling despite shared HTML structure. High duplication of base styles across all CSS files.
- Files: `assets/css/style.css` (2136 lines), `assets/css/style-surprise.css` (1626 lines), `assets/css/style-minimalist.css` (967 lines), `assets/css/style-playful.css` (1091 lines)
- Impact: Larger payloads when switching themes; maintenance burden; base styles replicated across files; changes to core layout require updates to all CSS files
- Fix approach: Extract common base styles into `style-base.css`. Create theme-specific overrides only for visual differences. Use CSS variables for theme-specific colors instead of duplicating entire rulesets.

## Known Bugs

**Theme Font Switching Creates Flash of Unstyled Content**
- Symptoms: When switching themes, Google Fonts are loaded dynamically; brief visual flicker occurs before font loads
- Files: `assets/js/script.js` (lines 186-195), `index.html` (line 26-28)
- Trigger: Select a different theme from dropdown; observe font change animation
- Workaround: Add font preloading for all theme fonts in HTML head; use system fallbacks that match theme fonts more closely; implement opacity transition to mask font loading flicker

**localStorage Dependency Without Error Handling**
- Symptoms: If localStorage is disabled (private browsing, old browsers) or quota exceeded, theme preference fails silently; application defaults to 'minimalist' without user awareness
- Files: `assets/js/script.js` (lines 175, 209)
- Trigger: Use browser in private/incognito mode; attempt localStorage operations
- Workaround: Add try-catch blocks around localStorage operations. Gracefully degrade to sessionStorage or memory-based theme storage. Notify user of storage unavailability.

**XSS Vulnerability with innerHTML in Navigation**
- Symptoms: Navigation link matching uses `innerHTML.toLowerCase()` which could execute scripts if data attributes contain HTML. Not immediately exploitable in current code but violates security best practices.
- Files: `assets/js/script.js` (line 133)
- Trigger: Hypothetically, if page data-page or nav link text contains HTML with script tags
- Workaround: Replace `this.innerHTML.toLowerCase()` with `this.textContent.toLowerCase()` (line 133). Use `getAttribute()` and `dataset` for secure data access.

**Missing Error Handling for Missing DOM Elements**
- Symptoms: If HTML structure changes and required data attributes are missing, JavaScript fails silently without user feedback
- Files: `assets/js/script.js` (lines 11, 44, 104, 125, 149-152)
- Trigger: Delete or rename data attributes in HTML; page loads but functionality breaks silently
- Workaround: Add null checks before accessing DOM elements. Log warnings to console when expected elements are missing. Implement graceful degradation for missing features.

## Security Considerations

**External CDN Dependencies Without Integrity Verification**
- Risk: ionicons from unpkg.com and Google Fonts from googleapis.com are loaded without Subresource Integrity (SRI) attributes. CDN compromise would affect all visitors.
- Files: `index.html` (lines 26-28, 777-778)
- Current mitigation: Using versioned URLs (`ionicons@5.5.2`, `googleapis.com`) provides basic version pinning but not cryptographic verification
- Recommendations: Add `integrity` attribute to all external scripts/stylesheets. Implement Content Security Policy (CSP) headers if using GitHub Pages custom domain. Consider self-hosting icon library and fonts. Monitor external dependency updates for security patches.

**Exposed Personal Information in Meta Tags**
- Risk: Birthday (November 1, 1994) exposed in `<time>` element; email address publicly visible in multiple locations. While intended for public portfolio, creates opportunities for social engineering or targeted attacks.
- Files: `index.html` (line 101, lines 87, 139)
- Current mitigation: Information displayed on public portfolio (intentional)
- Recommendations: Remove or obfuscate birthday information. Consider email obfuscation (JavaScript reveal on hover) or contact form instead of direct email link. Monitor for leaked personal data in breach databases.

**Missing Content Security Policy**
- Risk: No CSP header defined. Reduces protection against XSS attacks and unauthorized resource loading.
- Files: All HTML files
- Current mitigation: None
- Recommendations: Implement CSP header via `.htaccess` (if supported) or HTTP headers configuration. Start with strict policy: `default-src 'self'; script-src 'self' https://unpkg.com https://fonts.googleapis.com; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'` (refine to eliminate `unsafe-inline` for styles).

**No HTTPS Enforcement Guidance**
- Risk: Portfolio served via GitHub Pages which supports HTTPS, but no explicit redirect or HSTS header visible in codebase
- Files: All files
- Current mitigation: GitHub Pages provides HTTPS by default for `*.github.io` domains
- Recommendations: Ensure GitHub Pages HTTPS enforcement is enabled in repository settings. Add HSTS header if custom domain is used. Test with `curl -I` to verify HTTPS and security headers are present.

## Performance Bottlenecks

**Font Loading Critical Path**
- Problem: Google Fonts loading blocks rendering. Share Tech Mono (Neo-Tokyo theme) must load before terminal text appears; Inter (Minimalist) similarly blocks. Font switching requires reloading Google Fonts URL dynamically.
- Files: `assets/js/script.js` (lines 192-195), `index.html` (lines 26-28)
- Cause: Synchronous font loading; dynamic font URL replacement doesn't use font-display optimization; all font weights preloaded even if not used
- Improvement path: Add `font-display: swap` to Google Fonts URL. Use `<link rel="preload">` for critical fonts only. Implement local font caching with Service Worker. Cache font URLs in localStorage after first load.

**Large CSS File Duplication**
- Problem: Total CSS across all files is 5820 lines. When switching themes, entire 1000-2000 line CSS files are loaded and swapped, causing re-parse and reflow.
- Files: All CSS files in `assets/css/`
- Cause: Complete CSS duplication across themes instead of base + override pattern. No CSS minimization or compression indicated.
- Improvement path: Extract common styles (~70% of code) into shared `base.css`. Create minimal theme override files (200-400 lines each). Minify all CSS. Use CSS variables to reduce theme file sizes further.

**No Image Optimization**
- Problem: Portfolio items use `.jpg`, `.png` images without specified dimensions. No lazy loading implementation visible.
- Files: `index.html` (lines 611, 628, 646, 664, 682, 700, 718)
- Cause: Images lack `loading="lazy"` attribute; no width/height attributes cause layout shift; image formats not optimized (no WebP alternatives)
- Improvement path: Add `loading="lazy"` to all portfolio images. Add explicit width/height to prevent layout shift. Convert images to WebP format with JPEG fallback. Use responsive images with `srcset`. Optimize image quality (current `.jpg` files may be over-optimized or under-optimized).

**Theme Prompt Timeout Blocks Interaction**
- Problem: 5-second theme prompt timeout runs on every page load. Timer is global and creates unnecessary CPU usage if user is idle on page.
- Files: `assets/js/script.js` (lines 270-272, 316)
- Cause: Unconditional 5-second timeout that triggers regardless of user intent; no way to permanently dismiss for session
- Improvement path: Clear timeout when user interacts with page (click, scroll, keyboard). Use `requestIdleCallback` instead of fixed timeout. Add localStorage flag to suppress prompt for 24 hours after dismissal.

## Fragile Areas

**Form Validation Logic**
- Files: `assets/js/script.js` (lines 103-120)
- Why fragile: Uses native HTML5 form validation (`form.checkValidity()`). No custom validation logic; relies on HTML `required` attributes and type validation. If form fields are added/removed from HTML, validation may silently break.
- Safe modification: When adding form fields, ensure all inputs have `data-form-input` attribute and `required` attribute set appropriately. Test form validation with invalid inputs before deploying. Add fallback validation in JavaScript if HTML5 validation is unavailable.
- Test coverage: No visible test files; form validation untested

**Navigation Link Matching**
- Files: `assets/js/script.js` (lines 129-144)
- Why fragile: Navigation matching compares `innerHTML.toLowerCase()` with `dataset.page`. Any change to button text or data attributes breaks navigation. Case-sensitive mismatches silently fail.
- Safe modification: Use unique IDs instead of text content matching. Add data attributes for page references. Add unit tests for navigation routing. Log navigation failures to console.
- Test coverage: No visible test files; navigation logic untested

**Theme Switcher DOM Dependency**
- Files: `assets/js/script.js` (lines 149-152)
- Why fragile: Assumes specific DOM structure with `#themeSwitcher`, `#themeDropdown`, `#themePrompt`, `.theme-option`, `.theme-text` elements. Rearranging HTML breaks theme switching entirely.
- Safe modification: Query DOM elements with null checks. Use data attributes instead of class selectors for critical elements. Add console warnings if expected elements are missing. Document required DOM structure in comments.
- Test coverage: No visible test files

**JavaScript Load Order**
- Files: `index.html` (line 772)
- Why fragile: Script loaded at end of body. If moved to head or if async attribute added, DOM may not be ready and selectors will fail to find elements.
- Safe modification: Keep script at end of body before closing tag. Consider wrapping initialization in `DOMContentLoaded` event handler for extra safety. Use `defer` attribute if moved to head.
- Test coverage: No visible test files

## Scaling Limits

**Current Capacity**
- Portfolio projects: 7 items (currently displayed)
- Timeline items: 8 experience + 4 education + 2 publications + 3 qualifications = 17 items
- Themes: 3 fully implemented

**Scaling Path**
- **Portfolio expansion**: Current filtering UI supports category expansion without code changes (just add new `data-category` items). Max reasonable items: 30-50 before pagination needed.
- **Resume expansion**: Timeline structure is repetitive; could display 50+ items comfortably. Consider pagination after 20 items per section.
- **Theme addition**: Adding 4th theme requires: 1) Create `style-[name].css`, 2) Add entry to themes object in `script.js`, 3) Add HTML option to dropdown. Consider JSON configuration file to avoid JS modifications.

## Dependencies at Risk

**ionicons CDN Dependency**
- Risk: Library from `unpkg.com` version `5.5.2` (from 2021). Unmaintained libraries or major version jumps could break icon rendering.
- Impact: If unpkg.com service degrades or library removed, all icons disappear
- Migration plan: Self-host ionicons library or use alternative (FontAwesome, Material Icons, system emoji). Download library version 5.5.2 to `assets/icons/` directory. Update script URLs to local paths.

**Google Fonts Loading**
- Risk: Depends on googleapis.com CDN. Site blocks or connectivity issues prevent font loading.
- Impact: Fallback fonts (monospace, sans-serif) used; visual appearance degraded but functional
- Migration plan: Self-host Google Fonts files. Use local font files with `@font-face`. Cache fonts with Service Worker. Alternatively, use system fonts (SF Pro Display, Segoe UI) that match design.

**No Version Control for theme CSS**
- Risk: Alternative theme CSS files (`style-minimalist.css`, `style-playful.css`) are not tracked in git. Loss of working directory could lose these designs.
- Impact: Inability to restore previous theme implementations; loss of design variations
- Migration plan: Version control all HTML and CSS files. Use git branches for experimental themes. Create proper theme management system.

## Missing Critical Features

**No Contact Form**
- Problem: Email address hardcoded as link. No contact form for inquiries. Exposes email to scrapers.
- Blocks: Potential clients/recruiters cannot send inquiries privately
- Recommendation: Implement contact form (Formspree, Basin, or backend service). Add rate limiting. Implement spam filtering. Consider email obfuscation.

**No 404 Page**
- Problem: GitHub Pages default 404 appears if user navigates to non-existent pages
- Blocks: Poor UX for typos or broken links
- Recommendation: Create `404.html` file with navigation back to main pages. GitHub Pages will serve it automatically.

**No Sitemap or Robots.txt**
- Problem: No SEO configuration visible
- Blocks: Search engines may not discover all content efficiently
- Recommendation: Create `sitemap.xml` with all content URLs. Create `robots.txt` allowing all crawlers. Add Google Search Console verification.

**No Analytics**
- Problem: No traffic or visitor behavior tracking
- Blocks: Cannot measure portfolio effectiveness or visitor interest
- Recommendation: Add Google Analytics 4 tag (with privacy considerations) or privacy-focused alternative (Plausible, Fathom). Track page views, time on page, theme preferences.

## Test Coverage Gaps

**JavaScript Functionality Untested**
- What's not tested: Navigation routing, theme switching, form validation, filter functionality
- Files: `assets/js/script.js` (entire file - no test file found)
- Risk: Breaking changes go undetected. Theme switching logic could silently fail. Navigation could break with HTML restructuring.
- Priority: High - core interactivity untested

**Responsive Design Not Validated**
- What's not tested: Mobile layout, tablet sizes, extreme viewport sizes
- Files: All CSS files
- Risk: Layout breaks on specific devices unnoticed. Theme switching may fail on mobile.
- Priority: High - portfolio must be accessible on all devices

**Cross-Browser Compatibility**
- What's not tested: Firefox, Safari, Edge compatibility; CSS Grid/Flexbox support; JavaScript ES6 compatibility
- Files: All files
- Risk: Features break on less common browsers. Monospace fonts may render differently.
- Priority: Medium - affects accessibility

**Accessibility Testing**
- What's not tested: Screen reader compatibility, keyboard navigation, color contrast ratios, semantic HTML
- Files: All HTML files
- Risk: Portfolio inaccessible to users with disabilities. Fails WCAG 2.1 AA standards.
- Priority: High - legal and ethical concern

---

*Concerns audit: 2026-02-17*
