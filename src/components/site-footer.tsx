import { getAllGuides } from "@/lib/guides";
import { getDictionary, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/siteConfig";
import { InstagramIcon, InstagramLink, ThreadsIcon } from "./instagram-link";
import { LanguageSwitch } from "./language-switch";

const small = "text-cap font-mono tracking-frame uppercase text-ink-soft";

export function SiteFooter({ locale }: { locale: Locale }) {
  const { footer } = getDictionary(locale);
  const ptPostSlugs = getAllGuides("pt-br").map((guide) => guide.slug);

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
          <LanguageSwitch
            locale={locale}
            label={footer.switchLabel}
            ptPostSlugs={ptPostSlugs}
          />
          <span>
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
        </p>
      </div>
    </footer>
  );
}
