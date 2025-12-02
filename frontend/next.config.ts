// frontend/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "images.unsplash.com" },
            { hostname: "j3xkmzh2scw7vl7m.public.blob.vercel-storage.com" },
            { hostname: "lh3.googleusercontent.com" },
            { hostname: "avatars.githubusercontent.com" }
            // keep others only if you also use them:
            // { protocol: "https", hostname: "source.unsplash.com" },
            // { protocol: "https", hostname: "picsum.photos" },
        ],
    },
};

export default nextConfig;
