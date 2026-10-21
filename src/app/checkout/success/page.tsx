import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutSuccess } from "@/components/checkout-success";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <div className="px-gutter">
      <header className="mx-auto max-w-7xl pt-3 pb-4 md:pt-4 md:pb-5">
        <h1 className="text-h3">Order confirmed</h1>
      </header>
      <section className="mx-auto max-w-7xl pb-8">
        <Suspense
          fallback={<p className="text-ink-soft">Confirming your order…</p>}
        >
          <CheckoutSuccess />
        </Suspense>
      </section>
    </div>
  );
}
