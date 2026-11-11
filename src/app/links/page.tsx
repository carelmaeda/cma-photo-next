import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CldImage } from "@/components/cld-image";
import { InstagramIcon } from "@/components/instagram-link";
import { RecipeCover } from "@/components/recipe-cover";
import { ShareButton } from "@/components/share-button";
import { realAlbums } from "@/content/albums";
import { recipes } from "@/content/recipes";
import { siteConfig } from "@/lib/siteConfig";
import { pageMetadata } from "@/lib/seo";
import type { Photo, Recipe } from "@/lib/types";

/**
 * Link-in-bio landing page, the URL in the Instagram profile. Built to feel
 * like Instagram's own Links sheet (light mode): a profile header, then a
 * sheet with a grab handle, a centered "Links" title, a share button and
 * stacked rows of thumb, title and URL. The site header and footer are hidden
 * here via [data-bare-page] (globals.css). noindex: it exists for people
 * arriving from Instagram, not for search, so it's also kept out of nav,
 * footer, and sitemap.ts.
 */
const description =
  "Where to find my free Fujifilm recipes and my portfolio.";

export const metadata: Metadata = pageMetadata({
  title: "Links",
  description,
  path: "/links",
  noindex: true,
});

interface LinkRow {
  href: string;
  label: string;
  external: boolean;
  /** Cloudinary thumb; a recipe without one shows its RecipeCover. */
  photo?: Photo;
  recipe?: Recipe;
  /** Slightly bigger, indigo-filled row at the top: the link I want tapped first. */
  featured?: boolean;
}

const FEATURED_SLUG = "vanilla-summer";

const siteHost = new URL(siteConfig.url).host;

/** Instagram-style second line: host + path, no protocol. */
function displayUrl(href: string): string {
  if (href.startsWith("/")) return `${siteHost}${href}`;
  return href.replace(/^https?:\/\//, "").replace(/^www\./, "");
}

const links: LinkRow[] = [
  // Midnight Espresso stays on /recipes but off the bio page.
  ...recipes
    .filter((recipe) => recipe.slug !== "midnight-espresso")
    .map((recipe) => ({
      href: `/recipes/${recipe.slug}`,
      label: `${recipe.name} recipe`,
      external: false,
      photo: recipe.sampleFrames[0],
      recipe,
      featured: recipe.slug === FEATURED_SLUG,
    }))
    .sort((a, b) => Number(b.featured) - Number(a.featured)),
  {
    href: "/gallery",
    label: "Portfolio",
    external: false,
    photo: realAlbums[0]?.cover,
  },
];

const rowBase =
  "flex w-full items-center gap-3 rounded-lg text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo";

const rowClass = `${rowBase} bg-paper-2 p-2.5 hover:bg-line active:bg-line`;

/** Featured row: same shape, a touch bigger, filled indigo. */
const featuredClass = `${rowBase} bg-indigo p-3 text-paper hover:bg-indigo-700 active:bg-indigo-700`;

function Thumb({ link }: { link: LinkRow }) {
  const size = link.featured ? "size-16" : "size-14";
  const tile = `${size} shrink-0 overflow-hidden rounded-md`;
  if (link.photo) {
    return (
      <CldImage
        photo={link.photo}
        width={128}
        height={128}
        crop="fill"
        sizes={link.featured ? "64px" : "56px"}
        className={`${tile} object-cover`}
      />
    );
  }
  if (link.recipe) {
    return (
      <span className={tile}>
        <RecipeCover recipe={link.recipe} variant="thumb" className={size} />
      </span>
    );
  }
  return null;
}

function RowBody({ link }: { link: LinkRow }) {
  return (
    <>
      <Thumb link={link} />
      <span className="min-w-0 flex-1">
        <span
          className={`block truncate font-semibold leading-snug ${link.featured ? "text-lg" : ""}`}
        >
          {link.label}
        </span>
        <span
          className={`mt-0.5 block truncate text-sm ${link.featured ? "text-paper/75" : "text-warm"}`}
        >
          {displayUrl(link.href)}
        </span>
      </span>
    </>
  );
}

export default function LinksPage() {
  return (
    <div data-bare-page className="flex min-h-svh flex-col bg-paper-2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        {/* Profile header, what sits behind the sheet on Instagram. */}
        <div className="px-4 pt-8 pb-6">
          <div className="flex items-center gap-5">
            <span className="shrink-0 rounded-full bg-conic from-brick via-indigo to-brick p-0.5">
              <span className="block rounded-full bg-paper-2 p-0.5">
                <Image
                  src="/app-icon-180.png"
                  alt=""
                  width={180}
                  height={180}
                  priority
                  className="size-20 rounded-full"
                />
              </span>
            </span>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold leading-tight">{siteConfig.name}</h1>
              <p className="text-sm text-warm">@carel011</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-ink-soft">
            Travel photographer. Toronto, from São Paulo.
          </p>
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="me noopener noreferrer"
            className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-indigo text-sm font-semibold text-paper transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
          >
            <InstagramIcon className="size-4" />
            Follow on Instagram
          </a>
        </div>

        {/* The Links sheet. */}
        <section
          aria-labelledby="links-title"
          className="flex-1 rounded-t-lg border border-b-0 border-line bg-paper px-4 pt-2 pb-10"
        >
          <div aria-hidden className="mx-auto h-1 w-10 rounded-full bg-line-2" />
          <div className="relative mt-2 flex h-11 items-center justify-center">
            <h2 id="links-title" className="text-lg font-semibold">
              Links
            </h2>
            <div className="absolute top-0 right-0">
              <ShareButton title={siteConfig.name} url={`${siteConfig.url}/links`} />
            </div>
          </div>

          <ul data-ga-nav="links" className="mt-3 space-y-2">
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
                  <Link href={link.href} className={link.featured ? featuredClass : rowClass}>
                    <RowBody link={link} />
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Newsletter signup hidden until there's something to send.
              To bring it back: <NewsletterForm source="links" /> from
              @/components/forms/newsletter-form, under a mt-10 border-t block. */}

          <p className="mt-10 text-center">
            <Link
              href="/"
              className="font-mono text-cap tracking-frame text-warm uppercase hover:text-indigo"
            >
              {siteHost}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
