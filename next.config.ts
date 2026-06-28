import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow higher-quality optimized output (Next 16 requires whitelisting)
    qualities: [75, 90],
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
      {
        // Supabase Storage — product images uploaded via admin panel
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
