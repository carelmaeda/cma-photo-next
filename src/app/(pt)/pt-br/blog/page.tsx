import type { Metadata } from "next";
import { BlogPage, blogMetadata } from "@/components/pages/blog";

export const metadata: Metadata = blogMetadata("pt-br");

export default function Page() {
  return <BlogPage locale="pt-br" />;
}
