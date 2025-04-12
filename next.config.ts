import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  cleanDistDir: true,
  compress: true,
  devIndicators: {
    position: "bottom-left",
  },
  experimental: {
    mdxRs: true,
  },
  env: {
    //
  },
};

export default nextConfig;
