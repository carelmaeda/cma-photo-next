import Stripe from "stripe";

/**
 * Creates a Stripe Checkout Session from the client cart and returns its URL.
 * The only server touchpoint in the app (SPEC §5). No DB, no stored orders.
 *
 * Env (set in Netlify, never committed):
 *   STRIPE_SECRET_KEY   — Stripe secret key (test or live)
 *   URL                 — provided by Netlify; the site's base URL
 */

interface Item {
  stripePriceId: string;
  quantity: number;
}

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const handler = async (event: {
  httpMethod: string;
  body: string | null;
}) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return json(500, { error: "Stripe is not configured." });
  }

  let items: Item[] = [];
  try {
    const parsed = JSON.parse(event.body ?? "{}");
    items = Array.isArray(parsed.items) ? parsed.items : [];
  } catch {
    return json(400, { error: "Invalid request body." });
  }

  // Validate: known-shaped, configured price ids only.
  const lineItems = items
    .filter(
      (i) =>
        typeof i.stripePriceId === "string" &&
        i.stripePriceId.startsWith("price_") &&
        Number.isInteger(i.quantity) &&
        i.quantity > 0
    )
    .map((i) => ({ price: i.stripePriceId, quantity: i.quantity }));

  if (lineItems.length === 0) {
    return json(400, { error: "No valid items to check out." });
  }

  const stripe = new Stripe(secret);
  const base = process.env.URL ?? "https://photo.carelmaeda.com";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/cart`,
      // Digital goods — collect email for the receipt + delivery, no shipping.
      billing_address_collection: "auto",
      allow_promotion_codes: true,
    });
    return json(200, { url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed.";
    return json(502, { error: message });
  }
};
