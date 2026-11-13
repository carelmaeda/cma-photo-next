import { getStore } from "@netlify/blobs";
import { presets, recipes } from "@/content/recipes";
import { siteConfig } from "@/lib/siteConfig";

/**
 * Download counters (SPEC §10, November 13, 2026). One Netlify Blobs store,
 * one key per downloadable file, the value is the count as a string. Nothing
 * personal is stored: no IPs, no timestamps, no visitors.
 *
 * The id ("recipe/vanilla-summer") is the blob key and is also what the page,
 * the API and GA4 use.
 *
 * Counts start at zero. Never seed or edit them by hand.
 */

const STORE = "downloads";

/** Every id that can be counted (the allowlist), in content order. */
function allDownloadIds(): string[] {
  return [
    ...recipes.map((recipe) => recipeDownloadId(recipe.slug)),
    ...presets.map((preset) => presetDownloadId(preset.file)),
  ];
}

/** A Blobs call that hangs must fail here, never run into the function timeout. */
const TIMEOUT_MS = 8000;

/**
 * Strong consistency everywhere: the default (eventually consistent) client
 * served stale reads and an empty list for minutes on the live site; strong
 * reads answered in under 50ms. Traffic is tiny, so the cost is nothing.
 */
const store = () => getStore({ name: STORE, consistency: "strong" });

export type DownloadCounts = Record<string, number>;

/**
 * Keys use "/" as the separator. A ":" in a key made every Blobs call on it
 * hang until the function timeout on Netlify (November 13, 2026), while the
 * same calls on a plain key took milliseconds. Never put ":" in a key.
 */
export const recipeDownloadId = (slug: string) => `recipe/${slug}`;
export const presetDownloadId = (file: string) => `preset/${file.replace(/^\/+/, "")}`;

/** The only ids the counter accepts, so the store can't be filled with junk. */
export function isDownloadId(id: string): boolean {
  return allDownloadIds().includes(id);
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
    const s = store();
    const { blobs } = await withTimeout(s.list(), "list");
    const entries = await Promise.all(
      blobs
        .filter((blob) => isDownloadId(blob.key))
        .map(
          async (blob) =>
            [blob.key, Number(await withTimeout(s.get(blob.key), "get")) || 0] as const
        )
    );
    return Object.fromEntries(entries);
  } catch {
    return {};
  }
}

/**
 * Read-modify-write increment. Two clicks landing in the same instant can
 * lose one, which is fine at this traffic and only ever undercounts.
 * Throws (fast) when Blobs is unreachable.
 *
 * On the live site (November 13, 2026) every get() on a key that had never
 * been written hung until the timeout, while get() on an existing key took
 * milliseconds. So a key is read only after list() has shown it; a new key
 * is written as "1" without a read.
 */
export async function incrementDownload(id: string): Promise<number> {
  const s = store();
  const { blobs } = await withTimeout(s.list({ prefix: id }), "list");
  const exists = blobs.some((blob) => blob.key === id);
  const next = exists ? (Number(await withTimeout(s.get(id), "get")) || 0) + 1 : 1;
  await withTimeout(s.set(id, String(next)), "set");
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

  await run("list", async () => (await store().list()).blobs.map((blob) => blob.key));
  await run("get", () => store().get("_probe"));
  await run("set", () => store().set("_probe", new Date().toISOString()));
  await run("get-after-set", () => store().get("_probe"));
  await run("list-after-set", async () => (await store().list()).blobs.map((blob) => blob.key));
  // November 13, 2026: which gets hang? A plain key that was never written,
  // and the never-written slash and colon keys, against the existing _probe.
  await run("get-missing-plain", () => store().get(`_probe_missing_${Date.now()}`));
  await run("get-slash-key", () => store().get("probe/slash"));
  await run("get-colon-key", () => store().get("probe:colon"));

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
