"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/lib/nav";
import { track } from "@/lib/analytics";
import { EVENTS } from "@/lib/analytics-events";

export function NavSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) track(EVENTS.mobileMenuOpen);
      }}
    >
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-paper">
        <SheetHeader>
          <SheetTitle className="font-display font-semibold">Menu</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" data-ga-nav="mobile_menu" className="px-4">
          <ul className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
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
