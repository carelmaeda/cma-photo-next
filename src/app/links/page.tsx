import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { recipes } from "@/content/recipes";
import { siteConfig } from "@/lib/siteConfig";
import { social } from "@/lib/seo";

/**
 * Link-in-bio landing page — the URL in the Instagram profile. One column,
 * a handful of buttons, nothing to scroll past. noindex: it exists for people
 * arriving from Instagram, not for search, so it's also kept out of nav,
 * footer, and sitemap.ts.
 */
const description =
  "Where to find my free Fujifilm recipes, the gallery, and the blog.";

export const metadata: Metadata = {
  title: "Links",
  description,
  robots: { index: false, follow: true },
  ...social("Links", description),
};

const buttonClass =
  "block w-full border border-ink px-5 py-3 text-center text-cap font-mono tracking-frame uppercase transition-colors hover:border-indigo hover:text-indigo";

const links = [
  ...recipes.map((recipe) => ({
    href: `/recipes/${recipe.slug}`,
    label: `${recipe.name} recipe`,
    external: false,
  })),
  { href: "/gallery", label: "Gallery", external: false },
  { href: "/blog", label: "Blog", external: false },
  { href: siteConfig.threads, label: "Threads", external: true },
];

export default function LinksPage() {
  return (
    <div className="px-gutter">
      <section className="mx-auto flex max-w-md flex-col items-center py-12 text-center md:py-16">
        <Image
          src="/avatar-circle.png"
          alt={siteConfig.name}
          width={96}
          height={96}
          priority
          className="size-24 rounded-full"
        />
        <h1 className="text-h2 mt-6">{siteConfig.name}</h1>
        <p className="mt-2 text-ink-soft">
          Travel and street photographer. Toronto, from São Paulo.
        </p>

        <ul data-ga-nav="links" className="mt-10 w-full space-y-3">
          {links.map((link) => (
            <li key={link.href}>
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className={buttonClass}
                >
                  {link.label}
                </a>
              ) : (
                <Link href={link.href} className={buttonClass}>
                  {link.label}
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
