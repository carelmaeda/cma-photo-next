"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { CldImage } from "@/components/cld-image";
import type { Photo } from "@/lib/types";

interface AlbumGalleryProps {
  title: string;
  photos: Photo[];
}

/**
 * The lightbox (radix Dialog: portal, focus trap, scroll lock) is the only
 * reason an album page needs that code, and nobody needs it before the first
 * tap on a photo. It lives in its own chunk, loaded on demand and warmed on
 * pointerdown/focus so the tap feels instant.
 */
const loadLightbox = () => import("./album-lightbox");
const AlbumLightbox = dynamic(
  () => loadLightbox().then((mod) => mod.AlbumLightbox),
  { ssr: false }
);
const warm = () => {
  void loadLightbox();
};

/**
 * Photo grid + lightbox. The grid is server-rendered to HTML (this component
 * only hydrates for the click/keyboard behaviour), so crawlers see every image.
 */
export function AlbumGallery({ title, photos }: AlbumGalleryProps) {
  const [open, setOpen] = useState(false);
  // Stays mounted after the first open so the close animation can play.
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);

  const show = (i: number) => {
    setIndex(i);
    setMounted(true);
    setOpen(true);
  };

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + photos.length) % photos.length),
    [photos.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % photos.length),
    [photos.length]
  );

  return (
    <>
      <ul className="masonry">
        {photos.map((photo, i) => {
          // Reserve each photo's real aspect so the CSS columns don't reflow as
          // images arrive. Photos imported before dimensions were recorded fall
          // back to a 4:5 crop.
          const natural = Boolean(photo.width && photo.height);

          return (
            <li key={photo.publicId + i}>
              <button
                type="button"
                onClick={() => show(i)}
                onPointerDown={warm}
                onFocus={warm}
                aria-label={`Open photo: ${photo.alt}`}
                className="group block w-full cursor-zoom-in text-left"
              >
                <CldImage
                  photo={photo}
                  crop={natural ? "limit" : "fill"}
                  width={natural ? photo.width : 800}
                  height={natural ? photo.height : 1000}
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="h-auto w-full border border-line transition-opacity group-hover:opacity-90"
                />
              </button>
            </li>
          );
        })}
      </ul>

      {mounted && (
        <AlbumLightbox
          title={title}
          photos={photos}
          index={index}
          open={open}
          onOpenChange={setOpen}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  );
}
