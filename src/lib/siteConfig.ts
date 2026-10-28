/**
 * Every external URL/ID the site uses lives here, once.
 * Unknown values stay TODO_ placeholders — never invent real-looking IDs.
 */
export const siteConfig = {
  name: "Carel Maeda",
  title: "Carel Maeda: Fujifilm Recipes and Travel Photography",
  description:
    "Free Fujifilm recipes with every setting listed, travel photography city by city, and notes on shooting JPG straight out of camera. São Paulo made, Toronto based.",
  url: "https://photo.carelmaeda.com",
  instagram: "https://instagram.com/carel011",
  threads: "https://threads.net/@carel011",
  cloudinary: {
    cloudName: "duwhxzb0q",
  },
  /** Netlify form names — must match public/__forms.html exactly */
  forms: {
    newsletter: "newsletter",
  },
  /** Google Analytics 4 — <Analytics> inlines the gtag stub and loads gtag.js after window load. */
  analytics: {
    enabled: true,
    gaId: "G-EQRSTMDRHZ",
  },
  /**
   * Stripe — digital checkout (SPEC §5). Checkout is a redirect to a
   * server-created hosted session, so no publishable key is needed client-side
   * (add one back only if Stripe.js ever gets embedded). The SECRET key lives
   * only in Netlify env (STRIPE_SECRET_KEY), never here. Per-product price IDs
   * live in src/content/products.ts; paid items stay TODO_ (and hidden via
   * isLive) until the owner creates them in the Stripe dashboard.
   */
  stripe: {
    createCheckoutSession: "/.netlify/functions/create-checkout-session",
    verifySession: "/.netlify/functions/verify-session",
    /** Display + charge currency. Stripe prices must be created in this currency. */
    currency: "cad",
  },
  /**
   * Launch-light mode (SPEC §10). The store, gallery, and prints code stays in
   * the repo; these flags remove them from nav/sitemap and redirect or hide
   * their entry points. Flip a flag back to true to restore that section
   * (for the store, also reinstate the /downloads redirects in netlify.toml).
   */
  features: {
    store: false, // /downloads catalog + product pages + cart widget + nav item
    gallery: false, // Gallery nav item only; /gallery and album pages stay live (off since October 21, 2026, the home page is the album wall)
    prints: false, // Prints nav item (page itself is already noindex)
  } as { store: boolean; gallery: boolean; prints: boolean },
} as const;
