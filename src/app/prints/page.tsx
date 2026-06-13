import type { Metadata } from "next";
import { CldImage } from "@/components/cld-image";
import { FrameCaption } from "@/components/frame-caption";
import { PrintsGate } from "@/components/prints-gate";
import { ProductCard } from "@/components/product-card";
import { prints, printDownloadUrl } from "@/content/prints";
import { paidProducts } from "@/content/products";

export const metadata: Metadata = {
  title: "Prints",
  description:
    "Frames as digital print downloads — free and paid, full resolution, good up to A3. Print at home.",
};

export default function PrintsPage() {
  const downloads = prints.map((print) => ({
    title: print.title,
    url: printDownloadUrl(print),
  }));
  const paidPrints = paidProducts("print");

  return (
    <div className="px-gutter">
      <header className="mx-auto max-w-7xl py-12 md:py-16">
        <h1 className="text-h2">Prints</h1>
        <div className="mt-3 max-w-prose space-y-4 text-ink-muted">
          <p>
            Frames I&apos;d hang myself, as full-resolution digital files. Print
            them at home or at a lab, up to A3.
          </p>
          <p>
            The free set opens after a quick email below. Paid prints check out
            securely with Stripe and download right after.
          </p>
        </div>
      </header>

      {/* Paid prints — only render once configured in Stripe */}
      {paidPrints.length > 0 && (
        <section className="mx-auto max-w-7xl pb-section">
          <h2 className="text-h2">Prints</h2>
          <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3">
            {paidPrints.map((product) => (
              <li key={product.slug}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Free prints */}
      <section className="mx-auto max-w-7xl">
        <h2 className="text-h2">Free prints</h2>
        <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
          {prints.map((print) => (
            <li key={print.photo.publicId}>
              <CldImage
                photo={print.photo}
                width={800}
                height={1000}
                crop="fill"
                gravity="auto"
                sizes="(min-width: 768px) 33vw, 50vw"
                className="w-full"
              />
              <FrameCaption city={print.title} className="mt-3" />
            </li>
          ))}
        </ul>
      </section>

      {/* The gate */}
      <section className="mx-auto max-w-7xl pt-section">
        <div className="max-w-2xl border-t border-line pt-12">
          <h2 className="text-h2">Get the files</h2>
          <div className="mt-8">
            <PrintsGate downloads={downloads} />
          </div>
        </div>
      </section>

      {/* Print-at-home notes */}
      <section className="mx-auto max-w-7xl pt-section pb-4">
        <div className="max-w-prose">
          <h2 className="font-display text-xl font-semibold">Printing notes</h2>
          <ul className="mt-4 space-y-3 text-sm text-ink-muted">
            <li>
              Matte or semi-matte paper suits these — the look leans warm and
              soft, and glossy fights it.
            </li>
            <li>
              The files hold up to A3. Beyond that they&apos;ll soften;
              I&apos;d rather you print smaller and sharper.
            </li>
            <li>
              A cheap frame and a real wall beat a perfect file on a hard
              drive.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
