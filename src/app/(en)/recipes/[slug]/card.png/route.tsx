import { ImageResponse } from "next/og";
import { summerScene, type SummerTone } from "@/components/recipe-cover";
import { getRecipe, recipes } from "@/content/recipes";
import { siteConfig } from "@/lib/siteConfig";

/**
 * /recipes/[slug]/card.png: the recipe as a 1080x1350 card (Instagram
 * portrait size) to save to the phone and pull up while setting the camera.
 * Built once at build time, served as a static PNG from the CDN, so the
 * download starts at once. (A dynamic version that rendered per request took
 * up to a minute on a cold Netlify function; never go back to that.)
 *
 * The card IS the recipe (SPEC §10, November 13, 2026): the setting values
 * appear only here, never on the page. Content-Disposition makes browsers
 * save it rather than show it in a tab. Downloads are counted by the click
 * beacon in TrackedDownload, not here.
 *
 * Satori renders inline styles only, so the brand tokens from globals.css are
 * mirrored here as hex. Keep them in sync if the palette changes.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

const c = {
  paper: "#FAFAF8",
  paper2: "#F5F5F3",
  ink: "#1A1925",
  inkSoft: "#3A3947",
  warm: "#696660",
  indigo: "#2E3A6E",
  line: "#E0DACD",
  summerSky: "#CFE7EC",
  summerSun: "#F5C451",
  summerSea: "#6FB3C4",
  summerSand: "#F3E2BF",
};

const summerHex: Record<SummerTone, string> = {
  sky: c.summerSky,
  sun: c.summerSun,
  sea: c.summerSea,
  sand: c.summerSand,
  paper: c.paper,
};

/** The summer scene as an svg data URI (Satori draws <img> svgs reliably). */
function summerSceneDataUri(): string {
  const shapes = summerScene
    .map(({ tag, tone, attrs }) => {
      const a = Object.entries(attrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(" ");
      return `<${tag} ${a} fill="${summerHex[tone]}"/>`;
    })
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${shapes}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/** Plus Jakarta Sans as TTF (Satori can't read woff2). Falls back to the built-in font. */
async function loadFont(weight: 400 | 700): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@${weight}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return new Response("Not found", { status: 404 });

  const [regular, bold] = await Promise.all([loadFont(400), loadFont(700)]);
  const fonts = [
    ...(regular ? [{ name: "Jakarta", data: regular, weight: 400 as const }] : []),
    ...(bold ? [{ name: "Jakarta", data: bold, weight: 700 as const }] : []),
  ];

  const initials = recipe.name
    .split(" ")
    .map((word) => word[0])
    .join("");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: c.paper,
          color: c.ink,
          padding: "56px 80px 48px",
          fontFamily: fonts.length ? "Jakarta" : undefined,
        }}
      >
        {/* Header: art, name, film sim, byline */}
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {recipe.thumbScene === "summer" ? (
            // eslint-disable-next-line @next/next/no-img-element -- Satori renders <img>, not next/image
            <img
              src={summerSceneDataUri()}
              width={200}
              height={200}
              alt=""
              style={{ borderRadius: 20 }}
            />
          ) : (
            <div
              style={{
                width: 200,
                height: 200,
                borderRadius: 20,
                background: recipe.coverTone === "ink" ? c.ink : c.paper2,
                color: recipe.coverTone === "ink" ? c.paper : c.ink,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 80,
                fontWeight: 700,
              }}
            >
              {initials}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, letterSpacing: 4, color: c.warm, textTransform: "uppercase" }}>
              Fujifilm recipe
            </div>
            <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, marginTop: 8 }}>
              {recipe.name}
            </div>
            <div style={{ fontSize: 30, color: c.inkSoft, marginTop: 12 }}>
              {`${recipe.filmSimulation} · ${recipe.compatibility}`}
            </div>
            <div style={{ fontSize: 30, color: c.indigo, fontWeight: 700, marginTop: 6 }}>
              by @carel011
            </div>
          </div>
        </div>

        {/* Settings */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 36, flexGrow: 1 }}>
          {recipe.settings.map((setting) => (
            <div
              key={setting.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: `2px solid ${c.line}`,
                padding: "8px 0",
                fontSize: 27,
              }}
            >
              <span>{setting.label}</span>
              <span style={{ color: c.inkSoft, fontWeight: 700 }}>{setting.value}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: c.warm,
            marginTop: 20,
          }}
        >
          <span>{`${new URL(siteConfig.url).host}/recipes/${recipe.slug}`}</span>
          <span>My Fujifilm Recipe </span>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1350,
      fonts: fonts.length ? fonts : undefined,
      headers: {
        "Content-Disposition": `attachment; filename="${recipe.slug}-fujifilm-recipe.png"`,
        "X-Robots-Tag": "noindex",
      },
    },
  );
}
