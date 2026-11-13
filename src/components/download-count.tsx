import { getDictionary, dateLocale, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";

/**
 * Rounds down so the number never overstates: 57 → "50+", 1,240 → "1,200+",
 * 12,480 → "12,000+". Formatted for the page's language (1.200+ in Portuguese).
 */
export function formatDownloadCount(count: number, locale: Locale): string {
  const step = count >= 10000 ? 1000 : count >= 1000 ? 100 : 10;
  const floored = Math.floor(count / step) * step;
  return `${new Intl.NumberFormat(dateLocale[locale]).format(floored)}+`;
}

export function showsDownloadCount(count: number | undefined): count is number {
  return siteConfig.downloadCounts.enabled && (count ?? 0) >= siteConfig.downloadCounts.minToShow;
}

/** "1,200+ downloads" in the mono caption style. Renders nothing below the threshold. */
export function DownloadCount({
  count,
  locale,
  className,
}: {
  count: number | undefined;
  locale: Locale;
  className?: string;
}) {
  if (!showsDownloadCount(count)) return null;
  const t = getDictionary(locale).downloadCounts;
  return (
    <p className={cn("text-cap font-mono tracking-frame text-ink-soft uppercase", className)}>
      {t.count(formatDownloadCount(count, locale))}
    </p>
  );
}

/** The "Most downloaded" tag on the leading recipe. */
export function MostDownloadedTag({ locale, className }: { locale: Locale; className?: string }) {
  return (
    <p className={cn("text-cap font-mono tracking-frame text-indigo uppercase", className)}>
      {getDictionary(locale).downloadCounts.mostDownloaded}
    </p>
  );
}
