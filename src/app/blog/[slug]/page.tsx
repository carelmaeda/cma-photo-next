import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import { getAllGuides, getGuide, categoryLabels } from "@/lib/guides";
import { mdxComponents } from "@/components/mdx-components";
import { RelatedLinks } from "@/components/related-links";
import { JsonLd, breadcrumbList, personRef } from "@/components/json-ld";
import { CldImage } from "@/components/cld-image";
import { FrameCaption } from "@/components/frame-caption";
import { RecipeCover } from "@/components/recipe-cover";
import { recipes } from "@/content/recipes";
import { siteConfig } from "@/lib/siteConfig";
import { pageMetadata, ogImageUrl, defaultOgImage } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};

  return pageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/blog/${guide.slug}`,
    image: guide.cover ? ogImageUrl(guide.cover.publicId) : undefined,
    keywords: guide.keywords,
    article: {
      publishedTime: guide.date,
      modifiedTime: guide.updated,
      section: categoryLabels[guide.category],
      tags: guide.keywords,
    },
  });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const guides = getAllGuides();
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
          mainEntityOfPage: `${siteConfig.url}/blog/${guide.slug}`,
          articleSection: categoryLabels[guide.category],
          ...(guide.keywords && { keywords: guide.keywords.join(", ") }),
          image: guide.cover ? ogImageUrl(guide.cover.publicId) : defaultOgImage,
        }}
      />
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: guide.title },
        ])}
      />

      <article className="mx-auto max-w-3xl pt-3 pb-4 md:pt-4 md:pb-5">
        <header>
          <p className="text-cap font-mono tracking-frame text-ink-soft uppercase">
            {categoryLabels[guide.category]} ·{" "}
            {new Date(guide.date).toLocaleDateString("en-CA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
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
            components={mdxComponents}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>

        <RelatedLinks albums={guide.related?.albums} />

        <nav className="mt-10 flex justify-between gap-4 border-t border-line pt-8 text-sm">
          {prev ? (
            <Link
              href={`/blog/${prev.slug}`}
              className="text-cap font-mono tracking-frame uppercase hover:text-indigo"
            >
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/blog/${next.slug}`}
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
