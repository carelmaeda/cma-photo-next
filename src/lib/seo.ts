import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";

/**
 * Cloudinary OG-card URL (1200×630) for a publicId — built here, once,
 * instead of hand-assembled in every page's generateMetadata.
 */
export function ogImageUrl(publicId: string): string {
  return `https://res.cloudinary.com/${siteConfig.cloudinary.cloudName}/image/upload/w_1200,h_630,c_fill,g_auto,f_auto,q_auto/${publicId}`;
}

/** Site-wide default share image (the Amsterdam hero). */
export const defaultOgImage = ogImageUrl(
  "Europe/Netherlands/Amsterdam/DSCF5151_eintko"
);

/**
 * OpenGraph + Twitter blocks for a page. Next.js merges metadata per
 * top-level key, so a page that sets its own title/description but not
 * these ships the *site-wide* share card — shares then show the generic
 * title instead of the page's.
 */
export function social(
  title: string,
  description: string,
  image: string = defaultOgImage
): Pick<Metadata, "openGraph" | "twitter"> {
  const fullTitle = `${title} — ${siteConfig.name}`;
  return {
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}
