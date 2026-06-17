# CLAUDE.md — cma-photo-next

**Read `SPEC.md` (repo root) before any task.** It is the single source of truth: strategy, IA, design system, copy voice, SEO contract, roadmap. When in doubt, SPEC.md wins.

## What this is

Photography platform for Carel Maeda (@carel011) at photo.carelmaeda.com — converts Instagram visitors into email subscribers and Google searchers into readers, and sells digital products. Generosity-first: free Vanilla Summer recipe + free prints (Netlify Forms gated) sit beside **paid** recipes/prints in a Stripe-backed digital store; MDX blog for SEO; gear list on About. **Rebranded June 13, 2026** to the Carel brand kit + design system + a new English four-job IA (see SPEC §2/§3 — the old "Contact Sheet Editorial" / free-first / no-store model is superseded).

## Stack

Next.js 15 App Router · TypeScript · Tailwind CSS v4 (CSS-first, tokens in `@theme` in `src/app/globals.css`, **no tailwind.config.js**) · shadcn/ui (selective) · Cloudinary images (cloud `duwhxzb0q`) via `next/image` + a Cloudinary loader in the `CldImage` wrapper (no `next-cloudinary` runtime — keeps the client bundle lean) · Netlify hosting + Forms + Functions (Stripe only) · Stripe (digital checkout) · MDX blog via next-mdx-remote-client.

## Commands

```
npm run dev      # localhost:3000
npm run build    # MUST pass with zero errors before any phase is "done"
npm run lint
```

## Hard rules

- **Server Components by default.** `"use client"` only on leaf components: forms, lightbox, nav sheet, cart drawer/context, motion wrappers, CldImage wrapper. Never on a page.
- **Tailwind token utilities only** for color/font/radius/section-spacing (`bg-paper`, `text-ink`, `text-indigo`, `text-brick`, `font-sans`, `font-mono`). No arbitrary values on those axes. Indigo is the primary accent; **brick is the spark — use sparingly, never on body copy.** Radius scale `4/6/10px` (photos stay square). Shadows only via `--shadow-pop` / `--shadow-overlay` tokens — not on cards or photos.
- **Design = "Carel system v1"** (SPEC §3): authority is the codified tokens in `src/app/globals.css` + the SPEC §3 tables; brand assets in `carel-brand-kit/`. Plus Jakarta Sans + Space Mono via next/font, paper/ink/indigo/brick palette. Don't substitute fonts or invent decoration — apply the documented components.
- **All photos through the CldImage wrapper** with Cloudinary publicIds — never raw `<img>` or hand-built URLs. Meaningful `alt` required (type-enforced). The only non-Cloudinary images are the brand logo/favicon/app-icon assets in `public/` (from `carel-brand-kit/`).
- **All external IDs/URLs in `src/lib/siteConfig.ts`.** Unknown values stay `TODO_` — never invent real-looking IDs, Stripe price IDs, setting values, or publicIds.
- **Netlify Forms sync rule:** form fields are defined twice — `public/__forms.html` (static, what Netlify parses) and the React form component. **Any field change must update both.** Forms cannot be tested locally; verify on deploy previews.
- **Stripe = digital-only, one server touchpoint.** Checkout + delivery run through `netlify/functions/*` (create Checkout Session; verify paid session for download). No DB, no accounts, no stored orders — entitlement is `session_id`-verified at `/checkout/success`. Secret key in env only, never committed.
- **Every page exports unique `metadata`**; new routes go into `sitemap.ts`. Cart/checkout pages are `noindex`.
- **No new npm dependencies** without flagging first (Stripe SDKs `stripe` + `@stripe/stripe-js` are pre-approved by SPEC §5). No new third-party services/accounts without owner sign-off.
- **Out of scope** (SPEC §9): no CMS, database, auth, i18n, presets, physical-print fulfillment, design-system §04 admin/upload UI. Don't build these even if a task seems to imply them.
- `carel011_*.md` files are personal strategy docs — gitignored, never commit, never quote in site copy.

## Copy voice (any user-facing text)

First person, photographer's voice. "I found that…" never "You should…". Specific over vague ("X100V", not "my camera"). Short sentences. No fake-urgency sales language — never "Limited time", "Exclusive", no countdowns or exclamation marks. A plain "Buy" / "Add to cart" is fine now (the store is real); state price, that it's a digital download, and what's delivered. Free gated downloads explained plainly: free, delivered after the form, unsubscribe anytime.

## Workflow

1. Work one SPEC.md §8 phase at a time, in order.
2. After completing a phase: `npm run build` zero errors, check off the phase boxes in SPEC.md, report anything incomplete with a reason.
3. After content/page phases: audit against SPEC §6 (SEO contract) item by item.
