import { recipes } from "@/content/recipes";
import type { Recipe } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RecipeCoverProps {
  recipe: Recipe;
  /**
   * card = 4:5 grid tile, wide = 16:10 post hero, thumb = 64px square.
   * A recipe with a thumbScene draws that scene at every size.
   */
  variant?: "card" | "wide" | "thumb";
  className?: string;
}

/** Palette per tone, as SVG fill utilities (tokens only). */
const tones = {
  brick: {
    bg: "fill-paper",
    band: "fill-brick",
    stripe: "fill-indigo",
    text: "fill-ink",
  },
  ink: {
    bg: "fill-ink",
    band: "fill-indigo",
    stripe: "fill-paper",
    text: "fill-paper",
  },
} as const;

const H = 500;

export type SummerTone = "sky" | "sun" | "sea" | "sand" | "paper";

const summerFill: Record<SummerTone, string> = {
  sky: "fill-summer-sky",
  sun: "fill-summer-sun",
  sea: "fill-summer-sea",
  sand: "fill-summer-sand",
  paper: "fill-paper",
};

/**
 * Low sun over shallow water and sand: the 4pm light Vanilla Summer is for.
 * 100x100 viewBox. Plain data so the page (token classes) and the PNG card
 * (svg string, hex fills) draw the same scene.
 */
export const summerScene: {
  tag: "rect" | "circle" | "path";
  tone: SummerTone;
  attrs: Record<string, string>;
}[] = [
  { tag: "rect", tone: "sky", attrs: { width: "100", height: "100" } },
  { tag: "circle", tone: "sun", attrs: { cx: "62", cy: "54", r: "20" } },
  { tag: "rect", tone: "sea", attrs: { y: "56", width: "100", height: "44" } },
  // Sun glints on the water
  { tag: "rect", tone: "sun", attrs: { x: "48", y: "61", width: "28", height: "2.5", rx: "1.25" } },
  { tag: "rect", tone: "sun", attrs: { x: "53", y: "67", width: "18", height: "2.5", rx: "1.25" } },
  { tag: "rect", tone: "sun", attrs: { x: "57", y: "73", width: "10", height: "2.5", rx: "1.25" } },
  { tag: "rect", tone: "paper", attrs: { x: "14", y: "66", width: "16", height: "2", rx: "1" } },
  { tag: "path", tone: "sand", attrs: { d: "M0 84 Q 30 76 60 82 T 100 80 V 100 H 0 Z" } },
];

const setting = (recipe: Recipe, label: string) =>
  recipe.settings.find((s) => s.label === label)?.value;

/** DX-code style bars, derived from the name so each recipe gets its own. */
function barcode(name: string) {
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (let i = 0; i < 14; i++) {
    const w = 2 + (name.charCodeAt(i % name.length) % 3) * 2;
    bars.push({ x, w });
    x += w + 3;
  }
  return bars;
}

/**
 * Typographic cover for a recipe, drawn like the end of a film box: sprocket
 * edge, diagonal colour bands, a big speed number, DX-style bars. Every value
 * on it comes from the recipe's own settings. Used wherever a recipe needs an
 * image until there are frames actually shot on it, so no random photo
 * pretends to be the look.
 */
export function RecipeCover({ recipe, variant = "card", className }: RecipeCoverProps) {
  const t = tones[recipe.coverTone];

  if (recipe.thumbScene === "summer") {
    const shapes = summerScene.map(({ tag: Tag, tone, attrs }, i) => (
      <Tag key={i} {...attrs} className={summerFill[tone]} />
    ));
    if (variant === "thumb") {
      return (
        <svg aria-hidden viewBox="0 0 100 100" className={cn("size-16 shrink-0", className)}>
          {shapes}
        </svg>
      );
    }
    // Crop the square scene to the box: 4:5 trims the sides, 16:10 trims the
    // top of the sky. The sun stays whole in both.
    return (
      <svg
        role="img"
        aria-label={`${recipe.name}, a Fujifilm recipe on ${recipe.filmSimulation}`}
        viewBox={variant === "wide" ? "0 34 100 62.5" : "10 0 80 100"}
        className={cn("block h-auto w-full border border-line", className)}
      >
        {shapes}
      </svg>
    );
  }

  if (variant === "thumb") {
    const initials = recipe.name
      .split(" ")
      .map((word) => word[0])
      .join("");
    return (
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className={cn("size-16 shrink-0", className)}
      >
        <rect width="100" height="100" className={t.bg} />
        <polygon points="0,78 100,48 100,70 0,100" className={t.band} />
        <polygon points="0,104 100,74 100,79 0,109" className={t.stripe} />
        <text x="10" y="44" className={cn("font-display font-bold", t.text)} fontSize="38">
          {initials}
        </text>
      </svg>
    );
  }

  const W = variant === "wide" ? 800 : 400;
  const number = recipes.indexOf(recipe) + 1;
  const dr = setting(recipe, "Dynamic Range")?.replace("DR", "");
  const wb = setting(recipe, "White Balance");
  const exp = setting(recipe, "Exposure Compensation");
  const [first, ...rest] = recipe.name.split(" ");
  const bars = barcode(recipe.name);
  const angle = (Math.atan(100 / W) * 180) / Math.PI;
  const numberX = W - 28;
  // Band centre line at numberX, plus half the numeral's cap height.
  const numberY = 370 - (numberX / W) * 100 + 26;

  return (
    <svg
      role="img"
      aria-label={`${recipe.name}, a Fujifilm recipe on ${recipe.filmSimulation}`}
      viewBox={`0 0 ${W} ${H}`}
      className={cn("block h-auto w-full border border-line", className)}
    >
      <rect width={W} height={H} className={t.bg} />

      {/* Sprocket edge */}
      <rect width={W} height="34" className="fill-ink" />
      {Array.from({ length: Math.floor(W / 24) }, (_, i) => (
        <rect key={i} x={i * 24 + 8} y="10" width="12" height="14" rx="2" className="fill-paper" />
      ))}

      {/* Maker line */}
      <text x="24" y="66" className={cn("font-mono tracking-frame uppercase", t.text)} fontSize="12">
        Carel Maeda · Recipe Nº {String(number).padStart(2, "0")}
      </text>

      {/* Name */}
      <text x="22" y="124" className={cn("font-display font-bold", t.text)} fontSize="52">
        {first}
      </text>
      <text x="22" y="176" className={cn("font-display font-bold", t.text)} fontSize="52">
        {rest.join(" ")}
      </text>

      {/* Diagonal bands: both rise 100 units across the full width */}
      <polygon points={`0,330 ${W},230 ${W},310 0,410`} className={t.band} />
      <polygon points={`0,424 ${W},324 ${W},338 0,438`} className={t.stripe} />

      {/* Speed number printed along the band, from the recipe's dynamic range */}
      {dr && (
        <text
          x={numberX}
          y={numberY}
          textAnchor="end"
          transform={`rotate(${-angle} ${numberX} ${numberY})`}
          className="fill-paper"
        >
          <tspan className="font-mono" fontSize="20">DR </tspan>
          <tspan className="font-display font-bold" fontSize="72">{dr}</tspan>
        </text>
      )}

      {/* Spec lines + DX bars */}
      <text x="24" y="460" className={cn("font-mono tracking-frame uppercase", t.text)} fontSize="12">
        {recipe.filmSimulation} · {recipe.compatibility}
      </text>
      <text x="24" y="480" className={cn("font-mono tracking-frame uppercase", t.text)} fontSize="12">
        {[wb, exp && `EXP ${exp}`].filter(Boolean).join(" · ")}
      </text>
      <g transform={`translate(${W - 24 - bars.at(-1)!.x - bars.at(-1)!.w} 456)`}>
        {bars.map((bar) => (
          <rect key={bar.x} x={bar.x} width={bar.w} height="26" className={t.text} />
        ))}
      </g>
    </svg>
  );
}
