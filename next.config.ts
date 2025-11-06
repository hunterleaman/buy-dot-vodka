import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      // add others only if currently used
      // { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  reactCompiler: false,
};

export default nextConfig;
