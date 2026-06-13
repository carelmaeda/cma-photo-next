import { siteConfig } from "@/lib/siteConfig";

export interface CheckoutItem {
  stripePriceId: string;
  quantity: number;
}

/**
 * Create a Stripe Checkout Session via the Netlify Function and redirect the
 * browser to Stripe's hosted checkout. No keys or card data touch the client.
 */
export async function startCheckout(items: CheckoutItem[]): Promise<void> {
  const res = await fetch(siteConfig.stripe.createCheckoutSession, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });

  if (!res.ok) {
    const message = await res.text().catch(() => "");
    throw new Error(`Checkout failed (${res.status}). ${message}`.trim());
  }

  const { url } = (await res.json()) as { url?: string };
  if (!url) throw new Error("Checkout session did not return a URL.");
  window.location.href = url;
}
