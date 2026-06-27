import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // iTunes / Apple Podcasts artwork
        protocol: "https",
        hostname: "**.mzstatic.com",
      },
      {
        // Anchor / Spotify podcast episode artwork (RSS feed)
        protocol: "https",
        hostname: "**.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
