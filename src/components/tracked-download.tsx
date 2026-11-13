"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";
import { EVENTS } from "@/lib/analytics-events";

/**
 * A plain download link that also reports the download (SPEC §10).
 * The browser handles the file exactly as before; on click we fire a GA4
 * file_download event and, for files served statically (presets), a beacon
 * to /api/downloads, once per browser (localStorage flag) so repeat clicks
 * don't inflate the number. Recipe cards are counted by the card route
 * itself (countVia="server"), so they skip the beacon.
 * Nothing here can block or break the download.
 */
export function TrackedDownload({
  id,
  fileType,
  countVia = "beacon",
  href,
  download,
  className,
  children,
}: {
  /** Counter key, e.g. "recipe:vanilla-summer" (see src/lib/download-counts.ts). */
  id: string;
  fileType: "recipe_card" | "preset";
  /** "server" when the file's own route increments the counter. Default "beacon". */
  countVia?: "beacon" | "server";
  href: string;
  /** Suggested filename, or true to keep the original. */
  download: string | true;
  className?: string;
  children: ReactNode;
}) {
  function handleClick() {
    track(EVENTS.fileDownload, { file_id: id, file_type: fileType });
    if (countVia === "server") return;

    const flag = `downloaded:${id}`;
    try {
      if (window.localStorage.getItem(flag)) return;
      window.localStorage.setItem(flag, "1");
    } catch {
      // Storage blocked: still count, dedupe is a nicety.
    }
    try {
      const body = JSON.stringify({ id });
      if (!navigator.sendBeacon?.("/api/downloads", body)) {
        void fetch("/api/downloads", { method: "POST", body, keepalive: true });
      }
    } catch {
      // Counting must never get in the way of the download.
    }
  }

  return (
    <a
      href={href}
      download={download === true ? "" : download}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
