/**
 * Every external URL/ID the site uses lives here, once.
 * Unknown values stay TODO_ placeholders — never invent real-looking IDs.
 */
export const siteConfig = {
  name: "Carel Maeda",
  title: "Carel Maeda — Travel & Fujifilm Photography",
  description:
    "Travel photography from a Fujifilm shooter. São Paulo made, Toronto based. The Vanilla Summer recipe, prints, and guides on shooting JPG straight out of camera.",
  url: "https://photo.carelmaeda.com",
  instagram: "https://instagram.com/carel011",
  threads: "https://threads.net/@carel011",
  cloudinary: {
    cloudName: "duwhxzb0q",
  },
  /** Netlify form names — must match public/__forms.html exactly */
  forms: {
    newsletter: "newsletter",
    contact: "contact",
  },
  /** Google Analytics 4 — gtag.js is injected by <Analytics> (@next/third-parties). */
  analytics: {
    enabled: true,
    gaId: "G-EQRSTMDRHZ",
  },
  /**
   * Stripe — digital checkout (SPEC §5). Publishable key is client-safe.
   * The SECRET key lives only in Netlify env (STRIPE_SECRET_KEY), never here.
   * Per-product price IDs + delivery publicIds live in src/content/products.ts;
   * paid items stay TODO_ (and hidden via isLive) until the owner creates them in
   * the Stripe dashboard.
   */
  stripe: {
    publishableKey:
      "pk_live_51T3bajANgGBn4EAZXBVaR4kzGT9FN2FwHVf7EWirLd5PBtA0hLMYv0pUlXhBt9lqQSfTWYtyVDKzIeMhy1lBVVL500Jo24noaO",
    createCheckoutSession: "/.netlify/functions/create-checkout-session",
    verifySession: "/.netlify/functions/verify-session",
    /** Display + charge currency. Stripe prices must be created in this currency. */
    currency: "cad",
  },
} as const;
