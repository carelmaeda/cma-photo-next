import { realAlbums } from "@/content/albums";
import { AlbumWall } from "@/components/album-wall";

/**
 * Home is the album wall (SPEC §2): every live album's cover, nothing else.
 * Recipes, blog, and the newsletter live on their own pages and on /links.
 */
export default function HomePage() {
  return (
    <div className="px-gutter">
      <h1 className="sr-only">Carel Maeda. Travel photography on Fujifilm.</h1>
      <div className="mx-auto max-w-7xl py-10">
        <AlbumWall albums={realAlbums} />
      </div>
    </div>
  );
}
