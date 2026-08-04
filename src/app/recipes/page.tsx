import type { Metadata } from "next";
import Link from "next/link";
import { CldImage } from "@/components/cld-image";
import { FrameCaption } from "@/components/frame-caption";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { recipes, presets } from "@/content/recipes";
import { social } from "@/lib/seo";

const description =
  "My Fujifilm recipes, free with every setting listed. The in-camera looks behind my photos, plus Lightroom presets for people who edit.";

export const metadata: Metadata = {
  title: "Fujifilm Recipes",
  description,
  ...social("Fujifilm Recipes", description),
};

export default function RecipesPage() {
  return (
    <div className="px-gutter">
      <header className="mx-auto max-w-7xl py-12 md:py-16">
        <p className="text-cap font-mono tracking-frame text-ink-soft uppercase">
          Free, full settings
        </p>
        <h1 className="text-display mt-4 leading-[1.05]">Recipes</h1>
        <p className="mt-6 max-w-prose text-ink-soft">
          The in-camera looks behind my photos. Every setting is on the page,
          free. Dial it in, save it to a custom slot, go shoot.
        </p>
      </header>

      <section className="mx-auto max-w-7xl">
        <ul className="grid gap-x-5 gap-y-12 sm:grid-cols-2 md:grid-cols-3">
          {recipes.map((recipe) => (
            <li key={recipe.slug}>
              <Link href={`/recipes/${recipe.slug}`} className="group block">
                <CldImage
                  photo={recipe.sampleFrames[0]}
                  width={1200}
                  height={1500}
                  crop="fill"
                  gravity="auto"
                  sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="w-full border border-line transition-opacity group-hover:opacity-90"
                />
                <FrameCaption city={recipe.sampleFrames[0].city} className="mt-3" />
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
