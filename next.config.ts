import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint during `next build`
  },
  reactStrictMode: true,
  trailingSlash: true,
  cleanDistDir: true,
  compress: true,
  devIndicators: {
    position: "bottom-left",
  },
  experimental: {
    mdxRs: true,
    turbo: {
      rules: {
        // Configure Turbopack to handle SVGs
        "*.svg": ["@svgr/webpack"],
      },
    },
  },
  env: {
    //
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            native: true,
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
