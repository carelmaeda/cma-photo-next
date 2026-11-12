import type { Metadata } from "next";
import { NotFoundView, notFoundMetadata } from "@/components/pages/not-found";

export const metadata: Metadata = notFoundMetadata("pt-br");

export default function NotFound() {
  return <NotFoundView locale="pt-br" />;
}
