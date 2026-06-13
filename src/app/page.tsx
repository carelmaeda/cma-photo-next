import Link from "next/link";
import { realAlbums } from "@/content/albums";
import { CldImage } from "@/components/cld-image";
import { FrameCaption } from "@/components/frame-caption";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { getAllGuides } from "@/lib/guides";
import { Reveal } from "@/components/reveal";

// Derived from album order so a future re-curation can never break the home page
const hero = realAlbums[0].cover;

const paths = [
  {
    href: "/gallery",
    title: "The photographs",
    line: "Travel albums, city by city. Shot on Fujifilm, JPG straight out of camera.",
    photo: realAlbums[1].cover,
  },
  {
    href: "/downloads",
    title: "The recipe",
    line: "Vanilla Summer — the in-camera recipe behind most of these frames. Free.",
    photo: realAlbums[2].cover,
  },
  {
    href: "/blog",
    title: "The blog",
    line: "What I've figured out about recipes, JPG, and shooting with one lens.",
    photo: realAlbums[3].cover,
  },
];

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
          <p className="mt-6 max-w-prose text-ink-muted">
            São Paulo made. Toronto based. I shoot JPG straight out of camera —
            in-camera recipes do the work. Recipes, prints, and the in-between.
          </p>
          <Link
            href="/downloads"
            className="mt-8 inline-block border border-ink px-5 py-3 text-cap font-mono tracking-frame uppercase transition-colors hover:border-indigo hover:text-indigo"
          >
            Get the free Vanilla Summer recipe →
          </Link>
        </section>

        {/* Three paths */}
        <Reveal>
        <section className="mx-auto max-w-7xl pt-section">
          <h2 className="sr-only">Where to start</h2>
          <ul className="grid gap-x-5 gap-y-12 md:grid-cols-3">
            {paths.map((path) => (
              <li key={path.href}>
                <Link href={path.href} className="group block">
                  <CldImage
                    photo={path.photo}
                    width={800}
                    height={600}
                    crop="fill"
                    gravity="auto"
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="w-full transition-opacity group-hover:opacity-90"
                  />
                  <h3 className="mt-5 font-display text-xl font-semibold group-hover:text-indigo">
                    {path.title}
                  </h3>
                  <p className="mt-2 max-w-prose text-sm text-ink-muted">
                    {path.line}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        </Reveal>

        {/* Latest work */}
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
                    <p className="mt-1 max-w-prose text-sm text-ink-muted">
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
            <p className="mt-4 max-w-prose text-ink-muted">
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
