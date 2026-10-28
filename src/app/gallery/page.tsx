import type { Metadata } from "next";
import { realAlbums } from "@/content/albums";
import { AlbumWall } from "@/components/album-wall";
import { JsonLd, itemList } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";

const description = `Travel photography on Fujifilm, city by city: ${realAlbums
  .slice(0, 6)
  .map((album) => album.title)
  .join(", ")} and more. Every frame JPG straight out of camera.`;

export const metadata: Metadata = pageMetadata({
  title: "Travel Photography Gallery",
  description,
  path: "/gallery",
  keywords: [
    "travel photography gallery",
    "Fujifilm travel photography",
    "city photography",
    "GFX100RF sample photos",
    "X100V sample photos",
  ],
});

export default function GalleryPage() {
  return (
    <div className="px-gutter">
      <JsonLd
        data={itemList(
          "Travel photography gallery",
          realAlbums.map((album) => ({
            name: album.title,
            path: `/gallery/${album.slug}`,
          }))
        )}
      />
      <header className="mx-auto max-w-7xl pt-3 pb-4 md:pt-4 md:pb-5">
        <h1 className="text-h3">Gallery</h1>
        <p className="mt-1 max-w-prose text-sm text-ink-soft">
          City by city. Everything here is JPG straight out of camera.
        </p>
      </header>

      <div className="mx-auto max-w-7xl">
        {/* realAlbums: a placeholder-image album stays hidden here too,
            matching the home page and sitemap. */}
        <AlbumWall albums={realAlbums} eager={0} />
      </div>
    </div>
  );
}
