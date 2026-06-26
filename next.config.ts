import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // iTunes / Apple Podcasts artwork (e.g. is1-ssl.mzstatic.com)
        protocol: "https",
        hostname: "**.mzstatic.com",
      },
    ],
  },
};

export default nextConfig;
