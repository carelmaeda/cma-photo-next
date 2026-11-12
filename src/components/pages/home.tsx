import type { Metadata } from "next";
import { realAlbums } from "@/content/albums";
import { AlbumWall } from "@/components/album-wall";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function homeMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    title: dict.site.title,
    absoluteTitle: true,
    description: dict.site.description,
    path: localePath(locale, "/"),
    keywords: dict.home.keywords,
    twin: true,
  });
}

/**
 * Home is the album wall (SPEC §2): every live album's cover, nothing else.
 * Recipes, blog, and the newsletter live on their own pages and on /links.
 * The covers link to the English album pages in both languages (SPEC §2).
 */
export function HomePage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <div className="px-gutter">
      <h1 className="sr-only">{dict.home.h1}</h1>
      <div className="mx-auto max-w-7xl pt-4 md:pt-6">
        <AlbumWall albums={realAlbums} />
      </div>
    </div>
  );
}
