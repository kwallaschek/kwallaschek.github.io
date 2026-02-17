# Codebase Structure

**Analysis Date:** 2026-02-17

## Directory Layout

```
kwallaschek.github.io/
├── index.html                  # Main entry point (minimalist theme)
├── index-minimalist.html       # Alternative minimalist theme (local only)
├── index-playful.html          # Alternative playful theme (local only)
├── index-surprise.html         # Alternative neo-tokyo theme (local only)
├── CNAME                        # Custom domain configuration
├── LICENSE                      # Repository license
├── README.md                    # Repository description
├── CLAUDE.md                    # Development session notes
├── assets/
│   ├── css/
│   │   ├── style-minimalist.css # Clean Architect theme (18KB, deployed)
│   │   ├── style-surprise.css   # Neo-Tokyo Terminal theme (32KB, deployed)
│   │   ├── style.css            # Classic Professional theme (35KB, deployed)
│   │   └── style-playful.css    # Creative Coder theme (22KB, local only)
│   ├── images/
│   │   ├── my-avatar_3.png      # Profile avatar image
│   │   ├── icon-design.svg      # Service icon: Architecture
│   │   ├── icon-dev.svg         # Service icon: Development
│   │   ├── icon-photo.svg       # Service icon: Hobbies
│   │   ├── logo.ico             # Favicon
│   │   ├── eray.jpg             # Portfolio project: e.Ray
│   │   ├── neattcp.jpg          # Portfolio project: NEAT-TCP
│   │   ├── plab.jpg             # Portfolio project: Practical Evaluation
│   │   ├── tk4.jpg              # Portfolio project: Social Life Tracking
│   │   ├── noteplan_kibela.jpg  # Portfolio project: NotePlan Integration
│   │   └── youtify.png          # Portfolio project: Youtify
│   └── js/
│       └── script.js            # Main JavaScript (316 lines)
└── google64f0f9f3451338a1.html  # Google Search Console verification
```

## Directory Purposes

**Root Directory:**
- Purpose: GitHub Pages deployment root with main HTML entry point
- Contains: HTML files (deployed and alternatives), configuration files
- Key files: `index.html` (deployed), alternative HTML versions for local testing

**`assets/css/`:**
- Purpose: Centralized styling organized by theme
- Contains: 4 CSS files representing different design systems
- Key files:
  - `style-minimalist.css`: Active theme (Clean Architect, 8px grid system, Inter font)
  - `style-surprise.css`: Active theme (Neo-Tokyo Terminal, Share Tech Mono, scanlines)
  - `style.css`: Active theme (Classic Professional, Poppins, traditional layout)
  - `style-playful.css`: Inactive theme (backup option for future use)

**`assets/images/`:**
- Purpose: Static image assets for portfolio display
- Contains: Avatar, icons, and project thumbnails
- Key files:
  - `my-avatar_3.png`: User profile picture (sidebar)
  - `icon-*.svg`: Service category icons in About section
  - Project images: Portfolio section thumbnails

**`assets/js/`:**
- Purpose: Client-side interactivity and state management
- Contains: Single JavaScript file handling all interactions
- Key files: `script.js` (only file, ~316 lines)

## Key File Locations

**Entry Points:**

- `index.html`: Main portfolio page (deployed to domain root)
  - Loads `style-minimalist.css` by default
  - Includes all HTML structure for three pages (About, Resume, Portfolio)
  - Initializes theme system with localStorage

**Configuration:**

- `CNAME`: Maps custom domain to GitHub Pages (contains: `kwallaschek.com` or similar)
- `google64f0f9f3451338a1.html`: Search Console verification file

**Core Logic:**

- `assets/js/script.js`: All JavaScript behavior
  - Theme switching (lines 148-316)
  - Page navigation (lines 124-144)
  - Portfolio filtering (lines 43-99)
  - Sidebar toggle (lines 10-15)
  - Modal interactions (lines 19-39)
  - Form validation (lines 103-120)

**Visual Design:**

- `assets/css/style-minimalist.css`: Primary theme CSS (Active on page load)
- `assets/css/style-surprise.css`: Alternative theme CSS (Neo-Tokyo)
- `assets/css/style.css`: Alternative theme CSS (Classic)

**Content Assets:**

- `assets/images/my-avatar_3.png`: Profile image for sidebar
- `assets/images/icon-*.svg`: Service/skill icons (3 files)
- `assets/images/*.jpg`, `*.png`: Portfolio project thumbnails (7 files)

## Naming Conventions

**Files:**

- HTML entry points: Lowercase with hyphens separating variants
  - `index.html` (main/deployed)
  - `index-minimalist.html` (local variant)
  - `index-surprise.html` (local variant)
  - `index-playful.html` (local variant)

- CSS files: Descriptive theme names with hyphens
  - `style.css` (classic/original theme)
  - `style-minimalist.css` (minimalist theme)
  - `style-surprise.css` (neo-tokyo/surprise theme)
  - `style-playful.css` (playful theme)

- Image files: Kebab-case with descriptive purpose
  - `my-avatar_3.png` (underscore for version)
  - `icon-design.svg` (icon + purpose)
  - `icon-dev.svg`
  - `icon-photo.svg`
  - Project name: `neattcp.jpg`, `eray.jpg`, `plab.jpg` (lowercase, no separators)

**Directories:**

- Lowercase plural: `assets`, `css`, `images`, `js`
- Purpose-driven organization: Each subdirectory has single responsibility

**Data Attributes (JavaScript):**

- Format: `data-kebab-case`
- Prefixes indicate function:
  - `data-sidebar*`: Sidebar functionality
  - `data-nav*`: Navigation system
  - `data-page`: Content pages
  - `data-filter*`: Portfolio filtering
  - `data-modal*`: Modal interactions
  - `data-form*`: Form validation
  - `data-theme*`: Theme system
  - `data-portfolio*`: Portfolio-specific

## Where to Add New Code

**New Feature:**

- Primary code: Vanilla JavaScript functions in `assets/js/script.js`
  - Pattern: Query elements → Add event listener → Toggle classes
  - Storage: localStorage for persistent state

- Styling: Add to relevant theme CSS file (`assets/css/style-*.css`)
  - Start with CSS variables (defined in :root)
  - Follow existing naming convention: `--category-name`
  - Use existing spacing scale (--space-1 through --space-12)

**New Component/Module:**

- HTML: Add markup to appropriate `<article data-page="...">` section in `index.html`
- Styling: Add CSS rules to all four theme files for consistency
- Behavior: Add JavaScript event listeners in `assets/js/script.js`
- Data attributes: Use consistent naming pattern (see above)

**New Theme:**

1. Create new CSS file: `assets/css/style-[name].css` (copy from existing theme as template)
2. Define custom properties in `:root` for colors, fonts, sizes
3. Add theme configuration to `script.js` themes object:
   ```javascript
   '[name]': {
     cssFile: './assets/css/style-[name].css',
     name: 'Display Name',
     fontLink: 'https://fonts.googleapis.com/css2?family=...'
   }
   ```
4. Add theme option to dropdown in `index.html`:
   ```html
   <div class="theme-option" data-theme="[name]">
     <div class="theme-preview [name]-preview"></div>
     <span>Display Name</span>
     <ion-icon name="checkmark-outline" class="checkmark"></ion-icon>
   </div>
   ```

**Utilities/Helpers:**

- JavaScript utilities: Add to top of `script.js` near existing helpers
- CSS utilities/mixins: Not used; use CSS variables instead for consistency
- Shared constants: Define in `script.js` near top (see `themes` object as example)

## Special Directories

**`.planning/codebase/`:**
- Purpose: Documentation for code navigation and planning
- Generated: By GSD mapper, not manually created
- Committed: Yes, for reference by orchestration tools
- Contents: ARCHITECTURE.md, STRUCTURE.md, and other analysis documents

**`node_modules/` (if present):**
- Purpose: External dependencies (not currently used in this project)
- Generated: Yes, by npm install
- Committed: No (in .gitignore if Node.js ever added)

**`.git/`:**
- Purpose: Version control metadata
- Generated: Yes, by git
- Committed: No, system directory

---

*Structure analysis: 2026-02-17*
