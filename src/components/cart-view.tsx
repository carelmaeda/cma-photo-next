"use client";

import { useState } from "react";
import Link from "next/link";
import { MinusIcon, PlusIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CldImage } from "@/components/cld-image";
import { useCart, formatMoney } from "@/lib/cart";
import { startCheckout } from "@/lib/checkout";

export function CartView() {
  const { lines, subtotal, setQuantity, remove } = useCart();
  const [busy, setBusy] = useState(false);

  if (lines.length === 0) {
    return (
      <p className="max-w-prose text-ink-soft">
        Your cart is empty. Browse the{" "}
        <Link href="/downloads" className="underline hover:text-indigo">
          recipes
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_20rem]">
      <ul>
        {lines.map((line) => (
          <li
            key={line.slug}
            className="flex gap-4 border-t border-line py-6 first:border-t-0"
          >
            <CldImage
              photo={line.image}
              width={96}
              height={120}
              crop="fill"
              gravity="auto"
              className="h-30 w-24 shrink-0 border border-line object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{line.name}</p>
              <p className="mt-0.5 font-mono text-cap text-warm">
                {formatMoney(line.price, line.currency)}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity(line.slug, line.quantity - 1)}
                  className="size-7 rounded-none border-line-2 hover:border-indigo hover:bg-transparent"
                >
                  <MinusIcon className="size-3.5" />
                </Button>
                <span className="w-8 text-center font-mono text-cap">
                  {line.quantity}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity(line.slug, line.quantity + 1)}
                  className="size-7 rounded-none border-line-2 hover:border-indigo hover:bg-transparent"
                >
                  <PlusIcon className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label="Remove item"
                  onClick={() => remove(line.slug)}
                  className="ml-4 h-auto gap-1 rounded-none px-0 font-mono text-micro font-normal tracking-eyebrow uppercase text-warm hover:bg-transparent hover:text-brick"
                >
                  <XIcon className="size-3.5" /> Remove
                </Button>
              </div>
            </div>
            <p className="shrink-0 font-semibold">
              {formatMoney(line.price * line.quantity, line.currency)}
            </p>
          </li>
        ))}
      </ul>

      <aside className="h-fit border-t border-line pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
        <div className="flex items-center justify-between">
          <span className="font-mono text-micro tracking-eyebrow uppercase text-warm">
            Subtotal
          </span>
          <span className="text-lg font-semibold">{formatMoney(subtotal)}</span>
        </div>
        <p className="mt-2 text-sm text-ink-soft">
          Taxes are calculated at checkout. Everything here is a digital
          download.
        </p>
        <Button
         variant="default"
          type="button"
          size="lg"
          className="mt-6 w-full"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await startCheckout(
                lines.map((l) => ({
                  stripePriceId: l.stripePriceId,
                  quantity: l.quantity,
                }))
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Redirecting…" : "Checkout"}
        </Button>
        <p className="mt-3 text-center font-mono text-micro text-warm">
          Secure checkout by Stripe
        </p>
      </aside>
    </div>
  );
}
