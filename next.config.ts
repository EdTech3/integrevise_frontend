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
  experimental: {
    serverActions: {
      allowedOrigins: [
        'metrouni.localhost:3001',
        '192.168.10.117:3000'
      ]
    }
  }
};

export default nextConfig;
