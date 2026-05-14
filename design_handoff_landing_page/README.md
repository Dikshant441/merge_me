# Handoff: Merge Me Landing Page

A photo-driven, editorial landing page for **Merge Me** — the dating platform for developers.

---

## ⚠️ About these files

The files in this bundle are **design references created in HTML/JSX with inline Babel**. They are *prototypes that show the intended look and behavior*, not production code to copy directly.

**Your task:** Recreate the design in the existing Merge Me frontend codebase using its established patterns:

- React 19 + Vite
- Tailwind CSS v4 + DaisyUI v5 (already set up in `frontend/src/index.css`)
- React Router v7
- Redux Toolkit (state in `frontend/src/utils/*Slice.js`)

Do **NOT** copy the inline `<style>` block from `Landing Page.html` wholesale. Translate the design into Tailwind utility classes (and a small amount of arbitrary-value CSS where Tailwind can't reach).

---

## Fidelity

**High-fidelity.** Final colors, typography, spacing, and copy are all dialed in. Recreate the design pixel-perfectly. Below the README each value is enumerated.

---

## Where this lives in the app

The current `frontend/src/App.jsx` routes `/` directly to `<Body>` → `<Feed>`, which 401-redirects logged-out users to `/login`. The landing page should be the **public face of `/`** for unauthenticated visitors.

### Recommended routing change

```jsx
// frontend/src/App.jsx
<Routes>
  <Route path="/" element={<Body />}>
    <Route index element={<LandingOrFeed />} />   {/* NEW gate */}
    <Route path="login" element={<LogIn />} />
    <Route path="signup" element={<LogIn />} />
    <Route path="feed" element={<Feed />} />       {/* move feed off "/" */}
    {/* …rest unchanged */}
  </Route>
</Routes>
```

```jsx
// frontend/src/components/LandingOrFeed.jsx
import { useSelector } from "react-redux";
import Landing from "./Landing";
import Feed from "./Feed";
export default function LandingOrFeed() {
  const user = useSelector((s) => s.user);
  return user ? <Feed /> : <Landing />;
}
```

The existing `<Navbar>` only renders user-specific UI when `user` is truthy, so it can stay in `<Body>` without changes. If you want a different (logged-out, marketing-flavored) nav on the landing page, render it inside `<Landing>` and hide `<Navbar>` for the index route — your call.

The **`git init love`** CTA button should `navigate("/signup")`. The **Sign in** button should `navigate("/login")`.

---

## Page structure

```
<Landing>
  <Nav>                      ← brand · links · status · sign-in · CTA
  <Hero>                     ← headline + lede + CTA + trust strip + photo-card stack
  <Gallery>                  ← "Recently merged into main" — couple photos collage
  <Features>                 ← 3 feature cards
  <CtaStrip>                 ← Full-bleed group photo + CTA
  <Footer>                   ← copyright + links
```

### 1. Nav
- Sticky? No — relative, sits at top.
- Height: 72px.
- Left: 28×28 rounded-[8px] black mark with monospace "M", brand text "Merge Me".
- Middle: links (Features / How it works / Pricing / Docs).
- Right: monospace status pill `"main · last push 2m ago"`, ghost **Sign in**, primary **git init love** (monospace inside).
- Below 720px: hide nav-links. Below 1100px: hide status text.

### 2. Hero
2-column grid (`1fr | 1.15fr`) — left = type, right = card stack.

**Left column**
- Pill `v1.0 · public beta` with pulsing accent dot.
- H1: `Find your perfect <em>merge conflict</em>.`
  - `<em>` is **Instrument Serif italic** with a 3-color gradient (coral-2 → coral → amber). All other H1 text is **Geist 600** with tight letter-spacing.
  - `clamp(44px, 5.6vw, 84px)`, line-height 0.98, letter-spacing -0.035em.
- Lede paragraph (max-width 460px, 19px, ink-2 color).
- CTA row: primary `git init love` (mono inside) + ghost `Docs` + small hint with ⌘K kbd chips.
- Trust strip (top-bordered): 5 overlapping 32px circular avatars (real photos) + `"24,182 developers from 1,400 companies — and counting."`

**Right column — photo stack stage**
- Square-ish stage (aspect 1 / 1.08, max-width 600px).
- **4 decorative floating "polaroid" photos** at corners (-7°, +6°, +8°, -5° rotation), each with paper-style padding, a small monospace caption inside (`@ada × @theo · rust+ec`), and `display: none` below 1100px.
- **Centered swipe stack** — 3 absolutely-stacked cards, top one is draggable. Each card:
  - Full-bleed photo (object-cover).
  - Gradient overlay (transparent → black .55) on bottom half.
  - White overlay text bottom-left: name (Geist 600 26px), age (mono 18px), role (mono 13px), then tag chips (glass-blur background, rounded-6).
  - "Match" tags (the ones the user shares) get a coral background.
- **"Merge" / "Pass" stamps** that fade in during drag (-8° / +8° rotation).
- **Action bar** — pill-shaped (white surface, rounded-full) at bottom-center of stage. Pass (✕) and Merge (✓) buttons with a live `$ git commit -m "..."` status between them.

### 3. Gallery — "Recently merged into main"
- Eyebrow `RECENTLY MERGED INTO MAIN` with a small gradient hairline before it.
- Title `Real <em>stories</em>, real <em>stacks</em>.` (both `<em>` use gradient like the hero).
- Right-aligned subtitle (max-width 360px).
- **Asymmetric 12-column collage** of 6 couple photos with these spans:
  - pc-a: col-span 5, row-span 5
  - pc-b: col-span 4, row-span 3
  - pc-c: col-span 3, row-span 4
  - pc-d: col-span 4, row-span 4
  - pc-e: col-span 5, row-span 3
  - pc-f: col-span 3, row-span 3
  - `grid-auto-rows: 90px`, `gap: 16px`, `border-radius: 14px`.
- Each tile: full-bleed photo, gradient overlay, top-left "corner tape" tag (`commit #0001`, glass-blur), bottom caption (name + meta + status stamp).

### 4. Features
- Same head-pattern as gallery (eyebrow + 2× gradient `<em>` title + right subtitle).
- 3-column grid (`1.1fr | 1fr | 1fr`).
- Each card: `border-radius: 20px`, `padding: 28px`, `min-height: 380px`.
- Each card has a **subtle corner radial tint** — card 1 coral, 2 amber, 3 violet (see `--feature-tint`).
- Each card: small mono number (`01`), title (with gradient `<em>` word), body paragraph, then a "viz" block at the bottom that visualizes the feature:
  - **01 Stack match** — two side-by-side mini lists with overlapping items in coral.
  - **02 Chat in code blocks** — 2 chat bubbles with embedded code blocks.
  - **03 Verified** — 3 rows of `✓ GitHub @aanya-i · 4y · 218 repos`-style entries.

### 5. CTA Strip
- Full-width rounded-24 banner inside the container.
- Background: `photos/hero-crew.png`, `object-position: center 35%`, with a left-to-right dark warm gradient (`rgba(20,16,8,.85) → .35`).
- Content (max 720px, padding 48px 56px): pill, H2 with gradient `<em>shipping</em>`, sub-paragraph, primary white button + ghost button.

### 6. Footer
- Border-top, 32/56 padding.
- Left: small brand mark + © + green "● all systems operational".
- Right: 4 links.

---

## Design tokens

Add these to `frontend/tailwind.config.*` (or use `@theme` in `index.css` with Tailwind v4 native syntax):

```css
/* index.css — extends what's already there */
@import "tailwindcss";
@plugin "daisyui" { themes: light --default, dark; }

@theme {
  /* Light theme (default) */
  --color-bg:       #F4EFE5;
  --color-bg-2:     #E8DFCC;
  --color-surface:  #FFFDF8;
  --color-paper:    #FBF5E8;
  --color-ink:      #1A130A;
  --color-ink-2:    rgba(26,19,10,.70);
  --color-ink-3:    rgba(26,19,10,.50);
  --color-ink-4:    rgba(26,19,10,.26);
  --color-border:   rgba(40,24,8,.10);
  --color-border-2: rgba(40,24,8,.18);

  --color-accent:    oklch(0.64 0.20 30);   /* coral */
  --color-accent-2:  oklch(0.50 0.22 28);   /* deep coral */
  --color-accent-3:  oklch(0.78 0.16 70);   /* amber */
  --color-accent-4:  oklch(0.58 0.18 280);  /* violet */

  --font-sans:  "Geist", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-mono:  "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  --font-serif: "Instrument Serif", Georgia, serif;
  --font-deva:  "Noto Sans Devanagari", "Geist", ui-sans-serif, system-ui, sans-serif;

  --radius-card:  14px;
  --radius-pill:  999px;
  --radius-btn:   12px;

  --shadow-card:  0 1px 0 rgba(255,255,255,.8) inset, 0 2px 6px rgba(28,22,14,.06), 0 24px 60px -20px rgba(28,22,14,.22);
  --shadow-photo: 0 1px 0 rgba(255,255,255,.6) inset, 0 1px 2px rgba(28,22,14,.06), 0 18px 36px -16px rgba(28,22,14,.32);
  --shadow-soft:  0 1px 0 rgba(255,255,255,.8) inset, 0 1px 2px rgba(28,22,14,.04), 0 12px 28px -14px rgba(28,22,14,.14);
}
```

Load fonts in `frontend/index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Geist:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

### Background mesh

This is a *fixed background layer behind the whole landing page* — match the design exactly:

```css
.landing-bg {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(ellipse 80% 60% at 88% 8%,  oklch(0.80 0.18 38 / .55), transparent 60%),
    radial-gradient(ellipse 60% 50% at 12% 22%, oklch(0.88 0.14 70 / .50), transparent 60%),
    radial-gradient(ellipse 70% 60% at 4% 92%,  oklch(0.82 0.10 320 / .35), transparent 60%),
    radial-gradient(ellipse 50% 40% at 95% 80%, oklch(0.74 0.16 30 / .35), transparent 60%);
}
.landing-bg::after {
  content: ""; position: absolute; inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.22 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  opacity: .45; mix-blend-mode: multiply;
}
```

All landing-page content must sit on `position: relative; z-index: 1` so it stacks above this layer.

### Typography accents (gradient text)

Wherever a headline has an `<em>` accent word, render it as:

```jsx
<em className="font-serif italic font-normal bg-gradient-to-br from-[--color-accent-2] via-[--color-accent] to-[--color-accent-3] bg-clip-text text-transparent">
  merge conflict
</em>
```

---

## Interactions & behavior

### Swipeable card
- Pointer-events based (`onPointerDown / Move / Up`). Use the implementation in `design/app2.jsx` → `<SwipeCard>` as the reference.
- During drag, translate by `dragX` and rotate by `dragX * 0.04°`.
- Threshold: 110px past origin → fly out at 600px translate + ±18°, fade to 0 over 380ms.
- Stamp opacity: `Math.max(0, dragX / 120)` for "Merge" (right), reverse for "Pass" (left).
- Stack reveals next card by translating each behind-card down `14 * depth px` and scaling `1 − 0.04 * depth`, opacity `1 − 0.12 * depth`.
- Action buttons (`✕` / `✓`) trigger the same swipe via a `fireKey` prop.
- The commit-status line under the stack updates on right-swipe (merge) to `$ git commit -m "<commit message from data>"`.

This component must call your backend's existing `POST /request/send/:status/:userId` on merge — but **only when the user is logged in**. On the public landing it's just a demo; the buttons can no-op or open the signup modal.

### Backend integration points
| Action on landing | Backend behavior |
|---|---|
| Click **git init love** / **Sign up free** | `navigate("/signup")` |
| Click **Sign in** | `navigate("/login")` |
| Drag-swipe on demo cards | **No backend call** — demo only. After 3rd swipe, optionally show a "sign up to keep swiping" modal. |

### Tweaks panel
The design includes a Tweaks side panel exposing `dark mode` and `language (EN/HI)`. **Do not ship the Tweaks panel.** It's a designer-only tool. Instead:

- Wire **dark mode** to DaisyUI's theme system + a Redux slice (`uiSlice` with `theme: 'light' | 'dark'`, persisted to `localStorage`). Toggle via a button in the nav.
- Wire **language** to a small i18n shim (the design uses a `COPY[lang]` dict — that pattern is fine to start). Use react-router URL segments per the project's `improvement.text` plan: `/en-in/`, `/hi-in/`.

### Responsive
- 1100px: nav-status hidden, hero collapses to single column, floating polaroids hidden.
- 720px: nav-links hidden, features stack to 1 column, gallery photos all span 6/3 (single column with even heights), section heads stack.

---

## Copy

All English + Hindi strings are in `design/app2.jsx` → the `COPY` object. Use it as the source of truth. Don't paraphrase — that's the finalized copy.

---

## Assets

All photos used by the design are in `design/photos/`:

| File | Used for |
|---|---|
| `g8-1.png` … `g8-8.png` | Profile photos in the swipeable cards + trust avatars |
| `g4a-1.png`, `g4a-4.png`, `g6-1.png`, `g6-4.png`, `g3-big.png`, `p-rust-girl-couple.png`, `p-night-market-couple.png` | "Recently merged" gallery + decorative polaroids |
| `hero-crew.png` | Full-width CTA strip background |

The photos are AI-generated test imagery from this design phase. **Replace with real licensed photography (or user-generated content from your matched-couple testimonials program) before launch.**

---

## Files in this bundle

```
design_handoff_landing_page/
├── README.md                       ← this file
└── design/
    ├── Landing Page.html           ← runnable HTML prototype (open in any browser)
    ├── app2.jsx                    ← all React components for the page
    ├── tweaks-panel.jsx            ← designer-only, ignore
    └── photos/                     ← imagery used by the design
```

### Open the prototype
1. `cd design_handoff_landing_page/design/`
2. `python3 -m http.server 8000` (or any static server)
3. Visit `http://localhost:8000/Landing%20Page.html`

You can scroll the full page, drag the demo card, toggle dark mode and switch language from the Tweaks panel in the bottom-right.

---

## Implementation checklist for Claude Code

- [ ] Install fonts (Geist, Geist Mono, Instrument Serif, Noto Sans Devanagari) via Google Fonts in `index.html`.
- [ ] Extend `index.css` with the design tokens above.
- [ ] Add `LandingOrFeed.jsx` gate and update `App.jsx` routing.
- [ ] Build `Landing.jsx` composed of `<Nav>`, `<Hero>`, `<Gallery>`, `<Features>`, `<CtaStrip>`, `<Footer>` sub-components — each in its own file under `frontend/src/components/landing/`.
- [ ] Port `<SwipeCard>` from `design/app2.jsx` — same gesture math, same stamp/translation/rotation values.
- [ ] Copy the 13 photo assets into `frontend/public/landing/` and reference as `/landing/<file>.png`.
- [ ] Add light/dark mode toggle + i18n routes per project's existing `improvement.text` plan.
- [ ] Wire `git init love` → `/signup`, `Sign in` → `/login`.
- [ ] **Do not** copy the inline `<style>` block from the prototype — translate to Tailwind + the tokens above.
- [ ] **Do not** ship the Tweaks panel (the floating bottom-right panel).
- [ ] Test against breakpoints 1100px and 720px.
- [ ] Lighthouse pass: lazy-load gallery + CTA-strip images (they're below the fold).
