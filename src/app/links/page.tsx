import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CldImage } from "@/components/cld-image";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { realAlbums } from "@/content/albums";
import { recipes } from "@/content/recipes";
import { getAllGuides } from "@/lib/guides";
import { siteConfig } from "@/lib/siteConfig";
import { social } from "@/lib/seo";
import type { Photo } from "@/lib/types";

/**
 * Link-in-bio landing page — the URL in the Instagram profile. One column of
 * big, thumb-sized rows, each with a photo, nothing to scroll past. noindex:
 * it exists for people arriving from Instagram, not for search, so it's also
 * kept out of nav, footer, and sitemap.ts.
 */
const description =
  "Where to find my free Fujifilm recipes, the gallery, and the blog.";

export const metadata: Metadata = {
  title: "Links",
  description,
  robots: { index: false, follow: true },
  ...social("Links", description),
};

interface LinkRow {
  href: string;
  label: string;
  /** Mono caption under the label. */
  note: string;
  external: boolean;
  /** Cloudinary thumb; without one the row shows a typographic tile. */
  photo?: Photo;
  /** Letters for the typographic tile when there's no photo. */
  tile?: string;
}

const latestGuide = getAllGuides()[0];

const links: LinkRow[] = [
  ...recipes.map((recipe) => ({
    href: `/recipes/${recipe.slug}`,
    label: `${recipe.name} recipe`,
    note: `Free · ${recipe.filmSimulation}`,
    external: false,
    photo: recipe.sampleFrames[0],
    tile: recipe.filmSimulation,
  })),
  {
    href: "/gallery",
    label: "Gallery",
    note: `${realAlbums.length} albums`,
    external: false,
    photo: realAlbums[0]?.cover,
  },
  {
    href: "/blog",
    label: "Blog",
    note: "Recipes, gear, how I shoot",
    external: false,
    photo: latestGuide?.cover,
  },
  {
    href: siteConfig.threads,
    label: "Threads",
    note: "@carel011",
    external: true,
  },
];

const rowClass =
  "group flex min-h-20 w-full items-center gap-4 rounded-md border border-line bg-paper-2 p-2 pr-5 text-left transition-colors hover:border-indigo active:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo";

function Thumb({ link }: { link: LinkRow }) {
  if (link.photo) {
    return (
      <CldImage
        photo={link.photo}
        width={128}
        height={128}
        crop="fill"
        sizes="64px"
        className="size-16 shrink-0 object-cover"
      />
    );
  }
  if (link.external) {
    return (
      <Image
        src="/avatar-circle.png"
        alt=""
        width={64}
        height={64}
        className="size-16 shrink-0 rounded-full"
      />
    );
  }
  // No frames yet (Midnight Espresso): a typographic tile, so nothing
  // pretends to be the look.
  return (
    <span className="flex size-16 shrink-0 items-end bg-ink p-2 font-mono text-micro leading-tight tracking-frame text-paper uppercase">
      {link.tile}
    </span>
  );
}

function RowBody({ link }: { link: LinkRow }) {
  return (
    <>
      <Thumb link={link} />
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-semibold leading-snug group-hover:text-indigo">
          {link.label}
        </span>
        <span className="mt-1 block truncate font-mono text-cap tracking-frame text-warm uppercase">
          {link.note}
        </span>
      </span>
      <span aria-hidden className="text-h3 text-ink-soft transition-transform group-hover:translate-x-0.5 group-hover:text-indigo">
        {link.external ? "↗" : "→"}
      </span>
    </>
  );
}

export default function LinksPage() {
  return (
    <div className="px-gutter">
      <section className="mx-auto flex max-w-md flex-col items-center py-10 text-center md:py-16">
        <Image
          src="/avatar-circle.png"
          alt={siteConfig.name}
          width={96}
          height={96}
          priority
          className="size-24 rounded-full"
        />
        <h1 className="text-h2 mt-5">{siteConfig.name}</h1>
        <p className="mt-2 text-ink-soft">
          Travel and street photographer. Toronto, from São Paulo.
        </p>

        <ul data-ga-nav="links" className="mt-8 w-full space-y-3">
          {links.map((link) => (
            <li key={link.href}>
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className={rowClass}
                >
                  <RowBody link={link} />
                </a>
              ) : (
                <Link href={link.href} className={rowClass}>
                  <RowBody link={link} />
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-12 w-full border-t border-line pt-8 text-left">
          <h2 className="font-display text-xl font-semibold">
            One email a month, mostly photos.
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            New albums, the occasional recipe note. Unsubscribe anytime.
          </p>
          <div className="mt-6">
            <NewsletterForm source="links" />
          </div>
        </div>
      </section>
    </div>
  );
}
