// Record each live photo's intrinsic width/height in src/content/albums.ts.
//
// Cloudinary answers `fl_getinfo` on the public delivery URL with the asset's
// dimensions, so this needs no API key. Albums flagged `placeholderImages`
// are skipped (their ids are dead until re-imported) unless --all is passed.
//
//   node scripts/photo-dimensions.mjs          # dry run: prints a table
//   node scripts/photo-dimensions.mjs --write  # rewrites albums.ts in place
//
// Photo lines keep their shape; `width: N, height: M` is appended before the
// closing brace. Lines that already carry a width are left alone.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CLOUD = "duwhxzb0q";
const write = process.argv.includes("--write");
const all = process.argv.includes("--all");
const CONCURRENCY = 6;

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(repo, "src/content/albums.ts");
const src = fs.readFileSync(file, "utf8");
const eol = src.includes("\r\n") ? "\r\n" : "\n";
const lines = src.split(eol);

// Walk the file tracking which album block we are in, so flagged albums can be skipped.
const targets = []; // { index, publicId }
let inFlagged = false;
let block = [];
let blockStart = -1;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (/^  \{\s*$/.test(line)) {
    blockStart = i;
    block = [];
    inFlagged = false;
  }
  block.push(line);
  if (/^\s+placeholderImages: true/.test(line)) inFlagged = true;
  if (/^  \},\s*$/.test(line)) {
    if (all || !inFlagged) {
      for (let j = blockStart; j <= i; j++) {
        const m = lines[j].match(/publicId: "([^"]+)"/);
        if (m && !/width:/.test(lines[j])) targets.push({ index: j, publicId: m[1] });
      }
    }
  }
}

// De-duplicate requests (covers repeat the first photo's publicId).
const ids = [...new Set(targets.map((t) => t.publicId))];
console.log(`${targets.length} photo lines to fill (${ids.length} unique ids)`);

const dims = new Map();
const missing = [];
let cursor = 0;
async function worker() {
  while (cursor < ids.length) {
    const id = ids[cursor++];
    const url = `https://res.cloudinary.com/${CLOUD}/image/upload/fl_getinfo/${id}`;
    try {
      const r = await fetch(url);
      if (!r.ok) {
        missing.push(`${id} (${r.status})`);
        continue;
      }
      const j = await r.json();
      const { width, height } = j.input ?? {};
      if (!width || !height) {
        missing.push(`${id} (no size in response)`);
        continue;
      }
      dims.set(id, { width, height });
    } catch (e) {
      missing.push(`${id} (${e.message})`);
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

for (const id of ids) {
  const d = dims.get(id);
  console.log(`${id.padEnd(60)} ${d ? `${d.width} x ${d.height}` : "MISSING"}`);
}
if (missing.length) console.log(`\n${missing.length} not resolved:\n  ${missing.join("\n  ")}`);

let changed = 0;
for (const t of targets) {
  const d = dims.get(t.publicId);
  if (!d) continue;
  const line = lines[t.index];
  const next = line.replace(/ \}(,?)\s*$/, ` width: ${d.width}, height: ${d.height} }$1`);
  if (next === line) {
    console.log(`could not rewrite line ${t.index + 1}: ${line.trim()}`);
    continue;
  }
  // The field before `}` must end with a comma for the appended pair to parse.
  lines[t.index] = next.replace(/([^,\s]) width:/, "$1, width:");
  changed++;
}

if (!write) {
  console.log(`\nDry run: ${changed} lines would change. Re-run with --write.`);
} else {
  fs.writeFileSync(file, lines.join(eol));
  console.log(`\nWrote ${changed} lines into src/content/albums.ts`);
}
