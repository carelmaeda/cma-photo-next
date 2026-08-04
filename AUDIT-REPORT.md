# AUDIT-REPORT — photo.carelmaeda.com

*Final pre-launch audit, July 7, 2026. Audited against the actual codebase and SPEC.md (the repo's source of truth). No code was changed.*

---

## 0. Audit-brief vs. reality — read this first

Several assumptions in the audit brief describe a different site than the one in this repo. Per SPEC.md (which wins on conflicts), the following **do not exist and are not defects**:

| Brief said | Repo reality (per SPEC.md) |
|---|---|
| PT-BR blog, `lang="pt-BR"`, Brazil SEO | **English-only site** (SPEC §9: "no i18n. English only"). `lang="en"` is correct. |
| Three recipes (Vanilla Summer, Midnight Espresso, Blue Curaçao) | **One paid recipe product** (Vanilla Summer). No other recipes exist anywhere. |
| Admin interface, Cloudinary Upload Widget | **Out of scope by SPEC §9** ("no design-system §04 admin/upload UI"). Nothing to audit. |
| `next-cloudinary` runtime | Removed deliberately; a custom loader in `CldImage` replaces it. |
| `tokens.css` / `tailwind.config.js` | Tokens live in `@theme` in [src/app/globals.css](src/app/globals.css); `carel-brand-kit/tokens/` is reference-only. |
| BRL / Pix / boleto | Store charges **CAD** (`siteConfig.stripe.currency`), by design. |
| Grey `#86837C` contrast concern | Not in the codebase. The muted token is `--color-warm #696660`, already darkened to AA (5.07:1 on paper, documented at [globals.css:18](src/app/globals.css#L18)). |
| Webhooks | None used — delivery is `session_id`-verified at `/checkout/success`. No idempotency surface. |

Everything below audits what actually exists.

---

## 1. Verdict

**DO NOT SHIP** (and treat as already-exposed: the site is live and the repo is public) — a Cloudinary **API secret is sitting in the public GitHub history**, and the paid product's full content is recoverable from that same history; three more High issues (wrong live product description, silent checkout failures, zero legal pages) sit directly on the money path.

The good news: the fixes are small. Rotate one secret today, then roughly a day of commit-sized changes clears every Critical and High.

---

## 2. Scorecard

| Phase | Result | Issues |
|---|---|---|
| 1 · Build integrity | **PASS** (with notes) | `npm run build` ✅ 0 errors, 53 SSG pages · `tsc --noEmit` ✅ · lint ✅ 0 warnings · 1 justified `eslint-disable` · 2 findings (M3, M1) |
| 2 · Security | **FAIL** | 1 Critical (C1), 2 High (H4 + C1's product-content leak), 3 Medium (M4, M5, M11) |
| 3 · Features | **WARN** | H1, H2, M7, M9, M13 — full E2E purchase not exercisable (live Stripe keys only; see §7 note) |
| 4 · Dead code | **WARN** | M8 + dead-code manifest (§5); codebase is otherwise lean |
| 5 · Maintainability | **WARN** | M6 (README materially wrong), no `.env.example`; naming/types/structure otherwise consistent and well-commented |
| 6 · SEO & performance | **WARN** | M2, M12, L3 — otherwise strong: full SSG, correct sitemap/robots, complete JSON-LD, `display:swap` fonts, LCP `priority`, reduced-motion guard |
| 7 · Launch checklist | **FAIL** | H3 (no legal pages), M11 (session_id → GA), L2 (missing redirect), live/test key switch undocumented |

---

## 3. Findings

### 🔴 Critical

**C1 — Cloudinary API key + secret committed to a PUBLIC GitHub repo's history**
- **Where:** file `env.local` (no leading dot — `.gitignore`'s `.env*` never matched it) in commits `d2231f6`, `4656a54`, `796e388`, `f8683b6`, `981ea79`. "Removed" in `d389a69` but fully recoverable: `git show d2231f6:env.local` yields `CLOUDINARY_API_KEY=9342…` and `CLOUDINARY_API_SECRET=UA_s5…`. Verified the repo `github.com/carelmaeda/cma-photo-next` is **public** (unauthenticated API returns 200).
- **Why it matters:** the Admin API secret grants full control of cloud `duwhxzb0q` — delete every photo, replace the paid deliverable with malware, list all assets (which also hands over the paid recipe PDF's `downloadPublicId`), rack up bandwidth bills.
- **Sub-finding (same root cause):** the **entire paid product content** — every Vanilla Summer setting — is recoverable from public history (`git show a3a3911:src/content/recipes.ts`). The $3 product is free to anyone who reads the repo.
- **Fix:** (1) **Rotate the Cloudinary API secret in the dashboard immediately** — this is not optional and history-purging alone is insufficient (clones/caches exist). (2) Make the repo private, or purge history with `git filter-repo` + force-push (removes both the secret and the recipe values). (3) Add `env.local` / `*.env*` (dot-optional) patterns to `.gitignore`.
- **Effort:** S (rotate + private) / M (history purge).

### 🟠 High

**H1 — Live store sells "vanilla summer *cookies*"**
- **Where:** [src/content/products.ts:25-26](src/content/products.ts#L25-L26) — `"A digital recipe card for vanilla summer cookies. Instant PDF download after checkout."` This is a **Fujifilm film-simulation recipe**, and this string is live copy: it renders on the `/downloads` card, the product page, the `Product` JSON-LD, and the OG/Twitter description of [downloads/[slug]/page.tsx](src/app/downloads/[slug]/page.tsx#L25).
- **Why:** a real product with a live Stripe price (`price_1Thvm3…`) is publicly described as baked goods — wrong buyer expectations (refund risk), wrong structured data, embarrassing on the money path.
- **Fix:** rewrite the description in the SPEC copy voice (what it is, X-Trans IV/V compatibility, PDF delivered after checkout). **Effort:** S.

**H2 — Checkout failures are silent (unhandled promise rejection, no user feedback)**
- **Where:** [src/components/cart-view.tsx:108-120](src/components/cart-view.tsx#L108-L120), [src/components/cart-widget.tsx:143-155](src/components/cart-widget.tsx#L143-L155), [src/components/add-to-cart.tsx:57-66](src/components/add-to-cart.tsx#L57-L66). All three call `await startCheckout(...)` in `try { … } finally { … }` — **no `catch`**. `startCheckout` throws on any non-OK response ([src/lib/checkout.ts:19-25](src/lib/checkout.ts#L19-L25)).
- **Why:** if `STRIPE_SECRET_KEY` is unset, a price is archived, or Stripe is down, the buyer clicks "Checkout", the button flashes "Redirecting…", resets — and nothing else happens. No message, ever. That's an abandoned sale plus an unhandled rejection in the console.
- **Fix:** add `catch` in each handler (or centralize) setting an inline on-brand error state ("Checkout didn't go through — nothing was charged. Try again…"). **Effort:** S.

**H3 — Zero legal pages while selling to consumers and running GA**
- **Where:** no privacy policy, no terms/refund policy anywhere; [site-footer.tsx](src/components/site-footer.tsx) links only Instagram/Threads/Contact. Meanwhile the site collects emails (Netlify Forms), sells digital goods (Stripe), and GA4 is **enabled** (`analytics.enabled: true`, [siteConfig.ts:23-25](src/lib/siteConfig.ts#L23-L25)).
- **Why:** consumer-protection and privacy baselines (PIPEDA/Law 25 for a Canadian seller; GDPR the moment an EU visitor lands) require a privacy notice; card networks and Stripe's ToS expect a refund/dispute policy for digital goods.
- **Fix:** add `/privacy` and `/terms` (refund policy included) pages + footer links. Content is yours to write (flagged as owner input, per your note); routes/skeletons are code. **Effort:** M (S for code, content owner-side).

**H4 — Paid downloads are permanent, unsigned public URLs**
- **Where:** [netlify/functions/verify-session.ts:24-25](netlify/functions/verify-session.ts#L24-L25) — delivery is `https://res.cloudinary.com/<cloud>/image/upload/fl_attachment/<publicId>`: no signature, no expiry. Verified Cloudinary serves `upload`-type assets publicly (HTTP 206 on an unauthenticated fetch).
- **Why:** the session check gates only *learning* the URL, not *fetching* it. Any buyer can share the link forever; anyone who guesses or scrapes the deliverable's publicId (and C1 leaked the ability to *list* them) gets the product free. This is the "construct a direct URL" test from the brief — it fails for anyone holding a publicId.
- **Fix (no new services/deps, SPEC-compatible):** deliver the paid file as a Cloudinary **`authenticated`/`private`** asset and have `verify-session` return a **signed URL with a short expiry** (Cloudinary URL signatures = one `crypto` hash using the API secret already available to the function). Free prints can stay public by design. **Effort:** M.

### 🟡 Medium

**M1 — No `error.tsx` / `global-error.tsx` anywhere**
- Any uncaught client render error (cart, lightbox, checkout-success) is an unstyled white screen — no on-brand recovery UI. `not-found.tsx` exists and is on-brand; the error boundary doesn't. **Fix:** add a root `error.tsx` (paper/ink, "Something broke — nothing was charged" + retry). **Effort:** S.

**M2 — Hub pages ship the wrong OG title; blog posts ship the wrong Twitter card**
- Proven from build output: `downloads.html` has `<title>Digital Downloads — Carel Maeda</title>` but `og:title` = site default; same for `/gallery`, `/blog`, `/about`, `/contact`. Blog posts get correct `og:*` but `twitter:title` falls back to the site default (page defines `openGraph` only — [blog/[slug]/page.tsx:31-41](src/app/blog/[slug]/page.tsx#L31-L41)).
- **Why:** shares on WhatsApp/Slack/X show the generic site card instead of the page — this blunts exactly the blog-SEO/share play the site exists for. **Fix:** add `openGraph.title/description` to each hub page's metadata and a `twitter` block to blog `generateMetadata`. **Effort:** S.

**M3 — The money-path functions are excluded from type-checking**
- [tsconfig.json:26](tsconfig.json#L26) `"exclude": ["node_modules", "netlify"]` — `next build`/`tsc` never see the Stripe functions. They pass a standalone `tsc` today (verified), but nothing keeps them honest. **Fix:** add `netlify/tsconfig.json` and a `check:functions` script wired into `npm run build` (or include the dir with correct lib settings). **Effort:** S.

**M4 — Functions echo raw Stripe errors and accept unbounded quantities**
- [verify-session.ts:71-74](netlify/functions/verify-session.ts#L71-L74) and [create-checkout-session.ts:73-76](netlify/functions/create-checkout-session.ts#L73-L76) return `err.message` verbatim (live probe returned `"No such checkout.session: cs_test_fake"` — internal detail disclosure, and a session-ID oracle). [create-checkout-session.ts:45-53](netlify/functions/create-checkout-session.ts#L45-L53) caps nothing: `quantity: 10**12` goes straight to Stripe.
- **Fix:** log the real error server-side, return a generic message; clamp quantity to e.g. 1–10. **Effort:** S.

**M5 — No security headers beyond Netlify defaults**
- Live check: HSTS + `X-Content-Type-Options` present; **no** `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`, or CSP. **Fix:** a `[[headers]]` block in [netlify.toml](netlify.toml) (start with `frame-ancestors 'none'`, `Referrer-Policy: strict-origin-when-cross-origin`, a Permissions-Policy denying sensors/camera; CSP needs care with GA + Cloudinary but is worth doing). **Effort:** S.

**M6 — README is materially wrong**
- [README.md](README.md) says images use `next-cloudinary` (removed), calls Vanilla Summer "the free… recipe" (it's paid), and its launch checklist points at things that no longer exist (`recipes.ts` settings TODOs, placeholder albums Innsbruck/Vaduz/Brugge/Porto — all resolved). It documents **no** Stripe env vars, no "add a paid product" flow (that doc lives only in a comment in [products.ts](src/content/products.ts#L13-L16)), and there's no `.env.example` (`STRIPE_SECRET_KEY`, optional `CLOUDINARY_CLOUD_NAME`; `URL` is Netlify-provided). Future-you adding "Cherry Cola" would be misled, not helped. **Fix:** rewrite README (setup, envs, add-a-product, add-a-post, add-an-album, deploy/go-live), add `.env.example`. **Effort:** M.

**M7 — `/prints` is an orphan page carrying live machinery**
- Nav entry commented out ([src/lib/nav.ts:10](src/lib/nav.ts#L10)), footer omits it (SPEC §2 says footer should include Prints), nothing links to it — yet it ships the free-print set, the newsletter gate, and paid-print plumbing, `noindex`'d ([prints/page.tsx:13-15](src/app/prints/page.tsx#L13-L15)). Coherent as a soft-launch hide, but it diverges from SPEC and dead-ships a whole feature. **Fix:** decide — re-link it (nav + footer, drop `noindex`, add to sitemap) or defer it. **Effort:** S either way.

**M8 — Corrupted utility class in the Sheet (cart drawer + mobile nav)**
- [src/components/ui/sheet.tsx:65](src/components/ui/sheet.tsx#L65): `…text-popover-foreground      -(--shadow-pop) transition…` — a mangled `shadow-(--shadow-pop)`. The class is discarded, so the drawer renders with **no elevation shadow** over the page, against SPEC §3's `--shadow-pop` spec. **Fix:** restore `shadow-(--shadow-pop)`. **Effort:** S.

**M9 — Buyers can pay N× for one digital file**
- Cart +/− controls ([cart-view.tsx:62-71](src/components/cart-view.tsx#L62-L71), [cart-widget.tsx](src/components/cart-widget.tsx#L103-L112)) allow any quantity of a PDF download; delivery is one link regardless of quantity. A double-tap on "+" quietly doubles the charge. **Fix:** cap digital lines at quantity 1 (remove the steppers; `add` already merges duplicates). **Effort:** S.

**M10 — Corrupt cart storage crashes the entire site**
- [src/lib/cart.tsx:34-42](src/lib/cart.tsx#L34-L42) parses `localStorage["carel-cart-v1"]` and only guards against *throwing* JSON — `'{"a":1}'` parses fine, lands as non-array state, and `lines.reduce` at [cart.tsx:92-93](src/lib/cart.tsx#L92-L93) throws during render of `CartProvider`, which wraps **every page** (and there's no error boundary, see M1). One bad write = whole-site white screen until storage is cleared. **Fix:** validate `Array.isArray` + per-line shape before `setLines`. **Effort:** S.

**M11 — GA4 records live `session_id`s, which resolve to buyer emails**
- GA is enabled; page_location for `/checkout/success?session_id=cs_live_…` flows into GA. Anyone with GA property access can replay a session_id against the public [verify-session](netlify/functions/verify-session.ts) endpoint and retrieve the buyer's **email** ([verify-session.ts:68](netlify/functions/verify-session.ts#L68)). **Fix:** on the success page, `router.replace` to strip the query param after reading it (client-side, pre-GA-hit ordering is fiddly — simplest robust fix is redacting via GA's built-in URL redaction or stripping the param immediately on mount). **Effort:** S.

**M12 — Alt text is a copy-pasted city template, ~300 times**
- Every gallery photo: `"Travel photograph from {City}, {Country}"` ([albums.ts](src/content/albums.ts) throughout). Type-enforced presence ✅, but zero descriptive value for screen readers or Google Images — the file's own header TODO acknowledges it. Owner content task; fine to phase in post-launch, starting with covers and the six featured home images. **Effort:** L (content).

**M13 — `/gallery` ignores the placeholder-album filter the rest of the site uses**
- [gallery/page.tsx:24](src/app/gallery/page.tsx#L24) maps `albums`; home + sitemap use `realAlbums` ([albums.ts:637](src/content/albums.ts#L637)). No placeholder albums exist *today*, so it's currently a no-op — but the next `placeholderImages: true` album would render on the index while being excluded from the sitemap (and its detail page `noindex`'d). **Fix:** use `realAlbums` in the gallery index. **Effort:** S.

### 🟢 Low

**L1 — Dead code manifest** — see §5. **Effort:** S.
**L2 — `/downloads/vanilla-summer` removed with no redirect** — the route existed on the live site until commit `4b16079`; anyone who saved/indexed it now gets a 404. Add a 301 → `/downloads/vanilla-summer-recipe-card` in [netlify.toml](netlify.toml). **Effort:** S.
**L3 — Brick fails AA for small text** — `#BC4A3C` on paper ≈ **4.45:1** (< 4.5:1). Used on small hover states (`hover:text-brick` on mono micro text in [cart-view.tsx:78](src/components/cart-view.tsx#L78), [cart-widget.tsx:119](src/components/cart-widget.tsx#L119)). Hover-only + icon-accompanied, so impact is minor — switch those to `brick-700` (5.6:1 ✅). **Effort:** S.
**L4 — All four blog guides still carry `TODO (owner): first draft` markers** ([guides/*.mdx:14](src/content/guides/)) and the paid product's image is a reused Braga frame not shot on the recipe ([products.ts:27](src/content/products.ts#L27)). Owner content, pre-launch per SPEC's own checklist.
**L5 — Home CTA "Get the Vanilla Summer recipe →" links the hub, not the product** ([page.tsx:60-65](src/app/page.tsx#L60-L65)) — one extra click on the primary conversion path. **Effort:** S.
**L6 — `not-found.tsx` exports no metadata** — 404s render with the site-default title. **Effort:** S.
**L7 — `@next/third-parties@^16.2.9` against `next@15`** — a major-version mismatch that happens to work; pin to the 15.x line (or upgrade both together) to avoid surprise breakage. Related: `shadcn` (the CLI) is a production dependency kept solely for its `shadcn/tailwind.css` import in [globals.css:3](src/app/globals.css#L3) — it drags a large tree (source of the `immutable` audit hit). Consider vendoring that CSS. **Effort:** S–M.
**L8 — `npm audit`: 12 vulns (4 high)** — all in dev/transitive tooling (eslint chain, `minimatch`, `picomatch`, `flatted`, `immutable` via the shadcn CLI); the only runtime-adjacent one is a *moderate* `postcss` advisory inside `next` with **no fix released**. No exploitable runtime path identified. Run `npm audit fix` for the cheap ones; track the next patch release. **Effort:** S.

### Phase-1 accounting the brief demanded
- **`eslint-disable`:** exactly one — [checkout-success.tsx:59](src/components/checkout-success.tsx#L59) (`react-hooks/exhaustive-deps`, justified: `clear` is stable and the effect must run once per session id). Keep.
- **`@ts-ignore` / `@ts-expect-error` / `any`:** none in `src/` or `netlify/`.
- **`console.log`/`debugger`:** none; the single `console.debug` in [analytics.ts:26](src/lib/analytics.ts#L26) is dev-gated and intentional.
- **`process.env` inventory:** `STRIPE_SECRET_KEY` (both functions — fails loud with a 500 JSON error ✅), `URL` (Netlify-provided, safe fallback), `CLOUDINARY_CLOUD_NAME` (optional, safe fallback), `NODE_ENV`. None documented in a `.env.example` (file doesn't exist → M6). No `NEXT_PUBLIC_*` in use; the committed Stripe **publishable** key is client-safe by definition (and currently unused — L1).

---

## 4. What's solid (verified, not assumed)

- Build/type/lint: zero errors; **all 53 pages SSG** — no accidental dynamic rendering.
- Server-side price integrity: the client sends only `stripePriceId` + `quantity`; prices come from Stripe's own price objects. No client-trusted amounts anywhere.
- Netlify Forms sync rule holds: [`public/__forms.html`](public/__forms.html) fields exactly match both React forms, honeypots included.
- `noindex` correct on `/cart`, `/checkout/success`, `/analytics-events`, `/prints`; sitemap includes exactly the indexable routes incl. the product page; robots.ts correct.
- JSON-LD complete per SPEC §6: `Person` site-wide, `Article` + `BreadcrumbList` on posts, `Product` + `Offer` on product pages. The only `dangerouslySetInnerHTML` is the JSON-LD serializer over static owner data — no user input reaches it; MDX is owner-authored, no raw HTML pipeline.
- Every MDX internal link resolves to an existing route (checked all 15 targets); the SPEC §6 link-lattice (post → album + /downloads + /about, album → related posts) is implemented.
- A11y baseline: skip link, `aria-label`s on all icon buttons, `aria-live` on form success/error states, keyboard arrows in the lightbox, visible indigo focus rings, single `h1` per page, global `prefers-reduced-motion` kill-switch.
- Old-IA 301s present in netlify.toml; fonts via next/font with `display: swap`; hero LCP `priority` + `sizes` on every image; Cloudinary preconnect.

---

## 5. Dead code manifest (safe to delete)

| Item | Where | Note |
|---|---|---|
| `allProducts` export | [products.ts:51](src/content/products.ts#L51) | Never imported |
| `Album.relatedGuide` field | [types.ts:28](src/lib/types.ts#L28) | Never read (the reverse lookup uses guide frontmatter) |
| `Print.downloadUrl` field | [types.ts:51](src/lib/types.ts#L51) | Never read (`printDownloadUrl()` is used instead) |
| `siteConfig.stripe.publishableKey` | [siteConfig.ts:34-35](src/lib/siteConfig.ts#L34-L35) | Unused — checkout is a URL redirect; `@stripe/stripe-js` was never needed. Deleting also removes a confusing "is this secret?" string |
| `images.remotePatterns` | [next.config.ts:10-17](src/next.config.ts#L10-L17) | Every image uses a custom `loader`, which bypasses the optimizer's allow-list; keep only if a non-loader remote image is ever added |
| Unused `public/` assets | `avatar-circle.png`, `carel-logo-indigo.png`, `carel-logo-reversed.svg`, `app-icon-512.png` | Referenced nowhere in `src/`; `app-icon-512` would only matter if a web manifest is added |
| Unused shadcn exports | `dialog.tsx`, `sheet.tsx` (Trigger/Footer/Description variants) | Standard shadcn surface — harmless; delete only if you want a truly minimal kit |

Not dead, just noted: `realAlbums` is currently a no-op filter (no placeholder albums remain) — keep it, and see M13.

---

## 6. Fix plan (commit-sized, severity order)

1. **(Do today, not a commit)** Rotate the Cloudinary API secret; make the GitHub repo private (or schedule a `git filter-repo` purge + force-push). *(C1)*
2. `fix: gitignore env.local variants` — close the dot-less hole. *(C1)*
3. `fix: correct Vanilla Summer product description` — kill the cookies. *(H1)*
4. `fix: surface checkout errors to the buyer` — add `catch` + inline error state in cart-view, cart-widget, add-to-cart. *(H2)*
5. `feat: add root error.tsx + validate cart localStorage` — on-brand error boundary; `Array.isArray` + shape guard in `CartProvider`. *(M1, M10)*
6. `feat: signed, expiring paid-download URLs` — authenticated delivery type + signed URL generation in `verify-session`. *(H4 — needs one owner step: re-upload the deliverable as an authenticated asset)*
7. `feat: privacy + terms/refunds pages and footer links` — skeletons with owner-content TODOs. *(H3)*
8. `fix: harden Netlify functions` — generic client errors, quantity clamp, `netlify/tsconfig.json` + build-time check. *(M3, M4)*
9. `feat: security headers in netlify.toml`. *(M5)*
10. `fix: per-page OG/Twitter metadata on hubs and posts`. *(M2)*
11. `fix: cart quantity capped at 1 for digital goods`. *(M9)*
12. `fix: sheet shadow token, gallery realAlbums, brick-700 hovers, strip session_id after verify`. *(M8, M13, L3, M11)*
13. `chore: dead code sweep` — §5 manifest. *(L1)*
14. `docs: rewrite README + add .env.example`. *(M6)*
15. `chore: 301 for /downloads/vanilla-summer; direct home CTA; not-found metadata`. *(L2, L5, L6)*

## 7. Deferred (post-launch, with reasoning)

- **Per-photo alt text (M12)** — 300+ handwritten descriptions is owner work; presence is already type-enforced, so it's an SEO upgrade, not a launch defect. Start with covers + home.
- **Guide-draft editing + real product cover (L4)** — owner voice/content; SPEC already tracks it.
- **`/prints` launch decision (M7)** — currently coherently hidden; ship it deliberately when the print set is curated.
- **CSP** — do the easy headers now (M5); a full CSP wants a dedicated pass with GA + Cloudinary + inline JSON-LD nonces tested on a deploy preview.
- **Dependency alignment (L7/L8)** — `@next/third-parties` pin and the `shadcn`-CLI-as-dep cleanup ride along with the next scheduled `next` upgrade; audit items are dev-chain noise plus one unfixable-upstream moderate.
- **Test-mode E2E purchase** — impossible right now without spending real money: production runs **live** Stripe keys (verified via the live `verify-session` probe). SPEC's own go-live step ("test a paid checkout end-to-end on a deploy preview in Stripe test mode") appears unticked. After fixes land: put a **test** `STRIPE_SECRET_KEY` in Netlify's *deploy-preview* environment scope, run the full flow (buy → success page → download; declined card 4000…0002; abandon → `/cart`), then confirm the live-key scope for production. This is the one item I could not exercise for you, and it should gate the relaunch announcement.

---

*End of report. No code has been modified. Awaiting approval to start on the fix plan.*
