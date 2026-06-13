"use client";

import { useState } from "react";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { startCheckout } from "@/lib/checkout";
import type { Product } from "@/lib/types";

/**
 * Paid-product actions: add to cart, or buy now (single-item Stripe checkout).
 * Free products never render this — they use the goodwill gate.
 */
export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [busy, setBusy] = useState(false);

  if (product.free || !product.price || !product.stripePriceId) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        type="button"
        onClick={() => {
          add(product);
          setAdded(true);
          window.setTimeout(() => setAdded(false), 1600);
        }}
      >
        {added ? (
          <>
            <CheckIcon /> Added
          </>
        ) : (
          "Add to cart"
        )}
      </Button>

      <Button
        type="button"
        variant="outline"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await startCheckout([
              { stripePriceId: product.stripePriceId!, quantity: 1 },
            ]);
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Redirecting…" : "Buy now"}
      </Button>
    </div>
  );
}
