"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  counterpartPath,
  htmlLang,
  localePath,
  locales,
  type Locale,
} from "@/lib/locale-path";

export interface LanguageToggleLabels {
  /** aria-label of the control ("Language" / "Idioma"). */
  language: string;
  en: string;
  pt: string;
}

interface LanguageToggleProps {
  locale: Locale;
  labels: LanguageToggleLabels;
  /** Slugs with a Portuguese post file, so a post without a twin lands on the blog hub. */
  ptPostSlugs: string[];
  className?: string;
}

/**
 * Header language toggle (SPEC §2): EN · PT, the current one inert, the
 * other a link to the same page in that language. Pages without a twin
 * (gallery, /links, the parked store) send the visitor to the other
 * language's home instead. Reads the pathname on the client side of the
 * tree, which is why the header in the root layout can still know the page.
 * Imports only locale-path, never the dictionaries, so nothing heavy ships.
 */
export function LanguageToggle({
  locale,
  labels,
  ptPostSlugs,
  className,
}: LanguageToggleProps) {
  const pathname = usePathname();
  const twin = counterpartPath(pathname, ptPostSlugs);
  const label: Record<Locale, string> = { en: labels.en, "pt-br": labels.pt };
  const item = "inline-flex h-7 items-center px-2";

  return (
    <nav aria-label={labels.language} className={className}>
      <ul className="flex items-center font-mono text-micro tracking-eyebrow uppercase">
        {locales.map((entry, i) => (
          <li key={entry} className="flex items-center">
            {i > 0 && (
              <span aria-hidden="true" className="text-ink-soft">
                ·
              </span>
            )}
            {entry === locale ? (
              <span aria-current="true" className={`${item} text-ink`}>
                {label[entry]}
              </span>
            ) : (
              <Link
                href={twin ?? localePath(entry, "/")}
                hrefLang={htmlLang[entry]}
                lang={htmlLang[entry]}
                className={`${item} text-ink-soft transition-colors hover:text-indigo`}
              >
                {label[entry]}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
