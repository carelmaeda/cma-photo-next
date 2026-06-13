"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DownloadIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { siteConfig } from "@/lib/siteConfig";
import { useCart } from "@/lib/cart";

interface VerifiedItem {
  name: string;
  quantity: number;
  downloadUrl: string | null;
}

type State =
  | { status: "loading" }
  | { status: "unpaid" }
  | { status: "error"; message: string }
  | { status: "paid"; email: string | null; items: VerifiedItem[] };

export function CheckoutSuccess() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const { clear } = useCart();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (!sessionId) {
      setState({ status: "error", message: "No checkout session was found." });
      return;
    }
    let active = true;
    (async () => {
      try {
        const res = await fetch(
          `${siteConfig.stripe.verifySession}?session_id=${encodeURIComponent(sessionId)}`
        );
        const data = await res.json();
        if (!active) return;
        if (!res.ok) {
          setState({ status: "error", message: data.error ?? "Could not verify your order." });
          return;
        }
        if (!data.paid) {
          setState({ status: "unpaid" });
          return;
        }
        clear();
        setState({ status: "paid", email: data.email ?? null, items: data.items ?? [] });
      } catch {
        if (active) setState({ status: "error", message: "Could not reach the server." });
      }
    })();
    return () => {
      active = false;
    };
    // clear is stable; intentionally run once per session id
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (state.status === "loading") {
    return <p className="text-ink-muted">Confirming your order…</p>;
  }

  if (state.status === "error") {
    return (
      <div>
        <p className="text-ink-muted">{state.message}</p>
        <p className="mt-4 text-sm text-ink-muted">
          If you were charged, email{" "}
          <a href={siteConfig.instagram} className="underline hover:text-indigo">
            me
          </a>{" "}
          and I&apos;ll sort it out.
        </p>
      </div>
    );
  }

  if (state.status === "unpaid") {
    return (
      <p className="text-ink-muted">
        This order isn&apos;t marked paid yet. If you just completed checkout,
        give it a moment and refresh — or{" "}
        <Link href="/cart" className="underline hover:text-indigo">
          return to your cart
        </Link>
        .
      </p>
    );
  }

  return (
    <div>
      <p className="max-w-prose text-ink-muted">
        Thank you — your payment went through
        {state.email ? `, and a receipt is on its way to ${state.email}` : ""}.
        Your downloads are below.
      </p>

      <ul className="mt-8 space-y-3">
        {state.items.map((item, i) => (
          <li key={i} className="border-t border-line pt-3">
            {item.downloadUrl ? (
              <a
                href={item.downloadUrl}
                className="inline-flex items-center gap-2 font-mono text-cap tracking-frame uppercase text-indigo hover:underline"
              >
                <DownloadIcon className="size-4" />
                {item.name}
              </a>
            ) : (
              <span className="text-sm text-ink-muted">
                {item.name} — I&apos;ll email your file shortly.
              </span>
            )}
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-ink-muted">
        Browse more in the{" "}
        <Link href="/downloads" className="underline hover:text-indigo">
          recipes
        </Link>{" "}
        and{" "}
        <Link href="/prints" className="underline hover:text-indigo">
          shop
        </Link>
        .
      </p>
    </div>
  );
}
