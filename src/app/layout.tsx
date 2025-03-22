import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./Navbar";  // Importing Navbar
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "A gallery to showcase photos from various locations.",
  openGraph: {
    title: "Photo Gallery",
    description: "Explore beautiful photos from around the world.",
    url: "https://www.yoursite.com",  // Add your site URL here
    siteName: "Photo Gallery",
  },
  twitter: {
    card: "summary_large_image",
    title: "Photo Gallery",
    description: "Explore beautiful photos from around the world.",
    images: "/path/to/image.jpg",  // Optional: Add an image for social sharing
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Optional: Add other head elements like favicon */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Navbar />  {/* Navbar will appear on every page */}
        {children}
      </body>
    </html>
  );
}
