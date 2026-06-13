import type { Photo } from "@/lib/types";

/**
 * Vanilla Summer — the free recipe. A Classic Chrome look for X-Trans IV / V
 * bodies. Values mirror the published recipe card exactly. NEVER invent
 * settings — if a value isn't on the card, it doesn't belong here.
 */

export interface RecipeSetting {
  label: string;
  /** The value to dial in (X-Trans IV / V bodies). */
  value: string;
}

export const vanillaSummer = {
  name: "Vanilla Summer",
  tagline: "Warm shadows, soft highlights, that 4pm-light feeling.",
  /** The look this recipe is built on. */
  filmSimulation: "Classic Chrome",
  /** Bodies the recipe targets — matches the recipe card. */
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
  ] satisfies RecipeSetting[],
};

/**
 * Sample frames shown on /recipes.
 * TODO (owner): replace with frames actually shot on Vanilla Summer and add
 * recipe: "Vanilla Summer" to each — captions stay honest until then.
 */
export const sampleFrames: Photo[] = [
  {
    publicId: "Europe/Portugal/Braga/_DSF5843_fjmaju",
    alt: "Warm afternoon light in Braga, Portugal",
    city: "Braga",
  },
  {
    publicId: "Europe/Portugal/Braga/_DSF5631_thcn3s",
    alt: "Quiet street in Braga, Portugal",
    city: "Braga",
  },
  {
    publicId: "Europe/Netherlands/Amsterdam/DSCF5199_mnuy5h",
    alt: "Canal houses in Amsterdam, Netherlands",
    city: "Amsterdam",
  },
  {
    publicId: "Europe/Netherlands/Amsterdam/_DSF4918_edr9qv",
    alt: "Morning light in Amsterdam, Netherlands",
    city: "Amsterdam",
  },
  {
    publicId: "Europe/Austria/Vienna/we18qdnfbdcfbbvsnqv1",
    alt: "City view in Vienna, Austria",
    city: "Vienna",
  },
  {
    publicId: "Europe/England/London/_DSF3975_oqi79t",
    alt: "Street scene in London, United Kingdom",
    city: "London",
  },
];
