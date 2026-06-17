import type { Product, ProductKind } from "@/lib/types";
import { siteConfig } from "@/lib/siteConfig";
import { prints } from "@/content/prints";
import { sampleFrames } from "@/content/recipes";

/**
 * The store catalog (SPEC §2/§5). Digital-only, free + paid.
 *
 * Free items are real today and render in the grids behind the goodwill gate.
 * Paid items check out through Stripe. A paid item only goes live once its
 * `stripePriceId` is a real id (not "TODO_…") — see `isLive()` below — so the
 * store never shows a half-built product or a fake "coming soon".
 *
 * To add a paid product the owner: (1) creates the product + price in Stripe,
 * (2) pastes the price id + amount here, (3) sets `downloadPublicId` to the
 * Cloudinary file delivered after purchase. Nothing else changes.
 */

// — Recipes —
export const recipeProducts: Product[] = [
  {
    slug: "vanilla-summer-recipe-card",
    kind: "recipe",
    name: "Vanilla Summer — Recipe Card",
    description:
      "A digital recipe card for vanilla summer cookies. Instant PDF download after checkout.",
    image: sampleFrames[0], // reuse an existing frame until a real cover exists
    free: false,
    price: 300, // 300 = $3.00 CAD (smallest unit)
    stripePriceId: "price_1Thvm3ANgGBn4EAZV5q9IHms",
    // Delivery comes from the Stripe product's metadata.downloadPublicId (read by
    // verify-session after payment); this field is only a repo-side reference.
    downloadPublicId: "TODO_recipe_pdf_publicId",
  },
];

// — Prints — the existing free set, as products.
export const printProducts: Product[] = prints.map((print) => ({
  slug: slugify(print.title),
  kind: "print" as ProductKind,
  name: print.title,
  description: `${print.title} — full-resolution file, good up to A3.`,
  image: print.photo,
  free: true,
  downloadPublicId: print.photo.publicId,
}));
/* Paid prints follow the same shape as the recipe EXAMPLE above, with
   kind: "print", a real `price` + `stripePriceId`, and a high-res
   `downloadPublicId`. They appear in /shop automatically once configured. */

export const allProducts: Product[] = [...recipeProducts, ...printProducts];

/**
 * A paid product is live once it has a real (non-"TODO_") Stripe price id.
 * Delivery itself is driven by the Stripe *product metadata* `downloadPublicId`
 * that `verify-session` reads after payment — so a paid product only needs its
 * price id here; the file is configured on the Stripe product, not in this repo.
 */
export function isLive(p: Product): boolean {
  if (p.free) return true;
  return Boolean(p.stripePriceId && !p.stripePriceId.startsWith("TODO_"));
}

/** Products to render for a store section: free items + configured paid items. */
export function storeProducts(kind: ProductKind): Product[] {
  const source = kind === "recipe" ? recipeProducts : printProducts;
  return source.filter(isLive);
}

/** Paid, live products of a kind — used for [slug] detail static params. */
export function paidProducts(kind: ProductKind): Product[] {
  return (kind === "recipe" ? recipeProducts : printProducts).filter(
    (p) => !p.free && isLive(p)
  );
}

export function getProduct(kind: ProductKind, slug: string): Product | undefined {
  return (kind === "recipe" ? recipeProducts : printProducts).find(
    (p) => p.slug === slug
  );
}

/** Format a paid price for display, e.g. 500 → "$5.00". */
export function priceLabel(p: Product): string {
  if (p.free || p.price == null) return "Free";
  const currency = (p.currency ?? siteConfig.stripe.currency).toUpperCase();
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
  }).format(p.price / 100);
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
