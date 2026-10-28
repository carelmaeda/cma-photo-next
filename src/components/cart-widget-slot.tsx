"use client";

import dynamic from "next/dynamic";
import { siteConfig } from "@/lib/siteConfig";

/**
 * Client-side gate for the cart icon. It has to be a client component with
 * ssr:false: a next/dynamic in a Server Component registers the widget's
 * chunks (sheet, cart context, radix Dialog) with every route even when the
 * widget never renders, which is exactly what parking the store should avoid.
 * Here the import() only runs if the store is on.
 */
const CartWidget = dynamic(
  () => import("./cart-widget").then((mod) => mod.CartWidget),
  { ssr: false }
);

export function CartWidgetSlot() {
  if (!siteConfig.features.store) return null;
  return <CartWidget />;
}
