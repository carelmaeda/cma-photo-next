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
      <header className="mx-auto max-w-7xl py-12 md:py-16">
        <h1 className="text-h2">Gallery</h1>
        <p className="mt-3 max-w-prose text-ink-soft">
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
