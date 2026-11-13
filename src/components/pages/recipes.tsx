import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { CldImage } from "@/components/cld-image";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { JsonLd, itemList } from "@/components/json-ld";
import { DownloadCount, DownloadTotal, MostDownloadedTag } from "@/components/download-count";
import { RecipeCover } from "@/components/recipe-cover";
import { TrackedDownload } from "@/components/tracked-download";
import { buttonVariants } from "@/components/ui/button";
import { recipes, presets } from "@/content/recipes";
import {
  getDownloadCounts,
  mostDownloadedSlug,
  presetDownloadId,
  recipeDownloadId,
  totalDownloads,
} from "@/lib/download-counts";
import { getDictionary, localePath, recipeTagline, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";

export function recipesMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    title: dict.recipes.title,
    description: dict.recipes.description(recipes),
    path: localePath(locale, "/recipes"),
    keywords: dict.recipes.keywords,
    twin: true,
  });
}

/** Mono-role label (Jakarta small caps), the same device the recipe page uses. */
const eyebrow = "font-mono text-micro tracking-eyebrow text-warm uppercase";

/**
 * The recipes index as a contents page (SPEC §10, November 13, 2026): a
 * masthead, then one feature row per recipe, image on alternating sides,
 * hairlines between. Reads as a curated index with two recipes and stays a
 * contents list with twenty. Same bones as the recipe page.
 */
export async function RecipesPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.recipes;
  const counts = await getDownloadCounts();
  const total = totalDownloads(counts);
  const topSlug = mostDownloadedSlug(counts);

  return (
    <div className="px-gutter">
      <JsonLd
        data={itemList(
          t.listName,
          recipes.map((recipe) => ({
            name: recipe.name,
            path: localePath(locale, `/recipes/${recipe.slug}`),
          })),
          localePath(locale, "/recipes")
        )}
      />

      <article className="mx-auto max-w-7xl">
        {/* Masthead: title left, lead and the total on the right, bottoms aligned. */}
        <header className="pt-3 pb-8 md:grid md:grid-cols-12 md:items-end md:gap-x-10 md:pt-6 md:pb-10 lg:gap-x-16">
          <div className="md:col-span-7">
            <p className={eyebrow}>{t.eyebrow}</p>
            <h1 className="text-h1 mt-3 md:text-display">{t.heading}</h1>
          </div>
          <div className="mt-5 md:col-span-5 md:mt-0">
            <p className="max-w-prose text-lg text-ink-soft">{t.intro}</p>
            <DownloadTotal total={total} locale={locale} className="mt-5" />
          </div>
        </header>

        {/* The contents: one row per recipe. */}
        <ol className="border-t border-line">
          {recipes.map((recipe, i) => {
            const href = localePath(locale, `/recipes/${recipe.slug}`);
            const thumbs = recipe.sampleFrames.length >= 3 ? recipe.sampleFrames.slice(0, 3) : [];
            const imageRight = i % 2 === 1;
            return (
              <li
                key={recipe.slug}
                className="grid gap-6 border-b border-line py-8 md:grid-cols-12 md:gap-x-10 md:py-10 lg:gap-x-16"
              >
                {/* The recipe's own cover, always: the drawn film box is its identity. */}
                <Link
                  href={href}
                  aria-label={recipe.name}
                  className={cn("block md:col-span-4", imageRight && "md:order-2")}
                >
                  <RecipeCover recipe={recipe} className="transition-opacity hover:opacity-90" />
                </Link>

                <div className="min-w-0 md:col-span-8 md:flex md:flex-col md:justify-center">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <p className={eyebrow}>Nº {String(i + 1).padStart(2, "0")}</p>
                    {recipe.slug === topSlug && <MostDownloadedTag locale={locale} />}
                  </div>
                  <h2 className="text-h2 mt-3 md:text-h1">
                    <Link href={href} className="hover:text-indigo">
                      {recipe.name}
                    </Link>
                  </h2>
                  <p className="mt-3 max-w-prose text-lg text-ink-soft">
                    {recipeTagline(recipe, locale)}
                  </p>
                  <p className={cn(eyebrow, "mt-5")}>
                    {recipe.filmSimulation} · {recipe.compatibility}
                  </p>

                  {thumbs.length > 0 && (
                    <ul className="mt-6 flex gap-2" aria-hidden>
                      {thumbs.map((photo) => (
                        <li key={photo.publicId} className="size-14 md:size-16">
                          <CldImage
                            photo={photo}
                            width={160}
                            height={160}
                            crop="fill"
                            gravity="auto"
                            sizes="64px"
                            className="size-full border border-line object-cover"
                          />
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* The one action: the card itself, counted by the click beacon.
                      The recipe page is the quiet second link. */}
                  <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
                    <TrackedDownload
                      id={recipeDownloadId(recipe.slug)}
                      fileType="recipe_card"
                      href={`/recipes/${recipe.slug}/card.png`}
                      download={`${recipe.slug}-fujifilm-recipe.png`}
                      className={cn(buttonVariants(), "w-full sm:w-auto")}
                    >
                      <Download aria-hidden />
                      {dict.recipePage.download}
                    </TrackedDownload>
                    <DownloadCount count={counts[recipeDownloadId(recipe.slug)]} locale={locale} />
                    <Link
                      href={href}
                      className="group inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-indigo"
                    >
                      {t.view}
                      <ArrowRight
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {presets.length > 0 && (
          <section className="pt-section">
            <div className="max-w-3xl">
              <h2 className="text-h2">{t.presetsHeading}</h2>
              <p className="mt-3 max-w-prose text-ink-soft">{t.presetsIntro}</p>
              <ul className="mt-8 border-t border-line">
                {presets.map((preset) => (
                  <li key={preset.file} className="border-b border-line py-5">
                    <TrackedDownload
                      id={presetDownloadId(preset.file)}
                      fileType="preset"
                      href={preset.file}
                      download
                      className="font-display text-xl font-semibold hover:text-indigo"
                    >
                      {preset.name}
                    </TrackedDownload>
                    <p className="mt-1 max-w-prose text-sm text-ink-soft">{preset.description}</p>
                    <DownloadCount
                      count={counts[presetDownloadId(preset.file)]}
                      locale={locale}
                      className="mt-3"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {siteConfig.features.newsletter && (
          <section className="py-section">
            <div className="border-t border-line pt-12">
              <h2 className="text-h2">{t.newsletterHeading}</h2>
              <p className="mt-3 max-w-prose text-ink-soft">{t.newsletterIntro}</p>
              <div className="mt-6">
                <NewsletterForm source="recipes" />
              </div>
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
