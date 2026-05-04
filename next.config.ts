import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gywxtuphgruwdnaubfag.supabase.co', // Hostname used previously
        port: '',
        pathname: '/storage/v1/object/public/**', // Allows access to all public files in storage
      },
      {
        protocol: 'https',
        hostname: 'cbyqeghugyeljwbrchbq.supabase.co', // Additional Supabase project hostname (production)
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },
};

export default nextConfig;
