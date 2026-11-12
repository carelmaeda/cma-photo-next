import type { Metadata } from "next";
import { AboutPage, aboutMetadata } from "@/components/pages/about";

export const metadata: Metadata = aboutMetadata("pt-br");

export default function Page() {
  return <AboutPage locale="pt-br" />;
}
