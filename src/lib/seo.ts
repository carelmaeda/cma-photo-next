import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { getDictionary, type Locale } from "@/lib/i18n";

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
 * The root layout's metadata for one language: title template, description,
 * icons and the default share card. Core keywords per locale live in the
 * dictionary (`site.keywords`): <meta name="keywords"> is ignored by Google,
 * but the same terms are what titles, descriptions, H1s and JSON-LD are
 * written around, which is where they count.
 */
export function rootMetadata(locale: Locale): Metadata {
  const { site } = getDictionary(locale);
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: site.title,
      template: `%s — ${siteConfig.name}`,
    },
    description: site.description,
    keywords: site.keywords,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: "/app-icon-180.png",
    },
    openGraph: {
      title: site.title,
      description: site.description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      type: "website",
      images: [{ url: defaultOgImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description: site.description,
      images: [defaultOgImage],
    },
  };
}

interface PageMetaOptions {
  /** Language of the page; decides the core keywords. Defaults to English. */
  locale?: Locale;
  title: string;
  description: string;
  /** Site-relative path, already locale-prefixed, e.g. "/pt-br/recipes/vanilla-summer". Becomes the canonical URL. */
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
  locale = "en",
  title,
  description,
  path,
  image = defaultOgImage,
  keywords = [],
  absoluteTitle = false,
  article,
  noindex = false,
}: PageMetaOptions): Metadata {
  const { site } = getDictionary(locale);
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
    keywords: [...new Set([...keywords, ...site.keywords])],
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
