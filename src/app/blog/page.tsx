import type { Metadata } from "next";
import Link from "next/link";
import { getAllGuides, categoryLabels } from "@/lib/guides";
import { social } from "@/lib/seo";

const description =
  "What I've figured out about Fujifilm recipes, shooting JPG only, and travel photography — written down properly.";

export const metadata: Metadata = {
  title: "Blog",
  description,
  ...social("Blog", description),
};

export default function GuidesPage() {
  const guides = getAllGuides();

  return (
    <div className="px-gutter">
      <header className="mx-auto max-w-7xl py-12 md:py-16">
        <h1 className="text-h2">Blog</h1>
        <p className="mt-3 max-w-prose text-ink-soft">
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
