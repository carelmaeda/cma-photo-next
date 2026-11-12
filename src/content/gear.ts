import type { GearItem } from "@/lib/types";

/**
 * The honest list — no affiliate links yet (free-first rule, SPEC.md §1).
 * When the affiliate phase comes, links get added here with rel="sponsored nofollow".
 * TODO (owner): blurbs are drafts in both languages — make them yours.
 */
export const gear: GearItem[] = [
  {
    name: "Fujifilm GFX100RF",
    category: "Cameras",
    blurb:
      "The trip camera. Medium format in a body I'll actually carry all day.",
    blurbPt:
      "A câmera de viagem. Médio formato num corpo que eu realmente carrego o dia inteiro.",
  },
  {
    name: "Fujifilm X100V",
    category: "Cameras",
    blurb:
      "The daily driver. Fixed 23mm, lives in my hand around Toronto. If I could keep one camera, it's this.",
    blurbPt:
      "A do dia a dia. 23mm fixa, vive na minha mão por Toronto. Se eu pudesse ficar com uma câmera só, seria esta.",
  },
  {
    name: "Fujifilm X-Pro3",
    category: "Cameras",
    blurb:
      "The rangefinder feel, digital. The hidden screen keeps me honest — compose, shoot, move on.",
    blurbPt:
      "A sensação de rangefinder, em digital. A tela escondida me mantém honesto: enquadro, fotografo, sigo em frente.",
  },
  {
    name: "Leica M5",
    category: "Cameras",
    blurb:
      "35mm film, fully manual. When I want to slow all the way down and wait two weeks to see if I got it.",
    blurbPt:
      "Filme 35mm, totalmente manual. Para quando quero desacelerar de vez e esperar duas semanas para saber se acertei.",
  },
  {
    name: "Fujifilm XF 35mm f/1.4",
    category: "Lenses",
    blurb:
      "Glued to the X-Pro3 for years. Old design, slow motor, draws like nothing else in the lineup.",
    blurbPt:
      "Colada na X-Pro3 há anos. Projeto antigo, motor lento, desenha como nenhuma outra da linha.",
  },
  {
    name: "Kodak Portra 160",
    category: "Film & Accessories",
    blurb:
      "The film the M5 eats. Soft, warm, forgiving — the palette half my digital look is chasing.",
    blurbPt:
      "O filme que a M5 come. Suave, quente, tolerante: a paleta que metade do meu visual digital persegue.",
  },
];

export const gearCategories = [
  "Cameras",
  "Lenses",
  "Film & Accessories",
  "Bags & Straps",
] as const;
