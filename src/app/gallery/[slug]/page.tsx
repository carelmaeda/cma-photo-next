import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { albums, getAlbum } from "@/content/albums";
import { AlbumGallery } from "@/components/album-gallery";
import { getAllGuides } from "@/lib/guides";
import { social, ogImageUrl } from "@/lib/seo";

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
    ...social(
      `${album.title}, ${album.country}`,
      album.description,
      ogImageUrl(album.cover.publicId)
    ),
  };
}

export default async function AlbumPage({ params }: Props) {
  const { slug } = await params;
  const album = getAlbum(slug);
  if (!album) notFound();

  // Reverse side of the internal-link lattice (SPEC §6): surface any blog post
  // that links to this album, derived from guide frontmatter `related.albums`.
  const relatedGuides = getAllGuides().filter((guide) =>
    guide.related?.albums?.includes(slug)
  );

  return (
    <div className="px-gutter">
      <header className="mx-auto max-w-7xl py-12 md:py-16">
        <h1 className="text-h2">{album.title}</h1>
        <p className="mt-3 max-w-prose text-ink-soft">{album.description}</p>
      </header>

      <div className="mx-auto max-w-7xl">
        <AlbumGallery title={album.title} photos={album.photos} />
      </div>

      {relatedGuides.length > 0 && (
        <aside className="mx-auto max-w-7xl border-t border-line pt-8">
          <h2 className="text-cap font-mono tracking-frame text-warm uppercase">
            Read more
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {relatedGuides.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={`/blog/${guide.slug}`}
                  className="underline underline-offset-2 hover:text-indigo"
                >
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}

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
