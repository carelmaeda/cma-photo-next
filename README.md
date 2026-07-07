# photo.carelmaeda.com

Photography platform for [Carel Maeda](https://instagram.com/carel011) — travel galleries, a Stripe-backed digital store (Fujifilm recipes + prints, free and paid), and an SEO blog. Built to turn Instagram visitors into email subscribers and Google searchers into readers.

**`SPEC.md` is the source of truth** — strategy, design system, copy voice, SEO contract, roadmap. `CLAUDE.md` holds the working rules for AI-assisted sessions.

## Stack

- Next.js 15 (App Router, Server Components by default) + TypeScript — everything statically generated
- Tailwind CSS v4, CSS-first: all brand tokens in `@theme` in `src/app/globals.css` (no `tailwind.config.js`)
- shadcn/ui, selectively, mapped to brand tokens
- Cloudinary for all photos via the `CldImage` wrapper (`src/components/cld-image.tsx`) — a custom `next/image` loader, no `next-cloudinary` runtime
- Netlify: hosting + Forms (newsletter, contact, prints gate) + two Functions for Stripe
- Stripe: digital-only checkout. No DB, no accounts — entitlement is the paid Checkout Session, verified at `/checkout/success`
- MDX blog via `next-mdx-remote-client`

## Commands

```
npm run dev              # localhost:3000
npm run build            # type-checks netlify/functions, then next build — must pass clean
npm run lint
npm run check:functions  # just the Netlify functions type-check
```

## Layout

```
src/app/            routes (each exports unique metadata; new routes go into sitemap.ts)
src/components/     site components + ui/ (shadcn)
src/content/        albums.ts, prints.ts, products.ts, recipes.ts, gear.ts, guides/*.mdx
src/lib/            types, siteConfig (all external IDs/URLs), cart, checkout, guides, seo, analytics
netlify/functions/  create-checkout-session, verify-session (the only server code)
public/__forms.html Netlify form definitions — any field change must also land in the React form
```

## Environment variables

See `.env.example`. Everything is Netlify-side: `STRIPE_SECRET_KEY` (test key in the deploy-preview scope, live key in production — that's the whole test/live switch), `CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET` (signed, expiring paid-download links; falls back to permanent public URLs without them), optional `CLOUDINARY_CLOUD_NAME`.

## How to add things

**A paid product ("Cherry Cola"):**
1. Create the product + a CAD price in the Stripe dashboard. On the *product*, set metadata `downloadPublicId` = the Cloudinary publicId of the deliverable file (`verify-session` reads it after payment — the file is configured in Stripe, not in the repo).
2. Add an entry to `recipeProducts` (or a paid print to `printProducts`) in `src/content/products.ts` with the real `price` (cents) and `stripePriceId`. A paid product renders only once its price id is real (`isLive`), so nothing half-built ever shows.
3. Test the flow on a deploy preview (test-mode key) before announcing.

**A blog post:** drop one `.mdx` file in `src/content/guides/` with the frontmatter the existing posts use (`title`, `description`, `date`, `category`, `cover`, `related.albums`). Index, sitemap, JSON-LD, and prev/next all derive from the file — zero code changes.

**A photo album:** add an `Album` entry in `src/content/albums.ts` (real Cloudinary publicIds only — never invent them; meaningful `alt` is type-enforced). The gallery index, home, and sitemap pick it up. Use `placeholderImages: true` if it temporarily shows another city's photos — that keeps it out of the gallery, sitemap, and Google.

**Forms:** fields are defined twice — `public/__forms.html` (what Netlify parses) and the React component. Change both or the form silently breaks. Forms only work on Netlify deploys.

## Go-live checklist (owner)

1. **Rotate the Cloudinary API secret** (the old pair is in public git history) and set the new `CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET` in Netlify. Consider making the GitHub repo private.
2. Enable **Forms** in the Netlify dashboard + an email notification; test each form on a deploy preview.
3. Put the Stripe **test** key in the deploy-preview env scope and run a full purchase: buy → success page → download works; declined card (4000 0000 0000 0002) shows the failure path; cancel returns to `/cart`. Then confirm the **live** key in the production scope.
4. Read `/privacy` and `/terms` and make the wording yours (refund window especially).
5. Edit the four guide drafts (`TODO` markers in `src/content/guides/`), then remove the markers.
6. Optional hardening: flip the paid deliverable asset to `authenticated` type in Cloudinary once signed delivery is confirmed working — that closes the public-URL fallback entirely.
