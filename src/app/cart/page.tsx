import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false, follow: false },
};

export default function CartPage() {
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
