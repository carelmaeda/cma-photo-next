import type { Photo, PresetFile, Recipe } from "@/lib/types";

/**
 * Free recipes, published open on /recipes (SPEC §10 launch-light).
 * Values mirror the published recipe card exactly. NEVER invent settings —
 * if a value isn't on the card, it doesn't belong here.
 */

/**
 * Sample frames from the Vanilla Summer look. Also used as store product
 * imagery while the store is parked.
 * TODO (owner): replace with frames actually shot on Vanilla Summer and add
 * recipe: "Vanilla Summer" to each — captions stay honest until then.
 */
export const sampleFrames: Photo[] = [
  {
    publicId: "Europe/Portugal/Lisbon/lisbon-5_j77t5t",
    alt: "Afternoon sun on the yellow arcades of Praça do Comércio, Lisbon, Portugal",
    city: "Lisbon",
  },
  {
    publicId: "Europe/Portugal/Lisbon/lisbon-3_lr79bv",
    alt: "The Tagus and the 25 de Abril bridge from the Lisbon waterfront",
    city: "Lisbon",
  },
  {
    publicId: "Europe/Portugal/Lisbon/lisbon-1_tchctr",
    alt: "Pale facade with iron balconies in Lisbon, Portugal",
    city: "Lisbon",
  },
  {
    publicId: "Europe/France/Paris/paris-1_vglmfg",
    alt: "The Eiffel Tower from the Trocadéro, Paris, in morning light",
    city: "Paris",
  },
  {
    publicId: "Africa/Casablanca/casablanca-1_ebrapt",
    alt: "Zellige tilework on a carved doorway in Casablanca, Morocco",
    city: "Casablanca",
  },
  {
    publicId: "Central America/Punta Cana/punta-cana-1_q6pkgn",
    alt: "Palm trees against a blue sky in Punta Cana, Dominican Republic",
    city: "Punta Cana",
  },
];

export const recipes: Recipe[] = [
  {
    slug: "vanilla-summer",
    name: "Vanilla Summer",
    tagline: "Warm shadows, soft highlights, that 4pm-light feeling.",
    filmSimulation: "Classic Chrome",
    compatibility: "X-Trans IV / V",
    // Values are taken straight from the Vanilla Summer recipe card.
    settings: [
      { label: "Film Simulation", value: "Classic Chrome" },
      { label: "White Balance", value: "6300K" },
      { label: "WB Shift", value: "R +2 · B −5" },
      { label: "Dynamic Range Priority", value: "Weak" },
      { label: "Grain Effect", value: "Weak · Small" },
      { label: "Color Chrome Effect", value: "Weak" },
      { label: "Color Chrome FX Blue", value: "Strong" },
      { label: "Noise Reduction", value: "−4" },
      { label: "Color", value: "0" },
      { label: "Sharpening", value: "0" },
      { label: "Clarity", value: "0" },
      { label: "ISO", value: "Auto · max 6400" },
      { label: "Exposure Compensation", value: "+1/3 to +2/3" },
    ],
    sampleFrames,
    guideSlug: "vanilla-summer-recipe-explained",
  },
  {
    slug: "midnight-espresso",
    name: "Midnight Espresso",
    tagline: "Wet pavement, deep blacks and silver grain. My Ilford HP5 look in Acros.",
    filmSimulation: "Acros +Ye",
    compatibility: "X-Trans IV / V",
    // Values are taken straight from the Midnight Espresso recipe card.
    settings: [
      { label: "Film Simulation", value: "Acros +Ye" },
      { label: "White Balance", value: "5500K" },
      { label: "WB Shift", value: "R +2 · B −2" },
      { label: "Dynamic Range", value: "DR400" },
      { label: "Highlight", value: "+1" },
      { label: "Shadow", value: "+2" },
      { label: "Grain Effect", value: "Strong · Large" },
      { label: "Noise Reduction", value: "−4" },
      { label: "Monochromatic Color", value: "WC +2" },
      { label: "Sharpening", value: "−1" },
      { label: "Clarity", value: "+2" },
      { label: "ISO", value: "Auto · max 6400" },
      { label: "Exposure Compensation", value: "+1/3 to +2/3" },
    ],
    // TODO (owner): add 2-3 Cloudinary publicIds of frames shot on Midnight
    // Espresso (Acros). Every existing frame is colour, so the card and the
    // "Shot on" section stay photo-less rather than showing the wrong look.
    sampleFrames: [],
  },
];

export function getRecipe(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
}

/**
 * Free Lightroom presets — the editing counterpart to the in-camera recipes.
 * Files live in public/presets/ (plain static downloads, not Cloudinary —
 * they're .xmp/.dng profile files, not photos). Sections render only when
 * this array has entries, so an empty list never shows a "coming soon".
 *
 * TODO (owner): drop the preset files into public/presets/ and add one entry
 * per file, e.g.:
 *   {
 *     name: "Vanilla Summer — Lightroom preset",
 *     description: "The Vanilla Summer look for RAW shooters, as a Lightroom preset.",
 *     file: "/presets/vanilla-summer.xmp",
 *   }
 */
export const presets: PresetFile[] = [];
