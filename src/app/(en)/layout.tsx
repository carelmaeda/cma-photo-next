import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { rootMetadata } from "@/lib/seo";
import "@/app/globals.css";

/** English root layout: the root URLs, unchanged (SPEC §5 Languages). */
export const metadata: Metadata = rootMetadata("en");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SiteShell locale="en">{children}</SiteShell>;
}
