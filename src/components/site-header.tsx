import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/lib/nav";
import { getAllGuides } from "@/lib/guides";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/siteConfig";
import { NavSheet } from "./nav-sheet";
import { CartWidgetSlot } from "./cart-widget-slot";
import { InstagramIcon, InstagramLink } from "./instagram-link";
import { LanguageMenu } from "./language-menu";

export function SiteHeader({ locale }: { locale: Locale }) {
  const { nav } = getDictionary(locale);
  const links = navLinks(locale);
  const ptPostSlugs = getAllGuides("pt-br").map((guide) => guide.slug);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/90 backdrop-blur-sm px-gutter">
      <div className="mx-auto flex h-header max-w-7xl items-center justify-between">
        <Link
          href={localePath(locale, "/")}
          aria-label={nav.logoHome}
          data-ga-nav="logo"
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

        {/* Controls are 48px tap targets (size-7 on this spacing scale) with
            no gap; -mr-3 pulls the last glyph's edge onto the gutter line so
            it aligns with the photo grid below. */}
        <div className="-mr-3 flex items-center">
          <nav aria-label={nav.main} data-ga-nav="header" className="mr-4 hidden md:block">
            <ul className="flex items-center gap-7">
              {links.map((link) => (
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

          <LanguageMenu
            locale={locale}
            labels={{ language: nav.language, codes: nav.codes, names: nav.names }}
            ptPostSlugs={ptPostSlugs}
            className="mr-1"
          />
          <InstagramLink
            identity
            aria-label="Instagram"
            className="inline-flex size-7 items-center justify-center rounded-md text-ink transition-colors hover:text-indigo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
          >
            <InstagramIcon className="size-5 stroke-[1.75]" />
          </InstagramLink>
          <CartWidgetSlot />
          <NavSheet
            links={links}
            labels={{ openMenu: nav.openMenu, menu: nav.menu, mobile: nav.mobile }}
          />
        </div>
      </div>
    </header>
  );
}
