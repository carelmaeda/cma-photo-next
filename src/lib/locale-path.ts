/**
 * Locale plumbing with no dictionary imports, so client leaves (the footer's
 * language switch) can use it without pulling the dictionaries into the
 * client bundle. Everything else imports from "@/lib/i18n", which re-exports.
 */
export type Locale = "en" | "pt-br";

export const locales: readonly Locale[] = ["en", "pt-br"];
export const defaultLocale: Locale = "en";

/** BCP 47 tag for <html lang>, hreflang and JSON-LD inLanguage. */
export const htmlLang: Record<Locale, string> = { en: "en", "pt-br": "pt-BR" };
/** OpenGraph locale (underscore form). */
export const ogLocale: Record<Locale, string> = { en: "en_CA", "pt-br": "pt_BR" };
/** Intl locale for dates. English keeps en-CA (the site's original choice). */
export const dateLocale: Record<Locale, string> = { en: "en-CA", "pt-br": "pt-BR" };

const PT_PREFIX = "/pt-br";

/** Prefixes a site-relative path for the locale: "/about" → "/pt-br/about", "/" → "/pt-br". */
export function localePath(locale: Locale, path: string): string {
  if (locale === "en") return path;
  return path === "/" ? PT_PREFIX : `${PT_PREFIX}${path}`;
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "pt-br" : "en";
}

/** The locale a pathname belongs to. */
export function localeOf(pathname: string): Locale {
  return pathname === PT_PREFIX || pathname.startsWith(`${PT_PREFIX}/`) ? "pt-br" : "en";
}

/**
 * The same page in the other language, or null when it has no twin.
 * Mirrored (SPEC §2): "/", "/about", "/recipes", "/recipes/[slug]", "/blog",
 * and "/blog/[slug]" only when the Portuguese MDX file exists (ptPostSlugs).
 * Every Portuguese page has an English twin, so pt → en always resolves.
 */
export function counterpartPath(
  pathname: string,
  ptPostSlugs: readonly string[]
): string | null {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (localeOf(clean) === "pt-br") {
    const rest = clean.slice(PT_PREFIX.length);
    return rest === "" ? "/" : rest;
  }
  if (clean === "/" || clean === "/about" || clean === "/recipes" || clean === "/blog") {
    return localePath("pt-br", clean);
  }
  if (/^\/recipes\/[^/]+$/.test(clean)) return localePath("pt-br", clean);
  const post = clean.match(/^\/blog\/([^/]+)$/);
  if (post) {
    return ptPostSlugs.includes(post[1])
      ? localePath("pt-br", clean)
      : localePath("pt-br", "/blog");
  }
  return null;
}
