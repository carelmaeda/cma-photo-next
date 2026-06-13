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
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount (client-only — keeps SSR markup stable).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
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
      const existing = prev.find((l) => l.slug === product.slug);
      if (existing) {
        return prev.map((l) =>
          l.slug === product.slug ? { ...l, quantity: l.quantity + 1 } : l
        );
      }
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

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.slug !== slug)
        : prev.map((l) => (l.slug === slug ? { ...l, quantity } : l))
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotal = lines.reduce((n, l) => n + l.price * l.quantity, 0);
    return { lines, count, subtotal, add, remove, setQuantity, clear };
  }, [lines, add, remove, setQuantity, clear]);

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
