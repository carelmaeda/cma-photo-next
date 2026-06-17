"use client";

import { useState } from "react";
import { DownloadIcon } from "lucide-react";
import { NewsletterForm } from "@/components/forms/newsletter-form";

interface PrintsGateProps {
  /** [title, downloadUrl] pairs — built server-side so this stays serializable */
  downloads: { title: string; url: string }[];
}

/**
 * Goodwill gate: the download list appears after a newsletter signup.
 * No real lock — that's by design (SPEC.md §5).
 */
export function PrintsGate({ downloads }: PrintsGateProps) {
  const [unlocked, setUnlocked] = useState(false);

  if (unlocked) {
    return (
      <div aria-live="polite">
        <p className="font-display text-xl font-semibold">They&apos;re yours.</p>
        <p className="mt-2 text-sm text-ink-soft">
          Full-resolution files, good up to A3. Print them, frame them, gift
          them — just don&apos;t sell them.
        </p>
        <ul className="mt-6 space-y-3">
          {downloads.map((download) => (
            <li key={download.url}>
              <a
                href={download.url}
                className="inline-flex items-center gap-2 text-cap font-mono tracking-frame uppercase text-indigo hover:underline"
              >
                <DownloadIcon className="size-4" />
                {download.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <NewsletterForm
      source="prints"
      buttonLabel="Open the downloads"
      onSuccess={() => setUnlocked(true)}
    />
  );
}
