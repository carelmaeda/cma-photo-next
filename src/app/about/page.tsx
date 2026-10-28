import type { Metadata } from "next";
import Link from "next/link";
import { gear, gearCategories } from "@/content/gear";
import { InstagramLink } from "@/components/instagram-link";
import { JsonLd, personId } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

const description =
  "São Paulo made, Toronto based. Why I shoot Fujifilm JPG only with no editing, why one prime is enough, and the gear I carry: GFX100RF, X100V, X-Pro3, Leica M5.";

export const metadata: Metadata = pageMetadata({
  title: "About: Fujifilm Travel Photographer in Toronto",
  description,
  path: "/about",
  keywords: [
    "Carel Maeda photographer",
    "travel photographer Toronto",
    "Fujifilm photographer",
    "GFX100RF",
    "X100V",
  ],
});

/*
 * TODO (owner): this story is a first draft in your voice — read it, correct
 * the details, make it yours. Also: add a portrait photo publicId when you
 * have one you like.
 */
export default function AboutPage() {
  return (
    <div className="px-gutter">
      {/* ProfilePage: tells Google this URL is the photographer's own page. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: `${siteConfig.url}/about`,
          mainEntity: {
            "@type": "Person",
            "@id": personId,
            name: siteConfig.name,
            url: siteConfig.url,
            jobTitle: "Travel photographer",
            description,
            sameAs: [siteConfig.instagram, siteConfig.threads],
          },
        }}
      />
      <header className="mx-auto max-w-7xl pt-3 pb-4 md:pt-4 md:pb-5">
        <h1 className="text-h3">About</h1>
      </header>

      <section className="mx-auto max-w-7xl">
        <div className="max-w-prose space-y-4 text-ink-soft">
          <p className="text-ink">
            I&apos;m Carel. São Paulo made, Toronto based.
          </p>
          <p>
            I grew up in a city of twenty million people and now live in one
            that freezes for half the year. Both taught me the same thing: the
            light is the subject. Everything else is just standing in the
            right place.
          </p>
          <p>
            I shoot Fujifilm — a GFX100RF for trips, an X100V for every day,
            an X-Pro3 when I want a rangefinder feel. And a Leica M5 with
            Portra 160 when I want to slow all the way down.
          </p>
          <p>
            Everything digital is JPG, straight out of camera. No Lightroom,
            no editing. I build the look in-camera with recipes —{" "}
            <Link href="/recipes/vanilla-summer" className="underline hover:text-indigo">
              Vanilla Summer
            </Link>{" "}
            is the one I keep coming back to. Limitation makes me more
            creative: one lens, one look, and all my attention on the frame.
          </p>
          <p>
            What I shoot: cities, travel, the in-between moments nobody plans.
            What I don&apos;t: weddings, events, studio work.
          </p>
        </div>
      </section>

      {/* Gear — folded in from the old /gear page (SPEC §2 IA) */}
      <section className="mx-auto max-w-7xl pt-section">
        <div className="max-w-3xl border-t border-line pt-12">
          <h2 className="text-h2">What I carry</h2>
          <p className="mt-3 max-w-prose text-ink-soft">
            A short list on purpose. Every item earned its place by being the
            thing I actually reach for — usually one at a time.
          </p>

          <div className="mt-8">
            {gearCategories.map((category) => {
              const items = gear.filter((item) => item.category === category);
              if (items.length === 0) return null;

              return (
                <div key={category} className="mb-12">
                  <h3 className="text-cap font-mono tracking-frame text-ink-soft uppercase">
                    {category}
                  </h3>
                  <ul className="mt-4">
                    {items.map((item) => (
                      <li key={item.name} className="border-t border-line py-5">
                        <p className="text-lg">{item.name}</p>
                        <p className="mt-1 max-w-prose text-sm text-ink-soft">
                          {item.blurb}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            <p className="border-t border-line pt-6 text-sm text-ink-soft">
              Nothing here is sponsored and there are no affiliate links right
              now. If that ever changes, it&apos;ll say so plainly here.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl pt-section pb-4">
        <div className="max-w-2xl border-t border-line pt-8">
          <p className="text-ink-soft">
            Questions about a recipe, a place, a print — or press and
            collaborations? The fastest way to reach me is a DM on{" "}
            <InstagramLink />. I read everything.
          </p>
        </div>
      </section>
    </div>
  );
}
