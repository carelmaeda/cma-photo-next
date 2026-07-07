import type { Metadata } from "next";
import Link from "next/link";
import { albums } from "@/content/albums";
import { CldImage } from "@/components/cld-image";
import { FrameCaption } from "@/components/frame-caption";
import { social } from "@/lib/seo";

const description =
  "Travel photography gallery — Amsterdam, London, Salzburg, Vienna, Braga and more. Shot on Fujifilm, JPG straight out of camera.";

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

      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3">
        {albums.map((album) => (
          <li key={album.slug}>
            <Link href={`/gallery/${album.slug}`} className="group block">
              <CldImage
                photo={album.cover}
                width={800}
                height={1000}
                crop="fill"
                gravity="auto"
                sizes="(min-width: 768px) 33vw, 50vw"
                className="w-full transition-opacity group-hover:opacity-90"
              />
              <FrameCaption
                city={`${album.title} · ${album.country}`}
                className="mt-3"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
