import type { Metadata } from "next";
import { HomePage, homeMetadata } from "@/components/pages/home";

export const metadata: Metadata = homeMetadata("pt-br");

export default function Page() {
  return <HomePage locale="pt-br" />;
}
