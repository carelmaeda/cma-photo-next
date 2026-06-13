import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import { siteConfig } from "@/lib/siteConfig";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PersonJsonLd } from "@/components/json-ld";
import { Analytics } from "@/components/analytics";
import { CartProvider } from "@/lib/cart";
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

const ogImage = `https://res.cloudinary.com/${siteConfig.cloudinary.cloudName}/image/upload/w_1200,h_630,c_fill,g_auto,f_auto,q_auto/Europe/Netherlands/Amsterdam/DSCF5151_eintko`;

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
    images: [{ url: ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [ogImage],
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
      <body className="flex min-h-svh flex-col" suppressHydrationWarning>
        <PersonJsonLd />
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
