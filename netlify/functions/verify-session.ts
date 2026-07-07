import { createHash } from "node:crypto";
import Stripe from "stripe";

/**
 * Verifies a completed Checkout Session and returns the digital download links
 * (SPEC §5). Entitlement is the paid session itself — no accounts, no DB.
 *
 * The download file for each item is read from the Stripe Product metadata key
 * `downloadPublicId` (the Cloudinary publicId). The owner sets it when creating
 * the product in Stripe.
 *
 * Delivery: a signed Cloudinary download URL that expires after 24 hours
 * (revisiting the success page re-verifies the session and mints a fresh one).
 * Without API credentials it falls back to the public fl_attachment URL so
 * delivery keeps working — but that URL never expires; set the env vars.
 *
 * Env:
 *   STRIPE_SECRET_KEY       — Stripe secret key
 *   CLOUDINARY_CLOUD_NAME   — defaults to the site cloud if unset
 *   CLOUDINARY_API_KEY      — enables signed, expiring download links
 *   CLOUDINARY_API_SECRET   — (never the pair that leaked — rotate first)
 */

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME ?? "duwhxzb0q";
const DOWNLOAD_TTL_SECONDS = 60 * 60 * 24;

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

/**
 * Signed download link via Cloudinary's download endpoint: params are
 * SHA-1-signed with the API secret, and `expires_at` makes the link lapse —
 * unlike a res.cloudinary.com URL, it can't circulate forever.
 */
function signedDownloadUrl(publicId: string): string | null {
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiKey || !apiSecret) return null;

  const params: Record<string, string> = {
    attachment: "true",
    expires_at: String(Math.floor(Date.now() / 1000) + DOWNLOAD_TTL_SECONDS),
    public_id: publicId,
    timestamp: String(Math.floor(Date.now() / 1000)),
  };
  // Cloudinary API signature: alphabetized key=value pairs + the API secret.
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const signature = createHash("sha1").update(toSign + apiSecret).digest("hex");

  const query = new URLSearchParams({
    ...params,
    api_key: apiKey,
    signature,
  });
  return `https://api.cloudinary.com/v1_1/${CLOUD}/image/download?${query}`;
}

const downloadUrl = (publicId: string) =>
  signedDownloadUrl(publicId) ??
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
    // Log the real error; a raw Stripe message here leaks internals and acts
    // as a session-id oracle ("No such checkout.session: …").
    console.error("verify-session:", err);
    return json(502, { error: "Could not verify this order." });
  }
};
