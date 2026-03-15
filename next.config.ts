import type { NextConfig } from "next";

const nextConfig: any = {
  reactCompiler: false, // Disable to prevent conflicts with 3D render loop
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "@react-three/xr"],

  webpack: (config: any) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      three: require.resolve("three"),
    };
    return config;
  },

  turbopack: {},

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
