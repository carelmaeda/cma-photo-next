import type { Print } from "@/lib/types";
import { siteConfig } from "@/lib/siteConfig";

/**
 * Free print downloads — full-resolution files delivered as Cloudinary
 * attachment URLs, revealed after the newsletter gate on /prints.
 * TODO (owner): curate this set — swap in the frames you'd actually print.
 */
export const prints: Print[] = [
  {
    title: "Canal houses, Amsterdam",
    photo: {
      publicId: "Europe/Netherlands/Amsterdam/DSCF5199_mnuy5h",
      alt: "Canal houses in Amsterdam, Netherlands",
      city: "Amsterdam",
    },
  },
  {
    title: "Morning light, Amsterdam",
    photo: {
      publicId: "Europe/Netherlands/Amsterdam/_DSF4918_edr9qv",
      alt: "Morning light in Amsterdam, Netherlands",
      city: "Amsterdam",
    },
  },
  {
    title: "Historic centre, Braga",
    photo: {
      publicId: "Europe/Portugal/Braga/_DSF5843_fjmaju",
      alt: "Historic centre of Braga, Portugal",
      city: "Braga",
    },
  },
  {
    title: "Evening light, Braga",
    photo: {
      publicId: "Europe/Portugal/Braga/_DSF5800_ff7vij",
      alt: "Evening light in Braga, Portugal",
      city: "Braga",
    },
  },
  {
    title: "Street corner, London",
    photo: {
      publicId: "Europe/England/London/_DSF3975_oqi79t",
      alt: "Street scene in London, United Kingdom",
      city: "London",
    },
  },
  {
    title: "City view, Vienna",
    photo: {
      publicId: "Europe/Austria/Vienna/we18qdnfbdcfbbvsnqv1",
      alt: "City view in Vienna, Austria",
      city: "Vienna",
    },
  },
];

/** Full-resolution download link (fl_attachment forces a file download). */
export function printDownloadUrl(print: Print): string {
  return `https://res.cloudinary.com/${siteConfig.cloudinary.cloudName}/image/upload/fl_attachment/${print.photo.publicId}`;
}
