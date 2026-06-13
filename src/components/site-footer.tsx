import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export function SiteFooter() {
  return (
    <footer className="px-gutter mt-section">
      <div className="mx-auto max-w-7xl border-t border-line py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <ul className="flex items-center gap-6">
            <li>
              <a
                href={siteConfig.instagram}
                rel="me noopener"
                target="_blank"
                className="text-cap font-mono tracking-frame uppercase hover:text-indigo"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={siteConfig.threads}
                rel="me noopener"
                target="_blank"
                className="text-cap font-mono tracking-frame uppercase hover:text-indigo"
              >
                Threads
              </a>
            </li>
            <li>
              <Link
                href="/prints"
                className="text-cap font-mono tracking-frame uppercase hover:text-indigo"
              >
                Prints
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-cap font-mono tracking-frame uppercase hover:text-indigo"
              >
                Contact
              </Link>
            </li>
          </ul>
          <p className="text-cap font-mono tracking-frame text-ink-muted uppercase">
            © {new Date().getFullYear()} {siteConfig.name} · Built by me
          </p>
        </div>
      </div>
    </footer>
  );
}
