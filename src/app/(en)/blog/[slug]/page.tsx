import type { Metadata } from "next";
import { PostPage, postMetadata } from "@/components/pages/post";
import { getAllGuides } from "@/lib/guides";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllGuides("en").map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return postMetadata("en", slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <PostPage locale="en" slug={slug} />;
}
