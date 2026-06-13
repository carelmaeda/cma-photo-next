/**
 * Every external URL/ID the site uses lives here, once.
 * Unknown values stay TODO_ placeholders — never invent real-looking IDs.
 */
export const siteConfig = {
  name: "Carel Maeda",
  title: "Carel Maeda — Travel & Fujifilm Photography",
  description:
    "Travel photography from a Fujifilm shooter. São Paulo made, Toronto based. Free Vanilla Summer recipe, prints, and guides on shooting JPG straight out of camera.",
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
  /** Google Analytics — flipped on by the owner after deploy */
  analytics: {
    enabled: false,
    gaId: "TODO_GA_MEASUREMENT_ID",
  },
  /**
   * Stripe — digital checkout (SPEC §5). Publishable key is client-safe.
   * The SECRET key lives only in Netlify env (STRIPE_SECRET_KEY), never here.
   * Per-product price IDs live in src/content/{recipes,prints}.ts as TODO_ until
   * the owner creates them in the Stripe dashboard.
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
