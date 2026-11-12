import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { CldImage } from "@/components/cld-image";
import { FrameCaption } from "@/components/frame-caption";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { JsonLd, breadcrumbList, personRef } from "@/components/json-ld";
import { RecipeCover } from "@/components/recipe-cover";
import { recipes, getRecipe, presets } from "@/content/recipes";
import { getGuide } from "@/lib/guides";
import { getDictionary, localePath, recipeTagline, type Locale } from "@/lib/i18n";
import { pageMetadata, ogImageUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

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
  });
}

export function RecipePage({ locale, slug }: { locale: Locale; slug: string }) {
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  const dict = getDictionary(locale);
  const t = dict.recipePage;
  const guide = recipe.guideSlug ? getGuide(recipe.guideSlug, locale) : undefined;
  const others = recipes.filter((entry) => entry.slug !== recipe.slug);

  return (
    <div className="px-gutter">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
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

      <header className="mx-auto max-w-3xl pt-3 pb-6 md:pt-4">
        <div className="flex items-center gap-4">
          <span className="size-20 shrink-0 overflow-hidden rounded-md">
            <RecipeCover recipe={recipe} variant="thumb" className="size-20" />
          </span>
          <div className="min-w-0">
            <p className="text-cap font-mono tracking-frame text-ink-soft uppercase">
              {t.eyebrow}
            </p>
            <h1 className="text-h3 mt-1">{t.heading(recipe)}</h1>
            <p className="mt-0.5 text-sm">
              {t.by}{" "}
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="me noopener noreferrer"
                className="font-semibold text-indigo hover:underline"
              >
                @carel011
              </a>
            </p>
          </div>
        </div>
        <p className="mt-4 max-w-prose text-sm text-ink-soft">
          {recipeTagline(recipe, locale)} {recipe.filmSimulation}, {recipe.compatibility}.
        </p>
      </header>

      <section className="mx-auto max-w-3xl">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="py-3 pr-4 text-cap font-mono tracking-frame uppercase font-normal text-ink-soft">
                {t.settingHeader}
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

        {/* One card per recipe, shared by both languages (settings stay English). */}
        <a
          href={`/recipes/${recipe.slug}/card.png`}
          download={`${recipe.slug}-fujifilm-recipe.png`}
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-indigo px-4 text-sm font-semibold text-paper transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
        >
          <Download className="size-4" aria-hidden />
          {t.download}
        </a>

        <div className="mt-10 max-w-prose space-y-4 text-ink-soft">
          <h2 className="font-display text-xl font-semibold text-ink">
            {t.loadingHeading}
          </h2>
          <p>{t.loading1}</p>
          <p>{t.loading2}</p>
          {guide && (
            <p>
              {t.wroteAbout}{" "}
              <Link
                href={localePath(locale, `/blog/${guide.slug}`)}
                className="underline hover:text-indigo"
              >
                {guide.title}
              </Link>
              .
            </p>
          )}
          {others.length > 0 && (
            <p>
              {t.alsoPublish}{" "}
              {others.map((other, i) => (
                <span key={other.slug}>
                  {i > 0 && ", "}
                  <Link
                    href={localePath(locale, `/recipes/${other.slug}`)}
                    className="underline hover:text-indigo"
                  >
                    {other.name}
                  </Link>{" "}
                  ({other.filmSimulation})
                </span>
              ))}
              {t.sameDeal}
            </p>
          )}
        </div>
      </section>

      {recipe.sampleFrames.length > 0 && (
      <section className="mx-auto max-w-7xl pt-section">
        <h2 className="text-h2">{t.shotOn(recipe)}</h2>
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
            <h2 className="text-h2">{t.lightroomHeading}</h2>
            <p className="mt-3 max-w-prose text-ink-soft">{t.lightroomIntro}</p>
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
