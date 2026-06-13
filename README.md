# photo.carelmaeda.com

Photography platform for [Carel Maeda](https://instagram.com/carel011) — travel albums, the free Vanilla Summer Fujifilm recipe, free prints, and a guide library. Built to turn Instagram visitors into email subscribers and Google searchers into readers.

**`SPEC.md` is the source of truth** — strategy, design system, copy voice, SEO contract, and the phase roadmap. `CLAUDE.md` holds the working rules for AI-assisted sessions.

## Stack

- Next.js 15 (App Router, Server Components by default) + TypeScript
- Tailwind CSS v4 (CSS-first config in `src/app/globals.css` — no `tailwind.config.js`)
- shadcn/ui (six components, mapped to the brand tokens)
- Cloudinary via `next-cloudinary` (all images, publicIds only)
- Netlify hosting + **Netlify Forms** (newsletter, recipe/prints gates, contact)
- MDX guides via `next-mdx-remote-client` — add a `.mdx` file to `src/content/guides/`, zero code changes

## Commands

```
npm run dev      # localhost:3000
npm run build    # must pass with zero errors
npm run lint
```

## Layout

```
src/app/          routes (each exports unique metadata)
src/components/   site components + ui/ (shadcn)
src/content/      albums.ts, recipes.ts, gear.ts, prints.ts, guides/*.mdx
src/lib/          types.ts, siteConfig.ts, guides.ts loader, nav.ts
public/__forms.html   Netlify form definitions — keep in sync with React forms
```

## Before launch (owner checklist)

1. Enable **Forms** in the Netlify dashboard + add an email notification (forms silently no-op otherwise). Test each form on a deploy preview.
2. Fill the Vanilla Summer settings in `src/content/recipes.ts` (all `TODO`).
3. Edit the four guide drafts in `src/content/guides/` (marked with TODO comments).
4. Replace placeholder album images (Innsbruck, Vaduz, Brugge, Porto) — they're `noindex` until then.
5. Point `photo.carelmaeda.com` at Netlify, then update the Instagram bio link.
6. After deploy: create a GA4 property, set the ID in `src/lib/siteConfig.ts`, flip `analytics.enabled`.
