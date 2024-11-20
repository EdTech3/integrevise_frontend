import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
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
        '192.168.10.117:3000',
        'https://integrevise.netlify.app/'
      ]
    }
  }
};

export default nextConfig;
