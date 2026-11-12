import type { Metadata } from "next";
import { RecipesPage, recipesMetadata } from "@/components/pages/recipes";

export const metadata: Metadata = recipesMetadata("en");

export default function Page() {
  return <RecipesPage locale="en" />;
}
