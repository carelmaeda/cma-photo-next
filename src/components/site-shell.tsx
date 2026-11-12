import { siteConfig } from "@/lib/siteConfig";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PersonJsonLd, WebSiteJsonLd } from "@/components/json-ld";
import { Analytics } from "@/components/analytics";
import { AnalyticsTracking } from "@/components/analytics-tracking";
import { jakarta, spaceMono } from "@/lib/fonts";
import { getDictionary, htmlLang, type Locale } from "@/lib/i18n";

/**
 * The document shell both root layouts render (SPEC §5 Languages): one
 * <html> per language, same header, footer, fonts, analytics and site-wide
 * JSON-LD. Only `lang` and the strings differ.
 */
export async function SiteShell({
  locale,
  children,
}: Readonly<{ locale: Locale; children: React.ReactNode }>) {
  const dict = getDictionary(locale);

  // Store on: the cart context wraps the tree. Store off (SPEC §10): the
  // module is never imported, so none of it (context, two localStorage
  // effects) reaches the client. A static import or next/dynamic here would
  // ship it to every page regardless, because the flag is a runtime value
  // the bundler can't fold away.
  const CartProvider = siteConfig.features.store
    ? (await import("@/lib/cart")).CartProvider
    : null;

  const content = (
    <>
      <SiteHeader locale={locale} />
      <main id="main" className="flex-1">{children}</main>
      <SiteFooter locale={locale} />
    </>
  );

  return (
    // suppressHydrationWarning: browser extensions (Grammarly, Scribe…) inject
    // attributes into <html>/<body> before React hydrates — harmless, but noisy.
    // Only suppresses attribute mismatches on these two elements.
    <html
      lang={htmlLang[locale]}
      className={`${jakarta.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      {/* eslint-disable-next-line @next/next/no-head-element -- this is the
          document shell both root layouts render; the rule only exempts files
          that live under app/ */}
      <head>
        {/* Every photo loads from Cloudinary — open the connection early so the
            LCP hero image isn't delayed by DNS + TLS negotiation. */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className="flex min-h-svh flex-col" suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-paper focus:px-4 focus:py-2 focus:text-cap focus:font-mono focus:tracking-frame focus:text-ink focus:uppercase focus:outline-2 focus:outline-indigo"
        >
          {dict.skipToContent}
        </a>
        <PersonJsonLd locale={locale} />
        <WebSiteJsonLd locale={locale} />
        {/* /cart and /checkout/success redirect to /recipes while the store
            is parked, so no page can call useCart() without a provider. */}
        {CartProvider ? <CartProvider>{content}</CartProvider> : content}
        <Analytics />
        <AnalyticsTracking />
      </body>
    </html>
  );
}
