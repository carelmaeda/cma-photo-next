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
  /** Intrinsic pixel size from Cloudinary (scripts/photo-dimensions.mjs). Lets grids render the natural aspect ratio. */
  width?: number;
  height?: number;
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
  /** True while the album's photos are not live on Cloudinary (placeholder or awaiting re-upload). Hidden everywhere; its page 404s. */
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

/** One row in a recipe's settings table — values mirror the camera menus. */
export interface RecipeSetting {
  label: string;
  /** The value to dial in (X-Trans IV / V bodies). */
  value: string;
}

/** A free Fujifilm recipe, published open on /recipes (SPEC §10). */
export interface Recipe {
  slug: string;
  name: string;
  tagline: string;
  /** The film simulation the recipe is built on. */
  filmSimulation: string;
  /** Bodies the recipe targets, e.g. "X-Trans IV / V". */
  compatibility: string;
  settings: RecipeSetting[];
  /** Background of the typographic RecipeCover. */
  coverTone: "brick" | "ink";
  sampleFrames: Photo[];
  /** Slug of the blog post that explains the recipe, if one exists. */
  guideSlug?: string;
}

/** A free Lightroom preset download, served from public/presets/ (SPEC §10). */
export interface PresetFile {
  name: string;
  /** One line: what look it gives and where it came from. */
  description: string;
  /** Path under public/, e.g. "/presets/vanilla-summer.xmp". */
  file: string;
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
  /** ISO date of the last real revision. Feeds dateModified + the sitemap. */
  updated?: string;
  /** Search phrases this post targets; prepended to the site-wide list. */
  keywords?: string[];
  category: "recipe-guide" | "city-guide" | "craft";
  /** True = keep the file but publish nowhere (index, sitemap, params, teasers). */
  draft?: boolean;
  cover?: { publicId: string; alt: string };
  cameras?: Camera[];
  related?: {
    albums?: string[];
    guides?: string[];
  };
}
