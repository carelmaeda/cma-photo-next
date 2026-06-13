import type { MetadataRoute } from "next";
import { realAlbums } from "@/content/albums";
import { getAllGuides } from "@/lib/guides";
import { siteConfig } from "@/lib/siteConfig";

/** Placeholder-image albums are noindexed, so they stay out of the sitemap too. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/gallery",
    "/prints",
    "/downloads",
    "/downloads/vanilla-summer",
    "/blog",
    "/contact",
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const albumRoutes: MetadataRoute.Sitemap = realAlbums.map((album) => ({
    url: `${siteConfig.url}/gallery/${album.slug}`,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getAllGuides().map((guide) => ({
    url: `${siteConfig.url}/blog/${guide.slug}`,
    lastModified: new Date(guide.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...albumRoutes, ...blogRoutes];
}
