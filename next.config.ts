import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
      },
      typescript: {
    ignoreBuildErrors: true, // ✅ allow build even if TS errors exist
  },
};

export default nextConfig;
