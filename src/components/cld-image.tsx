"use client";

import { CldImage as NextCldImage } from "next-cloudinary";
import type { ComponentProps } from "react";
import type { Photo } from "@/lib/types";
import { siteConfig } from "@/lib/siteConfig";

type Props = Omit<ComponentProps<typeof NextCldImage>, "src" | "alt"> & {
  photo: Photo;
};

/**
 * The only way images render on this site. Takes a typed Photo (publicId +
 * required alt) — never raw <img> or hand-built Cloudinary URLs.
 * Cloud name is passed explicitly so no env var is needed at build time.
 */
export function CldImage({ photo, ...props }: Props) {
  return (
    <NextCldImage
      src={photo.publicId}
      alt={photo.alt}
      config={{ cloud: { cloudName: siteConfig.cloudinary.cloudName } }}
      {...props}
    />
  );
}
