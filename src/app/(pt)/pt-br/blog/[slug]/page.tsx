import type { Metadata } from "next";
import { PostPage, postMetadata } from "@/components/pages/post";
import { getAllGuides } from "@/lib/guides";

interface Props {
  params: Promise<{ slug: string }>;
}

/** Only posts with a Portuguese file in src/content/guides/pt-br exist here. */
export function generateStaticParams() {
  return getAllGuides("pt-br").map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return postMetadata("pt-br", slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <PostPage locale="pt-br" slug={slug} />;
}
