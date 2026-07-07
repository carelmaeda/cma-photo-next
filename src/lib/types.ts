export type Camera = "GFX100RF" | "X100V" | "X-Pro3" | "Leica M5";

export interface Photo {
  /** Cloudinary publicId, versioned path form is fine (e.g. "v174.../Paris/DSCF0313.jpg") */
  publicId: string;
  /** Required — meaningful, descriptive. Enforced here so no image ships without it. */
  alt: string;
  /** Film-edge frame number, e.g. "FR-014" */
  frame?: string;
  city?: string;
  camera?: Camera;
  /** e.g. "Vanilla Summer" */
  recipe?: string;
}

export interface Album {
  slug: string;
  title: string;
  country: string;
  year?: number;
  /** 1–2 sentences, used in page metadata */
  description: string;
  cover: Photo;
  photos: Photo[];
  /** True while an album still shows another city's images — page gets noindex */
  placeholderImages?: boolean;
}

export type GearCategory =
  | "Cameras"
  | "Lenses"
  | "Film & Accessories"
  | "Bags & Straps";

export interface GearItem {
  name: string;
  category: GearCategory;
  /** The owner's one-line honest take */
  blurb: string;
  /** Affiliate link — stays empty until the affiliate phase */
  link?: string;
  image?: Photo;
}

export interface Print {
  photo: Photo;
  title: string;
}

export type ProductKind = "recipe" | "print";

/**
 * A store item (SPEC §2/§5). Digital-only.
 * - free items deliver behind the Netlify Forms goodwill gate (no Stripe).
 * - paid items check out through Stripe; `stripePriceId` stays "TODO_…" until
 *   the owner creates the price in the Stripe dashboard. Unconfigured paid
 *   products are filtered out of the store (see content/products.ts), so
 *   nothing half-built ever renders.
 */
export interface Product {
  slug: string;
  kind: ProductKind;
  name: string;
  /** 1–2 sentences — used on cards, detail pages, and metadata. */
  description: string;
  image: Photo;
  /** true = free (gate); false = paid (Stripe). */
  free: boolean;
  /** Paid only: price in the smallest currency unit (e.g. cents). */
  price?: number;
  /** ISO currency, defaults to siteConfig display currency. */
  currency?: string;
  /** Paid only: Stripe Price ID. "TODO_…" until the owner creates it. */
  stripePriceId?: string;
  /** Cloudinary publicId delivered after purchase / gate (fl_attachment). */
  downloadPublicId?: string;
}

/** One line in the client cart (paid products only). */
export interface CartLine {
  slug: string;
  kind: ProductKind;
  name: string;
  price: number;
  currency: string;
  stripePriceId: string;
  image: Photo;
  quantity: number;
}

export interface GuideFrontmatter {
  title: string;
  description: string;
  date: string;
  category: "recipe-guide" | "city-guide" | "craft";
  cover?: { publicId: string; alt: string };
  cameras?: Camera[];
  related?: {
    albums?: string[];
    guides?: string[];
  };
}
