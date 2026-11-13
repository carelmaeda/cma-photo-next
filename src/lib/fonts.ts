import { Plus_Jakarta_Sans } from "next/font/google";

/**
 * The brand face (SPEC §3), loaded once and shared by both root layouts and
 * the global 404 document. The CSS variable is what globals.css @theme reads.
 * Since November 13, 2026 it is the only face: captions, eyebrows and data
 * labels are Jakarta in semibold small caps (Space Mono is gone).
 */
export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});
