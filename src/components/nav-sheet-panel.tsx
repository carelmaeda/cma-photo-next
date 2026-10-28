"use client";

import type { RefObject } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { navLinks } from "@/lib/nav";

interface NavSheetPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The trigger button; focus goes back there on close, as a radix Trigger would do. */
  returnFocusTo: RefObject<HTMLButtonElement | null>;
}

/**
 * The mobile menu panel. Loaded lazily by <NavSheet>, which owns the trigger
 * button and the open state; this file is what pulls radix Dialog into the
 * bundle, so nothing else in the header may import it.
 */
export function NavSheetPanel({
  open,
  onOpenChange,
  returnFocusTo,
}: NavSheetPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="bg-paper"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocusTo.current?.focus();
        }}
      >
        <SheetHeader>
          <SheetTitle className="font-display font-semibold">Menu</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" data-ga-nav="mobile_menu" className="px-4">
          <ul className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => onOpenChange(false)}
                  className="text-cap font-mono tracking-frame uppercase hover:text-indigo"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
