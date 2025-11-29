/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  experimental: {
    optimizeCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 640, 1080, 1920],
  },
  poweredByHeader: false,
  swcMinify: true,
};

export default nextConfig;
