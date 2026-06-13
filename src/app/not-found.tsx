import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-gutter">
      <div className="mx-auto max-w-7xl py-24">
        <p className="text-cap font-mono tracking-frame text-ink-muted uppercase">
          FR-404 · Not found
        </p>
        <h1 className="text-h2 mt-6">This frame doesn&apos;t exist.</h1>
        <p className="mt-4 max-w-prose text-ink-muted">
          The page you&apos;re after isn&apos;t here. The photographs are,
          though.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-cap font-mono tracking-frame uppercase hover:text-indigo"
        >
          ← Back to the start
        </Link>
      </div>
    </div>
  );
}
