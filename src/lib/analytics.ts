"use client";

import { siteConfig } from "@/lib/siteConfig";
import type { GAEventName } from "@/lib/analytics-events";

declare global {
  interface Window {
    /** Defined by the inline stub in <Analytics>; queues until gtag.js loads. */
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Send a GA4 custom event. Thin, safe wrapper so the call sites stay
 * declarative and nothing here can ever break the UI.
 *
 * Gated on the same condition as <Analytics>: events only reach GA once the
 * owner sets a real measurement ID AND flips analytics.enabled (after deploy).
 * Until then this no-ops in production and just logs in dev so the wiring can
 * be reviewed locally.
 *
 * Calls go straight to window.gtag, which the <Analytics> stub defines inline
 * before any interaction is possible. gtag.js loads lazily and drains the
 * queue, so an event fired before it arrives is still delivered.
 */
const gaConfigured =
  siteConfig.analytics.enabled && !siteConfig.analytics.gaId.startsWith("TODO");

export type EventParams = Record<string, string | number>;

export function track(event: GAEventName, params: EventParams = {}): void {
  if (typeof window === "undefined") return;

  if (process.env.NODE_ENV !== "production") {
    // Visible in the browser console during review, even with GA disabled.
    console.debug(`[ga4] ${event}`, params);
  }

  if (!gaConfigured) return;

  try {
    window.gtag?.("event", event, params);
  } catch {
    // Analytics must never throw into the render/interaction path.
  }
}
