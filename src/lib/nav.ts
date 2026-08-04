import { siteConfig } from "@/lib/siteConfig";

/**
 * Primary nav — flat IA (SPEC §2, launch-light per §10).
 * Canonical routes: header, footer, and sitemap use these exact paths.
 * Sections parked by siteConfig.features drop out of the nav here; the logo
 * also links home, and the cart icon (store only) sits after these links.
 */
export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/recipes", label: "Recipes" },
  ...(siteConfig.features.gallery ? [{ href: "/gallery", label: "Gallery" }] : []),
  ...(siteConfig.features.prints ? [{ href: "/prints", label: "Prints" }] : []),
  ...(siteConfig.features.store ? [{ href: "/downloads", label: "Downloads" }] : []),
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];
