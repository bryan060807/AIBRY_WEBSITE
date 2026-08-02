/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  experimental: {
    optimizeCss: true,
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.aibrylabs.com" }],
        destination: "https://aibrylabs.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "aibry.shop" }],
        destination: "https://aibrylabs.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.aibry.shop" }],
        destination: "https://aibrylabs.com/:path*",
        permanent: true,
      },
      {
        source: "/merch",
        destination: "/store",
        permanent: true,
      },
    ];
  },

  // 🔧 Configure Next Image to handle Supabase avatars
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vuxfewsadivsbtuuulkn.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co", // wildcard safety for other envs
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 640, 1080, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60, // seconds
  },

  // 🚀 General optimizations
  poweredByHeader: false,
  swcMinify: true,

  // ✅ Future-proof environment safety
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://vuxfewsadivsbtuuulkn.supabase.co",
  },
};

export default nextConfig;
