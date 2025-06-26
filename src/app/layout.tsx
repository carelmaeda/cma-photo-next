import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New, Yomogi } from "next/font/google";
import Navbar from "./components/Navbar"; 
import './styles/styles.scss';
import './styles/variables.scss';


// Soft retro Japanese fonts
const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-primary",
});

const yomogi = Yomogi({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-secondary",
});

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "A gallery to showcase photos from various locations.",
  openGraph: {
    title: "Photo Gallery",
    description: "Explore beautiful photos from around the world.",
    url: "https://www.yoursite.com",
    siteName: "Photo Gallery",
  },
  twitter: {
    card: "summary_large_image",
    title: "Photo Gallery",
    description: "Explore beautiful photos from around the world.",
    images: "/path/to/image.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${zenKakuGothicNew.variable} ${yomogi.variable}`}>
      <head>
        {/* Preload fonts for better performance */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@300;400;500;700&family=Yomogi&display=swap"
          as="style"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@300;400;500;700&family=Yomogi&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}