"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBagIcon, XIcon } from "lucide-react";
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
import { track } from "@/lib/analytics";
import { EVENTS } from "@/lib/analytics-events";

export function CartWidget() {
  const { lines, count, subtotal, remove } = useCart();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) track(EVENTS.cartOpen, { item_count: count });
      }}
    >
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
          className="relative hover:bg-transparent hover:text-indigo"
        >
          <ShoppingBagIcon className="size-5" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex min-w-4 items-center justify-center rounded-full bg-brick-700 px-1 font-mono text-micro leading-4 text-paper">
              {count}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="bg-paper">
        <SheetHeader>
          <SheetTitle className="font-mono text-micro tracking-eyebrow uppercase text-warm">
            Cart
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <p className="px-4 text-sm text-ink-soft">
            Your cart is empty. Browse the{" "}
            <Link
              href="/downloads"
              className="underline hover:text-indigo"
              onClick={() => setOpen(false)}
            >
              recipes
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
                    <span className="font-mono text-micro tracking-eyebrow uppercase text-warm">
                      Digital download
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Remove"
                      onClick={() => remove(line.slug)}
                      className="ml-auto size-6 rounded-none text-warm hover:bg-transparent hover:text-brick-700"
                    >
                      <XIcon className="size-3.5" />
                    </Button>
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
            variant="default"
              type="button"
              size="lg"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setFailed(false);
                try {
                  await startCheckout(
                    lines.map((l) => ({
                      stripePriceId: l.stripePriceId,
                      quantity: l.quantity,
                    }))
                  );
                } catch {
                  setFailed(true);
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? "Redirecting…" : "Checkout"}
            </Button>
            {failed && (
              <p aria-live="polite" className="text-sm text-danger">
                Checkout didn&apos;t go through — nothing was charged. Try
                again in a minute.
              </p>
            )}
            <p className="text-center font-mono text-micro text-warm">
              Secure checkout by Stripe · digital download
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
