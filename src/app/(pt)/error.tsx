"use client";

import { Button } from "@/components/ui/button";

/**
 * Error boundary for the Portuguese tree, the on-brand fallback for any
 * uncaught render error. Must be a client component (Next.js requirement for
 * error.tsx), so the strings live here rather than in the dictionary.
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
          FR-500 · Algo quebrou
        </p>
        <h1 className="text-h2 mt-6">Esse frame não revelou.</h1>
        <p className="mt-4 max-w-prose text-ink-soft">
          Alguma coisa deu errado do meu lado, não do seu.
        </p>
        <div className="mt-8">
          <Button type="button" variant="outline" onClick={reset} className="w-full sm:w-auto">
            Tentar de novo
          </Button>
        </div>
      </div>
    </div>
  );
}
