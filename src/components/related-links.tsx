import Link from "next/link";
import { getAlbum } from "@/content/albums";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";

interface RelatedLinksProps {
  albums?: string[];
  locale: Locale;
}

/**
 * The internal-link lattice (SPEC.md §6): every guide links to at least one
 * album, the recipe page, and the gear page. Albums exist in English only, so
 * they link there from both languages; the recipe and about links stay in
 * the page's language.
 */
export function RelatedLinks({ albums = [], locale }: RelatedLinksProps) {
  const t = getDictionary(locale).related;
  const albumLinks = albums
    .map((slug) => ({ slug, album: getAlbum(slug) }))
    .filter((entry) => entry.album && !entry.album.placeholderImages);

  return (
    <aside className="mt-14 border-t border-line pt-8">
      <h2 className="text-cap font-mono tracking-frame text-ink-soft uppercase">
        {t.heading}
      </h2>
      <ul className="mt-4 space-y-2 text-sm">
        {albumLinks.map(({ slug, album }) => (
          <li key={slug}>
            <Link
              href={`/gallery/${slug}`}
              className="underline underline-offset-2 hover:text-indigo"
            >
              {t.album(album!.title)}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href={localePath(locale, "/recipes/vanilla-summer")}
            className="underline underline-offset-2 hover:text-indigo"
          >
            {t.recipe}
          </Link>
        </li>
        <li>
          <Link
            href={localePath(locale, "/about")}
            className="underline underline-offset-2 hover:text-indigo"
          >
            {t.about}
          </Link>
        </li>
      </ul>
    </aside>
  );
}
