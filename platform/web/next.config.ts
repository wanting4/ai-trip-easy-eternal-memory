import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /** 避免服务端把 @supabase/supabase-js 打进 vendor chunk 后出现找不到模块的错误 */
  serverExternalPackages: ["@supabase/supabase-js"],
};

export default nextConfig;
