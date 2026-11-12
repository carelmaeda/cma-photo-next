import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { realAlbums, getAlbum } from "@/content/albums";
import { AlbumGallery } from "@/components/album-gallery";
import { JsonLd, breadcrumbList, personRef } from "@/components/json-ld";
import { getAllGuides } from "@/lib/guides";
import { pageMetadata, ogImageUrl, photoUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";
import type { Album } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

/** "Paris, France" — but "Iceland", not "Iceland, Iceland". */
const placeName = (album: Album) =>
  album.title === album.country ? album.title : `${album.title}, ${album.country}`;

export function generateStaticParams() {
  return realAlbums.map((album) => ({ slug: album.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = getAlbum(slug);
  if (!album || album.placeholderImages) return {};

  const place = placeName(album);
  return pageMetadata({
    title: `${place}: Travel Photography on Fujifilm`,
    description: `${album.description} ${album.photos.length} photos from ${place}, shot on Fujifilm, JPG straight out of camera.`,
    path: `/gallery/${album.slug}`,
    image: ogImageUrl(album.cover.publicId),
    keywords: [
      `${album.title} travel photography`,
      `${album.title} photography`,
      `${album.title} Fujifilm`,
      `${album.country} travel photography`,
      "Fujifilm travel photography",
    ],
  });
}

export default async function AlbumPage({ params }: Props) {
  const { slug } = await params;
  // Albums awaiting re-upload (placeholderImages) are not served at all.
  const album = getAlbum(slug);
  if (!album || album.placeholderImages) notFound();

  // Reverse side of the internal-link lattice (SPEC §6): surface any blog post
  // that links to this album, derived from guide frontmatter `related.albums`.
  const relatedGuides = getAllGuides().filter((guide) =>
    guide.related?.albums?.includes(slug)
  );
  const place = placeName(album);

  return (
    <div className="px-gutter">
      {/* ImageGallery + one ImageObject per photo: creator and credit on every
          frame is what Google Images uses for image attribution. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          name: `${place} travel photography`,
          description: album.description,
          url: `${siteConfig.url}/gallery/${album.slug}`,
          author: personRef,
          contentLocation: { "@type": "Place", name: place },
          image: photoUrl(album.cover.publicId),
          associatedMedia: album.photos.map((photo) => ({
            "@type": "ImageObject",
            contentUrl: photoUrl(photo.publicId),
            name: photo.alt,
            creator: personRef,
            creditText: siteConfig.name,
            copyrightNotice: siteConfig.name,
          })),
        }}
      />
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
          { name: place },
        ])}
      />
      <header className="mx-auto max-w-7xl pt-3 pb-4 md:pt-4 md:pb-5">
        <h1 className="text-h3">{album.title}</h1>
        <p className="mt-1 max-w-prose text-sm text-ink-soft">{album.description}</p>
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

      <div className="mx-auto max-w-7xl py-8">
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
