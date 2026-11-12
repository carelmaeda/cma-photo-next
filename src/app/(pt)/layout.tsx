import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { rootMetadata } from "@/lib/seo";
import "@/app/globals.css";

/**
 * Brazilian Portuguese root layout (SPEC §5 Languages). Everything under
 * /pt-br renders inside this <html lang="pt-BR">; crossing to the English
 * tree is a full page load, which is what a language switch should be.
 */
export const metadata: Metadata = rootMetadata("pt-br");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SiteShell locale="pt-br">{children}</SiteShell>;
}
