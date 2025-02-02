import type { NextConfig } from "next";
import { env } from "process";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.UPLOADTHING_APP_ID+".ufs.sh",
        pathname: "/f/*",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
