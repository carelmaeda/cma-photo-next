import type { Metadata } from "next";
import Link from "next/link";
import { getAllGuides, categoryLabels } from "@/lib/guides";
import { JsonLd, itemList } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";

const description =
  "Plain-English guides to Fujifilm recipes and film simulations, shooting JPG with no editing, and travel photography on the X100V and GFX100RF.";

export const metadata: Metadata = pageMetadata({
  title: "Fujifilm Recipes and Travel Photography Blog",
  description,
  path: "/blog",
  keywords: [
    "Fujifilm recipes explained",
    "Fujifilm film simulations guide",
    "shooting JPEG only",
    "travel photography blog",
  ],
});

export default function GuidesPage() {
  const guides = getAllGuides();

  return (
    <div className="px-gutter">
      <JsonLd
        data={itemList(
          "Blog",
          guides.map((guide) => ({
            name: guide.title,
            path: `/blog/${guide.slug}`,
          }))
        )}
      />
      <header className="mx-auto max-w-7xl pt-3 pb-4 md:pt-4 md:pb-5">
        <h1 className="text-h3">Blog</h1>
        <p className="mt-1 max-w-prose text-sm text-ink-soft">
          Things I&apos;ve figured out, written down properly. No filler.
        </p>
      </header>

      <section className="mx-auto max-w-3xl">
        <ul>
          {guides.map((guide) => (
            <li key={guide.slug} className="border-t border-line">
              <Link href={`/blog/${guide.slug}`} className="group block py-8">
                <p className="text-cap font-mono tracking-frame text-ink-soft uppercase">
                  {categoryLabels[guide.category]} ·{" "}
                  {new Date(guide.date).toLocaleDateString("en-CA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
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
