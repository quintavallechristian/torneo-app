import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "cf.geekdo-images.com",
      "127.0.0.1",
      "supabase.test",
      "app.partitaapp.test",
      "tile.openstreetmap.org",
      "a.tile.openstreetmap.org",
      "b.tile.openstreetmap.org",
      "c.tile.openstreetmap.org",
      "unpkg.com",
    ],
  },
  allowedDevOrigins: ["app.partitaapp.test"],
};

export default nextConfig;
