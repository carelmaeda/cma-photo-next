import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { siteConfig } from "@/lib/siteConfig";
import { social } from "@/lib/seo";

const description =
  "Questions about a recipe, a place, a print — or press and brand work. I read everything.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  ...social("Contact", description),
};

export default function ContactPage() {
  return (
    <div className="px-gutter">
      <header className="mx-auto max-w-7xl py-12 md:py-16">
        <h1 className="text-h2">Say hi</h1>
        <p className="mt-4 max-w-prose text-ink-soft">
          Questions about a recipe, a place, a print — or anything else. I read
          everything.
        </p>
      </header>

      <section className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <ContactForm />
        </div>
      </section>

      <section className="mx-auto max-w-7xl pt-section pb-4">
        <div className="max-w-2xl border-t border-line pt-8">
          <h2 className="text-cap font-mono tracking-frame text-ink-soft uppercase">
            Press &amp; collaborations
          </h2>
          <p className="mt-3 max-w-prose text-sm text-ink-soft">
            For publications and brand work, use the form above or reach me on{" "}
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-indigo"
            >
              Instagram
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
