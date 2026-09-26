import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',  // Required for Docker multi-stage build

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.qallcert.com',
        pathname: '/public-assets/**',
      },
      {
        protocol: 'http',
        hostname: 'api.qallcert.com',
        pathname: '/public-assets/**',
      },
      {
        protocol: 'http',
        hostname: process.env.MINIO_ENDPOINT || 'localhost',
        port: process.env.MINIO_PORT || '9000',
        pathname: '/public-assets/**',
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/:path*`,
      },
      {
        source: '/public-assets/:path*',
        destination: `http://${process.env.MINIO_ENDPOINT || 'minio'}:${process.env.MINIO_PORT || '9000'}/public-assets/:path*`,
      },
    ];
  },
};

export default nextConfig;

