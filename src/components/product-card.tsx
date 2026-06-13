import Link from "next/link";
import { CldImage } from "@/components/cld-image";
import { priceLabel } from "@/content/products";
import type { Product } from "@/lib/types";

/** Store grid card. Links to the product detail (paid) or the gate (free). */
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
    <Link href={href} className="group block">
      <CldImage
        photo={product.image}
        width={800}
        height={1000}
        crop="fill"
        gravity="auto"
        sizes="(min-width: 768px) 33vw, 50vw"
        className="w-full border border-line transition-opacity group-hover:opacity-90"
      />
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="text-lg group-hover:text-indigo">{product.name}</h3>
        <span className="shrink-0 font-mono text-cap text-warm">
          {priceLabel(product)}
        </span>
      </div>
      <p className="mt-1 max-w-prose text-sm text-ink-muted">
        {product.description}
      </p>
    </Link>
  );
}
