"use client";

import Image, { type ImageProps } from "next/image";
import type { Photo } from "@/lib/types";
import { siteConfig } from "@/lib/siteConfig";

const cloudName = siteConfig.cloudinary.cloudName;

type Props = Omit<ImageProps, "src" | "alt" | "loader" | "quality"> & {
  photo: Photo;
  /** Cloudinary crop mode. "fill" uses gravity; "limit" preserves aspect. */
  crop?: "fill" | "limit" | "fit";
  /** Only meaningful with crop="fill". */
  gravity?: string;
  /**
   * Cloudinary q_auto level. "eco" for grids and thumbnails (film-sim grain
   * makes default WebP heavy: roughly half the bytes, no visible loss at grid
   * size); "good" where one photo fills the screen (the lightbox).
   */
  quality?: "eco" | "good";
};

/**
 * The only way images render on this site. Takes a typed Photo (publicId +
 * required alt) — never raw <img> or hand-built Cloudinary URLs in pages.
 *
 * A thin client leaf over next/image with a Cloudinary loader, so the browser
 * fetches already-optimized (f_auto, q_auto) responsive variants straight from
 * the CDN. next/image is already in the shared chunk, so this ships no extra
 * image library — it replaces the ~50 kB next-cloudinary client bundle.
 */
export function CldImage({
  photo,
  crop = "fill",
  gravity = "auto",
  quality = "eco",
  ...props
}: Props) {
  const transform =
    crop === "fill" ? `c_fill,g_${gravity}` : `c_${crop}`;

  // next/image only hands the loader a width. A fill crop also needs a height,
  // or Cloudinary returns the photo at its natural aspect (no crop, so the
  // reserved box doesn't match and g_auto is wasted render time). Derive it
  // from the width/height props the page set.
  const ratio =
    crop === "fill" && props.width && props.height
      ? Number(props.height) / Number(props.width)
      : null;

  // next/image calls this for each srcset candidate width; Cloudinary returns
  // the right-sized, auto-format, auto-quality image for that width.
  const loader = ({ width }: { width: number }) => {
    const size = ratio ? `w_${width},h_${Math.round(width * ratio)}` : `w_${width}`;
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transform},${size},f_auto,q_auto:${quality}/${photo.publicId}`;
  };

  return <Image src={photo.publicId} alt={photo.alt} loader={loader} {...props} />;
}
