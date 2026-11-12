import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Locale } from "@/lib/locale-path";
import type { GuideFrontmatter } from "./types";

const GUIDES_DIR = path.join(process.cwd(), "src", "content", "guides");

/** English posts sit in the folder root; each language's twins in a subfolder. */
const localeDir: Record<Locale, string> = {
  en: GUIDES_DIR,
  "pt-br": path.join(GUIDES_DIR, "pt-br"),
};

export interface Guide extends GuideFrontmatter {
  slug: string;
  content: string;
}

/**
 * Single source of truth for guides: powers the index page,
 * generateStaticParams, the sitemap, and JSON-LD.
 * Adding a guide = dropping one .mdx file in src/content/guides.
 * A Portuguese twin = the same filename in src/content/guides/pt-br (SPEC §5
 * Languages); a post without one simply does not exist in that language.
 * Files with `draft: true` frontmatter stay in the repo but publish nowhere
 * (their URLs 404 because generateStaticParams flows through here too).
 */
export function getAllGuides(locale: Locale = "en"): Guide[] {
  const dir = localeDir[locale];
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      return { slug, content, ...(data as GuideFrontmatter) };
    })
    .filter((guide) => !guide.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getGuide(slug: string, locale: Locale = "en"): Guide | undefined {
  return getAllGuides(locale).find((guide) => guide.slug === slug);
}
