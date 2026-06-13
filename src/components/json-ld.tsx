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

/** Site-wide Person schema (SPEC.md §6) — rendered once in the root layout. */
export function PersonJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Person",
        name: siteConfig.name,
        url: siteConfig.url,
        jobTitle: "Photographer",
        sameAs: [siteConfig.instagram, siteConfig.threads],
      }}
    />
  );
}
