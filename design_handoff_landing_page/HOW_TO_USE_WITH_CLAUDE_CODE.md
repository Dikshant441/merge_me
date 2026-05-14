# How to use this with Claude Code

You have two ways to hand this design to Claude Code:

---

## Option A — Drop the whole bundle in (simplest)

1. Download `design_handoff_landing_page.zip` from this chat.
2. Unzip it inside your `merge_me/` project so it sits next to `frontend/` and `backend/`:

   ```
   merge_me/
   ├── backend/
   ├── frontend/
   └── design_handoff_landing_page/   ← new
       ├── README.md
       └── design/
           ├── Landing Page.html
           ├── app2.jsx
           └── photos/
   ```

3. Open Claude Code in the `merge_me/` directory:

   ```bash
   cd merge_me
   claude
   ```

4. Give it this prompt verbatim:

   > Read `design_handoff_landing_page/README.md` start to finish, then implement the landing page in `frontend/` following the README's checklist exactly. The HTML in `design_handoff_landing_page/design/Landing Page.html` is a design reference — recreate it in the existing React + Vite + Tailwind v4 + DaisyUI v5 codebase. Don't copy the `<style>` block verbatim; translate to Tailwind utility classes plus the design tokens in `index.css`. Don't ship the Tweaks panel. Wire the CTA buttons to `/signup` and `/login`. Stop and ask before making any backend changes.

5. Let it work. It will read the README, check `frontend/src/App.jsx` and `index.css` to understand current patterns, then create files under `frontend/src/components/landing/`.

---

## Option B — Faster, fewer files (no README)

If you don't want the README and just want Claude Code to look at the HTML and infer the design:

1. Copy just these two files into your project:

   ```
   merge_me/frontend/_design_reference/
   ├── Landing Page.html
   └── photos/                ← the 13 images used in the design
   ```

2. In Claude Code, run:

   ```bash
   cd merge_me
   claude
   ```

3. Prompt:

   > I have a finished HTML design in `frontend/_design_reference/Landing Page.html`. Open it (and the photos folder next to it), study the layout, color, typography, and the swipeable-card interaction. Then build it as a new public landing page in this React + Vite + Tailwind v4 + DaisyUI v5 codebase. The route should be `/` for logged-out users (currently `/` shows the feed and 401-redirects — keep the feed but gate it behind a logged-in check). Create the landing page under `frontend/src/components/landing/`. Don't ship the floating Tweaks panel; that's a designer tool. CTAs should navigate to `/signup` and `/login`. Use the photos as-is for now.

This is faster but Claude Code has to re-derive design tokens from the HTML. The README in Option A spells them out exactly, so it's more reliable for pixel parity.

---

## After Claude Code is done

- Test the swipe interaction by dragging the demo card with a mouse — should fly off past ±110px.
- Toggle dark mode — the background gradient mesh should swap to deeper plum/coral.
- Click **git init love** → goes to `/signup`.
- Click **Sign in** → goes to `/login`.
- Throw 1100px and 720px breakpoints at it — hero should collapse, gallery should reflow.

If anything looks off compared to `Landing Page.html`, screenshot the live version + the HTML reference side-by-side and paste both back into Claude Code with "make these match."

---

## What you still need to do yourself

1. **Replace the AI-generated photos** with real photography before launch — those Gemini-generated dev couples are placeholders.
2. **Hindi route** (`/hi-in/...`) — per your `improvement.text`, the i18n routing belongs to the broader app refactor, not just the landing page. Plan it across the whole app.
3. **Backend** — the demo card swipes on the public landing page should not call `POST /request/send`. Show a "sign up to keep swiping" modal after 3 demo swipes instead.
