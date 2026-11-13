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

/** A Blobs call that hangs must fail here, never run into the function timeout. */
const TIMEOUT_MS = 8000;

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

async function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${TIMEOUT_MS}ms`)), TIMEOUT_MS);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
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
    const { blobs } = await withTimeout(store.list(), "list");
    const entries = await Promise.all(
      blobs
        .filter((blob) => isDownloadId(blob.key))
        .map(
          async (blob) =>
            [blob.key, Number(await withTimeout(store.get(blob.key), "get")) || 0] as const
        )
    );
    return Object.fromEntries(entries);
  } catch {
    return {};
  }
}

/**
 * Read-modify-write increment on the default (eventually consistent) client.
 * Two clicks landing in the same instant can lose one, which is fine at this
 * traffic and only ever undercounts. Throws (fast) when Blobs is unreachable.
 */
export async function incrementDownload(id: string): Promise<number> {
  const store = getStore(STORE);
  const next = (Number(await withTimeout(store.get(id), "get")) || 0) + 1;
  await withTimeout(store.set(id, String(next)), "set");
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

interface ProbeStep {
  label: string;
  ms: number;
  ok: boolean;
  value?: unknown;
  error?: string;
}

/**
 * Diagnostics for GET /api/downloads?debug=1: each Blobs operation timed,
 * with its error message when it fails. Writes only the `_probe` key, which
 * isDownloadId() keeps out of the counts. No secrets, nothing personal.
 */
export async function probeDownloadStore() {
  const steps: ProbeStep[] = [];
  const run = async (label: string, fn: () => Promise<unknown>) => {
    const started = Date.now();
    try {
      const value = await withTimeout(fn(), label);
      steps.push({ label, ms: Date.now() - started, ok: true, value });
    } catch (error) {
      steps.push({
        label,
        ms: Date.now() - started,
        ok: false,
        error: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
      });
    }
  };

  await run("list", async () => (await getStore(STORE).list()).blobs.map((blob) => blob.key));
  await run("get", () => getStore(STORE).get("_probe"));
  await run("set", () => getStore(STORE).set("_probe", new Date().toISOString()));
  await run("get-after-set", () => getStore(STORE).get("_probe"));
  await run("get-strong", () => getStore({ name: STORE, consistency: "strong" }).get("_probe"));

  return {
    env: {
      netlify: Boolean(process.env.NETLIFY),
      blobsContext: Boolean(process.env.NETLIFY_BLOBS_CONTEXT),
      siteId: Boolean(process.env.SITE_ID ?? process.env.NETLIFY_SITE_ID),
      runtime: process.env.NEXT_RUNTIME ?? "node",
    },
    steps,
  };
}
