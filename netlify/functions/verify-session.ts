import Stripe from "stripe";

/**
 * Verifies a completed Checkout Session and returns the digital download links
 * (SPEC §5). Entitlement is the paid session itself — no accounts, no DB.
 *
 * The download file for each item is read from the Stripe Product metadata key
 * `downloadPublicId` (the Cloudinary publicId). The owner sets it when creating
 * the product in Stripe. Delivery is a Cloudinary `fl_attachment` URL.
 *
 * Env:
 *   STRIPE_SECRET_KEY     — Stripe secret key
 *   CLOUDINARY_CLOUD_NAME — defaults to the site cloud if unset
 */

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME ?? "duwhxzb0q";

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const downloadUrl = (publicId: string) =>
  `https://res.cloudinary.com/${CLOUD}/image/upload/fl_attachment/${publicId}`;

export const handler = async (event: {
  httpMethod: string;
  queryStringParameters: Record<string, string | undefined> | null;
}) => {
  if (event.httpMethod !== "GET") {
    return json(405, { error: "Method not allowed" });
  }

  const sessionId = event.queryStringParameters?.session_id;
  if (!sessionId) return json(400, { error: "Missing session_id." });

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return json(500, { error: "Stripe is not configured." });

  const stripe = new Stripe(secret);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product"],
    });

    if (session.payment_status !== "paid") {
      return json(200, { paid: false });
    }

    const items = (session.line_items?.data ?? []).map((line) => {
      const product = line.price?.product;
      const meta =
        product && typeof product === "object" && "metadata" in product
          ? product.metadata
          : undefined;
      const publicId = meta?.downloadPublicId;
      return {
        name: line.description ?? "Your item",
        quantity: line.quantity ?? 1,
        downloadUrl: publicId ? downloadUrl(publicId) : null,
      };
    });

    return json(200, {
      paid: true,
      email: session.customer_details?.email ?? null,
      items,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Verification failed.";
    return json(502, { error: message });
  }
};
