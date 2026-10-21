import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tree-shake barrel imports so only the icons/primitives actually used ship
  // to the client (radix-ui's unified package is a large barrel; the cart sheet
  // + mobile nav pull it onto every page via the header).
  experimental: {
    optimizePackageImports: ["radix-ui", "lucide-react"],
  },
  // No images.remotePatterns: every Cloudinary image goes through CldImage's
  // custom loader, which bypasses the optimizer's remote allow-list entirely.
  // A remote image added without a loader will fail loudly — that's intended.
  //
  // Every srcset width is a separate on-the-fly Cloudinary transformation, and
  // each one is slow (0.7 to 2.5s) the first time it's requested. The default
  // ladder offers up to 16 widths per photo; this keeps 8, so far fewer cold
  // renders and a much better CDN hit rate. 2048 covers a full-screen photo on
  // a retina laptop.
  images: {
    deviceSizes: [640, 828, 1080, 1600, 2048],
    imageSizes: [128, 256, 384],
  },

  // Security headers live here, not (only) in netlify.toml — Netlify's Next
  // runtime serves pages through a function, and netlify.toml [[headers]]
  // apply only to plain static CDN assets (verified on the live site).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
