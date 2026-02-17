# External Integrations

**Analysis Date:** 2026-02-17

## APIs & External Services

**Font Delivery:**
- Google Fonts API - Web font hosting
  - Service: fonts.googleapis.com, fonts.gstatic.com
  - No authentication required
  - DNS preconnect enabled for performance
  - Loaded fonts:
    - Share Tech Mono (Terminal theme, lines 28 in index.html)
    - Inter (Minimalist theme)
    - Poppins (Classic theme)
    - JetBrains Mono (Playful theme)

**Icon Library:**
- Ionicons CDN (unpkg) - Icon set delivery
  - URL: https://unpkg.com/ionicons@5.5.2/dist/ionicons/
  - Version: 5.5.2
  - Dual loading: ES module + legacy script fallback
  - Used for: navigation icons, social media links, UI elements

## Data Storage

**Client-Side Storage:**
- Browser localStorage - Theme persistence
  - Key: `portfolio-theme`
  - Values: 'neo-tokyo', 'minimalist', 'original'
  - Scope: Single domain (kl-w.de)
  - No server-side database required

**File Storage:**
- GitHub Pages static hosting
  - Repository: kwallaschek.github.io
  - All assets committed and version-controlled
  - No dynamic file uploads

**Caching:**
- Browser cache - Static assets cached by browser
- GitHub Pages CDN caching - Automatic

## Authentication & Identity

**Auth Provider:**
- None - Completely public portfolio
- No user authentication required
- No login system

**Contact Methods:**
- Email: kayluis.wallaschek@gmail.com (mailto links only)
- No form submission backend
- No contact form processing

**Social Integrations:**
- Links only (no API integration):
  - GitHub: https://github.com/kwallaschek
  - LinkedIn: https://www.linkedin.com/in/kay-luis-wallaschek-195396188/
  - Email (mailto): kayluis.wallaschek@gmail.com

## Monitoring & Observability

**Error Tracking:**
- None configured - No error logging service

**Logs:**
- Browser console only
- No server-side logging
- No analytics implemented

**Analytics:**
- Not detected - No tracking service identified

## CI/CD & Deployment

**Hosting:**
- GitHub Pages
  - Repository: kwallaschek.github.io (master branch)
  - Automatic deployment on push
  - HTTPS enabled by default

**CI Pipeline:**
- None configured - Static site requires no build process
- Direct git push to GitHub triggers deployment

**Domain Management:**
- Custom domain: kl-w.de
  - Configured via CNAME file: `CNAME` (contains "kl-w.de")
  - DNS points to GitHub Pages infrastructure

## Environment Configuration

**Required env vars:**
- None - No environment variables used

**Secrets location:**
- Not applicable - No secrets required
- All configuration is public and committed to repository

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

**GitHub Integration:**
- Standard GitHub Pages deployment (automatic on push)
- No webhook configuration

## Build Process

**Build Requirements:**
- None - No build step required
- HTML, CSS, JavaScript served directly as-is
- No minification or bundling

**Development Workflow:**
- Edit files locally
- Test in browser
- Git commit and push
- GitHub Pages auto-deploys

## External Analytics & Monitoring

**Google Verification:**
- Google Search Console verification file: `google64f0f9f3451338a1.html`
- Purpose: Domain verification for search console

## Third-Party Content

**Performance Characteristics:**
- Google Fonts: ~50-100ms latency (cached after first load)
- Ionicons: ~100-150ms latency (unpkg CDN)
- Total external requests: 4-6 HTTP/2 requests
- No tracking or analytics calls

**Fallback Strategy:**
- Fonts: System fonts (sans-serif) if Google Fonts unavailable
- Icons: Not gracefully degraded; requires Ionicons CDN
- No service workers or offline capabilities

---

*Integration audit: 2026-02-17*
