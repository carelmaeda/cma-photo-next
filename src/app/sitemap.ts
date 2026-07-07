import type { MetadataRoute } from "next";
import { realAlbums } from "@/content/albums";
import { paidProducts } from "@/content/products";
import { getAllGuides } from "@/lib/guides";
import { siteConfig } from "@/lib/siteConfig";

/**
 * Sitemap — emitted at /sitemap.xml. Only indexable, live pages belong here.
 *
 * Deliberately excluded (verified against the routes):
 *  - /cart, /checkout/success  → noindex (transactional)
 *  - /prints, /prints/[slug]   → robots:index:false, hidden until launch
 *  - placeholder-image albums  → noindex (realAlbums already filters them out)
 *
 * Priority (3 tiers): primary page 1.0 · hubs + standalone pages 0.8 ·
 * individual items (albums, articles, products) 0.6.
 *
 * changeFrequency reflects how often each type *realistically* changes:
 *  - home: weekly  (aggregates Latest work + From the blog — changes whenever
 *    any album or post lands, so it turns over fastest)
 *  - section hubs: monthly  (gain new children periodically)
 *  - about / contact: yearly  (static informational copy)
 *  - individual albums / articles / products: yearly  (fixed once published)
 *
 * lastModified is set only where there's a real signal (blog post date). It's
 * omitted elsewhere on purpose — a build-time `new Date()` would churn the
 * timestamp on every deploy and mislead crawlers.
 */
const { url } = siteConfig;

export default function sitemap(): MetadataRoute.Sitemap {
  const home: MetadataRoute.Sitemap = [
    { url: `${url}`, changeFrequency: "weekly", priority: 1.0 },
  ];

  const hubs: MetadataRoute.Sitemap = [
    "/gallery",
    "/blog",
    "/downloads",
  ].map((path) => ({
    url: `${url}${path}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const standalonePages: MetadataRoute.Sitemap = [
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${url}${path}`,
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = paidProducts("recipe").map(
    (product) => ({
      url: `${url}/downloads/${product.slug}`,
      changeFrequency: "yearly",
      priority: 0.6,
    })
  );

  const albumRoutes: MetadataRoute.Sitemap = realAlbums.map((album) => ({
    url: `${url}/gallery/${album.slug}`,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getAllGuides().map((guide) => ({
    url: `${url}/blog/${guide.slug}`,
    lastModified: new Date(guide.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [
    ...home,
    ...hubs,
    ...standalonePages,
    ...productRoutes,
    ...albumRoutes,
    ...blogRoutes,
  ];
}
