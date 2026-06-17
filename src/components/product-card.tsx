import Link from "next/link";
import { CldImage } from "@/components/cld-image";
import { AddToCart } from "@/components/add-to-cart";
import { priceLabel } from "@/content/products";
import type { Product } from "@/lib/types";

/**
 * Store grid card. The image + title link to the detail page (paid) or the
 * section gate (free). Paid cards also carry an inline "Add to cart" button.
 */
export function ProductCard({ product }: { product: Product }) {
  const href =
    product.kind === "recipe"
      ? product.free
        ? "/downloads"
        : `/downloads/${product.slug}`
      : product.free
        ? "/prints"
        : `/prints/${product.slug}`;

  return (
    <div className="group flex flex-col">
      <Link href={href} className="block">
        <CldImage
          photo={product.image}
          width={800}
          height={1000}
          crop="fill"
          gravity="auto"
          sizes="(min-width: 768px) 33vw, 50vw"
          className="w-full border border-line transition-opacity group-hover:opacity-90"
        />
      </Link>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="text-lg group-hover:text-indigo">
          <Link href={href}>{product.name}</Link>
        </h3>
        <span className="shrink-0 font-mono text-cap text-warm">
          {priceLabel(product)}
        </span>
      </div>
      <p className="mt-1 max-w-prose text-sm text-ink-soft">
        {product.description}
      </p>

      {!product.free && (
        <div className="mt-4">
          <AddToCart product={product} compact />
        </div>
      )}
    </div>
  );
}
