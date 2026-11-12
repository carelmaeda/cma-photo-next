"use client";

import { Button } from "@/components/ui/button";

/**
 * Root error boundary — the on-brand fallback for any uncaught render error.
 * Must be a client component (Next.js requirement for error.tsx).
 */
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="px-gutter">
      <div className="mx-auto max-w-7xl py-24">
        <p className="text-cap font-mono tracking-frame text-ink-soft uppercase">
          FR-500 · Something broke
        </p>
        <h1 className="text-h2 mt-6">That frame didn&apos;t develop.</h1>
        <p className="mt-4 max-w-prose text-ink-soft">
          Something went wrong on my end — not yours. If you were in the middle
          of a checkout, nothing was charged.
        </p>
        <div className="mt-8">
          <Button type="button" variant="outline" onClick={reset}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
