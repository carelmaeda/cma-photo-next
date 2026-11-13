import { Download } from "lucide-react";
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

/**
 * The download chip: brick, the one spark on the page (SPEC §3). Mono caps
 * with the number in bold, so "1,100+ downloads" reads at a glance.
 */
function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-sm border border-brick px-2.5 font-mono text-cap tracking-frame text-brick uppercase",
        className
      )}
    >
      <Download className="size-3.5 shrink-0" aria-hidden />
      {children}
    </p>
  );
}

/** "1,100+ downloads" for one file. Renders nothing below the threshold. */
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
  return <Chip className={className}>{t.count(formatDownloadCount(count, locale))}</Chip>;
}

/** The site-wide total on /recipes, same chip. */
export function DownloadTotal({
  total,
  locale,
  className,
}: {
  total: number;
  locale: Locale;
  className?: string;
}) {
  if (!showsDownloadCount(total)) return null;
  const t = getDictionary(locale).downloadCounts;
  return <Chip className={className}>{t.total(formatDownloadCount(total, locale))}</Chip>;
}

/** The "Most downloaded" tag on the leading recipe. */
export function MostDownloadedTag({ locale, className }: { locale: Locale; className?: string }) {
  return (
    <p className={cn("text-cap font-mono tracking-frame text-indigo uppercase", className)}>
      {getDictionary(locale).downloadCounts.mostDownloaded}
    </p>
  );
}
