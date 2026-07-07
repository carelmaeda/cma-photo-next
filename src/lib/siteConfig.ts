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
} as const;
