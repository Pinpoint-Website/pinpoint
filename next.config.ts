import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gywxtuphgruwdnaubfag.supabase.co', // Hostname from your error message
        port: '',
        pathname: '/storage/v1/object/public/**', // Allows access to all public files in storage
      },
    ],
  },
};

export default nextConfig;
