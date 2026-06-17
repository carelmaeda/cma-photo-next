import type { Metadata } from "next";
import { eventCatalog, type EventDoc } from "@/lib/analytics-events";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Analytics Events Reference",
  description: "Internal reference for the GA4 events this site sends.",
  // Internal docs page — never index it or list it in the sitemap.
  robots: { index: false, follow: false },
};

const CATEGORY_ORDER: EventDoc["category"][] = [
  "Navigation",
  "Engagement",
  "Content",
  "Listings",
];

function StatusBadge({ status }: { status: EventDoc["status"] }) {
  const active = status === "active";
  return (
    <span
      className={`inline-block rounded-sm px-2 py-0.5 font-mono text-micro tracking-frame uppercase ${
        active ? "bg-success/15 text-success" : "bg-paper-2 text-warm"
      }`}
    >
      {active ? "Active" : "Ready · no UI yet"}
    </span>
  );
}

function EventCard({ event }: { event: EventDoc }) {
  return (
    <div className="border-t border-line py-6">
      <div className="flex flex-wrap items-center gap-3">
        <code className="rounded-sm bg-paper-2 px-2 py-1 font-mono text-sm text-ink">
          {event.name}
        </code>
        <StatusBadge status={event.status} />
      </div>

      <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-[8rem_1fr]">
        <dt className="font-mono text-cap tracking-frame text-warm uppercase">
          Trigger
        </dt>
        <dd className="text-ink-soft">{event.trigger}</dd>

        <dt className="font-mono text-cap tracking-frame text-warm uppercase">
          Where
        </dt>
        <dd className="text-ink-soft">{event.where}</dd>

        <dt className="font-mono text-cap tracking-frame text-warm uppercase">
          Parameters
        </dt>
        <dd className="text-ink-soft">
          {event.params.length === 0 ? (
            <span className="text-warm">— none —</span>
          ) : (
            <ul className="space-y-1">
              {event.params.map((p) => (
                <li key={p.key}>
                  <code className="font-mono text-ink">{p.key}</code>{" "}
                  <span className="text-warm">e.g. {p.example}</span>
                  {p.note ? (
                    <span className="text-warm"> — {p.note}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </dd>

        {event.notes ? (
          <>
            <dt className="font-mono text-cap tracking-frame text-warm uppercase">
              Notes
            </dt>
            <dd className="text-ink-soft">{event.notes}</dd>
          </>
        ) : null}
      </dl>
    </div>
  );
}

export default function AnalyticsEventsPage() {
  const gaLive =
    siteConfig.analytics.enabled &&
    !siteConfig.analytics.gaId.startsWith("TODO");

  return (
    <div className="px-gutter">
      <div className="mx-auto max-w-3xl py-12 md:py-16">
        <p className="eyebrow">Internal reference</p>
        <h1 className="text-h2 mt-2">GA4 Event Tracking</h1>
        <div className="mt-4 max-w-prose space-y-4 text-ink-soft">
          <p>
            Every custom event the site sends, generated from the registry in{" "}
            <code className="font-mono text-sm text-ink">
              src/lib/analytics-events.ts
            </code>{" "}
            — so this page can never drift from what actually fires. Events go
            through{" "}
            <code className="font-mono text-sm text-ink">track()</code> (
            <code className="font-mono text-sm text-ink">src/lib/analytics.ts</code>
            ), a safe wrapper over <code className="font-mono text-sm text-ink">@next/third-parties</code>.
          </p>
          <p>
            All names and parameters follow GA4 conventions: snake_case, ≤ 40
            chars, string values ≤ 100 chars. <code className="font-mono text-sm text-ink">search</code>{" "}
            uses GA4&apos;s reserved <code className="font-mono text-sm text-ink">search_term</code>{" "}
            param; depth tracking uses a custom{" "}
            <code className="font-mono text-sm text-ink">scroll_depth</code> so it
            doesn&apos;t collide with Enhanced Measurement&apos;s built-in 90%{" "}
            <code className="font-mono text-sm text-ink">scroll</code> event.
          </p>
          <p className="rounded-md border border-line bg-paper-2 p-4">
            {gaLive ? (
              <>
                <strong className="font-semibold text-ink">GA4 is live.</strong>{" "}
                Events are being sent to {siteConfig.analytics.gaId}.
              </>
            ) : (
              <>
                <strong className="font-semibold text-ink">
                  GA4 is not yet configured.
                </strong>{" "}
                Events no-op in production until the owner sets a real
                measurement ID and flips{" "}
                <code className="font-mono text-sm text-ink">
                  analytics.enabled
                </code>
                . During local development they log to the browser console (
                <code className="font-mono text-sm text-ink">[ga4] …</code>) so
                the wiring can be verified now.
              </>
            )}
          </p>
        </div>

        {CATEGORY_ORDER.map((category) => {
          const events = eventCatalog.filter((e) => e.category === category);
          if (events.length === 0) return null;
          return (
            <section key={category} className="mt-12">
              <h2 className="font-display text-xl font-semibold">{category}</h2>
              <div className="mt-2">
                {events.map((event) => (
                  <EventCard key={event.name} event={event} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
