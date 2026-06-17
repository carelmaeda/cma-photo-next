import type { GearItem } from "@/lib/types";

/**
 * The honest list — no affiliate links yet (free-first rule, SPEC.md §1).
 * When the affiliate phase comes, links get added here with rel="sponsored nofollow".
 * TODO (owner): blurbs are drafts — make them yours.
 */
export const gear: GearItem[] = [
  {
    name: "Fujifilm GFX100RF",
    category: "Cameras",
    blurb:
      "The trip camera. Medium format in a body I'll actually carry all day.",
  },
  {
    name: "Fujifilm X100V",
    category: "Cameras",
    blurb:
      "The daily driver. Fixed 23mm, lives in my hand around Toronto. If I could keep one camera, it's this.",
  },
  {
    name: "Fujifilm X-Pro3",
    category: "Cameras",
    blurb:
      "The rangefinder feel, digital. The hidden screen keeps me honest — compose, shoot, move on.",
  },
  {
    name: "Leica M5",
    category: "Cameras",
    blurb:
      "35mm film, fully manual. When I want to slow all the way down and wait two weeks to see if I got it.",
  },
  {
    name: "Fujifilm XF 35mm f/1.4",
    category: "Lenses",
    blurb:
      "Glued to the X-Pro3 for years. Old design, slow motor, draws like nothing else in the lineup.",
  },
  {
    name: "Kodak Portra 160",
    category: "Film & Accessories",
    blurb:
      "The film the M5 eats. Soft, warm, forgiving — the palette half my digital look is chasing.",
  },
];

export const gearCategories = [
  "Cameras",
  "Lenses",
  "Film & Accessories",
  "Bags & Straps",
] as const;
