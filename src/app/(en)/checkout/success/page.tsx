import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { CheckoutSuccess } from "@/components/checkout-success";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  // Store parked (SPEC §10): no CartProvider is mounted, so this page can't
  // render. Nothing can have been bought while the store is off.
  if (!siteConfig.features.store) redirect("/recipes");

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
