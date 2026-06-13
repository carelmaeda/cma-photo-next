import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { GuideFrontmatter } from "./types";

const GUIDES_DIR = path.join(process.cwd(), "src", "content", "guides");

export interface Guide extends GuideFrontmatter {
  slug: string;
  content: string;
}

/**
 * Single source of truth for guides: powers the index page,
 * generateStaticParams, the sitemap, and JSON-LD.
 * Adding a guide = dropping one .mdx file in src/content/guides.
 */
export function getAllGuides(): Guide[] {
  if (!fs.existsSync(GUIDES_DIR)) return [];

  return fs
    .readdirSync(GUIDES_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(GUIDES_DIR, file), "utf8");
      const { data, content } = matter(raw);
      return { slug, content, ...(data as GuideFrontmatter) };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getGuide(slug: string): Guide | undefined {
  return getAllGuides().find((guide) => guide.slug === slug);
}

export const categoryLabels: Record<GuideFrontmatter["category"], string> = {
  "recipe-guide": "Recipes",
  "city-guide": "City guides",
  craft: "Craft",
};
