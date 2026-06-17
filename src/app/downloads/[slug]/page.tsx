import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CldImage } from "@/components/cld-image";
import { FrameCaption } from "@/components/frame-caption";
import { AddToCart } from "@/components/add-to-cart";
import { JsonLd } from "@/components/json-ld";
import { getProduct, paidProducts, priceLabel, isLive } from "@/content/products";
import { siteConfig } from "@/lib/siteConfig";

export function generateStaticParams() {
  return paidProducts("recipe").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct("recipe", slug);
  if (!product) return {};
  const ogImage = `https://res.cloudinary.com/${siteConfig.cloudinary.cloudName}/image/upload/w_1200,h_630,c_fill,g_auto,f_auto,q_auto/${product.image.publicId}`;
  return {
    title: `${product.name} — Fujifilm recipe`,
    description: product.description,
    openGraph: {
      title: `${product.name} — ${siteConfig.name}`,
      description: product.description,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ${siteConfig.name}`,
      description: product.description,
      images: [ogImage],
    },
  };
}

export default async function RecipeProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct("recipe", slug);
  // Only paid, configured recipes have a detail page; free lives at /recipes.
  if (!product || product.free || !isLive(product)) notFound();

  return (
    <div className="px-gutter">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: `https://res.cloudinary.com/${siteConfig.cloudinary.cloudName}/image/upload/w_1200,h_630,c_fill,g_auto,f_auto,q_auto/${product.image.publicId}`,
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
            <li>Delivered as a digital download right after checkout.</li>
            <li>The full settings on a recipe card — for X-Trans IV and V bodies.</li>
            <li>Secure checkout by Stripe.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
