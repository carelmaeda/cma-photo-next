import type { Metadata } from "next";
import { gear, gearCategories } from "@/content/gear";
import { JsonLd, personId } from "@/components/json-ld";
import { gearBlurb, getDictionary, localePath, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

export function aboutMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    title: dict.about.title,
    description: dict.about.description,
    path: localePath(locale, "/about"),
    keywords: dict.about.keywords,
  });
}

export function AboutPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.about;

  return (
    <div className="px-gutter">
      {/* ProfilePage: tells Google this URL is the photographer's own page. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: `${siteConfig.url}${localePath(locale, "/about")}`,
          mainEntity: {
            "@type": "Person",
            "@id": personId,
            name: siteConfig.name,
            url: siteConfig.url,
            jobTitle: dict.person.jobTitle,
            description: t.description,
            sameAs: [siteConfig.instagram, siteConfig.threads],
          },
        }}
      />
      <header className="mx-auto max-w-7xl pt-3 pb-4 md:pt-4 md:pb-5">
        <h1 className="text-h3">{t.heading}</h1>
      </header>

      <section className="mx-auto max-w-7xl">
        <div className="max-w-prose space-y-4 text-ink-soft">{t.intro}</div>
      </section>

      {/* Gear — folded in from the old /gear page (SPEC §2 IA) */}
      <section className="mx-auto max-w-7xl pt-section">
        <div className="max-w-3xl border-t border-line pt-12">
          <h2 className="text-h2">{t.gearHeading}</h2>
          <p className="mt-3 max-w-prose text-ink-soft">{t.gearIntro}</p>

          <div className="mt-8">
            {gearCategories.map((category) => {
              const items = gear.filter((item) => item.category === category);
              if (items.length === 0) return null;

              return (
                <div key={category} className="mb-12">
                  <h3 className="text-cap font-mono tracking-frame text-ink-soft uppercase">
                    {t.gearCategories[category]}
                  </h3>
                  <ul className="mt-4">
                    {items.map((item) => (
                      <li key={item.name} className="border-t border-line py-5">
                        <p className="text-lg">{item.name}</p>
                        <p className="mt-1 max-w-prose text-sm text-ink-soft">
                          {gearBlurb(item, locale)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            <p className="border-t border-line pt-6 text-sm text-ink-soft">{t.gearNote}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl pt-section pb-4">
        <div className="max-w-2xl border-t border-line pt-8">{t.contact}</div>
      </section>
    </div>
  );
}
