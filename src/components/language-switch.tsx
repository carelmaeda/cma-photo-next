"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  counterpartPath,
  htmlLang,
  otherLocale,
  type Locale,
} from "@/lib/locale-path";

interface LanguageSwitchProps {
  locale: Locale;
  /** Name of the other language, in that language ("Português (BR)" / "English"). */
  label: string;
  /** Slugs with a Portuguese post file, so a post without a twin links to the blog hub instead. */
  ptPostSlugs: string[];
}

/**
 * The footer's link to the same page in the other language (SPEC §2). Reads
 * the pathname on the client side of the tree so the footer in the root
 * layout, which has no page context, still points at the right twin. Renders
 * nothing on pages that have no twin (gallery, /links, the parked store).
 * Imports only locale-path, never the dictionaries, so nothing heavy ships.
 */
export function LanguageSwitch({ locale, label, ptPostSlugs }: LanguageSwitchProps) {
  const pathname = usePathname();
  const href = counterpartPath(pathname, ptPostSlugs);
  if (!href) return null;

  const target = htmlLang[otherLocale(locale)];
  return (
    <>
      <Link href={href} hrefLang={target} lang={target} className="hover:text-indigo">
        {label}
      </Link>
      <span aria-hidden="true">·</span>
    </>
  );
}
