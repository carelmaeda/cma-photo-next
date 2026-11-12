import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";

export function notFoundMetadata(locale: Locale): Metadata {
  return { title: getDictionary(locale).notFound.title };
}

/** The in-tree 404 (notFound() from a page), in that tree's language. */
export function NotFoundView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).notFound;

  return (
    <div className="px-gutter">
      <div className="mx-auto max-w-7xl py-24">
        <p className="text-cap font-mono tracking-frame text-ink-soft uppercase">
          {t.eyebrow}
        </p>
        <h1 className="text-h2 mt-6">{t.heading}</h1>
        <p className="mt-4 max-w-prose text-ink-soft">{t.body}</p>
        <Link
          href={localePath(locale, "/")}
          className="mt-8 inline-block text-cap font-mono tracking-frame uppercase hover:text-indigo"
        >
          {t.back}
        </Link>
      </div>
    </div>
  );
}
