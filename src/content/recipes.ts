import type { Photo, PresetFile, Recipe } from "@/lib/types";

/**
 * Free recipes, published open on /recipes (SPEC §10 launch-light).
 * Values mirror the published recipe card exactly. NEVER invent settings —
 * if a value isn't on the card, it doesn't belong here.
 */

/**
 * Placeholder frames, kept only as store product imagery while the store is
 * parked. Not shot on the recipe.
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

/**
 * Frames shot on Vanilla Summer, from the Cloudinary folder "Vanilla Summer"
 * (added November 13, 2026). Shown as the teaser row on the recipe page.
 */
const vanillaSummerFrames: Photo[] = [
  {
    publicId: "Vanilla Summer/vanilla-summer_1_nrtziu",
    alt: "The Belvedere palace behind clipped trees and lawns in warm afternoon light, Vienna",
    city: "Vienna",
    recipe: "Vanilla Summer",
    width: 2667,
    height: 4000,
  },
  {
    publicId: "Vanilla Summer/vanilla-summer_2_o8m0ua",
    alt: "The church spire of Hallstatt above the lake, mountains rising behind in haze",
    city: "Hallstatt",
    recipe: "Vanilla Summer",
    width: 2667,
    height: 4000,
  },
  {
    publicId: "Vanilla Summer/vanilla-summer_3_xjwity",
    alt: "Red striped awnings of a corner café on a sunny Paris street, tables full",
    city: "Paris",
    recipe: "Vanilla Summer",
    width: 3000,
    height: 4000,
  },
  {
    publicId: "Vanilla Summer/vanilla-summer_4_kffojx",
    alt: "A tabby cat looking up from sunlit cobblestones in Pérouges, France",
    city: "Pérouges",
    recipe: "Vanilla Summer",
    width: 3000,
    height: 4000,
  },
  {
    publicId: "Vanilla Summer/vanilla-summer_5_ch6kok",
    alt: "A sandstone Victorian facade in Old Montreal, framed by big green leaves",
    city: "Montreal",
    recipe: "Vanilla Summer",
    width: 3000,
    height: 4000,
  },
  {
    publicId: "Vanilla Summer/vanilla-summer_6_w8vip5",
    alt: "Blue bowls of ripe red tomatoes on a market stall",
    recipe: "Vanilla Summer",
    width: 3000,
    height: 4000,
  },
  {
    publicId: "Vanilla Summer/vanilla-summer_7_mr82gx",
    alt: "A dog crossing a cobbled street past a pink wall and blue tiled house in Olinda, Brazil",
    city: "Olinda",
    recipe: "Vanilla Summer",
    width: 3000,
    height: 4000,
  },
];

export const recipes: Recipe[] = [
  {
    slug: "vanilla-summer",
    name: "Vanilla Summer",
    tagline: "Warm shadows, soft highlights, that 4pm-light feeling.",
    taglinePt: "Sombras quentes, altas luzes suaves, aquela sensação de luz das quatro da tarde.",
    filmSimulation: "PRO Neg. Hi",
    compatibility: "X-Trans IV / V",
    // Values are taken straight from the Vanilla Summer recipe card.
    settings: [
      { label: "Film Simulation", value: "PRO Neg. Hi" },
      { label: "Dynamic Range", value: "DR400" },
      { label: "D-Range Priority", value: "Off" },
      { label: "Grain Effect", value: "Weak · Small" },
      { label: "Color Chrome Effect", value: "Weak" },
      { label: "Color Chrome FX Blue", value: "Strong" },
      { label: "White Balance", value: "7500K" },
      { label: "WB Shift", value: "R +2 · B −2" },
      { label: "Highlight", value: "−1" },
      { label: "Shadow", value: "−1" },
      { label: "Color", value: "0" },
      { label: "Sharpening", value: "0" },
      { label: "Noise Reduction", value: "−4" },
      { label: "Clarity", value: "0" },
      { label: "Smooth Skin Effect", value: "Off" },
      { label: "ISO", value: "Auto · 640 to 6400" },
      { label: "Exposure Compensation", value: "+1/3 to +2/3" },
    ],
    coverTone: "brick",
    thumbScene: "summer",
    sampleFrames: vanillaSummerFrames,
    guideSlug: "vanilla-summer-recipe-explained",
  },
  {
    slug: "midnight-espresso",
    name: "Midnight Espresso",
    tagline: "Wet pavement, deep blacks and silver grain. My Ilford HP5 look in Acros.",
    taglinePt: "Asfalto molhado, pretos profundos e grão prateado. Meu visual Ilford HP5 em Acros.",
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
    coverTone: "ink",
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
