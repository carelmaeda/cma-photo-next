import Link from "next/link";
import { realAlbums } from "@/content/albums";
import { recipes, presets } from "@/content/recipes";
import { CldImage } from "@/components/cld-image";
import { FrameCaption } from "@/components/frame-caption";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { getAllGuides } from "@/lib/guides";
import { siteConfig } from "@/lib/siteConfig";
import { Reveal } from "@/components/reveal";

// Derived from album order so a future re-curation can never break the home page
const hero = realAlbums[0].cover;

// The flagship free recipe fronting the launch-light homepage (SPEC §10).
const featured = recipes[0];

export default function HomePage() {
  return (
    <>
      {/* Hero — the one full-bleed moment */}
      <section className="relative overflow-hidden">
        <CldImage
          photo={hero}
          width={2400}
          height={1350}
          crop="fill"
          gravity="auto"
          priority
          sizes="100vw"
          className="hero-fade h-[70svh] w-full object-cover"
        />
      </section>

      <div className="px-gutter">
        <section className="mx-auto max-w-7xl pt-10">
          <FrameCaption city={hero.city} />
          <h1 className="title-rise text-display mt-10 leading-[1.05]">
            Photographer. Travel. Fujifilm.
          </h1>
          <p className="mt-6 max-w-prose text-ink-soft">
            São Paulo made. Toronto based. I shoot JPG straight out of camera.
            In-camera recipes do the work, and you can have them for free.
          </p>
          <Link
            href={`/recipes/${featured.slug}`}
            className="mt-8 inline-block border border-ink px-5 py-3 text-cap font-mono tracking-frame uppercase transition-colors hover:border-indigo hover:text-indigo"
          >
            The {featured.name} recipe. Free, full settings →
          </Link>
        </section>

        {/* The recipe — the launch-light front door */}
        <Reveal>
        <section className="mx-auto max-w-7xl pt-section">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-cap font-mono tracking-frame text-ink-soft uppercase">
                The recipe
              </p>
              <h2 className="text-h2 mt-4">{featured.name}</h2>
              <p className="mt-3 max-w-prose text-ink-soft">
                {featured.tagline} A {featured.filmSimulation} look for{" "}
                {featured.compatibility} bodies. This is the recipe behind most
                of my recent frames, and the one people keep asking me about on
                Instagram.
              </p>
              <p className="mt-3 max-w-prose text-ink-soft">
                Every setting is on the page. No email, no checkout.
                {presets.length > 0 &&
                  " There is a free Lightroom preset version too, if you edit."}
              </p>
              <Link
                href={`/recipes/${featured.slug}`}
                className="mt-6 inline-block text-cap font-mono tracking-frame uppercase text-indigo hover:underline"
              >
                Get the settings →
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-5">
              {featured.sampleFrames.slice(0, 2).map((photo) => (
                <li key={photo.publicId}>
                  <CldImage
                    photo={photo}
                    width={800}
                    height={1000}
                    crop="fill"
                    gravity="auto"
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="w-full border border-line"
                  />
                  <FrameCaption city={photo.city} className="mt-3" />
                </li>
              ))}
            </ul>
          </div>
        </section>
        </Reveal>

        {/* Latest work — returns with the gallery (SPEC §10) */}
        {siteConfig.features.gallery && (
        <Reveal>
        <section className="mx-auto max-w-7xl pt-section">
          <h2 className="text-h2">Latest work</h2>
          <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
            {realAlbums.slice(0, 6).map((album) => (
              <li key={album.slug}>
                <Link href={`/gallery/${album.slug}`} className="group block">
                  <CldImage
                    photo={album.cover}
                    width={800}
                    height={1000}
                    crop="fill"
                    gravity="auto"
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="w-full transition-opacity group-hover:opacity-90"
                  />
                  <FrameCaption city={album.title} className="mt-3" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
        </Reveal>
        )}

        {/* Latest guides */}
        <section className="mx-auto max-w-7xl pt-section">
          <h2 className="text-h2">From the blog</h2>
          <ul className="mt-8">
            {getAllGuides()
              .slice(0, 3)
              .map((guide) => (
                <li key={guide.slug} className="border-t border-line">
                  <Link
                    href={`/blog/${guide.slug}`}
                    className="group block py-6"
                  >
                    <h3 className="font-display text-xl font-semibold group-hover:text-indigo">
                      {guide.title}
                    </h3>
                    <p className="mt-1 max-w-prose text-sm text-ink-soft">
                      {guide.description}
                    </p>
                  </Link>
                </li>
              ))}
          </ul>
        </section>

        {/* Newsletter band */}
        <section className="mx-auto max-w-7xl pt-section">
          <div className="border-t border-line pt-12">
            <h2 className="text-h2 max-w-2xl">
              One email a month, mostly photos.
            </h2>
            <p className="mt-4 max-w-prose text-ink-soft">
              New albums, the occasional recipe note, nothing else.
              Unsubscribe anytime.
            </p>
            <div className="mt-8">
              <NewsletterForm source="home" />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
