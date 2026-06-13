import type { Metadata } from "next";
import Link from "next/link";
import { vanillaSummer } from "@/content/recipes";

export const metadata: Metadata = {
  title: "Vanilla Summer — the settings",
  description:
    "The full Vanilla Summer Fujifilm recipe — a Classic Chrome look for X-Trans IV and V bodies, every setting listed.",
};

export default function VanillaSummerPage() {
  return (
    <div className="px-gutter">
      <header className="mx-auto max-w-7xl py-12 md:py-16">
        <p className="text-cap font-mono tracking-frame text-ink-muted uppercase">
          The recipe
        </p>
        <h1 className="text-h2 mt-4">{vanillaSummer.name} — the settings</h1>
        <p className="mt-3 max-w-prose text-ink-muted">
          A {vanillaSummer.filmSimulation} look for {vanillaSummer.compatibility}{" "}
          bodies. Set it once, then forget the menus and go shoot.
        </p>
      </header>

      <section className="mx-auto max-w-3xl">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="py-3 pr-4 text-cap font-mono tracking-frame uppercase font-normal text-ink-muted">
                Setting
              </th>
              <th className="py-3 text-cap font-mono tracking-frame uppercase font-normal text-ink-muted">
                {vanillaSummer.compatibility}
              </th>
            </tr>
          </thead>
          <tbody>
            {vanillaSummer.settings.map((setting) => (
              <tr key={setting.label} className="border-b border-line">
                <td className="py-3 pr-4">{setting.label}</td>
                <td className="py-3 text-ink-muted">{setting.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-10 max-w-prose space-y-4 text-ink-muted">
          <h2 className="font-display text-xl font-semibold text-ink">
            Loading it
          </h2>
          <p>
            Save it as a custom slot (C1–C7) so it&apos;s one dial away — then
            you switch into the look without touching the menus again.
          </p>
          <p>
            Then stop thinking about it. The whole point is that the camera
            does the work and you watch the light.
          </p>
        </div>

        <div className="mt-12 border-t border-line pt-8">
          <Link
            href="/downloads"
            className="text-cap font-mono tracking-frame uppercase hover:text-indigo"
          >
            ← About Vanilla Summer
          </Link>
        </div>
      </section>
    </div>
  );
}
