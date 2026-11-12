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
  /** aria-label of the control ("Language" / "Idioma"). */
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
 * Header language menu (SPEC §2): a mono "EN ⌄" trigger that opens a small
 * paper card listing both languages, the current one marked in indigo. Each
 * entry links to the same page in that language, or to that language's home
 * when the page has no twin (gallery, /links, the parked store).
 *
 * Hand-rolled on purpose: the header is on every page's critical path and
 * the mobile sheet already keeps radix Dialog out of it; a two-item menu
 * does not justify pulling radix DropdownMenu in. Reads the pathname on the
 * client side of the tree, which is why the header in the root layout can
 * still know the page. Imports only locale-path, never the dictionaries.
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
    const current = locales.indexOf(locale);
    itemRefs.current[current]?.focus();
  }, [open, locale]);

  function onMenuKeyDown(event: React.KeyboardEvent) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const items = itemRefs.current.filter(Boolean) as HTMLElement[];
    const index = items.indexOf(document.activeElement as HTMLElement);
    const step = event.key === "ArrowDown" ? 1 : -1;
    items[(index + step + items.length) % items.length]?.focus();
  }

  // Spacing scale (globals.css): 2 = 8px, 5 = 24px, 6 = 32px. Rows are 32px tall.
  const row =
    "flex h-6 items-center justify-between gap-5 rounded-sm px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

  return (
    <div ref={rootRef} className={`relative ${className ?? ""}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={labels.language}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-7 items-center gap-1 rounded-md px-2 font-mono text-micro tracking-eyebrow uppercase text-ink-soft transition-colors hover:text-indigo focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper focus-visible:outline-none aria-expanded:text-ink"
      >
        {labels.codes[locale]}
        <svg
          viewBox="0 0 12 12"
          className={`size-3 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 4.5l3 3 3-3" />
        </svg>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={labels.language}
          onKeyDown={onMenuKeyDown}
          className="absolute top-full right-0 z-50 mt-1 min-w-[10.5rem] origin-top-right rounded-md border border-line bg-paper p-1 shadow-pop animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150"
        >
          {locales.map((entry, i) => {
            const current = entry === locale;
            const code = (
              <span className="font-mono text-micro tracking-eyebrow uppercase text-ink-soft">
                {labels.codes[entry]}
              </span>
            );
            const name = (
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`size-[6px] rounded-full ${current ? "bg-indigo" : "bg-transparent"}`}
                />
                {labels.names[entry]}
              </span>
            );
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
                className={`${row} text-ink`}
              >
                {name}
                {code}
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
                {name}
                {code}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
