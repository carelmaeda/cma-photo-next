import Script from "next/script";
import { siteConfig } from "@/lib/siteConfig";

/**
 * Google Analytics — renders nothing until the owner sets a real measurement
 * ID in siteConfig AND flips analytics.enabled to true (after deploy).
 *
 * Two pieces, deliberately split:
 *  1. A tiny inline stub that defines window.gtag and the dataLayer queue at
 *     parse time, so track() works from the first click and nothing is lost.
 *  2. gtag.js itself (~100 kB), loaded with strategy="lazyOnload": after the
 *     window load event, once every cover image is in. The default
 *     afterInteractive strategy preloads it in <head>, where it competes with
 *     the LCP images for bandwidth and opens a third origin during first paint.
 *     The queued config call fires page_view the moment gtag.js arrives.
 */
export function Analytics() {
  const { enabled, gaId } = siteConfig.analytics;
  if (!enabled || gaId.startsWith("TODO")) return null;
  return (
    <>
      <script
        id="ga-stub"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`,
        }}
      />
      <Script
        id="ga-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="lazyOnload"
      />
    </>
  );
}
