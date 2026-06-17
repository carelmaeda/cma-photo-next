import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import { getAllGuides, getGuide, categoryLabels } from "@/lib/guides";
import { mdxComponents } from "@/components/mdx-components";
import { RelatedLinks } from "@/components/related-links";
import { JsonLd } from "@/components/json-ld";
import { CldImage } from "@/components/cld-image";
import { FrameCaption } from "@/components/frame-caption";
import { siteConfig } from "@/lib/siteConfig";

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

  const ogImage = guide.cover
    ? `https://res.cloudinary.com/${siteConfig.cloudinary.cloudName}/image/upload/w_1200,h_630,c_fill,g_auto,f_auto,q_auto/${guide.cover.publicId}`
    : undefined;

  return {
    title: guide.title,
    description: guide.description,
    openGraph: {
      title: `${guide.title} — ${siteConfig.name}`,
      description: guide.description,
      type: "article",
      publishedTime: guide.date,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const guides = getAllGuides();
  const index = guides.findIndex((entry) => entry.slug === guide.slug);
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
          author: {
            "@type": "Person",
            name: siteConfig.name,
            url: siteConfig.url,
          },
          ...(guide.cover && {
            image: `https://res.cloudinary.com/${siteConfig.cloudinary.cloudName}/image/upload/w_1200,h_630,c_fill,g_auto,f_auto,q_auto/${guide.cover.publicId}`,
          }),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
            { "@type": "ListItem", position: 3, name: guide.title },
          ],
        }}
      />

      <article className="mx-auto max-w-3xl py-12 md:py-16">
        <header>
          <p className="text-cap font-mono tracking-frame text-ink-soft uppercase">
            {categoryLabels[guide.category]} ·{" "}
            {new Date(guide.date).toLocaleDateString("en-CA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="text-h2 mt-4">{guide.title}</h1>
          <p className="mt-4 max-w-prose text-ink-soft">{guide.description}</p>
        </header>

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
