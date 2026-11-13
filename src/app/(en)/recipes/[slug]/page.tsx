import type { Metadata } from "next";
import { RecipePage, recipeMetadata } from "@/components/pages/recipe";
import { recipes } from "@/content/recipes";

interface Props {
  params: Promise<{ slug: string }>;
}

/** Download counts come from Netlify Blobs; re-read at most once an hour (SPEC §10). */
export const revalidate = 3600;

export function generateStaticParams() {
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return recipeMetadata("en", slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <RecipePage locale="en" slug={slug} />;
}
