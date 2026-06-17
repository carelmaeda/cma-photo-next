"use client";

import Image, { type ImageProps } from "next/image";
import type { Photo } from "@/lib/types";
import { siteConfig } from "@/lib/siteConfig";

const cloudName = siteConfig.cloudinary.cloudName;

type Props = Omit<ImageProps, "src" | "alt" | "loader"> & {
  photo: Photo;
  /** Cloudinary crop mode. "fill" uses gravity; "limit" preserves aspect. */
  crop?: "fill" | "limit" | "fit";
  /** Only meaningful with crop="fill". */
  gravity?: string;
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
export function CldImage({ photo, crop = "fill", gravity = "auto", ...props }: Props) {
  const transform =
    crop === "fill" ? `c_fill,g_${gravity}` : `c_${crop}`;

  // next/image calls this for each srcset candidate width; Cloudinary returns
  // the right-sized, auto-format, auto-quality image for that width.
  const loader = ({ width }: { width: number }) =>
    `https://res.cloudinary.com/${cloudName}/image/upload/${transform},w_${width},f_auto,q_auto/${photo.publicId}`;

  return <Image src={photo.publicId} alt={photo.alt} loader={loader} {...props} />;
}
