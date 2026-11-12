import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import { CldImage } from "@/components/cld-image";
import { FrameCaption } from "@/components/frame-caption";
import { JsonLd, breadcrumbList, personRef } from "@/components/json-ld";
import { mdxComponents } from "@/components/mdx-components";
import { RecipeCover } from "@/components/recipe-cover";
import { RelatedLinks } from "@/components/related-links";
import { recipes } from "@/content/recipes";
import { getAllGuides, getGuide } from "@/lib/guides";
import { formatDate, getDictionary, localePath, type Locale } from "@/lib/i18n";
import { pageMetadata, ogImageUrl, defaultOgImage } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

export function postMetadata(locale: Locale, slug: string): Metadata {
  const guide = getGuide(slug, locale);
  if (!guide) return {};
  const t = getDictionary(locale).blog;

  return pageMetadata({
    locale,
    title: guide.title,
    description: guide.description,
    path: localePath(locale, `/blog/${guide.slug}`),
    image: guide.cover ? ogImageUrl(guide.cover.publicId) : undefined,
    keywords: guide.keywords,
    article: {
      publishedTime: guide.date,
      modifiedTime: guide.updated,
      section: t.categories[guide.category],
      tags: guide.keywords,
    },
  });
}

export function PostPage({ locale, slug }: { locale: Locale; slug: string }) {
  const guide = getGuide(slug, locale);
  if (!guide) notFound();

  const dict = getDictionary(locale);
  const guides = getAllGuides(locale);
  const index = guides.findIndex((entry) => entry.slug === guide.slug);
  // A recipe explainer without its own photo leads with the recipe's cover.
  const recipe = recipes.find((entry) => entry.guideSlug === guide.slug);
  const prev = guides[index + 1];
  const next = guides[index - 1];

  return (
    <div className="px-gutter">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.description,
          datePublished: guide.date,
          dateModified: guide.updated ?? guide.date,
          author: personRef,
          publisher: personRef,
          mainEntityOfPage: `${siteConfig.url}${localePath(locale, `/blog/${guide.slug}`)}`,
          articleSection: dict.blog.categories[guide.category],
          ...(guide.keywords && { keywords: guide.keywords.join(", ") }),
          image: guide.cover ? ogImageUrl(guide.cover.publicId) : defaultOgImage,
        }}
      />
      <JsonLd
        data={breadcrumbList([
          { name: dict.breadcrumbs.home, path: localePath(locale, "/") },
          { name: dict.breadcrumbs.blog, path: localePath(locale, "/blog") },
          { name: guide.title },
        ])}
      />

      <article className="mx-auto max-w-3xl pt-3 pb-4 md:pt-4 md:pb-5">
        <header>
          <p className="text-cap font-mono tracking-frame text-ink-soft uppercase">
            {dict.blog.categories[guide.category]} ·{" "}
            {formatDate(guide.date, locale)}
          </p>
          <h1 className="text-h3 mt-1">{guide.title}</h1>
          <p className="mt-1 max-w-prose text-sm text-ink-soft">{guide.description}</p>
        </header>

        {!guide.cover && recipe && (
          <RecipeCover recipe={recipe} variant="wide" className="mt-10" />
        )}
        {guide.cover && (
          <figure className="mt-10">
            <CldImage
              photo={guide.cover}
              width={1600}
              height={1000}
              crop="fill"
              gravity="auto"
              priority
              sizes="(min-width: 768px) 680px, 100vw"
              className="w-full"
            />
            <FrameCaption
              camera={guide.cameras?.[0]}
              className="mt-3"
            />
          </figure>
        )}

        <div className="mt-10">
          <MDXRemote
            source={guide.content}
            components={mdxComponents(locale)}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>

        <RelatedLinks albums={guide.related?.albums} locale={locale} />

        <nav className="mt-10 flex justify-between gap-4 border-t border-line pt-8 text-sm">
          {prev ? (
            <Link
              href={localePath(locale, `/blog/${prev.slug}`)}
              className="text-cap font-mono tracking-frame uppercase hover:text-indigo"
            >
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={localePath(locale, `/blog/${next.slug}`)}
              className="text-right text-cap font-mono tracking-frame uppercase hover:text-indigo"
            >
              {next.title} →
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}
