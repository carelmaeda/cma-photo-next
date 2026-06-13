import type { Metadata } from "next";
import Link from "next/link";
import { gear, gearCategories } from "@/content/gear";

export const metadata: Metadata = {
  title: "About",
  description:
    "São Paulo made, Toronto based. Why I shoot Fujifilm, why JPG only, why one prime lens is enough — and the short list of gear I actually carry.",
};

/*
 * TODO (owner): this story is a first draft in your voice — read it, correct
 * the details, make it yours. Also: add a portrait photo publicId when you
 * have one you like.
 */
export default function AboutPage() {
  return (
    <div className="px-gutter">
      <header className="mx-auto max-w-7xl py-12 md:py-16">
        <h1 className="text-h2">About</h1>
      </header>

      <section className="mx-auto max-w-7xl">
        <div className="max-w-prose space-y-4 text-ink-muted">
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
            <Link href="/downloads" className="underline hover:text-indigo">
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
          <p className="mt-3 max-w-prose text-ink-muted">
            A short list on purpose. Every item earned its place by being the
            thing I actually reach for —{" "}
            <Link
              href="/blog/one-camera-one-lens"
              className="underline hover:text-indigo"
            >
              usually one at a time
            </Link>
            .
          </p>

          <div className="mt-8">
            {gearCategories.map((category) => {
              const items = gear.filter((item) => item.category === category);
              if (items.length === 0) return null;

              return (
                <div key={category} className="mb-12">
                  <h3 className="text-cap font-mono tracking-frame text-ink-muted uppercase">
                    {category}
                  </h3>
                  <ul className="mt-4">
                    {items.map((item) => (
                      <li key={item.name} className="border-t border-line py-5">
                        <p className="text-lg">{item.name}</p>
                        <p className="mt-1 max-w-prose text-sm text-ink-muted">
                          {item.blurb}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            <p className="border-t border-line pt-6 text-sm text-ink-muted">
              Nothing here is sponsored and there are no affiliate links right
              now. If that ever changes, it&apos;ll say so plainly here.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl pt-section pb-4">
        <div className="max-w-2xl border-t border-line pt-8">
          <p className="text-ink-muted">
            Questions about a recipe, a place, a print — or press and
            collaborations?{" "}
            <Link href="/contact" className="underline hover:text-indigo">
              Say hi
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
