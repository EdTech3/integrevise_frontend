import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.iran.liara.run',
      }
    ]
  },
  serverComponentsExternalPackages: ['pdf2json'],

};

export default nextConfig;
