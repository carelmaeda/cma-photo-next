import type { Metadata } from "next";
import { realAlbums } from "@/content/albums";
import { AlbumWall } from "@/components/album-wall";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = pageMetadata({
  title: siteConfig.title,
  absoluteTitle: true,
  description: siteConfig.description,
  path: "/",
  keywords: [
    "free Fujifilm recipes",
    "Fujifilm X100V recipes",
    "Fujifilm GFX100RF photos",
    "travel photographer Toronto",
  ],
});

/**
 * Home is the album wall (SPEC §2): every live album's cover, nothing else.
 * Recipes, blog, and the newsletter live on their own pages and on /links.
 */
export default function HomePage() {
  return (
    <div className="px-gutter">
      <h1 className="sr-only">Carel Maeda. Travel photography on Fujifilm.</h1>
      <div className="mx-auto max-w-7xl pt-4 md:pt-6">
        <AlbumWall albums={realAlbums} />
      </div>
    </div>
  );
}
