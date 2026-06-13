import Link from "next/link";
import { getAlbum } from "@/content/albums";

interface RelatedLinksProps {
  albums?: string[];
}

/**
 * The internal-link lattice (SPEC.md §6): every guide links to at least one
 * album, the recipe page, and the gear page.
 */
export function RelatedLinks({ albums = [] }: RelatedLinksProps) {
  const albumLinks = albums
    .map((slug) => ({ slug, album: getAlbum(slug) }))
    .filter((entry) => entry.album);

  return (
    <aside className="mt-14 border-t border-line pt-8">
      <h2 className="text-cap font-mono tracking-frame text-ink-muted uppercase">
        Keep going
      </h2>
      <ul className="mt-4 space-y-2 text-sm">
        {albumLinks.map(({ slug, album }) => (
          <li key={slug}>
            <Link
              href={`/gallery/${slug}`}
              className="underline underline-offset-2 hover:text-indigo"
            >
              The {album!.title} album
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/downloads"
            className="underline underline-offset-2 hover:text-indigo"
          >
            Vanilla Summer — the free recipe
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="underline underline-offset-2 hover:text-indigo"
          >
            What I carry
          </Link>
        </li>
      </ul>
    </aside>
  );
}
