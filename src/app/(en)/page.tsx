import type { Metadata } from "next";
import { HomePage, homeMetadata } from "@/components/pages/home";

export const metadata: Metadata = homeMetadata("en");

export default function Page() {
  return <HomePage locale="en" />;
}
