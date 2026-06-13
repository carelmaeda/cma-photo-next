import { GoogleAnalytics } from "@next/third-parties/google";
import { siteConfig } from "@/lib/siteConfig";

/**
 * Google Analytics — renders nothing until the owner sets a real measurement
 * ID in siteConfig AND flips analytics.enabled to true (after deploy).
 */
export function Analytics() {
  const { enabled, gaId } = siteConfig.analytics;
  if (!enabled || gaId.startsWith("TODO")) return null;
  return <GoogleAnalytics gaId={gaId} />;
}
