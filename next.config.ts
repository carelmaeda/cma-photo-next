import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tree-shake barrel imports so only the icons/primitives actually used ship
  // to the client (radix-ui's unified package is a large barrel; the cart sheet
  // + mobile nav pull it onto every page via the header).
  experimental: {
    optimizePackageImports: ["radix-ui", "lucide-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
