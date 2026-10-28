import type { Metadata } from "next";
import Link from "next/link";
import { CldImage } from "@/components/cld-image";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { JsonLd, itemList } from "@/components/json-ld";
import { RecipeCover } from "@/components/recipe-cover";
import { recipes, presets } from "@/content/recipes";
import { pageMetadata } from "@/lib/seo";

const description = `Free Fujifilm film simulation recipes for X-Trans IV and V bodies: ${recipes
  .map((recipe) => `${recipe.name} on ${recipe.filmSimulation}`)
  .join(", ")}. Every setting listed, nothing gated.`;

export const metadata: Metadata = pageMetadata({
  title: "Free Fujifilm Recipes, Full Settings",
  description,
  path: "/recipes",
  keywords: [
    "free Fujifilm recipes",
    "Fujifilm X-Trans IV recipes",
    "Fujifilm X-Trans V recipes",
    "X100V film simulation recipes",
    "Fujifilm JPEG settings",
    "Fujifilm Lightroom presets",
  ],
});

export default function RecipesPage() {
  return (
    <div className="px-gutter">
      <JsonLd
        data={itemList(
          "Fujifilm recipes",
          recipes.map((recipe) => ({
            name: recipe.name,
            path: `/recipes/${recipe.slug}`,
          }))
        )}
      />
      <header className="mx-auto max-w-7xl pt-3 pb-4 md:pt-4 md:pb-5">
        <p className="text-cap font-mono tracking-frame text-ink-soft uppercase">
          Free, full settings
        </p>
        <h1 className="text-h3 mt-1">Fujifilm recipes</h1>
        <p className="mt-1 max-w-prose text-sm text-ink-soft">
          The in-camera looks behind my photos. Every setting is on the page,
          free. Dial it in, save it to a custom slot, go shoot.
        </p>
      </header>

      <section className="mx-auto max-w-7xl">
        <ul className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <li key={recipe.slug}>
              <Link href={`/recipes/${recipe.slug}`} className="group block">
                {recipe.sampleFrames[0] ? (
                  <CldImage
                    photo={recipe.sampleFrames[0]}
                    width={800}
                    height={1000}
                    crop="fill"
                    gravity="auto"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="w-full border border-line transition-opacity group-hover:opacity-90"
                  />
                ) : (
                  /* No frames yet: a typographic cover in the same 4:5 box, so
                     the grid stays even and nothing pretends to be the look. */
                  <RecipeCover
                    recipe={recipe}
                    className="transition-opacity group-hover:opacity-90"
                  />
                )}
                <h2 className="mt-3 font-display text-xl font-semibold group-hover:text-indigo">
                  {recipe.name}
                </h2>
                <p className="mt-1 max-w-prose text-sm text-ink-soft">
                  {recipe.tagline}
                </p>
                <p className="mt-2 text-cap font-mono tracking-frame text-ink-soft uppercase">
                  {recipe.filmSimulation} · {recipe.compatibility}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {presets.length > 0 && (
        <section className="mx-auto max-w-7xl pt-section">
          <div className="max-w-3xl border-t border-line pt-12">
            <h2 className="text-h2">Lightroom presets</h2>
            <p className="mt-3 max-w-prose text-ink-soft">
              I shoot JPG and build the look in camera. If you shoot RAW and
              edit, these presets give you the same looks in Lightroom. Free
              downloads, no email needed.
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
          <h2 className="text-h2">When the next recipe lands</h2>
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
