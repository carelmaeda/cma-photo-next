import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Download } from "lucide-react";
import { CldImage } from "@/components/cld-image";
import { DownloadCount } from "@/components/download-count";
import { FrameCaption } from "@/components/frame-caption";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { JsonLd, breadcrumbList, personRef } from "@/components/json-ld";
import { RecipeCover } from "@/components/recipe-cover";
import { TrackedDownload } from "@/components/tracked-download";
import { buttonVariants } from "@/components/ui/button";
import { recipes, getRecipe, presets } from "@/content/recipes";
import { getDownloadCounts, presetDownloadId, recipeDownloadId } from "@/lib/download-counts";
import { getGuide } from "@/lib/guides";
import { getDictionary, htmlLang, localePath, recipeTagline, type Locale } from "@/lib/i18n";
import { pageMetadata, ogImageUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";

export function recipeMetadata(locale: Locale, slug: string): Metadata {
  const recipe = getRecipe(slug);
  if (!recipe) return {};
  const t = getDictionary(locale).recipePage;

  return pageMetadata({
    locale,
    title: t.title(recipe),
    description: t.description(recipe),
    path: localePath(locale, `/recipes/${recipe.slug}`),
    image: recipe.sampleFrames[0]
      ? ogImageUrl(recipe.sampleFrames[0].publicId)
      : undefined,
    keywords: t.keywords(recipe),
    twin: true,
  });
}

/** Mono dateline / section label, the editorial device this page is built on. */
const eyebrow = "font-mono text-micro tracking-eyebrow text-warm uppercase";

/**
 * Product page template (SPEC §10, November 13, 2026): masthead on the left,
 * the download panel on the right, a framed contact sheet of frames shot on
 * the recipe, then the body. Any downloadable (recipe card, preset) can use
 * the same bones: swap the panel facts and the strip.
 */
export async function RecipePage({ locale, slug }: { locale: Locale; slug: string }) {
  const recipe = getRecipe(slug);
  if (!recipe) notFound();
  const counts = await getDownloadCounts();

  const dict = getDictionary(locale);
  const t = dict.recipePage;
  const guide = recipe.guideSlug ? getGuide(recipe.guideSlug, locale) : undefined;
  const others = recipes.filter((entry) => entry.slug !== recipe.slug);
  const frames = recipe.sampleFrames;

  return (
    <div className="px-gutter">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          inLanguage: htmlLang[locale],
          headline: t.headline(recipe),
          description: recipeTagline(recipe, locale),
          url: `${siteConfig.url}${localePath(locale, `/recipes/${recipe.slug}`)}`,
          author: personRef,
          about: { "@type": "Thing", name: t.aboutName },
          keywords: t.ldKeywords(recipe),
        }}
      />
      <JsonLd
        data={breadcrumbList([
          { name: dict.breadcrumbs.home, path: localePath(locale, "/") },
          { name: dict.breadcrumbs.recipes, path: localePath(locale, "/recipes") },
          { name: recipe.name },
        ])}
      />

      <article className="mx-auto max-w-7xl">
        {/* Masthead: dateline, title, lead on the left; the card panel on the right. */}
        <header className="pt-3 pb-8 md:grid md:grid-cols-12 md:gap-x-10 md:pt-6 md:pb-10 lg:gap-x-16">
          <div className="md:col-span-7 md:flex md:flex-col md:justify-center">
            <p className={eyebrow}>{t.eyebrow}</p>
            <h1 className="text-h1 mt-3 md:text-display">{t.heading(recipe)}</h1>
            <p className="mt-4 max-w-prose text-lg text-ink-soft">
              {recipeTagline(recipe, locale)}
            </p>
            <p className="mt-6 text-cap font-mono tracking-frame text-warm uppercase">
              {t.by}{" "}
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="me noopener noreferrer"
                className="text-indigo hover:underline"
              >
                @carel011
              </a>
            </p>
          </div>

          {/* The panel: what you get, then the one action. Reused by every download. */}
          <aside className="mt-8 md:col-span-5 md:mt-0">
            <div className="rounded-lg border border-line bg-paper-2 p-5 md:p-6">
              <div className="flex items-center gap-4">
                <RecipeCover
                  recipe={recipe}
                  variant="thumb"
                  className="size-14 rounded-md border border-line"
                />
                <div className="min-w-0">
                  <p className={eyebrow}>{t.panelEyebrow}</p>
                  <p className="mt-1 font-mono text-cap tracking-frame text-ink-soft uppercase">
                    {t.panelFormat}
                  </p>
                </div>
              </div>

              <ul className="mt-5 divide-y divide-line border-y border-line text-sm text-ink-soft">
                <li className="py-2.5">{t.specFree}</li>
                <li className="py-2.5">{t.specPhone}</li>
              </ul>

              {/* The card is the recipe: values live only on the PNG, one card
                  for both languages. The card route counts the download. */}
              <TrackedDownload
                id={recipeDownloadId(recipe.slug)}
                fileType="recipe_card"
                countVia="server"
                href={`/recipes/${recipe.slug}/card.png`}
                download={`${recipe.slug}-fujifilm-recipe.png`}
                className={cn(buttonVariants({ size: "lg" }), "mt-5 w-full")}
              >
                <Download aria-hidden />
                {t.download}
              </TrackedDownload>
              <DownloadCount
                count={counts[recipeDownloadId(recipe.slug)]}
                locale={locale}
                className="mt-3 text-center"
              />
            </div>
          </aside>
        </header>

        {/* Contact sheet: frames shot on the recipe, framed inside the page,
            one row that scrolls sideways. Natural aspect, captions underneath. */}
        {frames.length > 0 && (
          <section aria-label={t.shotOn(recipe)} className="border-y border-line py-4 md:py-5">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className={eyebrow}>
                {t.shotOn(recipe)} · {t.frames(frames.length)}
              </h2>
              <p className={cn(eyebrow, "hidden shrink-0 items-center gap-1 sm:inline-flex")}>
                {t.scrollHint}
                <ArrowRight className="size-3" aria-hidden />
              </p>
            </div>
            <ul className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 scrollbar-none md:gap-4">
              {frames.map((photo, i) => (
                <li key={photo.publicId} className="shrink-0 snap-start">
                  <figure>
                    <CldImage
                      photo={photo}
                      width={photo.width ?? 3}
                      height={photo.height ?? 4}
                      crop="limit"
                      sizes="(min-width: 768px) 216px, 150px"
                      priority={i === 0}
                      className="h-50 w-auto border border-line md:h-72"
                    />
                    <FrameCaption
                      frame={`FR-${String(i + 1).padStart(3, "0")}`}
                      city={photo.city}
                      className="mt-2 border-0 pt-0"
                    />
                  </figure>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Body: how to load it. */}
        <section className="pt-10 md:grid md:grid-cols-12 md:gap-x-10 md:pt-12 lg:gap-x-16">
          <div className="md:col-span-7">
            <h2 className="text-h2">{t.loadingHeading}</h2>
            <div className="mt-4 max-w-prose space-y-4 text-ink-soft">
              <p>{t.loading1}</p>
              <p>{t.loading2}</p>
            </div>
            {guide && (
              <Link
                href={localePath(locale, `/blog/${guide.slug}`)}
                className="group mt-6 flex max-w-prose items-baseline justify-between gap-4 border-y border-line py-3 text-sm hover:text-indigo"
              >
                <span>
                  <span className="text-ink-soft group-hover:text-indigo">{t.wroteAbout}</span>{" "}
                  <span className="font-semibold">{guide.title}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 self-center" aria-hidden />
              </Link>
            )}
          </div>
        </section>

        {/* The other recipes, as an index row. */}
        {others.length > 0 && (
          <section className="mt-section border-t border-line pt-8 md:pt-10">
            <h2 className={eyebrow}>{t.moreRecipes}</h2>
            <ul className="mt-4 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((other) => (
                <li key={other.slug} className="border-b border-line">
                  <Link
                    href={localePath(locale, `/recipes/${other.slug}`)}
                    className="group flex items-center gap-4 py-4"
                  >
                    <RecipeCover
                      recipe={other}
                      variant="thumb"
                      className="size-14 rounded-md border border-line"
                    />
                    <span className="min-w-0">
                      <span className="block font-semibold group-hover:text-indigo">
                        {other.name}
                      </span>
                      <span className="mt-1 block font-mono text-cap tracking-frame text-warm uppercase">
                        {other.filmSimulation} · {other.compatibility}
                      </span>
                    </span>
                    <ArrowRight
                      className="ml-auto size-4 shrink-0 text-warm transition-transform group-hover:translate-x-0.5 group-hover:text-indigo"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {presets.length > 0 && (
          <section className="mt-section border-t border-line pt-8 md:pt-10">
            <h2 className="text-h2">{t.lightroomHeading}</h2>
            <p className="mt-3 max-w-prose text-ink-soft">{t.lightroomIntro}</p>
            <ul className="mt-8 max-w-3xl space-y-4">
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
