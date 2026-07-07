import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import { siteConfig } from "@/lib/siteConfig";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PersonJsonLd } from "@/components/json-ld";
import { Analytics } from "@/components/analytics";
import { AnalyticsTracking } from "@/components/analytics-tracking";
import { CartProvider } from "@/lib/cart";
import { defaultOgImage } from "@/lib/seo";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <CartProvider>
          <SiteHeader />
          <main id="main" className="flex-1">{children}</main>
          <SiteFooter />
        </CartProvider>
        <Analytics />
        <AnalyticsTracking />
      </body>
    </html>
  );
}
