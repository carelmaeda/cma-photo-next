import type { Metadata } from "next";
import { RecipePage, recipeMetadata } from "@/components/pages/recipe";
import { recipes } from "@/content/recipes";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return recipeMetadata("pt-br", slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <RecipePage locale="pt-br" slug={slug} />;
}
