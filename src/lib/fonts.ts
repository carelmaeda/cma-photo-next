import { Plus_Jakarta_Sans, Space_Mono } from "next/font/google";

/**
 * Brand faces (SPEC §3), loaded once and shared by both root layouts and the
 * global 404 document. The CSS variables are what globals.css @theme reads.
 */
export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

export const spaceMono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-mono",
  weight: ["400", "700"],
});
