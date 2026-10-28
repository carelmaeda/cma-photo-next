import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";

const cloudinary = `https://res.cloudinary.com/${siteConfig.cloudinary.cloudName}/image/upload`;

/**
 * Cloudinary OG-card URL (1200×630) for a publicId — built here, once,
 * instead of hand-assembled in every page's generateMetadata.
 */
export function ogImageUrl(publicId: string): string {
  return `${cloudinary}/w_1200,h_630,c_fill,g_auto,f_auto,q_auto/${publicId}`;
}

/** Stable full-size photo URL for structured data (ImageObject.contentUrl). */
export function photoUrl(publicId: string): string {
  return `${cloudinary}/w_1600,c_limit,f_auto,q_auto/${publicId}`;
}

/**
 * Site-wide default share image: the Lisbon cover. Must be a publicId that
 * exists after the October 21, 2026 re-upload (city-N names only) — the old
 * Amsterdam hero 404s and shipped a broken card on every share.
 */
export const defaultOgImage = ogImageUrl("Europe/Portugal/Lisbon/lisbon-1_tchctr");

/**
 * Core queries the whole site targets. Pages prepend their own. Rendered as
 * <meta name="keywords"> — Google ignores that tag; the same terms are what
 * the titles, descriptions, H1s and JSON-LD are written around, which is
 * where they count.
 */
export const siteKeywords = [
  "Fujifilm recipes",
  "Fujifilm film simulation recipes",
  "Fujifilm travel photography",
  "travel photography",
  "JPG straight out of camera",
  "Carel Maeda",
];

interface PageMetaOptions {
  title: string;
  description: string;
  /** Site-relative path, e.g. "/recipes/vanilla-summer". Becomes the canonical URL. */
  path: string;
  /** Absolute OG image URL (1200×630). Defaults to the site image. */
  image?: string;
  keywords?: string[];
  /** Home only: use the title as-is instead of "<title> — Carel Maeda". */
  absoluteTitle?: boolean;
  /** Blog posts: OpenGraph article type with dates. */
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
  };
  /** Pages that must stay out of the index (still followed). */
  noindex?: boolean;
}

/**
 * The one way a page declares its metadata. Returns title, description,
 * keywords, canonical, OpenGraph and Twitter together so no page can drift:
 * Next.js replaces (not merges) a page's openGraph block, so a page that set
 * only title/description used to ship the generic site card, and no page set
 * a canonical at all — every ?utm_ link from Instagram was a duplicate URL.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = defaultOgImage,
  keywords = [],
  absoluteTitle = false,
  article,
  noindex = false,
}: PageMetaOptions): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} — ${siteConfig.name}`;
  const url = path === "/" ? `${siteConfig.url}/` : `${siteConfig.url}${path}`;
  const og = {
    title: fullTitle,
    description,
    url,
    siteName: siteConfig.name,
    images: [{ url: image, width: 1200, height: 630 }],
  };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: [...new Set([...keywords, ...siteKeywords])],
    alternates: { canonical: path },
    ...(noindex && { robots: { index: false, follow: true } }),
    openGraph: article
      ? {
          ...og,
          type: "article",
          publishedTime: article.publishedTime,
          modifiedTime: article.modifiedTime ?? article.publishedTime,
          authors: [siteConfig.url],
          section: article.section,
          tags: article.tags,
        }
      : { ...og, type: "website" },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}
