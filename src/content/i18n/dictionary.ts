import type { ReactNode } from "react";
import type { Locale } from "@/lib/locale-path";
import type { GearCategory, GuideFrontmatter, Recipe } from "@/lib/types";

/**
 * Every user-facing string of the mirrored pages (SPEC §5 Languages), typed
 * once so en.tsx and pt-br.tsx must stay in step. Prose with inline links is a
 * ReactNode; anything that depends on data is a function.
 *
 * Fujifilm setting labels and values are not here on purpose: they stay in
 * English in both languages (owner decision, November 12, 2026).
 */
export interface Dictionary {
  locale: Locale;

  site: {
    title: string;
    description: string;
    /** Core queries the whole site targets; pages prepend their own. */
    keywords: string[];
  };

  skipToContent: string;

  nav: {
    labels: Record<
      "home" | "recipes" | "gallery" | "prints" | "downloads" | "blog" | "about",
      string
    >;
    /** aria-label of the logo link. */
    logoHome: string;
    /** aria-label of the desktop nav. */
    main: string;
    /** aria-label of the mobile nav. */
    mobile: string;
    /** Sheet title. */
    menu: string;
    /** aria-label of the menu button. */
    openMenu: string;
    /** Header language menu: aria-label, short codes, and each language's name in its own language. */
    language: string;
    codes: Record<Locale, string>;
    names: Record<Locale, string>;
  };

  breadcrumbs: { home: string; recipes: string; blog: string };

  person: {
    jobTitle: string;
    description: string;
    knowsAbout: string[];
    homeLocation: string;
    birthPlace: string;
  };

  home: { h1: string; keywords: string[] };

  about: {
    title: string;
    description: string;
    keywords: string[];
    heading: string;
    intro: ReactNode;
    gearHeading: string;
    gearIntro: string;
    gearCategories: Record<GearCategory, string>;
    gearNote: string;
    contact: ReactNode;
  };

  recipes: {
    title: string;
    description: (recipes: Recipe[]) => string;
    keywords: string[];
    /** JSON-LD ItemList name. */
    listName: string;
    eyebrow: string;
    heading: string;
    intro: string;
    /** The row link label on the index: "View the recipe". */
    view: string;
    presetsHeading: string;
    presetsIntro: string;
    newsletterHeading: string;
    newsletterIntro: string;
  };

  /** Download counters on recipes and presets (src/components/download-count.tsx). */
  downloadCounts: {
    /** Badge, gets the rounded number, e.g. "1,200+". */
    count: (formatted: string) => string;
    mostDownloaded: string;
  };

  recipePage: {
    title: (recipe: Recipe) => string;
    description: (recipe: Recipe) => string;
    keywords: (recipe: Recipe) => string[];
    /** JSON-LD TechArticle fields. */
    headline: (recipe: Recipe) => string;
    aboutName: string;
    ldKeywords: (recipe: Recipe) => string;
    eyebrow: string;
    heading: (recipe: Recipe) => string;
    by: string;
    download: string;
    /** Card panel: label, format line, the three facts above the button. */
    panelEyebrow: string;
    panelFormat: string;
    specFree: string;
    specPhone: string;
    /** Contact-sheet strip scroll hint. */
    scrollHint: string;
    loadingHeading: string;
    loading1: string;
    loading2: string;
    wroteAbout: string;
    moreRecipes: string;
    shotOn: (recipe: Recipe) => string;
    lightroomHeading: string;
    lightroomIntro: string;
    newsletterHeading: string;
    newsletterIntro: string;
  };

  blog: {
    title: string;
    description: string;
    keywords: string[];
    listName: string;
    heading: string;
    intro: string;
    categories: Record<GuideFrontmatter["category"], string>;
  };

  related: {
    heading: string;
    album: (title: string) => string;
    recipe: string;
    about: string;
  };

  notFound: {
    title: string;
    eyebrow: string;
    heading: string;
    body: string;
    back: string;
  };

  codeBlock: { copy: string; copyAria: string; copied: string };
}
