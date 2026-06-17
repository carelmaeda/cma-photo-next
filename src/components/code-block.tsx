"use client";

import { useRef, useState, type ComponentPropsWithoutRef } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { track } from "@/lib/analytics";
import { EVENTS } from "@/lib/analytics-events";

/**
 * MDX <pre> renderer for fenced code / settings blocks. Adds a copy-to-clipboard
 * button and reports a GA4 `copy_code_sample` event. Used for any ``` block in a
 * guide (e.g. Fujifilm recipe settings a reader wants to copy into their camera).
 */
export function CodeBlock(props: ComponentPropsWithoutRef<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = ref.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked (permissions/insecure context) — still record intent.
    }
    track(EVENTS.copyCodeSample, {
      snippet_length: text.length,
      page_path: window.location.pathname,
    });
  }

  return (
    <div className="group relative my-6">
      <pre
        ref={ref}
        className="overflow-x-auto rounded-md border border-line bg-paper-2 p-4 font-mono text-sm"
        {...props}
      />
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-sm border border-line-2 bg-paper px-2 py-1 font-mono text-micro tracking-frame text-ink-soft uppercase opacity-0 transition-opacity hover:text-indigo focus-visible:opacity-100 group-hover:opacity-100"
      >
        {copied ? (
          <>
            <CheckIcon className="size-3" /> Copied
          </>
        ) : (
          <>
            <CopyIcon className="size-3" /> Copy
          </>
        )}
      </button>
    </div>
  );
}
