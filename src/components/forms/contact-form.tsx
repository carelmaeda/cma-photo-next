"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/lib/siteConfig";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Contact form via Netlify Forms (SYNC RULE: fields must match
 * public/__forms.html). Works only on Netlify deploys.
 */
export function ContactForm() {
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
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div aria-live="polite">
        <p className="font-display text-xl font-semibold">Got it. Thanks.</p>
        <p className="mt-2 text-sm text-ink-muted">
          I read everything and reply when I can.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-5">
      <input type="hidden" name="form-name" value={siteConfig.forms.contact} />
      <p hidden>
        <label>
          Don&apos;t fill this out: <input name="bot-field" />
        </label>
      </p>

      <div>
        <Label htmlFor="contact-name" className="text-cap font-mono tracking-frame uppercase">
          Name
        </Label>
        <Input
          id="contact-name"
          name="name"
          required
          autoComplete="name"
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="contact-email" className="text-cap font-mono tracking-frame uppercase">
          Email
        </Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="contact-message" className="text-cap font-mono tracking-frame uppercase">
          Message
        </Label>
        <Textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className="mt-2"
        />
      </div>

      <div>
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send"}
        </Button>
      </div>

      {status === "error" && (
        <p aria-live="polite" className="text-sm text-ink-muted">
          That didn&apos;t go through. If it keeps happening, reach me on{" "}
          <a href={siteConfig.instagram} className="underline hover:text-indigo">
            Instagram
          </a>
          .
        </p>
      )}
    </form>
  );
}
