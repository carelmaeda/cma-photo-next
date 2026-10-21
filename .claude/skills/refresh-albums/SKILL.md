---
name: refresh-albums
description: Sync the gallery with Cloudinary and deploy. Use when Carel says "refresh the albums", "sync the albums", "I uploaded new albums/photos", or similar. Detects new, parked, and grown album folders on Cloudinary, writes them into src/content/albums.ts, builds, commits, and pushes to main so Netlify deploys.
---

# Refresh the albums

Carel uploads photos to Cloudinary (cloud `duwhxzb0q`) and says "refresh the albums". Run this whole flow without asking for permission at each step. Carel has authorized the commit and push to `main` for this flow. Stop and ask only where a step below says so.

The only file that changes is `src/content/albums.ts`, plus `scripts/import-albums.mjs` if you add TARGETS entries. Once an album is in albums.ts without `placeholderImages`, the home album wall, `/gallery`, `/gallery/<slug>` and the sitemap pick it up automatically. Don't touch any other code.

## 1. Preflight

- `git status --short` and `git branch --show-current`. You must be on `main`. If `src/content/albums.ts` or `scripts/import-albums.mjs` has uncommitted changes you did not make, stop and ask. Other dirty files are fine, but leave them out of the commit.
- `git pull --ff-only` so you deploy on top of what is live.
- `.env.local` must contain the Cloudinary key (`CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET`, or `CLOUDINARY_URL`). If it's missing, stop and ask Carel to add it. Never print the secret.

## 2. Dry run

```
node scripts/import-albums.mjs
```

Read the status table. One line per Cloudinary folder:

| Status | Meaning | Action |
|---|---|---|
| `NEW` | not on the site, metadata ready | will be inserted |
| `NEEDS METADATA` | not on the site, no TARGETS entry | step 3 |
| `PARKED` | old album with dead photos (`placeholderImages`) | photos replaced and flag dropped; keeps its existing title, country and description |
| `LIVE +N` | live album, N new uploads | new photos appended at the end |
| `LIVE` | nothing to do | none |
| `LIVE, NO FOLDER` | live album whose folder is gone from Cloudinary | report it, don't delete it |
| `DUPLICATE FOLDER` | two folders map to one slug | report it; fix with an explicit `slug` in TARGETS |

Also report any `missing:` lines (photos in albums.ts that are no longer on Cloudinary). Never delete them on your own; ask Carel.

If it says "Nothing to change" and nothing needs metadata, tell Carel the site is already in sync and stop.

## 3. Write metadata for new folders

For each `NEEDS METADATA` folder, add an entry to `TARGETS` in `scripts/import-albums.mjs`. The key is the exact folder name (the last segment of the path).

```js
"Belem": { slug: "belem", title: "Belém", country: "Portugal", description: "..." },
```

- `slug`: lowercase, ASCII, hyphens. Defaults to the slugified folder name. Keep that unless the folder name is a typo.
- `title`: the proper place name, with accents.
- `country`: from the folder path (e.g. `Europe/Portugal/Belem` gives Portugal). If the path has no country, use what you know about the place. If the place is ambiguous, ask.
- `description`: one or two sentences. It's used as the page meta description, so it should name the place. Write in Carel's voice: first person, short, specific, no em or en dashes, no exclamation marks, no sales language. Base it on what the photos actually show: download two or three thumbnails (`https://res.cloudinary.com/duwhxzb0q/image/upload/w_600/<publicId>`) into the scratchpad and look at them. Match the tone of the existing TARGETS lines.

Re-run the dry run and confirm those folders now show `NEW`.

## 4. Write

```
node scripts/import-albums.mjs --write
```

Then sanity-check the diff (`git diff --stat src/content/albums.ts` and skim the new blocks):

- The cover is the lowest-numbered file (`city-1`). View the cover thumbnail of every new or revived album. If it is clearly a weak opener (blurry, a detail shot, a duplicate), tell Carel in the final report, and suggest renaming in Cloudinary or reordering in albums.ts. Don't block on it.
- Filenames that don't match the folder (e.g. `casablanca-1` inside Paris) are a known upload quirk. Mention them, but they don't need fixing.

## 5. Build

```
npm run build
```

It must pass with zero errors. If it fails, fix the cause in albums.ts (usually a malformed line) or stop and report. Never deploy a failing build.

## 6. Commit and deploy

Stage only the album files. Never `git add -A`, because the working tree may hold unrelated work.

```
git add src/content/albums.ts scripts/import-albums.mjs
git commit -m "content: refresh albums from Cloudinary (<summary, e.g. + Belém, Rome revived, Lisbon +4>)"
git push origin main
```

End the commit message with the attribution trailer from the current session's instructions. Pushing to `main` triggers the Netlify production build of photo.carelmaeda.com.

## 7. Verify live

Netlify needs a few minutes. Then check that each new or revived album page returns 200: `https://photo.carelmaeda.com/gallery/<slug>`. A one-line `node -e` fetch works. If it still 404s after about 10 minutes, tell Carel to check the Netlify deploy log. Don't retry in a loop.

## 8. Report

Report in a few lines: albums added, revived and grown (with photo counts), anything skipped and why, missing photos, weak covers, the commit hash, and the live check result. Remind Carel that alt text is a generic per-city default, which is worth refining on covers.

## Upload conventions to tell Carel about if they're broken

- One Cloudinary folder per album. The folder name is the place name.
- Files named `place-1`, `place-2`, … The number sets the order, and `-1` is the cover.
- Don't put images at the Cloudinary root; they're ignored (`main-sample` is Cloudinary's default and is expected there).
