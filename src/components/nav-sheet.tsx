"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { track } from "@/lib/analytics";
import { EVENTS } from "@/lib/analytics-events";

/**
 * The panel (radix Dialog: portal, focus trap, scroll lock, dismiss layer) is
 * the heaviest client code in the header and nobody needs it before the first
 * tap, so it lives in its own chunk and loads on demand. Hover, focus or
 * touchstart on the button warms the chunk, so by the time the click lands
 * it's usually already here.
 *
 * The trigger is a plain <button> with an inline glyph on purpose: if it used
 * the shared Button (cva, tailwind-merge) or a lucide icon, webpack would pack
 * those shared modules into the same chunk as the Dialog internals and the
 * header would pull the whole thing in eagerly anyway.
 */
const loadPanel = () => import("./nav-sheet-panel");
const NavSheetPanel = dynamic(
  () => loadPanel().then((mod) => mod.NavSheetPanel),
  { ssr: false }
);
const warm = () => {
  void loadPanel();
};

/** lucide's "menu" geometry, drawn inline (same approach as InstagramIcon). */
function MenuGlyph() {
  return (
    <svg
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12h16" />
      <path d="M4 18h16" />
      <path d="M4 6h16" />
    </svg>
  );
}

export function NavSheet() {
  const [open, setOpen] = useState(false);
  // Stays mounted after the first open so the close animation can play.
  const [mounted, setMounted] = useState(false);
  // Without a radix Trigger inside the Sheet, the panel is told where to put
  // focus back on close (a tap doesn't focus the button on iOS Safari).
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex size-9 items-center justify-center rounded-md text-ink transition-colors hover:text-indigo focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper focus-visible:outline-none md:hidden"
        onPointerEnter={warm}
        onFocus={warm}
        onTouchStart={warm}
        onClick={() => {
          setMounted(true);
          setOpen(true);
          track(EVENTS.mobileMenuOpen);
        }}
      >
        <MenuGlyph />
      </button>
      {mounted && (
        <NavSheetPanel
          open={open}
          onOpenChange={setOpen}
          returnFocusTo={triggerRef}
        />
      )}
    </>
  );
}
