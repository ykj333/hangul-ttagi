import type { NextConfig } from "next";

const nextConfig: NextConfig = process.env.VERCEL ? {} : { turbopack: { root: process.cwd() } };
export default nextConfig;
