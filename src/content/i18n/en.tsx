import Link from "next/link";
import { InstagramLink } from "@/components/instagram-link";
import { siteConfig } from "@/lib/siteConfig";
import type { Dictionary } from "./dictionary";

/**
 * English, the primary language. These strings are the ones that shipped
 * before the mirror existed; the shared page components read them through
 * getDictionary("en"), so the English HTML is unchanged.
 */
export const en: Dictionary = {
  locale: "en",

  site: {
    title: "Carel Maeda: Fujifilm Recipes and Travel Photography",
    description:
      "Free Fujifilm recipes as downloadable cards with every setting, travel photography city by city, and notes on shooting JPG straight out of camera. São Paulo made, Toronto based.",
    keywords: [
      "Fujifilm recipes",
      "Fujifilm film simulation recipes",
      "Fujifilm travel photography",
      "travel photography",
      "JPG straight out of camera",
      "Carel Maeda",
    ],
  },

  skipToContent: "Skip to content",

  nav: {
    labels: {
      home: "Home",
      recipes: "Recipes",
      gallery: "Gallery",
      prints: "Prints",
      downloads: "Downloads",
      blog: "Blog",
      about: "About",
    },
    logoHome: `${siteConfig.name} — home`,
    main: "Main",
    mobile: "Mobile",
    menu: "Menu",
    openMenu: "Open menu",
    language: "Language",
    codes: { en: "EN", "pt-br": "PT" },
    names: { en: "English", "pt-br": "Português" },
  },

  breadcrumbs: { home: "Home", recipes: "Recipes", blog: "Blog" },

  person: {
    jobTitle: "Travel photographer",
    description:
      "Travel photographer shooting Fujifilm, JPG straight out of camera. Publishes free Fujifilm recipes as downloadable cards.",
    knowsAbout: [
      "Fujifilm film simulation recipes",
      "Travel photography",
      "Fujifilm X100V",
      "Fujifilm GFX100RF",
      "JPEG photography",
    ],
    homeLocation: "Toronto, Canada",
    birthPlace: "São Paulo, Brazil",
  },

  home: {
    h1: "Carel Maeda. Travel photography on Fujifilm.",
    keywords: [
      "free Fujifilm recipes",
      "Fujifilm X100V recipes",
      "Fujifilm GFX100RF photos",
      "travel photographer Toronto",
    ],
  },

  about: {
    title: "About: Fujifilm Travel Photographer in Toronto",
    description:
      "São Paulo made, Toronto based. Why I shoot Fujifilm JPG only with no editing, why one prime is enough, and the gear I carry: GFX100RF, X100V, X-Pro3, Leica M5.",
    keywords: [
      "Carel Maeda photographer",
      "travel photographer Toronto",
      "Fujifilm photographer",
      "GFX100RF",
      "X100V",
    ],
    heading: "About",
    /*
     * TODO (owner): this story is a first draft in your voice — read it, correct
     * the details, make it yours. Also: add a portrait photo publicId when you
     * have one you like.
     */
    intro: (
      <>
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
      </>
    ),
    gearHeading: "What I carry",
    gearIntro:
      "A short list on purpose. Every item earned its place by being the thing I actually reach for — usually one at a time.",
    gearCategories: {
      Cameras: "Cameras",
      Lenses: "Lenses",
      "Film & Accessories": "Film & Accessories",
      "Bags & Straps": "Bags & Straps",
    },
    gearNote:
      "Nothing here is sponsored and there are no affiliate links right now. If that ever changes, it'll say so plainly here.",
    contact: (
      <p className="text-ink-soft">
        Questions about a recipe, a place, a print — or press and
        collaborations? The fastest way to reach me is a DM on{" "}
        <InstagramLink />. I read everything.
      </p>
    ),
  },

  recipes: {
    title: "Free Fujifilm Recipes to Download",
    description: (recipes) =>
      `Free Fujifilm film simulation recipes for X-Trans IV and V bodies: ${recipes
        .map((recipe) => `${recipe.name} on ${recipe.filmSimulation}`)
        .join(", ")}. Every setting on a free card you download, no email asked.`,
    keywords: [
      "free Fujifilm recipes",
      "Fujifilm X-Trans IV recipes",
      "Fujifilm X-Trans V recipes",
      "X100V film simulation recipes",
      "Fujifilm JPEG settings",
      "Fujifilm Lightroom presets",
    ],
    listName: "Fujifilm recipes",
    eyebrow: "Fujifilm recipe",
    heading: "Fujifilm recipes",
    intro:
      "The in-camera looks behind my photos. Each one is a free card with every setting on it. Download it, save it to a custom slot, go shoot.",
    view: "View the recipe",
    presetsHeading: "Lightroom presets",
    presetsIntro:
      "I shoot JPG and build the look in camera. If you shoot RAW and edit, these presets give you the same looks in Lightroom. Free downloads, no email needed.",
    newsletterHeading: "When the next recipe lands",
    newsletterIntro:
      "I send one email a month, mostly photos, plus new recipes when they are ready. Unsubscribe anytime.",
  },

  downloadCounts: {
    count: (formatted) => `${formatted} downloads`,
    mostDownloaded: "Most downloaded",
  },

  recipePage: {
    title: (recipe) => `${recipe.name}: ${recipe.filmSimulation} Fujifilm Recipe`,
    description: (recipe) =>
      `Free Fujifilm recipe: ${recipe.name}, a ${recipe.filmSimulation} look for ${recipe.compatibility} bodies. Every setting on a free card you download. ${recipe.tagline}`,
    keywords: (recipe) => [
      `${recipe.name} Fujifilm recipe`,
      `${recipe.filmSimulation} recipe`,
      `Fujifilm ${recipe.filmSimulation} recipe`,
      "X-Trans IV recipes",
      "X-Trans V recipes",
      "X100V recipes",
      "Fujifilm JPEG settings",
    ],
    headline: (recipe) => `${recipe.name}: a ${recipe.filmSimulation} Fujifilm recipe`,
    aboutName: "Fujifilm film simulation recipes",
    ldKeywords: (recipe) =>
      `${recipe.name}, ${recipe.filmSimulation}, ${recipe.compatibility}, Fujifilm recipe`,
    eyebrow: "Fujifilm Recipe",
    heading: (recipe) => recipe.name,
    by: "by",
    download: "Download the recipe card",
    panelEyebrow: "Recipe card",
    panelFormat: "PNG · 1080 × 1350 · for your phone",
    specFree: "Free. No email asked.",
    specPhone: "Save it to your phone, set the camera from it",
    frames: (count) => `${count} frames`,
    scrollHint: "Scroll",
    loadingHeading: "Loading it",
    loading1:
      "Save it as a custom slot (C1–C7). Then you switch into the look without touching the menus again.",
    loading2:
      "Then stop thinking about it. The whole point is that the camera does the work and you watch the light.",
    wroteAbout: "I wrote about why the settings are what they are:",
    moreRecipes: "More recipes",
    shotOn: (recipe) => `Shot on ${recipe.name}`,
    lightroomHeading: "The Lightroom version",
    lightroomIntro:
      "I shoot JPG, so the look above lives in the camera. If you shoot RAW and edit, these presets get you the same feel in Lightroom. Free downloads.",
    newsletterHeading: "If you want the next one",
    newsletterIntro:
      "I send one email a month, mostly photos, plus new recipes when they are ready. Unsubscribe anytime.",
  },

  blog: {
    title: "Fujifilm Recipes and Travel Photography Blog",
    description:
      "Plain-English guides to Fujifilm recipes and film simulations, shooting JPG with no editing, and travel photography on the X100V and GFX100RF.",
    keywords: [
      "Fujifilm recipes explained",
      "Fujifilm film simulations guide",
      "shooting JPEG only",
      "travel photography blog",
    ],
    listName: "Blog",
    heading: "Blog",
    intro: "Things I've figured out, written down properly. No filler.",
    categories: {
      "recipe-guide": "Recipes",
      "city-guide": "City guides",
      craft: "Craft",
    },
  },

  related: {
    heading: "Keep going",
    album: (title) => `The ${title} album`,
    recipe: "Vanilla Summer — the recipe",
    about: "What I carry",
  },

  notFound: {
    title: "Not found",
    eyebrow: "FR-404 · Not found",
    heading: "This frame doesn't exist.",
    body: "The page you're after isn't here. The photographs are, though.",
    back: "← Back to the start",
  },

  codeBlock: { copy: "Copy", copyAria: "Copy code", copied: "Copied" },
};
