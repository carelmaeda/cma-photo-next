import { getStore } from "@netlify/blobs";
import { presets, recipes } from "@/content/recipes";
import { siteConfig } from "@/lib/siteConfig";

/**
 * Download counters (SPEC §10, November 13, 2026). One Netlify Blobs store,
 * one key per downloadable file, the value is the count as a string. Nothing
 * personal is stored: no IPs, no timestamps, no visitors.
 *
 * Counts start at zero. Never seed or edit them by hand.
 */

const STORE = "downloads";

export type DownloadCounts = Record<string, number>;

export const recipeDownloadId = (slug: string) => `recipe:${slug}`;
export const presetDownloadId = (file: string) => `preset:${file}`;

/** The only keys the counter accepts, so the store can't be filled with junk. */
export function isDownloadId(id: string): boolean {
  return (
    recipes.some((recipe) => recipeDownloadId(recipe.slug) === id) ||
    presets.some((preset) => presetDownloadId(preset.file) === id)
  );
}

/**
 * Every count, for server rendering. Returns {} whenever Blobs isn't
 * reachable (local dev, a build without Blobs context, an outage) so pages
 * simply render without badges.
 */
export async function getDownloadCounts(): Promise<DownloadCounts> {
  if (!siteConfig.downloadCounts.enabled) return {};
  try {
    const store = getStore(STORE);
    const { blobs } = await store.list();
    const entries = await Promise.all(
      blobs
        .filter((blob) => isDownloadId(blob.key))
        .map(async (blob) => [blob.key, Number(await store.get(blob.key)) || 0] as const)
    );
    return Object.fromEntries(entries);
  } catch {
    return {};
  }
}

/**
 * Read-modify-write increment. Two clicks landing in the same instant can
 * lose one, which is fine at this traffic and only ever undercounts.
 */
export async function incrementDownload(id: string): Promise<number> {
  const store = getStore({ name: STORE, consistency: "strong" });
  const next = (Number(await store.get(id)) || 0) + 1;
  await store.set(id, String(next));
  return next;
}

export function totalDownloads(counts: DownloadCounts): number {
  return Object.values(counts).reduce((sum, count) => sum + count, 0);
}

/**
 * The recipe slug that clearly leads, or undefined. "Clearly" means it has
 * reached the display threshold and beats the runner-up by at least 20%, so
 * the tag doesn't flip back and forth between two close recipes.
 */
export function mostDownloadedSlug(counts: DownloadCounts): string | undefined {
  if (recipes.length < 2) return undefined;
  const ranked = recipes
    .map((recipe) => ({ slug: recipe.slug, count: counts[recipeDownloadId(recipe.slug)] ?? 0 }))
    .sort((a, b) => b.count - a.count);
  const [first, second] = ranked;
  if (first.count < siteConfig.downloadCounts.minToShow) return undefined;
  return first.count >= second.count * 1.2 ? first.slug : undefined;
}
