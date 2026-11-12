import type { MetadataRoute } from "next";
import { realAlbums } from "@/content/albums";
import { paidProducts } from "@/content/products";
import { recipes } from "@/content/recipes";
import { getAllGuides } from "@/lib/guides";
import { localePath } from "@/lib/i18n";
import { siteConfig } from "@/lib/siteConfig";

/**
 * Sitemap — emitted at /sitemap.xml. Only indexable, live pages belong here.
 * Audited against the route tree on October 28, 2026; Portuguese twins added
 * November 12, 2026 (SPEC §5 Languages, §6.9).
 *
 * Deliberately excluded (verified against src/app):
 *  - /links                     → noindex (Instagram bio page, SPEC §10)
 *  - /cart, /checkout/success   → noindex (transactional)
 *  - /analytics-events          → noindex (internal GA4 reference)
 *  - /prints, /prints/[slug]    → noindex, hidden until launch
 *  - /downloads, /downloads/*   → parked by features.store (SPEC §10),
 *    301 to /recipes while the store is off
 *  - draft blog posts           → filtered out by getAllGuides()
 *  - placeholder-image albums   → 404 (realAlbums already filters them out)
 *
 * Languages: the mirrored pages (home, /about, /recipes, /recipes/[slug],
 * /blog, and posts with a Portuguese file) appear once per language, each
 * entry carrying both URLs as hreflang alternates. Gallery and album pages
 * are English only.
 *
 * Priority, three tiers:
 *  1.0  home
 *  0.8  section hubs (/recipes, /gallery, /blog) and /about
 *  0.6  individual items: recipes, albums, articles, products
 *
 * changeFrequency reflects how often each type realistically changes:
 *  - home + /gallery: weekly  (the album wall turns over on every
 *    "refresh the albums" run)
 *  - /recipes, /blog: monthly  (gain children periodically)
 *  - recipe pages: monthly  (settings get revised; presets get added)
 *  - album pages: monthly  (the refresh flow appends new uploads)
 *  - articles, /about: yearly  (fixed once published)
 *
 * lastModified is set only where there's a real signal (a post's `updated`
 * or `date`). Elsewhere it's omitted on purpose — a build-time `new Date()`
 * would churn the timestamp on every deploy and mislead crawlers.
 */
const { url } = siteConfig;

type Entry = MetadataRoute.Sitemap[number];

const absolute = (path: string) => (path === "/" ? url : `${url}${path}`);

/** One entry per language for a mirrored page, both carrying the hreflang pair. */
function mirrored(
  path: string,
  rest: Omit<Entry, "url" | "alternates">
): Entry[] {
  const languages = {
    en: absolute(path),
    "pt-BR": absolute(localePath("pt-br", path)),
  };
  return [
    { url: languages.en, alternates: { languages }, ...rest },
    { url: languages["pt-BR"], alternates: { languages }, ...rest },
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const home = mirrored("/", { changeFrequency: "weekly", priority: 1.0 });

  const hubs: MetadataRoute.Sitemap = [
    ...mirrored("/recipes", { changeFrequency: "monthly", priority: 0.8 }),
    { url: absolute("/gallery"), changeFrequency: "weekly", priority: 0.8 },
    ...mirrored("/blog", { changeFrequency: "monthly", priority: 0.8 }),
    ...mirrored("/about", { changeFrequency: "yearly", priority: 0.8 }),
    ...(siteConfig.features.store
      ? [{ url: absolute("/downloads"), changeFrequency: "monthly" as const, priority: 0.8 }]
      : []),
  ];

  const recipeRoutes: MetadataRoute.Sitemap = recipes.flatMap((recipe) =>
    mirrored(`/recipes/${recipe.slug}`, { changeFrequency: "monthly", priority: 0.6 })
  );

  const albumRoutes: MetadataRoute.Sitemap = realAlbums.map((album) => ({
    url: absolute(`/gallery/${album.slug}`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const ptSlugs = new Set(getAllGuides("pt-br").map((guide) => guide.slug));
  const blogRoutes: MetadataRoute.Sitemap = getAllGuides("en").flatMap((guide) => {
    const rest = {
      lastModified: new Date(guide.updated ?? guide.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    };
    const path = `/blog/${guide.slug}`;
    return ptSlugs.has(guide.slug)
      ? mirrored(path, rest)
      : [{ url: absolute(path), ...rest }];
  });

  const productRoutes: MetadataRoute.Sitemap = siteConfig.features.store
    ? paidProducts("recipe").map((product) => ({
        url: absolute(`/downloads/${product.slug}`),
        changeFrequency: "yearly",
        priority: 0.6,
      }))
    : [];

  return [
    ...home,
    ...hubs,
    ...recipeRoutes,
    ...albumRoutes,
    ...blogRoutes,
    ...productRoutes,
  ];
}
