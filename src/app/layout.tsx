// app/layout.tsx

import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import './styles/styles.scss';
import './styles/variables.scss';

// Import only Urbanist and Permanent Marker
import { Urbanist, Permanent_Marker } from 'next/font/google';
import Script from 'next/script'; // Import Script from next/script for external scripts

// Configure Urbanist
const urbanist = Urbanist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-urbanist', // CSS variable for easy use
});

// Configure Permanent Marker
const permanentMarker = Permanent_Marker({
  subsets: ['latin'],
  weight: '400', // Permanent Marker is typically only 400 weight
  display: 'swap',
  variable: '--font-permanent-marker', // CSS variable for easy use
});

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "A gallery to showcase photos from various locations.",
  openGraph: {
    title: "Photo Gallery",
    description: "Explore beautiful photos from around the world.",
    url: "https://www.yoursite.com", // Remember to change this to your actual site URL
    siteName: "Photo Gallery",
  },
  twitter: {
    card: "summary_large_image",
    title: "Photo Gallery",
    description: "Explore beautiful photos from around the world.",
    images: "/path/to/image.jpg", // Update this path to a relevant image for Twitter card
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Apply the font CSS variables to the <html> tag
    <html lang="en" className={`${urbanist.variable} ${permanentMarker.variable}`}>
      <body>
        <Navbar />
        {children}

        {/* Bootstrap JavaScript using next/script for optimal loading */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-ndDqU0Gzau9qJ1lfW4pNLlhNTkCfHzAVBReH9diLvGRem5+R9g2FzA8ZGN954O5Q"
          crossOrigin="anonymous"
          strategy="lazyOnload" // Load the script when the browser is idle
        />
      </body>
    </html>
  );
}