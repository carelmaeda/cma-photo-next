import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/lib/nav";
import { siteConfig } from "@/lib/siteConfig";
import { NavSheet } from "./nav-sheet";
import { CartWidget } from "./cart-widget";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-paper/90 px-gutter">
      <div className="mx-auto flex h-header max-w-7xl items-center justify-between">
        <Link
          href="/"
          aria-label={`${siteConfig.name} — home`}
          className="text-ink transition-opacity hover:opacity-70"
        >
          <Image
            src="/carel-logo-ink.svg"
            alt={siteConfig.name}
            width={92}
            height={52}
            priority
            className="h-[calc(var(--spacing-header)*0.56)] w-auto"
          />
        </Link>

        <div className="flex items-center gap-5">
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-mono text-micro tracking-eyebrow uppercase text-ink-soft transition-colors hover:text-indigo"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <CartWidget />
          <NavSheet />
        </div>
      </div>
    </header>
  );
}
