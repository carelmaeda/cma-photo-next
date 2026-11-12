import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, itemList } from "@/components/json-ld";
import { getAllGuides } from "@/lib/guides";
import { formatDate, getDictionary, localePath, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function blogMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    title: dict.blog.title,
    description: dict.blog.description,
    path: localePath(locale, "/blog"),
    keywords: dict.blog.keywords,
  });
}

export function BlogPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).blog;
  const guides = getAllGuides(locale);

  return (
    <div className="px-gutter">
      <JsonLd
        data={itemList(
          t.listName,
          guides.map((guide) => ({
            name: guide.title,
            path: localePath(locale, `/blog/${guide.slug}`),
          }))
        )}
      />
      <header className="mx-auto max-w-7xl pt-3 pb-4 md:pt-4 md:pb-5">
        <h1 className="text-h3">{t.heading}</h1>
        <p className="mt-1 max-w-prose text-sm text-ink-soft">{t.intro}</p>
      </header>

      <section className="mx-auto max-w-3xl">
        <ul>
          {guides.map((guide) => (
            <li key={guide.slug} className="border-t border-line">
              <Link href={localePath(locale, `/blog/${guide.slug}`)} className="group block py-8">
                <p className="text-cap font-mono tracking-frame text-ink-soft uppercase">
                  {t.categories[guide.category]} ·{" "}
                  {formatDate(guide.date, locale)}
                </p>
                <h2 className="mt-3 font-display text-2xl font-semibold group-hover:text-indigo">
                  {guide.title}
                </h2>
                <p className="mt-2 max-w-prose text-sm text-ink-soft">
                  {guide.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
