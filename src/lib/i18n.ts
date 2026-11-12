import type { Dictionary } from "@/content/i18n/dictionary";
import { en } from "@/content/i18n/en";
import { ptBr } from "@/content/i18n/pt-br";
import type { GearItem, Recipe } from "@/lib/types";
import { dateLocale, type Locale } from "@/lib/locale-path";

export {
  counterpartPath,
  dateLocale,
  defaultLocale,
  htmlLang,
  localeOf,
  localePath,
  locales,
  ogLocale,
  otherLocale,
  type Locale,
} from "@/lib/locale-path";

/**
 * Languages (SPEC §5): English at the root, Brazilian Portuguese under
 * /pt-br. Every user-facing string comes from one typed dictionary per
 * locale so the two trees cannot drift in shape. Server components read the
 * dictionary; client leaves get their strings as props.
 */
const dictionaries: Record<Locale, Dictionary> = { en, "pt-br": ptBr };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Long date, e.g. "June 11, 2026" / "11 de junho de 2026". */
export function formatDate(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleDateString(dateLocale[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Per-locale content fields that live beside the English ones. */
export function recipeTagline(recipe: Recipe, locale: Locale): string {
  return locale === "en" ? recipe.tagline : recipe.taglinePt;
}

export function gearBlurb(item: GearItem, locale: Locale): string {
  return locale === "en" ? item.blurb : item.blurbPt;
}
