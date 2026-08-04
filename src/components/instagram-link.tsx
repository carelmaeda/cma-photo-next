import type { ReactNode } from "react";
import { siteConfig } from "@/lib/siteConfig";

/**
 * lucide-react dropped its brand icons in v1, so the Instagram glyph is drawn
 * here using lucide's own geometry and stroke conventions.
 */
export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

type InstagramLinkProps = {
  children?: ReactNode;
  className?: string;
  /** Adds rel="me" — only for links that identify the profile as mine. */
  identity?: boolean;
  "aria-label"?: string;
  "data-ga-nav"?: string;
};

export function InstagramLink({
  children = "Instagram",
  className = "underline hover:text-indigo",
  identity = false,
  ...rest
}: InstagramLinkProps) {
  return (
    <a
      href={siteConfig.instagram}
      target="_blank"
      rel={identity ? "me noopener noreferrer" : "noopener noreferrer"}
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
}
