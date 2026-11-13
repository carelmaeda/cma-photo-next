import type { Metadata } from "next";
import Link from "next/link";
import { CldImage } from "@/components/cld-image";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { JsonLd, itemList } from "@/components/json-ld";
import {
  DownloadCount,
  MostDownloadedTag,
  formatDownloadCount,
  showsDownloadCount,
} from "@/components/download-count";
import { RecipeCover } from "@/components/recipe-cover";
import { TrackedDownload } from "@/components/tracked-download";
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
      <header className="mx-auto max-w-7xl pt-3 pb-4 md:pt-4 md:pb-5">
        <p className="text-cap font-mono tracking-frame text-ink-soft uppercase">
          {t.eyebrow}
        </p>
        <h1 className="text-h3 mt-1">{t.heading}</h1>
        <p className="mt-1 max-w-prose text-sm text-ink-soft">{t.intro}</p>
        {showsDownloadCount(total) && (
          <p className="mt-2 text-cap font-mono tracking-frame text-ink-soft uppercase">
            {dict.downloadCounts.total(formatDownloadCount(total, locale))}
          </p>
        )}
      </header>

      <section className="mx-auto max-w-7xl">
        {/* Phone: a compact list, 96px square thumb beside the text, so every
            recipe is on screen without scrolling. sm and up: a 4:5 card grid,
            three then four across, small enough to read as an index. */}
        <ul className="border-t border-line sm:grid sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 sm:border-0 lg:grid-cols-4">
          {recipes.map((recipe) => (
            <li key={recipe.slug} className="border-b border-line sm:border-0">
              <Link
                href={localePath(locale, `/recipes/${recipe.slug}`)}
                className="group flex items-start gap-4 py-4 sm:block sm:py-0"
              >
                {recipe.sampleFrames[0] ? (
                  <CldImage
                    photo={recipe.sampleFrames[0]}
                    width={800}
                    height={1000}
                    crop="fill"
                    gravity="auto"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 96px"
                    className="aspect-square size-24 shrink-0 border border-line object-cover transition-opacity group-hover:opacity-90 sm:aspect-auto sm:size-auto sm:w-full"
                  />
                ) : (
                  <>
                    {/* No frames yet: the recipe's own drawn cover, never a
                        random photo pretending to be the look. */}
                    <RecipeCover
                      recipe={recipe}
                      variant="thumb"
                      className="size-24 border border-line transition-opacity group-hover:opacity-90 sm:hidden"
                    />
                    <RecipeCover
                      recipe={recipe}
                      className="hidden transition-opacity group-hover:opacity-90 sm:block"
                    />
                  </>
                )}
                <div className="min-w-0">
                  {recipe.slug === topSlug && (
                    <MostDownloadedTag locale={locale} className="mb-1 sm:mt-3 sm:mb-0" />
                  )}
                  <h2 className="font-display text-lg font-semibold group-hover:text-indigo sm:mt-3 sm:text-xl">
                    {recipe.name}
                  </h2>
                  <p className="mt-1 max-w-prose text-sm text-ink-soft">
                    {recipeTagline(recipe, locale)}
                  </p>
                  <p className="mt-2 text-cap font-mono tracking-frame text-ink-soft uppercase">
                    {recipe.filmSimulation} · {recipe.compatibility}
                  </p>
                  <DownloadCount
                    count={counts[recipeDownloadId(recipe.slug)]}
                    locale={locale}
                    className="mt-1"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {presets.length > 0 && (
        <section className="mx-auto max-w-7xl pt-section">
          <div className="max-w-3xl border-t border-line pt-12">
            <h2 className="text-h2">{t.presetsHeading}</h2>
            <p className="mt-3 max-w-prose text-ink-soft">{t.presetsIntro}</p>
            <ul className="mt-8 space-y-4">
              {presets.map((preset) => (
                <li key={preset.file} className="border-b border-line pb-4">
                  <TrackedDownload
                    id={presetDownloadId(preset.file)}
                    fileType="preset"
                    href={preset.file}
                    download
                    className="font-display text-xl font-semibold hover:text-indigo"
                  >
                    {preset.name}
                  </TrackedDownload>
                  <p className="mt-1 max-w-prose text-sm text-ink-soft">
                    {preset.description}
                  </p>
                  <DownloadCount
                    count={counts[presetDownloadId(preset.file)]}
                    locale={locale}
                    className="mt-2"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {siteConfig.features.newsletter && (
        <section className="mx-auto max-w-7xl py-section">
          <div className="border-t border-line pt-12">
            <h2 className="text-h2">{t.newsletterHeading}</h2>
            <p className="mt-3 max-w-prose text-ink-soft">{t.newsletterIntro}</p>
            <div className="mt-6">
              <NewsletterForm source="recipes" />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
