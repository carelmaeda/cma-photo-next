import type { Metadata } from "next";
import Link from "next/link";
import { jakarta, spaceMono } from "@/lib/fonts";
import { en } from "@/content/i18n/en";
import { ptBr } from "@/content/i18n/pt-br";
import "@/app/globals.css";

/**
 * Site-wide 404 for URLs that match neither root layout (there are two:
 * src/app/(en) and src/app/(pt), SPEC §5 Languages). Renders its own
 * document, so it carries both languages instead of guessing one. Enabled by
 * `experimental.globalNotFound` in next.config.ts. `notFound()` thrown inside
 * a tree still renders that tree's own not-found.tsx, in its language.
 */
export const metadata: Metadata = {
  title: `${en.notFound.title} — Carel Maeda`,
  robots: { index: false, follow: true },
};

const eyebrow = "text-cap font-mono tracking-frame text-ink-soft uppercase";
const back = "mt-8 inline-block text-cap font-mono tracking-frame uppercase hover:text-indigo";

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${jakarta.variable} ${spaceMono.variable}`}>
      <body className="flex min-h-svh flex-col">
        <main className="px-gutter flex-1">
          <div className="mx-auto max-w-7xl py-24">
            <p className={eyebrow}>{en.notFound.eyebrow}</p>
            <h1 className="text-h2 mt-6">{en.notFound.heading}</h1>
            <p className="mt-4 max-w-prose text-ink-soft">{en.notFound.body}</p>
            <Link href="/" className={back}>
              {en.notFound.back}
            </Link>

            <div lang="pt-BR" className="mt-16 border-t border-line pt-10">
              <p className={eyebrow}>{ptBr.notFound.eyebrow}</p>
              <p className="text-h3 mt-6">{ptBr.notFound.heading}</p>
              <p className="mt-4 max-w-prose text-ink-soft">{ptBr.notFound.body}</p>
              <Link href="/pt-br" className={back}>
                {ptBr.notFound.back}
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
