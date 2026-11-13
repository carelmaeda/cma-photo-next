import type { Metadata } from "next";
import { RecipesPage, recipesMetadata } from "@/components/pages/recipes";

/** Download counts come from Netlify Blobs; re-read at most once an hour (SPEC §10). */
export const revalidate = 3600;

export const metadata: Metadata = recipesMetadata("pt-br");

export default function Page() {
  return <RecipesPage locale="pt-br" />;
}
