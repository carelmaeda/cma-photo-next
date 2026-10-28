import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import { siteConfig } from "@/lib/siteConfig";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PersonJsonLd, WebSiteJsonLd } from "@/components/json-ld";
import { Analytics } from "@/components/analytics";
import { AnalyticsTracking } from "@/components/analytics-tracking";
import { defaultOgImage, siteKeywords } from "@/lib/seo";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteKeywords,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/app-icon-180.png",
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    images: [{ url: defaultOgImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [defaultOgImage],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Store on: the cart context wraps the tree. Store off (SPEC §10): the
  // module is never imported, so none of it (context, two localStorage
  // effects) reaches the client. A static import or next/dynamic here would
  // ship it to every page regardless, because the flag is a runtime value
  // the bundler can't fold away.
  const CartProvider = siteConfig.features.store
    ? (await import("@/lib/cart")).CartProvider
    : null;

  return (
    // suppressHydrationWarning: browser extensions (Grammarly, Scribe…) inject
    // attributes into <html>/<body> before React hydrates — harmless, but noisy.
    // Only suppresses attribute mismatches on these two elements.
    <html
      lang="en"
      className={`${jakarta.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
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
          Skip to content
        </a>
        <PersonJsonLd />
        <WebSiteJsonLd />
        {/* /cart and /checkout/success redirect to /recipes while the store
            is parked, so no page can call useCart() without a provider. */}
        {CartProvider ? (
          <CartProvider>
            <SiteHeader />
            <main id="main" className="flex-1">{children}</main>
            <SiteFooter />
          </CartProvider>
        ) : (
          <>
            <SiteHeader />
            <main id="main" className="flex-1">{children}</main>
            <SiteFooter />
          </>
        )}
        <Analytics />
        <AnalyticsTracking />
      </body>
    </html>
  );
}
