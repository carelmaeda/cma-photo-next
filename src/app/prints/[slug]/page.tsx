import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CldImage } from "@/components/cld-image";
import { FrameCaption } from "@/components/frame-caption";
import { AddToCart } from "@/components/add-to-cart";
import { JsonLd } from "@/components/json-ld";
import { getProduct, paidProducts, priceLabel, isLive } from "@/content/products";
import { siteConfig } from "@/lib/siteConfig";
import { social, ogImageUrl } from "@/lib/seo";

export function generateStaticParams() {
  return paidProducts("print").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct("print", slug);
  if (!product) return {};
  return {
    title: `${product.name} — digital print`,
    description: product.description,
    ...social(product.name, product.description, ogImageUrl(product.image.publicId)),
  };
}

export default async function PrintProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct("print", slug);
  // Only paid, configured prints have a detail page; free lives at /shop.
  if (!product || product.free || !isLive(product)) notFound();

  return (
    <div className="px-gutter">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: ogImageUrl(product.image.publicId),
          offers: {
            "@type": "Offer",
            price: ((product.price ?? 0) / 100).toFixed(2),
            priceCurrency: (
              product.currency ?? siteConfig.stripe.currency
            ).toUpperCase(),
            availability: "https://schema.org/InStock",
          },
        }}
      />

      <div className="mx-auto grid max-w-7xl gap-10 py-12 md:grid-cols-2 md:py-16">
        <div>
          <CldImage
            photo={product.image}
            width={1200}
            height={1500}
            crop="fill"
            gravity="auto"
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="w-full border border-line"
          />
          <FrameCaption city={product.image.city} className="mt-3" />
        </div>

        <div className="md:pt-6">
          <h1 className="text-h2">{product.name}</h1>
          <p className="mt-3 font-mono text-lg text-ink">{priceLabel(product)}</p>
          <p className="mt-6 max-w-prose text-ink-soft">
            {product.description}
          </p>

          <div className="mt-8">
            <AddToCart product={product} />
          </div>

          <ul className="mt-10 space-y-2 border-t border-line pt-6 text-sm text-ink-soft">
            <li>High-resolution digital file, delivered after checkout.</li>
            <li>Print at home or at a lab, good up to A3.</li>
            <li>Secure checkout by Stripe.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
