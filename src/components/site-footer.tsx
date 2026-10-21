import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { InstagramIcon, InstagramLink, ThreadsIcon } from "./instagram-link";

const small = "text-cap font-mono tracking-frame uppercase text-ink-soft";

export function SiteFooter() {
  return (
    <footer className="px-gutter mt-section">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 py-12">
        <ul data-ga-nav="footer" className="flex items-center gap-8">
          <li>
            <InstagramLink
              identity
              aria-label="Instagram"
              className="block text-ink transition-colors hover:text-indigo"
            >
              <InstagramIcon className="size-6" />
            </InstagramLink>
          </li>
          <li>
            <a
              href={siteConfig.threads}
              rel="me noopener"
              target="_blank"
              aria-label="Threads"
              className="block text-ink transition-colors hover:text-indigo"
            >
              <ThreadsIcon className="size-6" />
            </a>
          </li>
        </ul>
        <p className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-1 ${small}`}>
          <Link href="/privacy" className="hover:text-indigo">
            Privacy
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/terms" className="hover:text-indigo">
            Terms
          </Link>
          <span aria-hidden="true">·</span>
          <span>
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
        </p>
      </div>
    </footer>
  );
}
