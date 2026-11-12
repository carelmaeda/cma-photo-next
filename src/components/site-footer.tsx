import type { Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/siteConfig";
import { InstagramIcon, InstagramLink, ThreadsIcon } from "./instagram-link";

const small = "text-cap font-mono tracking-frame uppercase text-ink-soft";

/** Footer: Instagram + Threads, then the © line. The language toggle lives in the header. */
export function SiteFooter({ locale }: { locale: Locale }) {
  void locale;
  return (
    <footer className="px-gutter mt-section">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 py-8">
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
          <span>
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
        </p>
      </div>
    </footer>
  );
}
