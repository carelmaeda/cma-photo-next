"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  counterpartPath,
  htmlLang,
  localePath,
  locales,
  type Locale,
} from "@/lib/locale-path";

export interface LanguageMenuLabels {
  /** aria-label of the control and the card's caption ("Language" / "Idioma"). */
  language: string;
  /** Short codes shown on the trigger and beside each name. */
  codes: Record<Locale, string>;
  /** Each language's name in its own language. */
  names: Record<Locale, string>;
}

interface LanguageMenuProps {
  locale: Locale;
  labels: LanguageMenuLabels;
  /** Slugs with a Portuguese post file, so a post without a twin lands on the blog hub. */
  ptPostSlugs: string[];
  className?: string;
}

/**
 * Header language menu (SPEC §2). The trigger is a mono "EN ⌄" set in a
 * hairline 4px tag, so it reads as a control with the same boxed weight as
 * the Instagram glyph beside it instead of loose text; the card hangs from the header's hairline like a tab (square
 * top corners, its top border overlapping the header rule) and lists both
 * languages on one left edge with their codes in a fixed right column. The
 * current language carries a short brick rule, the one place the spark is
 * used in the chrome. Each entry links to the same page in that language,
 * or to that language's home when the page has no twin.
 *
 * Hand-rolled on purpose: the header is on every page's critical path and
 * the mobile sheet already keeps radix Dialog out of it; a two-item menu
 * does not justify pulling radix DropdownMenu in. Reads the pathname on the
 * client side of the tree, which is why the header in the root layout can
 * still know the page. Imports only locale-path, never the dictionaries.
 *
 * Spacing scale (globals.css): 1 = 4px, 2 = 8px, 3 = 12px, 5 = 24px, 6 = 32px,
 * 7 = 48px. The tag is h-5 (24px), the same height as the 24px glyphs beside
 * it. The button has px-3 around it, so the tag sits 24px from the Instagram
 * glyph (12 + the icon's 12px inset), the same 24px as between the Instagram
 * and menu glyphs: one even rhythm on the right. The card's right-3 lines its
 * edge up with the tag's.
 */
export function LanguageMenu({ locale, labels, ptPostSlugs, className }: LanguageMenuProps) {
  const pathname = usePathname();
  const twin = counterpartPath(pathname, ptPostSlugs);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const menuId = useId();

  // Close on outside click and on Escape; Escape hands focus back to the trigger.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Opening puts focus on the current language so arrow keys start from it.
  useEffect(() => {
    if (!open) return;
    itemRefs.current[locales.indexOf(locale)]?.focus();
  }, [open, locale]);

  function onMenuKeyDown(event: React.KeyboardEvent) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const items = itemRefs.current.filter(Boolean) as HTMLElement[];
    const index = items.indexOf(document.activeElement as HTMLElement);
    const step = event.key === "ArrowDown" ? 1 : -1;
    items[(index + step + items.length) % items.length]?.focus();
  }

  const row =
    "relative flex items-center justify-between gap-5 px-3 py-2 text-sm outline-none focus-visible:bg-paper-2";
  const code = "w-5 text-right font-mono text-micro tracking-eyebrow uppercase";

  return (
    <div ref={rootRef} className={`relative flex h-header items-center ${className ?? ""}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={labels.language}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="group inline-flex h-7 items-center px-3 text-ink-soft transition-colors hover:text-indigo focus-visible:outline-none aria-expanded:text-ink"
      >
        <span className="inline-flex h-5 items-center gap-1 rounded-sm border border-line-2 pr-1 pl-2 font-mono text-micro tracking-eyebrow uppercase transition-colors group-hover:border-indigo group-focus-visible:ring-2 group-focus-visible:ring-indigo group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-paper group-aria-expanded:border-ink">
          {labels.codes[locale]}
          <svg
            viewBox="0 0 12 12"
            className={`size-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 4.5l3 3 3-3" />
          </svg>
        </span>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={labels.language}
          onKeyDown={onMenuKeyDown}
          className="absolute top-full right-3 z-50 -mt-px w-max min-w-44 origin-top-right overflow-hidden rounded-b-md border border-line bg-paper shadow-pop animate-in fade-in-0 slide-in-from-top-1 duration-200"
        >
          <p className="border-b border-line px-3 pt-2 pb-1 font-mono text-micro tracking-eyebrow uppercase text-ink-soft">
            {labels.language}
          </p>
          {locales.map((entry, i) => {
            const current = entry === locale;
            return current ? (
              <div
                key={entry}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                role="menuitem"
                aria-current="true"
                tabIndex={0}
                lang={htmlLang[entry]}
                className={`${row} font-semibold text-ink before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:bg-brick`}
              >
                <span>{labels.names[entry]}</span>
                <span className={`${code} text-brick`}>{labels.codes[entry]}</span>
              </div>
            ) : (
              <Link
                key={entry}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                role="menuitem"
                href={twin ?? localePath(entry, "/")}
                hrefLang={htmlLang[entry]}
                lang={htmlLang[entry]}
                onClick={() => setOpen(false)}
                className={`${row} text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink`}
              >
                <span>{labels.names[entry]}</span>
                <span className={`${code} text-ink-soft`}>{labels.codes[entry]}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
