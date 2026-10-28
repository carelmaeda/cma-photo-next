"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CldImage } from "@/components/cld-image";
import type { Photo } from "@/lib/types";

interface AlbumLightboxProps {
  title: string;
  photos: Photo[];
  index: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * The album lightbox. Loaded lazily by <AlbumGallery>, which owns the grid
 * and the open/index state; this file is what pulls radix Dialog onto an
 * album page, so the grid itself must never import it.
 */
export function AlbumLightbox({
  title,
  photos,
  index,
  open,
  onOpenChange,
  onPrev,
  onNext,
}: AlbumLightboxProps) {
  const current = photos[index] ?? photos[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") onNext();
          if (event.key === "ArrowLeft") onPrev();
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
            onClick={onPrev}
            aria-label="Previous photo"
            className="shrink-0"
          >
            <ChevronLeftIcon />
          </Button>

          <figure className="min-w-0">
            <CldImage
              key={current.publicId}
              photo={current}
              width={1800}
              height={1800}
              crop="limit"
              quality="good"
              sizes="92vw"
              className="max-h-[78svh] w-auto max-w-full object-contain"
            />
          </figure>

          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            aria-label="Next photo"
            className="shrink-0"
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
