import { getDictionary, htmlLang, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/siteConfig";

/** Renders a JSON-LD script tag. data must be a plain serializable object. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const personId = `${siteConfig.url}/#person`;
export const websiteId = `${siteConfig.url}/#website`;

/**
 * Short Person reference for author / creator / publisher fields. The full
 * entity renders once in the root layout under the same @id, so every page's
 * schema points at one photographer instead of redeclaring him.
 */
export const personRef = {
  "@type": "Person",
  "@id": personId,
  name: siteConfig.name,
  url: siteConfig.url,
};

/** BreadcrumbList from [{ name, path }]; the last item carries no URL. Paths arrive locale-prefixed. */
export function breadcrumbList(items: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.path !== undefined && {
        item: item.path === "/" ? siteConfig.url : `${siteConfig.url}${item.path}`,
      }),
    })),
  };
}

/** ItemList of links for hub pages (recipes, gallery, blog). `path` is the hub's own, locale-prefixed path. */
export function itemList(
  name: string,
  items: { name: string; path: string }[],
  path = "/"
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: path === "/" ? siteConfig.url : `${siteConfig.url}${path}`,
    isPartOf: { "@id": websiteId },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: `${siteConfig.url}${item.path}`,
      })),
    },
  };
}

/**
 * Site-wide Person schema (SPEC.md §6) — rendered once in each root layout.
 * One @id in both languages: the same photographer, described in the page's
 * language.
 */
export function PersonJsonLd({ locale }: { locale: Locale }) {
  const { person } = getDictionary(locale);
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": personId,
        name: siteConfig.name,
        url: siteConfig.url,
        jobTitle: person.jobTitle,
        description: person.description,
        homeLocation: { "@type": "Place", name: person.homeLocation },
        birthPlace: { "@type": "Place", name: person.birthPlace },
        knowsAbout: person.knowsAbout,
        sameAs: [siteConfig.instagram, siteConfig.threads],
      }}
    />
  );
}

/** Site-wide WebSite schema — names the site and ties it to the Person. */
export function WebSiteJsonLd({ locale }: { locale: Locale }) {
  const { site } = getDictionary(locale);
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": websiteId,
        name: siteConfig.name,
        url: siteConfig.url,
        description: site.description,
        inLanguage: htmlLang[locale],
        publisher: personRef,
      }}
    />
  );
}
