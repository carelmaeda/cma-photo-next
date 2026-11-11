"use client";

import { useState } from "react";
import { Check, Share } from "lucide-react";

/**
 * Icon button for the /links sheet header, like the share arrow on
 * Instagram's Links sheet. Native share sheet on phones; copies the URL
 * everywhere else.
 */
export function ShareButton({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function onClick() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
      } catch {
        // Dismissed the share sheet; nothing to do.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked; nothing sensible to fall back to.
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={copied ? "Link copied" : "Share this page"}
      className="flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
    >
      {copied ? (
        <Check className="size-5" aria-hidden />
      ) : (
        <Share className="size-5" aria-hidden />
      )}
      <span role="status" className="sr-only">
        {copied ? "Link copied" : ""}
      </span>
    </button>
  );
}
