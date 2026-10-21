import type { Metadata } from "next";
import { realAlbums } from "@/content/albums";
import { AlbumWall } from "@/components/album-wall";
import { social } from "@/lib/seo";

const description =
  "Travel photography gallery. Paris, Lisbon, Vienna, Iceland, Lima and more. Shot on Fujifilm, JPG straight out of camera.";

export const metadata: Metadata = {
  title: "Gallery",
  description,
  ...social("Gallery", description),
};

export default function GalleryPage() {
  return (
    <div className="px-gutter">
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
