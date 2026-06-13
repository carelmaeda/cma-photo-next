"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBagIcon, MinusIcon, PlusIcon, XIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CldImage } from "@/components/cld-image";
import { useCart, formatMoney } from "@/lib/cart";
import { startCheckout } from "@/lib/checkout";

export function CartWidget() {
  const { lines, count, subtotal, setQuantity, remove } = useCart();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
          className="relative inline-flex size-9 items-center justify-center text-ink transition-colors hover:text-indigo"
        >
          <ShoppingBagIcon className="size-5" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex min-w-4 items-center justify-center rounded-full bg-brick px-1 font-mono text-[10px] leading-4 text-paper">
              {count}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent className="bg-paper">
        <SheetHeader>
          <SheetTitle className="font-mono text-micro tracking-eyebrow uppercase text-warm">
            Cart
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <p className="px-4 text-sm text-ink-muted">
            Your cart is empty. Browse{" "}
            <Link
              href="/downloads"
              className="underline hover:text-indigo"
              onClick={() => setOpen(false)}
            >
              recipes
            </Link>{" "}
            and{" "}
            <Link
              href="/prints"
              className="underline hover:text-indigo"
              onClick={() => setOpen(false)}
            >
              prints
            </Link>
            .
          </p>
        ) : (
          <ul className="flex-1 overflow-y-auto px-4">
            {lines.map((line) => (
              <li
                key={line.slug}
                className="flex gap-3 border-b border-line py-4"
              >
                <CldImage
                  photo={line.image}
                  width={64}
                  height={80}
                  crop="fill"
                  gravity="auto"
                  className="h-20 w-16 shrink-0 border border-line object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{line.name}</p>
                  <p className="mt-0.5 font-mono text-cap text-warm">
                    {formatMoney(line.price, line.currency)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity(line.slug, line.quantity - 1)}
                      className="inline-flex size-6 items-center justify-center border border-line-2 hover:border-indigo"
                    >
                      <MinusIcon className="size-3" />
                    </button>
                    <span className="w-6 text-center font-mono text-cap">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity(line.slug, line.quantity + 1)}
                      className="inline-flex size-6 items-center justify-center border border-line-2 hover:border-indigo"
                    >
                      <PlusIcon className="size-3" />
                    </button>
                    <button
                      type="button"
                      aria-label="Remove"
                      onClick={() => remove(line.slug)}
                      className="ml-auto inline-flex size-6 items-center justify-center text-warm hover:text-brick"
                    >
                      <XIcon className="size-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {lines.length > 0 && (
          <SheetFooter>
            <div className="flex items-center justify-between border-t border-line pt-4 text-sm">
              <span className="font-mono text-micro tracking-eyebrow uppercase text-warm">
                Subtotal
              </span>
              <span className="font-semibold">{formatMoney(subtotal)}</span>
            </div>
            <Button
              type="button"
              size="lg"
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
            <p className="text-center font-mono text-micro text-warm">
              Secure checkout by Stripe · digital download
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
