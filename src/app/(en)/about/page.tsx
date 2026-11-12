import type { Metadata } from "next";
import { AboutPage, aboutMetadata } from "@/components/pages/about";

export const metadata: Metadata = aboutMetadata("en");

export default function Page() {
  return <AboutPage locale="en" />;
}
