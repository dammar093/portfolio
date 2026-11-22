import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000"
      },
      {
        protocol: "https",
        hostname: "www.dammarrana.com.np",
        port: "",
        pathname: "/uploads/**",
        search: "",
      }
    ]
  }
};

export default nextConfig;
