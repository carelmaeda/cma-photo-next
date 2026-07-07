"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartLine, Product } from "@/lib/types";
import { siteConfig } from "@/lib/siteConfig";

const STORAGE_KEY = "carel-cart-v1";

interface CartContextValue {
  lines: CartLine[];
  count: number;
  /** Subtotal in the smallest currency unit. */
  subtotal: number;
  add: (product: Product) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Guard against corrupt/hand-edited storage: CartProvider wraps every page,
 * so a malformed entry must never reach state (lines.reduce would throw in
 * render and take the whole site down).
 */
function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const line = value as Partial<CartLine>;
  return (
    typeof line.slug === "string" &&
    typeof line.name === "string" &&
    typeof line.price === "number" &&
    typeof line.stripePriceId === "string" &&
    typeof line.quantity === "number" &&
    Number.isFinite(line.quantity) &&
    typeof line.image === "object" &&
    line.image !== null &&
    typeof (line.image as { publicId?: unknown }).publicId === "string" &&
    typeof (line.image as { alt?: unknown }).alt === "string"
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount (client-only — keeps SSR markup stable).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setLines(parsed.filter(isCartLine));
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignore quota / privacy-mode errors
    }
  }, [lines, hydrated]);

  const add = useCallback((product: Product) => {
    // Only paid, configured products are addable.
    if (product.free || !product.price || !product.stripePriceId) return;
    setLines((prev) => {
      // Digital downloads: one copy per product. Adding again is a no-op —
      // paying twice for the same file helps nobody.
      if (prev.some((l) => l.slug === product.slug)) return prev;
      const line: CartLine = {
        slug: product.slug,
        kind: product.kind,
        name: product.name,
        price: product.price!,
        currency: product.currency ?? siteConfig.stripe.currency,
        stripePriceId: product.stripePriceId!,
        image: product.image,
        quantity: 1,
      };
      return [...prev, line];
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.length;
    const subtotal = lines.reduce((n, l) => n + l.price, 0);
    return { lines, count, subtotal, add, remove, clear };
  }, [lines, add, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}

/** Format a smallest-unit amount as currency, e.g. 500 → "$5.00". */
export function formatMoney(amount: number, currency?: string): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: (currency ?? siteConfig.stripe.currency).toUpperCase(),
  }).format(amount / 100);
}
