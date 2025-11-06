// frontend/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // keep others only if you also use them:
      // { protocol: "https", hostname: "source.unsplash.com" },
      // { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
