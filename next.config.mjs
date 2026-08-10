function imageRemotePatternFromUrl(rawUrl) {
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);
    return {
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname,
      port: url.port || undefined,
      pathname: `${url.pathname.replace(/\/$/, "")}/**`,
    };
  } catch {
    return null;
  }
}

const garageMediaImagePattern = imageRemotePatternFromUrl(
  process.env.NEXT_PUBLIC_AIBRY_MEDIA_URL || process.env.AIBRY_MEDIA_PUBLIC_URL
);

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

  images: {
    remotePatterns: [
      ...(garageMediaImagePattern ? [garageMediaImagePattern] : []),
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 640, 1080, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60, // seconds
  },

  poweredByHeader: false,
  swcMinify: true,
};

export default nextConfig;
