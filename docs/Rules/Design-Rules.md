# Roampads — Design System & UI/UX Rules
> Guidelines for AI-assisted frontend development. Read this entire document before writing a single line of code or CSS.

---

## 0. Design Philosophy

Roampads is a **mid-term rental marketplace for digital nomads**. The aesthetic must feel like the intersection of a premium travel platform and a serious productivity tool. Think **Airbnb's clarity meets Linear's precision meets Monocle magazine's editorial confidence**.

**The 3 words that define every design decision:**
- **Trustworthy** — new platform, users need to feel safe transacting
- **Focused** — nomads are busy professionals, every pixel must earn its place
- **Grounded** — not flashy startup vibes, not corporate sterility — somewhere in between

**What we are NOT:**
- Not a generic SaaS dashboard
- Not an Airbnb clone with a different color
- Not a backpacker hostel app
- Not over-designed or try-hard

---

## 1. Color System

### Primary Palette
```css
:root {
  /* Backgrounds */
  --color-bg-base: #FAFAF8;          /* Warm off-white, never pure white */
  --color-bg-surface: #FFFFFF;        /* Cards, modals, elevated surfaces */
  --color-bg-subtle: #F4F3F0;        /* Subtle section backgrounds */
  --color-bg-inverse: #1A1A18;       /* Dark sections, footer */

  /* Brand */
  --color-brand: #1B4332;            /* Deep forest green — primary action */
  --color-brand-hover: #163A2B;      /* Darker on hover */
  --color-brand-light: #D8EDDF;      /* Light tint for badges, tags */

  /* Accent */
  --color-accent: #E8A838;           /* Warm amber — CTAs, highlights */
  --color-accent-hover: #D4962E;
  --color-accent-light: #FDF3DC;

  /* Text */
  --color-text-primary: #1A1A18;     /* Near-black, not pure #000 */
  --color-text-secondary: #6B6A66;   /* Subdued labels, metadata */
  --color-text-tertiary: #9D9C98;    /* Placeholder, disabled */
  --color-text-inverse: #FAFAF8;     /* On dark backgrounds */

  /* Borders */
  --color-border: #E5E4E0;           /* Default dividers */
  --color-border-strong: #CCCBC6;    /* Emphasized borders */

  /* Status */
  --color-success: #2D6A4F;
  --color-warning: #B45309;
  --color-error: #9B1C1C;
  --color-info: #1E40AF;

  /* Workspace Score Colors */
  --color-score-excellent: #1B4332;  /* 80-100 */
  --color-score-good: #2D6A4F;       /* 60-79 */
  --color-score-fair: #B45309;       /* 40-59 */
  --color-score-poor: #9B1C1C;       /* 0-39 */
}
```

### Color Rules
- **Never use pure black (#000) or pure white (#FFF)** — always the warm near-equivalents
- Brand green is reserved for **primary buttons, active states, and key data points** only
- Accent amber is for **CTAs that drive conversion** (Book Now, Contact Host, Search)
- Do not use gradients on backgrounds — use solid colors only
- No purple, no blue-purple, no teal — these are off-brand
- Transparency/opacity is allowed for overlays and hover states

---

## 2. Typography

### Font Stack
```css
/* Display — for hero headlines, hub names, listing titles */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap');

/* Body — for all UI text, labels, body copy */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

/* Mono — for prices, scores, data, IDs */
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');

:root {
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'DM Mono', 'Courier New', monospace;
}
```

### Type Scale
```css
:root {
  --text-xs: 0.75rem;      /* 12px — captions, legal */
  --text-sm: 0.875rem;     /* 14px — metadata, labels */
  --text-base: 1rem;       /* 16px — body default */
  --text-lg: 1.125rem;     /* 18px — emphasized body */
  --text-xl: 1.25rem;      /* 20px — card titles */
  --text-2xl: 1.5rem;      /* 24px — section headers */
  --text-3xl: 1.875rem;    /* 30px — page titles */
  --text-4xl: 2.25rem;     /* 36px — hero headings */
  --text-5xl: 3rem;        /* 48px — landing hero only */
}
```

### Typography Rules
- **Display font** (Playfair Display): hub names, listing titles, hero headlines, section headings
- **Body font** (DM Sans): everything else — labels, descriptions, buttons, navigation, metadata
- **Mono font** (DM Mono): prices, WiFi speeds, scores, listing IDs, dates
- Line height: 1.2 for headings, 1.6 for body copy, 1.4 for UI elements
- Letter spacing: -0.02em for large headings, 0.04em for uppercase labels/badges
- **Never use bold > 600 weight** in body copy — use color contrast instead
- Maximum line length: 65 characters for body text blocks

---

## 3. Spacing System

```css
:root {
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
}
```

### Spacing Rules
- Section padding (vertical): `--space-16` to `--space-24` on desktop, `--space-12` on mobile
- Card internal padding: `--space-4` to `--space-6`
- Form field padding: `--space-3` vertical, `--space-4` horizontal
- Between related elements (label + input): `--space-2`
- Between unrelated sections: `--space-12` minimum
- **Be generous with whitespace** — it signals premium, not emptiness

---

## 4. Border Radius

```css
:root {
  --radius-sm: 4px;      /* Tags, badges, small chips */
  --radius-md: 8px;      /* Inputs, small buttons */
  --radius-lg: 12px;     /* Cards, modals — MAXIMUM for most elements */
  --radius-full: 9999px; /* Pills, avatars only */
}
```

### Radius Rules
- **Hard limit: `--radius-lg` (12px) maximum** on cards and containers
- Do NOT use `rounded-2xl` (16px), `rounded-3xl` (24px), or `rounded-full` on cards
- Buttons: `--radius-md` (8px) — not pill-shaped unless it's a tag filter
- Input fields: `--radius-md` (8px)
- Images within cards: inherit the card's border-radius, not their own
- Map pins: `--radius-full` is acceptable
- Avatar/profile pictures: `--radius-full`

---

## 5. Shadows & Elevation

```css
:root {
  /* MINIMAL shadow usage — prefer borders */
  --shadow-sm: 0 1px 2px rgba(26, 26, 24, 0.06);   /* Subtle lift */
  --shadow-md: 0 2px 8px rgba(26, 26, 24, 0.08);   /* Cards on hover */
  --shadow-lg: 0 4px 16px rgba(26, 26, 24, 0.10);  /* Modals, dropdowns */
}
```

### Shadow Rules
- **Default state: NO shadow** — use border (`1px solid var(--color-border)`) instead
- Shadow only on **hover state** of interactive cards
- Shadow only on **modals, dropdowns, and floating elements**
- No `box-shadow` with color tints or brand colors (no green/amber shadows)
- No `text-shadow` anywhere
- Elevation is communicated through **border + background difference**, not shadow depth
- Modals: `--shadow-lg` + semi-transparent backdrop overlay

---

## 6. Component Specifications

### 6.1 Listing Card
```
Structure:
├── Image (aspect-ratio: 4/3, object-fit: cover)
│   ├── Badge top-left: "Verified Partner" | "New" | workspace tier
│   └── Favorite button top-right (heart icon)
├── Card Body (padding: --space-4)
│   ├── Row 1: City · Neighborhood (text-sm, --color-text-secondary)
│   ├── Row 2: Title (text-xl, --font-display, --color-text-primary, 2 lines max)
│   ├── Row 3: WiFi speed + Workspace score (text-sm, --font-mono)
│   ├── Row 4: Price/month (text-2xl, --font-mono, --color-text-primary, bold)
│   │         + "/month" label (text-sm, --color-text-secondary)
│   └── Row 5: Amenity pills (max 3 visible)
```
- Card border: `1px solid var(--color-border)`
- Card radius: `var(--radius-lg)` (12px)
- Card shadow default: none
- Card shadow hover: `var(--shadow-md)` + translateY(-2px) transition 200ms ease
- Image ratio: always 4:3, never stretch
- Price: ALWAYS visible, never hidden behind login wall on card view

### 6.2 Buttons
```css
/* Primary — main conversion action */
.btn-primary {
  background: var(--color-brand);
  color: var(--color-text-inverse);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-weight: 500;
  font-size: var(--text-base);
  border: none;
  transition: background 150ms ease;
}
.btn-primary:hover { background: var(--color-brand-hover); }

/* CTA — amber, for booking/contact */
.btn-cta {
  background: var(--color-accent);
  color: var(--color-text-primary);
  /* same sizing as primary */
}

/* Secondary — outlined */
.btn-secondary {
  background: transparent;
  border: 1px solid var(--color-border-strong);
  color: var(--color-text-primary);
}

/* Ghost — minimal */
.btn-ghost {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
}
```
- Minimum touch target: 44px height
- Icon buttons: 40×40px minimum
- Loading state: replace text with spinner, maintain width
- Disabled state: 40% opacity, cursor not-allowed, no hover effect

### 6.3 Search Bar / Filters
- Search input: full-width, height 52px on desktop, 48px on mobile
- Background: `--color-bg-surface` with `1px solid var(--color-border-strong)`
- On focus: border color changes to `--color-brand`, no glow/shadow
- Filter chips: `--radius-sm`, `1px solid var(--color-border)`, tap to toggle
- Active filter: background `--color-brand-light`, border `--color-brand`, text `--color-brand`
- Price range: use a simple min/max input pair, not a slider (sliders are imprecise on mobile)

### 6.4 Badges & Tags
```
Workspace Tier badges:
- BUSINESS: background #D8EDDF, text #1B4332, border 1px solid #A7D9B8
- PRO: background #E8F4FD, text #1E40AF, border 1px solid #BFDBFE  
- CASUAL: background #F4F3F0, text #6B6A66, border 1px solid #E5E4E0

Status badges:
- Verified Partner: background #D8EDDF, text #1B4332, with checkmark icon
- New: background #FDF3DC, text #B45309
```
- Badge height: 22px
- Badge padding: 2px 8px
- Badge font: `--text-xs`, uppercase, letter-spacing 0.04em, weight 500
- Max 2 badges visible on card simultaneously

### 6.5 Price Display
- Monthly price: `--font-mono`, `--text-2xl`, weight 500, `--color-text-primary`
- "/ month" suffix: `--text-sm`, `--color-text-secondary`, normal weight
- Daily breakdown: `--font-mono`, `--text-sm`, `--color-text-tertiary`
- Crossed-out original price: `--color-text-tertiary`, text-decoration line-through
- Always show inclusive price (utilities included label in green if applicable)

### 6.6 Map
- Use Mapbox (already in stack) with a custom light style, not default colorful tiles
- Map pins: custom SVG, circular, 36×36px, background `--color-brand`, price label in white
- Active/selected pin: scale 1.2, background `--color-accent`
- Cluster pins: count inside, same style
- Map controls (zoom): bottom right, minimal style
- "Refresh as I move map" toggle: visible checkbox, `--text-sm`
- Split view (list + map): 45% list / 55% map on desktop

### 6.7 Navigation
```
Desktop navbar:
├── Logo (left)
├── Search bar (center, condensed version)
└── Right: [List your property] [Sign in] [Avatar menu]

Mobile navbar:
├── Logo (left)
└── Hamburger (right)

Bottom tab bar (mobile app-like):
├── Explore (grid icon)
├── Map (map icon)  
├── Saved (heart icon)
└── Account (person icon)
```
- Navbar height: 64px desktop, 56px mobile
- Navbar background: `--color-bg-surface` with `border-bottom: 1px solid var(--color-border)`
- NO navbar shadow
- Active nav item: `--color-brand` color, not underline

---

## 7. Layout System

### Grid
```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-6);  /* 24px on desktop */
}

/* Mobile */
@media (max-width: 768px) {
  .container { padding: 0 var(--space-4); }
}
```

### Listing Grid
- Desktop (≥1280px): 4 columns
- Laptop (≥1024px): 3 columns
- Tablet (≥768px): 2 columns
- Mobile (<768px): 1 column (full width cards)
- Gap between cards: `--space-5` (20px) desktop, `--space-4` (16px) mobile

### Hub Page Layout
- Hero: full-width image + overlay text, 60vh height
- Content below: container with sidebar (filters, 280px) + main (listings grid)
- On mobile: filters collapse into a bottom sheet triggered by "Filters" button

---

## 8. Imagery Rules

### Listing Photos
- **First photo = workspace/desk setup** — this is our differentiator, maintain it
- Minimum resolution: 800×600px
- Always use `object-fit: cover`, never `contain`
- Aspect ratio locked at 4:3 in card view
- Full-screen detail view: 16:9 or natural ratio
- Lazy load all images below the fold
- Show skeleton loader (not spinner) while loading
- Alt text: always include listing title + city

### Photo Gallery (Detail Page)
- Grid layout: 1 large left + 2 small right (Airbnb-style), max 5 visible
- "Show all photos" button to open full-screen carousel
- Carousel: keyboard navigable, swipe on mobile

### No Stock Photo Illustrations
- Do not use generic stock photos of laptops on beaches
- Do not use illustration-heavy hero sections (Zumper-style cartoon cities are off-brand for us)
- Use real listing photos or neutral abstract photography

---

## 9. Forms & Inputs

### Input Fields
```css
.input {
  height: 48px;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  background: var(--color-bg-surface);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-text-primary);
  transition: border-color 150ms ease;
}
.input:focus {
  outline: none;
  border-color: var(--color-brand);
}
.input::placeholder { color: var(--color-text-tertiary); }
.input.error { border-color: var(--color-error); }
```

### Form Layout Rules
- Labels always above inputs, never inside (placeholder only as supplemental hint)
- Error messages: below the field, `--text-sm`, `--color-error`
- Required fields: asterisk after label, not before
- Submit buttons: full-width on mobile, fixed-width (160px min) on desktop
- Do NOT use floating labels (they break on autofill)

---

## 10. Trust & Social Proof Elements

These are critical for conversion — style them prominently but not desperately.

### Verification Badges
- "Verified Partner" badge: always green, checkmark icon, on listing cards and detail pages
- "Guest-Verified" (reviews confirmed): secondary badge, smaller
- Host profile: verified tick next to name if verified

### Review Display
- Star rating: use amber stars (`--color-accent`), show numeric score in mono font
- Review count: "(47 reviews)" in `--color-text-secondary`
- On cards: show rating + count only if ≥3 reviews
- On detail page: show top 3 reviews with expand option

### Trust Indicators (Detail Page)
```
Row of 4 trust signals:
├── 🔒 Secure Payment (Stripe)
├── ✓ Verified Workspace
├── 📋 Digital Contract
└── 💬 Direct Host Contact
```
- Style: icon + short label, horizontal row, `--text-sm`, `--color-text-secondary`
- Add subtle separator between each
- Place directly below price/CTA box

### Social Proof Counter (Listings Page)
- "X nomads viewed listings in [City] this week"
- Style: `--text-sm`, `--color-text-secondary`, with a small pulsing dot indicator
- Position: top of listings grid, below filters

---

## 11. Motion & Interaction

### Transition Defaults
```css
:root {
  --transition-fast: 100ms ease;
  --transition-base: 150ms ease;
  --transition-slow: 250ms ease;
  --transition-layout: 300ms ease;
}
```

### Allowed Animations
- Card hover: `transform: translateY(-2px)` + shadow reveal — `150ms ease`
- Button hover: background color shift — `150ms ease`
- Filter toggle: background/border color — `100ms ease`
- Page load: staggered fade-in of cards (`opacity 0 → 1`, `translateY 8px → 0`)
- Skeleton loader: shimmer animation (`background-position` shift)
- Map pin active: `scale(1.2)` — `150ms ease`
- Modal open: `opacity 0 → 1` + `scale(0.98 → 1)` — `200ms ease`

### Forbidden Animations
- No spinning loaders on content (use skeleton instead)
- No bounce or elastic easing on UI elements
- No parallax scrolling effects
- No auto-playing carousels
- No full-page transitions/slide animations between routes

---

## 12. Mobile-First Rules

### Breakpoints
```css
/* Mobile first — base styles are mobile */
/* sm */ @media (min-width: 640px) { }
/* md */ @media (min-width: 768px) { }
/* lg */ @media (min-width: 1024px) { }
/* xl */ @media (min-width: 1280px) { }
```

### Mobile-Specific Patterns
- Bottom sheet for filters (not sidebar)
- Sticky bottom CTA bar on listing detail page ("From $X/month · Book Now")
- Tap targets minimum 44×44px — never smaller
- Search bar: full-width, prominent placement at top
- Swipe gestures on photo galleries
- Avoid hover-only information — all info must be tappable

### Mobile Navigation
- No hamburger menu for primary actions — use bottom tab bar
- Floating action button (FAB) for primary conversion if needed
- Back button always visible and accessible

---

## 13. Empty States & Edge Cases

### No Results
```
Icon (simple, line-style, not illustrated)
Heading: "No listings found in [City]"
Body: "Be the first to know when new listings are added."
CTA: "Get notified" (email capture)
```

### Loading State
- Use skeleton cards (gray animated blocks matching card layout)
- Skeleton duration: shimmer 1.5s infinite
- Show exactly N skeleton cards matching expected grid count

### Error State (Page/Hub not found)
- Friendly message, not a raw 404
- Search bar to try another destination
- Link back to homepage

### Empty Wishlist
- Simple illustration-free message
- CTA to explore listings

---

## 14. Accessibility Rules

- Color contrast ratio: minimum 4.5:1 for body text, 3:1 for large text
- All interactive elements keyboard-navigable
- Focus styles: `outline: 2px solid var(--color-brand)` + `outline-offset: 2px` — never remove outline
- Images: always meaningful alt text
- Form inputs: always associated label (htmlFor)
- Loading states: aria-live announcements for screen readers
- Modals: focus trap, Escape key closes, aria-modal
- Icon-only buttons: always include sr-only label text

---

## 15. What NOT to Do

### Design Anti-Patterns (Hard Rules)
- ❌ No `border-radius` above 12px on cards/containers
- ❌ No colored drop shadows or brand-tinted shadows
- ❌ No glassmorphism / frosted glass effects
- ❌ No gradient backgrounds on page sections
- ❌ No decorative illustrations or cartoon graphics
- ❌ No auto-play sliders or carousels
- ❌ No sticky sidebar ads or pop-over promotions
- ❌ No full-screen modal on first visit (newsletter pop-ups)
- ❌ No infinite scroll without a "Load more" fallback
- ❌ No price hidden behind login on browse/search pages
- ❌ No purple, teal, or blue-tinted brand colors
- ❌ No Inter, Roboto, or system-ui as display font
- ❌ No pure #000 or pure #FFF anywhere

### Content Anti-Patterns
- ❌ Never say "Check availability" as the primary CTA — say "Book Now" or "Contact Host"
- ❌ Never truncate the price — always show it
- ❌ Never show empty hub pages — enforce minimum 3 listings rule
- ❌ Never use "Submit" as a button label — use action verbs ("Send Request", "Book Now", "Get Access")

---

## 16. Tailwind Configuration Reference

If using Tailwind, extend the config to match this system:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#1B4332', hover: '#163A2B', light: '#D8EDDF' },
        accent: { DEFAULT: '#E8A838', hover: '#D4962E', light: '#FDF3DC' },
        surface: '#FFFFFF',
        base: '#FAFAF8',
        subtle: '#F4F3F0',
        border: { DEFAULT: '#E5E4E0', strong: '#CCCBC6' },
        text: {
          primary: '#1A1A18',
          secondary: '#6B6A66',
          tertiary: '#9D9C98',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'Courier New', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',  /* MAXIMUM for cards */
      },
      boxShadow: {
        sm: '0 1px 2px rgba(26, 26, 24, 0.06)',
        md: '0 2px 8px rgba(26, 26, 24, 0.08)',
        lg: '0 4px 16px rgba(26, 26, 24, 0.10)',
      },
    },
  },
}
```

---

## 17. Component Checklist (Before Shipping Any UI)

Before marking any component as done, verify:

- [ ] Uses CSS variables from the design system, not hardcoded values
- [ ] Fonts: display only for headings, body for UI, mono for data/prices
- [ ] Border radius ≤ 12px on any card or container
- [ ] No shadows in default state (only on hover/elevated states)
- [ ] Price is visible without login
- [ ] Mobile layout tested at 375px width
- [ ] Keyboard navigation works
- [ ] Loading state exists (skeleton, not spinner)
- [ ] Empty state exists
- [ ] Error state exists
- [ ] Transitions use the defined timing variables
- [ ] No hardcoded colors outside the palette