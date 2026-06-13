"use client";

import { useCallback, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CldImage } from "@/components/cld-image";
import { FrameCaption } from "@/components/frame-caption";
import type { Photo } from "@/lib/types";

interface AlbumGalleryProps {
  title: string;
  photos: Photo[];
}

/**
 * Photo grid + lightbox. The grid is server-rendered to HTML (this component
 * only hydrates for the click/keyboard behaviour), so crawlers see every image.
 */
export function AlbumGallery({ title, photos }: AlbumGalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const show = (i: number) => {
    setIndex(i);
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

  const current = photos[index];

  return (
    <>
      <ul className="masonry">
        {photos.map((photo, i) => (
          <li key={photo.publicId + i}>
            <button
              type="button"
              onClick={() => show(i)}
              aria-label={`Open photo: ${photo.alt}`}
              className="group block w-full cursor-zoom-in text-left"
            >
              <CldImage
                photo={photo}
                width={800}
                height={1000}
                crop="fill"
                gravity="auto"
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="w-full border border-line transition-opacity group-hover:opacity-90"
              />
              <FrameCaption
                frame={`FR-${String(i + 1).padStart(3, "0")}`}
                city={photo.city}
                camera={photo.camera}
                recipe={photo.recipe}
                className="mt-2 mb-1 px-0.5"
              />
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") next();
            if (event.key === "ArrowLeft") prev();
          }}
          className="max-w-none rounded-none bg-paper p-0 ring-0 sm:max-w-[92vw]"
        >
          <DialogTitle className="sr-only">
            {title} — photo {index + 1} of {photos.length}
          </DialogTitle>

          <div className="flex items-center justify-center gap-2 p-4 md:gap-4 md:p-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={prev}
              aria-label="Previous photo"
              className="shrink-0"
            >
              <ChevronLeftIcon />
            </Button>

            <figure className="min-w-0">
              <CldImage
                key={current?.publicId}
                photo={current ?? photos[0]}
                width={1800}
                height={1800}
                crop="limit"
                sizes="92vw"
                className="max-h-[78svh] w-auto max-w-full object-contain"
              />
              <FrameCaption
                frame={`FR-${String(index + 1).padStart(3, "0")}`}
                city={current?.city}
                camera={current?.camera}
                recipe={current?.recipe}
                className="mt-3"
              />
            </figure>

            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              aria-label="Next photo"
              className="shrink-0"
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
