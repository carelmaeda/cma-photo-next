import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What this site collects, why, and how to get your data removed. Short version: your email if you give it, purchase details via Stripe, and anonymous analytics.",
};

/*
 * TODO (owner): read this before launch and make sure every claim matches how
 * you actually operate (especially retention and the deletion promise).
 */
export default function PrivacyPage() {
  return (
    <div className="px-gutter">
      <header className="mx-auto max-w-7xl py-12 md:py-16">
        <h1 className="text-h2">Privacy</h1>
        <p className="mt-3 max-w-prose text-ink-soft">
          The short version: I collect as little as possible, I don&apos;t sell
          any of it, and you can ask me to delete it anytime.
        </p>
      </header>

      <section className="mx-auto max-w-7xl pb-8">
        <div className="max-w-prose space-y-8 text-ink-soft">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              What I collect
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-ink">Your email</strong>, if you sign up
                for the newsletter or use the contact form. Forms run on
                Netlify Forms.
              </li>
              <li>
                <strong className="text-ink">Purchase details</strong>, if you
                buy something. Payment is handled entirely by Stripe — card
                numbers never touch this site. I see your email and what you
                bought, so I can deliver it and help if something goes wrong.
              </li>
              <li>
                <strong className="text-ink">Anonymous analytics</strong> via
                Google Analytics — which pages get read, roughly where visitors
                come from. Nothing here identifies you personally to me.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              What I do with it
            </h2>
            <p className="mt-3">
              Send the newsletter (about once a month), reply when you write to
              me, deliver files you bought, and see which posts are worth
              writing more of. That&apos;s the whole list. I don&apos;t sell or
              share your data with anyone beyond the services named above.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              Leaving
            </h2>
            <p className="mt-3">
              Every newsletter has an unsubscribe link. If you want your email
              or messages deleted entirely, tell me through the{" "}
              <Link href="/contact" className="underline hover:text-indigo">
                contact form
              </Link>{" "}
              or on{" "}
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-indigo"
              >
                Instagram
              </a>{" "}
              and I&apos;ll do it.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              The services this site runs on
            </h2>
            <p className="mt-3">
              Netlify (hosting and forms), Stripe (payments), Cloudinary
              (photos), Google Analytics (statistics). Each has its own privacy
              policy that applies to the data it processes.
            </p>
          </div>

          <p className="border-t border-line pt-6 text-sm">
            Last updated July 2026. Questions —{" "}
            <Link href="/contact" className="underline hover:text-indigo">
              say hi
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
