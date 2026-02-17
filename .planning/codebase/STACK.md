# Technology Stack

**Analysis Date:** 2026-02-17

## Languages

**Primary:**
- HTML5 - Semantic markup for portfolio content
- CSS3 - Styling with CSS custom properties (variables) and modern features
- JavaScript (ES6+) - Client-side interactivity and theme switching

## Runtime

**Environment:**
- Browser (Client-side only) - Runs entirely in user's web browser
- No server-side runtime required

**Deployment:**
- GitHub Pages - Static site hosting
- Custom domain: kl-w.de (CNAME configured at `CNAME` file)

## Frameworks

**Core:**
- Vanilla JavaScript - No framework dependencies; pure DOM manipulation

**Icon Library:**
- Ionicons 5.5.2 - Icon set for social links, navigation, and UI elements
  - Loaded via unpkg CDN: `https://unpkg.com/ionicons@5.5.2/`
  - Both ES module and legacy script support

## Key Dependencies

**Critical:**
- Google Fonts - Typography delivery service
  - Share Tech Mono (Terminal/Neo-Tokyo theme)
  - Inter (Minimalist/Clean Architect theme)
  - Poppins (Original/Classic Professional theme)
  - JetBrains Mono (Playful theme)

**External:**
- Ionicons library - UI icon system via unpkg CDN

## Configuration

**Environment:**
- No environment variables required
- Configuration stored in browser localStorage (`portfolio-theme`)
- Theme settings persisted client-side only

**Theme System:**
- Default theme: minimalist (Clean Architect)
- Available themes: neo-tokyo, minimalist, original
- CSS dynamically loaded based on theme selection
- Font declarations managed in `assets/js/script.js` (lines 156-172)

## Platform Requirements

**Development:**
- Any text editor
- Git for version control
- Web browser for testing

**Production:**
- GitHub Pages repository
- Modern web browser (ES6+ JavaScript support)
- HTTPS enabled by default (GitHub Pages)

## Asset Structure

**CSS Files:**
- `assets/css/style-surprise.css` - Neo-Tokyo Terminal theme (27KB)
- `assets/css/style-minimalist.css` - Clean Architect theme (13KB)
- `assets/css/style.css` - Classic Professional theme
- `assets/css/style-playful.css` - Creative Coder theme (22KB)

**JavaScript:**
- `assets/js/script.js` - Navigation, theme switching, portfolio filtering
- No build process or minification

**Images:**
- `assets/images/` - Portfolio images and icons
- Static assets committed to repository

## Performance Characteristics

**Bundle Size:**
- HTML: ~30KB (index.html with Neo-Tokyo theme content)
- CSS: 13-27KB per theme (dynamically loaded)
- JavaScript: ~8KB (unminified)
- Total initial load: ~50KB + async font loads

**Optimization:**
- Google Fonts preconnect directives for faster font loading
- CSS custom properties for efficient theme switching
- Lazy loading for portfolio images
- No HTTP requests to external APIs (fonts and icons only)

---

*Stack analysis: 2026-02-17*
