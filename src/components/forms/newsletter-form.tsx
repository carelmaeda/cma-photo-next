"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/lib/siteConfig";

type Status = "idle" | "submitting" | "success" | "error";

interface NewsletterFormProps {
  /** Records which page captured the signup: "home" | "recipes" | "prints" */
  source: string;
  buttonLabel?: string;
  successTitle?: string;
  successBody?: string;
  /** Optional link revealed on success (e.g. the recipe settings page) */
  successHref?: string;
  successLinkLabel?: string;
  /** Lets a parent (e.g. the prints gate) react to a successful signup */
  onSuccess?: () => void;
}

/**
 * Netlify Forms signup. POSTs url-encoded to the static /__forms.html so
 * Netlify's form handling picks it up (SYNC RULE: fields must match that file).
 * Only works on Netlify deploys — locally it will hit the error state.
 */
export function NewsletterForm({
  source,
  buttonLabel = "Sign me up",
  successTitle = "Thanks — you're in.",
  successBody = "I send one email a month, mostly photos. Unsubscribe anytime.",
  successHref,
  successLinkLabel,
  onSuccess,
}: NewsletterFormProps) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const data = new FormData(event.currentTarget);
    try {
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(
          data as unknown as Record<string, string>
        ).toString(),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) onSuccess?.();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div aria-live="polite" className="max-w-md">
        <p className="font-display text-xl font-semibold">{successTitle}</p>
        <p className="mt-2 text-sm text-ink-soft">{successBody}</p>
        {successHref && successLinkLabel && (
          <Link
            href={successHref}
            className="mt-4 inline-block text-cap font-mono tracking-frame uppercase text-indigo hover:underline"
          >
            {successLinkLabel} →
          </Link>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <input type="hidden" name="form-name" value={siteConfig.forms.newsletter} />
      <input type="hidden" name="source" value={source} />
      <p hidden>
        <label>
          Don&apos;t fill this out: <input name="bot-field" />
        </label>
      </p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Label htmlFor={`email-${source}`} className="text-cap font-mono tracking-frame uppercase">
            Email
          </Label>
          <Input
            id={`email-${source}`}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="mt-2"
          />
        </div>
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : buttonLabel}
        </Button>
      </div>

      {status === "error" && (
        <p aria-live="polite" className="mt-3 text-sm text-ink-soft">
          That didn&apos;t go through. If it keeps happening, reach me on{" "}
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-indigo"
          >
            Instagram
          </a>
          .
        </p>
      )}
    </form>
  );
}
