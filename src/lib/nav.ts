/**
 * Primary nav — flat, four-job IA (SPEC §2).
 * Canonical routes: header, footer, and sitemap use these exact paths.
 * The logo also links home; the cart icon sits after these links.
 */
export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/prints", label: "Prints" },
  { href: "/downloads", label: "Downloads" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;
