import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Terms & refunds",
  description:
    "The plain-language terms for buying digital downloads here: what you get, what you can do with it, and how refunds work.",
};

/*
 * TODO (owner): confirm the refund window and license wording match what
 * you're comfortable honouring before launch.
 */
export default function TermsPage() {
  return (
    <div className="px-gutter">
      <header className="mx-auto max-w-7xl py-12 md:py-16">
        <h1 className="text-h2">Terms &amp; refunds</h1>
        <p className="mt-3 max-w-prose text-ink-soft">
          Everything sold here is a digital download. These are the plain terms
          I stand behind.
        </p>
      </header>

      <section className="mx-auto max-w-7xl pb-8">
        <div className="max-w-prose space-y-8 text-ink-soft">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              What you&apos;re buying
            </h2>
            <p className="mt-3">
              Digital files — recipe cards as PDFs, prints as high-resolution
              image files. Prices are in Canadian dollars; any applicable taxes
              are calculated by Stripe at checkout. Delivery is a download link
              on the confirmation page right after payment. The link expires
              after a day, but reopening your confirmation page issues a fresh
              one — and if anything goes sideways, message me and I&apos;ll get
              you the file.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              What you can do with it
            </h2>
            <p className="mt-3">
              The files are for your personal use. Load the recipes in your
              camera, print the prints for your walls or as gifts. What you
              can&apos;t do: resell the files, redistribute them, or pass them
              off as your own. Free downloads follow the same rule — print
              them, gift them, just don&apos;t sell them.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              Refunds
            </h2>
            <p className="mt-3">
              If a file is broken, won&apos;t download, or isn&apos;t what the
              description said, tell me within 14 days of purchase and
              I&apos;ll fix it or refund you — your choice. Because these are
              instant digital downloads, I can&apos;t offer refunds for a
              change of mind once the file has been delivered. If you feel
              something is unfair, write to me anyway; I&apos;d rather sort it
              out than argue.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              Reaching me
            </h2>
            <p className="mt-3">
              The{" "}
              <Link href="/contact" className="underline hover:text-indigo">
                contact form
              </Link>{" "}
              or{" "}
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-indigo"
              >
                Instagram
              </a>
              . I read everything.
            </p>
          </div>

          <p className="border-t border-line pt-6 text-sm">
            Last updated July 2026. How your data is handled is covered in the{" "}
            <Link href="/privacy" className="underline hover:text-indigo">
              privacy note
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
