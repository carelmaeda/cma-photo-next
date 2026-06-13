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
 * `compact` renders just the "Add to cart" button — used on grid cards.
 */
export function AddToCart({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [busy, setBusy] = useState(false);

  if (product.free || !product.price || !product.stripePriceId) return null;

  const addButton = (
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
  );

  if (compact) return addButton;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {addButton}

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
