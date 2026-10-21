// Import new Cloudinary folders into src/content/albums.ts.
// Usage:  node import-albums.mjs <repoRoot> [--write]
// Reads CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET / CLOUDINARY_CLOUD_NAME
// from <repoRoot>/.env.local (gitignored). Never prints the secret.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = process.argv[2];
const write = process.argv.includes("--write");
if (!repo) {
  console.error("usage: node import-albums.mjs <repoRoot> [--write]");
  process.exit(1);
}

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

// --- targets -----------------------------------------------------------
// folder name in Cloudinary -> album metadata (voice: first person, no dashes)
const TARGETS = {
  "Casablanca": { slug: "casablanca", title: "Casablanca", country: "Morocco", description: "White walls, Atlantic haze, and the Hassan II mosque at the edge of the water." },
  "Iceland": { slug: "iceland", title: "Iceland", country: "Iceland", description: "Black sand, moss, and weather that changes faster than I can change lenses." },
  "Lima": { slug: "lima", title: "Lima", country: "Peru", description: "Cliffs over the Pacific and colonial balconies in the centro." },
  "Lisbon": { slug: "lisbon", title: "Lisbon", country: "Portugal", description: "Azulejos, trams, and the kind of light that makes every hill worth it." },
  "Montreal": { slug: "montreal", title: "Montreal", country: "Canada", description: "Spiral staircases, old port stone, and long winters I keep going back to." },
  "Paris": { slug: "paris", title: "Paris", country: "France", description: "Grey rooftops and the Seine. Paris photographed the way it actually looks." },
  "Punta Cana": { slug: "punta-cana", title: "Punta Cana", country: "Dominican Republic", description: "Palms, white sand, and Caribbean light that needs no help from a recipe." },
  "Punta del Este": { slug: "punta-del-este", title: "Punta del Este", country: "Uruguay", description: "Where the Rio de la Plata meets the Atlantic. Off-season quiet on the coast." },
  "Strasbourg": { slug: "strasbourg", title: "Strasbourg", country: "France", description: "Half-timbered houses and canals in the Petite France quarter." },
  "Vienna": { slug: "vienna", title: "Vienna", country: "Austria", description: "Imperial stone, coffee houses, and the Ringstrasse in winter light." },
};

// --- discover folder paths --------------------------------------------
async function listSubfolders(p) {
  const r = p
    ? await api(`/folders/${encodeURI(p)}?max_results=500`)
    : await api(`/folders?max_results=500`);
  return (r.folders || []).map((f) => f.path);
}
async function walk(p, acc) {
  let subs = [];
  try {
    subs = await listSubfolders(p);
  } catch (e) {
    console.warn("folders:", e.message);
  }
  for (const s of subs) {
    acc.push(s);
    await walk(s, acc);
  }
  return acc;
}
const allFolders = await walk("", []);
console.log(`Found ${allFolders.length} folders in cloud ${CLOUD}`);
for (const f of allFolders) console.log("  " + f);

const resolved = {};
for (const name of Object.keys(TARGETS)) {
  const hits = allFolders.filter((f) => f.split("/").pop().toLowerCase() === name.toLowerCase());
  if (hits.length === 0) console.warn(`!! no folder named "${name}"`);
  if (hits.length > 1) console.warn(`!! several folders named "${name}": ${hits.join(" | ")} (using first)`);
  if (hits.length) resolved[name] = hits[0];
}

// --- fetch resources per folder ---------------------------------------
async function searchFolder(folderPath) {
  const out = [];
  let next_cursor;
  do {
    const body = {
      expression: `resource_type:image AND (folder="${folderPath}" OR asset_folder="${folderPath}")`,
      sort_by: [{ public_id: "asc" }],
      max_results: 500,
      ...(next_cursor ? { next_cursor } : {}),
    };
    const r = await api("/resources/search", { method: "POST", body: JSON.stringify(body) });
    out.push(...(r.resources || []));
    next_cursor = r.next_cursor;
  } while (next_cursor);
  return out;
}

const manifest = {};
for (const [name, folderPath] of Object.entries(resolved)) {
  const res = await searchFolder(folderPath);
  manifest[name] = {
    folderPath,
    resources: res.map((r) => ({
      public_id: r.public_id,
      width: r.width,
      height: r.height,
      format: r.format,
      bytes: r.bytes,
    })),
  };
  console.log(`${name.padEnd(15)} ${folderPath.padEnd(40)} ${res.length} images`);
}
const outDir = path.dirname(fileURLToPath(import.meta.url));
fs.writeFileSync(path.join(outDir, "cloudinary-manifest.json"), JSON.stringify(manifest, null, 2));

// --- generate album entries -------------------------------------------
const q = (s) => JSON.stringify(s);
const entries = [];
for (const [name, meta] of Object.entries(TARGETS)) {
  const m = manifest[name];
  if (!m || m.resources.length === 0) continue;
  const alt = `Travel photograph from ${meta.title}, ${meta.country}`;
  const photo = (pid) => `      { publicId: ${q(pid)}, alt: ${q(alt)}, city: ${q(meta.title)} },`;
  // Order by the number in the filename ("lisbon-2" before "lisbon-10"), then
  // drop byte-identical re-uploads (Lisbon was uploaded twice with shifted numbers).
  const num = (r) => Number((r.public_id.split("/").pop().match(/-(\d+)_[a-z0-9]+$/) || [])[1] ?? 1e9);
  const sorted = [...m.resources].sort((a, b) => num(a) - num(b) || a.public_id.localeCompare(b.public_id));
  const seenBytes = new Set();
  const unique = sorted.filter((r) => (seenBytes.has(r.bytes) ? false : (seenBytes.add(r.bytes), true)));
  if (unique.length !== sorted.length) console.log(`${name}: dropped ${sorted.length - unique.length} duplicate uploads`);
  const ids = unique.map((r) => r.public_id);
  entries.push(
    [
      "  {",
      `    slug: ${q(meta.slug)},`,
      `    title: ${q(meta.title)},`,
      `    country: ${q(meta.country)},`,
      `    description: ${q(meta.description)},`,
      `    cover: { publicId: ${q(ids[0])}, alt: ${q(alt)}, city: ${q(meta.title)} },`,
      "    photos: [",
      ...ids.map(photo),
      "    ],",
      "  },",
    ].join("\n"),
  );
}
const block = entries.join("\n");
fs.writeFileSync(path.join(outDir, "new-albums.ts.txt"), block + "\n");
console.log(`\nGenerated ${entries.length} album entries -> new-albums.ts.txt`);

if (write && entries.length) {
  const file = path.join(repo, "src/content/albums.ts");
  let src = fs.readFileSync(file, "utf8");
  const existing = new Set([...src.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]));
  const fresh = entries.filter((e) => !existing.has(e.match(/slug: "([^"]+)"/)[1]));
  if (!fresh.length) {
    console.log("All albums already present; nothing written.");
    process.exit(0);
  }
  const eol = src.includes("\r\n") ? "\r\n" : "\n";
  const marker = `${eol}];${eol}${eol}export const getAlbum`;
  if (!src.includes(marker)) throw new Error("albums.ts: closing marker not found");
  const insert = fresh.join("\n").replace(/\n/g, eol);
  src = src.replace(marker, `${eol}${insert}${eol}];${eol}${eol}export const getAlbum`);
  fs.writeFileSync(file, src);
  console.log(`Wrote ${fresh.length} albums into src/content/albums.ts`);
}
