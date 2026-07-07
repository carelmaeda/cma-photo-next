import type { Metadata } from "next";
import Link from "next/link";
import { CldImage } from "@/components/cld-image";
import { ProductCard } from "@/components/product-card";
import { storeProducts } from "@/content/products";
import { getAllGuides, categoryLabels } from "@/lib/guides";
import { social } from "@/lib/seo";

const description =
  "Digital downloads from a Fujifilm shooter — recipes and prints, delivered as instant files after checkout.";

export const metadata: Metadata = {
  title: "Digital Downloads",
  description,
  ...social("Digital Downloads", description),
};

export default function DownloadsPage() {
  const products = storeProducts("recipe");
  const reading = getAllGuides().slice(0, 2);

  return (
    <div className="px-gutter">
      <header className="mx-auto max-w-7xl py-12 md:py-16">
        <h1 className="text-display leading-[1.05]">Digital Downloads</h1>
        <p className="mt-6 max-w-prose text-ink-soft">
          Things I made to use in your own photography — delivered as instant
          downloads right after checkout.
        </p>
      </header>

      <section className="mx-auto max-w-7xl">
        <ul className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3">
          {products.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>

      {reading.length > 0 && (
        <section className="mx-auto max-w-7xl pt-section">
          <h2 className="text-h2">Worth a read</h2>
          <ul className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2">
            {reading.map((guide) => (
              <li key={guide.slug}>
                <Link href={`/blog/${guide.slug}`} className="group block">
                  {guide.cover && (
                    <CldImage
                      photo={guide.cover}
                      width={800}
                      height={500}
                      crop="fill"
                      gravity="auto"
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="mb-4 w-full border border-line transition-opacity group-hover:opacity-90"
                    />
                  )}
                  <p className="text-cap font-mono tracking-frame text-ink-soft uppercase">
                    {categoryLabels[guide.category]}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold group-hover:text-indigo">
                    {guide.title}
                  </h3>
                  <p className="mt-2 max-w-prose text-sm text-ink-soft">
                    {guide.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
