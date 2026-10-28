import type { MetadataRoute } from "next";
import { realAlbums } from "@/content/albums";
import { paidProducts } from "@/content/products";
import { recipes } from "@/content/recipes";
import { getAllGuides } from "@/lib/guides";
import { siteConfig } from "@/lib/siteConfig";

/**
 * Sitemap — emitted at /sitemap.xml. Only indexable, live pages belong here.
 * Audited against the route tree on October 28, 2026.
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
 * Priority, three tiers:
 *  1.0  home
 *  0.8  section hubs (/recipes, /gallery, /blog) and /about
 *  0.6  individual items: recipes, albums, articles, products
 *  0.3  legal pages — present for completeness, not a crawl target
 *
 * changeFrequency reflects how often each type realistically changes:
 *  - home + /gallery: weekly  (the album wall turns over on every
 *    "refresh the albums" run)
 *  - /recipes, /blog: monthly  (gain children periodically)
 *  - recipe pages: monthly  (settings get revised; presets get added)
 *  - album pages: monthly  (the refresh flow appends new uploads)
 *  - articles, /about, legal: yearly  (fixed once published)
 *
 * lastModified is set only where there's a real signal (a post's `updated`
 * or `date`). Elsewhere it's omitted on purpose — a build-time `new Date()`
 * would churn the timestamp on every deploy and mislead crawlers.
 */
const { url } = siteConfig;

export default function sitemap(): MetadataRoute.Sitemap {
  const home: MetadataRoute.Sitemap = [
    { url, changeFrequency: "weekly", priority: 1.0 },
  ];

  const hubs: MetadataRoute.Sitemap = [
    { path: "/recipes", changeFrequency: "monthly" as const },
    { path: "/gallery", changeFrequency: "weekly" as const },
    { path: "/blog", changeFrequency: "monthly" as const },
    { path: "/about", changeFrequency: "yearly" as const },
    ...(siteConfig.features.store
      ? [{ path: "/downloads", changeFrequency: "monthly" as const }]
      : []),
  ].map(({ path, changeFrequency }) => ({
    url: `${url}${path}`,
    changeFrequency,
    priority: 0.8,
  }));

  const recipeRoutes: MetadataRoute.Sitemap = recipes.map((recipe) => ({
    url: `${url}/recipes/${recipe.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const albumRoutes: MetadataRoute.Sitemap = realAlbums.map((album) => ({
    url: `${url}/gallery/${album.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getAllGuides().map((guide) => ({
    url: `${url}/blog/${guide.slug}`,
    lastModified: new Date(guide.updated ?? guide.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const productRoutes: MetadataRoute.Sitemap = siteConfig.features.store
    ? paidProducts("recipe").map((product) => ({
        url: `${url}/downloads/${product.slug}`,
        changeFrequency: "yearly",
        priority: 0.6,
      }))
    : [];

  const legal: MetadataRoute.Sitemap = ["/privacy", "/terms"].map((path) => ({
    url: `${url}${path}`,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [
    ...home,
    ...hubs,
    ...recipeRoutes,
    ...albumRoutes,
    ...blogRoutes,
    ...productRoutes,
    ...legal,
  ];
}
