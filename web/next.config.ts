import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "cf.geekdo-images.com",
      "127.0.0.1",
      "tile.openstreetmap.org",
      "a.tile.openstreetmap.org",
      "b.tile.openstreetmap.org",
      "c.tile.openstreetmap.org",
      "unpkg.com",
    ],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
