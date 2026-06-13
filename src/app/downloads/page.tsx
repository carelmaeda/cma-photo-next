import type { Metadata } from "next";
import { CldImage } from "@/components/cld-image";
import { FrameCaption } from "@/components/frame-caption";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { ProductCard } from "@/components/product-card";
import { vanillaSummer, sampleFrames } from "@/content/recipes";
import { paidProducts } from "@/content/products";

export const metadata: Metadata = {
  title: "Vanilla Summer — a free Fujifilm recipe",
  description:
    "Vanilla Summer is my in-camera Fujifilm recipe — warm shadows, soft highlights, no editing. Free, in X-mount and GFX versions.",
};

const hero = sampleFrames[0];

export default function RecipesPage() {
  const paidRecipes = paidProducts("recipe");

  return (
    <div className="px-gutter">
      <header className="mx-auto max-w-7xl py-12 md:py-16">
        <h1 className="text-display leading-[1.05]">{vanillaSummer.name}</h1>
        <div className="mt-10 max-w-prose space-y-4 text-ink-muted">
          <p>
            {vanillaSummer.tagline} It&apos;s the look behind most of what I
            post.
          </p>
          <p>
            It&apos;s built entirely in-camera. No Lightroom, no presets, no
            editing afterwards. The JPG that comes out of the camera is the
            photo.
          </p>
          <p>
            I refined it over a year of shooting. It&apos;s free — I&apos;d
            rather you use it than not.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl">
        <CldImage
          photo={hero}
          width={2000}
          height={1125}
          crop="fill"
          gravity="auto"
          priority
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="w-full"
        />
        <FrameCaption city={hero.city} className="mt-3" />
      </section>

      {/* Sample frames */}
      <section className="mx-auto max-w-7xl pt-section">
        <h2 className="text-h2">Frames from this look</h2>
        <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
          {sampleFrames.slice(1).map((photo, i) => (
            <li key={photo.publicId}>
              <CldImage
                photo={photo}
                width={800}
                height={1000}
                crop="fill"
                gravity="auto"
                sizes="(min-width: 768px) 33vw, 50vw"
                className="w-full"
              />
              <FrameCaption
                frame={`FR-${String(i + 1).padStart(3, "0")}`}
                city={photo.city}
                recipe={photo.recipe}
                className="mt-3"
              />
            </li>
          ))}
        </ul>
      </section>

      {/* The gate */}
      <section className="mx-auto max-w-7xl pt-section">
        <div className="max-w-2xl border-t border-line pt-12">
          <h2 className="text-h2">Get the recipe</h2>
          <p className="mt-4 max-w-prose text-ink-muted">
            Leave your email and the full settings open right here — both
            versions. You&apos;ll also get an occasional note from me, one
            email a month at most. Unsubscribe anytime.
          </p>
          <div className="mt-8">
            <NewsletterForm
              source="recipes"
              buttonLabel="Send me the recipe"
              successTitle="It's yours."
              successBody="The full settings are on the next page. I'll also drop you a note when something new is up — unsubscribe anytime."
              successHref="/downloads/vanilla-summer"
              successLinkLabel="Open the Vanilla Summer settings"
            />
          </div>
        </div>
      </section>

      {/* Paid recipes — only render once the owner configures them in Stripe */}
      {paidRecipes.length > 0 && (
        <section className="mx-auto max-w-7xl pt-section">
          <h2 className="text-h2">More recipes</h2>
          <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3">
            {paidRecipes.map((product) => (
              <li key={product.slug}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* What's inside */}
      <section className="mx-auto max-w-7xl pt-section">
        <h2 className="text-h2">What you get</h2>
        <ul className="mt-6 max-w-prose space-y-3 text-ink-muted">
          <li>
            The X-mount version — for X100V, X-Pro3, and the X-T / X-S series.
          </li>
          <li>The GFX version — for GFX100RF and the GFX 50–100 bodies.</li>
          <li>A short note on loading it, per system.</li>
        </ul>
        <p className="mt-10 max-w-prose text-sm text-ink-muted">
          Vanilla Summer is the first of a small set I&apos;m putting together
          — the rest will live here when they&apos;re ready.
        </p>
      </section>
    </div>
  );
}
