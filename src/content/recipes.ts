import type { Photo } from "@/lib/types";

/**
 * Vanilla Summer — the free recipe. Names and structure only;
 * every setting value is a TODO for the owner. NEVER invent settings.
 */

export interface RecipeSetting {
  label: string;
  /** X-mount value (X100V / X-Pro3 / X-T / X-S) */
  xMount: string;
  /** GFX value (GFX100RF / GFX50–100) */
  gfx: string;
}

export const vanillaSummer = {
  name: "Vanilla Summer",
  tagline: "Warm shadows, soft highlights, that 4pm-light feeling.",
  // TODO (owner): fill in the real values. The table renders whatever is here.
  settings: [
    { label: "Film Simulation", xMount: "TODO", gfx: "TODO" },
    { label: "Grain Effect", xMount: "TODO", gfx: "TODO" },
    { label: "Color Chrome Effect", xMount: "TODO", gfx: "TODO" },
    { label: "Color Chrome FX Blue", xMount: "TODO", gfx: "TODO" },
    { label: "White Balance", xMount: "TODO", gfx: "TODO" },
    { label: "WB Shift", xMount: "TODO", gfx: "TODO" },
    { label: "Dynamic Range", xMount: "TODO", gfx: "TODO" },
    { label: "Highlight", xMount: "TODO", gfx: "TODO" },
    { label: "Shadow", xMount: "TODO", gfx: "TODO" },
    { label: "Color", xMount: "TODO", gfx: "TODO" },
    { label: "Sharpness", xMount: "TODO", gfx: "TODO" },
    { label: "Noise Reduction", xMount: "TODO", gfx: "TODO" },
    { label: "Clarity", xMount: "TODO", gfx: "TODO" },
    { label: "Exposure Compensation", xMount: "TODO", gfx: "TODO" },
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
