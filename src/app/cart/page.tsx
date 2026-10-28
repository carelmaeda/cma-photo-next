import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CartView } from "@/components/cart-view";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  // Store parked (SPEC §10): no CartProvider is mounted, so this page can't
  // render. Same destination as the /downloads redirects.
  if (!siteConfig.features.store) redirect("/recipes");

  return (
    <div className="px-gutter">
      <header className="mx-auto max-w-7xl pt-3 pb-4 md:pt-4 md:pb-5">
        <h1 className="text-h3">Cart</h1>
      </header>
      <section className="mx-auto max-w-7xl pb-8">
        <CartView />
      </section>
    </div>
  );
}
