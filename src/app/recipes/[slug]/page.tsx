import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CldImage } from "@/components/cld-image";
import { FrameCaption } from "@/components/frame-caption";
import { JsonLd, breadcrumbList, personRef } from "@/components/json-ld";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { recipes, getRecipe, presets } from "@/content/recipes";
import { getGuide } from "@/lib/guides";
import { siteConfig } from "@/lib/siteConfig";
import { pageMetadata, ogImageUrl } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return {};

  return pageMetadata({
    title: `${recipe.name}: ${recipe.filmSimulation} Fujifilm Recipe`,
    description: `Free Fujifilm recipe: ${recipe.name}, a ${recipe.filmSimulation} look for ${recipe.compatibility} bodies. Every setting listed. ${recipe.tagline}`,
    path: `/recipes/${recipe.slug}`,
    image: recipe.sampleFrames[0]
      ? ogImageUrl(recipe.sampleFrames[0].publicId)
      : undefined,
    keywords: [
      `${recipe.name} Fujifilm recipe`,
      `${recipe.filmSimulation} recipe`,
      `Fujifilm ${recipe.filmSimulation} recipe`,
      "X-Trans IV recipes",
      "X-Trans V recipes",
      "X100V recipes",
      "Fujifilm JPEG settings",
    ],
  });
}

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  const guide = recipe.guideSlug ? getGuide(recipe.guideSlug) : undefined;
  const others = recipes.filter((entry) => entry.slug !== recipe.slug);

  return (
    <div className="px-gutter">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: `${recipe.name}: a ${recipe.filmSimulation} Fujifilm recipe`,
          description: recipe.tagline,
          url: `${siteConfig.url}/recipes/${recipe.slug}`,
          author: personRef,
          about: { "@type": "Thing", name: "Fujifilm film simulation recipes" },
          keywords: `${recipe.name}, ${recipe.filmSimulation}, ${recipe.compatibility}, Fujifilm recipe`,
        }}
      />
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "Recipes", path: "/recipes" },
          { name: recipe.name },
        ])}
      />

      <header className="mx-auto max-w-7xl pt-3 pb-4 md:pt-4 md:pb-5">
        <p className="text-cap font-mono tracking-frame text-ink-soft uppercase">
          Free, full settings
        </p>
        <h1 className="text-h3 mt-1">{recipe.name} Fujifilm recipe</h1>
        <p className="mt-1 max-w-prose text-sm text-ink-soft">
          {recipe.tagline} A {recipe.filmSimulation} look for{" "}
          {recipe.compatibility} bodies. Free, nothing to sign up for. Set it
          once, then forget the menus and go shoot.
        </p>
      </header>

      <section className="mx-auto max-w-3xl">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="py-3 pr-4 text-cap font-mono tracking-frame uppercase font-normal text-ink-soft">
                Setting
              </th>
              <th className="py-3 text-cap font-mono tracking-frame uppercase font-normal text-ink-soft">
                {recipe.compatibility}
              </th>
            </tr>
          </thead>
          <tbody>
            {recipe.settings.map((setting) => (
              <tr key={setting.label} className="border-b border-line">
                <td className="py-3 pr-4">{setting.label}</td>
                <td className="py-3 text-ink-soft">{setting.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-10 max-w-prose space-y-4 text-ink-soft">
          <h2 className="font-display text-xl font-semibold text-ink">
            Loading it
          </h2>
          <p>
            Save it as a custom slot (C1–C7) so it&apos;s one dial away. Then
            you switch into the look without touching the menus again.
          </p>
          <p>
            Then stop thinking about it. The whole point is that the camera
            does the work and you watch the light.
          </p>
          {guide && (
            <p>
              I wrote about why the settings are what they are:{" "}
              <Link
                href={`/blog/${guide.slug}`}
                className="underline hover:text-indigo"
              >
                {guide.title}
              </Link>
              .
            </p>
          )}
          {others.length > 0 && (
            <p>
              I also publish{" "}
              {others.map((other, i) => (
                <span key={other.slug}>
                  {i > 0 && ", "}
                  <Link
                    href={`/recipes/${other.slug}`}
                    className="underline hover:text-indigo"
                  >
                    {other.name}
                  </Link>{" "}
                  ({other.filmSimulation})
                </span>
              ))}
              . Same deal: free, every setting on the page.
            </p>
          )}
        </div>
      </section>

      {recipe.sampleFrames.length > 0 && (
      <section className="mx-auto max-w-7xl pt-section">
        <h2 className="text-h2">Shot on {recipe.name}</h2>
        <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
          {recipe.sampleFrames.slice(0, 3).map((photo) => (
            <li key={photo.publicId}>
              <CldImage
                photo={photo}
                width={800}
                height={1000}
                crop="fill"
                gravity="auto"
                sizes="(min-width: 768px) 33vw, 50vw"
                className="w-full border border-line"
              />
              <FrameCaption city={photo.city} className="mt-3" />
            </li>
          ))}
        </ul>
      </section>
      )}

      {presets.length > 0 && (
        <section className="mx-auto max-w-7xl pt-section">
          <div className="max-w-3xl border-t border-line pt-12">
            <h2 className="text-h2">The Lightroom version</h2>
            <p className="mt-3 max-w-prose text-ink-soft">
              I shoot JPG, so the look above lives in the camera. If you shoot
              RAW and edit, these presets get you the same feel in Lightroom.
              Free downloads.
            </p>
            <ul className="mt-8 space-y-4">
              {presets.map((preset) => (
                <li key={preset.file} className="border-b border-line pb-4">
                  <a
                    href={preset.file}
                    download
                    className="font-display text-xl font-semibold hover:text-indigo"
                  >
                    {preset.name}
                  </a>
                  <p className="mt-1 max-w-prose text-sm text-ink-soft">
                    {preset.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl py-section">
        <div className="border-t border-line pt-12">
          <h2 className="text-h2">If you want the next one</h2>
          <p className="mt-3 max-w-prose text-ink-soft">
            I send one email a month, mostly photos, plus new recipes when they
            are ready. Unsubscribe anytime.
          </p>
          <div className="mt-6">
            <NewsletterForm source="recipes" />
          </div>
        </div>
      </section>
    </div>
  );
}
