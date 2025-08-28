import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  serverExternalPackages: ['@supabase/supabase-js'],
  trailingSlash: false,
  compiler: {
    removeConsole: false,
  },
};

export default nextConfig;
