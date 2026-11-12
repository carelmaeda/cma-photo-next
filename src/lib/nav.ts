import { getDictionary, localePath, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/siteConfig";

export interface NavLink {
  href: string;
  label: string;
}

/**
 * Primary nav — flat IA (SPEC §2, launch-light per §10).
 * Canonical routes: header, footer, and sitemap use these exact paths.
 * Sections parked by siteConfig.features drop out of the nav here; the logo
 * also links home, and the cart icon (store only) sits after these links.
 * Mirrored sections link within the page's language; gallery, prints and
 * downloads exist in English only, so they link there from both trees.
 */
export function navLinks(locale: Locale): NavLink[] {
  const t = getDictionary(locale).nav.labels;
  return [
    { href: localePath(locale, "/"), label: t.home },
    { href: localePath(locale, "/recipes"), label: t.recipes },
    ...(siteConfig.features.gallery ? [{ href: "/gallery", label: t.gallery }] : []),
    ...(siteConfig.features.prints ? [{ href: "/prints", label: t.prints }] : []),
    ...(siteConfig.features.store ? [{ href: "/downloads", label: t.downloads }] : []),
    { href: localePath(locale, "/blog"), label: t.blog },
    { href: localePath(locale, "/about"), label: t.about },
  ];
}
