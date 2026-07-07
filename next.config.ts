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
};

export default nextConfig;
