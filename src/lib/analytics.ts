"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { siteConfig } from "@/lib/siteConfig";
import type { GAEventName } from "@/lib/analytics-events";

/**
 * Send a GA4 custom event. Thin, safe wrapper over @next/third-parties so the
 * call sites stay declarative and nothing here can ever break the UI.
 *
 * Gated on the same condition as <Analytics>: events only reach GA once the
 * owner sets a real measurement ID AND flips analytics.enabled (after deploy).
 * Until then this no-ops in production and just logs in dev so the wiring can
 * be reviewed locally.
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
    sendGAEvent("event", event, params);
  } catch {
    // Analytics must never throw into the render/interaction path.
  }
}
