import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { albums, getAlbum } from "@/content/albums";
import { AlbumGallery } from "@/components/album-gallery";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return albums.map((album) => ({ slug: album.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = getAlbum(slug);
  if (!album) return {};

  return {
    title: `${album.title}, ${album.country}`,
    description: album.description,
    // Albums still showing placeholder images stay out of Google (SPEC.md §6)
    robots: album.placeholderImages ? { index: false } : undefined,
    openGraph: {
      title: `${album.title}, ${album.country} — Carel Maeda`,
      description: album.description,
    },
  };
}

export default async function AlbumPage({ params }: Props) {
  const { slug } = await params;
  const album = getAlbum(slug);
  if (!album) notFound();

  return (
    <div className="px-gutter">
      <header className="mx-auto max-w-7xl py-12 md:py-16">
        <h1 className="text-h2">{album.title}</h1>
        <p className="mt-3 max-w-prose text-ink-muted">{album.description}</p>
      </header>

      <div className="mx-auto max-w-7xl">
        <AlbumGallery title={album.title} photos={album.photos} />
      </div>

      <div className="mx-auto max-w-7xl py-12">
        <Link
          href="/gallery"
          className="text-cap font-mono tracking-frame uppercase hover:text-indigo"
        >
          ← All albums
        </Link>
      </div>
    </div>
  );
}
