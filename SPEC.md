# SPEC — photo.carelmaeda.com

*The single source of truth for this site. Created June 11, 2026. Rebranded June 13, 2026 (Carel brand kit + design system + new IA + store). When code and this document disagree, this document wins. CLAUDE.md points here.*

> **Rebrand note (June 13, 2026):** the original "Contact Sheet Editorial" design and free-first/no-store model were superseded by three owner-supplied "final truth" inputs (a brand kit, a design-system reference, and a Studio Roldan IA teardown). Those inputs have been fully applied and the implemented-but-now-redundant reference docs were removed; the **living truth is now this SPEC, `src/app/globals.css` (codified design tokens), and `carel-brand-kit/` (brand assets)**. §2, §3, §5, §8, §9 reflect the new visual system, English four-job IA, and Stripe-backed digital store.

---

## 1. Purpose & strategy

**Who:** Carel Maeda (@carel011) — travel photographer. São Paulo born, Toronto based. Fujifilm (GFX100RF, X100V, X-Pro3) + Leica M5 on 35mm film. JPG-only, in-camera recipes, prime lenses. ~14.7K Instagram followers.

**Why this site exists:** the Instagram account reaches people; this site keeps them. In order:

1. **Convert Instagram visitors into email subscribers** (the owned audience).
2. **Earn organic Google traffic** through an evergreen blog/guide library (the SEO engine).
3. **Sell digital products** — Fujifilm recipes and digital prints, free **and** paid — through an on-site Stripe store.

**The free-first rule (relaxed, June 13, 2026):** paid products now ship alongside free ones. Each commercial category still carries a free counterpart so the site stays generosity-first — but a free version no longer has to ship *before* its paid sibling.

| Free | Paid |
|---|---|
| Vanilla Summer recipe | Additional / collection recipes |
| Free print downloads | Paid digital prints |
| Honest gear list (on About) | Affiliate links (later) |

**The feel:** a warm personal storyteller — generosity first, the store quiet and tasteful. No countdowns, no fake scarcity, no exit popups, no "coming soon" teasers. A real "Buy" exists now, stated plainly.

**Third-party accounts:** Netlify (hosting + Forms + **one Function for Stripe checkout**), Cloudinary (existing, cloud `duwhxzb0q`), and **Stripe** (digital checkout) are the stack. Google Analytics is added **after** deploy behind a config flag. No ESP (Kit/Mailchimp), no EmailJS, no CMS, no database, no auth, no i18n.

---

## 2. Site map & information architecture

Adopted from the Studio Roldan IA teardown (now applied — this section is the canonical IA) — the same four-job model (Showcase /
Store / Content / Convert), retuned for Carel and kept **fully in English**.

```
/                  Home — hero galleries, latest posts, recipe/print highlight, newsletter band
/about             São Paulo → Toronto story, JPG philosophy, gear list  [absorbs /gear]
/gallery           Album index (travel galleries, by trip/location)      [was /albums]
/gallery/[slug]    City gallery — masonry + lightbox + frame captions
/prints            Print store — grid of free + paid digital prints      [was /prints; "Loja"]
/prints/[slug]     Print detail (free → Forms gate; paid → Stripe)
/downloads         Recipe / downloads store — free + paid Fujifilm recipes  [was /recipes]
/downloads/[slug]  Recipe detail (paid → Stripe)
/downloads/vanilla-summer   Free recipe settings page (gate delivery; indexable)
/blog              Blog/guide index (the SEO engine)                     [was /guides]
/blog/[slug]       Individual MDX post (Article + Breadcrumb JSON-LD)    [was /guides/[slug]]
/contact           Simple inquiry form (split out of About)
/cart              Cart review → Stripe Checkout (client cart, drawer also available)
/checkout/success  Post-purchase delivery (session-verified download links)
```

**Nav (flat, no dropdowns), in order:** Home · About · Gallery · Prints · Downloads · Blog · Contact, then the cart icon. The logo also links Home.
**Canonical routes (teardown's key lesson):** header, footer, and `sitemap.ts` use the **same** paths — no divergence. Labels match slugs (Gallery=/gallery, Prints=/prints, Downloads=/downloads).
**Footer:** Instagram, Threads, Prints, Contact, © line.
**Old → new 301s** (`netlify.toml`): `/albums/* → /gallery/*`, `/guides/* → /blog/*`, `/recipes/* → /downloads/*`, `/gear → /about`.

---

## 3. Design system — "Carel system v1"

Light-only, photo-first, warm personal storyteller. **Authority:** the codified tokens in `src/app/globals.css` (`@theme`, Tailwind v4, no tailwind.config.js) and `carel-brand-kit/` (logo + favicon + app-icon assets). The tables below are the canonical token spec.

### Color (ratio ≈ paper 70 / ink 20 / indigo 7 / brick 3)

| Token | Value | Use |
|---|---|---|
| `--color-paper` | `#F4F1EA` | Page background. |
| `--color-paper-2` | `#ECE7DB` | Raised surface / hover fill. |
| `--color-ink` | `#1A1925` | Primary text. |
| `--color-ink-soft` | `#3A3947` | Secondary text on paper. |
| `--color-warm` | `#86837C` | Muted text, captions. |
| `--color-indigo` | `#2E3A6E` | **Primary accent:** links, buttons, focus, structure. |
| `--color-indigo-700` | `#26305C` | Indigo hover/active. |
| `--color-brick` | `#BC4A3C` | **Spark:** tags, one highlight — use sparingly, never body copy. |
| `--color-brick-700` | `#9E3B2F` | Brick hover. |
| `--color-line` | `#E0DACD` | Hairlines, dividers, **photo frames**. |
| `--color-line-2` | `#CFC8B8` | Stronger border (inputs, focus base). |
| `--color-danger` / `--color-success` | `#A32D2D` / `#3B6D11` | Destructive / confirmations. |
| `--scrim` | `rgba(26,25,37,.92)` | Lightbox / overlay backdrop. |

### Type, radius, elevation, motion

| Axis | Value |
|---|---|
| Display + body font | **Plus Jakarta Sans** (`--font-sans`, weights 400–700) via next/font |
| Data / captions / eyebrows font | **Space Mono** (`--font-mono`) via next/font |
| Type scale | `--fs-display 2.75rem` … `--fs-body 1rem` … `--fs-cap .75rem` / `--fs-micro .6875rem` (mono) |
| Eyebrow | mono, uppercase, `letter-spacing .14em`, `--color-warm` |
| Radius | `--r-sm 4px / --r-md 6px / --r-lg 10px / --r-full 9999px`. **Photos are square (`--r-none 0`).** |
| Elevation | mostly flat. `--shadow-pop 0 6px 22px/.10` (dropdowns, sticky header on scroll); `--shadow-overlay 0 16px 50px/.30` (lightbox controls). No shadows on cards/photos. |
| Section spacing | 4px base scale `--space-1…--space-9` (`6rem` max). |
| Motion | `--dur-fast 120 / base 200 / slow 320ms`, `--ease cubic-bezier(.4,0,.2,1)`. **`prefers-reduced-motion` zeroes all durations** (global guard in `@layer base`). |

### Photo & caption treatment

- Frame photos on paper with a `--color-line` (`#E0DACD`) hairline so images stay the hero.
- **Galleries are masonry**, square, edge-to-edge: CSS columns driven by `--cols` (2 → 3 @768 → 4 @1280) and `--photo-gap 4px`. Never card chrome around photos.
- **Caption / EXIF row** = Space Mono, `--fs-cap`, `--color-warm` (the `FrameCaption` component, restyled). Format e.g. `FR-014 · PARIS · GFX100RF · VANILLA SUMMER`.

### Components

Implemented: buttons (`default`/primary indigo, `outline`/`secondary` indigo-outline, `ghost`, `spark` brick, `destructive`; `sm`/`lg`; focus ring 2px indigo offset, `:active` scale .98 — `src/components/ui/button.tsx`) · form fields (indigo focus) · EXIF caption (`FrameCaption`) · sticky blurred site header (`--shadow-pop`) · masonry gallery + lightbox (scrim + `--shadow-overlay`) · footer · store cards/cart. **Still to add as content needs them:** links/chips, badges, FAQ accordion (SEO), breadcrumbs, pagination, blog index card. **Admin/upload UI is out of scope** (needs auth + DB — see §9).

### Logo

Handwritten mark only — never re-typed. Assets in `carel-brand-kit/assets/` (copied to `public/`). Clear space = height of the "C". Don't stretch, recolor (beyond the provided ink/indigo/reversed variants), or refont.

---

## 4. Copy voice (all user-facing text)

- First person, smart friend who figured something out: "I found that…" — never "You should…".
- Specific over vague: "5pm light in the Marais", "X100V" — never "beautiful light", "my camera".
- Short sentences. Line breaks. One idea each.
- No sales language: never "Buy now", "Limited time", "Exclusive", no exclamation marks.
- Gated downloads explained plainly: what you get, that it's free, unsubscribe anytime.

---

## 5. Technical conventions

- **Next.js 15 App Router + TypeScript. Server Components by default.** `"use client"` only on small leaf components: forms, lightbox, mobile nav sheet, motion wrappers, the CldImage wrapper. Never on a page.
- **Styling: Tailwind CSS v4 only** — CSS-first config, all tokens in `@theme` in `src/app/globals.css`. Token utilities (`bg-paper`, `text-ink`, `text-indigo`, `text-brick`, `font-sans`, `font-mono`). No arbitrary values for color/font/radius/section-spacing. No SCSS, no CSS modules, no new global stylesheets.
- **shadcn/ui, selectively:** button, input, textarea, label, dialog (lightbox), sheet (mobile nav + cart drawer), accordion (FAQ). Variables mapped to brand tokens. Don't add components without need.
- **Images: Cloudinary publicIds only** (versioned path form `v.../Folder/file.jpg` is fine) through the `CldImage` wrapper — never raw `<img>` or hand-built URLs in components. `alt` is required by the `Photo` type and must be meaningful. Logo/favicon/app-icon SVG/PNG assets (from `carel-brand-kit/`) live in `public/` and are the only non-Cloudinary images.
- **Content lives in `src/content/`** (`albums.ts`, `gear.ts`, `prints.ts`, `recipes.ts`, `guides/*.mdx`). Types in `src/lib/types.ts`. Adding a post = adding one MDX file, zero code changes.
- **All external IDs/URLs in `src/lib/siteConfig.ts`.** Unknown values stay `TODO_` placeholders — never invent real-looking IDs (Stripe publishable key + per-product price IDs included).
- **Netlify Forms:** form definitions live in `public/__forms.html` (static HTML Netlify can parse at deploy). React forms POST url-encoded to `/__forms.html`. **Any field change must be made in both places.** Forms only work on Netlify deploys, never locally.
- **Stripe checkout (digital-only):** the single server touchpoint allowed. Netlify Functions in `netlify/functions/` create a Stripe Checkout Session from the client cart and verify paid sessions for post-purchase download delivery (Cloudinary `fl_attachment`). No DB — entitlement is `session_id`-verified at the success page. No accounts, no stored orders.

---

## 6. SEO contract (non-negotiable)

1. Every page exports unique `metadata` — title (`<Page> — Carel Maeda`), description, OpenGraph + Twitter card with a real image.
2. `sitemap.ts` + `robots.ts` generated from routes + portfolio/blog/product slugs. New routes must be added.
3. JSON-LD: `Person` site-wide; `Article` + `BreadcrumbList` on blog posts; `Product` + `Offer` on paid recipe/print detail pages.
4. Meaningful `alt` on every image (type-enforced).
5. Lighthouse ≥ 90 Performance and SEO on `/`, one `/portfolio/[slug]`, one `/blog/[slug]`.
6. Internal-link lattice: every blog post links ≥1 portfolio album + `/recipes` + `/about`; albums link back to related posts.
7. Placeholder-image albums (see §7) get `noindex` until real photos are uploaded. Checkout/success and cart pages are `noindex`.

---

## 7. Content notes & known data issues

- `src/content/albums.ts` is the migrated, typed album data. **Placeholder albums** — Innsbruck and Vaduz (Salzburg/repeated images), Brugge and Porto (Braga images) — are flagged `placeholderImages: true` with TODO comments. Never invent publicIds; the owner uploads real photos.
- Guide library seeds with the **Fujifilm-recipes cluster** (highest search intent, funnels to the free recipe): what-are-fujifilm-recipes, vanilla-summer-recipe-explained, why-i-shoot-jpeg-only, x100v-settings-i-actually-use. Claude drafts in the owner's voice; the owner edits before publish.
- The Vanilla Summer settings on `/recipes/vanilla-summer` are written by the owner — the build ships the page structure with `TODO_` setting values, never invented numbers.

---

## 8. Roadmap

### Phase 1 — Foundation ✅ (completed June 11, 2026)
- [x] SPEC.md + CLAUDE.md + .gitignore for personal docs
- [x] Tailwind v4 + shadcn in; SCSS/Bootstrap/EmailJS/unused deps out
- [x] `globals.css` @theme tokens; fonts via next/font (Fraunces + Instrument Sans)
- [x] `src/lib/types.ts`, `src/lib/siteConfig.ts`, `src/content/albums.ts` (photoDB migrated, alt text, placeholder flags)
- [x] CldImage wrapper, FrameCaption, SiteHeader + NavSheet, SiteFooter, netlify.toml
- [x] layout.tsx (fonts, metadata, metadataBase), next.config.ts (ESM, remotePatterns), interim home, fixed album route
- [x] Old styles/components/photoDB deleted; `npm run build` + lint clean

### Phase 2 — Core pages & SEO skeleton ✅ (completed June 11, 2026)
- [x] Home rebuilt (hero + FrameCaption, three paths, latest work, newsletter band placeholder)
- [x] `/albums` index + `/albums/[slug]` rebuilt (SSG, generateMetadata, lightbox via Dialog)
- [x] sitemap.ts, robots.ts, not-found.tsx, Person JSON-LD, OG default image

### Phase 3 — Netlify Forms (the email machine) ✅ code complete (June 11, 2026)
- [x] `public/__forms.html` (newsletter w/ source field, contact; honeypots)
- [x] NewsletterForm + ContactForm client components, inline success states
- [x] `/recipes` gate + `/recipes/vanilla-summer`, `/about` with contact form
- [ ] Enable Forms in Netlify dashboard + email notification (OWNER — do this before launch, forms silently no-op otherwise)

### Phase 4 — Content engine ✅ (completed June 11, 2026)
- [x] MDX pipeline (next-mdx-remote-client/rsc + gray-matter + remark-gfm; the original next-mdx-remote 500s in dev with React 19), guides loader
- [x] `/guides` index + `/guides/[slug]` with Article + Breadcrumb JSON-LD
- [x] 4 seed guides (recipe cluster; "x100v settings" became "one-camera-one-lens" — real settings can't be invented), `/gear`, `/prints` with gate
- [x] Internal-link lattice + sitemap update
- [ ] OWNER: edit the 4 guide drafts (marked with TODO comments) before promoting them

### Phase 5 — Polish & launch (code complete June 11, 2026 — launch steps are the owner's)
- [x] Motion pass: CSS hero fade + title rise, shared IntersectionObserver reveal; framer-motion removed; reduced-motion guard global
- [x] Hero `priority`, responsive `sizes` everywhere, fonts via next/font
- [x] GA behind `siteConfig.analytics` flag (ships disabled, via @next/third-parties)
- [ ] OWNER launch checklist (also in README): enable Netlify Forms + notification, test forms on a deploy preview, fill Vanilla Summer settings in `src/content/recipes.ts`, edit the 4 guide drafts, replace placeholder album photos, DNS for photo.carelmaeda.com, run Lighthouse on the live site (target ≥90), update IG bio, then flip GA on

### Phase 6 — Rebrand + IA + Store (code complete June 13, 2026; owner steps remain)
Supersedes the old design/IA/commerce model. See §2, §3, §5, §9.
- [x] **Docs** reconciled: SPEC.md (this) + CLAUDE.md rewritten to the new truth.
- [x] **Brand foundation:** `globals.css` @theme rewritten to Carel tokens (indigo + brick, new radius/shadow/type scale); fonts swapped to Plus Jakarta Sans + Space Mono via next/font; brand assets copied to `public/`; favicon + app icons + logo mark wired.
- [x] **Design system applied:** buttons (primary/outline/ghost/spark/destructive), forms, EXIF caption, sticky header, footer, masonry gallery + lightbox re-skinned to the Carel design system (now codified in `globals.css` + §3). (FAQ accordion / chips / badges / breadcrumbs / pagination remain to add as content needs them.)
- [x] **IA restructured (English):** `/albums→/portfolio`, `/guides→/blog`, `/prints→/shop`, `/gear` folded into `/about`, `/contact` split out; nav regrouped; sitemap/robots/`netlify.toml` 301s updated.
- [x] **Store (Stripe, digital-only):** product model + catalog (`src/content/products.ts`), client cart (`src/lib/cart.tsx`) + drawer + `/cart`, paid detail pages `/recipes/[slug]` + `/shop/[slug]` with `Product` JSON-LD, `/checkout/success` delivery, Netlify Functions `create-checkout-session` + `verify-session`. Paid products stay hidden until configured (no fake "coming soon").
- [ ] OWNER — Stripe go-live:
  - Set Netlify env vars: `STRIPE_SECRET_KEY` (and optionally `CLOUDINARY_CLOUD_NAME`). Put the **publishable** key in `siteConfig.stripe.publishableKey`.
  - For each paid product: create it in Stripe, set a price (in `cad`), add a **Product metadata** key `downloadPublicId` = the Cloudinary publicId of the deliverable file. Then add the product to `src/content/products.ts` with its real `price` + `stripePriceId`.
  - Test a paid checkout end-to-end on a deploy preview (Stripe **test mode**), confirm the success page reveals the download.
- [ ] OWNER — content/launch: enable Netlify Forms + notification, fill Vanilla Summer settings (`src/content/recipes.ts`), edit the 4 blog drafts, replace placeholder album photos, DNS, Lighthouse ≥90, then flip GA on.

### Future
- Affiliate links on the About gear list · ESP when the list outgrows Netlify Forms · physical prints (would add a print-on-demand partner — out of scope today).

---

## 9. Out of scope (do not build)

No CMS, no database, no auth, no user accounts, no stored orders, no client-side content-unlock logic beyond the goodwill gate and `session_id`-verified download, no Lightroom presets (JPG shooter — off-brand), **no i18n** (English only), no comments/memberships/courses, no Reels-style video, **no physical-product fulfillment / shipping / inventory** (digital downloads only), no design-system §04 admin/upload UI. No new npm dependencies beyond what this spec names (Stripe SDKs are named) without flagging it first.
