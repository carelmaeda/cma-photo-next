// Sync src/content/albums.ts with the image folders on Cloudinary.
//
//   node scripts/import-albums.mjs          # dry run: prints a status table
//   node scripts/import-albums.mjs --write  # applies the changes below
//
// Every Cloudinary folder that holds images maps to an album slug (the folder
// name slugified, or TARGETS[name].slug). Each one gets a status:
//   NEW             not in albums.ts and has TARGETS metadata -> inserted
//   NEEDS METADATA  not in albums.ts, no TARGETS entry        -> skipped
//   PARKED          in albums.ts with placeholderImages       -> photos replaced,
//                   flag dropped, title/country/description kept
//   LIVE +N         live album, N new uploads in the folder   -> appended
//   LIVE            nothing to do
// Live albums are never rewritten, so hand-edited alt text survives. Photos in
// albums.ts that are gone from Cloudinary are reported, never removed.
// Re-uploads are dropped twice over: byte-identical files, and look-alikes
// (same photo, different export) by a perceptual hash of a tiny thumbnail.
//
// Reads CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET (or CLOUDINARY_URL) from
// .env.local (gitignored). Never prints the secret.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const write = process.argv.includes("--write");
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(repo, "src/content/albums.ts");

// --- env ---------------------------------------------------------------
const env = { ...process.env };
const envFile = path.join(repo, ".env.local");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    if (line.trim().startsWith("#")) continue;
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
// Accept either the KEY/SECRET pair or the single CLOUDINARY_URL Cloudinary shows.
let CLOUD = env.CLOUDINARY_CLOUD_NAME || "duwhxzb0q";
let KEY = env.CLOUDINARY_API_KEY;
let SECRET = env.CLOUDINARY_API_SECRET;
if ((!KEY || !SECRET) && env.CLOUDINARY_URL) {
  const u = env.CLOUDINARY_URL.match(/^cloudinary:\/\/([^:]+):([^@]+)@([^/]+)/);
  if (u) [, KEY, SECRET, CLOUD] = u;
}
if (!KEY || !SECRET) {
  console.error("Missing CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET in .env.local");
  process.exit(2);
}
const AUTH = "Basic " + Buffer.from(`${KEY}:${SECRET}`).toString("base64");
const API = `https://api.cloudinary.com/v1_1/${CLOUD}`;

async function api(pathname, init = {}) {
  const res = await fetch(API + pathname, {
    ...init,
    headers: { Authorization: AUTH, "Content-Type": "application/json", ...(init.headers || {}) },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${res.status} ${pathname}: ${JSON.stringify(body).slice(0, 300)}`);
  return body;
}

// --- metadata for new albums -------------------------------------------
// Cloudinary folder name -> album metadata (voice: first person, no dashes).
// Only needed for folders that are not in albums.ts yet; parked albums keep
// the metadata they already have.
const TARGETS = {
  "Belem": { slug: "belem", title: "Belém", country: "Portugal", description: "The Monument to the Discoveries, the Jerónimos towers, and the Tagus in flat summer light." },
  "Casablanca": { slug: "casablanca", title: "Casablanca", country: "Morocco", description: "White walls, Atlantic haze, and the Hassan II mosque at the edge of the water." },
  "Iceland": { slug: "iceland", title: "Iceland", country: "Iceland", description: "Black sand, moss, and weather that changes faster than I can change lenses." },
  "Lima": { slug: "lima", title: "Lima", country: "Peru", description: "Cliffs over the Pacific and colonial balconies in the centro." },
  "Lisbon": { slug: "lisbon", title: "Lisbon", country: "Portugal", description: "Azulejos, trams, and the kind of light that makes every hill worth it." },
  "Milan": { slug: "milan", title: "Milan", country: "Italy", description: "Trams past the Duomo, the glass roof of the Galleria, and espresso at a marble counter." },
  "Montreal": { slug: "montreal", title: "Montreal", country: "Canada", description: "Spiral staircases, old port stone, and long winters I keep going back to." },
  "Paris": { slug: "paris", title: "Paris", country: "France", description: "Grey rooftops and the Seine. Paris photographed the way it actually looks." },
  "Punta Cana": { slug: "punta-cana", title: "Punta Cana", country: "Dominican Republic", description: "Palms, white sand, and Caribbean light that needs no help from a recipe." },
  "Punta del Este": { slug: "punta-del-este", title: "Punta del Este", country: "Uruguay", description: "Where the Rio de la Plata meets the Atlantic. Off-season quiet on the coast." },
  "Strasbourg": { slug: "strasbourg", title: "Strasbourg", country: "France", description: "Half-timbered houses and canals in the Petite France quarter." },
  "Vienna": { slug: "vienna", title: "Vienna", country: "Austria", description: "Imperial stone, coffee houses, and the Ringstrasse in winter light." },
};
const slugify = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// --- cloud: every image, grouped by folder -----------------------------
const images = [];
let next_cursor;
do {
  const r = await api("/resources/search", {
    method: "POST",
    body: JSON.stringify({
      expression: "resource_type:image",
      sort_by: [{ public_id: "asc" }],
      max_results: 500,
      ...(next_cursor ? { next_cursor } : {}),
    }),
  });
  images.push(...(r.resources || []));
  next_cursor = r.next_cursor;
} while (next_cursor);

const folders = new Map(); // folder path -> resources
for (const r of images) {
  const folder = r.asset_folder ?? r.folder ?? path.posix.dirname(r.public_id);
  if (!folder || folder === ".") {
    console.warn(`!! ${r.public_id} sits at the root, not in a folder (skipped)`);
    continue;
  }
  if (!folders.has(folder)) folders.set(folder, []);
  folders.get(folder).push(r);
}
console.log(`Cloud ${CLOUD}: ${images.length} images in ${folders.size} folders\n`);

// Order by the number in the filename ("lisbon-2" before "lisbon-10"), then
// drop byte-identical re-uploads (Lisbon was uploaded twice with shifted numbers).
const num = (r) => Number((r.public_id.split("/").pop().match(/-(\d+)(?:_[a-z0-9]+)?$/) || [])[1] ?? 1e9);
function ordered(resources) {
  const sorted = [...resources].sort((a, b) => num(a) - num(b) || a.public_id.localeCompare(b.public_id));
  const seen = new Set();
  return sorted.filter((r) => (seen.has(r.bytes) ? false : (seen.add(r.bytes), true)));
}

// Look-alikes: the same photo exported twice has different bytes, so the
// check above keeps both (Paris got five Paris frames again as casablanca-1..5).
// dHash a 9x8 grayscale PNG from the CDN (no Admin API rate limit). Measured on
// the live albums: re-exports differ by 0 bits, distinct photos by 12 or more.
const LOOKALIKE_BITS = 6;

function grayPng(buf) {
  let i = 8, w, h, idat = [];
  while (i < buf.length) {
    const len = buf.readUInt32BE(i), kind = buf.toString("ascii", i + 4, i + 8), data = buf.subarray(i + 8, i + 8 + len);
    if (kind === "IHDR") {
      [w, h] = [data.readUInt32BE(0), data.readUInt32BE(4)];
      if (data[8] !== 8 || data[9] !== 0) throw new Error(`expected 8-bit grayscale PNG, got depth ${data[8]} type ${data[9]}`);
    }
    if (kind === "IDAT") idat.push(data);
    i += 12 + len;
  }
  // Undo the per-row PNG filters (one byte per pixel).
  const raw = zlib.inflateSync(Buffer.concat(idat)), px = Buffer.alloc(w * h);
  for (let y = 0; y < h; y++) {
    const filter = raw[y * (w + 1)];
    for (let x = 0; x < w; x++) {
      const o = y * w + x, a = x ? px[o - 1] : 0, b = y ? px[o - w] : 0, c = x && y ? px[o - w - 1] : 0;
      const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
      const pred = [0, a, b, (a + b) >> 1, pa <= pb && pa <= pc ? a : pb <= pc ? b : c][filter];
      px[o] = (raw[y * (w + 1) + 1 + x] + pred) & 255;
    }
  }
  return (x, y) => px[y * w + x];
}

async function dhash(r) {
  const url = `https://res.cloudinary.com/${CLOUD}/image/upload/c_scale,w_9,h_8,e_grayscale,f_png/${encodeURI(r.public_id)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const at = grayPng(Buffer.from(await res.arrayBuffer()));
  let bits = 0n;
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) bits = (bits << 1n) | (at(x, y) > at(x + 1, y) ? 1n : 0n);
  return bits;
}

const popcount = (x) => { let n = 0; for (; x; x >>= 1n) n += Number(x & 1n); return n; };

// Keeps the first of each look-alike set, preferring a frame albums.ts already
// uses, then one named after its folder ("paris-1" over "casablanca-1").
async function dropLookalikes(photos, prefix, inUse = new Set()) {
  const queue = [...photos];
  await Promise.all(Array.from({ length: 8 }, async () => {
    for (let r; (r = queue.shift()); ) r.dhash = await dhash(r);
  }));
  const rank = (r) => (inUse.has(r.public_id) ? 0 : r.public_id.split("/").pop().startsWith(prefix) ? 1 : 2);
  const kept = [];
  for (const r of [...photos].sort((a, b) => rank(a) - rank(b))) {
    if (!kept.some((k) => popcount(k.dhash ^ r.dhash) <= LOOKALIKE_BITS)) kept.push(r);
  }
  return photos.filter((r) => kept.includes(r));
}

// --- albums.ts: locate each album block --------------------------------
let src = fs.readFileSync(file, "utf8");
const eol = src.includes("\r\n") ? "\r\n" : "\n";
let lines = src.split(eol);

function parseBlocks() {
  const blocks = new Map(); // slug -> { start, end, parked, title, country, ids }
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^  \{\s*$/.test(lines[i])) start = i;
    if (start >= 0 && /^  \},\s*$/.test(lines[i])) {
      const body = lines.slice(start, i + 1);
      const field = (k) => body.map((l) => l.match(new RegExp(`^    ${k}: "([^"]*)"`))).find(Boolean)?.[1];
      const slug = field("slug");
      if (slug) {
        blocks.set(slug, {
          start,
          end: i,
          parked: body.some((l) => /^\s+placeholderImages: true/.test(l)),
          title: field("title"),
          country: field("country"),
          ids: new Set(body.map((l) => l.match(/^      \{ publicId: "([^"]+)"/)?.[1]).filter(Boolean)),
        });
      }
      start = -1;
    }
  }
  return blocks;
}
const blocks = parseBlocks();

const q = (s) => JSON.stringify(s);
const alt = (title, country) => `Travel photograph from ${title}, ${country}`;
// width/height let grids render each frame at its natural aspect ratio.
const photoLine = (r, title, country) =>
  `      { publicId: ${q(r.public_id)}, alt: ${q(alt(title, country))}, city: ${q(title)}, width: ${r.width}, height: ${r.height} },`;
const coverLine = (r, title, country) => photoLine(r, title, country).replace(/^      \{/, "    cover: {");

// --- plan --------------------------------------------------------------
const plan = [];
const claimed = new Set();
for (const [folder, resources] of [...folders].sort(([a], [b]) => a.localeCompare(b))) {
  const name = folder.split("/").pop();
  const target = Object.entries(TARGETS).find(([k]) => k.toLowerCase() === name.toLowerCase())?.[1];
  const slug = target?.slug ?? slugify(name);
  let photos = ordered(resources);
  const block = blocks.get(slug);
  if (claimed.has(slug)) {
    plan.push({ folder, slug, status: "DUPLICATE FOLDER", photos, dupes: resources.length - photos.length, note: "another folder already maps to this slug" });
    continue;
  }
  claimed.add(slug);
  // Only folders about to change pay for the look-alike pass.
  const changing = block ? block.parked || photos.some((r) => !block.ids.has(r.public_id)) : Boolean(target);
  if (changing) photos = await dropLookalikes(photos, slugify(name), block?.ids);
  const dupes = resources.length - photos.length;
  if (!block) {
    plan.push({ folder, slug, status: target ? "NEW" : "NEEDS METADATA", photos, dupes, target });
  } else if (block.parked) {
    plan.push({ folder, slug, status: "PARKED", photos, dupes, block });
  } else {
    const cloudIds = new Set(photos.map((r) => r.public_id));
    const fresh = photos.filter((r) => !block.ids.has(r.public_id));
    const gone = [...block.ids].filter((id) => !cloudIds.has(id));
    plan.push({ folder, slug, status: fresh.length ? `LIVE +${fresh.length}` : "LIVE", photos, dupes, block, fresh, gone });
  }
}
// Live albums whose folder vanished from Cloudinary entirely.
for (const [slug, b] of blocks) {
  if (!b.parked && !claimed.has(slug)) plan.push({ folder: "(none)", slug, status: "LIVE, NO FOLDER", photos: [], dupes: 0, block: b });
}

for (const p of plan) {
  const extra = [
    p.dupes ? `${p.dupes} duplicate uploads dropped` : "",
    p.gone?.length ? `${p.gone.length} photos in albums.ts missing from Cloudinary` : "",
    p.note ?? "",
  ].filter(Boolean).join("; ");
  console.log(`${p.status.padEnd(17)} ${p.slug.padEnd(18)} ${String(p.photos.length).padStart(3)} imgs  ${p.folder}${extra ? `  (${extra})` : ""}`);
  for (const id of p.gone ?? []) console.log(`${" ".repeat(20)}missing: ${id}`);
}
const needs = plan.filter((p) => p.status === "NEEDS METADATA");
if (needs.length) {
  console.log(`\nAdd TARGETS entries for: ${needs.map((p) => q(p.folder.split("/").pop())).join(", ")}`);
}

// --- apply -------------------------------------------------------------
// Bottom-up by line number so earlier indices stay valid; new albums go last.
const edits = plan
  .filter((p) => p.status === "PARKED" || p.status.startsWith("LIVE +"))
  .sort((a, b) => b.block.start - a.block.start);
for (const p of edits) {
  const { start, end } = p.block;
  const { title, country } = p.block;
  if (p.status === "PARKED") {
    // Keep the header fields (slug, title, country, year, description), swap the photos.
    const header = lines.slice(start, end + 1).filter((l, i) => i > 0 && /^    (?!cover:|photos:|placeholderImages:)\w+:/.test(l));
    lines.splice(start, end - start + 1,
      "  {", ...header,
      coverLine(p.photos[0], title, country),
      "    photos: [", ...p.photos.map((r) => photoLine(r, title, country)), "    ],",
      "  },");
  } else {
    const close = lines.slice(start, end + 1).findLastIndex((l) => /^    \],\s*$/.test(l));
    if (close < 0) throw new Error(`${p.slug}: photos array close not found`);
    lines.splice(start + close, 0, ...p.fresh.map((r) => photoLine(r, title, country)));
  }
}
const inserts = plan.filter((p) => p.status === "NEW" && p.photos.length);
if (inserts.length) {
  const close = lines.findIndex((l, i) => /^\];\s*$/.test(l) && /^export const getAlbum/.test(lines[i + 2] ?? ""));
  if (close < 0) throw new Error("albums.ts: closing marker not found");
  lines.splice(close, 0, ...inserts.flatMap(({ slug, photos, target: t }) => [
    "  {",
    `    slug: ${q(slug)},`,
    `    title: ${q(t.title)},`,
    `    country: ${q(t.country)},`,
    `    description: ${q(t.description)},`,
    coverLine(photos[0], t.title, t.country),
    "    photos: [", ...photos.map((r) => photoLine(r, t.title, t.country)), "    ],",
    "  },",
  ]));
}

const changes = edits.length + inserts.length;
if (!changes) {
  console.log("\nNothing to change.");
} else if (!write) {
  console.log(`\nDry run: ${changes} albums would change. Re-run with --write.`);
} else {
  fs.writeFileSync(file, lines.join(eol));
  console.log(`\nWrote ${changes} albums into src/content/albums.ts`);
}
