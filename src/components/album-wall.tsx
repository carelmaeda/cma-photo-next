import Link from "next/link";
import { CldImage } from "@/components/cld-image";
import type { Album } from "@/lib/types";

interface AlbumWallProps {
  albums: Album[];
  /** How many leading covers load eagerly (above the fold on the home page). */
  eager?: number;
}

/**
 * The album wall (SPEC §3): one cover per album in CSS-column masonry, each at
 * its natural aspect ratio, linking to the album. Used on / and /gallery.
 *
 * CSS columns fill top to bottom, so albums.ts order decides placement: the
 * first albums run down column one. Reorder albums.ts to curate the wall.
 */
export function AlbumWall({ albums, eager = 4 }: AlbumWallProps) {
  return (
    <ul className="masonry masonry--wall">
      {albums.map((album, i) => {
        const { cover } = album;
        // Covers imported before dimensions were recorded fall back to a 4:5 crop.
        const natural = Boolean(cover.width && cover.height);

        return (
          <li key={album.slug}>
            <Link
              href={`/gallery/${album.slug}`}
              className="group relative block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
            >
              <CldImage
                photo={cover}
                crop={natural ? "limit" : "fill"}
                width={natural ? cover.width : 800}
                height={natural ? cover.height : 1000}
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                priority={i < eager}
                className="h-auto w-full transition-opacity group-hover:opacity-90"
              />
              <span className="tile-label rounded-sm bg-ink/80 px-2 py-1 font-mono text-cap tracking-frame text-paper uppercase">
                {album.title}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
